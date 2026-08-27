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
  language?: string;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  userCoords = { lat: 30.6270, lon: 79.0700, altitude_m: 2550 },
  language = 'en',
}) => {
  const [isSending, setIsSending] = useState(false);
  const [dispatchData, setDispatchData] = useState<SOSDispatch | null>(null);
  const [copiedSMS, setCopiedSMS] = useState(false);

  const cachedUser = OfflineCacheService.getUserSession();
  const [victimName, setVictimName] = useState(cachedUser?.name || 'Ramesh Kumar');
  const [victimPhone, setVictimPhone] = useState(cachedUser?.phone || '+91 98765 43210');
  const [medicalNote, setMedicalNote] = useState(
    cachedUser?.bloodGroup
      ? `Blood: ${cachedUser.bloodGroup}. Acute mountain fatigue`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#090a0f]/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-5 sm:p-6 rounded-xl border border-red-500/40 shadow-2xl relative bg-[#0e1017] space-y-4 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="btn-tactile absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md bg-[#12141d] border border-white/[0.08] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08] pr-8">
          <div className="w-9 h-9 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">
              LIFE SAFETY PROTOCOL
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {language === 'hi' ? 'खोज एवं बचाव पैनिक बीकन' : 'Search & Rescue Emergency Beacon'}
            </h2>
          </div>
        </div>

        {/* SOS Telemetry Card */}
        <div className="p-3 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'hi' ? 'जीपीएस निर्देशांक:' : 'Current Telemetry:'}</span>
            </span>
            <span className="font-mono font-semibold text-white">
              {userCoords.lat.toFixed(4)}°N, {userCoords.lon.toFixed(4)}°E ({userCoords.altitude_m}m)
            </span>
          </div>

          {!dispatchData && (
            <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-medium text-slate-400 block mb-1">
                    {language === 'hi' ? 'पर्यटक का नाम' : 'Tourist Name'}
                  </label>
                  <input
                    type="text"
                    value={victimName}
                    onChange={(e) => setVictimName(e.target.value)}
                    className="w-full bg-[#0e1017] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500/60"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-slate-400 block mb-1">
                    {language === 'hi' ? 'मोबाइल नंबर' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={victimPhone}
                    onChange={(e) => setVictimPhone(e.target.value)}
                    className="w-full bg-[#0e1017] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-red-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-400 block mb-1">
                  {language === 'hi' ? 'चिकित्सा विवरण' : 'Medical Distress Notes'}
                </label>
                <input
                  type="text"
                  value={medicalNote}
                  onChange={(e) => setMedicalNote(e.target.value)}
                  className="w-full bg-[#0e1017] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-red-500/60"
                />
              </div>

              <button
                onClick={handleSendSOS}
                disabled={isSending}
                className="btn-tactile w-full py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isSending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>{language === 'hi' ? 'एसओएस भेजा जा रहा है...' : 'Dispatching Emergency SOS...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'आपातकालीन एसओएस भेजें' : 'Broadcast Emergency SOS'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dispatched Confirmation */}
        {dispatchData && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
              <div>
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>BEACON BROADCAST ACTIVE (ID: {dispatchData.sos_id})</span>
                </div>
                <div className="text-[10px] text-emerald-400/90 mt-0.5">
                  Dispatched to SDRF / Coast Guard / State Police
                </div>
              </div>
            </div>

            {/* Nearest Rescue Posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-0.5">
                <div className="text-slate-400 flex items-center gap-1 text-[10px]">
                  <HeartPulse className="w-3 h-3 text-red-400" />
                  <span>Medical Facility</span>
                </div>
                <div className="font-semibold text-white truncate">{dispatchData.nearest_rescue_post.name}</div>
                <div className="text-[10px] text-slate-400">
                  Dist: <span className="font-mono text-sky-300 font-semibold">{dispatchData.nearest_rescue_post.distance_km || 1.2} km</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-0.5">
                <div className="text-slate-400 flex items-center gap-1 text-[10px]">
                  <Building2 className="w-3 h-3 text-sky-400" />
                  <span>Police / SDRF Station</span>
                </div>
                <div className="font-semibold text-white truncate">
                  {(dispatchData as any).nearest_police_post?.name || 'Local Station'}
                </div>
                <div className="text-[10px] text-slate-400">
                  Helpline: <span className="font-mono text-amber-300 font-semibold">112 / 1070</span>
                </div>
              </div>
            </div>

            {/* 140-Char 2G SMS String */}
            <div className="p-3 rounded-lg bg-[#12141d] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300 flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-amber-400" />
                  <span>Offline 2G SMS Payload:</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {dispatchData.sms_fallback_string.length}/140 Chars
                </span>
              </div>

              <div className="p-2 rounded bg-[#0e1017] border border-white/[0.04] font-mono text-[11px] text-amber-200/90 leading-relaxed break-all select-all">
                {dispatchData.sms_fallback_string}
              </div>

              <button
                onClick={handleCopySMS}
                className="btn-tactile w-full py-1.5 px-3 rounded bg-[#181b26] hover:bg-[#202434] text-slate-200 text-xs font-medium border border-white/[0.08] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedSMS ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy 2G SMS Payload</span>
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

export default SOSModal;
