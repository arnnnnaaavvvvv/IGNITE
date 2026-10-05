import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Compass,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { IgniteLogo } from '../Common/IgniteLogo';
import { t } from '../../services/i18n';

interface AuthModalProps {
  language?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ language = 'en' }) => {
  const {
    isAuthModalOpen,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    loginAsGuest,
    sendPasswordReset,
    error,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Clear inputs when opening/switching modes
  useEffect(() => {
    if (isAuthModalOpen) {
      setLocalError(null);
      setResetSent(false);
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (authModalMode === 'forgot') {
      if (!email || !email.includes('@')) {
        setLocalError(language === 'hi' ? 'कृपया एक मान्य ईमेल दर्ज करें।' : 'Please enter a valid email address.');
        return;
      }
      setIsSubmitting(true);
      try {
        await sendPasswordReset(email);
        setResetSent(true);
      } catch (err: any) {
        setLocalError(err.message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!email || !email.includes('@')) {
      setLocalError(language === 'hi' ? 'कृपया एक मान्य ईमेल दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setLocalError(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters long.');
      return;
    }

    if (authModalMode === 'signup') {
      if (!name.trim()) {
        setLocalError(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError(language === 'hi' ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (authModalMode === 'signin') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, name);
      }
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLocalError(null);
    clearError();
    setIsSubmitting(true);
    try {
      await loginAsGuest('Guest Tourist');
    } catch (err: any) {
      setLocalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[#07141F] border border-[#1E3440] shadow-2xl p-6 sm:p-8 overflow-hidden text-[#F1F5F9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F1F5F9] p-1.5 rounded-lg hover:bg-[#1E3440]/60 transition-colors cursor-pointer"
          aria-label="Close auth dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-2">
            <IgniteLogo size="lg" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            {authModalMode === 'signin' && t('auth_signin', language)}
            {authModalMode === 'signup' && t('auth_signup', language)}
            {authModalMode === 'forgot' && t('auth_forgot', language)}
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-xs">
            {authModalMode === 'signin' && (language === 'hi' ? 'सुरक्षित यात्रा योजना और आपातकालीन अलर्ट सिंक के लिए साइन इन करें' : 'Sign in to sync your verified itineraries & rescue alerts')}
            {authModalMode === 'signup' && (language === 'hi' ? 'अखिल भारतीय स्मार्ट ट्रेकिंग नेटवर्क से जुड़ें' : 'Join India’s multi-region tourist safety and smart route network')}
            {authModalMode === 'forgot' && (language === 'hi' ? 'पासवर्ड रीसेट लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें' : 'Enter your registered email to receive recovery instructions')}
          </p>
        </div>

        {/* Mode Selector Tabs (Sign In / Register) */}
        {authModalMode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 mb-5 bg-[#0D202B] rounded-xl border border-[#1E3440]">
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'signin'
                  ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              {t('auth_signin', language)}
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                authModalMode === 'signup'
                  ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              {t('auth_signup', language)}
            </button>
          </div>
        )}

        {/* Error Alert Banner */}
        {displayError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{displayError}</div>
            <button
              onClick={() => {
                setLocalError(null);
                clearError();
              }}
              className="text-red-400 hover:text-red-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Password Reset Sent Success */}
        {resetSent && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              {t('auth_reset_sent', language)}
            </div>
          </div>
        )}

        {/* 1-Click Social Sign-in Buttons */}
        {authModalMode !== 'forgot' && (
          <div className="space-y-2.5 mb-5">
            {/* Google Authentication */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-[#0D202B] hover:bg-[#142B3A] border border-[#1E3440] hover:border-slate-500 text-sm font-medium text-slate-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
            >
              {/* Google Brand SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{t('auth_google_continue', language)}</span>
            </button>

            {/* Quick Guest Explorer Mode */}
            <button
              type="button"
              onClick={handleGuestSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 py-2 px-4 rounded-xl bg-transparent hover:bg-[#1E3440]/30 border border-[#1E3440]/60 text-xs font-medium text-[#94A3B8] hover:text-[#34D399] transition-all cursor-pointer disabled:opacity-50"
            >
              <Compass className="w-3.5 h-3.5 text-[#34D399]" />
              <span>{t('auth_guest_continue', language)}</span>
            </button>
          </div>
        )}

        {authModalMode !== 'forgot' && (
          <div className="relative flex items-center justify-center mb-5">
            <div className="border-t border-[#1E3440] w-full" />
            <span className="bg-[#07141F] px-3 text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider shrink-0">
              {language === 'hi' ? 'या ईमेल से' : 'or email'}
            </span>
            <div className="border-t border-[#1E3440] w-full" />
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('auth_name', language)}
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0D202B] border border-[#1E3440] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {t('auth_email', language)}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#94A3B8]" />
              <input
                type="email"
                required
                placeholder="tourist@safetrail.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#0D202B] border border-[#1E3440] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  {t('auth_password', language)}
                </label>
                {authModalMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot')}
                    className="text-[11px] text-[#34D399] hover:underline cursor-pointer"
                  >
                    {t('auth_forgot', language)}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0D202B] border border-[#1E3440] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#94A3B8] hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {authModalMode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('auth_confirm_password', language)}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#0D202B] border border-[#1E3440] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-tactile w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#07141F] font-bold text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#07141F]" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-[#07141F]" />
            )}
            <span>
              {authModalMode === 'signin' && t('auth_signin', language)}
              {authModalMode === 'signup' && t('auth_signup', language)}
              {authModalMode === 'forgot' && t('auth_reset_link', language)}
            </span>
          </button>
        </form>

        {/* Switch Mode Footer Links */}
        <div className="mt-5 text-center text-xs text-[#94A3B8]">
          {authModalMode === 'signin' && (
            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className="text-[#34D399] hover:underline font-medium cursor-pointer"
            >
              {t('auth_need_account', language)}
            </button>
          )}

          {authModalMode === 'signup' && (
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="text-[#34D399] hover:underline font-medium cursor-pointer"
            >
              {t('auth_already_have_account', language)}
            </button>
          )}

          {authModalMode === 'forgot' && (
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="text-[#34D399] hover:underline font-medium cursor-pointer"
            >
              {t('auth_back_to_signin', language)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
