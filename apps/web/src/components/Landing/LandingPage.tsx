import React, { useState } from 'react';
import {
  ArrowRight,
  Shield,
  Radio,
  AlertTriangle,
  WifiOff,
  Users,
  Activity,
  ChevronRight,
  HeartHandshake,
  Zap,
  Check,
  Building,
  Send,
  X,
  MapPin,
  CheckCircle2,
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
  const [isAnnual, setIsAnnual] = useState(true);
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
      alt: '3,583m',
      riskScore: 24,
      riskText: 'Low Risk • Safe Corridor',
      weather: 'Clear Skies (11°C)',
      landslide: 'Low (8%)',
      sdrf: 'Post #4 Standby',
      waypoints: ['Jungle Chatti [Safe]', 'Bheembali [Shelter Active]', 'Linchauli [Oxygen Booth]', 'Sanctuary'],
    },
    {
      name: 'Leh, Pangong Tso & Khardung La',
      region: 'Trans-Himalayan High Altitude',
      base: 'Leh Town Base (3,500m)',
      summit: 'Khardung La Pass (5,359m)',
      distance: '39.8 km trail',
      alt: '5,359m',
      riskScore: 38,
      riskText: 'Moderate AMS Vigilance',
      weather: 'Sub-Zero Dry (-2°C)',
      landslide: 'Glacial Scree (18%)',
      sdrf: 'ITBP High-Altitude Unit',
      waypoints: ['South Pullu Checkpost', 'Rinchen Base Camp', 'Khardung Summit (O2 Mandatory)', 'North Nubra'],
    },
    {
      name: 'Munnar & Anamudi Highlands',
      region: 'Western Ghats Bio-Corridor',
      base: 'Munnar Base (1,532m)',
      summit: 'Anamudi Peak (2,695m)',
      distance: '18.5 km trail',
      alt: '2,695m',
      riskScore: 15,
      riskText: 'Low Risk • Favorable',
      weather: 'Misty Rainforest (19°C)',
      landslide: 'Slope Stable (4%)',
      sdrf: 'Kerala Forest Patrol',
      waypoints: ['Eravikulam Gate', 'Rajamalai Sanctuary', 'Tea Highlands Valley', 'Anamudi Ridge'],
    },
    {
      name: 'Vaishno Devi Shrine & Katra',
      region: 'Shivalik Pilgrimage Network',
      base: 'Katra Base Camp (750m)',
      summit: 'Bhavan Sanctuary (1,585m)',
      distance: '12.8 km trail',
      alt: '1,585m',
      riskScore: 18,
      riskText: 'Low Risk • Well Paved',
      weather: 'Clear & Mild (22°C)',
      landslide: 'Fencing Verified (5%)',
      sdrf: 'Shrine Board Command',
      waypoints: ['Banganga Gate', 'Charan Paduka', 'Adhkuwari Gufa Complex', 'Bhavan Complex'],
    },
    {
      name: 'Goa Beaches & Promenade',
      region: 'Coastal Arabian Sea Corridor',
      base: 'Panaji Promenade (4m)',
      summit: 'Arambol & Chapora (65m)',
      distance: '26.4 km coastal route',
      alt: '12m',
      riskScore: 12,
      riskText: 'Low Risk • Leisure',
      weather: 'Warm Sea Breeze (29°C)',
      landslide: 'Zero Hazard (1%)',
      sdrf: 'Drishti Marine Rescue',
      waypoints: ['Miramar Beach Promenade', 'Calangute Coastal Strip', 'Anjuna Rocks', 'Chapora Fort'],
    },
  ];

  const currentPreview = previewDestinations.find((d) => d.name === selectedPreviewDest) || previewDestinations[0];

  const handleSubscribePlan = (_planName: string) => {
    onLaunchMap(selectedPreviewDest);
  };

  const handleOpenDispatchModal = (agencyType: string) => {
    setDispatchAgency(agencyType);
    setDispatchSubmitted(false);
    setIsDispatchModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-emerald-500/30 selection:text-white font-sans antialiased relative overflow-hidden">
      {/* Hero Section */}
      <section id="hero" className="relative mx-auto mt-14 sm:mt-20 max-w-[80rem] px-6 text-center md:px-8">
        {/* Aceternity Large Ambient Background Watermark */}
        <p className="pointer-events-none select-none absolute -top-12 left-1/2 -translate-x-1/2 text-center text-[100px] sm:text-[160px] md:text-[220px] lg:text-[280px] font-extrabold tracking-tighter bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent bg-clip-text text-transparent -z-10 leading-none">
          IGNITE
        </p>

        {/* Magic UI Shimmer Announcement Pill */}
        <div
          onClick={() => onLaunchSimulation()}
          className="backdrop-filter-[12px] inline-flex h-8 items-center justify-between rounded-full border border-white/15 bg-white/5 px-3.5 text-xs text-white transition-all ease-in hover:cursor-pointer hover:bg-white/10 group gap-1.5 shadow-sm"
        >
          <p className="mx-auto max-w-md animate-shimmer bg-clip-text bg-no-repeat bg-gradient-to-r from-neutral-300 via-white via-50% to-neutral-300 inline-flex items-center justify-center font-medium">
            <span>{language === 'hi' ? '✨ प्रस्तुत है IGNITE आपदा-प्रतिरोधी सुरक्षा मैट्रिक्स' : '✨ Introducing IGNITE Tactical Safety Matrix'}</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1.5 size-3.5 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
              <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </p>
        </div>

        {/* Hero Title with Gradient Text */}
        <h1 className="bg-gradient-to-br from-white from-30% to-white/40 bg-clip-text py-6 text-4xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl">
          {language === 'hi' ? (
            <>
              IGNITE पर्वतीय मार्गों पर<br className="hidden md:block" /> सुरक्षित नेविगेशन का नया तरीका है।
            </>
          ) : (
            <>
              IGNITE is the new way<br className="hidden md:block" /> to navigate high-risk mountain routes.
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-base tracking-tight text-gray-400 md:text-xl text-balance max-w-3xl mx-auto leading-relaxed font-normal">
          {language === 'hi' ? (
            'वास्तविक समय उपग्रह रडार, स्वायत्त खतरा पुनर्निर्धारण, 2G ऑफलाइन लचीलापन और पूरे भारत में बहुभाषी एसडीआरएफ एसओएस आपातकालीन सहायता।'
          ) : (
            'Real-time autonomous hazard re-routing, explainable weather risk matrix, offline-first 2G cache, and SDRF multi-agency emergency rescue mesh across India.'
          )}
        </p>

        {/* Hero CTA Button Group */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onLaunchMap(selectedPreviewDest)}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-1 bg-white text-black shadow-lg hover:bg-neutral-200 h-11 px-6 gap-2 rounded-xl cursor-pointer group"
          >
            <span>{language === 'hi' ? 'मुफ्त में शुरू करें' : 'Get Started for free'}</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1">
              <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </button>

          <button
            onClick={() => onSelectTab('simulation')}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border border-white/15 bg-white/5 hover:bg-white/10 text-white h-11 px-5 rounded-xl cursor-pointer gap-2"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'आपदा बेंच डेमो' : 'Simulate Disaster'}</span>
          </button>

          <button
            onClick={onOpenSOS}
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-colors border border-red-500/40 bg-red-950/50 hover:bg-red-900/50 text-red-300 h-11 px-4 rounded-xl cursor-pointer gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{language === 'hi' ? 'एसओएस आपातकाल' : 'Emergency SOS'}</span>
          </button>
        </div>

        {/* Hero Interactive Showcase Frame with Border Beam */}
        <div className="relative mt-16 sm:mt-24 [perspective:2000px] after:absolute after:inset-0 after:z-30 after:[background:linear-gradient(to_top,rgba(0,0,0,0.85)_15%,transparent)]">
          <div className="relative rounded-2xl border border-white/15 bg-white/[0.02] backdrop-blur-xl p-4 sm:p-6 text-left shadow-2xl overflow-hidden before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-30 before:[filter:blur(160px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-two),transparent_40%)]">
            
            {/* Luminous Border Beam Glow Strip */}
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
              <div 
                className="absolute aspect-square bg-gradient-to-l from-[#ffaa40] via-[#9c40ff] to-transparent animate-border-beam" 
                style={{ width: '250px', offsetPath: 'rect(0 auto auto 0 round 20px)' }}
              />
            </div>

            {/* Showcase Dashboard Header */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-2 text-xs font-mono text-slate-300 font-medium flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isWebSocketConnected ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                  IGNITE TACTICAL DASHBOARD v2.4 • PAN-INDIA MESH
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                  SDRF GRID ONLINE
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-slate-300">
                  {currentPreview.region}
                </span>
              </div>
            </div>

            {/* Dynamic Destination Switcher Pills */}
            <div className="relative z-20 flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
              {previewDestinations.map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => setSelectedPreviewDest(dest.name)}
                  className={`btn-tactile shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                    selectedPreviewDest === dest.name
                      ? 'bg-white/15 border-white/40 text-white font-semibold shadow-sm'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {getLocalizedDestinationName(dest.name, language)}
                </button>
              ))}
            </div>

            {/* Live Interactive Telemetry Preview */}
            <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div className="md:col-span-2 rounded-xl bg-black/60 border border-white/10 p-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {getLocalizedDestinationName(currentPreview.name, language)}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/20">
                    LIVE RADAR ACTIVE
                  </span>
                </div>

                <div className="h-44 rounded-lg bg-[#07090e] border border-white/10 p-3 relative flex flex-col justify-between overflow-hidden bg-tactical-grid">
                  <div className="flex items-center justify-between relative z-10 text-xs font-mono">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 target-beacon-pulse" />
                      {currentPreview.base}
                    </span>
                    <span className="text-slate-400 font-mono">{currentPreview.distance}</span>
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      {currentPreview.summit}
                    </span>
                  </div>

                  <div className="relative my-auto py-2">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 w-3/4 rounded-full" />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                      {currentPreview.waypoints.map((wp, idx) => (
                        <span key={idx}>{wp}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs font-mono">
                    <span className="text-slate-400">IMD Sensor: <span className="text-emerald-300 font-semibold">{currentPreview.weather}</span></span>
                    <span className="text-slate-400">Slope Risk: <span className="text-emerald-300 font-semibold">{currentPreview.landslide}</span></span>
                    <span className="text-slate-400">Emergency Unit: <span className="text-cyan-300 font-semibold">{currentPreview.sdrf}</span></span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Live auto-calibrated routing with IMD radar & local SDRF posts.
                  </span>
                  <button
                    onClick={() => onLaunchMap(currentPreview.name)}
                    className="btn-tactile px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 font-semibold text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{language === 'hi' ? 'यह मार्ग खोलें' : 'Open in Tactical Map'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Intelligence Stats */}
              <div className="space-y-3">
                <div className="rounded-xl bg-black/60 border border-white/10 p-4">
                  <div className="text-xs text-slate-400 font-mono uppercase mb-1">Safety Index Score</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-mono text-emerald-400">{100 - currentPreview.riskScore}</span>
                    <span className="text-xs text-emerald-400 font-medium">/ 100 • {currentPreview.riskText}</span>
                  </div>
                  <div className="mt-2 text-xs text-slate-400 leading-relaxed">
                    Verified path protocol with regional shelter telemetry and medical stations.
                  </div>
                </div>

                <div className="rounded-xl bg-black/60 border border-white/10 p-4">
                  <div className="text-xs text-slate-400 font-mono uppercase mb-1">Autonomous Failover</div>
                  <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Zero-Latency Reroute</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400 leading-relaxed">
                    Safe bypass corridors engaged within 450ms of regional hazard alert.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Trusted By Agencies Section */}
      <section id="clients" className="text-center mx-auto max-w-[80rem] px-6 md:px-8 mt-12">
        <div className="py-14">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <h2 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
              TRUSTED & ADAPTED FOR PILGRIMAGE CORRIDORS & SEARCH-AND-RESCUE
            </h2>
            <div className="mt-8">
              <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16 text-slate-400 font-medium text-sm">
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => onSelectTab('explainability')}>
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>SDRF Uttarakhand</span>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => onSelectTab('simulation')}>
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>NDMA India</span>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => onSelectTab('group')}>
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>ITBP High-Altitude</span>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => onSelectTab('map')}>
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>IMD Weather Radar</span>
                </li>
                <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer" onClick={() => onSelectTab('itinerary')}>
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Central Water Commission</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="relative mx-auto max-w-[80rem] px-6 md:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold mb-2">
            Tactical Architecture
          </h4>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Engineered for Extreme Terrains & Zero-Connectivity
          </h2>
          <p className="mt-4 text-base text-gray-400">
            Every layer of IGNITE is built to safeguard lives during rapid weather shifts, flash floods, and remote high-altitude expeditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div onClick={() => onSelectTab('map')} className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 hover:border-white/20 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Autonomous Safe Rerouting</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              When landslides or cloudburst thresholds trigger, the engine automatically recalculates verified escape bypasses and shelter waypoints.
            </p>
          </div>

          <div onClick={() => onSelectTab('map')} className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 hover:border-white/20 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Offline-First 2G Cache</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Complete itineraries, GPS coordinates, oxygen booth waypoints, and emergency protocols stay accessible even with zero cellular signal.
            </p>
          </div>

          <div onClick={() => onSelectTab('explainability')} className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 hover:border-white/20 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Explainable Risk Matrix</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              AI decomposes complex safety conditions into actionable scores: Acute Mountain Sickness (AMS), slope gradient, rainfall, and medical proximity.
            </p>
          </div>

          <div onClick={onOpenSOS} className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 hover:border-red-500/30 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">One-Touch SDRF SOS Beacon</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Instant panic signal dispatches live coordinates, altitude, and group medical state directly to local district disaster response force units.
            </p>
          </div>

          <div onClick={() => onSelectTab('simulation')} className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 hover:border-white/20 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Scenario Disaster Bench</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Stress-test expedition plans against cloudbursts, glacial surges, rockfalls, and heatwaves before you set foot on the mountain trail.
            </p>
          </div>

          <div onClick={() => onSelectTab('group')} className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 hover:border-white/20 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Group Live Mesh Radar</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Track team members within dynamic geofences. Automatically alert leaders when a member falls behind or strays outside the safe corridor.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section with Active Plan Handlers */}
      <section id="pricing">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 py-16 md:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h4 className="text-xl font-bold tracking-tight text-white">Pricing</h4>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mt-2">
              Simple pricing for everyone.
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
              Choose an <strong>affordable plan</strong> that's packed with the best safety features for solo trekkers, guides, and disaster forces.
            </p>
          </div>

          {/* Annual / Monthly Toggle Switch */}
          <div className="flex w-full items-center justify-center space-x-3">
            <button
              type="button"
              role="switch"
              aria-checked={isAnnual}
              onClick={() => setIsAnnual(!isAnnual)}
              className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                isAnnual ? 'bg-white' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`pointer-events-none block h-5 w-5 rounded-full shadow-lg transition-transform ${
                  isAnnual ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-white">Annual</span>
            <span className="inline-block whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase leading-5 tracking-wide text-black">
              2 MONTHS FREE ✨
            </span>
          </div>

          {/* Pricing Cards Grid */}
          <div className="mx-auto grid w-full justify-center sm:grid-cols-2 lg:grid-cols-4 flex-col gap-4">
            {/* Basic Tier */}
            <div className="relative flex max-w-[400px] flex-col gap-6 rounded-2xl border border-white/10 p-6 text-white overflow-hidden bg-white/[0.02]">
              <div>
                <h2 className="text-base font-semibold leading-7 text-white">Basic</h2>
                <p className="text-xs leading-5 text-gray-400 mt-1 min-h-[2.5rem]">A basic plan for solo pilgrims and individual trekkers</p>
              </div>
              <div className="flex flex-row items-baseline gap-1">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-xs text-gray-400">/ month</span>
              </div>
              <button
                onClick={() => handleSubscribePlan('Basic')}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg focus-visible:outline-none bg-white text-black shadow hover:bg-neutral-200 h-10 px-4 py-2 group relative w-full gap-2 overflow-hidden text-sm font-semibold tracking-tighter transition-all cursor-pointer"
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform-gpu bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-96 dark:bg-black" />
                <p>Start Free</p>
              </button>
              <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-500/30 to-neutral-200/0" />
              <ul className="flex flex-col gap-2.5 font-normal text-xs text-gray-300">
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Pan-India 2G offline cache</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>One-touch SOS panic relay</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>5 saved trail routes</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Basic weather radar alerts</span></li>
              </ul>
            </div>

            {/* Premium / Pro Tier */}
            <div className="relative flex max-w-[400px] flex-col gap-6 rounded-2xl p-6 text-white overflow-hidden border-2 border-[var(--color-one)] bg-white/[0.04]">
              <div>
                <h2 className="text-base font-semibold leading-7 text-white">Premium</h2>
                <p className="text-xs leading-5 text-gray-400 mt-1 min-h-[2.5rem]">A premium plan for expedition leaders and mountain guides</p>
              </div>
              <div className="flex flex-row items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{isAnnual ? '$16' : '$20'}</span>
                <span className="text-xs text-gray-400">/ month</span>
              </div>
              <button
                onClick={() => handleSubscribePlan('Premium')}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg focus-visible:outline-none bg-white text-black shadow hover:bg-neutral-200 h-10 px-4 py-2 group relative w-full gap-2 overflow-hidden text-sm font-semibold tracking-tighter transition-all cursor-pointer"
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform-gpu bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-96 dark:bg-black" />
                <p>Subscribe</p>
              </button>
              <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-500/30 to-neutral-200/0" />
              <ul className="flex flex-col gap-2.5 font-normal text-xs text-gray-300">
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Autonomous hazard bypass</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>AI audio safety briefing (EN/HI)</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Group radar up to 25 members</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Full explainable risk matrix</span></li>
              </ul>
            </div>

            {/* Enterprise Tier */}
            <div className="relative flex max-w-[400px] flex-col gap-6 rounded-2xl border border-white/10 p-6 text-white overflow-hidden bg-white/[0.02]">
              <div>
                <h2 className="text-base font-semibold leading-7 text-white">Agency</h2>
                <p className="text-xs leading-5 text-gray-400 mt-1 min-h-[2.5rem]">An agency plan for commercial trekking organizations</p>
              </div>
              <div className="flex flex-row items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{isAnnual ? '$40' : '$50'}</span>
                <span className="text-xs text-gray-400">/ month</span>
              </div>
              <button
                onClick={() => handleOpenDispatchModal('Commercial Trekking Agency')}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg focus-visible:outline-none bg-white text-black shadow hover:bg-neutral-200 h-10 px-4 py-2 group relative w-full gap-2 overflow-hidden text-sm font-semibold tracking-tighter transition-all cursor-pointer"
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform-gpu bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-96 dark:bg-black" />
                <p>Deploy Agency Mesh</p>
              </button>
              <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-500/30 to-neutral-200/0" />
              <ul className="flex flex-col gap-2.5 font-normal text-xs text-gray-300">
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Multi-team fleet telemetry</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>24/7 dedicated rescue support</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Custom weather alert dispatch</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Custom GeoJSON feeds</span></li>
              </ul>
            </div>

            {/* Ultimate / Govt Tier */}
            <div className="relative flex max-w-[400px] flex-col gap-6 rounded-2xl border border-white/10 p-6 text-white overflow-hidden bg-white/[0.02]">
              <div>
                <h2 className="text-base font-semibold leading-7 text-white">Ultimate</h2>
                <p className="text-xs leading-5 text-gray-400 mt-1 min-h-[2.5rem]">The ultimate plan for SDRF & disaster management authorities</p>
              </div>
              <div className="flex flex-row items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{isAnnual ? '$65' : '$80'}</span>
                <span className="text-xs text-gray-400">/ month</span>
              </div>
              <button
                onClick={() => handleOpenDispatchModal('SDRF / National Disaster Agency')}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg focus-visible:outline-none bg-white text-black shadow hover:bg-neutral-200 h-10 px-4 py-2 group relative w-full gap-2 overflow-hidden text-sm font-semibold tracking-tighter transition-all cursor-pointer"
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform-gpu bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-96 dark:bg-black" />
                <p>Govt DEOC Inquiries</p>
              </button>
              <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-500/30 to-neutral-200/0" />
              <ul className="flex flex-col gap-2.5 font-normal text-xs text-gray-300">
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Direct DEOC command integration</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Mass evacuation protocols</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Unlimited disaster bench tests</span></li>
                <li className="flex items-center gap-3"><span className="h-4 w-4 rounded-full bg-green-400 flex items-center justify-center text-black font-bold text-[10px]">✓</span><span>Highest data security & SLA</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative">
        <div className="py-20">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-16">
              {/* Marquee Background Bands */}
              <div className="group flex overflow-hidden p-2 gap-4 flex-row opacity-30 pointer-events-none -delay-[200ms]">
                <div className="flex shrink-0 justify-around gap-4 animate-marquee-slow flex-row">
                  {[...Array(8)].map((_, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-mono text-slate-400">
                      ⚡ SATELLITE RADAR • ZERO-CELL MESH • AUTONOMOUS BYPASS •
                    </span>
                  ))}
                </div>
              </div>
              <div className="group flex overflow-hidden p-2 gap-4 flex-row opacity-20 pointer-events-none">
                <div className="flex shrink-0 justify-around gap-4 animate-marquee-reverse flex-row">
                  {[...Array(8)].map((_, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-mono text-slate-400">
                      🚨 ONE-TOUCH SDRF SOS • 2G CACHE • AMS EXPLAINABILITY •
                    </span>
                  ))}
                </div>
              </div>

              {/* Central Glowing CTA Glass Card */}
              <div className="relative z-10 text-center px-4 mt-6">
                <div className="mx-auto size-20 sm:size-24 rounded-[2rem] border border-white/20 bg-white/5 p-4 shadow-2xl backdrop-blur-md">
                  <HeartHandshake className="mx-auto size-12 sm:size-14 text-white" />
                </div>
                <div className="mt-5 flex flex-col items-center text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                    Stop wasting time on unprepared expeditions.
                  </h2>
                  <p className="mt-2 text-gray-400 text-sm max-w-md">
                    Start navigating safely today. Real-time autonomous safety matrix with zero delay.
                  </p>
                  <button
                    onClick={() => onLaunchMap(selectedPreviewDest)}
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border border-white/20 bg-white text-black shadow-md hover:bg-neutral-200 h-10 group mt-6 rounded-[2rem] px-6 cursor-pointer"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                  </button>
                </div>
                <div className="absolute inset-0 -z-10 rounded-full bg-white/5 opacity-40 blur-2xl" />
              </div>

              <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-black to-70%" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-screen-xl xl:pb-2">
          <div className="md:flex md:justify-between px-8 p-4 py-16 sm:pb-16 gap-8">
            <div className="mb-12 flex-col flex gap-4 max-w-xs">
              <a className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab('overview')}>
                <IgniteLogo size="sm" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">IGNITE</span>
              </a>
              <p className="text-sm text-gray-400">
                Pan-India Autonomous Mountain Safety & Disaster Resilience Infrastructure
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm tracking-tighter font-medium text-white uppercase">Product</h2>
                <ul className="gap-2.5 grid text-sm text-gray-400">
                  <li><a onClick={() => onSelectTab('map')} className="cursor-pointer hover:text-white duration-200">Tactical Map & Planner</a></li>
                  <li><a onClick={() => onSelectTab('itinerary')} className="cursor-pointer hover:text-white duration-200">Safe Itinerary</a></li>
                  <li><a onClick={() => onSelectTab('explainability')} className="cursor-pointer hover:text-white duration-200">Risk Matrix</a></li>
                  <li><a onClick={() => onSelectTab('simulation')} className="cursor-pointer hover:text-white duration-200">Disaster Bench</a></li>
                </ul>
              </div>

              <div>
                <h2 className="mb-6 text-sm tracking-tighter font-medium text-white uppercase">Safety Grid</h2>
                <ul className="gap-2.5 grid text-sm text-gray-400">
                  <li><a onClick={onOpenSOS} className="cursor-pointer hover:text-red-400 duration-200">SDRF SOS Panic Relay</a></li>
                  <li><a onClick={() => onSelectTab('simulation')} className="cursor-pointer hover:text-white duration-200">IMD Doppler Radar Bench</a></li>
                  <li><a onClick={() => onSelectTab('group')} className="cursor-pointer hover:text-white duration-200">Group Live Radar</a></li>
                  <li><a onClick={() => onSelectTab('map')} className="cursor-pointer hover:text-white duration-200">Offline P2P Mesh</a></li>
                </ul>
              </div>

              <div>
                <h2 className="mb-6 text-sm tracking-tighter font-medium text-white uppercase">Architecture</h2>
                <ul className="gap-2.5 grid text-sm text-gray-400">
                  <li><span className="text-gray-300 font-mono text-xs">Overpass QL & OSRM Engine</span></li>
                  <li><span className="text-gray-300 font-mono text-xs">Open-Meteo Multi-Model Sensor</span></li>
                  <li><span className="text-gray-300 font-mono text-xs">Deterministic AMS & Slope Matrix</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-white/10 py-6 px-8 gap-4">
            <span className="text-xs text-gray-500">
              Copyright © 2026 <span className="text-white font-medium">IGNITE</span>. All Rights Reserved.
            </span>
            <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
              <span>PostGIS • Leaflet • Open-Meteo • Redis TTL</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Agency & Govt Dispatch Modal */}
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
                    Direct integration with state disaster command centers (DEOC), forest departments, and commercial expedition leaders.
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
                  <Check className="w-6 h-6" />
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
