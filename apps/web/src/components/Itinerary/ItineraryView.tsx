import React, { useState } from 'react';
import type { ItineraryResponse } from '../../types';
import { Activity, Wallet, Info, HeartPulse, ShieldCheck, Compass, Navigation, CheckCircle2, Clock, Sun, Sparkles, MapPin } from 'lucide-react';
import { t, getLocalizedDestinationName } from '../../services/i18n';

interface ItineraryViewProps {
  itinerary: ItineraryResponse;
  language?: string;
  onSelectCheckpoint?: (cp: any) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, language = 'en', onSelectCheckpoint }) => {
  const isHi = language === 'hi';
  const [selectedDay, setSelectedDay] = useState(1);

  const activeDayPlan = itinerary.days.find((d) => d.day_number === selectedDay) || itinerary.days[0];

  const getRiskBadge = (score: number) => {
    if (score <= 35) return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: isHi ? 'सुरक्षित' : 'SAFE' };
    if (score <= 65) return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: isHi ? 'सामान्य सावधानी' : 'ADVISORY' };
    if (score <= 80) return { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: isHi ? 'सतर्क रहें' : 'CAUTION' };
    return { bg: 'bg-red-500/10 text-red-400 border-red-500/20', label: isHi ? 'गंभीर' : 'CRITICAL' };
  };

  const getTrafficBadge = (level?: string) => {
    if (level === 'HIGH') return { bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30', label: isHi ? 'अधिक भीड़ / ट्रैफिक' : 'Busy / High Traffic' };
    if (level === 'MODERATE') return { bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30', label: isHi ? 'सामान्य ट्रैफिक' : 'Moderate Traffic' };
    return { bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', label: isHi ? 'कम ट्रैफिक • सुगम' : 'Low Traffic • Best Time' };
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card with Overall Score & Summary */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#0e1017]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isHi ? 'सत्यापित सुरक्षित यात्रा योजना' : 'VERIFIED TRIP PLAN'}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-300 font-medium">{getLocalizedDestinationName(itinerary.destination, language)}</span>
              {itinerary.start_date && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-slate-300">
                    {itinerary.start_date} {itinerary.end_date ? `→ ${itinerary.end_date}` : ''}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {itinerary.duration_days}-{isHi ? 'दिवसीय यात्रा प्लान' : 'Day Trip Plan'} ({itinerary.fitness_level.toLowerCase()} {isHi ? 'गति' : 'pace'})
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-[#12141d] border border-white/[0.08] p-2.5 rounded-xl shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t('safety_index', language)}</div>
              <div className="text-xs font-bold text-slate-200">
                {itinerary.overall_risk_category} {isHi ? 'स्तर' : 'LEVEL'}
              </div>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="font-mono text-base font-bold text-emerald-400">
                {itinerary.overall_safety_score}
              </span>
            </div>
          </div>
        </div>

        {/* Friendly Destination Advice Banner */}
        <div className="mt-3.5 p-3.5 rounded-xl bg-[#12141d] border border-white/[0.06] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <span>{isHi ? 'उपयोगी यात्रा सुझाव एवं सलाह' : 'Helpful Travel Advice & Tips'}:</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {itinerary.mandatory_safety_advisories.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Day Selector Tabs with Traffic Indicators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {itinerary.days.map((day) => {
          const badge = getRiskBadge(day.day_risk_score);
          const traffic = getTrafficBadge(day.traffic_level);
          const dayTitle = isHi && day.title_hi ? day.title_hi : day.title;
          const isSelected = selectedDay === day.day_number;

          return (
            <button
              key={day.day_number}
              onClick={() => setSelectedDay(day.day_number)}
              className={`btn-tactile flex-1 min-w-[200px] p-3 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#12141d] border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-[#0e1017] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200">
                  {t('day_heading', language)} {day.day_number} {day.date_display ? `• ${day.date_display.split(',')[0]}` : ''}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium border ${traffic.bg}`}>
                  {traffic.label}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium truncate">{dayTitle}</div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1.5">
                <span>{day.distance_km} km</span>
                <span>•</span>
                <span>+{day.elevation_gain_m}m {isHi ? 'चढ़ाई' : 'climb'}</span>
                <span>•</span>
                <span className={`px-1 rounded ${badge.bg}`}>{badge.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      {activeDayPlan && (
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#0e1017] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {isHi && activeDayPlan.title_hi ? activeDayPlan.title_hi : activeDayPlan.title}
                </h2>
                {activeDayPlan.date_display && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-[#12141d] px-2 py-0.5 rounded border border-white/[0.06]">
                    {activeDayPlan.date_display}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeDayPlan.acclimatization_safety}</span>
              </div>
            </div>
          </div>

          {/* Where to Visit Today Suggestion Card */}
          {activeDayPlan.day_highlight && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/30 to-[#12141d] border border-emerald-500/25 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-semibold text-emerald-300">
                  {isHi ? 'आज का दर्शनीय भ्रमण सुझाव' : 'Where to Visit Today'}:
                </span>
                <p className="text-slate-200">
                  {isHi && activeDayPlan.day_highlight_hi ? activeDayPlan.day_highlight_hi : activeDayPlan.day_highlight}
                </p>
              </div>
            </div>
          )}

          {/* Route & Traffic Forecast for the Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Primary Safe Route */}
            <div className="p-3.5 rounded-xl bg-[#12141d] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>{isHi ? 'मुख्य सुरक्षित मार्ग' : 'Primary Safe Route'}</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${getTrafficBadge(activeDayPlan.traffic_level).bg}`}>
                  {isHi && activeDayPlan.traffic_summary_hi ? activeDayPlan.traffic_summary_hi : (activeDayPlan.traffic_summary || 'Normal Traffic Flow')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isHi && activeDayPlan.suggested_route_hi ? activeDayPlan.suggested_route_hi : activeDayPlan.suggested_route}
              </p>
            </div>

            {/* Alternate Route (Less Traffic / Detour Suggestion) */}
            {activeDayPlan.alternate_route && (
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-400" />
                    <span>{isHi ? 'वैकल्पिक मार्ग (कम ट्रैफिक)' : 'Alternate Route (Less Traffic)'}</span>
                  </span>
                  {activeDayPlan.is_alternate_recommended && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      {isHi ? 'अनुशंसित बाईपास' : 'RECOMMENDED BYPASS'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  {isHi && activeDayPlan.alternate_route_hi ? activeDayPlan.alternate_route_hi : activeDayPlan.alternate_route}
                </p>
              </div>
            )}
          </div>

          {/* Detailed Stops, Opening Hours & Best View Timings */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHi ? 'स्थान, खुलने का समय एवं देखने का सर्वोत्तम समय' : 'Stops, Opening Hours & Best View Timings'}:</span>
            </div>

            <div className="relative pl-5 border-l border-white/[0.1] space-y-3.5">
              {activeDayPlan.checkpoints.map((cp, idx) => {
                const badge = getRiskBadge(cp.total_risk_score);
                const cpName = isHi && cp.name_hi ? cp.name_hi : cp.name;
                const opening = isHi && cp.opening_hours_hi ? cp.opening_hours_hi : (cp.opening_hours || '08:00 AM – 06:00 PM');
                const bestTime = isHi && cp.best_view_time_hi ? cp.best_view_time_hi : (cp.best_view_time || '07:30 AM – 10:30 AM');
                const viewTip = isHi && cp.best_view_tip_hi ? cp.best_view_tip_hi : cp.best_view_tip;
                const whyVisit = isHi && cp.why_visit_hi ? cp.why_visit_hi : cp.why_visit;

                return (
                  <div
                    key={cp.checkpoint_id}
                    onClick={() => onSelectCheckpoint && onSelectCheckpoint(cp)}
                    className="relative group cursor-pointer"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[25px] top-3 w-2.5 h-2.5 rounded-full bg-[#090a0f] border-2 border-emerald-400 group-hover:scale-125 transition-transform" />

                    <div className="bg-[#12141d] border border-white/[0.06] group-hover:border-white/[0.14] p-4 rounded-xl transition-all space-y-3">
                      {/* Top Row: Name, Altitude, Risk */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-emerald-400">{idx + 1}.</span>
                          <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">{cpName}</span>
                          {cp.has_oxygen_booth && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1 font-mono">
                              <HeartPulse className="w-3 h-3" />
                              <span>{isHi ? 'ऑक्सीजन सहायता' : 'O2 Support'}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">{cp.altitude_m}m</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* Brief Why Visit Description */}
                      {whyVisit && (
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {whyVisit}
                        </p>
                      )}

                      {/* Timings & Best View Box */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-white/[0.06]">
                        {/* Opening & Closing Hours */}
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div className="text-xs space-y-0.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              {isHi ? 'खुलने व बंद होने का समय' : 'Opening & Closing'}:
                            </span>
                            <div className="text-xs font-medium text-amber-300">
                              {opening}
                            </div>
                          </div>
                        </div>

                        {/* Best View Timing */}
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                          <Sun className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <div className="text-xs space-y-0.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                              {isHi ? 'सर्वोत्तम दृश्य का समय' : 'Best View Timing'}:
                            </span>
                            <div className="text-xs font-medium text-sky-300">
                              {bestTime}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Best View Tip / Lighting */}
                      {viewTip && (
                        <div className="text-[11px] text-slate-300 bg-emerald-950/15 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                          <span className="font-semibold text-emerald-300 shrink-0">{isHi ? 'दृश्यकला टिप:' : 'Scenic Tip:'}</span>
                          <span className="text-slate-300">{viewTip}</span>
                        </div>
                      )}

                      {/* Clean Friendly Facilities Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cp.facilities.map((fac, fIdx) => (
                          <span key={fIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/[0.06] flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            <span>{fac}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Budget Breakdown Summary */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#0e1017] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white tracking-tight">{t('budget_breakdown_title', language)}</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {isHi ? 'कुल अनुमानित खर्च:' : 'Estimated Total:'} ₹{itinerary.budget_breakdown.allocated_total_inr.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
          <div className="bg-[#12141d] p-2.5 rounded-xl border border-white/[0.06]">
            <div className="text-slate-400 text-[10px]">{t('budget_transport', language)}</div>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              ₹{(itinerary.budget_breakdown.categories.local_transit_taxi_inr ?? itinerary.budget_breakdown.categories.transit_taxi_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-[#12141d] p-2.5 rounded-xl border border-white/[0.06]">
            <div className="text-slate-400 text-[10px]">{t('budget_stay', language)}</div>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              ₹{(itinerary.budget_breakdown.categories.accommodation_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-[#12141d] p-2.5 rounded-xl border border-white/[0.06]">
            <div className="text-slate-400 text-[10px]">{t('budget_food', language)}</div>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              ₹{(itinerary.budget_breakdown.categories.food_and_hydration_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-[#12141d] p-2.5 rounded-xl border border-white/[0.06]">
            <div className="text-slate-400 text-[10px]">{isHi ? 'परमिट व प्रवेश शुल्क' : 'Permits & Entry Passes'}</div>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              ₹{(itinerary.budget_breakdown.categories.permits_safari_darshan_inr ?? itinerary.budget_breakdown.categories.porter_mule_optional_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
            <div className="text-emerald-300 text-[10px] font-semibold">{t('budget_emergency', language)}</div>
            <div className="font-mono font-bold text-emerald-400 mt-0.5">
              ₹{(itinerary.budget_breakdown.categories.emergency_medical_reserve_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryView;
