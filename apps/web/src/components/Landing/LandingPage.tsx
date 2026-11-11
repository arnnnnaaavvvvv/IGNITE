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
  Cpu,
  Database,
  Workflow,
  Globe,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';
import { IgniteLogo } from '../Common/IgniteLogo';
import { getLocalizedDestinationName } from '../../services/i18n';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { HeroBackground } from './HeroBackground';

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

  // Trigger scroll reveal animations live both on scrolling down and scrolling up
  useScrollReveal({
    deps: [selectedCircuit],
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px',
  });

  // Curated Pan-India Coverage by Geographic & Risk Terrain
  const circuits = [
    {
      id: 'himalayan',
      name: 'Himalayan High Altitude & Pilgrimage',
      name_hi: 'हिमालयी उच्च क्षेत्र एवं तीर्थ कॉरिडोर',
      icon: Mountain,
      badge: 'Uttarakhand, Himachal, J&K',
      badgeColor: 'bg-white/[0.06] text-neutral-300 border-white/10',
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
      badgeColor: 'bg-white/[0.06] text-neutral-300 border-white/10',
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
      badgeColor: 'bg-white/[0.06] text-neutral-300 border-white/10',
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
      badgeColor: 'bg-white/[0.06] text-neutral-300 border-white/10',
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
      badgeColor: 'bg-white/[0.06] text-neutral-300 border-white/10',
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
    <div className="min-h-screen bg-transparent text-white selection:bg-[#10B981]/25 selection:text-white font-sans antialiased relative overflow-hidden">
      {/* 1. Plume Editorial Hero Section with Living Background Mesh */}
      <section
        id="hero"
        className="relative mx-auto mt-6 sm:mt-10 max-w-[88rem] px-4 sm:px-6 text-center md:px-8 pt-10 pb-14 rounded-3xl overflow-hidden"
      >
        {/* Enhanced 60FPS Living Topographic Telemetry & Radar Background */}
        <HeroBackground />

        {/* Inner Content Container sitting securely on top (z-10) */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Plume Editorial Headline */}
          <h1
            data-reveal="fade-up"
            className="font-display py-4 text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-black tracking-[-0.035em] leading-[1.08] text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 drop-shadow-sm max-w-5xl mx-auto"
          >
            {language === 'hi' ? (
              <>
                भारत के हर दुर्गम मार्ग पर<br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#059669] italic">स्वायत्त व सुरक्षित</span> नेविगेशन।
              </>
            ) : (
              <>
                Navigate High-Risk Trails &<br className="hidden md:block" /> Remote India with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] via-[#10B981] to-[#059669] italic">Total Safety.</span>
              </>
            )}
          </h1>

          {/* Plume Editorial Subheading */}
          <p
            data-reveal="fade-up"
            data-reveal-delay="100"
            className="mb-8 text-base sm:text-lg md:text-xl font-normal tracking-[-0.015em] text-neutral-400 text-balance max-w-3xl mx-auto leading-relaxed font-sans"
          >
            {language === 'hi' ? (
              'वास्तविक समय उपग्रह मौसम रडार, स्वायत्त भूस्खलन बाईपास, एएमएस हाइपोक्सिया विश्लेषण और सभी 28 राज्यों व 8 केंद्र शासित प्रदेशों में बहु-एजेंसी आपातकालीन बचाव सहायता।'
            ) : (
              'Real-time IMD weather radar, autonomous hazard re-routing, explainable AMS hypoxia prediction, and multi-agency emergency rescue coverage across all 28 States & 8 UTs.'
            )}
          </p>

          {/* Plume Hero Action Button Group */}
          <div
            data-reveal="fade-up"
            data-reveal-delay="200"
            className="flex flex-wrap items-center justify-center gap-3.5 mb-10"
          >
            <button
              onClick={() => onLaunchMap('')}
              className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold tracking-tight transition-all bg-[#10B981] hover:bg-[#059669] text-[#07141F] font-bold shadow-xl shadow-[#10B981]/25 h-11 px-6 gap-2 rounded-xl cursor-pointer group"
            >
              <span>{language === 'hi' ? 'नक्शा व योजना शुरू करें' : 'Explore Map & Planner'}</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => {
                onLaunchSimulation();
                onSelectTab('simulation');
              }}
              className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors border border-white/15 bg-white/[0.03] hover:bg-white/[0.08] text-neutral-200 h-11 px-5 rounded-xl cursor-pointer gap-2 shadow-md font-mono backdrop-blur-sm tracking-tight"
            >
              <Radio className="w-4 h-4 text-white" />
              <span>{language === 'hi' ? 'स्थान के ताज़ा अपडेट्स' : 'Place News & Live Updates'}</span>
            </button>

            <button
              onClick={onOpenSOS}
              className="btn-tactile inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-colors border border-red-500/50 bg-red-600/90 hover:bg-red-500 text-white h-11 px-4 rounded-xl cursor-pointer gap-2 shadow-xl font-mono tracking-wider"
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
          <div
            data-reveal="fade-up"
            data-reveal-delay="50"
            className="p-4 rounded-2xl bg-[#0D202B]/80 border border-[#1E3440] backdrop-blur-xl hover:border-[#10B981]/40 transition-all shadow-xl"
          >
            <div className="text-[10px] font-mono text-[#34D399] uppercase font-semibold tracking-[0.18em] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
              Pan-India Grid
            </div>
            <div className="text-2xl font-extrabold text-[#F1F5F9] mt-1.5 font-display tracking-tight">28 States & 8 UTs</div>
            <div className="text-xs text-[#94A3B8] mt-0.5 font-sans leading-snug">Highways, trails & pilgrimages</div>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="150"
            className="p-4 rounded-2xl bg-[#0D202B]/80 border border-[#1E3440] backdrop-blur-xl hover:border-[#10B981]/40 transition-all shadow-xl"
          >
            <div className="text-[10px] font-mono text-[#34D399] uppercase font-semibold tracking-[0.18em] flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-zinc-300" />
              SDRF Standby
            </div>
            <div className="text-2xl font-extrabold text-[#F1F5F9] mt-1.5 font-display tracking-tight">500+ Posts</div>
            <div className="text-xs text-[#94A3B8] mt-0.5 font-sans leading-snug">Direct DEOC & ITBP telemetry</div>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="250"
            className="p-4 rounded-2xl bg-[#0D202B]/80 border border-[#1E3440] backdrop-blur-xl hover:border-[#10B981]/40 transition-all shadow-xl"
          >
            <div className="text-[10px] font-mono text-[#34D399] uppercase font-semibold tracking-[0.18em] flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-zinc-300" />
              AI Physiology
            </div>
            <div className="text-2xl font-extrabold text-[#F1F5F9] mt-1.5 font-display tracking-tight">AMS Hypoxia</div>
            <div className="text-xs text-[#94A3B8] mt-0.5 font-sans leading-snug">Altitude & oxygen risk scoring</div>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="350"
            className="p-4 rounded-2xl bg-[#0D202B]/80 border border-[#1E3440] backdrop-blur-xl hover:border-[#10B981]/40 transition-all shadow-xl"
          >
            <div className="text-[10px] font-mono text-[#34D399] uppercase font-semibold tracking-[0.18em] flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-zinc-300" />
              Mesh Protocol
            </div>
            <div className="text-2xl font-extrabold text-[#F1F5F9] mt-1.5 font-display tracking-tight">Zero-Cell</div>
            <div className="text-xs text-[#94A3B8] mt-0.5 font-sans leading-snug">BLE & 2G emergency broadcast</div>
          </div>
        </div>

        {/* 2.2 Interactive Pan-India Coverage Explorer */}
        <div className="relative mx-auto max-w-[84rem] text-left">
          <div data-reveal="fade-up" className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3 border-b border-[#1E3440] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-400 font-semibold">
                PAN-INDIA COVERAGE & SAFETY GRIDS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-[-0.03em] mt-1 font-display">
                Explore Protected Circuits Across India
              </h2>
              <p className="text-sm text-neutral-400 mt-1.5 font-sans leading-relaxed max-w-2xl">
                Select a geographic corridor to view live safety scores, mountain elevations, and emergency force readiness.
              </p>
            </div>
          </div>

          {/* Circuit Category Navigation Buttons */}
          <div data-reveal="fade-right" data-reveal-delay="100" className="flex items-center gap-2.5 overflow-x-auto pb-4 no-scrollbar">
            {circuits.map((circuit) => {
              const Icon = circuit.icon;
              const isActive = selectedCircuit === circuit.id;
              return (
                <button
                  key={circuit.id}
                  onClick={() => setSelectedCircuit(circuit.id)}
                  className={`btn-tactile shrink-0 px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-all border flex items-center gap-2 font-mono ${
                    isActive
                      ? 'bg-white text-black border-white shadow-lg shadow-white/10 scale-[1.02] font-bold'
                      : 'bg-white/[0.03] border-white/[0.08] text-neutral-300 hover:text-white hover:bg-white/[0.08] hover:border-[#10B981]/40 font-medium'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#07141F]' : 'text-[#34D399]'}`} />
                  <span>{circuit.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Circuit Header Info */}
          <div data-reveal="fade-up" data-reveal-delay="150" className="flex items-center justify-between mt-2 mb-4 px-1">
            <span className="text-xs font-mono text-neutral-400">
              Region: <strong className="text-[#34D399] font-medium">{activeCircuitData.badge}</strong>
            </span>
            <span className="text-xs font-mono text-[#34D399] font-semibold">
              {activeCircuitData.destinations.length} Key Routes Active
            </span>
          </div>

          {/* Grid of Protected Destinations in Selected Circuit */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeCircuitData.destinations.map((dest, idx) => (
              <div
                key={dest.name}
                data-reveal="fade-up"
                data-reveal-delay={`${(idx % 4) * 100 + 50}`}
                className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 p-5 backdrop-blur-xl hover:border-[#10B981]/40 transition-all flex flex-col justify-between shadow-xl group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-[#07141F] text-[#94A3B8] border border-[#1E3440]">
                      {dest.state}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-[#34D399] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                      {dest.safetyScore}/100 Safe
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#34D399] transition-colors font-display tracking-tight">
                    {getLocalizedDestinationName(dest.name, language)}
                  </h3>

                  <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 mt-2 pb-3 border-b border-[#1E3440]">
                    <span>🏔 {dest.elevation}</span>
                    <span className="text-neutral-600">•</span>
                    <span className="text-neutral-400 truncate">{dest.terrain}</span>
                  </div>

                  <div className="space-y-1.5 mt-3 text-xs text-neutral-400">
                    <div className="text-[11px] font-mono text-[#34D399] font-medium flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-[#10B981] shrink-0" />
                      <span className="truncate">{dest.rescueAgency}</span>
                    </div>

                    <ul className="space-y-1 mt-2 text-[11px] text-neutral-400 font-sans">
                      {dest.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#34D399] shrink-0 mt-0.5" />
                          <span className="text-neutral-300">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => onLaunchMap(dest.name)}
                  className="btn-tactile w-full py-2.5 rounded-xl bg-[#07141F] hover:bg-[#10B981] text-[#F1F5F9] hover:text-[#07141F] font-medium hover:font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 mt-5 border border-[#1E3440] hover:border-[#10B981] shadow-sm transition-all"
                >
                  <span>{language === 'hi' ? 'यह मार्ग देखें' : 'View Safe Route'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Core Safety Capabilities Grid (High Visibility) */}
      <section id="features" className="relative mx-auto max-w-[84rem] px-6 md:px-8 py-20">
        <div data-reveal="fade-up" className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white font-display">
            Engineered for Zero-Connectivity & Extreme Terrains
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed max-w-2xl mx-auto">
            Every layer of IGNITE is designed to protect lives during flash floods, cloudbursts, and high-altitude hypoxia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            data-reveal="fade-up"
            data-reveal-delay="50"
            onClick={() => onSelectTab('map')}
            className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 backdrop-blur-xl p-6 hover:border-[#10B981]/40 hover:bg-[#0D202B] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-11 h-11 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-display tracking-tight group-hover:text-[#34D399] transition-colors">Autonomous Safe Rerouting</h3>
            <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-sans">
              When landslides or cloudburst thresholds trigger, the engine automatically recalculates verified escape bypasses and shelter waypoints within 450ms.
            </p>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="150"
            onClick={() => onSelectTab('map')}
            className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 backdrop-blur-xl p-6 hover:border-[#10B981]/40 hover:bg-[#0D202B] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-11 h-11 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <WifiOff className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-display tracking-tight group-hover:text-[#34D399] transition-colors">Offline-First 2G Cache</h3>
            <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-sans">
              Critical topographical maps, shelter locations, and emergency contacts are pre-cached locally so you stay safe without cellular service.
            </p>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="250"
            onClick={() => onSelectTab('explainability')}
            className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 backdrop-blur-xl p-6 hover:border-[#10B981]/40 hover:bg-[#0D202B] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-11 h-11 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-display tracking-tight group-hover:text-[#34D399] transition-colors">Explainable Risk Matrix</h3>
            <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-sans">
              AI decomposes complex safety conditions into actionable sub-scores: Acute Mountain Sickness (AMS), slope gradient, rainfall, and audio safety briefings.
            </p>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="100"
            onClick={onOpenSOS}
            className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 backdrop-blur-xl p-6 hover:border-[#10B981]/40 hover:bg-[#0D202B] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-11 h-11 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-display tracking-tight group-hover:text-[#34D399] transition-colors">One-Touch SDRF SOS Beacon</h3>
            <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-sans">
              Instant panic signal dispatches live coordinates, altitude, and group medical state directly to local district disaster response force units.
            </p>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="200"
            onClick={() => onSelectTab('simulation')}
            className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 backdrop-blur-xl p-6 hover:border-[#10B981]/40 hover:bg-[#0D202B] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-11 h-11 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-display tracking-tight group-hover:text-[#34D399] transition-colors">Multi-Scenario Disaster Bench</h3>
            <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-sans">
              Stress-test expedition plans against cloudbursts, glacial surges, rockfalls, and heatwaves before you set foot on the mountain trail.
            </p>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="300"
            onClick={() => onSelectTab('group')}
            className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 backdrop-blur-xl p-6 hover:border-[#10B981]/40 hover:bg-[#0D202B] transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-11 h-11 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 font-display tracking-tight group-hover:text-[#34D399] transition-colors">Group Live Mesh Radar</h3>
            <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed font-sans">
              Track team members within dynamic geofences. Automatically alert leaders when a member falls behind or strays outside the safe corridor.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Sovereign Architectural Integrity & Project Specifications */}
      <section id="architecture" className="relative mx-auto max-w-[84rem] px-4 sm:px-6 md:px-8 py-20 border-t border-[#1E3440]/60">
        <div data-reveal="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] text-white font-display">
            {language === 'hi' ? 'राष्ट्रीय स्तर के लिए निर्मित। पूर्णतः गणितीय सुरक्षा।' : 'Engineered for India. Grounded in Deterministic Mathematics.'}
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed max-w-2xl mx-auto">
            {language === 'hi'
              ? 'सामान्य यात्रा निर्देशिकाओं के विपरीत, IGNITE संपूर्ण 28 राज्यों और 8 केंद्र शासित प्रदेशों में बहु-एजेंसी टेलीमेट्री, पोस्टजीआईएस स्थानिक जियोफेंसिंग और शून्य-इंटरनेट प्रोटोकॉल से संचालित होता है।'
              : 'Unlike black-box commercial directories, IGNITE replaces opaque heuristics with deterministic hazard weighting, hardware-accelerated PostGIS geofencing, and zero-connectivity survival protocols.'}
          </p>
        </div>

        {/* 5.1 Four Sovereign Architectural Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          <div
            data-reveal="fade-up"
            data-reveal-delay="50"
            className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 backdrop-blur-xl p-6 hover:border-[#10B981]/40 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <Cpu className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-neutral-400">
                  DETERMINISTIC
                </span>
              </div>
              <div className="text-xs font-mono text-[#34D399] uppercase tracking-wider mb-1">
                {language === 'hi' ? '6 भौगोलिक जोखिम मॉडल' : '6 Canonical Terrains'}
              </div>
              <h3 className="text-base font-bold text-white font-display mb-2 group-hover:text-[#34D399] transition-colors">
                {language === 'hi' ? 'शून्य-भ्रम जोखिम मेट्रिक्स' : 'Zero-Hallucination Risk'}
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {language === 'hi'
                  ? 'पर्वतीय (भूस्खलन 30%, एएमएस 20%), तटीय (समुद्री तूफान 35%), वन, रेगिस्तान, मैदानी एवं शहरी क्षेत्रों हेतु सटीक गणितीय सूत्र।'
                  : 'Calibrated weight vectors for Hill/Mountain (30% Landslide, 20% AMS), Coastal (35% Surge), Forest, Arid, Plains & Urban circuits.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#1E3440] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>Scoring Engine</span>
              <span className="text-[#34D399] font-semibold">0.0 – 100.0</span>
            </div>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="100"
            className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 backdrop-blur-xl p-6 hover:border-[#10B981]/40 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-neutral-400">
                  POSTGIS
                </span>
              </div>
              <div className="text-xs font-mono text-[#34D399] uppercase tracking-wider mb-1">
                {language === 'hi' ? 'स्थानिक प्रतिच्छेदन' : 'Spatial Geofencing'}
              </div>
              <h3 className="text-base font-bold text-white font-display mb-2 group-hover:text-[#34D399] transition-colors">
                {language === 'hi' ? 'सक्रिय खतरा परिधि निकासी' : 'Hazard Boundary Escape'}
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {language === 'hi'
                  ? 'हार्डवेयर-त्वरित ST_Intersects विश्लेषण सक्रिय आपदा क्षेत्रों का पता लगाता है और सुरक्षित शेल्टरों हेतु तुरंत नया मार्ग बनाता है।'
                  : 'Hardware-accelerated ST_Intersects polygon intersections identify active danger corridors and trigger verified bypass tracks in <450ms.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#1E3440] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>Recalculation</span>
              <span className="text-[#34D399] font-semibold">&lt; 450ms</span>
            </div>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="150"
            className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 backdrop-blur-xl p-6 hover:border-[#10B981]/40 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <Radio className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-neutral-400">
                  OFFLINE-FIRST
                </span>
              </div>
              <div className="text-xs font-mono text-[#34D399] uppercase tracking-wider mb-1">
                {language === 'hi' ? '2G जीएसएम एवं कैश' : '2G GSM SMS & Cache'}
              </div>
              <h3 className="text-base font-bold text-white font-display mb-2 group-hover:text-[#34D399] transition-colors">
                {language === 'hi' ? 'शून्य-इंटरनेट जीवन रक्षा' : 'Zero-Cell Survivability'}
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {language === 'hi'
                  ? 'संपूर्ण मार्ग डेटा ब्राउज़र IndexedDB में सुरक्षित रहता है। आपातकालीन एसओएस स्वचालित 140-वर्ण 2G एसएमएस पेलोड तैयार करता है।'
                  : 'Full route polylines cache in browser IndexedDB. SOS triggers format a compact 140-char SMS payload for cellular dead zones.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#1E3440] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>Telecom Payload</span>
              <span className="text-[#34D399] font-semibold">140-Char GSM</span>
            </div>
          </div>

          <div
            data-reveal="fade-up"
            data-reveal-delay="200"
            className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/80 backdrop-blur-xl p-6 hover:border-[#10B981]/40 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-neutral-400">
                  SOVEREIGN
                </span>
              </div>
              <div className="text-xs font-mono text-[#34D399] uppercase tracking-wider mb-1">
                {language === 'hi' ? 'अखिल भारतीय दायरा' : 'Sovereign Domain'}
              </div>
              <h3 className="text-base font-bold text-white font-display mb-2 group-hover:text-[#34D399] transition-colors">
                {language === 'hi' ? '28 राज्य व 8 केंद्र शासित प्रदेश' : '28 States & 8 UTs'}
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {language === 'hi'
                  ? 'भारतीय सीमाओं (6.0°N–37.6°N, 68.0°E–97.5°E) का कठोर सत्यापन एवं चार धाम व 12 ज्योतिर्लिंगों के लिए विशेष भीड़ विश्लेषण।'
                  : 'Sovereign bounding-box validation with 21 curated sacred pilgrimage corridors, staircase exertion tiers, and curfew enforcement.'}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#1E3440] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>National Circuits</span>
              <span className="text-[#34D399] font-semibold">21 Pre-Seeded</span>
            </div>
          </div>
        </div>

        {/* 5.2 Architectural Comparison Matrix */}
        <div data-reveal="fade-up" className="rounded-2xl border border-[#1E3440] bg-[#07141F]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl mb-14">
          <div className="text-left mb-6 border-b border-[#1E3440] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#34D399] font-semibold">
                SYSTEM COMPARATIVE ANALYSIS
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-1">
                {language === 'hi' ? 'पारंपरिक ऐप्स बनाम IGNITE संप्रभु सुरक्षा इंजन' : 'Commercial Navigation vs. The IGNITE Sovereign Engine'}
              </h3>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              {language === 'hi' ? 'प्रमाणीकृत सुरक्षा अंतर' : 'Architectural Differentiator'}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 text-left">
            {/* Generic Commercial Apps */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-display text-neutral-300">Commercial Travel Apps</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400">Consumer Tier</span>
                </div>
                <p className="text-xs text-neutral-400 mb-4 font-sans leading-relaxed">
                  Engineered exclusively for street traffic and commercial stops; completely unequipped for extreme hazards.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-300 font-sans">
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>Blind to active landslides, flash floods & AMS hypoxia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>Fails completely when cellular 4G/5G data drops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>No environmental curfews or sunset trail cutoffs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>No emergency hospital/police dispatch telemetry</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-white/5 text-[11px] font-mono text-neutral-500">
                Data Model: Road Traffic Only
              </div>
            </div>

            {/* Static Government Bulletins */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-display text-neutral-300">Static Disaster Bulletins</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">Advisory Tier</span>
                </div>
                <p className="text-xs text-neutral-400 mb-4 font-sans leading-relaxed">
                  District-level broadcast text PDFs published with high latency and zero interactive navigation.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-300 font-sans">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Updated manually every 12–24h without GPS coordinates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>No dynamic rerouting or safe bypass trail calculation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Static web documents inaccessible in network dropouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Places high cognitive burden on travelers in crisis</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-white/5 text-[11px] font-mono text-neutral-500">
                Data Model: Manual PDF Bulletins
              </div>
            </div>

            {/* IGNITE Sovereign Engine */}
            <div className="rounded-xl border border-[#10B981]/50 bg-[#0D202B] p-5 flex flex-col justify-between shadow-[0_0_25px_rgba(16,185,129,0.12)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#34D399]" />
                    <span className="text-xs font-bold font-display text-white">IGNITE Engine</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] font-semibold">
                    Sovereign Standard
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mb-4 font-sans leading-relaxed">
                  Real-time geospatial fusion engine with sub-second hazard evasion and zero-internet survival protocols.
                </p>
                <ul className="space-y-2.5 text-xs text-white font-sans">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span>Live IMD alerts, ground elevation & PostGIS ST_Intersects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span>Sub-450ms dynamic topological rerouting to relief shelters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span>100% offline IndexedDB cache + 140-char 2G SMS SOS beacon</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                    <span>Dynamic sunset curfews & enforced 15% emergency reserve</span>
                  </li>
                </ul>
              </div>
              <div className="mt-5 pt-3 border-t border-[#1E3440] text-[11px] font-mono text-[#34D399] flex items-center justify-between">
                <span>Data Model: Real-Time Telemetry Fusion</span>
                <span className="font-bold">Active Grid</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5.3 Live Telemetry Data Fusion Pipeline Strip */}
        <div data-reveal="fade-up" className="rounded-2xl border border-[#1E3440] bg-[#0D202B]/60 backdrop-blur-xl p-5 sm:p-6 text-left shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E3440]">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#34D399] font-semibold">
                END-TO-END TELEMETRY PIPELINE
              </div>
              <h4 className="text-base font-bold text-white font-display mt-0.5">
                {language === 'hi' ? 'बहु-एजेंसी डेटा अंतर्ग्रहण एवं आपातकालीन सहायता श्रृंखला' : 'Multi-Agency Data Ingestion & Live Incident Dispatch Chain'}
              </h4>
            </div>
            <button
              onClick={() => {
                onLaunchSimulation();
                onSelectTab('simulation');
              }}
              className="btn-tactile inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs font-mono text-white transition-all cursor-pointer self-start md:self-auto"
            >
              <Workflow className="w-3.5 h-3.5 text-[#34D399]" />
              <span>{language === 'hi' ? 'घटना सिमुलेशन देखें' : 'Simulate Incident Pipeline'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-5">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">01 • INGESTION</div>
              <div className="text-xs font-bold text-white mt-1">IMD Doppler Radar</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Precipitation & cloudburst alerts</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">02 • TOPOGRAPHY</div>
              <div className="text-xs font-bold text-white mt-1">Elevation Sampling</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Open-Meteo AMS hypoxia profile</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">03 • SPATIAL GIST</div>
              <div className="text-xs font-bold text-white mt-1">PostGIS ST_Intersects</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Hardware hazard polygon checks</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">04 • TOPOLOGY</div>
              <div className="text-xs font-bold text-white mt-1">OSRM Dynamic Bypass</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Sub-450ms shelter routing</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">05 • DISPATCH</div>
              <div className="text-xs font-bold text-white mt-1">SDRF 2G GSM Relay</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">140-char offline telemetry payload</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Clean Professional Footer */}
      <footer className="border-t border-[#1E3440] bg-black/95 backdrop-blur-2xl">
        <div data-reveal="fade-up" className="mx-auto w-full max-w-[84rem] px-6 sm:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#1E3440]">
            <div className="flex items-center gap-3">
              <IgniteLogo size="sm" />
              <div>
                <span className="text-xl font-bold text-white tracking-tight font-display">IGNITE</span>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">All-India Tourist Safety & Smart Route Guide</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs font-medium font-sans">
              <button onClick={() => onSelectTab('overview')} className="text-neutral-400 hover:text-white cursor-pointer transition-colors">Home</button>
              <button onClick={() => onSelectTab('map')} className="text-neutral-400 hover:text-white cursor-pointer transition-colors">Map & Places</button>
              <button onClick={() => onSelectTab('simulation')} className="text-neutral-400 hover:text-white cursor-pointer transition-colors">Live Updates</button>
              <button onClick={() => onSelectTab('group')} className="text-neutral-400 hover:text-white cursor-pointer transition-colors">Group Tracker</button>
              <button onClick={onOpenSOS} className="text-red-400 hover:text-red-300 cursor-pointer font-semibold transition-colors">Emergency SOS</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 text-xs text-neutral-500 gap-3 font-mono">
            <span>Copyright © 2026 <strong className="text-neutral-300 font-semibold">IGNITE</strong>. All Rights Reserved.</span>
            <span>OpenStreetMap • Open-Meteo • SDRF Multi-Agency Data Fusion</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
