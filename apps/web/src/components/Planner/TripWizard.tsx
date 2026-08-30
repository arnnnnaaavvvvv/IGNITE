import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Wallet,
  Activity,
  MapPin,
  Search,
  Clock,
  Plus,
  Minus,
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
import { t, getLocalizedDestinationName } from '../../services/i18n';

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
  language?: string;
  onPreviewDestination?: (dest: { lat: number; lon: number; name: string } | null) => void;
  onSwitchToMap?: () => void;
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

const formatReadableDate = (isoDate: string, lang: string = 'en') => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
};

// Curated Top Destinations by Category across India (Cleaned: No Emoji Clutter)
const PAN_INDIA_CATEGORIES = [
  {
    id: 'top_picks',
    name: 'Top Picks',
    name_hi: 'शीर्ष चयन',
    icon: Compass,
    badgeText: 'Marquee Indian Circuits',
    badgeText_hi: 'प्रमुख भारतीय गंतव्य',
    items: [
      { name: 'Goa Beaches & Promenade', state: 'Goa', tag: 'Coastal Paradise', tag_hi: 'तटीय स्वर्ग', lat: 15.5170, lon: 73.7620, regionType: 'COASTAL_MARINE' },
      { name: 'Manali & Solang Valley', state: 'Himachal Pradesh', tag: 'Alpine Alps', tag_hi: 'हिमालयी घाटी', lat: 32.2432, lon: 77.1892, regionType: 'HILL_MOUNTAIN' },
      { name: 'Jaipur, Amer Fort & Hawa Mahal', state: 'Rajasthan', tag: 'Royal Forts', tag_hi: 'शाही महल व किले', lat: 26.9124, lon: 75.7873, regionType: 'URBAN_HERITAGE' },
      { name: 'Leh, Pangong Tso & Khardung La', state: 'Ladakh', tag: 'High Altitude 3,500m', tag_hi: 'उच्च हिमालयी दर्रा 3500m', lat: 34.1526, lon: 77.5771, regionType: 'HILL_MOUNTAIN' },
      { name: 'Munnar & Anamudi Highlands', state: 'Kerala', tag: 'Tea Valleys', tag_hi: 'चाय के बागान', lat: 10.0889, lon: 77.0595, regionType: 'HILL_MOUNTAIN' },
      { name: 'Kaziranga National Park', state: 'Assam', tag: 'Rhino Sanctuary', tag_hi: 'गैंडा अभयारण्य', lat: 26.5775, lon: 93.1711, regionType: 'FOREST_WILDLIFE' },
      { name: 'Udaipur & Lake Pichola', state: 'Rajasthan', tag: 'Lake Palaces', tag_hi: 'झीलों का शहर', lat: 24.5854, lon: 73.7125, regionType: 'URBAN_HERITAGE' },
      { name: 'Hampi UNESCO Heritage Ruins', state: 'Karnataka', tag: 'Vijayanagara Empire', tag_hi: 'विजयनगर साम्राज्य', lat: 15.3350, lon: 76.4600, regionType: 'URBAN_HERITAGE' },
      { name: 'Havelock Island & Radhanagar', state: 'Andaman & Nicobar', tag: 'Turquoise Reefs', tag_hi: 'नीले प्रवाल द्वीप', lat: 11.9761, lon: 92.9876, regionType: 'COASTAL_MARINE' },
      { name: 'Kashi Vishwanath & Ghats', state: 'Uttar Pradesh', tag: 'Ganga Aarti', tag_hi: 'गंगा आरती व घाट', lat: 25.3109, lon: 83.0107, regionType: 'URBAN_HERITAGE' },
    ],
  },
  {
    id: 'hill_stations',
    name: 'Hill Stations & Alps',
    name_hi: 'पर्वतीय स्थल',
    icon: Mountain,
    badgeText: 'Himalayan Peaks & Western Ghats',
    badgeText_hi: 'हिमालयी चोटियाँ व घाटियाँ',
    items: [
      { name: 'Manali & Solang Valley', state: 'Himachal Pradesh', tag: 'Snow & Pines (2,050m)', tag_hi: 'बर्फबारी व देवदार (2050m)', lat: 32.2432, lon: 77.1892, regionType: 'HILL_MOUNTAIN' },
      { name: 'Leh, Pangong Tso & Khardung La', state: 'Ladakh', tag: 'Trans-Himalaya (3,500m)', tag_hi: 'ट्रांस-हिमालय (3500m)', lat: 34.1526, lon: 77.5771, regionType: 'HILL_MOUNTAIN' },
      { name: 'Munnar & Anamudi Highlands', state: 'Kerala', tag: 'Western Ghats (1,530m)', tag_hi: 'पश्चिमी घाट (1530m)', lat: 10.0889, lon: 77.0595, regionType: 'HILL_MOUNTAIN' },
      { name: 'Rishikesh & Shivpuri River Valley', state: 'Uttarakhand', tag: 'Ganga Foothills (370m)', tag_hi: 'गंगा तराई (370m)', lat: 30.0869, lon: 78.2676, regionType: 'HILL_MOUNTAIN' },
      { name: 'Bir Billing Paragliding Valley', state: 'Himachal Pradesh', tag: 'Aero Ridge (2,400m)', tag_hi: 'पैराग्लाइडिंग रिज (2400m)', lat: 32.0436, lon: 76.7167, regionType: 'HILL_MOUNTAIN' },
      { name: 'Kedarnath Dham & Valley', state: 'Uttarakhand', tag: 'Alpine Shrine (3,583m)', tag_hi: 'पवित्र धाम (3583m)', lat: 30.7352, lon: 79.0669, regionType: 'HILL_MOUNTAIN' },
      { name: 'Badrinath Dham & Mana', state: 'Uttarakhand', tag: 'Alaknanda (3,133m)', tag_hi: 'अलकनंदा घाटी (3133m)', lat: 30.7447, lon: 79.4912, regionType: 'HILL_MOUNTAIN' },
      { name: 'Yamunotri Dham', state: 'Uttarakhand', tag: 'Garhwal Alps (3,293m)', tag_hi: 'गढ़वाल हिमालय (3293m)', lat: 31.0140, lon: 78.4600, regionType: 'HILL_MOUNTAIN' },
      { name: 'Gangotri Dham', state: 'Uttarakhand', tag: 'Bhagirathi (3,100m)', tag_hi: 'भागीरथी उद्गम (3100m)', lat: 30.9947, lon: 78.9398, regionType: 'HILL_MOUNTAIN' },
    ],
  },
  {
    id: 'beaches',
    name: 'Beaches & Coastal',
    name_hi: 'समुद्र तट व द्वीप',
    icon: Palmtree,
    badgeText: 'Coastal Margins & Island Reefs',
    badgeText_hi: 'सुनहरी रेत व तटीय द्वीप',
    items: [
      { name: 'Goa Beaches & Promenade', state: 'Goa', tag: 'Calangute & Baga', tag_hi: 'कलंगूट व बागा बीच', lat: 15.5170, lon: 73.7620, regionType: 'COASTAL_MARINE' },
      { name: 'Havelock Island & Radhanagar', state: 'Andaman & Nicobar', tag: 'Coral Lagoon', tag_hi: 'कोरल लैगून', lat: 11.9761, lon: 92.9876, regionType: 'COASTAL_MARINE' },
      { name: 'Varkala Cliff & Papanasam Beach', state: 'Kerala', tag: 'Laterite Cliffs', tag_hi: 'रेड क्लिफ व पापनासम', lat: 8.7379, lon: 76.7163, regionType: 'COASTAL_MARINE' },
      { name: 'Puri Shri Jagannath & Golden Beach', state: 'Odisha', tag: 'Blue Flag Surf', tag_hi: 'ब्लू फ्लैग बीच', lat: 19.8135, lon: 85.8312, regionType: 'COASTAL_MARINE' },
      { name: 'Dwarkadhish Temple & Shivrajpur', state: 'Gujarat', tag: 'Arabian Sea Shore', tag_hi: 'अरब सागर तट', lat: 22.2442, lon: 68.9685, regionType: 'COASTAL_MARINE' },
      { name: 'Ramanathaswamy & Dhanushkodi', state: 'Tamil Nadu', tag: 'Pamban Ocean Sangam', tag_hi: 'पाम्बन संगम', lat: 9.2881, lon: 79.3174, regionType: 'COASTAL_MARINE' },
      { name: 'Somnath Jyotirlinga Promenade', state: 'Gujarat', tag: 'Prabhas Patan Shore', tag_hi: 'प्रभात पाटन तट', lat: 20.8880, lon: 70.4012, regionType: 'COASTAL_MARINE' },
    ],
  },
  {
    id: 'wildlife',
    name: 'Wildlife & Jungles',
    name_hi: 'वन्यजीव अभयारण्य',
    icon: Trees,
    badgeText: 'National Reserves & Safaris',
    badgeText_hi: 'राष्ट्रीय उद्यान व सफारी',
    items: [
      { name: 'Kaziranga National Park', state: 'Assam', tag: '1-Horned Rhinos & Tigers', tag_hi: 'एक सींग वाला गैंडा व बाघ', lat: 26.5775, lon: 93.1711, regionType: 'FOREST_WILDLIFE' },
      { name: 'Jim Corbett National Park & Reserve', state: 'Uttarakhand', tag: 'Ramganga Sal Forests', tag_hi: 'रामगंगा साल के जंगल', lat: 29.5300, lon: 78.7747, regionType: 'FOREST_WILDLIFE' },
      { name: 'Ranthambore National Park & Fort', state: 'Rajasthan', tag: 'Tiger Lake Terraces', tag_hi: 'टाइगर रिजर्व व किला', lat: 26.0173, lon: 76.5026, regionType: 'FOREST_WILDLIFE' },
    ],
  },
  {
    id: 'heritage',
    name: 'Forts & Heritage',
    name_hi: 'किले व ऐतिहासिक धरोहर',
    icon: Landmark,
    badgeText: 'UNESCO Monuments & Fortresses',
    badgeText_hi: 'महल व यूनेस्को स्मारक',
    items: [
      { name: 'Jaipur, Amer Fort & Hawa Mahal', state: 'Rajasthan', tag: 'Pink City Citadels', tag_hi: 'गुलाबी नगर के किले', lat: 26.9124, lon: 75.7873, regionType: 'URBAN_HERITAGE' },
      { name: 'Udaipur & Lake Pichola', state: 'Rajasthan', tag: 'Mewar Royal Palaces', tag_hi: 'मेवाड़ राजमहल', lat: 24.5854, lon: 73.7125, regionType: 'URBAN_HERITAGE' },
      { name: 'Agra Taj Mahal & Red Fort', state: 'Uttar Pradesh', tag: 'Mughal Wonder', tag_hi: 'मुगल स्थापत्य कला', lat: 27.1751, lon: 78.0421, regionType: 'URBAN_HERITAGE' },
      { name: 'Hampi UNESCO Heritage Ruins', state: 'Karnataka', tag: 'Stone Chariot & Temples', tag_hi: 'प्रस्तर रथ व मंदिर', lat: 15.3350, lon: 76.4600, regionType: 'URBAN_HERITAGE' },
      { name: 'Jaisalmer & Sam Sand Dunes', state: 'Rajasthan', tag: 'Golden Sand Fort', tag_hi: 'सोनार किला व बालू के टीले', lat: 26.9157, lon: 70.9083, regionType: 'DESERT_ARID' },
    ],
  },
  {
    id: 'spiritual',
    name: 'Spiritual & Sacred',
    name_hi: 'पवित्र तीर्थस्थल',
    icon: Flame,
    badgeText: 'Pilgrimage Corridors & Shrines',
    badgeText_hi: 'ऐतिहासिक धाम व ज्योतिर्लिंग',
    items: [
      { name: 'Amritsar Golden Temple & Wagah', state: 'Punjab', tag: 'Harmandir Sahib', tag_hi: 'श्री हरमंदिर साहिब', lat: 31.6200, lon: 74.8765, regionType: 'URBAN_HERITAGE' },
      { name: 'Tirupati Balaji & Tirumala', state: 'Andhra Pradesh', tag: 'Seven Hills Tirumala', tag_hi: 'सप्तगिरि तिरुमाला', lat: 13.6833, lon: 79.3472, regionType: 'HILL_MOUNTAIN' },
      { name: 'Kashi Vishwanath & Ghats', state: 'Uttar Pradesh', tag: 'Ganga Dashashwamedh', tag_hi: 'दशाश्वमेध घाट व विश्वनाथ', lat: 25.3109, lon: 83.0107, regionType: 'URBAN_HERITAGE' },
      { name: 'Badrinath Dham & Mana', state: 'Uttarakhand', tag: 'Char Dham (North)', tag_hi: 'चार धाम (उत्तर)', lat: 30.7447, lon: 79.4912, regionType: 'HILL_MOUNTAIN' },
      { name: 'Dwarkadhish Temple & Shivrajpur', state: 'Gujarat', tag: 'Char Dham (West)', tag_hi: 'चार धाम (पश्चिम)', lat: 22.2442, lon: 68.9685, regionType: 'COASTAL_MARINE' },
      { name: 'Puri Shri Jagannath & Golden Beach', state: 'Odisha', tag: 'Char Dham (East)', tag_hi: 'चार धाम (पूर्व)', lat: 19.8135, lon: 85.8312, regionType: 'COASTAL_MARINE' },
      { name: 'Ramanathaswamy & Dhanushkodi', state: 'Tamil Nadu', tag: 'Char Dham (South)', tag_hi: 'चार धाम (दक्षिण)', lat: 9.2881, lon: 79.3174, regionType: 'COASTAL_MARINE' },
      { name: 'Kedarnath Dham & Valley', state: 'Uttarakhand', tag: '12 Jyotirlingas', tag_hi: '12 ज्योतिर्लिंग व धाम', lat: 30.7352, lon: 79.0669, regionType: 'HILL_MOUNTAIN' },
      { name: 'Somnath Jyotirlinga Promenade', state: 'Gujarat', tag: 'First Jyotirlinga', tag_hi: 'प्रथम ज्योतिर्लिंग', lat: 20.8880, lon: 70.4012, regionType: 'COASTAL_MARINE' },
      { name: 'Shirdi Sai Baba Sansthan', state: 'Maharashtra', tag: 'Universal Peace Shrine', tag_hi: 'शांति धाम', lat: 19.7667, lon: 74.4764, regionType: 'PLAINS_RIVERINE' },
      { name: 'Vaishno Devi Shrine & Katra', state: 'Jammu & Kashmir', tag: 'Trikuta Hills', tag_hi: 'त्रिकूटा पर्वत धाम', lat: 33.0308, lon: 74.9490, regionType: 'HILL_MOUNTAIN' },
      { name: 'Mahakaleshwar Jyotirlinga Ujjain', state: 'Madhya Pradesh', tag: 'Mahakal Corridor', tag_hi: 'महाकाल लोक कॉरिडोर', lat: 23.1827, lon: 75.7682, regionType: 'PLAINS_RIVERINE' },
    ],
  },
  {
    id: 'adventure',
    name: 'Adventure & Treks',
    name_hi: 'रोमांच व ट्रेकिंग',
    icon: Compass,
    badgeText: 'Outdoor Routes & Paragliding',
    badgeText_hi: 'साहसिक खेल व ट्रेक',
    items: [
      { name: 'Bir Billing Paragliding Valley', state: 'Himachal Pradesh', tag: 'World-Class Aero Ridge', tag_hi: 'विश्व प्रसिद्ध पैराग्लाइडिंग', lat: 32.0436, lon: 76.7167, regionType: 'HILL_MOUNTAIN' },
      { name: 'Rishikesh & Shivpuri River Valley', state: 'Uttarakhand', tag: 'Ganga White Water Rapids', tag_hi: 'गंगा रिवर राफ्टिंग', lat: 30.0869, lon: 78.2676, regionType: 'HILL_MOUNTAIN' },
      { name: 'Manali & Solang Valley', state: 'Himachal Pradesh', tag: 'Rohtang & Atal Tunnel', tag_hi: 'रोहतांग व अटल टनल', lat: 32.2432, lon: 77.1892, regionType: 'HILL_MOUNTAIN' },
      { name: 'Leh, Pangong Tso & Khardung La', state: 'Ladakh', tag: 'Motorcycle Pass', tag_hi: 'मोटरसाइकिल एक्सपीडिशन', lat: 34.1526, lon: 77.5771, regionType: 'HILL_MOUNTAIN' },
      { name: 'Jaisalmer & Sam Sand Dunes', state: 'Rajasthan', tag: 'Desert Safari & Camp', tag_hi: 'थार मरुस्थल कैंपिंग', lat: 26.9157, lon: 70.9083, regionType: 'DESERT_ARID' },
    ],
  },
];

export const TripWizard: React.FC<TripWizardProps> = ({
  onGenerate,
  isLoading,
  selectedDestinationName = '',
  language = 'en',
  onPreviewDestination,
  onSwitchToMap,
}) => {
  const isHi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState(selectedDestinationName || '');
  const [selectedPlaceName, setSelectedPlaceName] = useState<string>(selectedDestinationName || '');
  const [searchResults, setSearchResults] = useState<DestinationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Active Category State
  const [activeCategory, setActiveCategory] = useState<string>('top_picks');

  // Duration & Custom Dates State
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
    setSearchQuery(selectedDestinationName || '');
    setSelectedPlaceName(selectedDestinationName || '');
  }, [selectedDestinationName]);

  // Live Place Autocomplete Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/v1/destinations/search?q=${encodeURIComponent(searchQuery)}&language=${language}`);
        const data = await res.json();
        const results: DestinationSearchResult[] = data.results || [];
        setSearchResults(results);

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
  }, [searchQuery, language]);

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
    setSelectedPlaceName(dest.canonical_name);
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
    setSelectedPlaceName(name);
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
        return { label: isHi ? 'पर्वतीय' : 'Alpine', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'COASTAL_MARINE':
        return { label: isHi ? 'तटीय' : 'Coastal', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
      case 'PLAINS_RIVERINE':
        return { label: isHi ? 'मैदानी' : 'Plains', color: 'text-slate-300 bg-slate-500/10 border-slate-500/20' };
      case 'FOREST_WILDLIFE':
        return { label: isHi ? 'वन्यजीव' : 'Wildlife', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'DESERT_ARID':
        return { label: isHi ? 'रेगिस्तान' : 'Desert', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
      case 'URBAN_HERITAGE':
        return { label: isHi ? 'धरोहर' : 'Heritage', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      default:
        return { label: isHi ? 'अखिल भारतीय' : 'National', color: 'text-slate-300 bg-slate-500/10 border-slate-500/20' };
    }
  };

  const getPacingInsights = (days: number) => {
    if (days === 1) {
      return {
        badge: isHi ? 'एक दिवसीय' : 'Day Trip',
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        desc: isHi ? 'पूरे दिन की यात्रा। समय का सही उपयोग करने के लिए जल्दी निकलें।' : 'Full-day schedule. Start early to make the most of your day.',
      };
    }
    if (days === 2) {
      return {
        badge: isHi ? 'सप्ताहांत' : 'Weekend Route',
        color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        desc: isHi ? 'रात के ठहराव के साथ सबसे अच्छी 2 दिवसीय यात्रा योजना।' : 'Best 2-day plan with an overnight stay.',
      };
    }
    if (days <= 4) {
      return {
        badge: isHi ? 'सुरक्षित गति' : 'Easy Pacing',
        color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
        desc: isHi ? 'धीमी व आसान गति, ताकि थकान न हो।' : 'Easy, relaxed pace with plenty of time to rest.',
      };
    }
    if (days <= 7) {
      return {
        badge: isHi ? 'अवकाश सर्किट' : 'Holiday Trip',
        color: 'text-slate-300 border-slate-500/30 bg-slate-500/10',
        desc: isHi ? 'आरामदायक छुट्टी की योजना जिसमें सभी प्रमुख स्थल शामिल हैं।' : 'Relaxed holiday plan covering all main spots.',
      };
    }
    return {
      badge: isHi ? 'लंबी यात्रा' : 'Extended Trip',
      color: 'text-slate-300 border-slate-500/30 bg-slate-500/10',
      desc: isHi ? 'लंबी यात्रा जिसमें आराम के लिए पर्याप्त समय शामिल है।' : 'Extended trip with built-in rest days.',
    };
  };

  const pacing = getPacingInsights(durationDays);
  const activeCatData = PAN_INDIA_CATEGORIES.find((c) => c.id === activeCategory) || PAN_INDIA_CATEGORIES[0];

  return (
    <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08] relative h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">
            {t('wizard_title', language)}
          </h2>
          <p className="text-xs text-slate-400">
            {t('wizard_subtitle', language)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dynamic Destination Search Autocomplete Bar */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t('search_label', language)}</span>
            </span>
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
              placeholder={t('search_placeholder', language)}
              className="w-full bg-[#12141d] border border-white/[0.08] rounded-lg pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 transition-all font-medium"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 group-focus-within:text-emerald-400 transition-colors" />
            
            {searchQuery && !isSearching && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  onPreviewDestination?.(null);
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isSearching && (
              <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin absolute right-3 top-3" />
            )}
          </div>

          {/* Autocomplete Dropdown List */}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-lg bg-[#0e1017] border border-white/[0.12] shadow-xl p-1.5 space-y-1 backdrop-blur-xl">
              {searchResults.map((item) => {
                const badge = getRegionBadge(item.region_type);
                const isPilgrimage = item.category === 'pilgrimage' || !!item.pilgrimage_metadata;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectDestination(item)}
                    className="w-full p-2 rounded-md text-left hover:bg-white/[0.06] transition-all flex items-center justify-between gap-2 cursor-pointer group"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5 flex-wrap">
                        <span>{isHi && item.name_hi ? item.name_hi : item.canonical_name}</span>
                        {!isHi && item.name_hi && (
                          <span className="text-[10px] text-slate-400 font-normal">({item.name_hi})</span>
                        )}
                        {isPilgrimage && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                            {isHi ? 'तीर्थ' : 'Sacred'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="text-slate-300">{item.state_ut}</span>
                        {item.elevation_m && item.elevation_m > 500 && (
                          <span className="font-mono text-slate-400">• {item.elevation_m}m</span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border shrink-0 ${badge.color}`}>
                      {badge.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Destination Explorer & Curated Cards */}
          <div className="mt-3 p-3 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-2.5">
            {/* Category Selector Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
              {PAN_INDIA_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                const catTitle = isHi && cat.name_hi ? cat.name_hi : cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`btn-tactile flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap cursor-pointer shrink-0 border transition-all ${
                      isActive
                        ? 'bg-white/[0.12] text-white border-white/[0.16]'
                        : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{catTitle}</span>
                  </button>
                );
              })}
            </div>

            {selectedPlaceName && (
              <div className="flex items-center justify-between p-2 rounded-md bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">
                    {isHi ? 'गंतव्य:' : 'Selected:'} <strong className="text-white font-semibold">{getLocalizedDestinationName(selectedPlaceName, language)}</strong>
                  </span>
                </div>
                {onSwitchToMap && (
                  <button
                    type="button"
                    onClick={onSwitchToMap}
                    className="lg:hidden ml-2 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] shrink-0 flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Compass className="w-3 h-3" />
                    <span>{isHi ? 'नक्शा देखें' : 'View on Map'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Destination Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {activeCatData.items.map((place) => {
                const current = (selectedPlaceName || searchQuery).toLowerCase().trim();
                const target = place.name.toLowerCase().trim();
                const targetBase = target.replace(/[,&]/g, ' ').split(/\s+/)[0];
                const currentBase = current.replace(/[,&]/g, ' ').split(/\s+/)[0];

                const isSelected = Boolean(
                  current && (
                    current === target ||
                    target.includes(current) ||
                    current.includes(target) ||
                    (targetBase.length > 2 && current.includes(targetBase)) ||
                    (currentBase.length > 2 && target.includes(currentBase))
                  )
                );
                const badge = getRegionBadge(place.regionType);
                const displayName = isHi ? getLocalizedDestinationName(place.name, language) : place.name;

                return (
                  <button
                    key={place.name}
                    type="button"
                    onClick={() => handleQuickPick(place.name, place.lat, place.lon)}
                    className={`btn-tactile p-2 rounded-lg text-left border cursor-pointer flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/50 text-white'
                        : 'bg-[#0e1017] hover:bg-[#161924] border-white/[0.06] text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-emerald-300 font-bold' : 'text-slate-200'}`}>
                        {displayName.split(',')[0]}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {place.state}
                      </div>
                    </div>
                    
                    <div className="mt-1.5 pt-1 border-t border-white/[0.04] flex items-center justify-end text-[9px]">
                      <span className={`px-1.5 py-0.5 rounded font-mono font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trip Duration & Dates */}
        <div className="bg-[#12141d] border border-white/[0.08] p-3.5 rounded-xl space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('travel_dates_duration', language)}</span>
            </label>

            {/* Duration Mode Switcher */}
            <div className="flex items-center p-0.5 bg-[#0e1017] rounded-md border border-white/[0.06] text-xs">
              <button
                type="button"
                onClick={() => setDurationMode('dates')}
                className={`btn-tactile px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                  durationMode === 'dates'
                    ? 'bg-white/[0.12] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{isHi ? 'तिथियां' : 'Dates'}</span>
              </button>
              <button
                type="button"
                onClick={() => setDurationMode('custom_days')}
                className={`btn-tactile px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                  durationMode === 'custom_days'
                    ? 'bg-white/[0.12] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{isHi ? 'सटीक दिन' : 'Exact Days'}</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Duration Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { days: 2, label: isHi ? '2 दिन' : '2D Weekend' },
              { days: 4, label: isHi ? '4 दिन' : '4D Express' },
              { days: 7, label: isHi ? '7 दिन' : '7D Holiday' },
              { days: 10, label: isHi ? '10 दिन' : '10D Tour' },
            ].map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => handleDurationPreset(preset.days)}
                className={`btn-tactile px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer shrink-0 border ${
                  durationDays === preset.days
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                    : 'bg-[#0e1017] text-slate-400 border-white/[0.06] hover:text-slate-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Range Picker Mode */}
          {durationMode === 'dates' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-[#0e1017] p-2.5 rounded-lg border border-white/[0.06] space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{t('start_date', language)}</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400">{isHi ? 'दिन 1' : 'Day 1'}</span>
                </div>
                <input
                  type="date"
                  value={startDate}
                  min={getTodayIso()}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full bg-[#12141d] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div className="bg-[#0e1017] p-2.5 rounded-lg border border-white/[0.06] space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{t('end_date', language)}</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                    {durationDays} {durationDays === 1 ? t('day', language) : t('days', language)}
                  </span>
                </div>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full bg-[#12141d] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/60"
                />
              </div>
            </div>
          )}

          {/* Exact Days Stepper Mode */}
          {durationMode === 'custom_days' && (
            <div className="space-y-2.5 bg-[#0e1017] p-3 rounded-lg border border-white/[0.06]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDurationPreset(durationDays - 1)}
                    disabled={durationDays <= 1}
                    aria-label="Decrease duration"
                    className="btn-tactile w-7 h-7 rounded-md bg-[#12141d] border border-white/[0.08] text-slate-300 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="px-3 py-1 rounded-md bg-[#12141d] border border-white/[0.08] text-center min-w-[90px]">
                    <span className="text-sm font-mono font-bold text-white">{durationDays}</span>
                    <span className="text-xs text-slate-300 ml-1">
                      {durationDays === 1 ? t('day', language) : t('days', language)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDurationPreset(durationDays + 1)}
                    disabled={durationDays >= 30}
                    aria-label="Increase duration"
                    className="btn-tactile w-7 h-7 rounded-md bg-[#12141d] border border-white/[0.08] text-slate-300 flex items-center justify-center disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <span>{formatReadableDate(startDate, language)}</span>
                  <span className="text-slate-600 mx-1">→</span>
                  <span className="text-white font-medium">{formatReadableDate(endDate, language)}</span>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={durationDays}
                onChange={(e) => handleDurationPreset(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          )}

          {/* Acclimatization Status Card */}
          <div className="p-2.5 rounded-lg bg-[#0e1017] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className={`text-[11px] px-2 py-0.5 rounded font-medium border flex items-center gap-1 ${pacing.color}`}>
                <ShieldCheck className="w-3 h-3 shrink-0" />
                <span>{pacing.badge}</span>
              </span>
              <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
                <span>{formatReadableDate(startDate, language)}</span>
                <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                <span className="text-white font-semibold">{formatReadableDate(endDate, language)}</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 leading-normal flex items-start gap-1.5 pt-1 border-t border-white/[0.04]">
              <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
              <span>{pacing.desc}</span>
            </div>
          </div>
        </div>

        {/* Budget Tier Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('budget_tier_heading', language)}</span>
            </label>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ₹{budgetAmount.toLocaleString('en-IN')} INR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { tier: 'BUDGET', label: isHi ? 'बजट अन्वेषक' : 'Budget Explorer', desc: isHi ? 'डॉर्मिटरी / होमस्टे' : 'Dorms & Homestays' },
              { tier: 'STANDARD', label: isHi ? 'मानक आराम' : 'Standard Comfort', desc: isHi ? 'कॉटेज व कैब' : 'Cottages & Cabs' },
              { tier: 'COMFORT', label: isHi ? 'प्रीमियम लेज़र' : 'Premium Leisure', desc: isHi ? 'रिसॉर्ट्स व एसयूवी' : 'Resorts & SUVs' },
            ].map((tItem) => (
              <button
                type="button"
                key={tItem.tier}
                onClick={() => handleTierChange(tItem.tier as any)}
                className={`btn-tactile p-2.5 rounded-lg text-left border cursor-pointer ${
                  budgetTier === tItem.tier
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-[#12141d] border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                }`}
              >
                <div className="text-xs font-semibold text-slate-200">{tItem.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{tItem.desc}</div>
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
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Fitness Level Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('fitness_heading', language)}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { key: 'BEGINNER', label: isHi ? 'सरल / पारिवारिक' : 'Gentle / Family', tag: isHi ? 'आराम से चलना' : 'Leisure pace' },
              { key: 'MODERATE', label: isHi ? 'मध्यम' : 'Moderate', tag: isHi ? 'सामान्य गति' : 'Steady pace' },
              { key: 'EXPERIENCED', label: isHi ? 'अनुभवी' : 'Experienced', tag: isHi ? 'तेज गति' : 'Brisk pace' },
            ].map((f) => (
              <button
                type="button"
                key={f.key}
                onClick={() => setFitnessLevel(f.key as any)}
                className={`btn-tactile p-2.5 rounded-lg text-left border cursor-pointer ${
                  fitnessLevel === f.key
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-[#12141d] border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                }`}
              >
                <div className="text-xs font-semibold text-slate-200">{f.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{f.tag}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className="btn-tactile w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t('btn_generating', language)}</span>
            </>
          ) : (
            <>
              <span>{t('btn_generate', language)}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TripWizard;
