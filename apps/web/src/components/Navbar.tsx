import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  Compass,
  Activity,
  Radio,
  Users,
  LogIn,
  User,
  ChevronDown,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { IgniteLogo } from './Common/IgniteLogo';
import { t } from '../services/i18n';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'overview' | 'map' | 'itinerary' | 'explainability' | 'simulation' | 'group';
  setActiveTab: (tab: 'overview' | 'map' | 'itinerary' | 'explainability' | 'simulation' | 'group') => void;
  language: string;
  setLanguage: (lang: string) => void;
  onOpenSOS: () => void;
  isSimulatingHazard?: boolean;
  isWebSocketConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenSOS,
  isSimulatingHazard = false,
}) => {
  const { user, openAuthModal, openProfileModal, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = [
    { id: 'overview', label: t('nav_overview', language), shortLabel: language === 'hi' ? 'होम' : 'Home', icon: Activity },
    { id: 'map', label: t('nav_map', language), shortLabel: language === 'hi' ? 'नक्शा' : 'Map', icon: Compass },
    { id: 'simulation', label: t('nav_simulation', language), shortLabel: language === 'hi' ? 'अपडेट्स' : 'Updates', icon: Radio },
    { id: 'group', label: t('nav_group', language), shortLabel: language === 'hi' ? 'समूह' : 'Group', icon: Users },
  ];

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('ignite_lang', newLang);
    } catch {
      // ignore
    }
  };

  const getInitials = () => {
    if (!user) return '';
    if (user.displayName) {
      const parts = user.displayName.split(' ');
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'GT';
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#1E3440] bg-[#07141F]/90 backdrop-blur-[16px] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand & Logo */}
          <button 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 shrink-0 cursor-pointer text-left bg-transparent border-0 p-0 group"
          >
            <IgniteLogo size="md" />

            <div className="flex items-center gap-2.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-[#F1F5F9] group-hover:text-[#34D399] transition-colors font-sans">
                IGNITE
              </span>
            </div>
          </button>

          {/* Desktop Center Tabs Navigation - Always visible on desktop across all views */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#0D202B]/80 p-1.5 rounded-xl border border-[#1E3440] shadow-lg backdrop-blur-md">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`btn-tactile flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold cursor-pointer relative transition-all ${
                    isActive
                      ? 'bg-[#10B981]/15 text-[#34D399] font-bold shadow-md ring-1 ring-[#10B981]/40 border border-[#10B981]/30'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E3440]/50'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.id === 'simulation' && isSimulatingHazard && (
                    <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Lang Switcher, Firebase Auth, and SOS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* High-Precision Segmented Language Switcher */}
            <div className="flex items-center bg-[#0D202B] border border-[#1E3440] rounded-xl p-1 text-xs sm:text-sm shadow-sm">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                aria-label="Switch to English"
                className={`btn-tactile px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold cursor-pointer transition-all ${
                  language === 'en'
                    ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                aria-label="हिंदी में बदलें"
                className={`btn-tactile px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold cursor-pointer transition-all ${
                  language === 'hi'
                    ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                HI
              </button>
            </div>

            {/* Firebase Authentication Status & Profile Control */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="btn-tactile flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#0D202B] hover:bg-[#142B3A] border border-[#1E3440] hover:border-[#10B981]/50 text-xs sm:text-sm font-medium text-slate-200 cursor-pointer transition-all shadow-sm"
                  aria-label="User account menu"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover border border-[#10B981]/60"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-[10px] font-bold text-[#07141F]">
                      {getInitials()}
                    </div>
                  )}
                  <span className="hidden sm:inline-block max-w-[90px] truncate font-medium text-slate-200">
                    {user.displayName?.split(' ')[0] || (user.isAnonymous ? 'Guest' : 'User')}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#07141F] border border-[#1E3440] shadow-2xl p-2 z-50 animate-fade-in text-[#F1F5F9]">
                    <div className="px-3 py-2 border-b border-[#1E3440] mb-1">
                      <p className="text-xs font-bold text-white truncate">
                        {user.displayName || (user.isAnonymous ? 'Guest Explorer' : 'Tourist')}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                        {user.email || 'Guest Session'}
                      </p>
                      <div className="mt-1.5">
                        {user.isAnonymous ? (
                          <span className="inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {t('auth_guest_badge', language)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono rounded bg-emerald-950/70 text-[#34D399] border border-emerald-500/30">
                            <ShieldCheck className="w-2.5 h-2.5 text-[#34D399]" />
                            {t('auth_verified_badge', language)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openProfileModal();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#1E3440]/50 rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <User className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>{t('auth_profile', language)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>{t('auth_logout', language)}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#0D202B] hover:bg-[#142B3A] border border-[#1E3440] hover:border-[#10B981]/50 text-xs sm:text-sm font-semibold text-[#34D399] cursor-pointer transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-[#34D399]" />
                <span>{t('auth_signin', language)}</span>
              </button>
            )}

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenSOS}
              aria-label="Emergency SOS trigger"
              className="btn-tactile flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-red-950/50 border border-red-400/30 cursor-pointer animate-pulse-subtle"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span className="font-mono text-xs sm:text-sm tracking-wider font-bold">{t('sos', language)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07141F]/95 backdrop-blur-[16px] border-t border-[#1E3440] px-3 pt-2 pb-[max(0.8rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="grid grid-cols-5 items-center justify-items-center max-w-lg mx-auto gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-[#34D399] bg-[#10B981]/15 font-bold shadow-inner border border-[#10B981]/25'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#34D399]' : 'text-[#94A3B8]'}`} />
                  {tab.id === 'simulation' && isSimulatingHazard && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
                <span className="text-[11px] mt-1 font-medium tracking-tight whitespace-nowrap text-center">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}

          {/* 5th Mobile Item: Profile / Sign In */}
          <button
            onClick={() => (user ? openProfileModal() : openAuthModal('signin'))}
            className="w-full flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all text-[#94A3B8] hover:text-[#F1F5F9]"
          >
            {user ? (
              user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-5 h-5 rounded-full object-cover border border-[#10B981]/60"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] font-bold text-white">
                  {getInitials()}
                </div>
              )
            ) : (
              <User className="w-5 h-5 text-[#94A3B8]" />
            )}
            <span className="text-[11px] mt-1 font-medium tracking-tight whitespace-nowrap text-center">
              {user ? (language === 'hi' ? 'प्रोफाइल' : 'Profile') : (language === 'hi' ? 'लॉगिन' : 'Login')}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

