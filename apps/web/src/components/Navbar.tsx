import React from 'react';
import {
  ShieldAlert,
  Compass,
  Activity,
  Radio,
  Users,
} from 'lucide-react';
import { IgniteLogo } from './Common/IgniteLogo';
import { t } from '../services/i18n';

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

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#1E3440] bg-[#07141F]/90 backdrop-blur-[16px] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
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

          {/* Right Action Controls: Lang Switcher & SOS */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* High-Precision Segmented Language Switcher */}
            <div className="flex items-center bg-[#0D202B] border border-[#1E3440] rounded-xl p-1 text-xs sm:text-sm shadow-sm">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                aria-label="Switch to English"
                className={`btn-tactile px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold cursor-pointer transition-all ${
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
                className={`btn-tactile px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold cursor-pointer transition-all ${
                  language === 'hi'
                    ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                HI
              </button>
            </div>

            {/* Emergency SOS Button */}
            <button
              onClick={onOpenSOS}
              aria-label="Emergency SOS trigger"
              className="btn-tactile flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-red-950/50 border border-red-400/30 cursor-pointer animate-pulse-subtle"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span className="font-mono text-xs sm:text-sm tracking-wider font-bold">{t('sos', language)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07141F]/95 backdrop-blur-[16px] border-t border-[#1E3440] px-3 pt-2 pb-[max(0.8rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="grid grid-cols-4 items-center justify-items-center max-w-lg mx-auto gap-1">
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
        </div>
      </nav>
    </>
  );
};

export default Navbar;
