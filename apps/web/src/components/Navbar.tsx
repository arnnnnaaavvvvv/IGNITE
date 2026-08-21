import React from 'react';
import {
  ShieldAlert,
  Compass,
  Calendar,
  Activity,
  Radio,
  Users,
  UserCheck,
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
  userName?: string;
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
  userName = 'Tourist Guest',
}) => {
  const tabs = [
    { id: 'map', label: 'Explore & Map', icon: Compass },
    { id: 'itinerary', label: 'Safe Itinerary', icon: Calendar },
    { id: 'explainability', label: 'Risk Explainability', icon: Activity },
    { id: 'simulation', label: 'Disaster Bench', icon: Radio },
    { id: 'group', label: 'Group Radar', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Live Mesh Status */}
        <div className="flex items-center gap-3">
          <IgniteLogo size="md" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-400 bg-clip-text text-transparent drop-shadow-sm">
                IGNITE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/25 font-bold tracking-wider">
                PAN-INDIA
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${isWebSocketConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              <span>{isWebSocketConnected ? 'Live Mesh WS' : 'Connecting WS'}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400/90 font-medium">PostGIS + Overpass</span>
            </div>
          </div>
        </div>

        {/* Center Tabs Navigation */}
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
        <div className="flex items-center gap-2.5">
          {/* User Auth Profile Trigger */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-all cursor-pointer"
              title="Tourist Identity & Medical Info"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-[11px] font-medium">{userName}</span>
            </button>
          )}

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                language === 'en' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                language === 'hi' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिं
            </button>
          </div>

          {/* High Priority Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all transform hover:scale-105 active:scale-95 animate-pulse cursor-pointer border border-red-400/40"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="tracking-wider">SOS PANIC</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-900 bg-slate-950/95 py-2 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-semibold ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
