import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  HeartPulse,
  LogOut,
  Copy,
  Check,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../services/i18n';

interface UserProfileModalProps {
  language?: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ language = 'en' }) => {
  const {
    user,
    isProfileModalOpen,
    closeProfileModal,
    logout,
    updateEmergencyProfile,
    updateUserProfile,
  } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [isCopiedUID, setIsCopiedUID] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      if (user.emergencyProfile) {
        setEmergencyName(user.emergencyProfile.emergencyContactName || '');
        setEmergencyPhone(user.emergencyProfile.emergencyContactPhone || '');
        setBloodGroup(user.emergencyProfile.bloodGroup || 'O+');
        setMedicalConditions(user.emergencyProfile.medicalConditions || '');
      }
    }
  }, [user, isProfileModalOpen]);

  if (!isProfileModalOpen || !user) return null;

  const handleCopyUID = () => {
    navigator.clipboard.writeText(user.uid);
    setIsCopiedUID(true);
    setTimeout(() => setIsCopiedUID(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (displayName.trim() && displayName !== user.displayName) {
        await updateUserProfile(displayName);
      }
      updateEmergencyProfile({
        emergencyContactName: emergencyName.trim(),
        emergencyContactPhone: emergencyPhone.trim(),
        bloodGroup,
        medicalConditions: medicalConditions.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Error saving profile:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Avatar initials generator
  const getInitials = () => {
    if (user.displayName) {
      const parts = user.displayName.split(' ');
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'GT';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#07141F] border border-[#1E3440] shadow-2xl p-6 sm:p-7 overflow-hidden text-[#F1F5F9] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeProfileModal}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F1F5F9] p-1.5 rounded-lg hover:bg-[#1E3440]/60 transition-colors cursor-pointer"
          aria-label="Close profile dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Identity Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#1E3440]">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              className="w-16 h-16 rounded-full border-2 border-[#10B981]/50 object-cover shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 border border-[#10B981]/50 flex items-center justify-center text-white text-xl font-bold shadow-md">
              {getInitials()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white truncate font-sans">
                {user.displayName || (user.isAnonymous ? 'Guest Explorer' : 'Verified Tourist')}
              </h3>
              {user.isAnonymous ? (
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {t('auth_guest_badge', language)}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-emerald-950/80 text-[#34D399] border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#34D399]" />
                  {t('auth_verified_badge', language)}
                </span>
              )}
            </div>

            <p className="text-xs text-[#94A3B8] truncate mt-0.5">
              {user.email || 'Temporary guest tourist session'}
            </p>

            {/* UID Copy snippet */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-mono text-slate-400 bg-[#0D202B] px-2 py-0.5 rounded border border-[#1E3440] truncate max-w-[200px]">
                UID: {user.uid}
              </span>
              <button
                type="button"
                onClick={handleCopyUID}
                className="text-slate-400 hover:text-emerald-400 p-0.5 transition-colors cursor-pointer"
                title="Copy UID"
              >
                {isCopiedUID ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="mt-4 p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Profile and emergency preferences saved successfully!</span>
          </div>
        )}

        {/* Emergency & Trekker Settings Form */}
        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#34D399]">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span>{t('auth_emergency_profile', language)}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('auth_name', language)}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tourist Name"
                  className="w-full pl-9 pr-3 py-2 bg-[#0D202B] border border-[#1E3440] focus:border-[#10B981] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('auth_blood_group', language)}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D202B] border border-[#1E3440] focus:border-[#10B981] rounded-xl text-xs sm:text-sm text-white outline-none cursor-pointer"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('auth_emergency_contact_name', language)}
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="Next-of-kin or Group Leader"
                className="w-full px-3 py-2 bg-[#0D202B] border border-[#1E3440] focus:border-[#10B981] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('auth_emergency_phone', language)}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#94A3B8]" />
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 bg-[#0D202B] border border-[#1E3440] focus:border-[#10B981] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Medical Conditions / High-Altitude Allergies
            </label>
            <input
              type="text"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              placeholder="e.g. Asthma, Penicillin allergy, prone to AMS"
              className="w-full px-3 py-2 bg-[#0D202B] border border-[#1E3440] focus:border-[#10B981] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
            />
            <p className="text-[11px] text-[#94A3B8] mt-1">
              This medical information is securely passed to SDRF / ITBP rescue teams when triggering SOS.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={logout}
              className="btn-tactile px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 hover:text-red-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('auth_logout', language)}</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="btn-tactile px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#07141F] text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('auth_save_profile', language)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileModal;
