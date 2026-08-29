import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Radio,
  Compass,
  AlertTriangle,
  WifiOff,
  Users,
  Activity,
  Check,
  ChevronRight,
  MapPin,
  HeartHandshake,
  Zap,
} from 'lucide-react';
import { IgniteLogo } from '../Common/IgniteLogo';
import { getLocalizedDestinationName } from '../../services/i18n';

interface LandingPageProps {
  onLaunchMap: (destinationName?: string) => void;
  onLaunchSimulation: (scenarioId?: string) => void;
  onOpenSOS: () => void;
  onSelectTab: (tab: 'overview' | 'map' | 'itinerary' | 'explainability' | 'simulation' | 'group') => void;
  language: string;
  isWebSocketConnected?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchMap,
  onLaunchSimulation,
  onOpenSOS,
  onSelectTab,
  language,
  isWebSocketConnected = true,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPreviewDest, setSelectedPreviewDest] = useState('Kedarnath Dham & Valley');

  const previewDestinations = [
    { name: 'Kedarnath Dham & Valley', region: 'Himalayan Alpine', alt: '3,583m', risk: '24/100 (Safe)', color: 'text-emerald-400' },
    { name: 'Leh, Pangong Tso & Khardung La', region: 'Trans-Himalayan', alt: '5,359m', risk: '38/100 (Moderate)', color: 'text-amber-400' },
    { name: 'Munnar & Anamudi Highlands', region: 'Western Ghats', alt: '2,695m', risk: '15/100 (Safe)', color: 'text-emerald-400' },
    { name: 'Vaishno Devi Shrine & Katra', region: 'Shivalik Hills', alt: '1,585m', risk: '18/100 (Safe)', color: 'text-emerald-400' },
    { name: 'Goa Beaches & Promenade', region: 'Coastal Arabian Sea', alt: '12m', risk: '12/100 (Low)', color: 'text-emerald-400' },
  ];

  return (
    <div className="min-h-screen text-slate-100 selection:bg-emerald-500/30 selection:text-white font-sans relative overflow-hidden">
      {/* Magic UI Ambient Glow at Top */}
      <div className="ambient-glow-top" />

      {/* Hero Section */}
      <section id="hero" className="relative mx-auto mt-6 sm:mt-12 max-w-[80rem] px-4 sm:px-6 lg:px-8 text-center">
        {/* Shimmer Announcement Pill Badge */}
        <div 
          onClick={() => onLaunchSimulation()}
          className="backdrop-blur-md inline-flex items-center justify-between rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-1 text-xs text-emerald-300 transition-all ease-in-out hover:cursor-pointer hover:bg-emerald-900/40 hover:border-emerald-400/50 group gap-1.5 animate-fade-in shadow-lg shadow-emerald-950/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="font-mono text-[11px] tracking-wide uppercase font-semibold">
            {language === 'hi' ? '✨ प्रस्तुत है IGNITE आपदा-प्रतिरोधी सुरक्षा मैट्रिक्स' : '✨ Introducing IGNITE Tactical Safety Matrix'}
          </span>
          <ArrowRight className="w-3 h-3 transition-transform duration-300 ease-in-out group-hover:translate-x-1 text-emerald-400" />
        </div>

        {/* Hero Title */}
        <h1 className="mt-6 bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-transparent max-w-5xl mx-auto leading-[1.1] animate-fade-in">
          {language === 'hi' ? (
            <>
              उच्च जोखिम वाले पर्वतीय और तीर्थ मार्गों पर सुरक्षित नेविगेशन
            </>
          ) : (
            <>
              IGNITE is the new way to navigate high-risk mountain routes.
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed animate-fade-in font-normal">
          {language === 'hi' ? (
            'वास्तविक समय उपग्रह रडार, स्वायत्त खतरा पुनर्निर्धारण, 2G ऑफलाइन लचीलापन और पूरे भारत में बहुभाषी एसडीआरएफ एसओएस आपातकालीन सहायता।'
          ) : (
            'Real-time autonomous hazard re-routing, explainable weather risk matrix, offline-first 2G cache, and SDRF multi-agency emergency rescue mesh across India.'
          )}
        </p>

        {/* Call to Action Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 animate-fade-in">
          <button
            onClick={() => onLaunchMap()}
            className="btn-tactile inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer group"
          >
            <Compass className="w-4 h-4 text-black" />
            <span>{language === 'hi' ? 'मानचित्र एक्सप्लोरर खोलें' : 'Launch Tactical Map & Planner'}</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onSelectTab('simulation')}
            className="btn-tactile inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#12141d] hover:bg-[#181b26] border border-white/10 text-slate-200 font-semibold text-sm transition-all cursor-pointer hover:border-white/20"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'आपदा बेंच चलाएं' : 'Simulate Disaster Scenario'}</span>
          </button>

          <button
            onClick={onOpenSOS}
            className="btn-tactile inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-sm transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="font-mono">{language === 'hi' ? 'एसओएस आपातकाल' : 'Emergency SOS'}</span>
          </button>
        </div>

        {/* Hero Interactive Showcase Frame with Border Beam */}
        <div className="relative mt-12 sm:mt-16 max-w-5xl mx-auto animate-fade-up">
          {/* Animated Glow Border Frame */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-white/20 via-emerald-500/30 to-transparent shadow-2xl shadow-emerald-950/40">
            {/* Inner Dashboard Preview Container */}
            <div className="relative rounded-2xl bg-[#0e1017]/95 backdrop-blur-xl border border-white/[0.08] overflow-hidden p-4 sm:p-6 text-left">
              {/* Showcase Window Titlebar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-2 text-xs font-mono text-slate-400 font-medium flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isWebSocketConnected ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                    IGNITE LIVE RADAR DASHBOARD v2.4 • PAN-INDIA MESH
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                    SDRF GRID ONLINE
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-300">
                    28 STATES • 8 UTS
                  </span>
                </div>
              </div>

              {/* Destination Selector Tabs inside Hero Mockup */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
                {previewDestinations.map((dest) => (
                  <button
                    key={dest.name}
                    onClick={() => setSelectedPreviewDest(dest.name)}
                    className={`btn-tactile shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                      selectedPreviewDest === dest.name
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-semibold'
                        : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {getLocalizedDestinationName(dest.name, language)}
                  </button>
                ))}
              </div>

              {/* Showcase Grid Stats & Active Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                {/* Left Live Telemetry Widget */}
                <div className="md:col-span-2 rounded-xl bg-[#12141d] border border-white/[0.08] p-4 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-bold text-white">
                        {getLocalizedDestinationName(selectedPreviewDest, language)}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      LIVE RADAR ACTIVE
                    </span>
                  </div>

                  {/* Simulated Tactical Map Visual Strip */}
                  <div className="h-44 rounded-lg bg-[#090a0f] border border-white/[0.06] p-3 relative flex flex-col justify-between overflow-hidden bg-tactical-grid">
                    {/* Simulated Trail Nodes */}
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 target-beacon-pulse" />
                        <span className="text-xs font-mono text-slate-300 font-semibold">Gaurikund Base (1,982m)</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">14.2 km total trail</span>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-cyan-400" />
                        <span className="text-xs font-mono text-slate-300 font-semibold">Dham Sanctuary (3,583m)</span>
                      </div>
                    </div>

                    {/* Progress Visual Bar */}
                    <div className="relative my-auto py-2">
                      <div className="h-2 w-full bg-white/[0.08] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 w-3/4 rounded-full" />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                        <span>Jungle Chatti [Safe]</span>
                        <span>Bheembali [Shelter Active]</span>
                        <span>Linchauli [AMS Oxygen Booth]</span>
                        <span>Kedarnath Base</span>
                      </div>
                    </div>

                    {/* Quick Telemetry Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
                      <span className="text-slate-400">IMD Sensor: <span className="text-emerald-300 font-semibold">Clear Skies (11°C)</span></span>
                      <span className="text-slate-400">Landslide Risk: <span className="text-emerald-300 font-semibold">Low (8%)</span></span>
                      <span className="text-slate-400">SDRF Team: <span className="text-cyan-300 font-semibold">Post #4 Standby</span></span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Auto-synthesized tactical matrix with live CWC rainfall & IMD Doppler feed.
                    </span>
                    <button
                      onClick={() => onLaunchMap(selectedPreviewDest)}
                      className="btn-tactile px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{language === 'hi' ? 'यह मार्ग प्लान करें' : 'Open in Tactical Map'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Quick Intelligence Matrix */}
                <div className="space-y-3">
                  <div className="rounded-xl bg-[#12141d] border border-white/[0.08] p-4">
                    <div className="text-xs text-slate-400 font-mono uppercase mb-1">Overall Safety Score</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold font-mono text-emerald-400">92</span>
                      <span className="text-xs text-emerald-400 font-medium">/ 100 • Low Risk</span>
                    </div>
                    <div className="mt-2 text-[11px] text-slate-400 leading-snug">
                      Verified safe for standard fitness levels with mandatory acclimatization checkpoint at 2,800m.
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#12141d] border border-white/[0.08] p-4">
                    <div className="text-xs text-slate-400 font-mono uppercase mb-1">Autonomous Failover</div>
                    <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>Zero-Latency Reroute</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400 leading-snug">
                      Emergency bypass trails engaged automatically within 450ms of regional hazard alert.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Rescue Agencies & Tourism Departments */}
      <section id="clients" className="relative mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <div className="py-10 border-y border-white/[0.06]">
          <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
            {language === 'hi'
              ? 'राष्ट्रीय आपदा एवं पर्वतीय बचाव प्रोटोकॉल के अनुरूप अनुकूलित'
              : 'CALIBRATED WITH NATIONAL DISASTER & SEARCH-AND-RESCUE AGENCIES'}
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-14 text-sm font-mono text-slate-400">
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>SDRF Uttarakhand</span>
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>NDMA India</span>
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>ITBP High-Altitude</span>
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>IMD Weather Radar</span>
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Central Water Comm.</span>
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Indian Mountaineering Fdn</span>
            </span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Bento Grid */}
      <section id="features" className="relative mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2">
            Tactical Architecture
          </h4>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Engineered for Extreme Terrains & Zero-Connectivity
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Every layer of IGNITE is built to safeguard lives during rapid weather shifts, flash floods, and remote high-altitude expeditions.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Autonomous Safe Rerouting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When landslides or cloudburst thresholds trigger, the engine automatically recalculates verified escape bypasses and shelter waypoints.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Offline-First 2G Cache</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete itineraries, GPS coordinates, oxygen booth waypoints, and emergency protocols stay accessible even with zero cellular signal.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Explainable Risk Matrix</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI decomposes complex safety conditions into actionable scores: Acute Mountain Sickness (AMS), slope gradient, rainfall, and medical proximity.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">One-Touch SDRF SOS Beacon</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant panic signal dispatches live coordinates, altitude, and group medical state directly to local district disaster response force units.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Scenario Disaster Bench</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stress-test expedition plans against cloudbursts, glacial surges, rockfalls, and heatwaves before you set foot on the mountain trail.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Group Live Mesh Radar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track team members within dynamic geofences. Automatically alert leaders when a member falls behind or strays outside the safe corridor.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Matching Magic UI Startup Template) */}
      <section id="pricing" className="relative mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2">
            Pricing
          </h4>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Simple, Transparent Safety Plans.
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Choose the right tier for solo pilgrims, expedition leaders, commercial trekking agencies, or government rescue teams.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-xs font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Monthly
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={billingCycle === 'annual'}
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                billingCycle === 'annual' ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>

            <span className={`text-xs font-medium flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
              <span>Annual</span>
              <span className="inline-block whitespace-nowrap rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-300">
                2 MONTHS FREE ✨
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Tier 1: Basic */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-white/[0.08] hover:border-white/[0.15] transition-all">
            <div>
              <h3 className="text-lg font-bold text-white">Solo Trekker</h3>
              <p className="text-xs text-slate-400 mt-1 min-h-[2.5rem]">Essential offline safety & GPS tracking for individuals.</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-mono text-white">₹0</span>
                <span className="text-xs text-slate-400 font-mono">/ {billingCycle === 'annual' ? 'year' : 'month'}</span>
              </div>

              <button
                onClick={() => onLaunchMap()}
                className="mt-6 w-full btn-tactile py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/[0.08] cursor-pointer"
              >
                Start Free
              </button>

              <hr className="my-6 border-white/[0.08]" />

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pan-India 2G Offline Cache</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>One-Touch SOS Panic Relay</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Standard Weather Radar</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5 Saved Trail Routes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 2: Pro (Featured) */}
          <div className="relative glass-panel p-6 rounded-2xl flex flex-col justify-between border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/30">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </span>

            <div>
              <h3 className="text-lg font-bold text-white">Trek Leader</h3>
              <p className="text-xs text-slate-400 mt-1 min-h-[2.5rem]">Autonomous rerouting & group mesh for guides.</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-mono text-emerald-400">
                  {billingCycle === 'annual' ? '₹399' : '₹499'}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ month</span>
              </div>

              <button
                onClick={() => onLaunchMap()}
                className="mt-6 w-full btn-tactile py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                Launch Pro Plan
              </button>

              <hr className="my-6 border-white/[0.08]" />

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Autonomous Hazard Bypass</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI Audio Safety Briefing (EN/HI)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Group Radar (Up to 25 members)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full Explainable Risk Matrix</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited Disaster Bench Tests</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 3: Agency */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-white/[0.08] hover:border-white/[0.15] transition-all">
            <div>
              <h3 className="text-lg font-bold text-white">Trekking Agency</h3>
              <p className="text-xs text-slate-400 mt-1 min-h-[2.5rem]">Multi-expedition fleet telemetry & dispatch command.</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold font-mono text-white">
                  {billingCycle === 'annual' ? '₹1,599' : '₹1,999'}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ month</span>
              </div>

              <button
                onClick={() => onLaunchMap()}
                className="mt-6 w-full btn-tactile py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/[0.08] cursor-pointer"
              >
                Contact Sales
              </button>

              <hr className="my-6 border-white/[0.08]" />

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multi-Team Fleet Radar</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Hazard Alert Dispatch</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>24/7 Dedicated Rescue Dispatch</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom GeoJSON Overpass Feeds</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 4: Enterprise / Govt */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-white/[0.08] hover:border-white/[0.15] transition-all">
            <div>
              <h3 className="text-lg font-bold text-white">Govt & SDRF</h3>
              <p className="text-xs text-slate-400 mt-1 min-h-[2.5rem]">State emergency operation center deployment.</p>
              
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold font-mono text-white">Custom</span>
              </div>

              <button
                onClick={() => onLaunchMap()}
                className="mt-6 w-full btn-tactile py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold border border-white/[0.08] cursor-pointer"
              >
                Govt Inquiries
              </button>

              <hr className="my-6 border-white/[0.08]" />

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct DEOC Command Integration</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mass Evacuation Protocol Engine</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Sensor Mesh Deployment</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Security & Compliance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action (CTA) Section with Glowing Backdrop */}
      <section id="cta" className="relative mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative glass-panel rounded-3xl p-8 sm:p-14 text-center border border-emerald-500/20 overflow-hidden">
          {/* Ambient Glow Orb */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-[500px] h-[300px] rounded-full bg-emerald-500/10 blur-3xl" />
          </div>

          {/* Floating Glowing Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 mb-6">
            <HeartHandshake className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto">
            Stop risking unprepared expeditions.
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Experience real-time autonomous hazard re-routing and tactical trail safety today. Zero setup required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onLaunchMap()}
              className="btn-tactile inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black hover:bg-slate-100 font-bold text-sm shadow-xl cursor-pointer group"
            >
              <span>{language === 'hi' ? 'मार्ग की योजना बनाना शुरू करें' : 'Start Planning Now'}</span>
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onSelectTab('simulation')}
              className="btn-tactile inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#12141d] hover:bg-[#181b26] border border-white/10 text-slate-300 font-semibold text-sm cursor-pointer"
            >
              <span>{language === 'hi' ? 'आपदा बेंच डेमो' : 'Disaster Bench Demo'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Magic UI Style Comprehensive Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090a0f] pt-14 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <IgniteLogo size="sm" />
                <span className="text-xl font-bold tracking-tight text-white">IGNITE</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Pan-India autonomous mountain safety, tactical trail synthesizer, and disaster resilience platform adapted for high-altitude treks and pilgrimages.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Operational across 28 States & 8 Union Territories</span>
              </div>
            </div>

            {/* Column 1: Product */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">Product</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button onClick={() => onSelectTab('map')} className="hover:text-white transition-colors cursor-pointer">
                    Tactical Map & Planner
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('itinerary')} className="hover:text-white transition-colors cursor-pointer">
                    Safe Itinerary Synthesizer
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('explainability')} className="hover:text-white transition-colors cursor-pointer">
                    Risk Explainability Matrix
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('simulation')} className="hover:text-white transition-colors cursor-pointer">
                    Disaster Bench Engine
                  </button>
                </li>
                <li>
                  <button onClick={() => onSelectTab('group')} className="hover:text-white transition-colors cursor-pointer">
                    Group Live Radar
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Safety Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">Safety Grid</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span className="hover:text-white transition-colors">SDRF Emergency Mesh</span></li>
                <li><span className="hover:text-white transition-colors">IMD Doppler Radar</span></li>
                <li><span className="hover:text-white transition-colors">CWC Flood Sensors</span></li>
                <li><span className="hover:text-white transition-colors">Offline P2P Protocol</span></li>
                <li><span className="hover:text-white transition-colors">High-Altitude AMS Baselines</span></li>
              </ul>
            </div>

            {/* Column 3: Legal & Standards */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">Legal & Open GIS</h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span className="hover:text-white transition-colors">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors">Privacy & Geo-Telemetry</span></li>
                <li><span className="hover:text-white transition-colors">OpenStreetMap Attribution</span></li>
                <li><span className="hover:text-white transition-colors">NDMA Compliance</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Row */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <span>Copyright © 2026 IGNITE. All Rights Reserved.</span>
            <div className="flex items-center gap-4">
              <span>PostGIS • Leaflet • Overpass QL • Redis TTL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
