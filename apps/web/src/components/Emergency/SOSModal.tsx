import React, { useState } from 'react';
import type { SOSDispatch } from '../../types';
import {
  ShieldAlert,
  Radio,
  PhoneCall,
  MapPin,
  HeartPulse,
  Copy,
  Check,
  X,
  Send,
  Building2,
} from 'lucide-react';
import { OfflineCacheService } from '../../services/offlineCache';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoords?: { lat: number; lon: number; altitude_m: number };
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  userCoords = { lat: 30.6270, lon: 79.0700, altitude_m: 2550 },
}) => {
  const [isSending, setIsSending] = useState(false);
  const [dispatchData, setDispatchData] = useState<SOSDispatch | null>(null);
  const [copiedSMS, setCopiedSMS] = useState(false);

  const cachedUser = OfflineCacheService.getUserSession();
  const [victimName, setVictimName] = useState(cachedUser?.name || 'Ramesh Kumar');
  const [victimPhone, setVictimPhone] = useState(cachedUser?.phone || '+91 98765 43210');
  const [medicalNote, setMedicalNote] = useState(
    cachedUser?.bloodGroup
      ? `Blood: ${cachedUser.bloodGroup}. Acute mountain fatigue / distress`
      : 'Suspected acute hypothermia & exhaustion'
  );

  if (!isOpen) return null;

  const handleSendSOS = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/v1/emergency/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: victimName,
          user_phone: victimPhone,
          latitude: userCoords.lat,
          longitude: userCoords.lon,
          altitude_m: userCoords.altitude_m,
          medical_condition: medicalNote,
          battery_level_percent: 18,
          emergency_contacts: ['+91-9811122233', '+91-9922334455'],
        }),
      });
      const data: SOSDispatch = await res.json();
      setDispatchData(data);
    } catch (err) {
      console.error('Failed to trigger emergency SOS:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopySMS = () => {
    if (dispatchData?.sms_fallback_string) {
      navigator.clipboard.writeText(dispatchData.sms_fallback_string);
      setCopiedSMS(true);
      setTimeout(() => setCopiedSMS(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl p-6 rounded-3xl border border-red-500/60 shadow-2xl relative bg-slate-950/95 animate-in fade-in zoom-in duration-200 space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800/80">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500 flex items-center justify-center text-red-400 animate-pulse">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-red-400">
                CRITICAL LIFE SAFETY PROTOCOL
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 font-mono border border-red-800">
                OVERPASS DISPATCH
              </span>
            </div>
            <h2 className="text-lg font-black text-white">Universal Search & Rescue Panic Beacon</h2>
          </div>
        </div>

        {/* SOS Telemetry Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Current GPS Telemetry:</span>
            </span>
            <span className="font-mono font-bold text-white">
              {userCoords.lat.toFixed(4)}°N, {userCoords.lon.toFixed(4)}°E ({userCoords.altitude_m}m)
            </span>
          </div>

          {!dispatchData && (
            <div className="space-y-3 pt-2 border-t border-slate-800/60">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Tourist Name</label>
                  <input
                    type="text"
                    value={victimName}
                    onChange={(e) => setVictimName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={victimPhone}
                    onChange={(e) => setVictimPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Medical Notes / Observed Distress
                </label>
                <input
                  type="text"
                  value={medicalNote}
                  onChange={(e) => setMedicalNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <button
                onClick={handleSendSOS}
                disabled={isSending}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-red-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                {isSending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Querying Overpass Emergency Grid & Dispatching SOS...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Broadcast Emergency SOS to Response Grid</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dispatched Confirmation & Nearest Overpass Rescue Posts */}
        {dispatchData && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between">
              <div>
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Radio className="w-4 h-4" />
                  <span>BEACON BROADCAST ACTIVE (ID: {dispatchData.sos_id})</span>
                </div>
                <div className="text-[11px] text-emerald-400/90 mt-0.5">
                  Dispatched to SDRF / Coast Guard / State Police Command
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-700">
                ALPHA-1 PRIORITY
              </span>
            </div>

            {/* Nearest Overpass Hospital & Police Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                  <span>Nearest Medical Facility (Overpass)</span>
                </div>
                <div className="font-bold text-white truncate">{dispatchData.nearest_rescue_post.name}</div>
                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Distance:</span>
                  <span className="font-mono font-bold text-cyan-300">
                    {dispatchData.nearest_rescue_post.distance_km || 1.2} km
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <Building2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Nearest Police / SDRF Station</span>
                </div>
                <div className="font-bold text-white truncate">
                  {(dispatchData as any).nearest_police_post?.name || 'Local Police Station'}
                </div>
                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Helpline:</span>
                  <span className="font-mono font-bold text-amber-300">112 / 1070</span>
                </div>
              </div>
            </div>

            {/* 140-Character Offline 2G GSM SMS Fallback String Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  <span>Offline 140-Char 2G GSM SMS Fallback:</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  {dispatchData.sms_fallback_string.length}/140 Chars
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-200/90 leading-relaxed break-all select-all">
                {dispatchData.sms_fallback_string}
              </div>

              <button
                onClick={handleCopySMS}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedSMS ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied to Clipboard for SMS Transmission</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy 140-Char 2G SMS Payload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
