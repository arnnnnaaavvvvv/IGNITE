import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Wallet, Activity, MapPin, Sparkles, Search } from 'lucide-react';
import type { DestinationSearchResult, RegionType } from '../../types';

interface TripWizardProps {
  onGenerate: (params: {
    destination: string;
    duration_days: number;
    budget_tier: string;
    total_budget_inr: number;
    fitness_level: string;
  }) => void;
  isLoading: boolean;
  selectedDestinationName?: string;
}

export const TripWizard: React.FC<TripWizardProps> = ({
  onGenerate,
  isLoading,
  selectedDestinationName = 'Kedarnath',
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedDestinationName);
  const [searchResults, setSearchResults] = useState<DestinationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [durationDays, setDurationDays] = useState(2);
  const [budgetTier, setBudgetTier] = useState<'BUDGET' | 'STANDARD' | 'COMFORT'>('STANDARD');
  const [budgetAmount, setBudgetAmount] = useState(12000);
  const [fitnessLevel, setFitnessLevel] = useState<'BEGINNER' | 'MODERATE' | 'EXPERIENCED'>('MODERATE');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync prop changes
  useEffect(() => {
    if (selectedDestinationName) {
      setSearchQuery(selectedDestinationName);
    }
  }, [selectedDestinationName]);

  // Live Place Autocomplete Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/v1/destinations/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults(data.results || []);
        } catch (err) {
          console.error('Destination search failed:', err);
        } finally {
          setIsSearching(false);
        }
      }
    }, 250);

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
  };

  const handleQuickPick = (name: string) => {
    setSearchQuery(name);
    setShowDropdown(false);
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
      budget_tier: budgetTier,
      total_budget_inr: budgetAmount,
      fitness_level: fitnessLevel,
    });
  };

  const getRegionBadge = (type: RegionType) => {
    switch (type) {
      case 'HILL_MOUNTAIN':
        return { label: '🏔️ Hill / Mountain', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'COASTAL_MARINE':
        return { label: '🏖️ Coastal / Beach', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'FOREST_WILDLIFE':
        return { label: '🐅 Forest / Wildlife', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'DESERT_ARID':
        return { label: '🏜️ Desert / Dunes', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
      case 'URBAN_HERITAGE':
        return { label: '🏛️ Urban / Heritage', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
    }
  };

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
            <div className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl p-1.5 space-y-1 backdrop-blur-xl">
              {searchResults.map((item) => {
                const badge = getRegionBadge(item.region_type);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectDestination(item)}
                    className="w-full p-2.5 rounded-lg text-left hover:bg-slate-800/80 transition-all flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{item.canonical_name}</span>
                        {item.name_hi && (
                          <span className="text-[10px] text-slate-400 font-sans font-normal">({item.name_hi})</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.state_ut}</div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Category Pickers */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 text-[10px] font-medium text-slate-300">
            <span className="text-slate-500 shrink-0">Popular:</span>
            <button
              type="button"
              onClick={() => handleQuickPick('Kedarnath')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 shrink-0 cursor-pointer"
            >
              🏔️ Kedarnath (Himalayas)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick('Puri & Golden Beach Corridor')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 shrink-0 cursor-pointer"
            >
              🏖️ Puri Beach (Coastal)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick('Kaziranga National Park')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 shrink-0 cursor-pointer"
            >
              🐅 Kaziranga (Forest)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPick('Jaisalmer & Sam Sand Dunes')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 shrink-0 cursor-pointer"
            >
              🏜️ Jaisalmer (Desert)
            </button>
          </div>
        </div>

        {/* Duration Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trip Duration & Acclimatized Pacing</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { days: 1, label: '1 Day', sub: 'Express Circuit' },
              { days: 2, label: '2 Days', sub: 'Standard Safe' },
              { days: 3, label: '3 Days', sub: 'Relaxed / Deep Explore' },
            ].map((item) => (
              <button
                type="button"
                key={item.days}
                onClick={() => setDurationDays(item.days)}
                className={`py-2 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                  durationDays === item.days
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{item.label}</div>
                <div className="text-[10px] text-slate-400 truncate">{item.sub}</div>
              </button>
            ))}
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
