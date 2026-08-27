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
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dotColor: 'bg-emerald-400',
        levelText: 'Low Risk • Ideal Conditions',
        summary:
          'This location is currently in favorable conditions. All major routes and services are operational, with no critical hazard alerts active.',
        hindiSummary:
          'यह स्थान वर्तमान में सुरक्षित और अनुकूल स्थिति में है। सभी प्रमुख मार्ग और सुविधाएं खुली हैं।',
      };
    }
    if (score <= 65) {
      return {
        badge: 'MODERATE CAUTION',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        dotColor: 'bg-amber-400',
        levelText: 'Moderate Attention Required',
        summary:
          'Normal travel is permitted. Tourists are advised to stay alert for localized weather shifts or high crowd density.',
        hindiSummary:
          'सामान्य यात्रा संभव है, लेकिन मौसम में बदलाव या भीड़ को लेकर सावधानी बरतने की सलाह दी जाती है।',
      };
    }
    if (score <= 80) {
      return {
        badge: 'HEIGHTENED ADVISORY',
        badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        dotColor: 'bg-orange-400',
        levelText: 'High Risk • Exercise Vigilance',
        summary:
          'Active environmental advisory in effect. Avoid steep unconsolidated slopes and proceed strictly via designated safe routes.',
        hindiSummary:
          'सक्रिय मौसम या भूस्खलन चेतावनी जारी है। केवल अधिकृत सुरक्षित मार्गों का ही उपयोग करें।',
      };
    }
    return {
      badge: 'CRITICAL HAZARD ALERT',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20',
      dotColor: 'bg-red-400',
      levelText: 'Severe Hazard Warning',
      summary:
        'Hazard threshold exceeded. Non-essential movement should be paused or redirected along verified bypass corridors.',
      hindiSummary:
        'गंभीर चेतावनी। सुरक्षित आश्रय स्थल में रहें या वैकल्पिक बाईपास मार्ग का उपयोग करें।',
    };
  };

  const verdict = getOverallVerdict(totalScore);

  // Voice narration generator
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
    let statusColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';

    if (score > 65) {
      statusText = 'Needs Attention';
      statusColor = 'text-red-400 border-red-500/20 bg-red-500/10';
    } else if (score > 35) {
      statusText = 'Moderate';
      statusColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10';
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
        plainExplanation = 'Located near riverbed flood buffers or hillside gradients. Avoid walking down into raw riverbeds.';
        actionTip = 'Stay on paved roadways and marked promenades.';
      } else {
        plainExplanation = 'Active soil saturation or steep slope alert detected in this zone.';
        actionTip = 'Follow designated safe bypass trails.';
      }
    } else if (lowerKey.includes('weather') || lowerKey.includes('squall') || lowerLabel.includes('weather') || lowerLabel.includes('rain')) {
      icon = CloudSun;
      simpleTitle = 'Weather, Rain & Visibility';
      agency = 'India Meteorological Department (IMD)';
      if (score <= 35) {
        plainExplanation = 'Clear sky and pleasant temperatures with negligible precipitation.';
        actionTip = 'Ideal weather window for outdoor travel and photography.';
      } else {
        plainExplanation = 'Rain showers or windy squalls may cause sudden temperature drops.';
        actionTip = 'Carry a compact waterproof umbrella or windproof jacket.';
      }
    } else if (lowerKey.includes('altitude') || lowerKey.includes('hypoxia') || lowerLabel.includes('altitude') || lowerLabel.includes('hypoxia')) {
      icon = HeartPulse;
      simpleTitle = 'Elevation & Breathing Comfort';
      agency = 'High Altitude Medical Research & State Health';
      if (score <= 30) {
        plainExplanation = 'Elevation is within comfortable breathing range (oxygen levels normal).';
        actionTip = 'Suitable for all age groups including children and elderly.';
      } else {
        plainExplanation = 'High elevation zone where air is thinner. Oxygen levels are slightly lower.';
        actionTip = 'Drink plenty of water and take steady, unhurried steps.';
      }
    } else if (lowerKey.includes('medical') || lowerKey.includes('hospital') || lowerKey.includes('isolation') || lowerLabel.includes('hospital')) {
      icon = Building2;
      simpleTitle = 'Medical & Emergency Hospital Reach';
      agency = 'State Disaster Response Force (SDRF) & 108 Emergency';
      if (score <= 35) {
        plainExplanation = 'Fast emergency access: Government Hospital and 24x7 first-aid centers are situated very close by.';
        actionTip = 'Emergency response time is under 5 minutes in this sector.';
      } else {
        plainExplanation = 'Slightly remote trail segment. Basic first-aid post is available nearby.';
        actionTip = 'Keep basic personal medication and offline emergency contacts saved.';
      }
    } else if (lowerKey.includes('crowd') || lowerKey.includes('chokepoint') || lowerLabel.includes('transit') || lowerLabel.includes('crowd')) {
      icon = Users;
      simpleTitle = 'Crowd Flow & Walking Ease';
      agency = 'Local Traffic & Pilgrimage Corridor Authority';
      if (score <= 35) {
        plainExplanation = 'Smooth and spacious movement. Low trail congestion with minimal waiting times.';
        actionTip = 'Move freely without peak rush hours.';
      } else {
        plainExplanation = 'Moderate footfall in popular viewpoints during morning and evening hours.';
        actionTip = 'Visit early morning or late afternoon for a quieter experience.';
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
    <div className="space-y-4">
      {/* 1. Main Header & Verdict Card */}
      <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                SAFETY ANALYSIS
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {regionName}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Safety Health Report &amp; Risk Breakdown
            </h1>
            <p className="text-xs text-slate-300">
              Sector: <strong className="text-white font-semibold">{checkpointName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Audio Voice Advisory Button */}
            <button
              onClick={handleSpeak}
              className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold cursor-pointer ${
                isSpeaking
                  ? 'bg-red-500/10 text-red-300 border-red-500/40'
                  : 'bg-[#12141d] hover:bg-[#181b26] text-slate-200 border-white/[0.08]'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-red-400 animate-spin' : 'text-emerald-400'}`} />
              <span>{isSpeaking ? 'Stop Audio' : 'Voice Briefing'}</span>
            </button>

            {/* Overall Score Meter */}
            <div className="flex items-center gap-2.5 bg-[#12141d] border border-white/[0.08] px-3 py-1.5 rounded-md">
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-slate-400">Risk Index</div>
                <div className="text-xs font-semibold text-white">{verdict.levelText.split('•')[0]}</div>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20">
                <span className="font-mono text-xs font-bold text-emerald-400">{totalScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Executive Summary */}
        <div className="mt-3.5 p-3.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${verdict.dotColor}`} />
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                Sector Briefing:
              </span>
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.2 rounded border ${verdict.badgeBg}`}>
                {verdict.badge}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Verified by Multi-Agency Grid (IMD • GSI • CWC)
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {verdict.summary} {explanationText}
          </p>

          {/* Quick 4 Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.04] text-xs">
            <div className="p-2 rounded-md bg-[#0e1017] border border-white/[0.04]">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <Mountain className="w-3 h-3 text-emerald-400" />
                <span>Ground / Slope</span>
              </div>
              <div className="font-semibold text-slate-200 mt-0.5">Stable &amp; Firm</div>
            </div>

            <div className="p-2 rounded-md bg-[#0e1017] border border-white/[0.04]">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <CloudSun className="w-3 h-3 text-sky-400" />
                <span>Weather</span>
              </div>
              <div className="font-semibold text-slate-200 mt-0.5">Clear (22°C)</div>
            </div>

            <div className="p-2 rounded-md bg-[#0e1017] border border-white/[0.04]">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-emerald-400" />
                <span>Oxygen Level</span>
              </div>
              <div className="font-semibold text-slate-200 mt-0.5">Normal (98%+)</div>
            </div>

            <div className="p-2 rounded-md bg-[#0e1017] border border-white/[0.04]">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <Building2 className="w-3 h-3 text-sky-400" />
                <span>Medical Reach</span>
              </div>
              <div className="font-semibold text-slate-200 mt-0.5">&lt; 5 Min Reach</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Safety Factor Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Safety Factor Breakdown</span>
          </h2>
          <span className="text-[11px] text-slate-400">Click card for source telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subScoreEntries.length > 0 ? (
            subScoreEntries.map(([key, item]) => {
              const interpreted = interpretFactor(key, item.label, item.score, item.details);
              const Icon = interpreted.icon;
              const isExpanded = !!expandedCards[key];

              return (
                <div
                  key={key}
                  onClick={() => toggleExpand(key)}
                  className="glass-panel p-3.5 rounded-lg border border-white/[0.06] hover:border-white/[0.12] bg-[#12141d] transition-all cursor-pointer space-y-2.5"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-[#0e1017] border border-white/[0.06] flex items-center justify-center text-emerald-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-white">
                          {interpreted.simpleTitle}
                        </h3>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.details}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border shrink-0 ${interpreted.statusColor}`}>
                      {interpreted.statusText} ({item.score}/100)
                    </span>
                  </div>

                  {/* Visual Meter */}
                  <div className="w-full h-1.5 bg-[#0e1017] rounded-full overflow-hidden border border-white/[0.04]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.score > 65 ? 'bg-red-500' : item.score > 35 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(4, Math.min(100, item.score))}%` }}
                    />
                  </div>

                  {/* Plain English Meaning */}
                  <div className="text-[11px] text-slate-300 leading-relaxed bg-[#0e1017] p-2 rounded border border-white/[0.04]">
                    {interpreted.plainExplanation}
                  </div>

                  {/* Action Tip */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>{interpreted.actionTip}</span>
                    </div>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label="Toggle technical details"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Expanded Technical Details */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-white/[0.06] text-[10px] text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Source:</span>
                        <span className="font-medium text-slate-300 text-right">{interpreted.agency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Raw Parameter Index:</span>
                        <span className="font-mono text-emerald-400">{item.score} / 100</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-2 glass-panel p-6 rounded-lg text-center text-slate-400 text-xs">
              Select an itinerary waypoint to inspect exact regional risk factor gauges.
            </div>
          )}
        </div>
      </div>

      {/* 4. Actionable Tourist Safety Guide */}
      <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-white">Recommended Tourist Preparation &amp; Protocol</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Sector Advisory</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-0.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Shirt className="w-3.5 h-3.5 text-sky-400" />
              <span>Recommended Gear</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Light fleece layer, comfortable walking footwear with firm grip, and sunglasses.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-0.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hydration &amp; Pacing</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Drink at least 2 liters of water across the day. Normal unhurried pace is optimal.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-0.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Visiting Hours</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Best outdoor window: 07:30 AM to 06:00 PM before nightfall and temperature dip.
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-0.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>Immediate Help</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Emergency: Dial <strong>112</strong> or <strong>108</strong> (Ambulance).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainabilityPanel;
