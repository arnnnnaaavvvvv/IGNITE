import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Auth,
} from 'firebase/auth';

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCDf6EKT6np-1V0h8FSElhcP2bVQT3uV1o',
  authDomain: 'ignite-f7c25.firebaseapp.com',
  projectId: 'ignite-f7c25',
  storageBucket: 'ignite-f7c25.firebasestorage.app',
  messagingSenderId: '790007897163',
  appId: '1:790007897163:web:dcf2c44a68cbebb71481ce',
  measurementId: 'G-0DTR1EH1PB',
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || DEFAULT_FIREBASE_CONFIG.measurementId,
};

// Resilient initialization: do not crash the bundle if Firebase fails
let initializedApp: FirebaseApp | null = null;
let initializedAuth: Auth | null = null;
let isFirebaseAvailable = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    initializedApp = !getApps().length
      ? initializeApp(firebaseConfig)
      : getApp();
    initializedAuth = getAuth(initializedApp);
    isFirebaseAvailable = true;
  } else {
    console.warn('[Firebase] API key not found. Operating in resilient guest mode.');
  }
} catch (err) {
  console.warn('[Firebase] Initialization error (falling back to guest/offline mode):', err);
}

export const firebaseApp = initializedApp as FirebaseApp;
export const auth = initializedAuth as Auth;
export { isFirebaseAvailable };

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Translates Firebase auth error codes to user-friendly messages.
 */
export function getFriendlyAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account registered with this email. Try signing up instead.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please verify and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completion. Please try again.';
    case 'auth/popup-blocked':
      return 'Google popup was blocked by browser. Please allow popups for this site.';
    case 'auth/operation-not-allowed':
      return 'Google Sign-In is not enabled yet in Firebase Console. Go to Authentication > Sign-in method and enable Google provider.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Console. Please add it in Firebase Console > Authentication > Settings > Authorized domains.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connectivity.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Access temporarily restricted. Try again later.';
    default:
      return error?.message || 'Authentication error occurred. Please try again.';
  }
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type FirebaseUser,
};
