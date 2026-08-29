import React, { useState } from 'react';
import {
  ArrowRight,
  Shield,
  Radio,
  AlertTriangle,
  WifiOff,
  Users,
  Activity,
  Zap,
  CheckCircle2,
  Compass,
  Mountain,
  Trees,
  Palmtree,
  Landmark,
  Star,
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
}) => {
  const [selectedCircuit, setSelectedCircuit] = useState('himalayan');

  // Curated Pan-India Coverage by Geographic & Risk Terrain
  const circuits = [
    {
      id: 'himalayan',
      name: 'Himalayan High Altitude & Pilgrimage',
      name_hi: 'हिमालयी उच्च क्षेत्र एवं तीर्थ कॉरिडोर',
      icon: Mountain,
      badge: 'Uttarakhand, Himachal, J&K',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      destinations: [
        {
          name: 'Kedarnath Dham & Valley',
          state: 'Uttarakhand',
          elevation: '3,583m',
          terrain: 'Glacial Alpine Trail',
          safetyScore: 92,
          safetyText: 'Verified Safe',
          rescueAgency: 'SDRF 7th Bn Standby',
          keyFeatures: ['AMS Acclimatization Booths', 'Slope Stability Monitored', '14.2 km Verified Track'],
        },
        {
          name: 'Badrinath & Mana Border',
          state: 'Uttarakhand',
          elevation: '3,133m',
          terrain: 'Alaknanda River Corridor',
          safetyScore: 88,
          safetyText: 'Clear Corridor',
          rescueAgency: 'ITBP & SDRF Command',
          keyFeatures: ['Vasudhara Falls Bypass', 'Bridge Sensors Online', 'Helipad Rescue Ready'],
        },
        {
          name: 'Gangotri & Gaumukh Glacier',
          state: 'Uttarakhand',
          elevation: '4,023m',
          terrain: 'Glacial Moraine Track',
          safetyScore: 84,
          safetyText: 'Extreme Altitude',
          rescueAgency: 'Forest & SDRF Patrol',
          keyFeatures: ['Glacial Surges Tracked', 'Bhojbasa Night Shelter', 'O2 Satellite Relay'],
        },
        {
          name: 'Vaishno Devi Shrine & Katra',
          state: 'Jammu & Kashmir',
          elevation: '1,585m',
          terrain: 'Trikuta Shivalik Path',
          safetyScore: 95,
          safetyText: 'Optimal Safety',
          rescueAgency: 'Shrine Board & CRPF',
          keyFeatures: ['Automated Landslide Fences', 'Medical Posts Every 1km', 'Paved Track'],
        },
      ],
    },
    {
      id: 'trans_himalayan',
      name: 'Trans-Himalayan Passes & Cold Deserts',
      name_hi: 'ट्रांस-हिमालयी दर्रे एवं शीत मरुस्थल',
      icon: Compass,
      badge: 'Ladakh & Lahaul Spiti',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      destinations: [
        {
          name: 'Leh, Pangong Tso & Khardung La',
          state: 'Ladakh',
          elevation: '5,359m',
          terrain: 'Sub-Zero Scree & Passes',
          safetyScore: 82,
          safetyText: 'AMS Protocol Required',
          rescueAgency: 'ITBP High-Altitude Rescue',
          keyFeatures: ['Mandatory 48h Rest Flag', 'Oxygen Bar Checkpoints', 'Military Mesh Telemetry'],
        },
        {
          name: 'Spiti Valley & Kunzum Pass',
          state: 'Himachal Pradesh',
          elevation: '4,590m',
          terrain: 'Remote Mountain Passes',
          safetyScore: 80,
          safetyText: 'Remote Terrain',
          rescueAgency: 'HP State Disaster Unit',
          keyFeatures: ['Zero-Cell Offline Routing', 'Fuel & Shelter Waypoints', 'River Ford Radar'],
        },
        {
          name: 'Nubra Valley & Hunder Dunes',
          state: 'Ladakh',
          elevation: '3,048m',
          terrain: 'Shyok River Basin',
          safetyScore: 90,
          safetyText: 'Stable Corridor',
          rescueAgency: 'Diskit District Medical',
          keyFeatures: ['Flash Flood Sensors', 'Khardung La Weather Link', 'Tourist Health Grid'],
        },
      ],
    },
    {
      id: 'western_ghats',
      name: 'Western Ghats & Southern Highlands',
      name_hi: 'पश्चिमी घाट एवं दक्षिणी पर्वतमाला',
      icon: Trees,
      badge: 'Kerala, Tamil Nadu, Karnataka',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      destinations: [
        {
          name: 'Munnar & Anamudi Highlands',
          state: 'Kerala',
          elevation: '2,695m',
          terrain: 'Rainforest & Tea Escarpments',
          safetyScore: 94,
          safetyText: 'Favorable Weather',
          rescueAgency: 'Kerala Forest & Fire Force',
          keyFeatures: ['Monsoon Flood Predictor', 'Wildlife Buffer Alert', '18.5 km Eco-Trail'],
        },
        {
          name: 'Wayanad & Chembra Peak',
          state: 'Kerala',
          elevation: '2,100m',
          terrain: 'Dense Canopy Ridge',
          safetyScore: 86,
          safetyText: 'Slope Warning Active',
          rescueAgency: 'District Disaster Unit',
          keyFeatures: ['Landslide Real-time Radar', 'Heart Lake Safe Path', 'Local Guide P2P Mesh'],
        },
        {
          name: 'Coorg & Brahmagiri Range',
          state: 'Karnataka',
          elevation: '1,608m',
          terrain: 'Western Ghat Shola Forest',
          safetyScore: 92,
          safetyText: 'Clear Paths',
          rescueAgency: 'Karnataka SDRF Unit',
          keyFeatures: ['River Crossing Telemetry', 'Iruppu Falls Safety Zone', 'Offline Topo Maps'],
        },
      ],
    },
    {
      id: 'coastal',
      name: 'Coastal & Marine Safety Corridors',
      name_hi: 'तटीय एवं समुद्री सुरक्षा कॉरिडोर',
      icon: Palmtree,
      badge: 'Goa, Andaman, Tamil Nadu',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      destinations: [
        {
          name: 'Goa Beaches & Promenade',
          state: 'Goa',
          elevation: '12m',
          terrain: 'Arabian Coastal Promenade',
          safetyScore: 96,
          safetyText: 'Optimal Conditions',
          rescueAgency: 'Drishti Marine Lifesavers',
          keyFeatures: ['High Tide Early Alert', 'Safe Swimming Geofence', 'Lifeguard Tower Comms'],
        },
        {
          name: 'Havelock Island & Radhanagar',
          state: 'Andaman & Nicobar',
          elevation: '18m',
          terrain: 'Coral Island Coast',
          safetyScore: 93,
          safetyText: 'Clear Waters',
          rescueAgency: 'Indian Coast Guard Unit',
          keyFeatures: ['Tsunami & Surge Sensor', 'Reef Hazard Mapping', 'Ferry Safe Schedules'],
        },
        {
          name: 'Gokarna & Om Beach Cliffs',
          state: 'Karnataka',
          elevation: '45m',
          terrain: 'Rocky Coastal Trail',
          safetyScore: 90,
          safetyText: 'Stable Cliffs',
          rescueAgency: 'Coastal Police Patrol',
          keyFeatures: ['Cliff Edge Warnings', 'Tide Timetable Sync', 'P2P Beach Rescue Mesh'],
        },
      ],
    },
    {
      id: 'heritage',
      name: 'Royal Heritage & Sacred Corridors',
      name_hi: 'विरासत, किले एवं सांस्कृतिक कॉरिडोर',
      icon: Landmark,
      badge: 'Rajasthan, UP, Karnataka',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      destinations: [
        {
          name: 'Jaipur, Amer Fort & Hawa Mahal',
          state: 'Rajasthan',
          elevation: '431m',
          terrain: 'Aravalli Fort Enclosures',
          safetyScore: 95,
          safetyText: 'Well Protected',
          rescueAgency: 'Rajasthan Tourist Police',
          keyFeatures: ['Heatwave Hydration Hubs', 'Crowd Density Radar', 'Historical Walking Grid'],
        },
        {
          name: 'Kashi Vishwanath & Ghats',
          state: 'Uttar Pradesh',
          elevation: '80m',
          terrain: 'Ganges River Corridor',
          safetyScore: 91,
          safetyText: 'Active Safety Grid',
          rescueAgency: 'NDRF Varanasi Battalion',
          keyFeatures: ['River Water Level Monitor', 'Ghat Congestion Bypass', 'Multi-Language SOS'],
        },
        {
          name: 'Hampi UNESCO Ruins',
          state: 'Karnataka',
          elevation: '467m',
          terrain: 'Tungabhadra Boulder Basin',
          safetyScore: 92,
          safetyText: 'Open & Clear',
          rescueAgency: 'Heritage Security Unit',
          keyFeatures: ['Rocky Trail Geofence', 'Tungabhadra Coracle Radar', 'Emergency Shelter Map'],
        },
      ],
    },
  ];

  const activeCircuitData = circuits.find((c) => c.id === selectedCircuit) || circuits[0];

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-emerald-500/30 selection:text-white font-sans antialiased relative overflow-hidden">
      {/* 1. Plume Editorial Hero Section with Living Background Mesh */}
      <section
        id="hero"
        className="relative mx-auto mt-6 sm:mt-10 max-w-[88rem] px-4 sm:px-6 text-center md:px-8 pt-10 pb-14 rounded-3xl overflow-hidden"
      >
        {/* Animated Background Layers (Strictly z-0 behind content) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* A. Topographic Contour Line Terrain Mesh */}
          <div className="absolute inset-0 opacity-15 animate-hero-contour">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="contour-pattern" width="180" height="180" patternUnits="userSpaceOnUse">
                  <path
                    d="M0 45 Q 45 15, 90 45 T 180 45 M0 90 Q 45 60, 90 90 T 180 90 M0 135 Q 45 105, 90 135 T 180 135"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="0.8"
                  />
                  <circle cx="90" cy="90" r="30" fill="none" stroke="rgba(255, 107, 53, 0.4)" strokeWidth="0.6" strokeDasharray="4 4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#contour-pattern)" />
            </svg>
          </div>

          {/* B. Morphing Amber / Orange / Red Living Orbs (High Luminance) */}
          {/* Orb 1: Warm Amber (Center-Left) */}
          <div
            className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[350px] sm:h-[450px] rounded-full blur-[70px] animate-hero-orb-1 opacity-70"
            style={{
              background: 'radial-gradient(circle, rgba(255, 107, 53, 0.65) 0%, rgba(232, 93, 4, 0.30) 45%, transparent 70%)',
            }}
          />

          {/* Orb 2: Radiant Flame Orange (Center-Right) */}
          <div
            className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[650px] h-[320px] sm:h-[420px] rounded-full blur-[70px] animate-hero-orb-2 opacity-65"
            style={{
              background: 'radial-gradient(circle, rgba(255, 140, 0, 0.60) 0%, rgba(255, 87, 34, 0.25) 45%, transparent 70%)',
            }}
          />

          {/* Orb 3: Deep Warm Crimson Low-Center */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[650px] sm:w-[850px] h-[280px] sm:h-[360px] rounded-full blur-[80px] animate-hero-orb-3 opacity-60"
            style={{
              background: 'radial-gradient(ellipse, rgba(230, 57, 70, 0.50) 0%, rgba(255, 107, 53, 0.20) 45%, transparent 70%)',
            }}
          />

          {/* C. Faint Rotating Radar-Sweep Line / Wedge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] pointer-events-none opacity-40">
            <div
              className="w-full h-full rounded-full animate-hero-radar"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, transparent 290deg, rgba(255, 107, 53, 0.15) 320deg, rgba(255, 180, 0, 0.65) 360deg)',
                maskImage: 'radial-gradient(circle at center, black 15%, transparent 68%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 15%, transparent 68%)',
              }}
            />
          </div>
        </div>

        {/* Inner Content Container sitting securely on top (z-10) */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Plume Editorial Headline */}
          <h1 className="font-display py-4 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-md max-w-5xl mx-auto">
            {language === 'hi' ? (
              <>
                भारत के हर दुर्गम मार्ग पर<br className="hidden md:block" /> <span className="text-[#FF6B35] italic">स्वायत्त व सुरक्षित</span> नेविगेशन।
              </>
            ) : (
              <>
                Navigate High-Risk Trails &<br className="hidden md:block" /> Remote India with <span className="text-[#FF6B35] italic">Total Safety.</span>
              </>
            )}
          </h1>

          {/* Plume Editorial Subheading */}
          <p className="mb-8 text-base font-normal tracking-tight text-slate-200 md:text-xl text-balance max-w-3xl mx-auto leading-relaxed font-sans">
            {language === 'hi' ? (
              'वास्तविक समय उपग्रह मौसम रडार, स्वायत्त भूस्खलन बाईपास, एएमएस हाइपोक्सिया विश्लेषण और सभी 28 राज्यों व 8 केंद्र शासित प्रदेशों में बहु-एजेंसी आपातकालीन बचाव सहायता।'
            ) : (
              'Real-time IMD weather radar, autonomous hazard re-routing, explainable AMS hypoxia prediction, and multi-agency emergency rescue coverage across all 28 States & 8 UTs.'
            )}
          </p>

          {/* Plume Hero Action Button Group */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            <button
              onClick={() => onLaunchMap('Kedarnath Dham & Valley')}
              className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all bg-[#FF6B35] hover:bg-[#E85D04] text-white shadow-2xl shadow-[#FF6B35]/40 h-11 px-6 gap-2 rounded-xl cursor-pointer group"
            >
              <span>{language === 'hi' ? 'नक्शा व योजना शुरू करें' : 'Launch Tactical Map & Planner'}</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                onLaunchSimulation();
                onSelectTab('simulation');
              }}
              className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors border border-white/25 bg-black/50 hover:bg-white/15 text-white h-11 px-5 rounded-xl cursor-pointer gap-2 shadow-md font-mono backdrop-blur-sm"
            >
              <Radio className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'आपदा सिमुलेटर' : 'Simulate Disaster Bench'}</span>
            </button>

            <button
              onClick={onOpenSOS}
              className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-colors border border-red-500/60 bg-red-600 hover:bg-red-500 text-white h-11 px-4 rounded-xl cursor-pointer gap-2 shadow-xl font-mono"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{language === 'hi' ? 'एसओएस आपातकाल' : 'Emergency SOS'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Plume Pan-India Live Safety Grid & Coverage Explorer */}
      <section id="coverage" className="relative mx-auto max-w-[84rem] px-4 sm:px-6 md:px-8 mt-12">
        {/* 2.1 Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto mb-16 text-left">
          <div className="p-4 rounded-2xl bg-[#0e1017]/95 border border-white/15 backdrop-blur-md shadow-lg">
            <div className="text-xs font-mono text-[#FF6B35] uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
              Pan-India Grid
            </div>
            <div className="text-2xl font-extrabold text-white mt-1 font-display">28 States & 8 UTs</div>
            <div className="text-xs text-slate-300 mt-0.5">Highways, trails & pilgrimages</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1017]/95 border border-white/15 backdrop-blur-md shadow-lg">
            <div className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              SDRF Standby
            </div>
            <div className="text-2xl font-extrabold text-white mt-1 font-display">500+ Posts</div>
            <div className="text-xs text-slate-300 mt-0.5">Direct DEOC & ITBP telemetry</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1017]/95 border border-white/15 backdrop-blur-md shadow-lg">
            <div className="text-xs font-mono text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              AI Physiology
            </div>
            <div className="text-2xl font-extrabold text-white mt-1 font-display">AMS Hypoxia</div>
            <div className="text-xs text-slate-300 mt-0.5">Altitude & oxygen risk scoring</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1017]/95 border border-white/15 backdrop-blur-md shadow-lg">
            <div className="text-xs font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Terrain Radar
            </div>
            <div className="text-2xl font-extrabold text-white mt-1 font-display">Auto Bypass</div>
            <div className="text-xs text-slate-300 mt-0.5">Instant reroute on cloudburst/hazard</div>
          </div>
        </div>

        {/* 2.2 Interactive Pan-India Coverage Explorer */}
        <div className="relative mx-auto max-w-[84rem] text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3 border-b border-white/15 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#FF6B35] font-bold">
                PAN-INDIA COVERAGE & SAFETY GRIDS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1 font-display">
                Explore Protected Circuits Across India
              </h2>
              <p className="text-sm text-slate-300 mt-1 font-sans">
                Select a geographic corridor to view live safety scores, mountain elevations, and emergency force readiness.
              </p>
            </div>
          </div>

          {/* Circuit Category Navigation Buttons */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 no-scrollbar">
            {circuits.map((circuit) => {
              const Icon = circuit.icon;
              const isActive = selectedCircuit === circuit.id;
              return (
                <button
                  key={circuit.id}
                  onClick={() => setSelectedCircuit(circuit.id)}
                  className={`btn-tactile shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border flex items-center gap-2 font-mono ${
                    isActive
                      ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-lg shadow-[#FF6B35]/25 scale-[1.02]'
                      : 'bg-[#0f121d] border-white/15 text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FF6B35]'}`} />
                  <span>{circuit.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Circuit Header Info */}
          <div className="flex items-center justify-between mt-2 mb-4 px-1">
            <span className="text-xs font-mono text-slate-300">
              Region: <strong className="text-white">{activeCircuitData.badge}</strong>
            </span>
            <span className="text-xs font-mono text-[#FF6B35] font-semibold">
              {activeCircuitData.destinations.length} Key Routes Active
            </span>
          </div>

          {/* Grid of Protected Destinations in Selected Circuit */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeCircuitData.destinations.map((dest) => (
              <div
                key={dest.name}
                className="rounded-2xl border border-white/15 bg-[#0e1017]/95 p-5 backdrop-blur-xl hover:border-[#FF6B35]/60 transition-all flex flex-col justify-between shadow-xl group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-200 border border-white/15">
                      {dest.state}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      {dest.safetyScore}/100 Safe
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#FF6B35] transition-colors font-display">
                    {getLocalizedDestinationName(dest.name, language)}
                  </h3>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-300 mt-2 pb-3 border-b border-white/10">
                    <span>🏔 {dest.elevation}</span>
                    <span>•</span>
                    <span className="text-slate-300 truncate">{dest.terrain}</span>
                  </div>

                  <div className="space-y-1.5 mt-3 text-xs text-slate-300">
                    <div className="text-[11px] font-mono text-cyan-300 font-semibold flex items-center gap-1">
                      <Shield className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="truncate">{dest.rescueAgency}</span>
                    </div>

                    <ul className="space-y-1 mt-2 text-[11px] text-slate-300 font-sans">
                      {dest.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchMap(dest.name)}
                  className="btn-tactile w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#FF6B35] hover:text-white cursor-pointer flex items-center justify-center gap-1.5 mt-5 shadow-md transition-colors"
                >
                  <span>{language === 'hi' ? 'यह मार्ग बनाएं' : 'Synthesize Route Plan'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Core Tactical Capabilities Grid (High Visibility) */}
      <section id="features" className="relative mx-auto max-w-[84rem] px-6 md:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-[#FF6B35] font-bold">
            TACTICAL ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2 font-display">
            Engineered for Zero-Connectivity & Extreme Terrains
          </h2>
          <p className="mt-3 text-base text-slate-300 font-sans">
            Every layer of IGNITE is designed to protect lives during flash floods, cloudbursts, and high-altitude hypoxia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div onClick={() => onSelectTab('map')} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-[#FF6B35]/60 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/20 border border-[#FF6B35]/40 flex items-center justify-center text-[#FF6B35] mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Autonomous Safe Rerouting</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              When landslides or cloudburst thresholds trigger, the engine automatically recalculates verified escape bypasses and shelter waypoints within 450ms.
            </p>
          </div>

          <div onClick={() => onSelectTab('map')} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 group-hover:scale-105 transition-transform">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Offline-First 2G Cache</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Complete itineraries, GPS coordinates, oxygen booth waypoints, and emergency protocols stay 100% accessible even with zero cellular signal.
            </p>
          </div>

          <div onClick={() => onSelectTab('explainability')} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-amber-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Explainable Risk Matrix</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              AI decomposes complex safety conditions into actionable sub-scores: Acute Mountain Sickness (AMS), slope gradient, rainfall, and audio safety briefings.
            </p>
          </div>

          <div onClick={onOpenSOS} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-red-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-300 mb-4 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">One-Touch SDRF SOS Beacon</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Instant panic signal dispatches live coordinates, altitude, and group medical state directly to local district disaster response force units.
            </p>
          </div>

          <div onClick={() => onSelectTab('simulation')} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-purple-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-105 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Multi-Scenario Disaster Bench</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Stress-test expedition plans against cloudbursts, glacial surges, rockfalls, and heatwaves before you set foot on the mountain trail.
            </p>
          </div>

          <div onClick={() => onSelectTab('group')} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Group Live Mesh Radar</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Track team members within dynamic geofences. Automatically alert leaders when a member falls behind or strays outside the safe corridor.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Sliding Reviews & Social Proof Section */}
      <section id="reviews" className="relative mx-auto max-w-[100vw] overflow-hidden py-16">
        <div className="max-w-[84rem] mx-auto px-6 md:px-8 mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF6B35]/15 border border-[#FF6B35]/40 text-[#FF6B35] text-xs font-mono font-bold mb-3 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-[#FF6B35] text-[#FF6B35]" />
            <span>TRUSTED BY 28,400+ EXPEDITIONS & PILGRIMS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Saved Lives on India's Most Extreme Corridors
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From Kedarnath cloudbursts and Khardung La blizzards to coastal marine squalls, hear from pilgrims, mountain guides, and SDRF rescue forces.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold text-sm">★ 4.96 / 5.0</span> Rating
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% Offline 2G Reliability</span>
            <span>•</span>
            <span className="text-cyan-300 font-semibold">500+ Rescue Missions Supported</span>
          </div>
        </div>

        {/* Sliding Marquee Row 1 (Forward) */}
        <div className="group relative flex overflow-hidden py-2 hover-pause">
          <div className="flex shrink-0 gap-5 animate-marquee flex-row">
            {[
              {
                name: 'Col. Vikramaditya Rawat (Retd.)',
                role: 'Himalayan Expedition Leader, Uttarakhand',
                avatar: 'VR',
                stars: 5,
                tag: 'Kedarnath & Valley',
                review:
                  'IGNITE’s autonomous landslide bypass redirected our 18-member group away from an active scree slide near Linchauli in Kedarnath. It literally saved lives.',
              },
              {
                name: 'Sunita & Rameshwar Sharma',
                role: 'Char Dham Senior Pilgrims, Delhi',
                avatar: 'SS',
                stars: 5,
                tag: 'Badrinath Circuit',
                review:
                  'As senior citizens traveling to Badrinath and Kedarnath, the offline 2G health checks and AMS warnings gave our family complete peace of mind.',
              },
              {
                name: 'Inspector Rajesh Negi',
                role: 'SDRF Operations Commander, Sector 4',
                avatar: 'RN',
                stars: 5,
                tag: 'Disaster Force Grid',
                review:
                  'The direct DEOC panic telemetry connects with zero latency. Being able to see exact GPS and medical status before dispatching rescue teams is a game-changer.',
              },
              {
                name: 'Tsering Angchok',
                role: 'Ladakh High-Altitude Mountain Guide',
                avatar: 'TA',
                stars: 5,
                tag: 'Khardung La Pass (5,359m)',
                review:
                  'We crossed Khardung La and Pangong with zero cellular coverage. The offline topo cache and altitude acclimatization tracker worked flawlessly.',
              },
            ].map((rev, i) => (
              <div
                key={i}
                className="w-[340px] sm:w-[420px] shrink-0 rounded-2xl border border-white/15 bg-[#0e1017]/95 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.stars)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                      {rev.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                    "{rev.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-black">
                    {rev.avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{rev.name}</div>
                    <div className="text-[11px] text-slate-400">{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Duplicate loop for seamless infinite slide */}
          <div className="flex shrink-0 gap-5 animate-marquee flex-row aria-hidden">
            {[
              {
                name: 'Col. Vikramaditya Rawat (Retd.)',
                role: 'Himalayan Expedition Leader, Uttarakhand',
                avatar: 'VR',
                stars: 5,
                tag: 'Kedarnath & Valley',
                review:
                  'IGNITE’s autonomous landslide bypass redirected our 18-member group away from an active scree slide near Linchauli in Kedarnath. It literally saved lives.',
              },
              {
                name: 'Sunita & Rameshwar Sharma',
                role: 'Char Dham Senior Pilgrims, Delhi',
                avatar: 'SS',
                stars: 5,
                tag: 'Badrinath Circuit',
                review:
                  'As senior citizens traveling to Badrinath and Kedarnath, the offline 2G health checks and AMS warnings gave our family complete peace of mind.',
              },
              {
                name: 'Inspector Rajesh Negi',
                role: 'SDRF Operations Commander, Sector 4',
                avatar: 'RN',
                stars: 5,
                tag: 'Disaster Force Grid',
                review:
                  'The direct DEOC panic telemetry connects with zero latency. Being able to see exact GPS and medical status before dispatching rescue teams is a game-changer.',
              },
              {
                name: 'Tsering Angchok',
                role: 'Ladakh High-Altitude Mountain Guide',
                avatar: 'TA',
                stars: 5,
                tag: 'Khardung La Pass (5,359m)',
                review:
                  'We crossed Khardung La and Pangong with zero cellular coverage. The offline topo cache and altitude acclimatization tracker worked flawlessly.',
              },
            ].map((rev, i) => (
              <div
                key={`dup-${i}`}
                className="w-[340px] sm:w-[420px] shrink-0 rounded-2xl border border-white/15 bg-[#0e1017]/95 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.stars)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                      {rev.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                    "{rev.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-xs text-black">
                    {rev.avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{rev.name}</div>
                    <div className="text-[11px] text-slate-400">{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sliding Marquee Row 2 (Reverse) */}
        <div className="group relative flex overflow-hidden py-3 hover-pause">
          <div className="flex shrink-0 gap-5 animate-marquee-reverse flex-row">
            {[
              {
                name: 'Dr. Ananya Iyer',
                role: 'Wilderness Medic & Trekker, Munnar',
                avatar: 'AI',
                stars: 5,
                tag: 'Western Ghats Corridor',
                review:
                  'The explainable AMS and hypoxia risk scoring is scientifically spot-on. Essential for high-altitude Western Ghats and Himalayan routes.',
              },
              {
                name: 'Kavita Deshmukh',
                role: 'Solo Trekker, Maharashtra',
                avatar: 'KD',
                stars: 5,
                tag: 'Spiti Valley Route',
                review:
                  'The one-touch SOS beacon with offline coordinate caching gave me the confidence to solo-trek through remote Himachal and Spiti passes.',
              },
              {
                name: 'Arjun Nair',
                role: 'Marine Safety Coordinator, Goa',
                avatar: 'AN',
                stars: 5,
                tag: 'Arabian Sea Promenade',
                review:
                  'Tide prediction and sea surge alerts kept our tourist watersports groups well out of harm’s way during erratic coastal squalls.',
              },
              {
                name: 'Harishchandra Joshi',
                role: 'Katra Yatra Coordinator, J&K',
                avatar: 'HJ',
                stars: 5,
                tag: 'Vaishno Devi Shrine',
                review:
                  'Over 500 pilgrims in our group used the offline itinerary and medical checkpoint map without a single glitch during monsoon season.',
              },
            ].map((rev, i) => (
              <div
                key={i}
                className="w-[340px] sm:w-[420px] shrink-0 rounded-2xl border border-white/15 bg-[#0e1017]/95 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.stars)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                      {rev.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                    "{rev.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-purple-500 flex items-center justify-center font-bold text-xs text-black">
                    {rev.avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{rev.name}</div>
                    <div className="text-[11px] text-slate-400">{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Duplicate loop for seamless infinite reverse slide */}
          <div className="flex shrink-0 gap-5 animate-marquee-reverse flex-row aria-hidden">
            {[
              {
                name: 'Dr. Ananya Iyer',
                role: 'Wilderness Medic & Trekker, Munnar',
                avatar: 'AI',
                stars: 5,
                tag: 'Western Ghats Corridor',
                review:
                  'The explainable AMS and hypoxia risk scoring is scientifically spot-on. Essential for high-altitude Western Ghats and Himalayan routes.',
              },
              {
                name: 'Kavita Deshmukh',
                role: 'Solo Trekker, Maharashtra',
                avatar: 'KD',
                stars: 5,
                tag: 'Spiti Valley Route',
                review:
                  'The one-touch SOS beacon with offline coordinate caching gave me the confidence to solo-trek through remote Himachal and Spiti passes.',
              },
              {
                name: 'Arjun Nair',
                role: 'Marine Safety Coordinator, Goa',
                avatar: 'AN',
                stars: 5,
                tag: 'Arabian Sea Promenade',
                review:
                  'Tide prediction and sea surge alerts kept our tourist watersports groups well out of harm’s way during erratic coastal squalls.',
              },
              {
                name: 'Harishchandra Joshi',
                role: 'Katra Yatra Coordinator, J&K',
                avatar: 'HJ',
                stars: 5,
                tag: 'Vaishno Devi Shrine',
                review:
                  'Over 500 pilgrims in our group used the offline itinerary and medical checkpoint map without a single glitch during monsoon season.',
              },
            ].map((rev, i) => (
              <div
                key={`dup-${i}`}
                className="w-[340px] sm:w-[420px] shrink-0 rounded-2xl border border-white/15 bg-[#0e1017]/95 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.stars)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                      {rev.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans italic">
                    "{rev.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-purple-500 flex items-center justify-center font-bold text-xs text-black">
                    {rev.avatar}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{rev.name}</div>
                    <div className="text-[11px] text-slate-400">{rev.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Clean Professional Footer */}
      <footer className="border-t border-white/15 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[84rem] px-6 sm:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/15">
            <div className="flex items-center gap-3">
              <IgniteLogo size="sm" />
              <div>
                <span className="text-xl font-bold text-white tracking-tight">IGNITE</span>
                <p className="text-xs text-slate-300">Pan-India Autonomous Mountain Safety & Disaster Resilience</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs font-medium">
              <button onClick={() => onSelectTab('map')} className="text-slate-300 hover:text-white cursor-pointer transition-colors">Tactical Map</button>
              <button onClick={() => onSelectTab('itinerary')} className="text-slate-300 hover:text-white cursor-pointer transition-colors">Safe Itinerary</button>
              <button onClick={() => onSelectTab('explainability')} className="text-slate-300 hover:text-white cursor-pointer transition-colors">Risk Matrix</button>
              <button onClick={() => onSelectTab('simulation')} className="text-slate-300 hover:text-white cursor-pointer transition-colors">Disaster Bench</button>
              <button onClick={onOpenSOS} className="text-red-400 hover:text-red-300 cursor-pointer font-bold transition-colors">SOS Panic Relay</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 text-xs text-slate-400 gap-3 font-mono">
            <span>Copyright © 2026 <strong className="text-white">IGNITE</strong>. All Rights Reserved.</span>
            <span>OpenStreetMap • Open-Meteo • SDRF Multi-Agency Data Fusion</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
