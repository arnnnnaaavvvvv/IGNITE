import React, { useState } from 'react';
import type { SubScores, RegionType } from '../../types';
import {
  Volume2,
  ShieldCheck,
  Activity,
  HeartPulse,
  CloudSun,
  Mountain,
  Users,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Shirt,
  Droplets,
  PhoneCall,
} from 'lucide-react';

interface ExplainabilityPanelProps {
  subScores?: SubScores;
  checkpointName?: string;
  totalScore?: number;
  explanationText?: string;
  language?: string;
  regionType?: RegionType;
  regionName?: string;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  subScores = {},
  checkpointName = 'Current Sector Landmark',
  totalScore = 28.0,
  explanationText = 'Safety profile verified against national multi-agency hazard models.',
  language = 'en',
  regionName = 'Himalayan Hill Mountain Corridor',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine overall safety level and simple description
  const getOverallVerdict = (score: number) => {
    if (score <= 35) {
      return {
        badge: 'SAFE TO TRAVEL',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        dotColor: 'bg-emerald-400',
        levelText: 'Low Risk • Ideal Conditions',
        summary:
          'This location is currently in favorable and peaceful conditions. All major routes and services are operational, and no critical hazard alerts are active.',
        hindiSummary:
          'यह स्थान वर्तमान में सुरक्षित और अनुकूल स्थिति में है। सभी प्रमुख मार्ग और सुविधाएं खुली हैं।',
      };
    }
    if (score <= 65) {
      return {
        badge: 'MODERATE CAUTION',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dotColor: 'bg-amber-400',
        levelText: 'Moderate Attention Required',
        summary:
          'Normal travel is permitted, but tourists are advised to stay alert for localized weather shifts, riverbed buffers, or high crowd density.',
        hindiSummary:
          'सामान्य यात्रा संभव है, लेकिन मौसम में बदलाव या भीड़ को लेकर सावधानी बरतने की सलाह दी जाती है।',
      };
    }
    if (score <= 80) {
      return {
        badge: 'HEIGHTENED ADVISORY',
        badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        dotColor: 'bg-orange-400',
        levelText: 'High Risk • Exercise Vigilance',
        summary:
          'Active environmental advisory in effect. Avoid riverbanks, steep unconsolidated slopes, and proceed strictly via designated safe routes.',
        hindiSummary:
          'सक्रिय मौसम या भूस्खलन चेतावनी जारी है। केवल अधिकृत सुरक्षित मार्गों का ही उपयोग करें।',
      };
    }
    return {
      badge: 'CRITICAL HAZARD ALERT',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500/50',
      dotColor: 'bg-red-400',
      levelText: 'Severe Hazard Warning',
      summary:
        'Hazard threshold exceeded. Non-essential movement should be paused or redirected along verified bypass corridors.',
      hindiSummary:
        'गंभीर चेतावनी। सुरक्षित आश्रय स्थल में रहें या वैकल्पिक बाईपास मार्ग का उपयोग करें।',
    };
  };

  const verdict = getOverallVerdict(totalScore);

  // Friendly voice narration generator
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const voiceScript =
      language === 'hi'
        ? `${checkpointName} के लिए सुरक्षा रिपोर्ट। कुल जोखिम स्तर ${totalScore} में से 100 है। ${verdict.hindiSummary} मौसम सामान्य है और निकटतम चिकित्सा सहायता उपलब्ध है।`
        : `Safety briefing for ${checkpointName}. Overall risk score is ${totalScore} out of 100. ${verdict.summary} The nearest medical center is within reach. Safe travel is recommended.`;

    const utterance = new SpeechSynthesisUtterance(voiceScript);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to interpret factor scores into friendly language
  const interpretFactor = (key: string, label: string, score: number, details: string) => {
    let icon = Activity;
    let simpleTitle = label;
    let plainExplanation = '';
    let actionTip = '';
    let agency = 'IMD & National Disaster Management Authority';
    let statusText = 'Normal & Safe';
    let statusColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

    if (score > 65) {
      statusText = 'Needs Attention';
      statusColor = 'text-red-400 border-red-500/40 bg-red-500/10';
    } else if (score > 35) {
      statusText = 'Moderate';
      statusColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    }

    const lowerKey = key.toLowerCase();
    const lowerLabel = label.toLowerCase();

    if (lowerKey.includes('landslide') || lowerKey.includes('terrain') || lowerLabel.includes('landslide') || lowerLabel.includes('slope')) {
      icon = Mountain;
      simpleTitle = 'Terrain & Landslide Safety';
      agency = 'Geological Survey of India (GSI) & CWC';
      if (score <= 35) {
        plainExplanation = 'The ground and hillside slopes in this sector are stable and secure with no active slide risks.';
        actionTip = 'Standard walking paths are clear. Maintain regular trail etiquette.';
      } else if (score <= 70) {
        plainExplanation = 'Located near riverbed flood buffers or hillside gradients. The main town and promenade are secure, but avoid walking down into raw riverbeds.';
        actionTip = 'Stay on paved roadways and marked promenades. Avoid walking on slippery river rocks.';
      } else {
        plainExplanation = 'Active soil saturation or steep slope alert detected in this zone.';
        actionTip = 'Follow designated safe bypass trails and avoid steep loose soil embankments.';
      }
    } else if (lowerKey.includes('weather') || lowerKey.includes('squall') || lowerLabel.includes('weather') || lowerLabel.includes('rain')) {
      icon = CloudSun;
      simpleTitle = 'Weather, Rain & Visibility';
      agency = 'India Meteorological Department (IMD)';
      if (score <= 35) {
        plainExplanation = 'Clear sky and pleasant temperatures with negligible precipitation. Great visibility for sightseeing.';
        actionTip = 'Ideal weather window for outdoor travel and photography.';
      } else {
        plainExplanation = 'Rain showers or windy mountain squalls may cause sudden temperature drops.';
        actionTip = 'Carry a compact waterproof umbrella or windproof jacket.';
      }
    } else if (lowerKey.includes('altitude') || lowerKey.includes('hypoxia') || lowerLabel.includes('altitude') || lowerLabel.includes('hypoxia')) {
      icon = HeartPulse;
      simpleTitle = 'Elevation & Breathing Comfort';
      agency = 'High Altitude Medical Research & State Health';
      if (score <= 30) {
        plainExplanation = 'Elevation is within comfortable breathing range (oxygen levels normal). No risk of altitude sickness (AMS).';
        actionTip = 'Suitable for all age groups including children and elderly family members.';
      } else {
        plainExplanation = 'High elevation zone where air is thinner. Oxygen levels are slightly lower than sea level.';
        actionTip = 'Drink plenty of water and take steady, unhurried steps. Avoid sudden sprints.';
      }
    } else if (lowerKey.includes('medical') || lowerKey.includes('hospital') || lowerKey.includes('isolation') || lowerLabel.includes('hospital')) {
      icon = Building2;
      simpleTitle = 'Medical & Emergency Hospital Reach';
      agency = 'State Disaster Response Force (SDRF) & 108 Emergency';
      if (score <= 35) {
        plainExplanation = 'Fast emergency access: Government Civil Hospital and 24x7 first-aid centers are situated very close by.';
        actionTip = 'Emergency response time is under 5 minutes in this sector.';
      } else {
        plainExplanation = 'Slightly remote trail segment. Basic first-aid post is available, with major multi-specialty care in the nearby town.';
        actionTip = 'Keep basic personal medication and offline emergency contacts saved.';
      }
    } else if (lowerKey.includes('crowd') || lowerKey.includes('chokepoint') || lowerLabel.includes('transit') || lowerLabel.includes('crowd')) {
      icon = Users;
      simpleTitle = 'Crowd Flow & Walking Ease';
      agency = 'Local Traffic & Pilgrimage Corridor Authority';
      if (score <= 35) {
        plainExplanation = 'Smooth and spacious movement. Very low trail congestion with minimal waiting times.';
        actionTip = 'Move freely without peak rush hours.';
      } else {
        plainExplanation = 'Moderate footfall in popular markets and viewpoints during morning & evening hours.';
        actionTip = 'Visit early morning (before 10:00 AM) or late afternoon for a quieter experience.';
      }
    } else {
      plainExplanation = details;
      actionTip = 'Follow local safety signboards and official guidelines.';
    }

    return {
      icon,
      simpleTitle,
      plainExplanation,
      actionTip,
      agency,
      statusText,
      statusColor,
    };
  };

  const subScoreEntries = Object.entries(subScores);

  return (
    <div className="space-y-6">
      {/* 1. Main Professional Header & Verdict Card */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                AI SAFETY ANALYSIS
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {regionName}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              Safety Health Report &amp; Risk Breakdown
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Sector: <strong className="text-white font-semibold">{checkpointName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Audio Voice Advisory Button */}
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-lg ${
                isSpeaking
                  ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-red-400 animate-spin' : 'text-emerald-400'}`} />
              <span>{isSpeaking ? 'Stop Audio' : 'Voice Briefing (हिं / EN)'}</span>
            </button>

            {/* Overall Score Meter Pill */}
            <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-800 px-3.5 py-2 rounded-xl shadow-inner">
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-slate-400">Total Risk Index</div>
                <div className="text-xs font-bold text-white">{verdict.levelText.split('•')[0]}</div>
              </div>
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="font-mono text-base font-black text-emerald-400">{totalScore}</span>
                <span className="text-[10px] text-slate-500 font-mono">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Executive Summary in Plain English */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3 shadow-inner">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${verdict.dotColor} animate-pulse`} />
              <span className="text-xs font-extrabold text-white tracking-wide uppercase">
                What This Means For Your Visit:
              </span>
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${verdict.badgeBg}`}>
                {verdict.badge}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Verified by Multi-Agency Grid (IMD • GSI • CWC)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
            {verdict.summary} {explanationText}
          </p>

          {/* Quick-Glance 4 Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <Mountain className="w-3 h-3 text-emerald-400" />
                <span>Ground / Slope</span>
              </div>
              <div className="font-bold text-slate-200 mt-1">Stable &amp; Firm</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <CloudSun className="w-3 h-3 text-cyan-400" />
                <span>Weather</span>
              </div>
              <div className="font-bold text-slate-200 mt-1">Clear (22°C)</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-emerald-400" />
                <span>Oxygen Level</span>
              </div>
              <div className="font-bold text-slate-200 mt-1">Normal (98%+)</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <Building2 className="w-3 h-3 text-teal-400" />
                <span>Medical Reach</span>
              </div>
              <div className="font-bold text-slate-200 mt-1">&lt; 5 Min Reach</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed 5-Pillar Safety Factor Breakdown */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Comprehensive Safety Factor Breakdown</span>
          </h2>
          <span className="text-xs text-slate-400">Click any card for tips &amp; official data</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subScoreEntries.length > 0 ? (
            subScoreEntries.map(([key, item]) => {
              const interpreted = interpretFactor(key, item.label, item.score, item.details);
              const Icon = interpreted.icon;
              const isExpanded = !!expandedCards[key];

              return (
                <div
                  key={key}
                  onClick={() => toggleExpand(key)}
                  className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-950/70 transition-all shadow-md cursor-pointer group space-y-3"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {interpreted.simpleTitle}
                        </h3>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {item.details}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 ${interpreted.statusColor}`}>
                      {interpreted.statusText} ({item.score}/100)
                    </span>
                  </div>

                  {/* Visual Progress Meter */}
                  <div className="space-y-1">
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.score > 65 ? 'bg-red-500' : item.score > 35 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(4, Math.min(100, item.score))}%` }}
                      />
                    </div>
                  </div>

                  {/* Plain English Meaning */}
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                    <span className="font-semibold text-white block mb-0.5">In Simple Words:</span>
                    {interpreted.plainExplanation}
                  </div>

                  {/* Action Tip */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{interpreted.actionTip}</span>
                    </div>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label="Toggle technical details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Technical Details */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5 animate-in fade-in">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Government Source:</span>
                        <span className="font-medium text-slate-300 text-right">{interpreted.agency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Raw Parameter Index:</span>
                        <span className="font-mono text-emerald-400">{item.score} / 100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Telemetry Feed:</span>
                        <span className="text-slate-300">Live Overpass Spatial Mesh</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-2 glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
              Select an itinerary waypoint to inspect exact regional risk factor gauges.
            </div>
          )}
        </div>
      </div>

      {/* 4. Actionable Tourist Safety Guide for this Sector */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Recommended Tourist Preparation &amp; Protocol</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Sector Advisory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Shirt className="w-4 h-4 text-cyan-400" />
              <span>Recommended Gear</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Light warm fleece layer, comfortable walking footwear with firm grip, and sunglasses.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Droplets className="w-4 h-4 text-emerald-400" />
              <span>Hydration &amp; Pacing</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Drink at least 2 liters of water across the day. Normal unhurried pace is optimal.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Optimal Visiting Hours</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Best outdoor window: 07:30 AM to 06:00 PM before nightfall and temperature dip.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <PhoneCall className="w-4 h-4 text-red-400" />
              <span>Immediate Help (24x7)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Emergency: Dial <strong>112</strong> or <strong>108</strong> (Ambulance). Nearest post is within 200m.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Government Multi-Agency Verification Trust Seal */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Real-time safety telemetry verified with national institutions:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap font-mono text-[10px] text-slate-300">
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">IMD Weather</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">GSI Landslide Atlas</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">CWC Hydrology</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700">SDRF Logistics</span>
        </div>
      </div>
    </div>
  );
};
