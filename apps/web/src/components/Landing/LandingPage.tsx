import React, { useState } from 'react';
import {
  ArrowRight,
  Radio,
  AlertTriangle,
  WifiOff,
  Activity,
  ChevronRight,
  Zap,
  Building,
  Send,
  X,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { IgniteLogo } from '../Common/IgniteLogo';
import { Interactive3DTerrain } from '../Common/Interactive3DTerrain';
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
}) => {
  const [selectedPreviewDest, setSelectedPreviewDest] = useState('Kedarnath Dham & Valley');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchAgency, setDispatchAgency] = useState('SDRF / Disaster Management Unit');
  const [dispatchSubmitted, setDispatchSubmitted] = useState(false);

  const previewDestinations = [
    {
      name: 'Kedarnath Dham & Valley',
      region: 'Himalayan Alpine Corridor',
      base: 'Gaurikund Base (1,982m)',
      summit: 'Kedarnath Dham (3,583m)',
      distance: '14.2 km trail',
      alt: 3583,
      riskScore: 24,
      riskText: 'Low Risk • Safe Corridor',
      weather: 'Clear Skies (11°C)',
      landslide: 'Low (8%)',
      sdrf: 'Post #4 Standby',
    },
    {
      name: 'Leh, Pangong Tso & Khardung La',
      region: 'Trans-Himalayan High Altitude',
      base: 'Leh Town Base (3,500m)',
      summit: 'Khardung La Pass (5,359m)',
      distance: '39.8 km trail',
      alt: 5359,
      riskScore: 38,
      riskText: 'Moderate AMS Vigilance',
      weather: 'Sub-Zero Dry (-2°C)',
      landslide: 'Glacial Scree (18%)',
      sdrf: 'ITBP High-Altitude Unit',
    },
    {
      name: 'Munnar & Anamudi Highlands',
      region: 'Western Ghats Bio-Corridor',
      base: 'Munnar Base (1,532m)',
      summit: 'Anamudi Peak (2,695m)',
      distance: '18.5 km trail',
      alt: 2695,
      riskScore: 15,
      riskText: 'Low Risk • Favorable',
      weather: 'Misty Rainforest (19°C)',
      landslide: 'Slope Stable (4%)',
      sdrf: 'Kerala Forest Patrol',
    },
    {
      name: 'Vaishno Devi Shrine & Katra',
      region: 'Shivalik Pilgrimage Network',
      base: 'Katra Base Camp (750m)',
      summit: 'Bhavan Sanctuary (1,585m)',
      distance: '12.8 km trail',
      alt: 1585,
      riskScore: 18,
      riskText: 'Low Risk • Paved Route',
      weather: 'Clear & Mild (22°C)',
      landslide: 'Fencing Active (5%)',
      sdrf: 'Shrine Board Command',
    },
    {
      name: 'Goa Beaches & Promenade',
      region: 'Coastal Arabian Sea Corridor',
      base: 'Panaji Promenade (4m)',
      summit: 'Arambol & Chapora (65m)',
      distance: '26.4 km coastal route',
      alt: 12,
      riskScore: 12,
      riskText: 'Low Risk • Leisure',
      weather: 'Warm Sea Breeze (29°C)',
      landslide: 'Zero Hazard (1%)',
      sdrf: 'Drishti Marine Rescue',
    },
  ];

  const currentPreview = previewDestinations.find((d) => d.name === selectedPreviewDest) || previewDestinations[0];

  const handleOpenDispatchModal = (agencyType: string) => {
    setDispatchAgency(agencyType);
    setDispatchSubmitted(false);
    setIsDispatchModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-emerald-500/30 selection:text-white font-sans antialiased relative overflow-hidden">
      {/* 1. Ultra-Premium Hero Section */}
      <section id="hero" className="relative mx-auto mt-12 sm:mt-16 max-w-[84rem] px-4 sm:px-6 text-center md:px-8">
        {/* Background Ambient Branding */}
        <p className="pointer-events-none select-none absolute -top-14 left-1/2 -translate-x-1/2 text-center text-[100px] sm:text-[160px] md:text-[220px] lg:text-[280px] font-extrabold tracking-tighter bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent bg-clip-text text-transparent -z-10 leading-none">
          IGNITE
        </p>

        {/* Shimmer Status Badge */}
        <div
          onClick={() => onLaunchSimulation()}
          className="backdrop-filter-[12px] inline-flex h-8 items-center justify-between rounded-full border border-white/15 bg-white/5 px-4 text-xs text-white transition-all ease-in hover:cursor-pointer hover:bg-white/10 group gap-1.5 shadow-lg"
        >
          <p className="mx-auto max-w-md animate-shimmer bg-clip-text bg-no-repeat bg-gradient-to-r from-neutral-300 via-white via-50% to-neutral-300 inline-flex items-center justify-center font-medium">
            <span>{language === 'hi' ? '✨ 3D स्वायत्त आपदा-प्रतिरोधी सुरक्षा मैट्रिक्स' : '✨ 3D Autonomous Disaster Safety Matrix'}</span>
            <ChevronRight className="ml-1.5 size-3.5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </p>
        </div>

        {/* Hero Title */}
        <h1 className="bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text py-5 text-4xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl">
          {language === 'hi' ? (
            <>
              IGNITE पर्वतीय मार्गों पर<br className="hidden md:block" /> सुरक्षित नेविगेशन का 3D मंच है।
            </>
          ) : (
            <>
              Next-Gen 3D Safety &<br className="hidden md:block" /> Autonomous Route Matrix.
            </>
          )}
        </h1>

        {/* Subheading */}
        <p className="mb-8 text-base tracking-tight text-gray-400 md:text-xl text-balance max-w-3xl mx-auto leading-relaxed font-normal">
          {language === 'hi' ? (
            'वास्तविक समय 3D स्थलाकृति विश्लेषण, स्वायत्त भूस्खलन बाईपास और शून्य-सिग्नल 2G आपातकालीन सुरक्षा ग्रिड।'
          ) : (
            'Interactive 3D elevation topography, real-time autonomous hazard re-routing, and zero-cellular offline rescue telemetry across India.'
          )}
        </p>

        {/* Hero Quick Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => onLaunchMap(currentPreview.name)}
            className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all bg-white text-black shadow-xl hover:bg-neutral-200 h-11 px-6 gap-2 rounded-xl cursor-pointer group"
          >
            <span>{language === 'hi' ? 'रणनीतिक नक्शा खोलें' : 'Launch Tactical Map'}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onSelectTab('simulation')}
            className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border border-white/15 bg-white/5 hover:bg-white/10 text-white h-11 px-5 rounded-xl cursor-pointer gap-2"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'आपदा बेंच सिम्युलेटर' : 'Simulate Disaster'}</span>
          </button>

          <button
            onClick={onOpenSOS}
            className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-colors border border-red-500/40 bg-red-950/60 hover:bg-red-900/60 text-red-300 h-11 px-4 rounded-xl cursor-pointer gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{language === 'hi' ? 'एसओएस आपातकाल' : 'Emergency SOS'}</span>
          </button>
        </div>

        {/* 2. Interactive 3D Terrain & Telemetry Showcase */}
        <div className="relative mx-auto max-w-[80rem]">
          {/* Destination Switcher Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            {previewDestinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => setSelectedPreviewDest(dest.name)}
                className={`btn-tactile shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                  selectedPreviewDest === dest.name
                    ? 'bg-white/15 border-white/40 text-white font-semibold shadow-md'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {getLocalizedDestinationName(dest.name, language)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">
            {/* Left 3D Interactive Topography Viewport */}
            <div className="lg:col-span-2">
              <Interactive3DTerrain
                destinationName={getLocalizedDestinationName(currentPreview.name, language)}
                altitudeM={currentPreview.alt}
                hazardActive={false}
              />
            </div>

            {/* Right Telemetry & Instant Action Deck */}
            <div className="flex flex-col justify-between gap-3">
              <div className="rounded-2xl bg-black/60 border border-white/15 p-5 backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="text-xs font-mono text-slate-400 uppercase">Live Trail Telemetry</div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold">
                    REAL-TIME RADAR
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {getLocalizedDestinationName(currentPreview.name, language)}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{currentPreview.region}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Elevation Summit</div>
                    <div className="text-sm font-bold font-mono text-white">{currentPreview.alt}m</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Safety Index</div>
                    <div className="text-sm font-bold font-mono text-emerald-400">{100 - currentPreview.riskScore}/100</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 font-mono pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">IMD Sensor:</span>
                    <span className="text-emerald-300 font-semibold">{currentPreview.weather}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Slope Risk:</span>
                    <span className="text-emerald-300 font-semibold">{currentPreview.landslide}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SDRF Post:</span>
                    <span className="text-cyan-300 font-semibold">{currentPreview.sdrf}</span>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchMap(currentPreview.name)}
                  className="w-full btn-tactile py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-lg"
                >
                  <span>{language === 'hi' ? 'यह मार्ग संश्लेषित करें' : 'Synthesize Safe Itinerary'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Failover Card */}
              <div className="rounded-2xl bg-black/60 border border-white/15 p-4 backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Zero-Latency Bypass</div>
                    <div className="text-[11px] text-slate-400">Autonomous rerouting sub-450ms</div>
                  </div>
                </div>
                <button
                  onClick={() => onSelectTab('simulation')}
                  className="btn-tactile px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium cursor-pointer"
                >
                  Test Bench
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ultra-Premium 3D Core Capability Grid */}
      <section id="capabilities" className="relative mx-auto max-w-[84rem] px-6 md:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
            MISSION-CRITICAL ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-3">
            Engineered for High Altitudes & Zero Connectivity
          </h2>
          <p className="mt-3 text-base text-gray-400">
            Four interconnected autonomous layers protecting pilgrims, trekkers, and rescue forces across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div
            onClick={() => onSelectTab('map')}
            className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-emerald-500/40 transition-all cursor-pointer group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Autonomous Rerouting</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Recalculates safe bypasses, elevation stairs, and shelter waypoints instantly when rainfall or landslide risk crosses threshold.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Explore Trail Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onSelectTab('map')}
            className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-cyan-500/40 transition-all cursor-pointer group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Offline-First 2G Cache</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Full itinerary schedules, oxygen booth locations, GPS trail geometry, and offline SOS payloads function without cellular network.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>View Offline Mesh</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onSelectTab('explainability')}
            className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-amber-500/40 transition-all cursor-pointer group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Explainable Risk AI</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Decomposes weather risk into transparent components: AMS altitude acclimatization, slope grade, IMD rainfall, and audio safety briefing.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Inspect Risk Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={onOpenSOS}
            className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 hover:border-red-500/40 transition-all cursor-pointer group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">SDRF Panic Beacon</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              One-touch emergency panic dispatches live coordinates, elevation, and health telemetry directly to state disaster response forces.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-red-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Trigger Test SOS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Streamlined Mission & Fleet Console */}
      <section id="deployment" className="relative mx-auto max-w-[84rem] px-6 md:px-8 pb-20">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.04] to-black/80 p-8 sm:p-12 backdrop-blur-2xl relative overflow-hidden">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
              TACTICAL DEPLOYMENT TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
              Ready for Solo Trekkers & State Disaster Units
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Whether embarking on a personal pilgrimage or orchestrating high-altitude search-and-rescue battalions, IGNITE delivers instantaneous safety telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-5 rounded-2xl bg-black/50 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-emerald-400 font-semibold uppercase">Individual Tier</div>
                <div className="text-lg font-bold text-white mt-1">Solo Pilgrim & Trekker</div>
                <p className="text-xs text-slate-400 mt-2">
                  Full 2G offline cache, one-touch SOS panic relay, and weather radar for all 28 states & 8 UTs.
                </p>
              </div>
              <button
                onClick={() => onLaunchMap(currentPreview.name)}
                className="btn-tactile w-full py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 mt-6 cursor-pointer"
              >
                Launch Free Route
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.04] border-2 border-[var(--color-one)] flex flex-col justify-between relative shadow-lg">
              <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-black font-bold">
                POPULAR
              </span>
              <div>
                <div className="text-xs font-mono text-amber-400 font-semibold uppercase">Pro Guide Tier</div>
                <div className="text-lg font-bold text-white mt-1">Expedition Leader</div>
                <p className="text-xs text-slate-400 mt-2">
                  Autonomous hazard bypass, AI audio briefings, group radar mesh up to 25 members, and explainable AMS matrix.
                </p>
              </div>
              <button
                onClick={() => onLaunchMap(currentPreview.name)}
                className="btn-tactile w-full py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 mt-6 cursor-pointer"
              >
                Activate Pro Planner
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-black/50 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-cyan-400 font-semibold uppercase">Command Tier</div>
                <div className="text-lg font-bold text-white mt-1">SDRF & DEOC Command</div>
                <p className="text-xs text-slate-400 mt-2">
                  Multi-team fleet telemetry, state DEOC integration, mass evacuation simulations, and dedicated rescue mesh.
                </p>
              </div>
              <button
                onClick={() => handleOpenDispatchModal('SDRF & State Disaster Authority')}
                className="btn-tactile w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs mt-6 cursor-pointer border border-white/15"
              >
                Govt Fleet Dispatch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clean Professional Command Footer */}
      <footer className="border-t border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <IgniteLogo size="sm" />
              <div>
                <span className="text-xl font-bold text-white tracking-tight">IGNITE</span>
                <p className="text-xs text-slate-400">Pan-India Autonomous Mountain Safety & Disaster Resilience</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button onClick={() => onSelectTab('map')} className="text-slate-300 hover:text-white cursor-pointer transition-colors">Tactical Map</button>
              <button onClick={() => onSelectTab('itinerary')} className="text-slate-300 hover:text-white cursor-pointer transition-colors">Safe Itinerary</button>
              <button onClick={() => onSelectTab('explainability')} className="text-slate-300 hover:text-white cursor-pointer transition-colors">Risk Matrix</button>
              <button onClick={() => onSelectTab('simulation')} className="text-slate-300 hover:text-white cursor-pointer transition-colors">Disaster Bench</button>
              <button onClick={onOpenSOS} className="text-red-400 hover:text-red-300 cursor-pointer font-bold transition-colors">SOS Panic</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 text-xs text-gray-500 gap-3">
            <span>Copyright © 2026 <strong className="text-slate-300">IGNITE</strong>. All Rights Reserved.</span>
            <span className="font-mono">OpenStreetMap • CARTO Voyager • Open-Meteo • SDRF Multi-Agency Mesh</span>
          </div>
        </div>
      </footer>

      {/* Mission Dispatch Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1017] border border-white/15 p-6 shadow-2xl">
            <button
              onClick={() => setIsDispatchModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!dispatchSubmitted ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{dispatchAgency}</h3>
                    <p className="text-xs text-slate-400">Deploy Dedicated Command Telemetry & Fleet Mesh</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 space-y-1 font-mono">
                  <div className="text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Multi-Agency Data Fusion Engine Active</span>
                  </div>
                  <p className="text-slate-400 font-sans text-[11px]">
                    Direct integration with state disaster command centers (DEOC), ITBP, and regional search-and-rescue teams.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium">Operation Sector / Organization Name</label>
                  <input
                    type="text"
                    defaultValue="Himalayan Search & Rescue Directorate"
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium">Deployment Scale</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-white/10 text-white text-xs focus:outline-none focus:border-white/30">
                    <option>Regional Battalion (10-50 Field Personnel)</option>
                    <option>District Emergency Command (50-250 Personnel)</option>
                    <option>State-Wide Multi-Agency Fleet (250+ Personnel)</option>
                  </select>
                </div>

                <button
                  onClick={() => setDispatchSubmitted(true)}
                  className="w-full btn-tactile py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  <Send className="w-4 h-4" />
                  <span>Initiate Deployment Simulation</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Mission Telemetry Link Established</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Your tactical dispatch request for <strong className="text-white">{dispatchAgency}</strong> has been calibrated with the live SDRF simulation engine.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsDispatchModalOpen(false);
                      onSelectTab('simulation');
                    }}
                    className="btn-tactile px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 cursor-pointer"
                  >
                    Open Disaster Bench
                  </button>
                  <button
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="btn-tactile px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
