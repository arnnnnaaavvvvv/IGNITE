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

// Popular Quick Chips (Cleaned: No Emoji Clutter)
const POPULAR_DESTINATIONS = [
  { name: 'All India', label: 'Pan-India Grid', label_hi: 'अखिल भारतीय ग्रिड', isAll: true },
  { name: 'Kedarnath', label: 'Kedarnath', label_hi: 'केदारनाथ धाम', zone: 'Himalayan North' },
  { name: 'Puri', label: 'Puri Beach', label_hi: 'पुरी तट', zone: 'Bay of Bengal' },
  { name: 'Kaziranga', label: 'Kaziranga', label_hi: 'काजीरंगा', zone: 'Northeast Wildlife' },
  { name: 'Jaisalmer', label: 'Jaisalmer', label_hi: 'जैसलमेर', zone: 'Thar Arid' },
  { name: 'Manali', label: 'Manali Alps', label_hi: 'मनाली', zone: 'Himachal' },
  { name: 'Kashi Vishwanath & Ghats', label: 'Varanasi', label_hi: 'वाराणसी', zone: 'Gangetic Plains' },
  { name: 'Goa Beaches & Promenade', label: 'Goa Coast', label_hi: 'गोवा तट', zone: 'Arabian Sea' },
  { name: 'Badrinath Dham', label: 'Badrinath', label_hi: 'बद्रीनाथ धाम', zone: 'Garhwal Alps' },
  { name: 'Munnar & Anamudi Highlands', label: 'Munnar', label_hi: 'मुन्नार', zone: 'Western Ghats' },
  { name: 'Leh, Pangong Tso & Khardung La', label: 'Leh Ladakh', label_hi: 'लेह लद्दाख', zone: 'Trans-Himalaya' },
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

  // Sync with prop
  useEffect(() => {
    if (selectedDestinationName !== currentPlace) {
      setCurrentPlace(selectedDestinationName);
    }
  }, [selectedDestinationName]);

  // Fetch scenarios & records
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
    <div className="space-y-4">
      {/* Top Control Deck */}
      <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-amber-400" />
                DISASTER SIMULATION BENCH
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                {isPanIndia ? 'National Multi-Region Hazard Grid' : `Target: ${simData?.destination || currentPlace}`}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isPanIndia ? 'National Incident & Hazard Benchmark' : `Stress Telemetry & Records — ${simData?.destination || currentPlace}`}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isLoading && (
              <div className="flex items-center gap-1.5 bg-[#12141d] px-2 py-0.5 rounded border border-white/[0.08] text-[10px] text-sky-300 font-mono">
                <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
                <span>Syncing...</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-[#12141d] px-2.5 py-1 rounded border border-white/[0.08]">
              <span className="text-[10px] text-slate-400">State:</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold border ${
                isSimulating
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}>
                {isSimulating ? 'HAZARD ACTIVE' : 'NORMAL'}
              </span>
            </div>

            {simData?.elevation_m && (
              <div className="hidden sm:flex items-center gap-1 bg-[#12141d] px-2.5 py-1 rounded border border-white/[0.08] text-[11px] font-mono">
                <Mountain className="w-3 h-3 text-emerald-400" />
                <span className="text-slate-400">Alt:</span>
                <span className="text-white font-medium">{simData.elevation_m}m</span>
              </div>
            )}
          </div>
        </div>

        {/* Location Selection Bar */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Select Location for Tailored Stress Scenarios:</span>
            </div>

            {currentPlace && (
              <button
                onClick={handleClearPlace}
                className="btn-tactile text-[11px] font-semibold px-2.5 py-1 rounded bg-[#12141d] hover:bg-[#181b26] text-amber-300 border border-amber-500/30 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Reset to Pan-India Feed</span>
              </button>
            )}
          </div>

          {/* Search Input */}
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
                placeholder={currentPlace ? `Target: ${currentPlace} (Search to change...)` : 'Search any Indian destination across 28 states...'}
                className="w-full pl-9 pr-9 py-2 rounded-lg bg-[#12141d] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 font-sans"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {isSearchOpen && (searchQuery.trim().length >= 2 || searchResults.length > 0) && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-[#0e1017] border border-white/[0.12] rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="p-2.5 text-center text-xs text-slate-400 font-mono">
                    Searching Indian spatial atlas...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-1 space-y-0.5">
                    {searchResults.map((res) => (
                      <button
                        key={res.id}
                        onClick={() => handleSelectPlace(res.canonical_name)}
                        className="w-full text-left px-2.5 py-1.5 rounded hover:bg-white/[0.06] flex items-center justify-between text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span className="font-semibold text-white">{res.canonical_name}</span>
                          <span className="text-[10px] text-slate-400">({res.state_ut})</span>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-slate-400">
                          {res.region_type}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-2.5 text-center text-xs text-slate-400">
                    No exact match. Press enter to resolve dynamically.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Destination Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase shrink-0">
              {language === 'hi' ? 'त्वरित:' : 'Quick:'}
            </span>
            {POPULAR_DESTINATIONS.map((dest) => {
              const isSelected = dest.isAll ? !currentPlace : currentPlace.toLowerCase().includes(dest.name.toLowerCase());
              const chipLabel = (language === 'hi' && dest.label_hi) ? dest.label_hi : dest.label;
              return (
                <button
                  key={dest.name}
                  onClick={() => dest.isAll ? handleClearPlace() : handleSelectPlace(dest.name)}
                  className={`btn-tactile text-[11px] font-medium px-2.5 py-0.5 rounded whitespace-nowrap cursor-pointer border shrink-0 ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#12141d] hover:bg-[#181b26] text-slate-300 border-white/[0.06]'
                  }`}
                >
                  <span>{chipLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Place Metadata Bar */}
        {!isPanIndia && simData && (
          <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Zone:</span>
                <span className="font-semibold text-sky-300 font-mono">
                  {simData.region_name || simData.region_type}
                </span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Authority:</span>
                <span className="font-semibold text-slate-200">
                  {simData.emergency_agency || 'State Disaster Authority'}
                </span>
              </div>
            </div>

            {simData.emergency_helplines && (
              <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-red-400" />
                  Helpline:
                </span>
                {simData.emergency_helplines.map((hl) => (
                  <a
                    key={hl.label}
                    href={`tel:${hl.number}`}
                    className="px-1.5 py-0.2 rounded bg-red-950/30 text-red-300 border border-red-800/30"
                  >
                    {hl.label}: <strong>{hl.number}</strong>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-1.5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`btn-tactile px-3 py-1 rounded text-xs font-semibold cursor-pointer border ${
              activeTab === 'scenarios'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                : 'bg-[#12141d] text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            <span>{isPanIndia ? 'Hazard Injections' : `Stress Scenarios (${displayedScenarios.length})`}</span>
          </button>

          {!isPanIndia && (
            <button
              onClick={() => setActiveTab('history')}
              className={`btn-tactile px-3 py-1 rounded text-xs font-semibold cursor-pointer border ${
                activeTab === 'history'
                  ? 'bg-sky-500/15 text-sky-300 border-sky-500/40'
                  : 'bg-[#12141d] text-slate-400 border-white/[0.06] hover:text-slate-200'
              }`}
            >
              <span>Incident Records ({incidentHistory.length})</span>
            </button>
          )}

          {!isPanIndia && shelters.length > 0 && (
            <button
              onClick={() => setActiveTab('shelters')}
              className={`btn-tactile px-3 py-1 rounded text-xs font-semibold cursor-pointer border ${
                activeTab === 'shelters'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#12141d] text-slate-400 border-white/[0.06] hover:text-slate-200'
              }`}
            >
              <span>Evacuation Shelters ({shelters.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('bulletins')}
            className={`btn-tactile px-3 py-1 rounded text-xs font-semibold cursor-pointer border ${
              activeTab === 'bulletins'
                ? 'bg-red-500/15 text-red-300 border-red-500/40'
                : 'bg-[#12141d] text-slate-400 border-white/[0.06] hover:text-slate-200'
            }`}
          >
            <span>National Early Warnings ({nationalBulletins.length})</span>
          </button>
        </div>

        {/* Zone Filter */}
        {isPanIndia && activeTab === 'scenarios' && (
          <div className="flex items-center gap-1 text-xs">
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              aria-label="Filter scenarios by environmental zone"
              className="bg-[#12141d] border border-white/[0.08] rounded text-xs text-slate-200 px-2 py-0.5 font-mono"
            >
              <option value="ALL">All 6 Environmental Zones</option>
              <option value="HILL_MOUNTAIN">Himalayan & Hill Mountain</option>
              <option value="COASTAL_MARINE">Coastal & Marine</option>
              <option value="FOREST_WILDLIFE">Forest & Wildlife</option>
              <option value="DESERT_ARID">Desert & Arid</option>
              <option value="URBAN_HERITAGE">Plains & Heritage</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: Scenarios Grid */}
      {activeTab === 'scenarios' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayedScenarios.map((sc) => {
              const isActive = activeScenarioId === sc.id;
              const isCritical = sc.expected_risk_category === 'CRITICAL';
              const isHigh = sc.expected_risk_category === 'HIGH';

              return (
                <div
                  key={sc.id}
                  className={`glass-panel p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isActive
                      ? isCritical
                        ? 'border-red-500/60 bg-red-950/20'
                        : 'border-amber-500/60 bg-amber-950/20'
                      : 'border-white/[0.06] hover:border-white/[0.12] bg-[#12141d]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                          isCritical
                            ? 'bg-red-500/10 text-red-400'
                            : isHigh
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {isCritical ? <CloudLightning className="w-4 h-4" /> : isHigh ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold text-white">{sc.title}</h3>
                          <div className="text-[10px] text-slate-400">{sc.title_hi}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-0.5 shrink-0">
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium border ${
                          isCritical
                            ? 'bg-red-500/10 text-red-300 border-red-500/30'
                            : isHigh
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {sc.expected_risk_category}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">{sc.zone_name || sc.region_type}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 my-2 leading-relaxed">
                      {sc.description}
                    </p>

                    {/* Meteorological Parameters */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400 mb-2.5 bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-sky-400" />
                        Rain: {sc.weather.precipitation_mm_hr}mm/h
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3 text-slate-300" />
                        Wind: {sc.weather.wind_speed_kmh}km/h
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-amber-400" />
                        Temp: {sc.weather.temperature_c}°C
                      </span>
                      <span>•</span>
                      <span className={sc.weather.imd_alert === 'RED' ? 'text-red-400 font-bold' : sc.weather.imd_alert === 'ORANGE' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        IMD: {sc.weather.imd_alert}
                      </span>
                    </div>

                    {sc.primary_agency && (
                      <div className="text-[10px] text-slate-400 mb-2 flex items-center justify-between bg-[#0e1017] px-2 py-0.5 rounded border border-white/[0.04]">
                        <span className="text-slate-400">Response: {sc.primary_agency}</span>
                        {sc.evacuation_target && (
                          <span className="text-amber-400 font-mono">Shelter: {sc.evacuation_target}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onTriggerScenario(sc)}
                    className={`btn-tactile w-full py-1.5 px-3 rounded text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
                      isActive
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-[#181b26] hover:bg-[#202434] text-slate-200 border border-white/[0.08]'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Zap className="w-3 h-3" />
                        <span>Scenario Active in Risk Engine</span>
                      </>
                    ) : (
                      <>
                        <PlayScenarioIcon />
                        <span>Inject Multi-Region Hazard</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Official Incident History Records */}
      {activeTab === 'history' && !isPanIndia && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Disaster Records for <strong>{simData?.destination || currentPlace}</strong> ({incidentHistory.length} records):
            </span>
          </div>

          <div className="space-y-2.5">
            {incidentHistory.map((inc) => {
              const isCritical = inc.severity === 'CRITICAL';
              const isHigh = inc.severity === 'HIGH';

              return (
                <div
                  key={inc.id}
                  className="glass-panel p-4 rounded-xl border border-white/[0.06] bg-[#12141d] space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-[#0e1017]">
                        <History className="w-3.5 h-3.5 text-sky-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{inc.title}</h4>
                        <div className="text-[10px] font-mono text-sky-400">{inc.year_or_date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium border ${
                        isCritical
                          ? 'bg-red-500/10 text-red-300 border-red-500/30'
                          : isHigh
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {inc.severity}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 bg-[#0e1017] px-1.5 py-0.2 rounded border border-white/[0.04]">
                        {inc.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {inc.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                      <div className="text-slate-500 text-[9px] font-mono uppercase">Mitigation Taken</div>
                      <div className="text-emerald-300 text-[11px] mt-0.5">{inc.mitigation_taken}</div>
                    </div>
                    <div className="bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                      <div className="text-slate-500 text-[9px] font-mono uppercase">Reporting Agency</div>
                      <div className="text-slate-300 text-[11px] mt-0.5 font-mono">{inc.reporting_agency}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Evacuation Shelters */}
      {activeTab === 'shelters' && !isPanIndia && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {shelters.map((sh) => (
              <div
                key={sh.id}
                className="glass-panel p-4 rounded-xl border border-white/[0.06] bg-[#12141d] space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{sh.name}</h4>
                      <div className="text-[10px] text-slate-400 font-mono">GPS: {sh.lat.toFixed(4)}, {sh.lon.toFixed(4)}</div>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                    SHELTER
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  <div className="bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                    <span className="text-slate-500 text-[9px]">Capacity:</span>
                    <div className="font-semibold text-sky-400">{sh.capacity_persons || 1000} Persons</div>
                  </div>
                  <div className="bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                    <span className="text-slate-500 text-[9px]">Phone:</span>
                    <div className="font-semibold text-amber-400">{sh.contact_phone || '112'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: National Early Warning Bulletins */}
      {activeTab === 'bulletins' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nationalBulletins.map((nb) => {
              const isRed = nb.severity === 'RED';
              const isOrange = nb.severity === 'ORANGE';

              return (
                <div
                  key={nb.id}
                  className={`glass-panel p-3.5 rounded-xl border transition-all ${
                    isRed
                      ? 'border-red-500/30 bg-red-950/15'
                      : isOrange
                      ? 'border-amber-500/30 bg-amber-950/15'
                      : 'border-emerald-500/30 bg-emerald-950/15'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <ShieldAlert className={`w-3.5 h-3.5 ${isRed ? 'text-red-400' : isOrange ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span className="text-xs font-semibold text-white">{nb.agency}</span>
                    </div>

                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium border ${
                      isRed
                        ? 'bg-red-500/10 text-red-300 border-red-500/30'
                        : isOrange
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {nb.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-medium text-slate-100 mb-1">{nb.headline}</h4>
                  {nb.headline_hi && <div className="text-[10px] text-slate-400 mb-2">{nb.headline_hi}</div>}

                  <div className="pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span>Impact:</span>
                      {nb.impact_regions.map((reg) => (
                        <span key={reg} className="px-1 py-0.2 rounded bg-[#0e1017] text-slate-300 border border-white/[0.04]">
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

      {/* Reroute Evaluation Output Card */}
      {rerouteData && (
        <div className="glass-panel p-4 sm:p-5 rounded-xl border border-amber-500/40 bg-[#12141d] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Navigation className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Dynamic Evacuation Directive ({rerouteData.destination})</h3>
                <div className="text-[10px] text-slate-400 font-mono">Action: {rerouteData.action_type} • Region: {rerouteData.region_type}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">Risk:</span>
                <span className="font-mono text-xs font-bold text-red-400">
                  {rerouteData.current_risk_score}/100
                </span>
              </div>

              {onNavigateToMap && (
                <button
                  onClick={onNavigateToMap}
                  className="btn-tactile px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>View on Map</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 space-y-1">
            <div className="font-semibold flex items-center gap-1 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Safety Dispatch Instructions:</span>
            </div>
            <p className="leading-relaxed">{rerouteData.instructions}</p>
          </div>

          {rerouteData.nearest_shelter && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-[#0e1017] p-2.5 rounded border border-white/[0.04]">
                <div className="text-slate-400 text-[10px]">Shelter</div>
                <div className="font-semibold text-white mt-0.5 truncate">{rerouteData.nearest_shelter.name}</div>
              </div>
              <div className="bg-[#0e1017] p-2.5 rounded border border-white/[0.04]">
                <div className="text-slate-400 text-[10px]">Distance</div>
                <div className="font-mono font-semibold text-sky-400 mt-0.5">{rerouteData.nearest_shelter.distance_m || 480}m</div>
              </div>
              <div className="bg-[#0e1017] p-2.5 rounded border border-white/[0.04]">
                <div className="text-slate-400 text-[10px]">Helpline</div>
                <div className="font-mono font-semibold text-amber-400 mt-0.5">{rerouteData.nearest_shelter.contact_phone || '112'}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PlayScenarioIcon = () => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default DisasterBench;
