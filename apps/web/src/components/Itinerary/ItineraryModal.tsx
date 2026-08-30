import React, { useState, useEffect } from 'react';
import type { ItineraryResponse, Checkpoint } from '../../types';
import { ItineraryView } from './ItineraryView';
import { ExplainabilityPanel } from '../Explainability/ExplainabilityPanel';
import { ArrowLeft, X, ShieldCheck, Compass, Activity, Loader2, Sparkles, MapPin } from 'lucide-react';
import { t, getLocalizedDestinationName } from '../../services/i18n';

interface ItineraryModalProps {
  isOpen: boolean;
  isLoading: boolean;
  itinerary: ItineraryResponse | null;
  language?: string;
  selectedCheckpoint?: Checkpoint | null;
  onSelectCheckpoint?: (cp: any) => void;
  onClose: () => void;
}

export const ItineraryModal: React.FC<ItineraryModalProps> = ({
  isOpen,
  isLoading,
  itinerary,
  language = 'en',
  selectedCheckpoint,
  onSelectCheckpoint,
  onClose,
}) => {
  const [modalTab, setModalTab] = useState<'itinerary' | 'risk'>('itinerary');
  const isHi = language === 'hi';

  // Listen for Escape key to close full-screen modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset tab on open with new itinerary
  useEffect(() => {
    if (isOpen) {
      setModalTab('itinerary');
    }
  }, [isOpen, itinerary?.destination]);

  if (!isOpen) return null;

  const destinationTitle = itinerary?.destination
    ? getLocalizedDestinationName(itinerary.destination, language)
    : isHi
    ? 'सुरक्षित यात्रा योजना'
    : 'Trip Plan';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#090a0f] text-slate-100 w-full h-full overflow-hidden animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="itinerary-modal-title"
    >
      {/* Full-Screen Top Header Navigation Bar */}
      <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-[#0c0e15]/95 backdrop-blur-md px-3 sm:px-6 lg:px-8 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Back to Map Button & Destination Info */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={onClose}
              aria-label={t('back_to_map', language)}
              className="btn-tactile flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold cursor-pointer shrink-0 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{t('back_to_map', language)}</span>
              <span className="sm:hidden">{isHi ? 'वापस' : 'Back'}</span>
            </button>

            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 hidden md:flex">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {isHi ? 'सत्यापित योजना' : 'VERIFIED PLAN'}
                  </span>
                  {itinerary?.duration_days && (
                    <span className="text-slate-400">
                      • {itinerary.duration_days} {t('days', language)}
                    </span>
                  )}
                  {itinerary?.region_name && (
                    <span className="text-slate-400 hidden lg:inline">
                      • {itinerary.region_name}
                    </span>
                  )}
                </div>
                <h1 id="itinerary-modal-title" className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight truncate">
                  {destinationTitle}
                </h1>
              </div>
            </div>
          </div>

          {/* Right: Tab Switcher & Close (X) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Modal Internal Tabs (when not loading) */}
            {!isLoading && itinerary && (
              <div className="flex items-center bg-[#13151f] p-1 rounded-lg border border-white/10 shadow-inner">
                <button
                  onClick={() => setModalTab('itinerary')}
                  className={`btn-tactile px-3 sm:px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    modalTab === 'itinerary'
                      ? 'bg-emerald-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{t('modal_tab_itinerary', language)}</span>
                </button>

                <button
                  onClick={() => setModalTab('risk')}
                  className={`btn-tactile px-3 sm:px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    modalTab === 'risk'
                      ? 'bg-emerald-600 text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{t('modal_tab_risk', language)}</span>
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label={t('close', language)}
              className="btn-tactile p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-6 w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          {isLoading ? (
            /* Non-blocking Full-Screen Skeleton Loader */
            <div className="space-y-6 py-6 animate-in fade-in">
              <div className="flex items-center justify-center gap-2.5 text-emerald-400 text-sm font-semibold py-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('btn_generating', language)}</span>
              </div>

              {/* Header Skeleton */}
              <div className="p-6 rounded-2xl bg-[#12141d]/70 border border-white/10 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-white/10 rounded" />
                    <div className="h-7 w-80 bg-white/15 rounded" />
                  </div>
                  <div className="h-12 w-28 bg-white/10 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="h-16 bg-white/5 rounded-xl" />
                  <div className="h-16 bg-white/5 rounded-xl" />
                  <div className="h-16 bg-white/5 rounded-xl" />
                  <div className="h-16 bg-white/5 rounded-xl" />
                </div>
              </div>

              {/* Day Cards Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                <div className="p-5 rounded-2xl bg-[#12141d]/50 border border-white/10 space-y-3">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="h-5 w-44 bg-white/15 rounded" />
                  <div className="h-3 w-32 bg-white/10 rounded" />
                  <div className="h-20 bg-white/5 rounded-xl" />
                </div>
                <div className="p-5 rounded-2xl bg-[#12141d]/50 border border-white/10 space-y-3">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="h-5 w-44 bg-white/15 rounded" />
                  <div className="h-3 w-32 bg-white/10 rounded" />
                  <div className="h-20 bg-white/5 rounded-xl" />
                </div>
                <div className="p-5 rounded-2xl bg-[#12141d]/50 border border-white/10 space-y-3 hidden md:block">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="h-5 w-44 bg-white/15 rounded" />
                  <div className="h-3 w-32 bg-white/10 rounded" />
                  <div className="h-20 bg-white/5 rounded-xl" />
                </div>
              </div>
            </div>
          ) : itinerary ? (
            <>
              {/* Tab 1: Trip Plan View */}
              {modalTab === 'itinerary' && (
                <ItineraryView
                  itinerary={itinerary}
                  language={language}
                  onSelectCheckpoint={(cp) => {
                    if (onSelectCheckpoint) onSelectCheckpoint(cp);
                    setModalTab('risk');
                  }}
                />
              )}

              {/* Tab 2: Safety Check & Risk Guide */}
              {modalTab === 'risk' && (
                <ExplainabilityPanel
                  subScores={
                    selectedCheckpoint?.sub_scores ||
                    itinerary?.days?.[0]?.checkpoints?.[0]?.sub_scores ||
                    undefined
                  }
                  checkpointName={getLocalizedDestinationName(
                    selectedCheckpoint?.name || itinerary?.destination || '',
                    language
                  )}
                  totalScore={
                    selectedCheckpoint?.total_risk_score ||
                    itinerary?.overall_safety_score ||
                    25
                  }
                  explanationText={
                    itinerary?.explainability?.summary_text ||
                    (isHi
                      ? 'मार्ग सुरक्षा को स्थानीय आपदा प्रबंधन नियमों के साथ सत्यापित किया गया है।'
                      : 'Route safety verified with regional multi-agency precautions.')
                  }
                  language={language}
                  regionType={itinerary?.region_type}
                  regionName={itinerary?.region_name}
                />
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm bg-[#12141d]/50 rounded-2xl border border-white/10">
              <MapPin className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p>{t('no_itinerary_title', language)}</p>
              <button
                onClick={onClose}
                className="mt-4 btn-tactile px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
              >
                {t('btn_go_map', language)}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ItineraryModal;
