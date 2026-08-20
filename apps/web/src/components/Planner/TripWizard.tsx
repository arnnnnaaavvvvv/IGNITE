import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Wallet,
  Activity,
  MapPin,
  Sparkles,
  Search,
  Clock,
  Plus,
  Minus,
  SlidersHorizontal,
  ArrowRight,
  Info,
  ShieldCheck,
} from 'lucide-react';
import type { DestinationSearchResult, RegionType } from '../../types';

interface TripWizardProps {
  onGenerate: (params: {
    destination: string;
    duration_days: number;
    start_date?: string;
    end_date?: string;
    budget_tier: string;
    total_budget_inr: number;
    fitness_level: string;
  }) => void;
  isLoading: boolean;
  selectedDestinationName?: string;
  onPreviewDestination?: (dest: { lat: number; lon: number; name: string } | null) => void;
}

// Date helpers
const getTodayIso = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDaysIso = (isoDate: string, days: number) => {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayStr = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayStr}`;
};

const calcDaysDiff = (startIso: string, endIso: string) => {
  const [y1, m1, d1] = startIso.split('-').map(Number);
  const [y2, m2, d2] = endIso.split('-').map(Number);
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  const diffTime = date2.getTime() - date1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
};

const formatReadableDate = (isoDate: string) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
};

export const TripWizard: React.FC<TripWizardProps> = ({
  onGenerate,
  isLoading,
  selectedDestinationName = '',
  onPreviewDestination,
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedDestinationName || '');
  const [searchResults, setSearchResults] = useState<DestinationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Duration & Custom Dates State (Clean 2-mode system: Dates vs Exact Days)
  const [durationMode, setDurationMode] = useState<'dates' | 'custom_days'>('dates');
  const [startDate, setStartDate] = useState<string>(getTodayIso());
  const [endDate, setEndDate] = useState<string>(addDaysIso(getTodayIso(), 1));
  const [durationDays, setDurationDays] = useState(2);

  const [budgetTier, setBudgetTier] = useState<'BUDGET' | 'STANDARD' | 'COMFORT'>('STANDARD');
  const [budgetAmount, setBudgetAmount] = useState(12000);
  const [fitnessLevel, setFitnessLevel] = useState<'BEGINNER' | 'MODERATE' | 'EXPERIENCED'>('MODERATE');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync prop changes
  useEffect(() => {
    if (selectedDestinationName !== undefined) {
      setSearchQuery(selectedDestinationName);
    }
  }, [selectedDestinationName]);

  // Live Place Autocomplete Search & Dynamic Zoom Trigger
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      onPreviewDestination?.(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/v1/destinations/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        const results: DestinationSearchResult[] = data.results || [];
        setSearchResults(results);

        // If results found with coordinates, zoom map smoothly to top match
        if (results.length > 0 && results[0].lat && results[0].lon) {
          onPreviewDestination?.({
            lat: results[0].lat,
            lon: results[0].lon,
            name: results[0].canonical_name,
          });
        }
      } catch (err) {
        console.error('Destination search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDestination = (dest: DestinationSearchResult) => {
    setSearchQuery(dest.canonical_name);
    setShowDropdown(false);
    if (dest.lat && dest.lon) {
      onPreviewDestination?.({
        lat: dest.lat,
        lon: dest.lon,
        name: dest.canonical_name,
      });
    }
  };

  const handleQuickPick = (name: string, lat?: number, lon?: number) => {
    setSearchQuery(name);
    setShowDropdown(false);
    if (lat && lon) {
      onPreviewDestination?.({
        lat,
        lon,
        name,
      });
    }
  };

  const handleDurationChange = (days: number) => {
    const safeDays = Math.max(1, Math.min(30, days));
    setDurationDays(safeDays);
    setEndDate(addDaysIso(startDate, safeDays - 1));
  };

  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (newStart > endDate) {
      const newEnd = addDaysIso(newStart, durationDays - 1);
      setEndDate(newEnd);
    } else {
      const days = calcDaysDiff(newStart, endDate);
      setDurationDays(days);
    }
  };

  const handleEndDateChange = (newEnd: string) => {
    if (newEnd < startDate) {
      setEndDate(startDate);
      setDurationDays(1);
    } else {
      setEndDate(newEnd);
      const days = calcDaysDiff(startDate, newEnd);
      setDurationDays(days);
    }
  };

  const handleTierChange = (tier: 'BUDGET' | 'STANDARD' | 'COMFORT') => {
    setBudgetTier(tier);
    if (tier === 'BUDGET') setBudgetAmount(4500);
    else if (tier === 'STANDARD') setBudgetAmount(12000);
    else setBudgetAmount(26000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      destination: searchQuery,
      duration_days: durationDays,
      start_date: startDate,
      end_date: endDate,
      budget_tier: budgetTier,
      total_budget_inr: budgetAmount,
      fitness_level: fitnessLevel,
    });
  };

  const [selectedCircuitTab, setSelectedCircuitTab] = useState<'CHAR_DHAM' | 'CHOTA_CHAR_DHAM' | 'JYOTIRLINGA' | 'SHRINES'>('CHAR_DHAM');

  const getRegionBadge = (type: RegionType) => {
    switch (type) {
      case 'HILL_MOUNTAIN':
        return { label: 'Hill / Mountain', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'COASTAL_MARINE':
        return { label: 'Coastal / Beach', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'PLAINS_RIVERINE':
        return { label: 'Plains / Riverine', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'FOREST_WILDLIFE':
        return { label: 'Forest / Wildlife', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'DESERT_ARID':
        return { label: 'Desert / Dunes', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
      case 'URBAN_HERITAGE':
        return { label: 'Urban / Heritage', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      default:
        return { label: 'Pan-India', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
    }
  };

  const PILGRIMAGE_CIRCUITS_DATA = {
    CHAR_DHAM: {
      name: 'Char Dham (Cardinal)',
      items: [
        { name: 'Badrinath Dham', state: 'Uttarakhand', lat: 30.7447, lon: 79.4912 },
        { name: 'Dwarkadhish Temple Dwarka', state: 'Gujarat', lat: 22.2442, lon: 68.9685 },
        { name: 'Puri Shri Jagannath Dham', state: 'Odisha', lat: 19.8135, lon: 85.8312 },
        { name: 'Ramanathaswamy Temple Rameswaram', state: 'Tamil Nadu', lat: 9.2881, lon: 79.3174 },
      ],
    },
    CHOTA_CHAR_DHAM: {
      name: 'Chota Char Dham',
      items: [
        { name: 'Yamunotri Dham', state: 'Uttarakhand', lat: 31.0140, lon: 78.4600 },
        { name: 'Gangotri Dham', state: 'Uttarakhand', lat: 30.9947, lon: 78.9398 },
        { name: 'Kedarnath Dham', state: 'Uttarakhand', lat: 30.7352, lon: 79.0669 },
        { name: 'Badrinath Dham', state: 'Uttarakhand', lat: 30.7447, lon: 79.4912 },
      ],
    },
    JYOTIRLINGA: {
      name: '12 Jyotirlingas',
      items: [
        { name: 'Somnath Jyotirlinga Temple', state: 'Gujarat', lat: 20.8880, lon: 70.4012 },
        { name: 'Mallikarjuna Jyotirlinga Srisailam', state: 'Andhra Pradesh', lat: 16.0745, lon: 78.8687 },
        { name: 'Mahakaleshwar Jyotirlinga Ujjain', state: 'Madhya Pradesh', lat: 23.1827, lon: 75.7682 },
        { name: 'Omkareshwar Jyotirlinga', state: 'Madhya Pradesh', lat: 22.2464, lon: 76.1517 },
        { name: 'Kedarnath Dham', state: 'Uttarakhand', lat: 30.7352, lon: 79.0669 },
        { name: 'Bhimashankar Jyotirlinga', state: 'Maharashtra', lat: 19.0722, lon: 73.5354 },
        { name: 'Kashi Vishwanath Temple Varanasi', state: 'Uttar Pradesh', lat: 25.3109, lon: 83.0107 },
        { name: 'Trimbakeshwar Jyotirlinga', state: 'Maharashtra', lat: 19.9322, lon: 73.5308 },
        { name: 'Baidyanath Jyotirlinga Deoghar', state: 'Jharkhand', lat: 24.4925, lon: 86.7000 },
        { name: 'Nageshwar Jyotirlinga', state: 'Gujarat', lat: 22.3353, lon: 69.0538 },
        { name: 'Ramanathaswamy Temple Rameswaram', state: 'Tamil Nadu', lat: 9.2881, lon: 79.3174 },
        { name: 'Grishneshwar Jyotirlinga Ellora', state: 'Maharashtra', lat: 20.0244, lon: 75.1722 },
      ],
    },
    SHRINES: {
      name: 'Prominent Shrines',
      items: [
        { name: 'Ajmer Sharif Dargah', state: 'Rajasthan', lat: 26.4561, lon: 74.6282 },
        { name: 'Shirdi Sai Baba Samadhi Mandir', state: 'Maharashtra', lat: 19.7667, lon: 74.4764 },
        { name: 'Palitana Shatrunjaya Temples', state: 'Gujarat', lat: 21.5033, lon: 71.7828 },
        { name: 'Swaminarayan Akshardham Temple Delhi', state: 'Delhi', lat: 28.6127, lon: 77.2773 },
      ],
    },
  };

  // Pacing status based on duration
  const getPacingInsights = (days: number) => {
    if (days === 1) {
      return {
        badge: 'Ultra-Express Pacing',
        color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
        desc: 'Concentrated full-day load. Strict 07:00 IST start required to beat dusk curfews.',
      };
    }
    if (days === 2) {
      return {
        badge: 'Standard Safe Pacing',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
        desc: 'Optimal baseline split with overnight recovery and safe elevation progression.',
      };
    }
    if (days <= 4) {
      return {
        badge: 'Acclimatized Safe Pacing',
        color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
        desc: 'Gradual altitude & terrain adaptation. Lowest hypoxia & cardiovascular stress.',
      };
    }
    if (days <= 7) {
      return {
        badge: 'Extended Exploration & Buffer',
        color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
        desc: 'Comprehensive multi-sector circuit with scheduled weather buffers & rest intervals.',
      };
    }
    return {
      badge: 'Grand Multi-Stage Expedition',
      color: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
      desc: 'Deep regional traverse with dedicated acclimatization rest halts & supply logistics.',
    };
  };

  const pacing = getPacingInsights(durationDays);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-visible">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Pan-India Smart Route Planner</h2>
            <p className="text-xs text-slate-400">Search any place across India for automated risk classification & itinerary</p>
          </div>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-emerald-400 font-mono font-bold">
          PAN-INDIA RESOLVER
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Dynamic Destination Search Autocomplete Bar */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Destination or Landmark (Anywhere in India)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Auto-Geocoded</span>
          </label>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="e.g. Kaziranga, Puri Beach, Jaisalmer, Manali, Kedarnath, Munnar..."
              className="w-full bg-slate-900 border border-slate-700/90 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {isSearching && (
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin absolute right-3.5 top-3" />
            )}
          </div>

          {/* Autocomplete Dropdown List */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-72 overflow-y-auto rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl p-1.5 space-y-1.5 backdrop-blur-xl">
              {searchResults.map((item) => {
                const badge = getRegionBadge(item.region_type);
                const isPilgrimage = item.category === 'pilgrimage' || !!item.pilgrimage_metadata;
                const circuits = item.pilgrimage_metadata?.circuits || [];
                const mobility = item.pilgrimage_metadata?.mobility_tier;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectDestination(item)}
                    className="w-full p-2.5 rounded-lg text-left hover:bg-slate-800/80 transition-all flex items-center justify-between gap-2 cursor-pointer border border-transparent hover:border-slate-700"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                        <span>{item.canonical_name}</span>
                        {item.name_hi && (
                          <span className="text-[10px] text-slate-400 font-sans font-normal">({item.name_hi})</span>
                        )}
                        {isPilgrimage && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                            Pilgrimage
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{item.state_ut}</span>
                        {circuits.length > 0 && (
                          <span className="text-emerald-400 font-medium">• {circuits.join(', ')}</span>
                        )}
                        {mobility && mobility !== 'PAVED_WALKWAY' && (
                          <span className="text-amber-400/90 font-mono">• {mobility.replace(/_/g, ' ')}</span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold border shrink-0 ${badge.color}`}>
                      {badge.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Popular Pilgrimage Circuits Quick-Selector Tray */}
          <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-amber-500/20 space-y-2.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <span>Popular Pilgrimage Circuits</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                {(['CHAR_DHAM', 'CHOTA_CHAR_DHAM', 'JYOTIRLINGA', 'SHRINES'] as const).map((tabKey) => {
                  const circuit = PILGRIMAGE_CIRCUITS_DATA[tabKey];
                  return (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => setSelectedCircuitTab(tabKey)}
                      className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                        selectedCircuitTab === tabKey
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {circuit.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Circuit Shrines Pill Grid */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-medium text-slate-300 scrollbar-thin">
              {PILGRIMAGE_CIRCUITS_DATA[selectedCircuitTab].items.map((shrine) => (
                <button
                  key={shrine.name}
                  type="button"
                  onClick={() => handleQuickPick(shrine.name, shrine.lat, shrine.lon)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-500/10 hover:border-amber-500/40 border border-slate-800 shrink-0 cursor-pointer text-left transition-all group flex items-center gap-1.5"
                >
                  <div>
                    <div className="font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
                      {shrine.name.split(' ')[0]}
                    </div>
                    <div className="text-[9px] text-slate-400">{shrine.state}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick General Category Pickers */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 text-[10px] font-medium text-slate-300">
            <span className="text-slate-500 shrink-0">Other Hotspots:</span>
            <button
              type="button"
              onClick={() => handleQuickPick('Puri Beach', 19.8135, 85.8312)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 shrink-0 cursor-pointer"
            >
              Puri Beach (Coastal)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick('Kaziranga National Park', 26.5775, 93.1711)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 shrink-0 cursor-pointer"
            >
              Kaziranga (Forest)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick('Jaisalmer Sand Dunes', 26.9157, 70.9083)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 shrink-0 cursor-pointer"
            >
              Jaisalmer (Desert)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick('Manali & Solang Valley', 32.2432, 77.1892)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 shrink-0 cursor-pointer"
            >
              Manali (Alpine)
            </button>
          </div>
        </div>

        {/* Enhanced Trip Duration & Acclimatized Pacing */}
        <div className="bg-slate-900/50 border border-slate-800/90 p-4 rounded-2xl space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Trip Duration & Acclimatized Pacing</span>
            </label>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 bg-slate-950/90 rounded-xl border border-slate-800/90 text-xs">
              <button
                type="button"
                onClick={() => setDurationMode('dates')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  durationMode === 'dates'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Custom Dates</span>
              </button>
              <button
                type="button"
                onClick={() => setDurationMode('custom_days')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  durationMode === 'custom_days'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Exact Days</span>
              </button>
            </div>
          </div>

          {/* Custom Date Range Picker Mode */}
          {durationMode === 'dates' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-colors">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Departure Date</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">Day 1</span>
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    min={getTodayIso()}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all [color-scheme:dark]"
                  />
                  <div className="text-[10px] text-slate-400 font-mono">
                    {formatReadableDate(startDate)}
                  </div>
                </div>

                <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-colors">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Return Date</span>
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">{durationDays} {durationDays === 1 ? 'Day' : 'Days'}</span>
                  </div>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all [color-scheme:dark]"
                  />
                  <div className="text-[10px] text-slate-400 font-mono">
                    {formatReadableDate(endDate)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exact Days Stepper & Slider Mode */}
          {durationMode === 'custom_days' && (
            <div className="space-y-3.5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDurationChange(durationDays - 1)}
                    disabled={durationDays <= 1}
                    aria-label="Decrease duration"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-slate-900 disabled:hover:border-slate-800 transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="px-4 py-1.5 rounded-lg bg-slate-900 border border-emerald-500/40 text-center min-w-[110px] shadow-sm">
                    <span className="text-base font-mono font-black text-emerald-300">{durationDays}</span>
                    <span className="text-xs text-slate-300 ml-1.5 font-semibold">{durationDays === 1 ? 'Day' : 'Days'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDurationChange(durationDays + 1)}
                    disabled={durationDays >= 30}
                    aria-label="Increase duration"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-300 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-slate-900 disabled:hover:border-slate-800 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <span>{formatReadableDate(startDate)}</span>
                  <span className="text-slate-600 mx-1">→</span>
                  <span className="text-emerald-400 font-medium">{formatReadableDate(endDate)}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={durationDays}
                  onChange={(e) => handleDurationChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Min: 1 Day</span>
                  <span className="text-slate-400">Target Range: 1 – 30 Days</span>
                  <span>Max: 30 Days</span>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Acclimatization Pacing Status Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border whitespace-nowrap shrink-0 flex items-center gap-1.5 ${pacing.color}`}>
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{pacing.badge}</span>
              </span>
              <div className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-slate-400">{formatReadableDate(startDate)}</span>
                <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-white font-bold">{formatReadableDate(endDate)}</span>
                <span className="text-emerald-400 font-bold ml-1">({durationDays} {durationDays === 1 ? 'Day' : 'Days'})</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{pacing.desc}</span>
            </div>
          </div>
        </div>

        {/* Budget Tier Selector & Custom Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Budget Allocation Tier</span>
            </label>
            <span className="text-xs font-mono font-bold text-emerald-400">
              ₹{budgetAmount.toLocaleString('en-IN')} INR
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { tier: 'BUDGET', label: 'Budget Traveler', desc: 'Govt Dorms / Homestays' },
              { tier: 'STANDARD', label: 'Balanced Comfort', desc: 'State Tourism Cottages' },
              { tier: 'COMFORT', label: 'Premium / Assisted', desc: 'Eco-Resorts & Private Jeep' },
            ].map((t) => (
              <button
                type="button"
                key={t.tier}
                onClick={() => handleTierChange(t.tier as any)}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  budgetTier === t.tier
                    ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">{t.label}</div>
                <div className="text-[10px] text-slate-400 mt-1">{t.desc}</div>
              </button>
            ))}
          </div>

          <input
            type="range"
            min={3000}
            max={40000}
            step={500}
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>Min: ₹3,000</span>
            <span>Includes 15% Regional Medical Reserve</span>
            <span>Max: ₹40,000</span>
          </div>
        </div>

        {/* Fitness Level Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cardiovascular Fitness & Terrain Readiness</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'BEGINNER', label: 'Beginner / Seniors', tag: 'Frequent rest halts' },
              { key: 'MODERATE', label: 'Moderate Fitness', tag: 'Standard trail pacing' },
              { key: 'EXPERIENCED', label: 'Experienced Trekker', tag: 'Fast adaptation' },
            ].map((f) => (
              <button
                type="button"
                key={f.key}
                onClick={() => setFitnessLevel(f.key as any)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  fitnessLevel === f.key
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">{f.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{f.tag}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Resolving Place & Computing Multi-Region Risk...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Safe Itinerary & Risk Matrix</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
