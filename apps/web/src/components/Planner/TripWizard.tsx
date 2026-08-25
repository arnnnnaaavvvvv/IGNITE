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

// Curated Top Destinations by Category across India
const PAN_INDIA_CATEGORIES = [
  {
    id: 'top_picks',
    name: 'Top Picks',
    name_hi: 'शीर्ष चयन',
    icon: Sparkles,
    badgeText: '🌟 Marquee India',
    badgeText_hi: '🌟 प्रमुख भारतीय गंतव्य',
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
    badgeText: '🏔️ Himalayan Peaks & Ghats',
    badgeText_hi: '🏔️ हिमालयी चोटियाँ व घाटियाँ',
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
    badgeText: '🏖️ Sun, Sand & Azure Waters',
    badgeText_hi: '🏖️ सुनहरी रेत व नीला समुद्र',
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
    badgeText: '🐅 National Parks & Safaris',
    badgeText_hi: '🐅 राष्ट्रीय उद्यान व सफारी',
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
    badgeText: '🏰 Palaces & UNESCO Monuments',
    badgeText_hi: '🏰 महल व यूनेस्को स्मारक',
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
    badgeText: '🛕 Historic Circuits & Shrines',
    badgeText_hi: '🛕 ऐतिहासिक धाम व ज्योतिर्लिंग',
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
    badgeText: '🧗 Outdoor & Paragliding',
    badgeText_hi: '🧗 साहसिक खेल व ट्रेक',
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
}) => {
  const isHi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState(selectedDestinationName || '');
  const [selectedPlaceName, setSelectedPlaceName] = useState<string>(selectedDestinationName || '');
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
    if (selectedDestinationName) {
      setSearchQuery(selectedDestinationName);
      setSelectedPlaceName(selectedDestinationName);
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
        return { label: isHi ? 'पर्वतीय / हिमालय' : 'Himalayan / Alpine', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'COASTAL_MARINE':
        return { label: isHi ? 'तटीय / समुद्र' : 'Coastal / Beach', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'PLAINS_RIVERINE':
        return { label: isHi ? 'मैदानी / नदी' : 'Plains / Riverine', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'FOREST_WILDLIFE':
        return { label: isHi ? 'वन्यजीव / जंगल' : 'Wildlife / Jungle', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'DESERT_ARID':
        return { label: isHi ? 'रेगिस्तान / मरुस्थल' : 'Desert / Dunes', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
      case 'URBAN_HERITAGE':
        return { label: isHi ? 'शाही / धरोहर' : 'Royal / Heritage', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      default:
        return { label: isHi ? 'अखिल भारतीय' : 'Pan-India', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
    }
  };

  // Pacing status based on duration
  const getPacingInsights = (days: number) => {
    if (days === 1) {
      return {
        badge: isHi ? 'एक्सप्रेस एक दिवसीय' : 'Express Day Trip',
        color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
        desc: isHi ? 'सघन एक दिवसीय कार्यक्रम। अधिकतम दर्शनीय स्थलों को देखने के लिए जल्दी शुरुआत करें।' : 'Concentrated full-day schedule. Early start advised to maximize sight-seeing & buffer transit.',
      };
    }
    if (days === 2) {
      return {
        badge: isHi ? 'मानक सप्ताहांत मार्ग' : 'Standard Weekend Route',
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
        desc: isHi ? 'रात के ठहराव और संतुलित अंतराल के साथ आदर्श 2 दिवसीय यात्रा योजना।' : 'Optimal 2-day baseline split with overnight stay and balanced sightseeing intervals.',
      };
    }
    if (days <= 4) {
      return {
        badge: isHi ? 'अनुकूलित सुरक्षित गति' : 'Acclimatized Safe Pacing',
        color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
        desc: isHi ? 'ऊंचाई और भूभाग के लिए सुरक्षित अनुकूलन। न्यूनतम यात्रा थकान।' : 'Gradual altitude & terrain adaptation. Safe elevation progression and lowest travel fatigue.',
      };
    }
    if (days <= 7) {
      return {
        badge: isHi ? 'विस्तारित अवकाश सर्किट' : 'Extended Holiday Circuit',
        color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
        desc: isHi ? 'नियमित विश्राम, सांस्कृतिक पड़ावों और मौसम बफर के साथ व्यापक यात्रा कार्यक्रम।' : 'Comprehensive multi-sector circuit with scheduled rest intervals, cultural halts & weather buffers.',
      };
    }
    return {
      badge: isHi ? 'भव्य राष्ट्रीय अभियान' : 'Grand National Expedition',
      color: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
      desc: isHi ? 'गहन बहु-चरणीय क्षेत्रीय यात्रा जिसमें समर्पित विश्राम पड़ाव और संपूर्ण रसद शामिल हैं।' : 'Deep multi-stage regional traverse with dedicated acclimatization rest halts & complete logistics.',
    };
  };

  const pacing = getPacingInsights(durationDays);
  const activeCatData = PAN_INDIA_CATEGORIES.find((c) => c.id === activeCategory) || PAN_INDIA_CATEGORIES[0];

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/[0.08] shadow-2xl relative overflow-visible">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600/30 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.25)] shrink-0">
            <Sparkles className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{t('wizard_title', language)}</span>
            </h2>
            <p className="text-xs text-slate-400 line-clamp-1">
              {t('wizard_subtitle', language)}
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-[11px] px-3 py-1 rounded-full bg-white/[0.04] text-emerald-400 font-mono font-bold border border-emerald-500/30 shadow-inner shrink-0">
          {isHi ? 'अखिल भारतीय' : 'ALL-INDIA RESOLVER'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Dynamic Destination Search Autocomplete Bar */}
        <div className="relative" ref={dropdownRef}>
          <label className="text-xs font-bold text-slate-200 flex items-center justify-between mb-2">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t('search_label', language)}</span>
            </span>
            <span className="text-[10px] text-emerald-400/90 font-mono font-medium">{isHi ? 'स्वतः जीपीएस' : 'Auto-Geocoded GPS'}</span>
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
              className="w-full bg-[#0c0e16] border border-white/[0.12] group-hover:border-white/[0.22] rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium shadow-inner"
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
            <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-xl bg-[#0c0e16]/98 border border-white/[0.16] shadow-2xl p-2 space-y-1.5 backdrop-blur-2xl">
              {searchResults.map((item) => {
                const badge = getRegionBadge(item.region_type);
                const isPilgrimage = item.category === 'pilgrimage' || !!item.pilgrimage_metadata;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectDestination(item)}
                    className="w-full p-2.5 rounded-lg text-left hover:bg-white/[0.06] transition-all flex items-center justify-between gap-3 cursor-pointer border border-transparent hover:border-white/[0.1] group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5 flex-wrap">
                        <span>{isHi && item.name_hi ? item.name_hi : item.canonical_name}</span>
                        {!isHi && item.name_hi && (
                          <span className="text-[10px] text-slate-400 font-sans font-normal">({item.name_hi})</span>
                        )}
                        {isPilgrimage && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                            {isHi ? 'पवित्र' : 'Sacred'}
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
          <div className="mt-3.5 p-3.5 rounded-2xl bg-[#0c0e16]/90 border border-white/[0.08] space-y-3 shadow-inner">
            {/* Category Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {PAN_INDIA_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                const catTitle = isHi && cat.name_hi ? cat.name_hi : cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 border transition-all ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                        : 'bg-[#121522] text-slate-400 border-white/[0.06] hover:text-slate-200 hover:border-white/[0.12]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{catTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Category Sub-Header Banner & Active Selection Pill */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <span>{isHi && activeCatData.badgeText_hi ? activeCatData.badgeText_hi : activeCatData.badgeText}</span>
              </span>
              <span className="text-[10px] text-slate-500">{isHi ? 'कार्ड पर क्लिक करके चुनें' : 'Click any card to select & map route'}</span>
            </div>

            {selectedPlaceName && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="truncate">
                    {isHi ? 'चयनित गंतव्य:' : 'Active Target:'} <strong className="text-white font-bold">{getLocalizedDestinationName(selectedPlaceName, language)}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md shrink-0">
                  {isHi ? 'तैयार' : 'READY TO PLAN'}
                </span>
              </div>
            )}

            {/* Destination Grid / Card Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                const displayTag = isHi && place.tag_hi ? place.tag_hi : place.tag;

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
                    className={`btn-tactile p-2.5 sm:p-3 rounded-2xl text-left border cursor-pointer group flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl shadow-emerald-500/25 text-white'
                        : 'bg-[#121522]/90 hover:bg-[#181c2d] border-white/[0.06] hover:border-white/[0.14] text-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/20 rounded-bl-full pointer-events-none" />
                    )}
                    <div className="space-y-0.5 relative z-10">
                      <div className="flex items-start justify-between gap-1">
                        <div className={`text-xs font-bold transition-colors line-clamp-1 ${isSelected ? 'text-emerald-300 font-black' : 'text-slate-200 group-hover:text-emerald-300'}`}>
                          {displayName.split(',')[0]}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium truncate">
                        {place.state}
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[9px] relative z-10">
                      <span className="text-slate-400 font-mono truncate">{displayTag}</span>
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
        <div className="bg-[#0c0e16]/90 border border-white/[0.08] p-4 rounded-2xl space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{t('travel_dates_duration', language)}</span>
            </label>

            {/* Quick Duration Presets & Mode Tabs */}
            <div className="flex items-center p-1 bg-[#121522] rounded-xl border border-white/[0.08] text-xs gap-1">
              <button
                type="button"
                onClick={() => setDurationMode('dates')}
                className={`btn-tactile flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  durationMode === 'dates'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{isHi ? 'तिथियां' : 'Dates'}</span>
              </button>
              <button
                type="button"
                onClick={() => setDurationMode('custom_days')}
                className={`btn-tactile flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  durationMode === 'custom_days'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isHi ? 'सटीक दिन' : 'Exact Days'}</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Duration Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[11px] text-slate-400 shrink-0 font-medium">{isHi ? 'अवधि चयन:' : 'Quick Pacing:'}</span>
            {[
              { days: 2, label: isHi ? '2 दिन सप्ताहांत' : '2D Weekend' },
              { days: 4, label: isHi ? '4 दिन एक्सप्रेस' : '4D Express' },
              { days: 7, label: isHi ? '7 दिन अवकाश' : '7D Holiday' },
              { days: 10, label: isHi ? '10 दिन भव्य टूर' : '10D Grand Tour' },
            ].map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => handleDurationPreset(preset.days)}
                className={`btn-tactile px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold cursor-pointer shrink-0 border ${
                  durationDays === preset.days
                    ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'bg-[#121522] text-slate-400 border-white/[0.06] hover:border-white/[0.12] hover:text-slate-200'
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
              <div className="bg-[#121522] p-3.5 rounded-xl border border-white/[0.08] hover:border-white/[0.14] transition-colors flex flex-col justify-between space-y-2 h-full">
                <div className="flex items-center justify-between h-6">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 whitespace-nowrap min-w-0">
                    <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{t('start_date', language)}</span>
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08] font-semibold shrink-0">
                    {isHi ? 'दिन 1' : 'Day 1'}
                  </span>
                </div>
                <input
                  type="date"
                  value={startDate}
                  min={getTodayIso()}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full h-10 bg-[#0c0e16] border border-white/[0.12] rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all [color-scheme:dark]"
                />
                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between h-4">
                  <span>{formatReadableDate(startDate, language)}</span>
                </div>
              </div>

              {/* Return Card */}
              <div className="bg-[#121522] p-3.5 rounded-xl border border-white/[0.08] hover:border-white/[0.14] transition-colors flex flex-col justify-between space-y-2 h-full">
                <div className="flex items-center justify-between h-6">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 whitespace-nowrap min-w-0">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{t('end_date', language)}</span>
                  </label>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                    {durationDays} {durationDays === 1 ? t('day', language) : t('days', language)}
                  </span>
                </div>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full h-10 bg-[#0c0e16] border border-white/[0.12] rounded-xl px-3 py-2 text-xs font-mono font-semibold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all [color-scheme:dark]"
                />
                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between h-4">
                  <span>{formatReadableDate(endDate, language)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Exact Days Stepper & Slider Mode */}
          {durationMode === 'custom_days' && (
            <div className="space-y-3 bg-[#121522] p-3.5 rounded-xl border border-white/[0.08]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDurationPreset(durationDays - 1)}
                    disabled={durationDays <= 1}
                    aria-label="Decrease duration"
                    className="btn-tactile w-8 h-8 rounded-lg bg-[#0c0e16] border border-white/[0.1] hover:border-white/[0.2] text-slate-300 flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="px-4 py-1.5 rounded-lg bg-[#0c0e16] border border-emerald-500/40 text-center min-w-[110px] shadow-sm">
                    <span className="text-base font-mono font-black text-emerald-300">{durationDays}</span>
                    <span className="text-xs text-slate-300 ml-1.5 font-bold">
                      {durationDays === 1 ? t('day', language) : t('days', language)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDurationPreset(durationDays + 1)}
                    disabled={durationDays >= 30}
                    aria-label="Increase duration"
                    className="btn-tactile w-8 h-8 rounded-lg bg-[#0c0e16] border border-white/[0.1] hover:border-white/[0.2] text-slate-300 flex items-center justify-center disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <span>{formatReadableDate(startDate, language)}</span>
                  <span className="text-slate-600 mx-1">→</span>
                  <span className="text-emerald-400 font-bold">{formatReadableDate(endDate, language)}</span>
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
                <span>{isHi ? '1 दिन (एक्सप्रेस)' : '1 Day (Express)'}</span>
                <span className="text-slate-400">{isHi ? 'सीमा: 1 - 30 दिन' : 'Target Range: 1 – 30 Days'}</span>
                <span>{isHi ? '30 दिन (अभियान)' : '30 Days (Grand Expedition)'}</span>
              </div>
            </div>
          )}

          {/* Dynamic Acclimatization Pacing Status Card */}
          <div className="p-3.5 rounded-xl bg-[#121522] border border-white/[0.08] space-y-2 shadow-inner">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className={`text-xs px-2.5 py-1 rounded-lg font-bold border whitespace-nowrap shrink-0 flex items-center gap-1.5 ${pacing.color}`}>
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{pacing.badge}</span>
              </span>
              <div className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-slate-400">{formatReadableDate(startDate, language)}</span>
                <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="text-white font-bold">{formatReadableDate(endDate, language)}</span>
                <span className="text-emerald-400 font-bold ml-1">
                  ({durationDays} {durationDays === 1 ? t('day', language) : t('days', language)})
                </span>
              </div>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed border-t border-white/[0.06] pt-2 flex items-start gap-2">
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
              <span>{t('budget_tier_heading', language)}</span>
            </label>
            <span className="text-xs font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              ₹{budgetAmount.toLocaleString('en-IN')} INR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {[
              { tier: 'BUDGET', label: isHi ? 'बजट अन्वेषक' : 'Budget Explorer', desc: isHi ? 'सरकारी डॉर्मिटरी / होमस्टे' : 'Govt Dorms / Homestays' },
              { tier: 'STANDARD', label: isHi ? 'मानक आराम' : 'Balanced Comfort', desc: isHi ? 'टूरिज्म कॉटेज व कैब' : 'Tourism Cottages & Cabs' },
              { tier: 'COMFORT', label: isHi ? 'प्रीमियम लेज़र' : 'Premium Leisure', desc: isHi ? 'इको-रिसॉर्ट्स व प्राइवेट एसयूवी' : 'Eco-Resorts & Private SUVs' },
            ].map((tItem) => (
              <button
                type="button"
                key={tItem.tier}
                onClick={() => handleTierChange(tItem.tier as any)}
                className={`btn-tactile p-2.5 sm:p-3 rounded-xl text-left border cursor-pointer ${
                  budgetTier === tItem.tier
                    ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-md'
                    : 'bg-[#121522] border-white/[0.08] text-slate-400 hover:border-white/[0.16]'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">{tItem.label}</div>
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Min: ₹3,000</span>
            <span className="hidden sm:inline">{isHi ? '15% आपातकालीन आरक्षित राशि शामिल' : 'Includes 15% Emergency Reserve'}</span>
            <span>Max: ₹40,000</span>
          </div>
        </div>

        {/* Fitness Level Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>{t('fitness_heading', language)}</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
            {[
              { key: 'BEGINNER', label: isHi ? 'सरल / पारिवारिक' : 'Gentle / Family', tag: isHi ? 'आराम से चलना' : 'Frequent leisure halts' },
              { key: 'MODERATE', label: isHi ? 'मध्यम सक्रिय' : 'Moderate Active', tag: isHi ? 'मानक यात्रा गति' : 'Standard travel pacing' },
              { key: 'EXPERIENCED', label: isHi ? 'उच्च सहनशक्ति' : 'High-Endurance', tag: isHi ? 'अनुभवी ट्रेकर गति' : 'Trekker & fast pace' },
            ].map((f) => (
              <button
                type="button"
                key={f.key}
                onClick={() => setFitnessLevel(f.key as any)}
                className={`btn-tactile p-2.5 sm:p-3 rounded-xl text-left border cursor-pointer ${
                  fitnessLevel === f.key
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-white shadow-md'
                    : 'bg-[#121522] border-white/[0.08] text-slate-400 hover:border-white/[0.16]'
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
          className="btn-tactile w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold tracking-wider uppercase shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer border border-white/20"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              <span>{t('btn_generating', language)}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
              <span>{t('btn_generate', language)}</span>
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TripWizard;
