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
  type Auth
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

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ignite',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
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
    console.warn('Firebase initialization error:', error);
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
        'Firebase is not configured yet. Please add your Firebase Web App credentials to .env (see .env.example).'
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
        'Firebase is not configured yet. Please add your Firebase Web App credentials to .env (see .env.example).'
      );
    }

    const result = await signInWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    const token = await user.getIdToken();

    return {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Tourist User',
      email: user.email || '',
      photoURL: user.photoURL,
      isGuest: false,
      token,
    };
  },

  async signUpWithEmail(email: string, pass: string, displayName: string): Promise<FirebaseTouristProfile> {
    if (!auth) {
      throw new Error(
        'Firebase is not configured yet. Please add your Firebase Web App credentials to .env (see .env.example).'
      );
    }

    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    const token = await user.getIdToken();

    return {
      uid: user.uid,
      name: displayName || user.email?.split('@')[0] || 'Tourist User',
      email: user.email || '',
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

  onAuthStateChange(callback: (user: FirebaseTouristProfile | null) => void): () => void {
    if (!auth) {
      return () => {};
    }

    return onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          callback({
            uid: user.uid,
            name: user.displayName || user.email?.split('@')[0] || 'Tourist User',
            email: user.email || '',
            photoURL: user.photoURL,
            isGuest: false,
            token,
          });
        } catch {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },
};
