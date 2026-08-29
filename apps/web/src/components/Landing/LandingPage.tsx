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
  Zap,
  Building,
  Send,
  X,
  CheckCircle2,
  Compass,
  Mountain,
  Trees,
  Palmtree,
  Landmark,
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
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchAgency, setDispatchAgency] = useState('SDRF / Disaster Management Unit');
  const [dispatchSubmitted, setDispatchSubmitted] = useState(false);

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

  const handleOpenDispatchModal = (agencyType: string) => {
    setDispatchAgency(agencyType);
    setDispatchSubmitted(false);
    setIsDispatchModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-emerald-500/30 selection:text-white font-sans antialiased relative overflow-hidden">
      {/* 1. Hero Title & Summary Section */}
      <section id="hero" className="relative mx-auto mt-12 sm:mt-16 max-w-[84rem] px-4 sm:px-6 text-center md:px-8">
        {/* Aceternity Large Ambient Background Watermark */}
        <p className="pointer-events-none select-none absolute -top-12 left-1/2 -translate-x-1/2 text-center text-[100px] sm:text-[160px] md:text-[220px] lg:text-[280px] font-extrabold tracking-tighter bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent bg-clip-text text-transparent -z-10 leading-none">
          IGNITE
        </p>

        {/* Shimmer Announcement Pill */}
        <div
          onClick={() => onLaunchSimulation()}
          className="backdrop-filter-[12px] inline-flex h-8 items-center justify-between rounded-full border border-white/20 bg-white/10 px-4 text-xs text-white transition-all ease-in hover:cursor-pointer hover:bg-white/15 group gap-1.5 shadow-md"
        >
          <p className="mx-auto max-w-md animate-shimmer bg-clip-text bg-no-repeat bg-gradient-to-r from-neutral-200 via-white via-50% to-neutral-200 inline-flex items-center justify-center font-medium">
            <span>{language === 'hi' ? '✨ प्रस्तुत है भारत की पहली स्वायत्त आपदा-प्रतिरोधी सुरक्षा प्रणाली' : '✨ Pan-India Autonomous Tourist Safety & Route Mesh'}</span>
            <ChevronRight className="ml-1.5 size-3.5 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
          </p>
        </div>

        {/* High-Contrast Hero Title */}
        <h1 className="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text py-5 text-4xl font-bold leading-tight tracking-tight text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl">
          {language === 'hi' ? (
            <>
              भारत के हर दुर्गम मार्ग पर<br className="hidden md:block" /> सुरक्षित और स्वायत्त नेविगेशन।
            </>
          ) : (
            <>
              Navigate High-Risk Trails &<br className="hidden md:block" /> Remote India with Total Safety.
            </>
          )}
        </h1>

        {/* High-Visibility Subheading */}
        <p className="mb-8 text-base font-normal tracking-tight text-slate-200 md:text-xl text-balance max-w-3xl mx-auto leading-relaxed">
          {language === 'hi' ? (
            'वास्तविक समय उपग्रह मौसम रडार, स्वायत्त भूस्खलन बाईपास, 2G ऑफलाइन आपातकालीन कैश और सभी 28 राज्यों व 8 केंद्र शासित प्रदेशों में एसडीआरएफ त्वरित बचाव सहायता।'
          ) : (
            'Real-time IMD weather radar, autonomous hazard re-routing, offline-first 2G cache, and multi-agency SDRF emergency rescue coverage across all 28 States & 8 UTs.'
          )}
        </p>

        {/* Hero Action Button Group */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
          <button
            onClick={() => onLaunchMap('Kedarnath Dham & Valley')}
            className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all bg-white text-black shadow-2xl hover:bg-neutral-200 h-11 px-6 gap-2 rounded-xl cursor-pointer group"
          >
            <span>{language === 'hi' ? 'नक्शा व योजना शुरू करें' : 'Launch Tactical Map & Planner'}</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => onSelectTab('simulation')}
            className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors border border-white/20 bg-white/10 hover:bg-white/15 text-white h-11 px-5 rounded-xl cursor-pointer gap-2 shadow-sm"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'आपदा बेंच डेमो' : 'Simulate Disaster Bench'}</span>
          </button>

          <button
            onClick={onOpenSOS}
            className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-colors border border-red-500/50 bg-red-950/80 hover:bg-red-900/80 text-red-200 h-11 px-4 rounded-xl cursor-pointer gap-2 shadow-lg"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{language === 'hi' ? 'एसओएस आपातकाल' : 'Emergency SOS'}</span>
          </button>
        </div>

        {/* 2. Pan-India Live Safety Grid Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto mb-16 text-left">
          <div className="p-4 rounded-2xl bg-[#0e1017]/90 border border-white/15 backdrop-blur-md">
            <div className="text-xs font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Pan-India Mesh
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">28 States & 8 UTs</div>
            <div className="text-xs text-slate-300 mt-0.5">Highways, trails & pilgrimage circuits</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1017]/90 border border-white/15 backdrop-blur-md">
            <div className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              SDRF Standby
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">500+ Rescue Posts</div>
            <div className="text-xs text-slate-300 mt-0.5">Direct DEOC & ITBP telemetry</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1017]/90 border border-white/15 backdrop-blur-md">
            <div className="text-xs font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5" />
              Offline 2G Mesh
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">100% Signal-Free</div>
            <div className="text-xs text-slate-300 mt-0.5">Local cache for routes & SOS</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1017]/90 border border-white/15 backdrop-blur-md">
            <div className="text-xs font-mono text-purple-400 uppercase font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Auto-Failover
            </div>
            <div className="text-2xl font-extrabold text-white mt-1">&lt;450ms Reroute</div>
            <div className="text-xs text-slate-300 mt-0.5">Instant bypass on cloudburst/landslide</div>
          </div>
        </div>

        {/* 3. High-Visibility Interactive Pan-India Coverage Explorer */}
        <div className="relative mx-auto max-w-[84rem] text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3 border-b border-white/15 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                PAN-INDIA COVERAGE & SAFETY GRIDS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Explore Protected Circuits Across India
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Select a geographic corridor to view live safety scores, mountain elevations, and emergency force readiness.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold">
                ● LIVE VERIFIED CORRIDORS
              </span>
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
                  className={`btn-tactile shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-black border-white shadow-xl scale-[1.02]'
                      : 'bg-[#0f121d] border-white/15 text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-emerald-400'}`} />
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
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {activeCircuitData.destinations.length} Key Routes Active
            </span>
          </div>

          {/* Grid of Protected Destinations in Selected Circuit */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeCircuitData.destinations.map((dest) => (
              <div
                key={dest.name}
                className="rounded-2xl border border-white/15 bg-[#0e1017]/95 p-5 backdrop-blur-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-xl group hover:-translate-y-1"
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

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
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
                  className="btn-tactile w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 cursor-pointer flex items-center justify-center gap-1.5 mt-5 shadow-md"
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
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
            TACTICAL ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
            Engineered for Zero-Connectivity & Extreme Terrains
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Every layer of IGNITE is designed to protect lives during flash floods, cloudbursts, and high-altitude hypoxia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div onClick={() => onSelectTab('map')} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Autonomous Safe Rerouting</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When landslides or cloudburst thresholds trigger, the engine automatically recalculates verified escape bypasses and shelter waypoints within 450ms.
            </p>
          </div>

          <div onClick={() => onSelectTab('map')} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mb-4 group-hover:scale-105 transition-transform">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Offline-First 2G Cache</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete itineraries, GPS coordinates, oxygen booth waypoints, and emergency protocols stay 100% accessible even with zero cellular signal.
            </p>
          </div>

          <div onClick={() => onSelectTab('explainability')} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-amber-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Explainable Risk Matrix</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI decomposes complex safety conditions into actionable sub-scores: Acute Mountain Sickness (AMS), slope gradient, rainfall, and audio safety briefings.
            </p>
          </div>

          <div onClick={onOpenSOS} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-red-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-300 mb-4 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">One-Touch SDRF SOS Beacon</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant panic signal dispatches live coordinates, altitude, and group medical state directly to local district disaster response force units.
            </p>
          </div>

          <div onClick={() => onSelectTab('simulation')} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-purple-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-105 transition-transform">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Scenario Disaster Bench</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Stress-test expedition plans against cloudbursts, glacial surges, rockfalls, and heatwaves before you set foot on the mountain trail.
            </p>
          </div>

          <div onClick={() => onSelectTab('group')} className="rounded-2xl border border-white/15 bg-[#0e1017]/90 backdrop-blur-md p-6 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Group Live Mesh Radar</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Track team members within dynamic geofences. Automatically alert leaders when a member falls behind or strays outside the safe corridor.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Deployment Tiers & Enterprise Dispatch */}
      <section id="deployment" className="relative mx-auto max-w-[84rem] px-6 md:px-8 pb-20">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-[#12141f] to-black p-8 sm:p-12 backdrop-blur-2xl shadow-2xl">
          <div className="max-w-2xl text-left">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
              DEPLOYMENT EDITIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-2">
              Ready for Solo Pilgrims, Guides & Disaster Forces
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Access real-time safety telemetry whether you are on a personal trek or commanding regional rescue operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-left">
            <div className="p-6 rounded-2xl bg-[#090b12] border border-white/15 flex flex-col justify-between shadow-md">
              <div>
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Individual Edition</div>
                <div className="text-lg font-bold text-white mt-1">Solo Pilgrim & Trekker</div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Pan-India 2G offline cache, one-touch SOS panic relay, and weather radar across all 28 states & 8 UTs.
                </p>
              </div>
              <button
                onClick={() => onLaunchMap('Kedarnath Dham & Valley')}
                className="btn-tactile w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 mt-6 cursor-pointer"
              >
                Start Free Route Plan
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#131622] border-2 border-[var(--color-one)] flex flex-col justify-between relative shadow-xl">
              <span className="absolute top-3 right-3 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white text-black font-extrabold">
                RECOMMENDED
              </span>
              <div>
                <div className="text-xs font-mono text-amber-400 font-bold uppercase">Expedition Edition</div>
                <div className="text-lg font-bold text-white mt-1">Mountain Guide & Group</div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Autonomous hazard bypass, AI audio briefings, group radar mesh up to 25 members, and explainable AMS matrix.
                </p>
              </div>
              <button
                onClick={() => onLaunchMap('Kedarnath Dham & Valley')}
                className="btn-tactile w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 mt-6 cursor-pointer shadow-lg"
              >
                Launch Pro Expedition
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-[#090b12] border border-white/15 flex flex-col justify-between shadow-md">
              <div>
                <div className="text-xs font-mono text-cyan-400 font-bold uppercase">Government Edition</div>
                <div className="text-lg font-bold text-white mt-1">SDRF & DEOC Command</div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Multi-team fleet telemetry, state DEOC command integration, mass evacuation protocols, and emergency mesh.
                </p>
              </div>
              <button
                onClick={() => handleOpenDispatchModal('SDRF / National Disaster Agency')}
                className="btn-tactile w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs mt-6 cursor-pointer border border-white/20"
              >
                Request DEOC Fleet Link
              </button>
            </div>
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

      {/* Interactive Mission Dispatch Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1017] border border-white/20 p-6 shadow-2xl">
            <button
              onClick={() => setIsDispatchModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!dispatchSubmitted ? (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{dispatchAgency}</h3>
                    <p className="text-xs text-slate-300">Deploy Dedicated Command Telemetry & Fleet Mesh</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.05] border border-white/15 text-xs text-slate-200 space-y-1 font-mono">
                  <div className="text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Multi-Agency Data Fusion Engine Active</span>
                  </div>
                  <p className="text-slate-300 font-sans text-[11px]">
                    Direct integration with state disaster command centers (DEOC), ITBP, and regional search-and-rescue teams.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-medium">Operation Sector / Organization Name</label>
                  <input
                    type="text"
                    defaultValue="Himalayan Search & Rescue Directorate"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-medium">Deployment Scale</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-500">
                    <option>Regional Battalion (10-50 Field Personnel)</option>
                    <option>District Emergency Command (50-250 Personnel)</option>
                    <option>State-Wide Multi-Agency Fleet (250+ Personnel)</option>
                  </select>
                </div>

                <button
                  onClick={() => setDispatchSubmitted(true)}
                  className="w-full btn-tactile py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-lg"
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
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Your tactical dispatch request for <strong className="text-white">{dispatchAgency}</strong> has been calibrated with the live SDRF simulation engine.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsDispatchModalOpen(false);
                      onSelectTab('simulation');
                    }}
                    className="btn-tactile px-4 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200 cursor-pointer"
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
