import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Phone,
  CheckCircle2,
  X,
  Mail,
  Lock,
  LogIn,
  UserPlus,
  AlertCircle,
  Info,
  LogOut,
} from 'lucide-react';
import { OfflineCacheService } from '../../services/offlineCache';
import { FirebaseAuthService, isFirebaseConfigured, type FirebaseTouristProfile } from '../../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: FirebaseTouristProfile | null;
  onUserLogin: (user: FirebaseTouristProfile | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserLogin,
}) => {
  const [authMode, setAuthMode] = useState<'google' | 'email_signin' | 'email_signup' | 'guest'>('google');
  
  // Email Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Guest & Emergency Pass State
  const [phone, setPhone] = useState('+91 98765 43210');
  const [fullName, setFullName] = useState('Tourist Traveler');
  const [bloodGroup, setBloodGroup] = useState('O+ Positive');

  // Status & Error States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const profile = await FirebaseAuthService.signInWithGoogle();
      profile.bloodGroup = bloodGroup;
      OfflineCacheService.saveUserSession(profile);
      onUserLogin(profile);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setErrorMsg(err.message || 'Google Sign-In failed. Please try again or check Firebase configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Email Sign-In / Sign-Up Handler
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      let profile: FirebaseTouristProfile;
      if (authMode === 'email_signup') {
        profile = await FirebaseAuthService.signUpWithEmail(email, password, displayName);
      } else {
        profile = await FirebaseAuthService.signInWithEmail(email, password);
      }

      profile.bloodGroup = bloodGroup;
      OfflineCacheService.saveUserSession(profile);
      onUserLogin(profile);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Email Auth error:', err);
      let message = err.message || 'Authentication failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = 'Invalid email or password. Please check your credentials.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      }
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Guest / Offline Pass Submit Handler
  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/auth/guest-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.replace(/\s+/g, ''),
          name: fullName,
        }),
      });
      const data = await res.json();
      const userProfile: FirebaseTouristProfile = {
        uid: data.user.uid,
        name: data.user.name,
        phone: data.user.phone,
        email: 'guest@safetrail.gov.in',
        bloodGroup,
        token: data.access_token,
        isGuest: true,
      };

      OfflineCacheService.saveUserSession(userProfile);
      onUserLogin(userProfile);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Authentication error:', err);
      setErrorMsg('Failed to create guest session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Sign Out Handler
  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      await FirebaseAuthService.signOut();
      OfflineCacheService.clearUserSession?.();
      onUserLogin(null);
      onClose();
    } catch (err) {
      console.error('Sign-out error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-700 shadow-2xl relative bg-slate-900/95 animate-in fade-in zoom-in duration-200 max-h-[94vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 sm:pb-4 mb-4 border-b border-slate-800 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white">Tourist Safety & Identity Hub</h2>
            <p className="text-xs text-slate-400">Firebase Auth (Google & Email) • 2G Offline Emergency Pass</p>
          </div>
        </div>

        {/* Current Logged In Profile Card */}
        {currentUser && !isSuccess ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.name}
                      className="w-11 h-11 rounded-full border-2 border-emerald-400 object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 font-bold text-base">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{currentUser.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                        {currentUser.isGuest ? 'GUEST PASS' : 'VERIFIED FIREBASE'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{currentUser.email || 'Offline Guest Session'}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">Emergency Blood Group</span>
                  <span className="font-mono font-bold text-slate-200">{currentUser.bloodGroup || 'O+ Positive'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">Encrypted Token ID</span>
                  <span className="font-mono text-emerald-400 text-[10px] truncate block">
                    {currentUser.uid.substring(0, 16)}...
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/60 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="p-6 text-center space-y-2.5">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-sm font-bold text-white">Authentication Verified &amp; Cached</div>
            <p className="text-xs text-slate-400">
              Your identity credentials and emergency triage metadata are secured locally for online &amp; 2G offline modes.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-slate-950/90 rounded-2xl border border-slate-800 gap-1 text-xs">
              <button
                type="button"
                onClick={() => { setAuthMode('google'); setErrorMsg(null); }}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'google'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('email_signin'); setErrorMsg(null); }}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'email_signin' || authMode === 'email_signup'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Email &amp; Password</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('guest'); setErrorMsg(null); }}
                className={`flex-1 py-2 px-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'guest'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Guest / 2G Pass</span>
              </button>
            </div>

            {/* Firebase Config Notice Banner if not yet configured */}
            {!isFirebaseConfigured && authMode !== 'guest' && (
              <div className="p-3.5 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Connect Your Firebase Web App Config</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  To enable live Google &amp; Email login, copy your Web App configuration keys into{' '}
                  <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded font-mono">apps/web/.env</code>.
                </p>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  VITE_FIREBASE_API_KEY=...<br />
                  VITE_FIREBASE_AUTH_DOMAIN=...
                </div>
              </div>
            )}

            {/* Error Message Box */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-[11px]">{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: GOOGLE SIGN-IN */}
            {authMode === 'google' && (
              <div className="space-y-4 pt-1">
                <div className="text-xs text-slate-300 leading-relaxed text-center px-4">
                  Authenticate securely using your Google account to unlock cloud route synchronization and official emergency medical profiles.
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer transform active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isSubmitting ? 'Signing In with Google...' : 'Continue with Google'}</span>
                </button>
              </div>
            )}

            {/* TAB 2: EMAIL & PASSWORD */}
            {(authMode === 'email_signin' || authMode === 'email_signup') && (
              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                {authMode === 'email_signup' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Ramesh Sharma"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tourist@domain.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : authMode === 'email_signup' ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Firebase Tourist Account</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In with Email</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  {authMode === 'email_signin' ? (
                    <button
                      type="button"
                      onClick={() => { setAuthMode('email_signup'); setErrorMsg(null); }}
                      className="text-xs text-slate-400 hover:text-emerald-300 transition-colors"
                    >
                      Don&apos;t have an account? <strong className="text-emerald-400 underline">Sign Up</strong>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setAuthMode('email_signin'); setErrorMsg(null); }}
                      className="text-xs text-slate-400 hover:text-emerald-300 transition-colors"
                    >
                      Already have an account? <strong className="text-emerald-400 underline">Sign In</strong>
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* TAB 3: GUEST / EMERGENCY PASS */}
            {authMode === 'guest' && (
              <form onSubmit={handleGuestSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mobile Phone (for Emergency SOS SMS)</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Emergency Blood Group (for Triage Dispatch)
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option>O+ Positive</option>
                    <option>O- Negative</option>
                    <option>A+ Positive</option>
                    <option>A- Negative</option>
                    <option>B+ Positive</option>
                    <option>B- Negative</option>
                    <option>AB+ Positive</option>
                    <option>AB- Negative</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? 'Verifying...' : 'Save & Sync Offline 2G Safety Profile'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
