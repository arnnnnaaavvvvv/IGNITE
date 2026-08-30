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
import { t, getLocalizedDestinationName } from '../../services/i18n';

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
  { name: 'All India', label: 'All India', label_hi: 'संपूर्ण भारत', isAll: true },
  { name: 'Kedarnath', label: 'Kedarnath', label_hi: 'केदारनाथ धाम', zone: 'Himalayan North' },
  { name: 'Puri', label: 'Puri Beach', label_hi: 'पुरी तट', zone: 'Bay of Bengal' },
  { name: 'Kaziranga', label: 'Kaziranga', label_hi: 'काजीरंगा', zone: 'Northeast Wildlife' },
  { name: 'Jaisalmer', label: 'Jaisalmer', label_hi: 'जैसलमेर', zone: 'Thar Arid' },
  { name: 'Manali', label: 'Manali', label_hi: 'मनाली', zone: 'Himachal' },
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
  const isHi = language === 'hi';
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
      <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#0e1017] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Radio className="w-3 h-3 text-amber-400" />
                {t('disaster_heading', language)}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">
                {isPanIndia ? (isHi ? 'संपूर्ण भारत' : 'All India') : `${isHi ? 'चयनित:' : 'Target:'} ${getLocalizedDestinationName(simData?.destination || currentPlace, language)}`}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isPanIndia
                ? (isHi ? 'भारत में सक्रिय मौसम अलर्ट व स्थान अपडेट्स' : 'Live Weather Alerts & Place News across India')
                : `${isHi ? 'ताज़ा स्थान अपडेट्स व अलर्ट — ' : 'Live Place Updates & Alerts — '}${getLocalizedDestinationName(simData?.destination || currentPlace, language)}`}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isLoading && (
              <div className="flex items-center gap-1.5 bg-[#12141d] px-2 py-0.5 rounded border border-white/[0.08] text-[10px] text-sky-300 font-mono">
                <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
                <span>{isHi ? 'अपडेट हो रहा है...' : 'Syncing...'}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-[#12141d] px-2.5 py-1 rounded border border-white/[0.08]">
              <span className="text-[10px] text-slate-400">{isHi ? 'स्थिति:' : 'Status:'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold border ${
                isSimulating
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              }`}>
                {isSimulating ? (isHi ? 'खतरा अलर्ट सक्रिय' : 'HAZARD ACTIVE') : (isHi ? 'सामान्य व सुरक्षित' : 'NORMAL')}
              </span>
            </div>

            {simData?.elevation_m && (
              <div className="hidden sm:flex items-center gap-1 bg-[#12141d] px-2.5 py-1 rounded border border-white/[0.08] text-[11px] font-mono">
                <Mountain className="w-3 h-3 text-emerald-400" />
                <span className="text-slate-400">{isHi ? 'ऊंचाई:' : 'Alt:'}</span>
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
              <span>{isHi ? 'स्थान के लिए ताज़ा अपडेट्स व अलर्ट देखें:' : 'Select Place for Live News & Weather Updates:'}</span>
            </div>

            {currentPlace && (
              <button
                onClick={handleClearPlace}
                className="btn-tactile text-[11px] font-semibold px-2.5 py-1 rounded bg-[#12141d] hover:bg-[#181b26] text-amber-300 border border-amber-500/30 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>{isHi ? 'संपूर्ण भारत पर रीसेट करें' : 'Reset to All India'}</span>
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
                placeholder={currentPlace ? `${isHi ? 'चयनित: ' : 'Target: '}${getLocalizedDestinationName(currentPlace, language)} (${isHi ? 'बदलने के लिए खोजें...' : 'Search to change...'})` : (isHi ? 'कोई भी भारतीय शहर या तीर्थ खोजें...' : 'Search any destination in India...')}
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
                    {isHi ? 'स्थान खोजा जा रहा है...' : 'Searching destination atlas...'}
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
                          <span className="font-semibold text-white">{getLocalizedDestinationName(res.canonical_name, language)}</span>
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
                    {isHi ? 'कोई स्थान नहीं मिला' : 'No destinations found'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Select Popular Destinations */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 text-[11px] shrink-0">{isHi ? 'लोकप्रिय:' : 'Quick:'}</span>
            {POPULAR_DESTINATIONS.map((dest) => {
              const isSelected = (!currentPlace && dest.isAll) || currentPlace === dest.name;
              return (
                <button
                  key={dest.name}
                  onClick={() => dest.isAll ? handleClearPlace() : handleSelectPlace(dest.name)}
                  className={`btn-tactile px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-[#12141d] text-slate-400 hover:text-white border-white/[0.06] hover:border-white/[0.12]'
                  }`}
                >
                  {isHi ? dest.label_hi : dest.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-1 gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`btn-tactile px-3 py-1.5 rounded-t-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'scenarios'
                ? 'text-amber-400 border-amber-400 bg-[#12141d]/80'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t('tab_scenarios', language)}</span>
            <span className="text-[10px] font-mono px-1 rounded bg-white/[0.06] text-slate-300">
              {displayedScenarios.length}
            </span>
          </button>

          {!isPanIndia && (
            <button
              onClick={() => setActiveTab('history')}
              className={`btn-tactile px-3 py-1.5 rounded-t-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                activeTab === 'history'
                  ? 'text-sky-400 border-sky-400 bg-[#12141d]/80'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>{t('tab_history', language)}</span>
              <span className="text-[10px] font-mono px-1 rounded bg-white/[0.06] text-slate-300">
                {incidentHistory.length}
              </span>
            </button>
          )}

          {!isPanIndia && (
            <button
              onClick={() => setActiveTab('shelters')}
              className={`btn-tactile px-3 py-1.5 rounded-t-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
                activeTab === 'shelters'
                  ? 'text-emerald-400 border-emerald-400 bg-[#12141d]/80'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{t('tab_shelters', language)}</span>
              <span className="text-[10px] font-mono px-1 rounded bg-white/[0.06] text-slate-300">
                {shelters.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('bulletins')}
            className={`btn-tactile px-3 py-1.5 rounded-t-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'bulletins'
                ? 'text-red-400 border-red-400 bg-[#12141d]/80'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t('tab_bulletins', language)}</span>
            <span className="text-[10px] font-mono px-1 rounded bg-white/[0.06] text-slate-300">
              {nationalBulletins.length}
            </span>
          </button>
        </div>

        {isPanIndia && activeTab === 'scenarios' && (
          <div className="flex items-center gap-1 text-xs">
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              aria-label="Filter scenarios by zone"
              className="bg-[#12141d] border border-white/[0.08] rounded text-xs text-slate-200 px-2 py-0.5 font-mono"
            >
              <option value="ALL">{isHi ? 'सभी 6 प्राकृतिक क्षेत्र' : 'All 6 Environmental Zones'}</option>
              <option value="HILL_MOUNTAIN">{isHi ? 'पर्वतीय एवं हिमालयी' : 'Himalayan & Mountain'}</option>
              <option value="COASTAL_MARINE">{isHi ? 'तटीय व समुद्री' : 'Coastal & Marine'}</option>
              <option value="FOREST_WILDLIFE">{isHi ? 'वन्यजीव अभयारण्य' : 'Forest & Wildlife'}</option>
              <option value="DESERT_ARID">{isHi ? 'मरुस्थलीय क्षेत्र' : 'Desert & Arid'}</option>
              <option value="URBAN_HERITAGE">{isHi ? 'मैदानी व तीर्थ' : 'Plains & Heritage'}</option>
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
              const titleText = isHi && sc.title_hi ? sc.title_hi : sc.title;
              const descText = isHi && sc.description_hi ? sc.description_hi : sc.description;

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
                          <h3 className="text-xs font-semibold text-white">{titleText}</h3>
                          <div className="text-[10px] text-slate-400">{isHi ? sc.title : sc.title_hi}</div>
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
                          {isHi ? (isCritical ? 'गंभीर' : isHigh ? 'उच्च' : 'मध्यम') : sc.expected_risk_category}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">{sc.zone_name || sc.region_type}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 my-2 leading-relaxed">
                      {descText}
                    </p>

                    {/* Meteorological Parameters */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400 mb-2.5 bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-sky-400" />
                        {isHi ? 'वर्षा:' : 'Rain:'} {sc.weather.precipitation_mm_hr}mm/h
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3 text-slate-300" />
                        {isHi ? 'हवा:' : 'Wind:'} {sc.weather.wind_speed_kmh}km/h
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-amber-400" />
                        {isHi ? 'तापमान:' : 'Temp:'} {sc.weather.temperature_c}°C
                      </span>
                      <span>•</span>
                      <span className={sc.weather.imd_alert === 'RED' ? 'text-red-400 font-bold' : sc.weather.imd_alert === 'ORANGE' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        IMD: {sc.weather.imd_alert}
                      </span>
                    </div>

                    {sc.primary_agency && (
                      <div className="text-[10px] text-slate-400 mb-2 flex items-center justify-between bg-[#0e1017] px-2 py-0.5 rounded border border-white/[0.04]">
                        <span className="text-slate-400">{isHi ? 'सुरक्षा एजेंसी:' : 'Response:'} {sc.primary_agency}</span>
                        {sc.evacuation_target && (
                          <span className="text-amber-400 font-mono">{isHi ? 'आश्रय:' : 'Shelter:'} {sc.evacuation_target}</span>
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
                        <span>{isHi ? 'परिदृश्य सक्रिय है' : 'Scenario Active in Risk Engine'}</span>
                      </>
                    ) : (
                      <>
                        <PlayScenarioIcon />
                        <span>{t('btn_trigger_hazard', language)}</span>
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
              {isHi ? 'ऐतिहासिक आपदा रिकॉर्ड — ' : 'Disaster Records for '}<strong>{getLocalizedDestinationName(simData?.destination || currentPlace, language)}</strong> ({incidentHistory.length} {isHi ? 'रिकॉर्ड' : 'records'}):
            </span>
          </div>

          <div className="space-y-2.5">
            {incidentHistory.map((inc) => {
              const isCritical = inc.severity === 'CRITICAL';
              const isHigh = inc.severity === 'HIGH';
              const incTitle = isHi && inc.title_hi ? inc.title_hi : inc.title;
              const incDesc = isHi && inc.description_hi ? inc.description_hi : inc.description;
              const incMitigation = isHi && inc.mitigation_taken_hi ? inc.mitigation_taken_hi : inc.mitigation_taken;

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
                        <h4 className="text-xs font-semibold text-white">{incTitle}</h4>
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
                    {incDesc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                      <div className="text-slate-500 text-[9px] font-mono uppercase">{isHi ? 'सुरक्षा उपाय' : 'Mitigation Taken'}</div>
                      <div className="text-emerald-300 text-[11px] mt-0.5">{incMitigation}</div>
                    </div>
                    <div className="bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                      <div className="text-slate-500 text-[9px] font-mono uppercase">{isHi ? 'रिपोर्टिंग एजेंसी' : 'Reporting Agency'}</div>
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
                    {isHi ? 'आश्रय स्थल' : 'SHELTER'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  <div className="bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                    <span className="text-slate-500 text-[9px]">{isHi ? 'क्षमता:' : 'Capacity:'}</span>
                    <div className="font-semibold text-sky-400">{sh.capacity_persons || 1000} {isHi ? 'व्यक्ति' : 'Persons'}</div>
                  </div>
                  <div className="bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                    <span className="text-slate-500 text-[9px]">{isHi ? 'फोन:' : 'Phone:'}</span>
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
              const headlineText = isHi && nb.headline_hi ? nb.headline_hi : nb.headline;

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

                  <h4 className="text-xs font-medium text-slate-100 mb-1">{headlineText}</h4>
                  <div className="text-[10px] text-slate-400 mb-2">{isHi ? nb.headline : nb.headline_hi}</div>

                  <div className="pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span>{isHi ? 'प्रभावित क्षेत्र:' : 'Impact:'}</span>
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
                <h3 className="text-xs font-bold text-white">{isHi ? 'सुरक्षित बाईपास निर्देश' : 'Safe Detour Directive'} ({getLocalizedDestinationName(rerouteData.destination, language)})</h3>
                <div className="text-[10px] text-slate-400 font-mono">Action: {rerouteData.action_type} • Region: {rerouteData.region_type}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">{isHi ? 'जोखिम:' : 'Risk:'}</span>
                <span className="font-mono text-xs font-bold text-red-400">
                  {rerouteData.current_risk_score}/100
                </span>
              </div>

              {onNavigateToMap && (
                <button
                  onClick={onNavigateToMap}
                  className="btn-tactile px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('view_reroute_map', language)}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 space-y-1">
            <div className="font-semibold flex items-center gap-1 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isHi ? 'सुरक्षा निर्देश:' : 'Safety Instructions:'}</span>
            </div>
            <p className="leading-relaxed">
              {isHi && rerouteData.instructions_hi ? rerouteData.instructions_hi : rerouteData.instructions}
            </p>
          </div>

          {rerouteData.nearest_shelter && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-[#0e1017] p-2.5 rounded border border-white/[0.04]">
                <div className="text-slate-400 text-[10px]">{isHi ? 'आश्रय स्थल' : 'Shelter'}</div>
                <div className="font-semibold text-white mt-0.5 truncate">{rerouteData.nearest_shelter.name}</div>
              </div>
              <div className="bg-[#0e1017] p-2.5 rounded border border-white/[0.04]">
                <div className="text-slate-400 text-[10px]">{isHi ? 'दूरी' : 'Distance'}</div>
                <div className="font-mono font-semibold text-sky-400 mt-0.5">{rerouteData.nearest_shelter.distance_m || 480}m</div>
              </div>
              <div className="bg-[#0e1017] p-2.5 rounded border border-white/[0.04]">
                <div className="text-slate-400 text-[10px]">{isHi ? 'हेल्पलाइन' : 'Helpline'}</div>
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
