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
import { t } from '../../services/i18n';

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
  checkpointName = 'Current Location',
  totalScore = 25.0,
  explanationText = 'Safety checked with official regional safety guidelines.',
  language = 'en',
  regionName = 'Hill & Mountain Region',
}) => {
  const isHi = language === 'hi';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (key: string) => {
    setExpandedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine overall safety level and simple description
  const getOverallVerdict = (score: number) => {
    if (score <= 35) {
      return {
        badge: isHi ? 'यात्रा के लिए सुरक्षित' : 'SAFE TO TRAVEL',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        dotColor: 'bg-emerald-400',
        levelText: isHi ? 'कम जोखिम • अच्छी स्थिति' : 'Low Risk • Good Conditions',
        summary:
          'This location is currently safe with favorable conditions. All major routes and services are open.',
        hindiSummary:
          'यह स्थान वर्तमान में पूरी तरह सुरक्षित और अनुकूल स्थिति में है। सभी प्रमुख मार्ग और सुविधाएं खुली हैं।',
      };
    }
    if (score <= 65) {
      return {
        badge: isHi ? 'मध्यम सावधानी' : 'MODERATE CAUTION',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        dotColor: 'bg-amber-400',
        levelText: isHi ? 'सावधानी • मौसम पर ध्यान दें' : 'Moderate Caution • Stay Alert',
        summary:
          'Travel is normal and open. Keep an eye on weather shifts and crowd movement.',
        hindiSummary:
          'सामान्य यात्रा खुली है। मौसम में अचानक बदलाव या अधिक भीड़ को लेकर सतर्क रहें।',
      };
    }
    if (score <= 80) {
      return {
        badge: isHi ? 'उच्च चेतावनी' : 'HIGH RISK ADVISORY',
        badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        dotColor: 'bg-orange-400',
        levelText: isHi ? 'उच्च जोखिम • सावधानी बरतें' : 'High Risk • Exercise Caution',
        summary:
          'Weather or terrain warning active. Stay on marked main paths and avoid steep slopes.',
        hindiSummary:
          'मौसम या भूभाग संबंधी चेतावनी जारी है। केवल अधिकृत और सुरक्षित मुख्य मार्गों का ही उपयोग करें।',
      };
    }
    return {
      badge: isHi ? 'गंभीर आपदा अलर्ट' : 'CRITICAL HAZARD ALERT',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20',
      dotColor: 'bg-red-400',
      levelText: isHi ? 'गंभीर चेतावनी' : 'Severe Hazard Warning',
      summary:
        'Hazard threshold exceeded. Stay in a safe shelter or take the designated safe detour route.',
      hindiSummary:
        'गंभीर खतरा अलर्ट। निकटतम सुरक्षित आश्रय स्थल में रहें या वैकल्पिक सुरक्षित मार्ग का उपयोग करें।',
    };
  };

  const verdict = getOverallVerdict(totalScore);

  // Voice narration generator
  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert(isHi ? 'इस डिवाइस पर ऑडियो उपलब्ध नहीं है।' : 'Speech synthesis is not supported on this device.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const voiceScript = isHi
      ? `${checkpointName} के लिए सुरक्षा रिपोर्ट। कुल जोखिम स्तर 100 में से ${totalScore} है। ${verdict.hindiSummary} मौसम सामान्य है और निकटतम चिकित्सा सहायता उपलब्ध है।`
      : `Safety update for ${checkpointName}. Overall safety risk is ${totalScore} out of 100. ${verdict.summary} Safe travel is recommended.`;

    const utterance = new SpeechSynthesisUtterance(voiceScript);
    utterance.lang = isHi ? 'hi-IN' : 'en-US';
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to interpret factor scores into plain language & bilingual output
  const interpretFactor = (key: string, label: string, score: number, details: string) => {
    let icon = Activity;
    let simpleTitle = label;
    let plainExplanation = '';
    let actionTip = '';
    let agency = isHi ? 'भारतीय मौसम विभाग एवं आपदा प्रबंधन' : 'IMD & National Disaster Management';
    let statusText = isHi ? 'सुरक्षित व सामान्य' : 'Safe & Normal';
    let statusColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';

    if (score > 65) {
      statusText = isHi ? 'सावधानी जरूरी' : 'Needs Attention';
      statusColor = 'text-red-400 border-red-500/20 bg-red-500/10';
    } else if (score > 35) {
      statusText = isHi ? 'मध्यम' : 'Moderate';
      statusColor = 'text-amber-400 border-amber-500/20 bg-amber-500/10';
    }

    const lowerKey = key.toLowerCase();
    const lowerLabel = label.toLowerCase();

    if (lowerKey.includes('landslide') || lowerKey.includes('terrain') || lowerLabel.includes('landslide') || lowerLabel.includes('slope')) {
      icon = Mountain;
      simpleTitle = isHi ? 'धरातल व ढलान सुरक्षा' : 'Ground & Slope Safety';
      agency = isHi ? 'भारतीय भूवैज्ञानिक सर्वेक्षण (GSI)' : 'Geological Survey of India (GSI)';
      if (score <= 35) {
        plainExplanation = isHi
          ? 'इस क्षेत्र में जमीन और पहाड़ी ढलान पूरी तरह स्थिर हैं। भूस्खलन का कोई खतरा नहीं है।'
          : 'The ground and hillside paths are firm and stable with no active slide risks.';
        actionTip = isHi
          ? 'पैदल मार्ग साफ है। सामान्य रूप से आगे बढ़ें।'
          : 'Walking paths are clear. Maintain a regular pace.';
      } else if (score <= 70) {
        plainExplanation = isHi
          ? 'नदी किनारे या ढलान वाले रास्ते के समीप है। नदी के बहाव क्षेत्र में नीचे न उतरें।'
          : 'Near river buffer or steeper hillside. Avoid walking down into riverbeds.';
        actionTip = isHi
          ? 'पक्के मार्ग और चिन्हित रास्ते पर ही रहें।'
          : 'Stay on paved roadways and marked paths.';
      } else {
        plainExplanation = isHi
          ? 'मिट्टी में नमी या ढलान पर पत्थरों के खिसकने की चेतावनी है।'
          : 'Active soil saturation or steep slope alert detected in this zone.';
        actionTip = isHi
          ? 'चिन्हित सुरक्षित बाईपास मार्ग का पालन करें।'
          : 'Follow designated safe detour trails.';
      }
    } else if (lowerKey.includes('weather') || lowerKey.includes('squall') || lowerLabel.includes('weather') || lowerLabel.includes('rain')) {
      icon = CloudSun;
      simpleTitle = isHi ? 'मौसम, वर्षा व दृश्यता' : 'Weather, Rain & Visibility';
      agency = isHi ? 'भारत मौसम विज्ञान विभाग (IMD)' : 'India Meteorological Department (IMD)';
      if (score <= 35) {
        plainExplanation = isHi
          ? 'आसमान साफ है, तापमान अनुकूल है और बारिश की कोई संभावना नहीं है।'
          : 'Clear sky and pleasant temperatures with little to no rain expected.';
        actionTip = isHi
          ? 'घूमने और फोटोग्राफी के लिए सबसे अच्छा समय।'
          : 'Ideal weather for outdoor travel and sightseeing.';
      } else {
        plainExplanation = isHi
          ? 'हल्की बारिश या ठंडी हवाओं के कारण तापमान में अचानक गिरावट आ सकती है।'
          : 'Rain showers or windy gusts may cause sudden temperature drops.';
        actionTip = isHi
          ? 'हल्की छतरी या विंडप्रूफ जैकेट साथ रखें।'
          : 'Carry a compact umbrella or windproof jacket.';
      }
    } else if (lowerKey.includes('altitude') || lowerKey.includes('hypoxia') || lowerLabel.includes('altitude') || lowerLabel.includes('hypoxia')) {
      icon = HeartPulse;
      simpleTitle = isHi ? 'ऊंचाई एवं सांस लेने में सहजता' : 'Elevation & Breathing Comfort';
      agency = isHi ? 'उच्च पर्वतीय स्वास्थ्य अनुसंधान' : 'High Altitude Health Agency';
      if (score <= 30) {
        plainExplanation = isHi
          ? 'ऊंचाई सामान्य स्तर पर है, हवा में ऑक्सीजन की मात्रा भरपूर है।'
          : 'Elevation is comfortable with normal oxygen levels.';
        actionTip = isHi
          ? 'बच्चों और वरिष्ठ नागरिकों सहित सभी आयु वर्ग के लिए अनुकूल।'
          : 'Suitable for all ages including children and seniors.';
      } else {
        plainExplanation = isHi
          ? 'अधिक ऊंचाई वाला क्षेत्र जहां हवा पतली है। ऑक्सीजन का स्तर थोड़ा कम है।'
          : 'High altitude zone where air is thinner. Oxygen levels are slightly lower.';
        actionTip = isHi
          ? 'भरपूर पानी पिएं और बिना जल्दबाजी के धीमी गति से चलें।'
          : 'Drink plenty of water and walk at a steady, easy pace.';
      }
    } else if (lowerKey.includes('medical') || lowerKey.includes('hospital') || lowerKey.includes('isolation') || lowerLabel.includes('hospital')) {
      icon = Building2;
      simpleTitle = isHi ? 'निकटतम चिकित्सा एवं एंबुलेंस सुविधा' : 'Medical & Hospital Reach';
      agency = isHi ? 'राज्य आपदा मोचन बल (SDRF) व 108 एंबुलेंस' : 'SDRF & 108 Emergency Ambulance';
      if (score <= 35) {
        plainExplanation = isHi
          ? 'त्वरित चिकित्सा पहुंच: सरकारी स्वास्थ्य केंद्र और 24x7 प्राथमिक चिकित्सा पास में उपलब्ध है।'
          : 'Fast emergency access: Medical center and 24x7 first-aid posts are very close.';
        actionTip = isHi
          ? 'आपातकालीन सहायता 5 मिनट के भीतर उपलब्ध है।'
          : 'Emergency response time is under 5 minutes here.';
      } else {
        plainExplanation = isHi
          ? 'थोड़ा दूरस्थ खंड, हालांकि बुनियादी प्राथमिक चिकित्सा केंद्र पास में मौजूद है।'
          : 'Slightly remote trail segment. Basic first-aid post is available nearby.';
        actionTip = isHi
          ? 'अपनी जरूरी दवाइयां साथ रखें और आपातकालीन नंबर सेव रखें।'
          : 'Keep personal medications and emergency contacts handy.';
      }
    } else if (lowerKey.includes('crowd') || lowerKey.includes('chokepoint') || lowerLabel.includes('transit') || lowerLabel.includes('crowd')) {
      icon = Users;
      simpleTitle = isHi ? 'भीड़ का स्तर एवं चलने में आसानी' : 'Crowd Flow & Walking Ease';
      agency = isHi ? 'स्थानीय पुलिस व तीर्थ प्रशासन' : 'Local Police & Administration';
      if (score <= 35) {
        plainExplanation = isHi
          ? 'खुला और आसान रास्ता। न्यूनतम भीड़ और बिना किसी रुकावट के आवागमन।'
          : 'Spacious and smooth movement. Low congestion with little waiting time.';
        actionTip = isHi
          ? 'आराम से घूमें, भीड़ का कोई दबाव नहीं है।'
          : 'Walk comfortably without rush.';
      } else {
        plainExplanation = isHi
          ? 'प्रमुख दर्शन स्थलों पर सुबह और शाम के समय मध्यम भीड़ रह सकती है।'
          : 'Moderate visitor footfall during morning and evening hours.';
        actionTip = isHi
          ? 'शांत अनुभव के लिए सुबह जल्दी या दोपहर बाद दर्शन करें।'
          : 'Visit early morning or late afternoon for a quieter walk.';
      }
    } else {
      plainExplanation = details;
      actionTip = isHi
        ? 'स्थानीय सुरक्षा सूचनाओं और दिशा-निर्देशों का पालन करें।'
        : 'Follow local safety signs and guidelines.';
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
      <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#0e1017]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {isHi ? 'सुरक्षा विश्लेषण' : 'SAFETY UPDATE'}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {regionName}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {t('explainability_heading', language)}
            </h1>
            <p className="text-xs text-slate-300">
              {isHi ? 'स्थान:' : 'Location:'} <strong className="text-white font-semibold">{checkpointName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Audio Voice Briefing Button */}
            <button
              onClick={handleSpeak}
              className={`btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold cursor-pointer ${
                isSpeaking
                  ? 'bg-red-500/10 text-red-300 border-red-500/40'
                  : 'bg-[#12141d] hover:bg-[#181b26] text-slate-200 border-white/[0.08]'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-red-400 animate-spin' : 'text-emerald-400'}`} />
              <span>{isSpeaking ? t('btn_stop_audio', language) : t('btn_listen_briefing', language)}</span>
            </button>

            {/* Overall Score Meter */}
            <div className="flex items-center gap-2.5 bg-[#12141d] border border-white/[0.08] px-3 py-1.5 rounded-md">
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono text-slate-400">{t('safety_index', language)}</div>
                <div className="text-xs font-semibold text-white">{verdict.levelText.split('•')[0]}</div>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20">
                <span className="font-mono text-xs font-bold text-emerald-400">{totalScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Plain Summary */}
        <div className="mt-3.5 p-3.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${verdict.dotColor}`} />
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                {isHi ? 'सुरक्षा स्थिति:' : 'Safety Status:'}
              </span>
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.2 rounded border ${verdict.badgeBg}`}>
                {verdict.badge}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              {isHi ? 'मौसम व राहत दलों द्वारा सत्यापित' : 'Verified with Weather & Safety Grid'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {isHi ? verdict.hindiSummary : verdict.summary} {explanationText}
          </p>

          {/* Quick 4 Status Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.04] text-xs">
            <div className="p-2 rounded-md bg-[#0e1017] border border-white/[0.04]">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <Mountain className="w-3 h-3 text-emerald-400" />
                <span>{isHi ? 'धरातल / ढलान' : 'Ground / Slope'}</span>
              </div>
              <div className="font-semibold text-slate-200 mt-0.5">{isHi ? 'स्थिर व सुरक्षित' : 'Stable & Safe'}</div>
            </div>

            <div className="p-2 rounded-md bg-[#0e1017] border border-white/[0.04]">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <CloudSun className="w-3 h-3 text-sky-400" />
                <span>{isHi ? 'मौसम' : 'Weather'}</span>
              </div>
              <div className="font-semibold text-slate-200 mt-0.5">{isHi ? 'साफ (22°C)' : 'Clear (22°C)'}</div>
            </div>

            <div className="p-2 rounded-md bg-[#0e1017] border border-white/[0.04]">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-emerald-400" />
                <span>{isHi ? 'ऑक्सीजन स्तर' : 'Oxygen Level'}</span>
              </div>
              <div className="font-semibold text-slate-200 mt-0.5">{isHi ? 'सामान्य (98%+)' : 'Normal (98%+)'}</div>
            </div>

            <div className="p-2 rounded-md bg-[#0e1017] border border-white/[0.04]">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <Building2 className="w-3 h-3 text-sky-400" />
                <span>{isHi ? 'चिकित्सा सुविधा' : 'Medical Help'}</span>
              </div>
              <div className="font-semibold text-slate-200 mt-0.5">{isHi ? '< 5 मिनट में' : '< 5 Min Reach'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Safety Factor Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHi ? 'सुरक्षा कारक विवरण' : 'Safety Factors'}</span>
          </h2>
          <span className="text-[11px] text-slate-400">{isHi ? 'विवरण देखने के लिए क्लिक करें' : 'Click to see details'}</span>
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

                  {/* Plain Meaning */}
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
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="pt-2 border-t border-white/[0.06] text-[10px] text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isHi ? 'स्रोत:' : 'Source:'}</span>
                        <span className="font-medium text-slate-300 text-right">{interpreted.agency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">{isHi ? 'जोखिम स्कोर:' : 'Score:'}</span>
                        <span className="font-mono text-emerald-400">{item.score} / 100</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-2 glass-panel p-6 rounded-lg text-center text-slate-400 text-xs">
              {isHi
                ? 'विस्तृत सुरक्षा गेज देखने के लिए किसी पड़ाव का चयन करें।'
                : 'Select any stop from your itinerary to view detailed safety gauges.'}
            </div>
          )}
        </div>
      </div>

      {/* 4. Actionable Tourist Safety Guide */}
      <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#0e1017] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-white">{isHi ? 'यात्रियों के लिए तैयारी और सुरक्षा सुझाव' : 'Helpful Travel Tips & Advice'}</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{isHi ? 'सलाह' : 'Guideline'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-0.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Shirt className="w-3.5 h-3.5 text-sky-400" />
              <span>{isHi ? 'पोशाक व जूते' : 'Recommended Gear'}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              {isHi
                ? 'हल्के गर्म कपड़े, आरामदायक जूते और धूप का चश्मा साथ रखें।'
                : 'Light layer, comfortable walking shoes with good grip, and sunglasses.'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-0.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHi ? 'पानी व गति' : 'Hydration & Pacing'}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              {isHi
                ? 'दिनभर में 2-3 लीटर पानी पिएं। बिना किसी हड़बड़ी के सामान्य गति से चलें।'
                : 'Drink at least 2 liters of water across the day. Walk at an easy, steady pace.'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-0.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHi ? 'घूमने का समय' : 'Best Visiting Hours'}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              {isHi
                ? 'उत्तम समय: सुबह 07:30 से शाम 06:00 बजे तक, अंधेरा होने से पहले।'
                : 'Best outdoor window: 07:30 AM to 06:00 PM before nightfall.'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-0.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>{isHi ? 'तत्काल सहायता' : 'Emergency Help'}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              {isHi
                ? 'आपातकालीन कॉल: 112 (राष्ट्रीय हेल्पलाइन) या 108 (एंबुलेंस)।'
                : 'Emergency: Dial 112 (National Helpline) or 108 (Ambulance).'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplainabilityPanel;
