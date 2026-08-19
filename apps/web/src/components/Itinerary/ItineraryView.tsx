import React, { useState } from 'react';
import type { ItineraryResponse } from '../../types';
import { Activity, Wallet, Info, HeartPulse } from 'lucide-react';

interface ItineraryViewProps {
  itinerary: ItineraryResponse;
  onSelectCheckpoint?: (cp: any) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, onSelectCheckpoint }) => {
  const [selectedDay, setSelectedDay] = useState(1);

  const activeDayPlan = itinerary.days.find((d) => d.day_number === selectedDay) || itinerary.days[0];

  const getRiskBadge = (score: number) => {
    if (score <= 35) return { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', label: 'LOW RISK' };
    if (score <= 65) return { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30', label: 'ADVISORY' };
    if (score <= 80) return { bg: 'bg-orange-500/15 text-orange-400 border-orange-500/30', label: 'HIGH RISK' };
    return { bg: 'bg-red-500/20 text-red-400 border-red-500/40', label: 'CRITICAL' };
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card with Overall Score & Logistics Summary */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                VERIFIED SAFE ITINERARY
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{itinerary.destination} Corridor</span>
              {itinerary.start_date && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    📅 {itinerary.start_date} {itinerary.end_date ? `➔ ${itinerary.end_date}` : ''}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-xl font-black text-white">
              {itinerary.duration_days}-Day Acclimatized Route Plan ({itinerary.fitness_level} Pace)
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Aggregate Safety</div>
              <div className="text-xs font-bold text-slate-200">
                {itinerary.overall_risk_category} RISK PROFILE
              </div>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="font-mono text-lg font-black text-emerald-400">
                {itinerary.overall_safety_score}
              </span>
            </div>
          </div>
        </div>

        {/* Mandatory Safety Advisories Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <div className="font-bold text-cyan-300">
              Mandatory {itinerary.emergency_agency || 'Regional Safety Authority'} Directives:
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
          return (
            <button
              key={day.day_number}
              onClick={() => setSelectedDay(day.day_number)}
              className={`flex-1 min-w-[200px] p-3.5 rounded-xl border text-left transition-all ${
                selectedDay === day.day_number
                  ? 'bg-slate-900 border-emerald-500/60 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200">
                  Day {day.day_number} {day.date_display ? `• ${day.date_display.split(',')[0]}` : ''}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${badge.bg}`}>
                  Score: {day.day_risk_score}
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium truncate">{day.title}</div>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-2">
                <span>{day.distance_km} km</span>
                <span>+{day.elevation_gain_m}m ascent</span>
                {day.date && <span className="text-slate-400">{day.date}</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      {activeDayPlan && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{activeDayPlan.title}</h2>
                {activeDayPlan.date_display && (
                  <span className="text-xs font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    {activeDayPlan.date_display}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Acclimatization: {activeDayPlan.acclimatization_safety}</span>
              </div>
            </div>
          </div>

          {/* Timeline of Checkpoints */}
          <div className="relative pl-6 border-l border-slate-800 space-y-6">
            {activeDayPlan.checkpoints.map((cp, idx) => {
              const badge = getRiskBadge(cp.total_risk_score);
              return (
                <div
                  key={cp.checkpoint_id}
                  onClick={() => onSelectCheckpoint && onSelectCheckpoint(cp)}
                  className="relative group cursor-pointer"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-emerald-500 group-hover:scale-125 transition-transform" />

                  <div className="glass-panel bg-slate-900/70 border border-slate-800/90 group-hover:border-slate-700 p-4 rounded-xl transition-all shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{idx + 1}.</span>
                        <span className="text-sm font-bold text-white">{cp.name}</span>
                        {cp.has_oxygen_booth && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 font-mono">
                            <HeartPulse className="w-3 h-3" />
                            <span>O2 BOOTH</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">{cp.altitude_m}m</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${badge.bg}`}>
                          {badge.label} ({cp.total_risk_score})
                        </span>
                      </div>
                    </div>

                    {/* Facilities pill tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {cp.facilities.map((fac, fIdx) => (
                        <span key={fIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
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
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Regulated Budget Breakdown</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            Total Allocated: ₹{itinerary.budget_breakdown.allocated_total_inr.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Transit / Local Transport</div>
            <div className="font-mono font-bold text-slate-200 mt-1">
              ₹{(itinerary.budget_breakdown.categories.local_transit_taxi_inr ?? itinerary.budget_breakdown.categories.transit_taxi_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Lodging & Homestay</div>
            <div className="font-mono font-bold text-slate-200 mt-1">
              ₹{(itinerary.budget_breakdown.categories.accommodation_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Food & Hydration</div>
            <div className="font-mono font-bold text-slate-200 mt-1">
              ₹{(itinerary.budget_breakdown.categories.food_and_hydration_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[11px]">Permits & Entry Passes</div>
            <div className="font-mono font-bold text-slate-200 mt-1">
              ₹{(itinerary.budget_breakdown.categories.permits_safari_darshan_inr ?? itinerary.budget_breakdown.categories.porter_mule_optional_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/60">
            <div className="text-emerald-300 text-[11px] font-bold">15% Emergency Reserve</div>
            <div className="font-mono font-bold text-emerald-400 mt-1">
              ₹{(itinerary.budget_breakdown.categories.emergency_medical_reserve_inr ?? 0).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
