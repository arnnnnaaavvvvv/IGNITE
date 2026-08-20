import React, { useState } from 'react';
import { User, AlertTriangle, ShieldCheck, Radio } from 'lucide-react';

interface GroupMember {
  user_id: string;
  name: string;
  role: string;
  lat: number;
  lon: number;
  altitude_m: number;
  battery_pct: number;
  distance_from_leader_m: number;
  is_separated: boolean;
  status: string;
}

interface GroupTrackerModalProps {
  destinationName?: string;
  leaderLocation?: { lat: number; lon: number; altitude_m?: number };
}

export const GroupTrackerModal: React.FC<GroupTrackerModalProps> = ({
  destinationName = 'Active Destination',
  leaderLocation = { lat: 28.6139, lon: 77.2090, altitude_m: 210 },
}) => {
  const [groupData, setGroupData] = useState<{
    total_members: number;
    separated_count: number;
    group_status: string;
    threshold_m: number;
    members: GroupMember[];
  }>({
    total_members: 4,
    separated_count: 1,
    group_status: 'SCATTERED_WARNING',
    threshold_m: 150.0,
    members: [
      {
        user_id: 'usr_1',
        name: 'Pooja Sharma',
        role: 'MEMBER',
        lat: leaderLocation.lat + 0.0002,
        lon: leaderLocation.lon + 0.0003,
        altitude_m: (leaderLocation.altitude_m || 200) + 5,
        battery_pct: 68,
        distance_from_leader_m: 35.4,
        is_separated: false,
        status: 'IN_FORMATION',
      },
      {
        user_id: 'usr_2',
        name: 'Rajesh Verma (Elderly)',
        role: 'MEMBER',
        lat: leaderLocation.lat - 0.0015,
        lon: leaderLocation.lon - 0.0012,
        altitude_m: (leaderLocation.altitude_m || 200) - 20,
        battery_pct: 32,
        distance_from_leader_m: 185.0,
        is_separated: true,
        status: 'SEPARATED_ALERT',
      },
      {
        user_id: 'usr_3',
        name: 'Amit Patel',
        role: 'MEMBER',
        lat: leaderLocation.lat + 0.0005,
        lon: leaderLocation.lon - 0.0002,
        altitude_m: leaderLocation.altitude_m || 200,
        battery_pct: 82,
        distance_from_leader_m: 42.1,
        is_separated: false,
        status: 'IN_FORMATION',
      },
    ],
  });

  const [simulatingMove, setSimulatingMove] = useState(false);

  const simulateGroupSync = async () => {
    setSimulatingMove(true);
    try {
      const res = await fetch('/api/v1/group/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: `trip_${destinationName.toLowerCase().replace(/\s+/g, '_')}`,
          leader_location: { lat: leaderLocation.lat, lon: leaderLocation.lon },
          separation_threshold_m: 150.0,
        }),
      });
      const data = await res.json();
      setGroupData(data);
    } catch (err) {
      console.error('Group sync error:', err);
    } finally {
      setTimeout(() => setSimulatingMove(false), 600);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400">
                FAMILY & GROUP MESH RADAR
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{destinationName} Travel Squad</span>
            </div>
            <h2 className="text-lg font-bold text-white">Real-Time Member Tracking & Separation Alerts</h2>
          </div>

          <button
            onClick={simulateGroupSync}
            disabled={simulatingMove}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all cursor-pointer"
          >
            <Radio className={`w-3.5 h-3.5 ${simulatingMove ? 'animate-spin' : 'animate-pulse'}`} />
            <span>{simulatingMove ? 'Syncing...' : 'Poll Mesh Telemetry'}</span>
          </button>
        </div>

        {/* Separation Warning Banner */}
        {groupData.separated_count > 0 ? (
          <div className="mt-4 p-4 rounded-xl bg-orange-950/40 border border-orange-500/50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-xs text-orange-200 space-y-1">
              <div className="font-bold text-orange-300">
                SEPARATION ALERT: {groupData.separated_count} member(s) straggling &gt; {groupData.threshold_m}m from leader!
              </div>
              <p className="text-slate-300">
                Rajesh Verma has fallen 185m behind in the {destinationName} corridor. Regroup and halt at the next safe post to prevent team fragmentation.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center gap-2.5 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All group members are within the safe 150m boundary formation.</span>
          </div>
        )}
      </div>

      {/* Leader & Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Leader Card */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/40 bg-slate-900/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Arnav Sharma</div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">GROUP LEADER</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              0.0m
            </span>
          </div>
          <div className="text-xs text-slate-400 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Altitude:</span>
              <span className="text-white">2,730m</span>
            </div>
            <div className="flex justify-between">
              <span>Battery:</span>
              <span className="text-emerald-400 font-bold">88%</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-emerald-400">ACTIVE BEACON</span>
            </div>
          </div>
        </div>

        {/* Members Cards */}
        {groupData.members.map((m) => (
          <div
            key={m.user_id}
            className={`glass-panel p-5 rounded-2xl border transition-all ${
              m.is_separated
                ? 'border-red-500/60 bg-red-950/20 shadow-lg shadow-red-950/40'
                : 'border-slate-800 bg-slate-900/60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  m.is_separated ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white truncate max-w-[110px]">{m.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{m.role}</div>
                </div>
              </div>

              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                m.is_separated ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse' : 'bg-slate-800 text-slate-300'
              }`}>
                {m.distance_from_leader_m}m
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Altitude:</span>
                <span className="text-white">{m.altitude_m}m</span>
              </div>
              <div className="flex justify-between">
                <span>Battery:</span>
                <span className={m.battery_pct < 40 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                  {m.battery_pct}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Mesh Status:</span>
                <span className={m.is_separated ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {m.is_separated ? 'SEPARATED' : 'IN FORMATION'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
