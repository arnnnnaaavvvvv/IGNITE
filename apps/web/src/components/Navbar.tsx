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
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090d]/90 backdrop-blur-xl shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-3">
          {/* Brand & Live Mesh Status */}
          <div className="flex items-center gap-3 shrink-0">
            <IgniteLogo size="md" showGlow />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-amber-100 to-orange-400 bg-clip-text text-transparent">
                  IGNITE
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 font-semibold tracking-wider uppercase">
                  {t('brand_tagline', language)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <span className={`w-1.5 h-1.5 rounded-full ${isWebSocketConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-amber-400 animate-pulse'}`} />
                <span className="font-medium text-slate-300">{isWebSocketConnected ? t('live_mesh', language) : t('connecting', language)}</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-slate-400 hidden sm:inline">PostGIS + OSRM</span>
              </div>
            </div>
          </div>

          {/* Desktop Center Tabs Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#10131e]/90 p-1 rounded-xl border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`btn-tactile flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer relative transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-b from-emerald-400 to-emerald-500 text-slate-950 font-bold shadow-[0_2px_10px_rgba(16,185,129,0.35),inset_0_1px_0_0_rgba(255,255,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950 stroke-[2.4]' : 'text-slate-400 stroke-[1.8]'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'simulation' && isSimulatingHazard && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute -top-0.5 -right-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Safety Badge, Lang, SOS */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Safety Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
              <span>{t('sdrf_grid_online', language)}</span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#10131e] border border-white/[0.08] rounded-lg p-0.5 text-xs shadow-inner">
              <button
                onClick={() => handleLanguageChange('en')}
                aria-label="Switch to English"
                className={`btn-tactile px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold cursor-pointer transition-all ${
                  language === 'en'
                    ? 'bg-white/[0.12] text-white shadow-sm border border-white/[0.08]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                aria-label="हिंदी में बदलें"
                className={`btn-tactile px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold cursor-pointer transition-all ${
                  language === 'hi'
                    ? 'bg-white/[0.12] text-white shadow-sm border border-white/[0.08]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                हिं
              </button>
            </div>

            {/* High Priority Emergency SOS Button */}
            <button
              onClick={onOpenSOS}
              className="btn-tactile flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-extrabold text-xs shadow-[0_2px_14px_rgba(239,68,68,0.45),inset_0_1px_0_0_rgba(255,255,255,0.35)] cursor-pointer border border-red-400/50"
            >
              <ShieldAlert className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[2.5]" />
              <span className="tracking-wider font-mono">{t('sos', language)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Mobile Bottom Navigation Bar (iOS / Android Native Feel) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08090d]/95 backdrop-blur-2xl border-t border-white/[0.08] px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-all relative ${
                  isActive
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400 scale-105' : 'text-slate-400'}`} />
                  {tab.id === 'simulation' && isSimulatingHazard && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap">
                  {tab.shortLabel}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
