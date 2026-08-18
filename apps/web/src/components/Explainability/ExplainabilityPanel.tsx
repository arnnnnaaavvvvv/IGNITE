import React, { useState } from 'react';
import type { SubScores, RegionType } from '../../types';
import { Volume2, ShieldCheck, Activity } from 'lucide-react';

interface ExplainabilityPanelProps {
  subScores?: SubScores;
  checkpointName?: string;
  totalScore?: number;
  explanationText?: string;
  language?: string;
  regionType?: RegionType;
  regionName?: string;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  subScores = {},
  checkpointName = 'Current Sector Landmark',
  totalScore = 25.0,
  explanationText = 'Safety profile verified against national multi-agency hazard models.',
  language = 'en',
  regionName = 'Himalayan Hill Mountain',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(explanationText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const scoreBar = (score: number, max: number = 100) => {
    let color = 'bg-emerald-500';
    if (score > 65) color = 'bg-red-500';
    else if (score > 35) color = 'bg-amber-500';

    return (
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
        <div
          className={`h-full ${color} transition-all duration-500 rounded-full`}
          style={{ width: `${Math.min(100, (score / max) * 100)}%` }}
        />
      </div>
    );
  };

  const subScoreEntries = Object.entries(subScores);

  return (
    <div className="space-y-6">
      {/* Top Banner Card with Natural Language Explanation & TTS */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                REGION-ADAPTIVE SAFETY MATRIX
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{regionName}</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Mathematical Risk Reasoning ({checkpointName})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeak}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-red-500/20 text-red-300 border-red-500/50 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>{isSpeaking ? 'Stop Audio' : 'Voice Advisory'}</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-slate-400 font-semibold">Total Risk:</span>
              <span className="font-mono text-sm font-black text-emerald-400">{totalScore}/100</span>
            </div>
          </div>
        </div>

        {/* Explainability Natural Language Narrative */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-300 mb-1">Safety Reasoning & Analysis:</div>
            <p className="text-xs leading-relaxed text-slate-300 font-sans">{explanationText}</p>
          </div>
        </div>
      </div>

      {/* Dynamic 5-Factor Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subScoreEntries.length > 0 ? (
          subScoreEntries.map(([key, item]) => (
            <div key={key} className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">{item.label}</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">{item.score}/100</span>
              </div>
              {scoreBar(item.score)}
              <div className="mt-3 text-xs text-slate-400">
                <span className="font-mono text-slate-300">{item.details}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
            Select an itinerary waypoint to inspect exact regional risk factor gauges.
          </div>
        )}
      </div>
    </div>
  );
};
