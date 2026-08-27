import React from 'react';
import {
  ShieldAlert,
  Compass,
  Calendar,
  Activity,
  Radio,
  Users,
} from 'lucide-react';
import { IgniteLogo } from './Common/IgniteLogo';
import { t } from '../services/i18n';

interface NavbarProps {
  activeTab: 'map' | 'itinerary' | 'explainability' | 'simulation' | 'group';
  setActiveTab: (tab: 'map' | 'itinerary' | 'explainability' | 'simulation' | 'group') => void;
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
  isWebSocketConnected = true,
}) => {
  const tabs = [
    { id: 'map', label: t('nav_map', language), shortLabel: language === 'hi' ? 'मानचित्र' : 'Map', icon: Compass },
    { id: 'itinerary', label: t('nav_itinerary', language), shortLabel: language === 'hi' ? 'यात्रा' : 'Itinerary', icon: Calendar },
    { id: 'explainability', label: t('nav_explainability', language), shortLabel: language === 'hi' ? 'जोखिम' : 'Matrix', icon: Activity },
    { id: 'simulation', label: t('nav_simulation', language), shortLabel: language === 'hi' ? 'आपदा' : 'Disaster', icon: Radio },
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
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#090a0f]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          {/* Brand & Live Mesh Status */}
          <div className="flex items-center gap-3 shrink-0">
            <IgniteLogo size="sm" />

            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm tracking-tight text-white">
                IGNITE
              </span>
              <span className="h-3.5 w-px bg-white/[0.12] hidden sm:inline" />
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <span className={`w-1.5 h-1.5 rounded-full ${isWebSocketConnected ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                <span className="font-medium text-slate-300">{isWebSocketConnected ? t('live_mesh', language) : t('connecting', language)}</span>
              </div>
            </div>
          </div>

          {/* Desktop Center Tabs Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#12141d] p-1 rounded-lg border border-white/[0.08]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`btn-tactile flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium cursor-pointer relative transition-all ${
                    isActive
                      ? 'bg-white/[0.1] text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'simulation' && isSimulatingHazard && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Lang Switcher & SOS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* High-Precision Segmented Language Switcher */}
            <div className="flex items-center bg-[#12141d] border border-white/[0.08] rounded-md p-0.5 text-xs">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                aria-label="Switch to English"
                className={`btn-tactile px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
                  language === 'en'
                    ? 'bg-white/[0.12] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                aria-label="हिंदी में बदलें"
                className={`btn-tactile px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
                  language === 'hi'
                    ? 'bg-white/[0.12] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                HI
              </button>
            </div>

            {/* High Priority Emergency SOS Button */}
            <button
              onClick={onOpenSOS}
              className="btn-tactile flex items-center justify-center gap-1.5 px-3 h-7 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer border border-red-500 shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="tracking-wider font-mono">{t('sos', language)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090a0f]/95 backdrop-blur-md border-t border-white/[0.08] px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-5 items-center justify-items-center max-w-lg mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex flex-col items-center justify-center py-1 px-1 rounded-md transition-all relative ${
                  isActive
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {tab.id === 'simulation' && isSimulatingHazard && (
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                  )}
                </div>
                <span className="text-[10px] mt-0.5 font-medium tracking-tight whitespace-nowrap text-center">
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
