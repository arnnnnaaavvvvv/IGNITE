import React from 'react';
import {
  ShieldAlert,
  Compass,
  Calendar,
  Activity,
  Radio,
  Users,
  UserCheck,
  LogIn,
} from 'lucide-react';
import { IgniteLogo } from './Common/IgniteLogo';

interface NavbarProps {
  activeTab: 'map' | 'itinerary' | 'explainability' | 'simulation' | 'group';
  setActiveTab: (tab: 'map' | 'itinerary' | 'explainability' | 'simulation' | 'group') => void;
  language: string;
  setLanguage: (lang: string) => void;
  onOpenSOS: () => void;
  onOpenAuth?: () => void;
  isSimulatingHazard?: boolean;
  isWebSocketConnected?: boolean;
  currentUser?: { name?: string; email?: string; photoURL?: string | null; isGuest?: boolean } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenSOS,
  onOpenAuth,
  isSimulatingHazard = false,
  isWebSocketConnected = true,
  currentUser,
}) => {
  const isUserAuthenticated = Boolean(currentUser && !currentUser.isGuest && currentUser.email);
  const userName = currentUser?.name || 'Tourist Guest';
  const tabs = [
    { id: 'map', label: 'Explore & Map', icon: Compass },
    { id: 'itinerary', label: 'Safe Itinerary', icon: Calendar },
    { id: 'explainability', label: 'Risk Explainability', icon: Activity },
    { id: 'simulation', label: 'Disaster Bench', icon: Radio },
    { id: 'group', label: 'Group Radar', icon: Users },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & Live Mesh Status */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <IgniteLogo size="md" />

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
                  IGNITE
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/25 font-bold tracking-wider">
                  PAN-INDIA
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] text-slate-400 font-mono">
                <span className={`w-1.5 h-1.5 rounded-full ${isWebSocketConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                <span className="hidden xs:inline">{isWebSocketConnected ? 'Live Mesh WS' : 'Connecting WS'}</span>
                <span className="xs:hidden">{isWebSocketConnected ? 'Live' : 'Connecting'}</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-emerald-400/90 font-medium hidden sm:inline">PostGIS + Overpass</span>
              </div>
            </div>
          </div>

          {/* Desktop Center Tabs Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner backdrop-blur-md">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/25 font-bold tracking-tight'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'simulation' && isSimulatingHazard && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Lang, Auth, SOS */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* User Auth Profile / Login Trigger */}
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm group ${
                  isUserAuthenticated
                    ? 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 ring-1 ring-emerald-400/30'
                }`}
                title={isUserAuthenticated ? 'View Profile & Medical Info' : 'Open Tourist Login / Sign Up'}
              >
                {isUserAuthenticated && currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={userName}
                    className="w-4 h-4 rounded-full border border-emerald-400 object-cover"
                  />
                ) : isUserAuthenticated ? (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <LogIn className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[11px] font-bold max-w-[120px] truncate">
                  {isUserAuthenticated ? userName : 'Login / Sign Up'}
                </span>
                {isUserAuthenticated && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Verified Firebase User" />
                )}
              </button>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer text-[11px] ${
                  language === 'en' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer text-[11px] ${
                  language === 'hi' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिं
              </button>
            </div>

            {/* High Priority Emergency SOS Button */}
            <button
              onClick={onOpenSOS}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-[11px] sm:text-xs shadow-lg shadow-red-600/30 transition-all transform hover:scale-105 active:scale-95 animate-pulse cursor-pointer border border-red-400/40"
            >
              <ShieldAlert className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              <span className="tracking-wider">SOS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Mobile Bottom Navigation Bar (iOS / Android Native Feel) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/80 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-emerald-400 bg-emerald-500/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-400'} transition-transform`} />
                  {tab.id === 'simulation' && isSimulatingHazard && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap">
                  {tab.id === 'map' ? 'Map' : tab.id === 'itinerary' ? 'Itinerary' : tab.id === 'explainability' ? 'Explain' : tab.id === 'simulation' ? 'Disaster' : 'Group'}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
