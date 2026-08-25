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
  X,
  Mountain,
  Palmtree,
  Trees,
  Landmark,
  Compass,
  Flame,
  ChevronRight,
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

// Curated Top Destinations by Category across India
const PAN_INDIA_CATEGORIES = [
  {
    id: 'top_picks',
    name: 'Top Picks',
    icon: Sparkles,
    color: 'emerald',
    badgeText: '🌟 Marquee India',
    items: [
      { name: 'Goa Beaches & Promenade', state: 'Goa', tag: 'Coastal Paradise', lat: 15.5170, lon: 73.7620, regionType: 'COASTAL_MARINE' },
      { name: 'Manali & Solang Valley', state: 'Himachal Pradesh', tag: 'Alpine Alps', lat: 32.2432, lon: 77.1892, regionType: 'HILL_MOUNTAIN' },
      { name: 'Jaipur, Amer Fort & Hawa Mahal', state: 'Rajasthan', tag: 'Royal Forts', lat: 26.9124, lon: 75.7873, regionType: 'URBAN_HERITAGE' },
      { name: 'Leh, Pangong Tso & Khardung La', state: 'Ladakh', tag: 'High Altitude 3,500m', lat: 34.1526, lon: 77.5771, regionType: 'HILL_MOUNTAIN' },
      { name: 'Munnar & Anamudi Highlands', state: 'Kerala', tag: 'Tea Valleys', lat: 10.0889, lon: 77.0595, regionType: 'HILL_MOUNTAIN' },
      { name: 'Kaziranga National Park', state: 'Assam', tag: 'Rhino Sanctuary', lat: 26.5775, lon: 93.1711, regionType: 'FOREST_WILDLIFE' },
      { name: 'Udaipur & Lake Pichola', state: 'Rajasthan', tag: 'Lake Palaces', lat: 24.5854, lon: 73.7125, regionType: 'URBAN_HERITAGE' },
      { name: 'Hampi UNESCO Heritage Ruins', state: 'Karnataka', tag: 'Vijayanagara Empire', lat: 15.3350, lon: 76.4600, regionType: 'URBAN_HERITAGE' },
      { name: 'Havelock Island & Radhanagar', state: 'Andaman & Nicobar', tag: 'Turquoise Reefs', lat: 11.9761, lon: 92.9876, regionType: 'COASTAL_MARINE' },
      { name: 'Kashi Vishwanath & Ghats', state: 'Uttar Pradesh', tag: 'Ganga Aarti', lat: 25.3109, lon: 83.0107, regionType: 'URBAN_HERITAGE' },
    ],
  },
  {
    id: 'hill_stations',
    name: 'Hill Stations & Alps',
    icon: Mountain,
    color: 'teal',
    badgeText: '🏔️ Himalayan Peaks & Ghats',
    items: [
      { name: 'Manali & Solang Valley', state: 'Himachal Pradesh', tag: 'Snow & Pines (2,050m)', lat: 32.2432, lon: 77.1892, regionType: 'HILL_MOUNTAIN' },
      { name: 'Leh, Pangong Tso & Khardung La', state: 'Ladakh', tag: 'Trans-Himalaya (3,500m)', lat: 34.1526, lon: 77.5771, regionType: 'HILL_MOUNTAIN' },
      { name: 'Munnar & Anamudi Highlands', state: 'Kerala', tag: 'Western Ghats (1,530m)', lat: 10.0889, lon: 77.0595, regionType: 'HILL_MOUNTAIN' },
      { name: 'Rishikesh & Shivpuri River Valley', state: 'Uttarakhand', tag: 'Ganga Foothills (370m)', lat: 30.0869, lon: 78.2676, regionType: 'HILL_MOUNTAIN' },
      { name: 'Bir Billing Paragliding Valley', state: 'Himachal Pradesh', tag: 'Aero Ridge (2,400m)', lat: 32.0436, lon: 76.7167, regionType: 'HILL_MOUNTAIN' },
      { name: 'Kedarnath Dham & Valley', state: 'Uttarakhand', tag: 'Alpine Shrine (3,583m)', lat: 30.7352, lon: 79.0669, regionType: 'HILL_MOUNTAIN' },
      { name: 'Badrinath Dham & Mana', state: 'Uttarakhand', tag: 'Alaknanda (3,133m)', lat: 30.7447, lon: 79.4912, regionType: 'HILL_MOUNTAIN' },
      { name: 'Yamunotri Dham', state: 'Uttarakhand', tag: 'Garhwal Alps (3,293m)', lat: 31.0140, lon: 78.4600, regionType: 'HILL_MOUNTAIN' },
      { name: 'Gangotri Dham', state: 'Uttarakhand', tag: 'Bhagirathi (3,100m)', lat: 30.9947, lon: 78.9398, regionType: 'HILL_MOUNTAIN' },
    ],
  },
  {
    id: 'beaches',
    name: 'Beaches & Coastal',
    icon: Palmtree,
    color: 'cyan',
    badgeText: '🏖️ Sun, Sand & Azure Waters',
    items: [
      { name: 'Goa Beaches & Coastal Promenade', state: 'Goa', tag: 'Calangute & Baga', lat: 15.5170, lon: 73.7620, regionType: 'COASTAL_MARINE' },
      { name: 'Havelock Island & Radhanagar', state: 'Andaman & Nicobar', tag: 'Coral Lagoon', lat: 11.9761, lon: 92.9876, regionType: 'COASTAL_MARINE' },
      { name: 'Varkala Cliff & Papanasam Beach', state: 'Kerala', tag: 'Laterite Cliffs', lat: 8.7379, lon: 76.7163, regionType: 'COASTAL_MARINE' },
      { name: 'Puri Shri Jagannath & Golden Beach', state: 'Odisha', tag: 'Blue Flag Surf', lat: 19.8135, lon: 85.8312, regionType: 'COASTAL_MARINE' },
      { name: 'Dwarkadhish Temple & Shivrajpur', state: 'Gujarat', tag: 'Arabian Sea Shore', lat: 22.2442, lon: 68.9685, regionType: 'COASTAL_MARINE' },
      { name: 'Ramanathaswamy & Dhanushkodi', state: 'Tamil Nadu', tag: 'Pamban Ocean Sangam', lat: 9.2881, lon: 79.3174, regionType: 'COASTAL_MARINE' },
      { name: 'Somnath Jyotirlinga Promenade', state: 'Gujarat', tag: 'Prabhas Patan Shore', lat: 20.8880, lon: 70.4012, regionType: 'COASTAL_MARINE' },
    ],
  },
  {
    id: 'wildlife',
    name: 'Wildlife & Jungles',
    icon: Trees,
    color: 'amber',
    badgeText: '🐅 National Parks & Safaris',
    items: [
      { name: 'Kaziranga National Park', state: 'Assam', tag: '1-Horned Rhinos & Tigers', lat: 26.5775, lon: 93.1711, regionType: 'FOREST_WILDLIFE' },
      { name: 'Jim Corbett National Park & Reserve', state: 'Uttarakhand', tag: 'Ramganga Sal Forests', lat: 29.5300, lon: 78.7747, regionType: 'FOREST_WILDLIFE' },
      { name: 'Ranthambore National Park & Fort', state: 'Rajasthan', tag: 'Tiger Lake Terraces', lat: 26.0173, lon: 76.5026, regionType: 'FOREST_WILDLIFE' },
    ],
  },
  {
    id: 'heritage',
    name: 'Forts & Heritage',
    icon: Landmark,
    color: 'purple',
    badgeText: '🏰 Palaces & UNESCO Monuments',
    items: [
      { name: 'Jaipur, Amer Fort & Hawa Mahal', state: 'Rajasthan', tag: 'Pink City Citadels', lat: 26.9124, lon: 75.7873, regionType: 'URBAN_HERITAGE' },
      { name: 'Udaipur & Lake Pichola Palaces', state: 'Rajasthan', tag: 'Mewar Royal Palaces', lat: 24.5854, lon: 73.7125, regionType: 'URBAN_HERITAGE' },
      { name: 'Agra & Taj Mahal UNESCO Complex', state: 'Uttar Pradesh', tag: 'Mughal Wonder', lat: 27.1751, lon: 78.0421, regionType: 'URBAN_HERITAGE' },
      { name: 'Hampi UNESCO Heritage Ruins', state: 'Karnataka', tag: 'Stone Chariot & Temples', lat: 15.3350, lon: 76.4600, regionType: 'URBAN_HERITAGE' },
      { name: 'Jaisalmer & Sam Sand Dunes', state: 'Rajasthan', tag: 'Golden Sand Fort', lat: 26.9157, lon: 70.9083, regionType: 'DESERT_ARID' },
      { name: 'Grishneshwar & Ellora Caves', state: 'Maharashtra', tag: 'Rock-Cut Architecture', lat: 20.0244, lon: 75.1722, regionType: 'PLAINS_RIVERINE' },
    ],
  },
  {
    id: 'spiritual',
    name: 'Spiritual & Sacred',
    icon: Flame,
    color: 'orange',
    badgeText: '🛕 Historic Circuits & Shrines',
    items: [
      { name: 'Golden Temple Amritsar', state: 'Punjab', tag: 'Harmandir Sahib & Langar', lat: 31.6200, lon: 74.8765, regionType: 'URBAN_HERITAGE' },
      { name: 'Tirupati Balaji Sri Venkateswara', state: 'Andhra Pradesh', tag: 'Seven Hills Tirumala', lat: 13.6833, lon: 79.3472, regionType: 'HILL_MOUNTAIN' },
      { name: 'Kashi Vishwanath Temple Varanasi', state: 'Uttar Pradesh', tag: 'Ganga Dashashwamedh', lat: 25.3109, lon: 83.0107, regionType: 'URBAN_HERITAGE' },
      { name: 'Badrinath Dham', state: 'Uttarakhand', tag: 'Char Dham (North)', lat: 30.7447, lon: 79.4912, regionType: 'HILL_MOUNTAIN' },
      { name: 'Dwarkadhish Temple Dwarka', state: 'Gujarat', tag: 'Char Dham (West)', lat: 22.2442, lon: 68.9685, regionType: 'COASTAL_MARINE' },
      { name: 'Puri Shri Jagannath Dham', state: 'Odisha', tag: 'Char Dham (East)', lat: 19.8135, lon: 85.8312, regionType: 'COASTAL_MARINE' },
      { name: 'Ramanathaswamy Temple Rameswaram', state: 'Tamil Nadu', tag: 'Char Dham (South)', lat: 9.2881, lon: 79.3174, regionType: 'COASTAL_MARINE' },
      { name: 'Kedarnath Dham', state: 'Uttarakhand', tag: '12 Jyotirlingas & Chota Dham', lat: 30.7352, lon: 79.0669, regionType: 'HILL_MOUNTAIN' },
      { name: 'Somnath Jyotirlinga Temple', state: 'Gujarat', tag: 'First Jyotirlinga', lat: 20.8880, lon: 70.4012, regionType: 'COASTAL_MARINE' },
      { name: 'Shirdi Sai Baba Samadhi Mandir', state: 'Maharashtra', tag: 'Universal Peace Shrine', lat: 19.7667, lon: 74.4764, regionType: 'PLAINS_RIVERINE' },
      { name: 'Ajmer Sharif Dargah', state: 'Rajasthan', tag: 'Sufi Heritage Shrine', lat: 26.4561, lon: 74.6282, regionType: 'PLAINS_RIVERINE' },
      { name: 'Swaminarayan Akshardham Temple Delhi', state: 'Delhi', tag: 'Monumental Campus', lat: 28.6127, lon: 77.2773, regionType: 'URBAN_HERITAGE' },
    ],
  },
  {
    id: 'adventure',
    name: 'Adventure & Treks',
    icon: Compass,
    color: 'indigo',
    badgeText: '🧗 Outdoor & Paragliding',
    items: [
      { name: 'Bir Billing Paragliding Valley', state: 'Himachal Pradesh', tag: 'World-Class Aero Ridge', lat: 32.0436, lon: 76.7167, regionType: 'HILL_MOUNTAIN' },
      { name: 'Rishikesh & Shivpuri River Valley', state: 'Uttarakhand', tag: 'Ganga White Water Rapids', lat: 30.0869, lon: 78.2676, regionType: 'HILL_MOUNTAIN' },
      { name: 'Manali & Solang Valley', state: 'Himachal Pradesh', tag: 'Rohtang & Atal Tunnel', lat: 32.2432, lon: 77.1892, regionType: 'HILL_MOUNTAIN' },
      { name: 'Leh, Pangong Tso & Khardung La', state: 'Ladakh', tag: 'High Altitude Motorcycle Pass', lat: 34.1526, lon: 77.5771, regionType: 'HILL_MOUNTAIN' },
      { name: 'Jaisalmer & Sam Sand Dunes', state: 'Rajasthan', tag: 'Thar Desert Safari & Camp', lat: 26.9157, lon: 70.9083, regionType: 'DESERT_ARID' },
    ],
  },
];

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

  // Active Category State
  const [activeCategory, setActiveCategory] = useState<string>('top_picks');

  // Duration & Custom Dates State (Clean 2-mode system: Dates vs Exact Days)
  const [durationMode, setDurationMode] = useState<'dates' | 'custom_days'>('dates');
  const [startDate, setStartDate] = useState<string>(getTodayIso());
  const [endDate, setEndDate] = useState<string>(addDaysIso(getTodayIso(), 1));
  const [durationDays, setDurationDays] = useState(2);

  const [budgetTier, setBudgetTier] = useState<'BUDGET' | 'STANDARD' | 'COMFORT'>('STANDARD');
  const [budgetAmount, setBudgetAmount] = useState(12000);
  const [fitnessLevel, setFitnessLevel] = useState<'BEGINNER' | 'MODERATE' | 'EXPERIENCED'>('MODERATE');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isProgrammaticSelectionRef = useRef<boolean>(false);

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
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/v1/destinations/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        const results: DestinationSearchResult[] = data.results || [];
        setSearchResults(results);

        // If results found with coordinates and this was user typing (not a card click), zoom map
        if (!isProgrammaticSelectionRef.current && results.length > 0 && results[0].lat && results[0].lon) {
          onPreviewDestination?.({
            lat: results[0].lat,
            lon: results[0].lon,
            name: results[0].canonical_name,
          });
        }
        isProgrammaticSelectionRef.current = false;
      } catch (err) {
        console.error('Destination search failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

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
    isProgrammaticSelectionRef.current = true;
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
    isProgrammaticSelectionRef.current = true;
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

  const handleDurationPreset = (days: number) => {
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
    if (!searchQuery.trim()) return;
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

  const getRegionBadge = (type: RegionType | string) => {
    switch (type) {
      case 'HILL_MOUNTAIN':
        return { label: 'Himalayan / Alpine', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'COASTAL_MARINE':
        return { label: 'Coastal / Beach', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'PLAINS_RIVERINE':
        return { label: 'Plains / Riverine', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'FOREST_WILDLIFE':
        return { label: 'Wildlife / Jungle', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'DESERT_ARID':
        return { label: 'Desert / Dunes', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
      case 'URBAN_HERITAGE':
        return { label: 'Royal / Heritage', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      default:
        return { label: 'Pan-India', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
    }
  };

  // Pacing status based on duration
  const getPacingInsights = (days: number) => {
    if (days === 1) {
      return {
        badge: 'Express Day Trip',
        color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
        desc: 'Concentrated full-day schedule. Early start advised to maximize sight-seeing & buffer transit.',
      };
    }
    if (days === 2) {
      return {
        badge: 'Standard Weekend Route',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
        desc: 'Optimal 2-day baseline split with overnight stay and balanced sightseeing intervals.',
      };
    }
    if (days <= 4) {
      return {
        badge: 'Acclimatized Safe Pacing',
        color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
        desc: 'Gradual altitude & terrain adaptation. Safe elevation progression and lowest travel fatigue.',
      };
    }
    if (days <= 7) {
      return {
        badge: 'Extended Holiday Circuit',
        color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
        desc: 'Comprehensive multi-sector circuit with scheduled rest intervals, cultural halts & weather buffers.',
      };
    }
    return {
      badge: 'Grand National Expedition',
      color: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
      desc: 'Deep multi-stage regional traverse with dedicated acclimatization rest halts & complete logistics.',
    };
  };

  const pacing = getPacingInsights(durationDays);
  const activeCatData = PAN_INDIA_CATEGORIES.find((c) => c.id === activeCategory) || PAN_INDIA_CATEGORIES[0];

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl relative overflow-visible">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Pan-India Smart Route &amp; Safety Planner</span>
            </h2>
            <p className="text-xs text-slate-400">
              Plan safe itineraries across 28 States &amp; 8 UTs with live geocoding &amp; adaptive risk rating
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-[11px] px-3 py-1 rounded-full bg-slate-900 text-emerald-400 font-mono font-bold border border-emerald-500/30 shadow-inner">
          ALL-INDIA RESOLVER
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Dynamic Destination Search Autocomplete Bar */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-2">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Destination or Landmark (Any Place in India)</span>
            </span>
            <span className="text-[10px] text-emerald-400/90 font-mono font-medium">Auto-Geocoded GPS</span>
          </label>

          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="e.g. Goa Beaches, Manali, Jaipur Amer Fort, Leh Ladakh, Munnar, Corbett, Varanasi..."
              className="w-full bg-slate-950/90 border border-slate-700/90 group-hover:border-slate-600 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-emerald-400 transition-colors" />
            
            {searchQuery && !isSearching && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  onPreviewDestination?.(null);
                }}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {isSearching && (
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin absolute right-3.5 top-3.5" />
            )}
          </div>

          {/* Autocomplete Dropdown List */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl bg-slate-950/95 border border-slate-700 shadow-2xl p-2 space-y-1.5 backdrop-blur-2xl">
              {searchResults.map((item) => {
                const badge = getRegionBadge(item.region_type);
                const isPilgrimage = item.category === 'pilgrimage' || !!item.pilgrimage_metadata;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectDestination(item)}
                    className="w-full p-2.5 rounded-lg text-left hover:bg-slate-900 transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-slate-700 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5 flex-wrap">
                        <span>{item.canonical_name}</span>
                        {item.name_hi && (
                          <span className="text-[10px] text-slate-400 font-sans font-normal">({item.name_hi})</span>
                        )}
                        {isPilgrimage && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                            Sacred
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="text-slate-300 font-medium">{item.state_ut}</span>
                        {item.elevation_m && item.elevation_m > 500 && (
                          <span className="font-mono text-cyan-400/90">• {item.elevation_m}m</span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-semibold border shrink-0 ${badge.color}`}>
                      {badge.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Pan-India Multi-Genre Destination Explorer */}
          <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3 shadow-inner">
            {/* Category Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {PAN_INDIA_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Sub-Header Banner */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span>{activeCatData.badgeText}</span>
              </span>
              <span className="text-[10px] text-slate-500">Click to explore &amp; map route</span>
            </div>

            {/* Destination Grid / Card Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {activeCatData.items.map((place) => {
                const isSelected = searchQuery.toLowerCase().includes(place.name.toLowerCase().split(' ')[0]);
                const badge = getRegionBadge(place.regionType);

                return (
                  <button
                    key={place.name}
                    type="button"
                    onClick={() => handleQuickPick(place.name, place.lat, place.lon)}
                    onMouseEnter={() => {
                      if (place.lat && place.lon) {
                        onPreviewDestination?.({ lat: place.lat, lon: place.lon, name: place.name });
                      }
                    }}
                    className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg text-white'
                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {place.name.split(',')[0]}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate">
                        {place.state}
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px]">
                      <span className="text-slate-400 font-mono truncate">{place.tag}</span>
                      <span className={`px-1.5 py-0.5 rounded font-mono font-semibold border ${badge.color}`}>
                        {badge.label.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Trip Duration & Acclimatized Pacing */}
        <div className="bg-slate-950/70 border border-slate-800/90 p-4 rounded-2xl space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Trip Duration &amp; Acclimatized Schedule</span>
            </label>

            {/* Quick Duration Presets & Mode Tabs */}
            <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs gap-1">
              <button
                type="button"
                onClick={() => setDurationMode('dates')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  durationMode === 'dates'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Dates</span>
              </button>
              <button
                type="button"
                onClick={() => setDurationMode('custom_days')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  durationMode === 'custom_days'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Exact Days</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Duration Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[11px] text-slate-400 shrink-0 font-medium">Quick Pacing:</span>
            {[
              { days: 2, label: '2D Weekend' },
              { days: 4, label: '4D Express' },
              { days: 7, label: '7D Holiday' },
              { days: 10, label: '10D Grand Tour' },
            ].map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => handleDurationPreset(preset.days)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer shrink-0 border ${
                  durationDays === preset.days
                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker Mode */}
          {durationMode === 'dates' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
              {/* Departure Card */}
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-2 h-full">
                <div className="flex items-center justify-between h-6">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 whitespace-nowrap min-w-0">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Departure</span>
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-semibold shrink-0">
                    Day 1
                  </span>
                </div>
                <input
                  type="date"
                  value={startDate}
                  min={getTodayIso()}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full h-10 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all [color-scheme:dark]"
                />
                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between h-4">
                  <span>{formatReadableDate(startDate)}</span>
                </div>
              </div>

              {/* Return Card */}
              <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-2 h-full">
                <div className="flex items-center justify-between h-6">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 whitespace-nowrap min-w-0">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">Return</span>
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                    {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                  </span>
                </div>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full h-10 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all [color-scheme:dark]"
                />
                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between h-4">
                  <span>{formatReadableDate(endDate)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Exact Days Stepper & Slider Mode */}
          {durationMode === 'custom_days' && (
            <div className="space-y-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDurationPreset(durationDays - 1)}
                    disabled={durationDays <= 1}
                    aria-label="Decrease duration"
                    className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="px-4 py-1.5 rounded-lg bg-slate-950 border border-emerald-500/40 text-center min-w-[110px] shadow-sm">
                    <span className="text-base font-mono font-black text-emerald-300">{durationDays}</span>
                    <span className="text-xs text-slate-300 ml-1.5 font-bold">
                      {durationDays === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDurationPreset(durationDays + 1)}
                    disabled={durationDays >= 30}
                    aria-label="Increase duration"
                    className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <span>{formatReadableDate(startDate)}</span>
                  <span className="text-slate-600 mx-1">→</span>
                  <span className="text-emerald-400 font-bold">{formatReadableDate(endDate)}</span>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={durationDays}
                onChange={(e) => handleDurationPreset(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Day (Express)</span>
                <span className="text-slate-400">Target Range: 1 – 30 Days</span>
                <span>30 Days (Grand Expedition)</span>
              </div>
            </div>
          )}

          {/* Dynamic Acclimatization Pacing Status Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-inner">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border whitespace-nowrap shrink-0 flex items-center gap-1.5 ${pacing.color}`}>
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{pacing.badge}</span>
              </span>
              <div className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-slate-400">{formatReadableDate(startDate)}</span>
                <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-white font-bold">{formatReadableDate(endDate)}</span>
                <span className="text-emerald-400 font-bold ml-1">
                  ({durationDays} {durationDays === 1 ? 'Day' : 'Days'})
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{pacing.desc}</span>
            </div>
          </div>
        </div>

        {/* Budget Tier Selector & Custom Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Budget Allocation Tier</span>
            </label>
            <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              ₹{budgetAmount.toLocaleString('en-IN')} INR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {[
              { tier: 'BUDGET', label: 'Budget Explorer', desc: 'Govt Dorms / Homestays' },
              { tier: 'STANDARD', label: 'Balanced Comfort', desc: 'Tourism Cottages & Cabs' },
              { tier: 'COMFORT', label: 'Premium Leisure', desc: 'Eco-Resorts & Private SUVs' },
            ].map((t) => (
              <button
                type="button"
                key={t.tier}
                onClick={() => handleTierChange(t.tier as any)}
                className={`p-2.5 sm:p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  budgetTier === t.tier
                    ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">{t.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
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
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Min: ₹3,000</span>
            <span className="hidden sm:inline">Includes 15% Emergency Reserve</span>
            <span>Max: ₹40,000</span>
          </div>
        </div>

        {/* Fitness Level Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Cardiovascular Fitness &amp; Terrain Readiness</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {[
              { key: 'BEGINNER', label: 'Gentle / Family', tag: 'Frequent leisure halts' },
              { key: 'MODERATE', label: 'Moderate Active', tag: 'Standard travel pacing' },
              { key: 'EXPERIENCED', label: 'High-Endurance', tag: 'Trekker & fast pace' },
            ].map((f) => (
              <button
                type="button"
                key={f.key}
                onClick={() => setFitnessLevel(f.key as any)}
                className={`p-2.5 sm:p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  fitnessLevel === f.key
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
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
          disabled={isLoading || !searchQuery.trim()}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold tracking-wider uppercase shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transform active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Resolving Place &amp; Computing Pan-India Safety Matrix...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Safe Itinerary &amp; Risk Matrix</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
