import React, { useState, useEffect, useRef } from 'react';
import type {
  SimulationScenario,
  SimulationResponse,
  IncidentHistoryRecord,
  NationalDisasterBulletin,
  EmergencyShelter,
  DestinationSearchResult,
} from '../../types';
import {
  AlertTriangle,
  CloudLightning,
  CheckCircle,
  Zap,
  Navigation,
  Search,
  MapPin,
  ShieldAlert,
  Radio,
  Phone,
  Building2,
  Wind,
  Droplets,
  Thermometer,
  X,
  History,
  ArrowRight,
  Mountain,
  Loader2,
} from 'lucide-react';

interface DisasterBenchProps {
  scenarios?: SimulationScenario[];
  onTriggerScenario: (scenario: SimulationScenario) => void;
  activeScenarioId?: string;
  isSimulating: boolean;
  rerouteData?: any;
  selectedDestinationName?: string;
  language?: string;
  onSelectDestination?: (destName: string) => void;
  onNavigateToMap?: () => void;
}

// Popular Quick Chips
const POPULAR_DESTINATIONS = [
  { name: 'All India', label: '🇮🇳 Pan-India Live Grid', isAll: true },
  { name: 'Kedarnath', label: '🏔️ Kedarnath', zone: 'Himalayan North' },
  { name: 'Puri', label: '🌊 Puri Beach', zone: 'Bay of Bengal' },
  { name: 'Kaziranga', label: '🌿 Kaziranga', zone: 'Northeast Wildlife' },
  { name: 'Jaisalmer', label: '🏜️ Jaisalmer', zone: 'Thar Arid' },
  { name: 'Manali', label: '🏔️ Manali Alps', zone: 'Himachal' },
  { name: 'Kashi Vishwanath & Ghats', label: '🏛️ Varanasi', zone: 'Gangetic Plains' },
  { name: 'Goa Beaches & Promenade', label: '🌊 Goa Coast', zone: 'Arabian Sea' },
  { name: 'Badrinath Dham', label: '🏔️ Badrinath', zone: 'Garhwal Alps' },
  { name: 'Munnar & Anamudi Highlands', label: '🌿 Munnar', zone: 'Western Ghats' },
  { name: 'Leh, Pangong Tso & Khardung La', label: '🏔️ Leh Ladakh', zone: 'Trans-Himalaya' },
];

export const DisasterBench: React.FC<DisasterBenchProps> = ({
  scenarios: initialScenarios,
  onTriggerScenario,
  activeScenarioId,
  isSimulating,
  rerouteData,
  selectedDestinationName = '',
  language = 'en',
  onSelectDestination,
  onNavigateToMap,
}) => {
  // Current active place for Disaster Bench (defaults to app-wide destination if set)
  const [currentPlace, setCurrentPlace] = useState<string>(selectedDestinationName);
  const [simData, setSimData] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'scenarios' | 'history' | 'shelters' | 'bulletins'>('scenarios');

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DestinationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync with prop if it changes from outside
  useEffect(() => {
    if (selectedDestinationName !== currentPlace) {
      setCurrentPlace(selectedDestinationName);
    }
  }, [selectedDestinationName]);

  // Fetch scenarios & incident records whenever currentPlace or language changes
  useEffect(() => {
    let isMounted = true;
    async function fetchDisasterData() {
      setIsLoading(true);
      try {
        const queryParam = currentPlace
          ? `?destination=${encodeURIComponent(currentPlace)}&language=${encodeURIComponent(language)}`
          : `?language=${encodeURIComponent(language)}`;
        const res = await fetch(`/api/v1/simulation/scenarios${queryParam}`);
        if (res.ok) {
          const data: SimulationResponse = await res.json();
          if (isMounted) {
            setSimData(data);
          }
        }
      } catch (err) {
        console.warn('Failed to load disaster data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchDisasterData();
    return () => {
      isMounted = false;
    };
  }, [currentPlace, language]);

  // Autocomplete search handler
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/v1/destinations/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
      } catch (e) {
        console.error('Destination search error in disaster bench:', e);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPlace = (placeName: string) => {
    setCurrentPlace(placeName);
    setSearchQuery('');
    setIsSearchOpen(false);
    if (onSelectDestination) {
      onSelectDestination(placeName);
    }
  };

  const handleClearPlace = () => {
    setCurrentPlace('');
    setSearchQuery('');
    setIsSearchOpen(false);
    if (onSelectDestination) {
      onSelectDestination('');
    }
  };

  const isPanIndia = !currentPlace || simData?.is_pan_india;
  const displayedScenarios = (simData?.scenarios || initialScenarios || []).filter((sc) => {
    if (zoneFilter === 'ALL') return true;
    return sc.region_type === zoneFilter;
  });

  const incidentHistory: IncidentHistoryRecord[] = simData?.incident_history || [];
  const nationalBulletins: NationalDisasterBulletin[] = simData?.national_disaster_bulletins || [];
  const shelters: EmergencyShelter[] = simData?.shelters || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                PAN-INDIA DISASTER BENCH & STRESS TESTER
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                {isPanIndia ? 'National Multi-Region Hazard Grid' : `Regional Stress Telemetry: ${simData?.destination || currentPlace}`}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{isPanIndia ? 'Dynamic Incident & Pan-India Hazard Bench' : `Incident Records & Evacuation Bench — ${simData?.destination || currentPlace}`}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {isLoading && (
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 text-[11px] text-cyan-300 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Syncing Atlas...</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400">System State:</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold border ${
                isSimulating
                  ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {isSimulating ? 'HAZARD ACTIVE' : 'NORMAL TELEMETRY'}
              </span>
            </div>

            {simData?.elevation_m && (
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
                <Mountain className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-slate-400">Alt:</span>
                <span className="text-teal-300 font-bold">{simData.elevation_m}m</span>
              </div>
            )}
          </div>
        </div>

        {/* Search & Location Selection Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Select Location to View Specific Incident History &amp; Stress Tests:</span>
            </div>

            {currentPlace && (
              <button
                onClick={handleClearPlace}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-950/60 hover:bg-orange-900/60 text-orange-300 border border-orange-700/60 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset to Pan-India Feed</span>
              </button>
            )}
          </div>

          {/* Search Input with Autocomplete */}
          <div ref={searchContainerRef} className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder={currentPlace ? `Current: ${currentPlace} (Search to change location...)` : 'Search any Indian city, hill station, pilgrimage shrine, beach, or park across all 28 states...'}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {isSearchOpen && (searchQuery.trim().length >= 2 || searchResults.length > 0) && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                {isSearching ? (
                  <div className="p-3 text-center text-xs text-slate-400 font-mono animate-pulse">
                    Searching Indian spatial atlas...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-1">
                    {searchResults.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => handleSelectPlace(res.canonical_name)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800/80 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="font-bold text-white">{res.canonical_name}</span>
                            <span className="text-[11px] text-slate-400 ml-1.5">({res.state_ut})</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
                          {res.region_type}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400">
                    No exact match found. Press Enter to dynamically geocode this place across India.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Destination Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap uppercase tracking-wider shrink-0">
              Quick Switch:
            </span>
            {POPULAR_DESTINATIONS.map((dest) => {
              const isSelected = dest.isAll ? !currentPlace : currentPlace.toLowerCase().includes(dest.name.toLowerCase());
              return (
                <button
                  key={dest.name}
                  onClick={() => dest.isAll ? handleClearPlace() : handleSelectPlace(dest.name)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border shrink-0 ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{dest.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Place Metadata Pill Bar (When Place is Selected) */}
        {!isPanIndia && simData && (
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Region Zone:</span>
                <span className="font-bold text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/60">
                  {simData.region_name || simData.region_type}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Response Agency:</span>
                <span className="font-bold text-amber-300">
                  {simData.emergency_agency || 'State Disaster Response Force'}
                </span>
              </div>
            </div>

            {simData.emergency_helplines && (
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-red-400" />
                  Helplines:
                </span>
                {simData.emergency_helplines.map((hl) => (
                  <a
                    key={hl.label}
                    href={`tel:${hl.number}`}
                    className="px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/40 hover:bg-red-900/60 transition-colors"
                  >
                    {hl.label}: <strong>{hl.number}</strong>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pan-India Telemetry Stats Bar (When No Place is Selected) */}
        {isPanIndia && simData?.pan_india_zones_summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
            <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[9px] sm:text-[10px] uppercase font-mono">Active Scenarios</div>
              <div className="text-sm sm:text-base font-black text-white mt-0.5">{simData.pan_india_zones_summary.total_active_scenarios} Hazards</div>
            </div>
            <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[9px] sm:text-[10px] uppercase font-mono">IMD Red Alerts</div>
              <div className="text-sm sm:text-base font-black text-red-400 mt-0.5">{simData.pan_india_zones_summary.critical_alerts} Zones (Critical)</div>
            </div>
            <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[9px] sm:text-[10px] uppercase font-mono">High Warning</div>
              <div className="text-sm sm:text-base font-black text-orange-400 mt-0.5">{simData.pan_india_zones_summary.high_alerts} Zones (High)</div>
            </div>
            <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-[9px] sm:text-[10px] uppercase font-mono">Agency Network</div>
              <div className="text-sm sm:text-base font-black text-emerald-400 mt-0.5">5 Major Agencies</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'scenarios'
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/50 shadow-md'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>{isPanIndia ? 'Pan-India Hazard Injections' : `Stress Scenarios (${displayedScenarios.length})`}</span>
          </button>

          {!isPanIndia && (
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                activeTab === 'history'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Incident Records ({incidentHistory.length})</span>
            </button>
          )}

          {!isPanIndia && shelters.length > 0 && (
            <button
              onClick={() => setActiveTab('shelters')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                activeTab === 'shelters'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Evacuation Shelters ({shelters.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('bulletins')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'bulletins'
                ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-md'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>National Early Warnings ({nationalBulletins.length})</span>
          </button>
        </div>

        {/* Zone Filter (For Pan-India Scenarios) */}
        {isPanIndia && activeTab === 'scenarios' && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">Zone:</span>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              aria-label="Filter scenarios by environmental zone"
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 px-2 py-1 focus:outline-none focus:border-orange-500 font-mono"
            >
              <option value="ALL">All 6 Environmental Zones</option>
              <option value="HILL_MOUNTAIN">🏔️ Himalayan & Hill Mountain</option>
              <option value="COASTAL_MARINE">🌊 Coastal & Marine</option>
              <option value="FOREST_WILDLIFE">🌿 Forest & Wildlife Corridor</option>
              <option value="DESERT_ARID">🏜️ Thar Desert & Arid</option>
              <option value="URBAN_HERITAGE">🏛️ Riverine Plains & Heritage</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: Scenarios Grid (Place-specific or Pan-India) */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {isPanIndia
                ? `Displaying all major live disaster scenarios across India (${displayedScenarios.length} active updates):`
                : `Simulate extreme hazard scenarios tailored for ${simData?.destination || currentPlace}:`}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Click any scenario to inject real-time telemetry &amp; calculate safe bypass
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedScenarios.map((sc) => {
              const isActive = activeScenarioId === sc.id;
              const isCritical = sc.expected_risk_category === 'CRITICAL';
              const isHigh = sc.expected_risk_category === 'HIGH';

              return (
                <div
                  key={sc.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? isCritical
                        ? 'border-red-500 bg-red-950/20 shadow-2xl glass-panel-glow-red'
                        : 'border-orange-500 bg-orange-950/20 shadow-2xl glass-panel-glow-orange'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isCritical
                            ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                            : isHigh
                            ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {isCritical ? <CloudLightning className="w-5 h-5" /> : isHigh ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{sc.title}</h3>
                          <div className="text-[11px] text-slate-400">{sc.title_hi}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                          isCritical
                            ? 'bg-red-500/20 text-red-300 border-red-500/50'
                            : isHigh
                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {sc.expected_risk_category}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400">{sc.zone_name || sc.region_type}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 my-3 leading-relaxed">
                      {sc.description}
                    </p>

                    {/* Meteorological Parameters Pill Bar */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400 mb-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-cyan-400" />
                        Rain: {sc.weather.precipitation_mm_hr}mm/h
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3 text-slate-300" />
                        Wind: {sc.weather.wind_speed_kmh}km/h
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-orange-400" />
                        Temp: {sc.weather.temperature_c}°C
                      </span>
                      <span>•</span>
                      <span className={sc.weather.imd_alert === 'RED' ? 'text-red-400 font-bold' : sc.weather.imd_alert === 'ORANGE' ? 'text-orange-400 font-bold' : 'text-emerald-400'}>
                        IMD: {sc.weather.imd_alert}
                      </span>
                    </div>

                    {sc.primary_agency && (
                      <div className="text-[11px] text-slate-400 mb-3 flex items-center justify-between bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800/60">
                        <span className="text-slate-500">Response: {sc.primary_agency}</span>
                        {sc.evacuation_target && (
                          <span className="text-amber-400/90 font-mono text-[10px]">Shelter: {sc.evacuation_target}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onTriggerScenario(sc)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-2 ${
                      isActive
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Scenario Active in Risk Engine</span>
                      </>
                    ) : (
                      <>
                        <PlayScenarioIcon />
                        <span>Inject This Multi-Region Hazard</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Official Incident History Records (For Selected Place) */}
      {activeTab === 'history' && !isPanIndia && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Official Disaster Records &amp; Vulnerability History for <strong>{simData?.destination || currentPlace}</strong> ({incidentHistory.length} records):
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              Source: GSI, IMD, INCOIS &amp; State Disaster Management Authorities
            </span>
          </div>

          <div className="space-y-3">
            {incidentHistory.map((inc) => {
              const isCritical = inc.severity === 'CRITICAL';
              const isHigh = inc.severity === 'HIGH';

              return (
                <div
                  key={inc.id}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isCritical
                          ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                          : isHigh
                          ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        <History className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                        <div className="text-[11px] font-mono text-cyan-400">{inc.year_or_date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border ${
                        isCritical
                          ? 'bg-red-500/20 text-red-300 border-red-500/50'
                          : isHigh
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {inc.severity} SEVERITY
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {inc.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {inc.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px] font-mono uppercase">Official Mitigation Implemented</div>
                      <div className="text-emerald-300 text-xs mt-1 leading-relaxed">{inc.mitigation_taken}</div>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-400 text-[10px] font-mono uppercase">Reporting Agency / Reference</div>
                      <div className="text-slate-200 text-xs mt-1 font-mono">{inc.reporting_agency}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Evacuation Shelters (For Selected Place) */}
      {activeTab === 'shelters' && !isPanIndia && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Official Emergency Evacuation Shelters &amp; Relief Posts designated for <strong>{simData?.destination || currentPlace}</strong>:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shelters.map((sh) => (
              <div
                key={sh.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{sh.name}</h4>
                      <div className="text-[11px] text-slate-400 font-mono">GPS: {sh.lat.toFixed(4)}, {sh.lon.toFixed(4)}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    VERIFIED SHELTER
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Capacity:</span>
                    <div className="font-bold text-cyan-400 mt-0.5">{sh.capacity_persons || 1000} Persons</div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px]">Emergency Phone:</span>
                    <div className="font-bold text-amber-400 mt-0.5">{sh.contact_phone || '112'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Equipped with backup generator, emergency rations, and wireless SOS link.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: National Early Warning Bulletins Feed */}
      {activeTab === 'bulletins' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Real-Time Simulated National Early Warning Feed (IMD, INCOIS, CWC, NDRF):
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              Live National Monitoring Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nationalBulletins.map((nb) => {
              const isRed = nb.severity === 'RED';
              const isOrange = nb.severity === 'ORANGE';

              return (
                <div
                  key={nb.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all ${
                    isRed
                      ? 'border-red-500/50 bg-red-950/20'
                      : isOrange
                      ? 'border-orange-500/50 bg-orange-950/20'
                      : 'border-emerald-500/50 bg-emerald-950/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className={`w-4 h-4 ${isRed ? 'text-red-400' : isOrange ? 'text-orange-400' : 'text-emerald-400'}`} />
                      <span className="text-xs font-bold text-white">{nb.agency}</span>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                      isRed
                        ? 'bg-red-500/20 text-red-300 border-red-500/50'
                        : isOrange
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {nb.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 mb-1 leading-snug">{nb.headline}</h4>
                  {nb.headline_hi && <div className="text-[11px] text-slate-400 mb-3">{nb.headline_hi}</div>}

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>Impact:</span>
                      {nb.impact_regions.map((reg) => (
                        <span key={reg} className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {reg}
                        </span>
                      ))}
                    </div>
                    <span>{nb.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Real-time Dynamic Reroute Evaluation Output Card */}
      {rerouteData && (
        <div className="glass-panel p-6 rounded-2xl border border-orange-500/40 shadow-2xl bg-slate-900/90 space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Dynamic Reroute &amp; Evacuation Directive ({rerouteData.destination})</h3>
                <div className="text-[11px] text-slate-400 font-mono">Action: {rerouteData.action_type} • Region: {rerouteData.region_type}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Computed Risk:</span>
                <span className="font-mono text-sm font-black text-red-400">
                  {rerouteData.current_risk_score}/100 ({rerouteData.risk_level})
                </span>
              </div>

              {onNavigateToMap && (
                <button
                  onClick={onNavigateToMap}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View on Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-800/60 text-xs text-orange-200 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-orange-300">
              <AlertTriangle className="w-4 h-4" />
              <span>Safety Dispatch Instructions:</span>
            </div>
            <p className="leading-relaxed">{rerouteData.instructions}</p>
            {rerouteData.instructions_hi && (
              <p className="leading-relaxed text-orange-300/90 italic font-sans">{rerouteData.instructions_hi}</p>
            )}
          </div>

          {rerouteData.nearest_shelter && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Assigned Emergency Shelter</div>
                <div className="font-bold text-white mt-0.5 truncate">{rerouteData.nearest_shelter.name}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Distance to Shelter</div>
                <div className="font-mono font-bold text-cyan-400 mt-0.5">{rerouteData.nearest_shelter.distance_m || 480} meters</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Emergency Shelter Helpline</div>
                <div className="font-mono font-bold text-amber-400 mt-0.5">{rerouteData.nearest_shelter.contact_phone || '112'}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PlayScenarioIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
