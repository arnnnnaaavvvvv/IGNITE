import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  getFriendlyAuthErrorMessage,
  type FirebaseUser,
} from '../services/firebase';
import { OfflineCacheService } from '../services/offlineCache';
import type { AuthUser, AuthModalMode, UserEmergencyProfile } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  isProfileModalOpen: boolean;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  clearError: () => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: (guestName?: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateEmergencyProfile: (profile: UserEmergencyProfile) => void;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const EMERGENCY_PROFILE_PREFIX = 'ignite_emergency_';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('signin');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load saved emergency profile for user
  const loadSavedEmergencyProfile = (uid: string): UserEmergencyProfile | undefined => {
    try {
      const raw = localStorage.getItem(`${EMERGENCY_PROFILE_PREFIX}${uid}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return undefined;
  };

  // Sync user profile to backend & offline cache
  const syncUserSession = useCallback(async (authUser: AuthUser | null) => {
    if (!authUser) {
      OfflineCacheService.clearUserSession();
      return;
    }

    // Save to local offline cache
    OfflineCacheService.saveUserSession({
      uid: authUser.uid,
      name: authUser.displayName || (authUser.isAnonymous ? 'Guest Explorer' : 'Verified Tourist'),
      email: authUser.email,
      phone: authUser.phoneNumber || authUser.emergencyProfile?.emergencyContactPhone || '',
      bloodGroup: authUser.emergencyProfile?.bloodGroup || '',
      is_guest: authUser.isAnonymous,
    });

    // Sync with backend API
    try {
      if (authUser.idToken) {
        await fetch('/api/v1/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authUser.idToken}`,
          },
        });
      }
    } catch (e) {
      // Backend sync error should not block UI
      console.warn('[AuthContext] Backend sync notice:', e);
    }
  }, []);

  // Map FirebaseUser to AuthUser
  const mapFirebaseUser = useCallback(async (fbUser: FirebaseUser): Promise<AuthUser> => {
    const idToken = await fbUser.getIdToken();
    const emergency = loadSavedEmergencyProfile(fbUser.uid);
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || (fbUser.isAnonymous ? 'Guest Explorer' : null),
      photoURL: fbUser.photoURL,
      phoneNumber: fbUser.phoneNumber,
      isAnonymous: fbUser.isAnonymous,
      emailVerified: fbUser.emailVerified,
      providerId: fbUser.providerData?.[0]?.providerId || (fbUser.isAnonymous ? 'anonymous' : 'firebase'),
      idToken,
      emergencyProfile: emergency,
    };
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      try {
        if (fbUser) {
          const authUser = await mapFirebaseUser(fbUser);
          setUser(authUser);
          await syncUserSession(authUser);
        } else {
          setUser(null);
          await syncUserSession(null);
        }
      } catch (err: any) {
        console.error('[AuthContext] onAuthStateChanged error:', err);
        setError(getFriendlyAuthErrorMessage(err));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [mapFirebaseUser, syncUserSession]);

  const clearError = () => setError(null);

  const openAuthModal = (mode: AuthModalMode = 'signin') => {
    setAuthModalMode(mode);
    setError(null);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setError(null);
  };

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  // Email / Password Login
  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const authUser = await mapFirebaseUser(cred.user);
      setUser(authUser);
      await syncUserSession(authUser);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      const msg = getFriendlyAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Email / Password Registration
  const registerWithEmail = async (email: string, password: string, displayName: string) => {
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (displayName.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }
      const authUser = await mapFirebaseUser(cred.user);
      setUser(authUser);
      await syncUserSession(authUser);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      const msg = getFriendlyAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google 1-Click Login
  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const authUser = await mapFirebaseUser(cred.user);
      setUser(authUser);
      await syncUserSession(authUser);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      // Don't show error if user deliberately closed popup
      if (err?.code === 'auth/popup-closed-by-user') {
        setLoading(false);
        return;
      }
      const msg = getFriendlyAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Anonymous Guest Mode
  const loginAsGuest = async (guestName?: string) => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInAnonymously(auth);
      const name = guestName || 'Guest Explorer';
      await updateProfile(cred.user, { displayName: name });
      const authUser = await mapFirebaseUser(cred.user);
      authUser.displayName = name;
      setUser(authUser);
      await syncUserSession(authUser);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      // Fallback to local guest mode if anonymous auth is not enabled in Firebase
      console.warn('[AuthContext] Firebase anonymous auth warning, falling back to local guest:', err);
      const localGuest: AuthUser = {
        uid: `guest_${Date.now()}`,
        email: null,
        displayName: guestName || 'Guest Explorer',
        photoURL: null,
        isAnonymous: true,
        emailVerified: false,
        providerId: 'guest',
        idToken: `guest_${Date.now()}`,
      };
      setUser(localGuest);
      await syncUserSession(localGuest);
      setIsAuthModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      await syncUserSession(null);
      setIsProfileModalOpen(false);
    } catch (err: any) {
      console.error('[AuthContext] Logout error:', err);
      setUser(null);
      await syncUserSession(null);
    } finally {
      setLoading(false);
    }
  };

  // Password Reset
  const sendPasswordReset = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      const msg = getFriendlyAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  // Update Emergency Profile
  const updateEmergencyProfile = (profile: UserEmergencyProfile) => {
    if (!user) return;
    try {
      localStorage.setItem(`${EMERGENCY_PROFILE_PREFIX}${user.uid}`, JSON.stringify(profile));
      const updatedUser = {
        ...user,
        emergencyProfile: profile,
      };
      setUser(updatedUser);
      syncUserSession(updatedUser);
    } catch (e) {
      console.warn('[AuthContext] Could not save emergency profile:', e);
    }
  };

  // Update Profile Name / Avatar
  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName.trim(),
        photoURL: photoURL || auth.currentUser.photoURL,
      });
      const updated = await mapFirebaseUser(auth.currentUser);
      setUser(updated);
      syncUserSession(updated);
    } catch (err: any) {
      const msg = getFriendlyAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  // Get freshest ID Token
  const getIdToken = async (forceRefresh: boolean = false): Promise<string | null> => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(forceRefresh);
    }
    return user?.idToken || null;
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthModalOpen,
    authModalMode,
    isProfileModalOpen,
    openAuthModal,
    closeAuthModal,
    openProfileModal,
    closeProfileModal,
    clearError,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginAsGuest,
    logout,
    sendPasswordReset,
    updateEmergencyProfile,
    updateUserProfile,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
