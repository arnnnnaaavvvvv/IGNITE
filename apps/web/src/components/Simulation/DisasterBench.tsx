import React from 'react';
import type { SimulationScenario } from '../../types';
import { AlertTriangle, CloudLightning, CheckCircle, Zap, Navigation } from 'lucide-react';

interface DisasterBenchProps {
  scenarios: SimulationScenario[];
  onTriggerScenario: (scenario: SimulationScenario) => void;
  activeScenarioId?: string;
  isSimulating: boolean;
  rerouteData?: any;
}

export const DisasterBench: React.FC<DisasterBenchProps> = ({
  scenarios,
  onTriggerScenario,
  activeScenarioId,
  isSimulating,
  rerouteData,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
                PAN-INDIA DISASTER BENCH & STRESS TESTER
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Multi-Region Hazard Simulator</span>
            </div>
            <h2 className="text-lg font-bold text-white">Dynamic Incident & Regional Evacuation Bench</h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">System State:</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-bold border ${
              isSimulating
                ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {isSimulating ? '⚡ HAZARD ACTIVE' : '✓ NORMAL TELEMETRY'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-4 leading-relaxed">
          Inject real-time extreme meteorological and geological events across different Indian environmental zones (Himalayan cloudbursts, Bay of Bengal cyclones, Brahmaputra river floods, Thar Desert heatwaves) to demonstrate how the adaptive risk engine triggers automatic rerouting.
        </p>
      </div>

      {/* Scenario Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((sc) => {
          const isActive = activeScenarioId === sc.id;
          const isCritical = sc.expected_risk_category === 'CRITICAL';
          const isHigh = sc.expected_risk_category === 'HIGH';

          return (
            <div
              key={sc.id}
              className={`glass-panel p-5 rounded-2xl border transition-all relative overflow-hidden ${
                isActive
                  ? isCritical
                    ? 'border-red-500 bg-red-950/20 shadow-2xl glass-panel-glow-red'
                    : 'border-orange-500 bg-orange-950/20 shadow-2xl glass-panel-glow-orange'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isCritical
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : isHigh
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isCritical ? <CloudLightning className="w-5 h-5" /> : isHigh ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{sc.title}</h3>
                    <div className="text-[11px] text-slate-400">{sc.title_hi}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                    isCritical
                      ? 'bg-red-500/20 text-red-300 border-red-500/50'
                      : isHigh
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {sc.expected_risk_category}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">{sc.region_type}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 my-3 leading-relaxed">
                {sc.description}
              </p>

              {/* Weather parameters pill bar */}
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-400 mb-4 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <span>Rain: {sc.weather.precipitation_mm_hr}mm/h</span>
                <span>•</span>
                <span>Wind: {sc.weather.wind_speed_kmh}km/h</span>
                <span>•</span>
                <span>Temp: {sc.weather.temperature_c}°C</span>
                <span>•</span>
                <span className={sc.weather.imd_alert === 'RED' ? 'text-red-400 font-bold' : sc.weather.imd_alert === 'ORANGE' ? 'text-orange-400 font-bold' : 'text-emerald-400'}>
                  IMD: {sc.weather.imd_alert}
                </span>
              </div>

              <button
                onClick={() => onTriggerScenario(sc)}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isActive
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isActive ? (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Scenario Active in System</span>
                  </>
                ) : (
                  <>
                    <PlayScenarioIcon />
                    <span>Inject This Multi-Region Hazard</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Real-time Dynamic Reroute Evaluation Output Card */}
      {rerouteData && (
        <div className="glass-panel p-6 rounded-2xl border border-orange-500/40 shadow-2xl bg-slate-900/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Dynamic Reroute & Evacuation Directive ({rerouteData.destination})</h3>
                <div className="text-[11px] text-slate-400 font-mono">Action: {rerouteData.action_type} • Region: {rerouteData.region_type}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Computed Risk:</span>
              <span className="font-mono text-sm font-black text-red-400">
                {rerouteData.current_risk_score}/100 ({rerouteData.risk_level})
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-800/60 text-xs text-orange-200 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-orange-300">
              <AlertTriangle className="w-4 h-4" />
              <span>Safety Dispatch Instructions:</span>
            </div>
            <p className="leading-relaxed">{rerouteData.instructions}</p>
            {rerouteData.instructions_hi && (
              <p className="leading-relaxed text-orange-300/90 italic font-sans">{rerouteData.instructions_hi}</p>
            )}
          </div>

          {rerouteData.nearest_shelter && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Assigned Emergency Shelter</div>
                <div className="font-bold text-white mt-0.5 truncate">{rerouteData.nearest_shelter.name}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Distance to Shelter</div>
                <div className="font-mono font-bold text-cyan-400 mt-0.5">{rerouteData.nearest_shelter.distance_m || 480} meters</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px]">Emergency Shelter Helpline</div>
                <div className="font-mono font-bold text-amber-400 mt-0.5">{rerouteData.nearest_shelter.contact_phone || '112'}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PlayScenarioIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
