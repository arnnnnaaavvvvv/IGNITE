import React, { useState } from 'react';
import type { ItineraryResponse } from '../../types';
import { Activity, Wallet, Info, HeartPulse, ShieldCheck } from 'lucide-react';
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
    if (score <= 35) return { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: isHi ? 'कम जोखिम' : 'LOW RISK' };
    if (score <= 65) return { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: isHi ? 'सावधानी' : 'ADVISORY' };
    if (score <= 80) return { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: isHi ? 'उच्च जोखिम' : 'HIGH RISK' };
    return { bg: 'bg-red-500/10 text-red-400 border-red-500/20', label: isHi ? 'गंभीर' : 'CRITICAL' };
  };

  return (
    <div className="space-y-4">
      {/* Top Header Card with Overall Score & Summary */}
      <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#0e1017]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isHi ? 'सत्यापित सुरक्षित यात्रा योजना' : 'VERIFIED SAFE TRIP PLAN'}</span>
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
            <h1 className="text-lg font-bold text-white tracking-tight">
              {itinerary.duration_days}-{isHi ? 'दिवसीय सुरक्षित योजना' : 'Day Safe Plan'} ({itinerary.fitness_level} {isHi ? 'गति' : 'Pace'})
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-[#12141d] border border-white/[0.08] p-2.5 rounded-lg">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t('safety_index', language)}</div>
              <div className="text-xs font-bold text-slate-200">
                {itinerary.overall_risk_category} {isHi ? 'स्तर' : 'LEVEL'}
              </div>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <span className="font-mono text-base font-bold text-emerald-400">
                {itinerary.overall_safety_score}
              </span>
            </div>
          </div>
        </div>

        {/* Safety Advisories Banner */}
        <div className="mt-3.5 p-3 rounded-lg bg-[#12141d] border border-white/[0.06] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-sky-300">
              {t('advisories_title', language)} ({itinerary.emergency_agency || (isHi ? 'स्थानीय बचाव दल' : 'Local Rescue Team')}):
            </div>
            <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
              {itinerary.mandatory_safety_advisories.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {itinerary.days.map((day) => {
          const badge = getRiskBadge(day.day_risk_score);
          const dayTitle = isHi && day.title_hi ? day.title_hi : day.title;
          const isSelected = selectedDay === day.day_number;

          return (
            <button
              key={day.day_number}
              onClick={() => setSelectedDay(day.day_number)}
              className={`btn-tactile flex-1 min-w-[180px] p-3 rounded-lg border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#12141d] border-emerald-500/50 shadow-sm'
                  : 'bg-[#0e1017] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-200">
                  {t('day_heading', language)} {day.day_number} {day.date_display ? `• ${day.date_display.split(',')[0]}` : ''}
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate">{dayTitle}</div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1.5">
                <span>{day.distance_km} km</span>
                <span>•</span>
                <span>+{day.elevation_gain_m}m {isHi ? 'चढ़ाई' : 'climb'}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      {activeDayPlan && (
        <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#0e1017] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  {isHi && activeDayPlan.title_hi ? activeDayPlan.title_hi : activeDayPlan.title}
                </h2>
                {activeDayPlan.date_display && (
                  <span className="text-[11px] font-mono text-emerald-400 bg-[#12141d] px-2 py-0.5 rounded border border-white/[0.06]">
                    {activeDayPlan.date_display}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isHi ? 'सुरक्षा व गति:' : 'Pacing & Safety:'} {activeDayPlan.acclimatization_safety}</span>
              </div>
            </div>
          </div>

          {/* Timeline of Checkpoints */}
          <div className="relative pl-5 border-l border-white/[0.1] space-y-4">
            {activeDayPlan.checkpoints.map((cp, idx) => {
              const badge = getRiskBadge(cp.total_risk_score);
              const cpName = isHi && cp.name_hi ? cp.name_hi : cp.name;

              return (
                <div
                  key={cp.checkpoint_id}
                  onClick={() => onSelectCheckpoint && onSelectCheckpoint(cp)}
                  className="relative group cursor-pointer"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[25px] top-2 w-2.5 h-2.5 rounded-full bg-[#090a0f] border-2 border-emerald-400 group-hover:scale-125 transition-transform" />

                  <div className="bg-[#12141d] border border-white/[0.06] group-hover:border-white/[0.14] p-3 rounded-lg transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-semibold text-slate-400">{idx + 1}.</span>
                        <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">{cpName}</span>
                        {cp.has_oxygen_booth && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1 font-mono">
                            <HeartPulse className="w-2.5 h-2.5" />
                            <span>{isHi ? 'ऑक्सीजन बूथ' : 'O2 BOOTH'}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">{cp.altitude_m}m</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium border ${badge.bg}`}>
                          {badge.label} ({cp.total_risk_score})
                        </span>
                      </div>
                    </div>

                    {/* Facilities Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cp.facilities.map((fac, fIdx) => (
                        <span key={fIdx} className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.04] text-slate-300 border border-white/[0.04]">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Budget Breakdown Summary */}
      <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08] bg-[#0e1017] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white tracking-tight">{t('budget_breakdown_title', language)}</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {isHi ? 'कुल अनुमानित खर्च:' : 'Total Allocated:'} ₹{itinerary.budget_breakdown.allocated_total_inr.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
          <div className="bg-[#12141d] p-2.5 rounded-lg border border-white/[0.06]">
            <div className="text-slate-400 text-[10px]">{t('budget_transport', language)}</div>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              ₹{(itinerary.budget_breakdown.categories.local_transit_taxi_inr ?? itinerary.budget_breakdown.categories.transit_taxi_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-[#12141d] p-2.5 rounded-lg border border-white/[0.06]">
            <div className="text-slate-400 text-[10px]">{t('budget_stay', language)}</div>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              ₹{(itinerary.budget_breakdown.categories.accommodation_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-[#12141d] p-2.5 rounded-lg border border-white/[0.06]">
            <div className="text-slate-400 text-[10px]">{t('budget_food', language)}</div>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              ₹{(itinerary.budget_breakdown.categories.food_and_hydration_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-[#12141d] p-2.5 rounded-lg border border-white/[0.06]">
            <div className="text-slate-400 text-[10px]">{isHi ? 'परमिट व प्रवेश शुल्क' : 'Permits & Entry Passes'}</div>
            <div className="font-mono font-semibold text-slate-200 mt-0.5">
              ₹{(itinerary.budget_breakdown.categories.permits_safari_darshan_inr ?? itinerary.budget_breakdown.categories.porter_mule_optional_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/20">
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
