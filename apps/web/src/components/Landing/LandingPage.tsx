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
                    <span className="flex items-center gap-1.5">
                      <Mountain className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{dest.elevation}</span>
                    </span>
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
          <div className="text-left mb-6 border-b border-[#1E3440] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#34D399] font-medium">
                SYSTEM ARCHITECTURE BENCHMARK
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-1 tracking-tight">
                {language === 'hi' ? 'प्रणाली तुलना: पारंपरिक तकनीक बनाम IGNITE संप्रभु सुरक्षा इंजन' : 'System Benchmark: Legacy Platforms vs. IGNITE'}
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-1 max-w-2xl leading-relaxed">
                {language === 'hi'
                  ? 'सामान्य उपभोक्ता जीपीएस और राज्य आपदा बुलेटिनों की तुलना में संप्रभु सुरक्षा इंजन की कार्यप्रणाली का तकनीकी विश्लेषण।'
                  : 'Rigorous engineering evaluation across multi-hazard telemetry, autonomous evasion latency, and zero-connectivity resilience.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 shrink-0">
              <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-neutral-300">
                Deterministic Model
              </span>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar -mx-2 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-[#1E3440] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  <th className="py-3.5 px-4 font-semibold w-[22%]">
                    {language === 'hi' ? 'मूल्यांकन आयाम' : 'EVALUATION VECTOR'}
                  </th>
                  <th className="py-3.5 px-4 font-semibold w-[26%] text-neutral-300">
                    <div className="flex items-center justify-between">
                      <span>{language === 'hi' ? 'उपभोक्ता जीपीएस' : 'COMMERCIAL APPS'}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-neutral-400 font-normal">Consumer Tier</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-semibold w-[26%] text-neutral-300">
                    <div className="flex items-center justify-between">
                      <span>{language === 'hi' ? 'आपदा बुलेटिन' : 'DISASTER BULLETINS'}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-neutral-400 font-normal">Advisory Tier</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 font-bold text-[#34D399] bg-[#10B981]/10 rounded-t-xl border-t border-x border-[#10B981]/30 w-[26%]">
                    <div className="flex items-center justify-between">
                      <span>IGNITE ENGINE</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] font-semibold">Sovereign Standard</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3440]/50 text-xs">
                {/* Row 1: Hazard Telemetry */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 align-top">
                    <div className="font-semibold text-white font-display">
                      {language === 'hi' ? 'खतरा टेलीमेट्री' : 'Hazard Telemetry'}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      {language === 'hi' ? 'पर्यावरणीय इनपुट' : 'Environmental Inputs'}
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'केवल ट्रैफिक' : 'Traffic Only'}
                    </span>
                    <p>{language === 'hi' ? 'सड़क जाम और दूरी मात्र; भूस्खलन, बादल फटने व एएमएस से पूर्णतः अनभिज्ञ।' : 'Road traffic and travel time only; blind to active landslides, flash floods, and AMS hypoxia.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'मैन्युअल विवरण' : 'Manual Bulletins'}
                    </span>
                    <p>{language === 'hi' ? 'जिलेवार विवरणात्मक पीडीएफ; 12-24 घंटे की देरी से अपडेट व जीपीएस निर्देशांकों का अभाव।' : 'Broad district text PDFs; updated manually with 12–24h latency and no waypoint GPS coordinates.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top bg-[#10B981]/[0.04] border-x border-[#10B981]/20 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] font-medium mb-1.5">
                      {language === 'hi' ? 'सक्रिय बहु-एजेंसी टेलीमेट्री' : 'Multi-Source Fusion'}
                    </span>
                    <p className="text-white font-medium">{language === 'hi' ? 'आईएमडी डॉपलर रडार, ओपन-मेटियो 3D ऊंचाई व पोस्टजीआईएस स्थानिक खतरे वाले बहुभुज।' : 'Real-time IMD Doppler radar, 3D ground elevation, and PostGIS active hazard polygon intersections.'}</p>
                  </td>
                </tr>

                {/* Row 2: Dynamic Rerouting */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 align-top">
                    <div className="font-semibold text-white font-display">
                      {language === 'hi' ? 'स्वायत्त मार्ग परिवर्तन' : 'Dynamic Evasion'}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      {language === 'hi' ? 'आपदा बचाव प्रतिक्रिया' : 'Autonomous Rerouting'}
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'केवल जाम बाईपास' : 'Congestion Only'}
                    </span>
                    <p>{language === 'hi' ? 'केवल वाहन जाम से बचाव; भूस्खलन व बाढ़ के सक्रिय क्षेत्र में भी आगे भेजता है।' : 'Reroutes exclusively around vehicle delays; directs travelers directly into active disaster zones.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'अनुपस्थित' : 'None'}
                    </span>
                    <p>{language === 'hi' ? 'कोई स्वचालित मार्ग निर्धारण नहीं; आपदा के समय यात्री को स्वयं निर्णय लेना पड़ता है।' : 'No automated routing or bypass trail calculation; relies entirely on manual personal decisions.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top bg-[#10B981]/[0.04] border-x border-[#10B981]/20 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] font-medium mb-1.5">
                      {language === 'hi' ? '< 450ms विलंबता' : '< 450ms Latency'}
                    </span>
                    <p className="text-white font-medium">{language === 'hi' ? 'खतरा सीमा उल्लंघन पर सुरक्षित बाईपास पगडंडियों और राहत शेल्टरों हेतु सब-सेकंड पुनर्परिकलन।' : 'Sub-450ms topological recalculation around active hazard breaches to verified disaster shelters.'}</p>
                  </td>
                </tr>

                {/* Row 3: Zero-Connectivity Resilience */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 align-top">
                    <div className="font-semibold text-white font-display">
                      {language === 'hi' ? 'शून्य-कनेक्टिविटी' : 'Network Resilience'}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      {language === 'hi' ? 'ऑफ़लाइन जीवन रक्षा' : 'Telecom Dead Zones'}
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? '4G/5G आवश्यक' : 'Requires 4G/5G'}
                    </span>
                    <p>{language === 'hi' ? 'रिमोट पहाड़ी दर्रों व जंगलों में मोबाइल डेटा कटते ही नेविगेशन रुक जाता है।' : 'Navigation degrades or halts completely when cellular 4G/5G data drops in remote mountain terrain.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'इंटरनेट आश्रित' : 'Web Dependent'}
                    </span>
                    <p>{language === 'hi' ? 'वेबसाइटें व क्लाउड पीडीएफ़ कनेक्टिविटी कटने पर काम नहीं करतीं।' : 'Static web portals and PDFs require active internet sessions and fail completely offline.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top bg-[#10B981]/[0.04] border-x border-[#10B981]/20 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] font-medium mb-1.5">
                      {language === 'hi' ? 'ऑफ़लाइन निरंतरता' : 'Offline Persistent'}
                    </span>
                    <p className="text-white font-medium">{language === 'hi' ? 'ब्राउज़र IndexedDB में संपूर्ण मार्ग सुरक्षित + शून्य डेटा हेतु 140-वर्ण 2G एसएमएस रिले।' : 'Browser IndexedDB persistence with compressed 140-char 2G GSM SMS emergency dispatch payload.'}</p>
                  </td>
                </tr>

                {/* Row 4: Curfew Enforcement */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 align-top">
                    <div className="font-semibold text-white font-display">
                      {language === 'hi' ? 'पर्यावरणीय कर्फ्यू' : 'Environmental Curfews'}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      {language === 'hi' ? 'सूर्यास्त मार्ग कटऑफ' : 'Sunset Trail Clamps'}
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'अप्रतिबंधित' : 'Unrestricted'}
                    </span>
                    <p>{language === 'hi' ? 'रात्रि में भी हिमस्खलन व वन्यजीव गलियारों से गुजरने की अप्रतिबंधित अनुमति देता है।' : 'Directs travelers along hazardous mountain or wildlife corridors late at night without warnings.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'केवल सलाह' : 'Advisory Text'}
                    </span>
                    <p>{language === 'hi' ? 'पैसिव सुझाव जिन्हें यात्रा कार्यक्रम या डिजिटल मार्ग में लागू नहीं किया जा सकता।' : 'Passive narrative mentions without automated travel cutoff enforcement in route itineraries.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top bg-[#10B981]/[0.04] border-x border-[#10B981]/20 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] font-medium mb-1.5">
                      {language === 'hi' ? 'स्वचालित रोक' : 'Automated Clamps'}
                    </span>
                    <p className="text-white font-medium">{language === 'hi' ? 'पारिस्थितिक क्षेत्र अनुसार सूर्यास्त कर्फ्यू (17:00-22:00 IST) का स्वतः क्रियान्वयन।' : 'Dynamic sunset curfews (17:00–22:00 IST) enforced automatically based on terrain classification.'}</p>
                  </td>
                </tr>

                {/* Row 5: Emergency Force Telemetry */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 align-top">
                    <div className="font-semibold text-white font-display">
                      {language === 'hi' ? 'आपातकालीन बल टेलीमेट्री' : 'Emergency Force Grid'}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      {language === 'hi' ? 'बचाव समन्वय' : 'SDRF / DEOC Dispatch'}
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'अनुपस्थित' : 'Absent'}
                    </span>
                    <p>{language === 'hi' ? 'आपदा मोचन बलों या आपातकालीन चिकित्सा केंद्रों से कोई सीधा तकनीकी जुड़ाव नहीं।' : 'No integration with state disaster response forces, medical triage, or SOS panic beacons.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'स्थैतिक नंबर' : 'Static Directories'}
                    </span>
                    <p>{language === 'hi' ? 'सामान्य फोन नंबरों की सूची जिसमें आपातकाल में त्वरित समन्वय असंभव होता है।' : 'Unmapped regional telephone directories with high friction and manual call routing.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top bg-[#10B981]/[0.04] border-x border-[#10B981]/20 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] font-medium mb-1.5">
                      {language === 'hi' ? '15km मेश + 112' : 'Overpass Mesh + 112'}
                    </span>
                    <p className="text-white font-medium">{language === 'hi' ? '15 किमी दायरे में अस्पतालों व पुलिस चौकियों का लाइव मेश और सीधा डीईओसी टेलीमेट्री रिले।' : 'Automated 15km Overpass QL medical/police mesh with direct DEOC panic telemetry.'}</p>
                  </td>
                </tr>

                {/* Row 6: Financial Risk Buffer */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 align-top">
                    <div className="font-semibold text-white font-display">
                      {language === 'hi' ? 'वित्तीय सुरक्षा बफर' : 'Financial Risk Buffer'}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      {language === 'hi' ? 'आपातकालीन निधि' : 'Emergency Liquidity'}
                    </div>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'अप्रतिबंधित बजट' : 'Unregulated'}
                    </span>
                    <p>{language === 'hi' ? 'संकट के समय आपातकालीन निकासी या चिकित्सा हेतु कोई अनिवार्य धनराशि आरक्षित नहीं रखता।' : 'Unregulated expense estimation with zero liquidity protection for crisis evacuations.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top text-neutral-400 font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.04] text-neutral-400 mb-1.5 border border-white/5">
                      {language === 'hi' ? 'अनुपस्थित' : 'None'}
                    </span>
                    <p>{language === 'hi' ? 'यात्रा बजट या आपातकालीन वित्तीय नियोजन का कोई प्रावधान नहीं।' : 'No financial planning or emergency fund safeguarding mechanisms.'}</p>
                  </td>
                  <td className="py-4 px-4 align-top bg-[#10B981]/[0.04] border-x border-b border-[#10B981]/30 rounded-b-xl font-sans leading-relaxed">
                    <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] font-medium mb-1.5">
                      {language === 'hi' ? '15% आरक्षित लॉक' : '15% Reserve Locked'}
                    </span>
                    <p className="text-white font-medium">{language === 'hi' ? 'प्रत्येक यात्रा योजना में 15% अनिवार्य आपातकालीन निकासी आरक्षित राशि का कड़ा नियम।' : 'Mandatory 15% emergency liquidity reserve locked across all generated travel itineraries.'}</p>
                  </td>
                </tr>
              </tbody>
            </table>
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

      {/* 6. Sovereign Enterprise Footer */}
      <footer className="border-t border-[#1E3440] bg-[#050D14]/95 backdrop-blur-2xl text-left relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

        <div data-reveal="fade-up" className="mx-auto w-full max-w-[84rem] px-6 sm:px-8 pt-16 pb-12">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1E3440]/70">
            {/* Column 1 & 2: Brand, Mission & System Telemetry */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <IgniteLogo size="sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white tracking-tight font-display">IGNITE</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] font-medium uppercase tracking-wider">
                      v2.1 Sovereign
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">
                    {language === 'hi'
                      ? 'अखिल भारतीय पर्यटक सुरक्षा एवं स्वायत्त मार्गदर्शक प्रणाली'
                      : 'Pan-India Tourist Safety & Smart Route Intelligence'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-neutral-400 font-sans leading-relaxed max-w-sm">
                {language === 'hi'
                  ? 'संपूर्ण 28 राज्यों और 8 केंद्र शासित प्रदेशों में वास्तविक समय मौसम रडार, स्थानिक खतरे की रोकथाम और शून्य-कनेक्टिविटी 2G आपातकालीन जीवन रक्षा के साथ पर्यटकों की सुरक्षा।'
                  : 'Sovereign-scale, destination-agnostic safety infrastructure protecting travelers across extreme Himalayan passes, sacred pilgrimage circuits, and coastal corridors.'}
              </p>

              {/* Live Telemetry Status Badge */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] font-mono text-neutral-300">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>GRID STATUS:</span>
                  <span className="text-[#34D399] font-semibold">ALL 36 STATES &amp; UTS ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Column 3: Platform Navigation */}
            <div className="space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 font-semibold">
                {language === 'hi' ? 'प्लेटफ़ॉर्म मॉड्यूल' : 'SYSTEM MODULES'}
              </div>
              <ul className="space-y-2 text-xs font-sans">
                <li>
                  <button
                    onClick={() => {
                      onLaunchMap('');
                      onSelectTab('map');
                    }}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {language === 'hi' ? 'मानचित्र व सुरक्षित मार्ग' : 'Map & Spatial Planner'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('simulation')}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {language === 'hi' ? 'लाइव आपदा सिमुलेशन' : 'Live Hazard Simulation'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('group')}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {language === 'hi' ? 'समूह मेश ट्रैकर' : 'Group Mesh Radar'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('explainability')}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {language === 'hi' ? 'जोखिम विश्लेषण मॉडल' : 'Explainability Matrix'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTab('itinerary')}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {language === 'hi' ? 'यात्रा व कर्फ्यू योजना' : 'Itinerary & Curfew Engine'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Architectural Capabilities */}
            <div className="space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 font-semibold">
                {language === 'hi' ? 'सुरक्षा वास्तुकला' : 'ARCHITECTURE'}
              </div>
              <ul className="space-y-2 text-xs text-neutral-400 font-sans">
                <li className="flex items-center justify-between">
                  <span>Terrain Risk Engines</span>
                  <span className="font-mono text-[10px] text-neutral-400">6 Models</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Geospatial Intersection</span>
                  <span className="font-mono text-[10px] text-neutral-400">PostGIS GIST</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Escape Bypass Latency</span>
                  <span className="font-mono text-[10px] text-[#34D399]">&lt; 450ms</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Offline Resilience</span>
                  <span className="font-mono text-[10px] text-neutral-400">140-Char GSM</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Emergency Fund Lock</span>
                  <span className="font-mono text-[10px] text-neutral-400">15% Reserve</span>
                </li>
              </ul>
            </div>

            {/* Column 5: Emergency Action & Data Fusion */}
            <div className="space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 font-semibold">
                {language === 'hi' ? 'आपातकालीन सहायता' : 'EMERGENCY GRID'}
              </div>
              <div className="p-3.5 rounded-xl border border-red-500/25 bg-red-950/20 text-left">
                <div className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                  <span>SOS DISPATCH</span>
                </div>
                <p className="text-[11px] text-neutral-300 font-sans leading-snug mb-3">
                  Direct 2G SMS emergency payload with GPS, ground altitude, and battery triage.
                </p>
                <button
                  onClick={onOpenSOS}
                  className="btn-tactile w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'एसओएस सक्रिय करें' : 'Trigger SOS Beacon'}</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-neutral-400 pt-1">
                <span>National Emergency: </span>
                <span className="text-white font-bold">112</span>
                <span className="text-neutral-600"> • </span>
                <span>NDMA: </span>
                <span className="text-white font-bold">1070</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Sovereign Credentials & Legal */}
          <div className="pt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-xs font-mono text-neutral-400">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span>Copyright &copy; 2026 <strong className="text-white font-semibold">IGNITE</strong>. All Rights Reserved.</span>
              <span className="hidden sm:inline text-neutral-600">•</span>
              <span className="text-neutral-400">Sovereign Bounding: 6.0°N–37.6°N, 68.0°E–97.5°E</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
              <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">IMD Doppler</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">Open-Meteo</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">PostGIS GIST</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">Overpass QL</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/5">SDRF Mesh</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
