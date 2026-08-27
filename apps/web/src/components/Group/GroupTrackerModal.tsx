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
  language?: string;
}

export const GroupTrackerModal: React.FC<GroupTrackerModalProps> = ({
  destinationName = 'Active Destination',
  leaderLocation = { lat: 28.6139, lon: 77.2090, altitude_m: 210 },
  language = 'en',
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
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="glass-panel p-4 sm:p-5 rounded-xl border border-white/[0.08]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                {language === 'hi' ? 'परिवार एवं समूह मेश रडार' : 'FAMILY & GROUP MESH RADAR'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{destinationName}</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {language === 'hi' ? 'रीयल-टाइम सदस्य ट्रैकिंग' : 'Real-Time Group Telemetry & Separation Radar'}
            </h2>
          </div>

          <button
            onClick={simulateGroupSync}
            disabled={simulatingMove}
            className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#12141d] hover:bg-[#181b26] text-emerald-300 border border-emerald-500/30 text-xs font-medium cursor-pointer"
          >
            <Radio className={`w-3.5 h-3.5 ${simulatingMove ? 'animate-spin' : ''}`} />
            <span>{simulatingMove ? (language === 'hi' ? 'सिंक हो रहा है...' : 'Syncing...') : (language === 'hi' ? 'मेश सिंक करें' : 'Poll Telemetry')}</span>
          </button>
        </div>

        {/* Separation Warning Banner */}
        {groupData.separated_count > 0 ? (
          <div className="mt-3 p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 space-y-0.5">
              <div className="font-semibold text-amber-300">
                SEPARATION ALERT: {groupData.separated_count} member(s) straggling &gt; {groupData.threshold_m}m from leader!
              </div>
              <p className="text-slate-300">
                Rajesh Verma has fallen 185m behind in the {destinationName} corridor. Regroup at the next safe post.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>All group members are within the safe 150m boundary formation.</span>
          </div>
        )}
      </div>

      {/* Leader & Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Leader Card */}
        <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 bg-[#12141d]">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Arnav Sharma</div>
                <div className="text-[10px] text-emerald-400 font-mono">LEADER</div>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 font-mono">
              0.0m
            </span>
          </div>
          <div className="text-xs text-slate-400 space-y-0.5 font-mono">
            <div className="flex justify-between">
              <span>Altitude:</span>
              <span className="text-white">2,730m</span>
            </div>
            <div className="flex justify-between">
              <span>Battery:</span>
              <span className="text-emerald-400 font-semibold">88%</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-emerald-400">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Members Cards */}
        {groupData.members.map((m) => (
          <div
            key={m.user_id}
            className={`glass-panel p-4 rounded-xl border transition-all ${
              m.is_separated
                ? 'border-red-500/40 bg-red-950/15'
                : 'border-white/[0.06] bg-[#12141d]'
            }`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                  m.is_separated ? 'bg-red-500/10 text-red-400' : 'bg-[#0e1017] text-slate-300'
                }`}>
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white truncate max-w-[110px]">{m.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{m.role}</div>
                </div>
              </div>

              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                m.is_separated ? 'bg-red-500/15 text-red-300 border border-red-500/30' : 'bg-[#0e1017] text-slate-300'
              }`}>
                {m.distance_from_leader_m}m
              </span>
            </div>

            <div className="text-xs text-slate-400 space-y-0.5 font-mono">
              <div className="flex justify-between">
                <span>Altitude:</span>
                <span className="text-white">{m.altitude_m}m</span>
              </div>
              <div className="flex justify-between">
                <span>Battery:</span>
                <span className={m.battery_pct < 40 ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                  {m.battery_pct}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Mesh:</span>
                <span className={m.is_separated ? 'text-red-400 font-semibold' : 'text-emerald-400'}>
                  {m.is_separated ? 'SEPARATED' : 'FORMATION'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupTrackerModal;
