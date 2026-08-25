import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from 'firebase/auth';

export interface FirebaseTouristProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  phone?: string;
  bloodGroup?: string;
  isGuest?: boolean;
  token?: string;
}

// User-provided Firebase Production Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCDf6EKT6np-lV0h8FSElhcP2bVQT3uV1o',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ignite-f7c25.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ignite-f7c25',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ignite-f7c25.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '790007897163',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:790007897163:web:dcf2c44a68cbebb71481ce',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-0DTR1EH1PB',
};

export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 5 &&
  !firebaseConfig.apiKey.includes('YOUR_') &&
  firebaseConfig.authDomain
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.warn('Firebase initialization notice:', error);
  }
}

export const FirebaseAuthService = {
  isConfigured(): boolean {
    return isFirebaseConfigured && !!auth;
  },

  getAuth(): Auth | null {
    return auth;
  },

  async signInWithGoogle(): Promise<FirebaseTouristProfile> {
    if (!auth || !googleProvider) {
      throw new Error(
        'Firebase is not initialized. Please verify your internet connectivity.'
      );
    }

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();

    return {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Google User',
      email: user.email || '',
      photoURL: user.photoURL,
      isGuest: false,
      token,
    };
  },

  async signInWithEmail(email: string, pass: string): Promise<FirebaseTouristProfile> {
    if (!auth) {
      throw new Error(
        'Firebase is not initialized. Please verify your internet connectivity.'
      );
    }

    const result = await signInWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    const token = await user.getIdToken();

    return {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Tourist User',
      email: user.email || email,
      photoURL: user.photoURL,
      isGuest: false,
      token,
    };
  },

  async signUpWithEmail(email: string, pass: string, displayName: string): Promise<FirebaseTouristProfile> {
    if (!auth) {
      throw new Error(
        'Firebase is not initialized. Please verify your internet connectivity.'
      );
    }

    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;

    if (displayName) {
      try {
        await updateProfile(user, { displayName });
      } catch (err) {
        console.warn('Profile name update skipped:', err);
      }
    }

    const token = await user.getIdToken();

    return {
      uid: user.uid,
      name: displayName || user.email?.split('@')[0] || 'Tourist User',
      email: user.email || email,
      photoURL: user.photoURL,
      isGuest: false,
      token,
    };
  },

  async signOut(): Promise<void> {
    if (auth) {
      await fbSignOut(auth);
    }
  },

  onAuthStateChange(callback: (profile: FirebaseTouristProfile | null) => void): () => void {
    if (!auth) {
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const token = await user.getIdToken().catch(() => '');
        callback({
          uid: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Tourist User',
          email: user.email || '',
          photoURL: user.photoURL,
          isGuest: false,
          token,
        });
      } else {
        callback(null);
      }
    });
  },
};
