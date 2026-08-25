import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Compass,
  ShieldCheck,
  Activity,
  Radio,
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  CloudRain,
  PhoneCall,
  WifiOff,
  Volume2,
  ExternalLink,
  Code2,
  Layers,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { IgniteLogo } from '../Common/IgniteLogo';
import {
  fadeUpVariant,
  staggerContainerVariant,
  staggerItemVariant,
  pathDrawVariant,
  slideInToastVariant,
} from '../../utils/animations';

interface LandingPageProps {
  onLaunchApp: () => void;
  onSelectDestination?: (dest: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const shouldReduceMotion = useReducedMotion();

  // Problem Section: Toggle between Legacy vs IGNITE
  const [problemComparison, setProblemComparison] = useState<'legacy' | 'ignite'>('ignite');

  // Live Demo Section: Interactive Simulation State
  const [simStep, setSimStep] = useState<'normal' | 'hazard_triggered' | 'rerouted'>('normal');
  const [showToast, setShowToast] = useState(false);

  // Trigger demo simulation flow
  const handleTriggerHazard = () => {
    setSimStep('hazard_triggered');
    setShowToast(true);
    setTimeout(() => {
      setSimStep('rerouted');
    }, 1800);
  };

  const handleResetDemo = () => {
    setSimStep('normal');
    setShowToast(false);
  };

  // Explainability Section: Interactive Factor Breakdown
  const [selectedFactor, setSelectedFactor] = useState<number>(0);
  const explainabilityFactors = [
    {
      name: 'Precipitation & Flash Flood Risk',
      weight: '35%',
      score: 86,
      agency: 'IMD (India Meteorological Dept)',
      desc: 'Real-time millimeter rainfall rates and catchment basin saturation levels.',
      status: 'High Caution',
      statusColor: 'text-amber-400',
      barColor: 'bg-amber-400',
    },
    {
      name: 'Slope Incline & Landslide Susceptibility',
      weight: '25%',
      score: 92,
      agency: 'GSI (Geological Survey of India)',
      desc: 'DEM elevation slope gradients (>35° triggers rockfall warning thresholds).',
      status: 'Critical Alert',
      statusColor: 'text-red-400',
      barColor: 'bg-red-500',
    },
    {
      name: 'Atmospheric Oxygen & High-Altitude Acclimatization',
      weight: '15%',
      score: 74,
      agency: 'DGHS Altitude Health Protocols',
      desc: 'Barometric pressure compensation and mandatory night-stay altitude caps.',
      status: 'Moderate Caution',
      statusColor: 'text-emerald-400',
      barColor: 'bg-emerald-400',
    },
    {
      name: 'Emergency Medical & SDRF Shelter Proximity',
      weight: '15%',
      score: 88,
      agency: 'SDRF / 112 Rapid Dispatch Network',
      desc: 'Walking radius to nearest oxygen hut, first-aid camp, and helipad evacuation point.',
      status: 'Protected Corridor',
      statusColor: 'text-emerald-400',
      barColor: 'bg-emerald-400',
    },
    {
      name: 'Daylight Window & Curfew Safety',
      weight: '10%',
      score: 95,
      agency: 'State Police & Disaster Authority',
      desc: 'Sunset cutoff enforcement preventing high-altitude movement after 17:30 IST.',
      status: 'Safe Window',
      statusColor: 'text-emerald-400',
      barColor: 'bg-emerald-400',
    },
  ];

  // Animated Counter simulation
  const [visitorCount, setVisitorCount] = useState(284000);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 0. STICKY TOP HACKATHON NAV BAR                                           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Hackathon Ribbon */}
          <div className="flex items-center gap-3">
            <IgniteLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-amber-200 to-orange-400 bg-clip-text text-transparent">
                  IGNITE
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 font-bold tracking-wider">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                AI Tourist Safety & Route Defense
              </p>
            </div>
          </div>

          {/* Quick Nav Anchors */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-white transition-colors">Live Simulation</a>
            <a href="#features" className="hover:text-white transition-colors">Core Engine</a>
            <a href="#explainability" className="hover:text-emerald-400 transition-colors">Explainability</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#team" className="hover:text-white transition-colors">Team</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Live Radar Pulse Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>LIVE MESH ACTIVE</span>
            </div>

            <button
              onClick={onLaunchApp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Launch Live Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Animated Vector Route Map Background Motif */}
        <div className="absolute inset-0 pointer-events-none -z-10 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Topographic Contour Lines */}
            <path d="M-100 200 C300 150, 500 350, 1300 180" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M-100 350 C400 300, 700 500, 1300 320" stroke="rgba(16, 185, 129, 0.12)" strokeWidth="1.5" strokeDasharray="6 6" />
            <path d="M-100 550 C200 650, 800 450, 1300 580" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1.5" />
            
            {/* Animated Dynamic Route Trail */}
            <motion.path
              d="M 150 650 Q 300 400 550 420 T 900 250 T 1150 180"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 6"
              variants={shouldReduceMotion ? undefined : pathDrawVariant}
              initial="hidden"
              animate="visible"
            />
            {/* Pulsing Hazard Hotspot */}
            <circle cx="550" cy="420" r="32" fill="rgba(239, 68, 68, 0.12)" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
            <circle cx="550" cy="420" r="4" fill="#ef4444" />
            
            {/* Destination Safe Point */}
            <circle cx="900" cy="250" r="28" fill="rgba(16, 185, 129, 0.12)" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="900" cy="250" r="5" fill="#10b981" />
          </svg>
        </div>

        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/15 via-teal-500/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Re-Framed Value Proposition */}
            <motion.div
              className="lg:col-span-7 space-y-6 text-left"
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* National Hackathon Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold shadow-inner">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pan-India Disaster-Aware Route Defense System</span>
              </div>

              {/* Reframed Core Question Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Not just "Where should I go?" <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  "How can I travel safely through this destination?"
                </span>
              </h1>

              {/* Subheadline: Differentiator */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-sans leading-relaxed">
                Autonomous destination-agnostic travel intelligence powered by multi-pillar risk explainability. Synthesizing real-time rainfall, terrain slope, oxygen thresholds, and automated SDRF emergency rerouting across 28 Indian States & 8 Union Territories.
              </p>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onLaunchApp}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Launch Live Interactive Planner</span>
                </button>

                <a
                  href="https://github.com/arnnnnaaavvvvv/IGNITE.git"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-sm transition-all flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4 text-slate-400" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 max-w-lg font-mono text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Zero Hallucinations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>2G Offline Failover</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>SDRF Integrated</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Floating 3D Parallax Mock UI */}
            <motion.div
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Main Floating Card */}
              <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-950/95 border border-slate-700/80 p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl space-y-4 text-left">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      Live Telemetry • Kedarnath Trek
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-extrabold border border-emerald-500/30">
                    SAFETY SCORE: 88/100
                  </span>
                </div>

                {/* Itinerary Preview Item */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-400">Day 1: Gaurikund ➔ Jungle Chatti</span>
                    <span className="text-slate-400 font-mono">4.2 km • 1,980m ASL</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    Optimal early morning departure before convective clouds gather over Mandakini Valley.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06]">Shelter: 800m</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06]">Medical Hut: Active</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.06]">Daylight: 17:30</span>
                  </div>
                </div>

                {/* Multi-Factor Safety Gauge */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-mono font-bold text-slate-400 flex justify-between">
                    <span>DYNAMIC RISK PILLARS</span>
                    <span className="text-emerald-400">Low Landslide Threat</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-slate-400">Weather</div>
                      <div className="font-bold text-emerald-400 mt-0.5">85% Clear</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-slate-400">Slope</div>
                      <div className="font-bold text-emerald-400 mt-0.5">18° Stable</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-slate-400">Oxygen</div>
                      <div className="font-bold text-amber-400 mt-0.5">82% SpO2</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                      <div className="text-slate-400">Rescue</div>
                      <div className="font-bold text-emerald-400 mt-0.5">12 min</div>
                    </div>
                  </div>
                </div>

                {/* Automated Reroute Simulation Badge */}
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-emerald-300">Autonomous OSRM Rerouting Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">&lt;450ms</span>
                </div>
              </div>

              {/* Decorative Glow Ring */}
              <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE PROBLEM (BEFORE VS AFTER SPLIT-SCREEN REVEAL)                       */}
      {/* ========================================================================= */}
      <section id="problem" className="py-20 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto space-y-4 mb-12"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>THE CRITICAL SAFETY GAP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Generic Itinerary Apps Fail in Real Disasters
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Standard consumer travel planners hallucinate picturesque routes while blind to elevation physics, cloudbursts, landslide dams, and zero-connectivity death zones.
            </p>

            {/* Split Screen Mode Toggle */}
            <div className="inline-flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 mt-2">
              <button
                onClick={() => setProblemComparison('legacy')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  problemComparison === 'legacy'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Generic LLM Planners
              </button>
              <button
                onClick={() => setProblemComparison('ignite')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  problemComparison === 'ignite'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                IGNITE Safety Defense
              </button>
            </div>
          </motion.div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Card 1: Generic Travel Planners */}
            <motion.div
              className={`p-6 rounded-3xl border transition-all ${
                problemComparison === 'legacy'
                  ? 'bg-red-950/20 border-red-500/50 shadow-2xl shadow-red-950/40'
                  : 'bg-slate-900/30 border-slate-800 opacity-60'
              }`}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 font-black">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-red-300">Generic Travel Generators</h3>
                  <p className="text-xs text-slate-400 font-mono">LLM Text Hallucinations</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 text-left">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Elevation Physics:</strong> Suggests walking 20km steep mountain ascents with unrealistic 3-hour timing.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Blind to Flash Floods:</strong> Routes tourists directly through active nullah washouts and red-alert zones.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Total 2G Blackout Failure:</strong> Cannot function without continuous 5G connection — fatal in remote valleys.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>No Rescue Attribution:</strong> No knowledge of SDRF emergency huts, helipads, or oxygen distribution centers.</span>
                </li>
              </ul>
            </motion.div>

            {/* Card 2: IGNITE Safety-First System */}
            <motion.div
              className={`p-6 rounded-3xl border transition-all ${
                problemComparison === 'ignite'
                  ? 'bg-emerald-950/25 border-emerald-500/50 shadow-2xl shadow-emerald-950/40 ring-1 ring-emerald-500/20'
                  : 'bg-slate-900/30 border-slate-800 opacity-60'
              }`}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-emerald-300">IGNITE Safety Defense</h3>
                  <p className="text-xs text-slate-400 font-mono">Deterministic Real-Time Engine</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 text-left">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Physics-Engineered Routing:</strong> Calculates Naismith-rule grade adjustments and oxygen-drop acclimatization.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Real-Time Dynamic Rerouting:</strong> WebSocket telemetry auto-activates bypass corridors during live flash floods.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>100% Offline 2G Cache:</strong> Stores full itinerary and emergency map buffers in local memory for zero-tower valleys.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>112 SDRF Integration:</strong> 1-Click SOS broadcasts precise GPS coordinates and altitude via SMS failover.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS (4-STEP PROGRESSION)                                      */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              <Layers className="w-3.5 h-3.5" />
              <span>DETERMINISTIC PIPELINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              How IGNITE Defends Every Step of Your Journey
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Four synchronized layers that transform raw geospatial data and disaster warnings into a verified, life-preserving itinerary.
            </p>
          </motion.div>

          {/* Staggered Step Cards with Connecting Line */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 relative"
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Step 1 */}
            <motion.div variants={staggerItemVariant} className="relative p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-black text-lg">
                01
              </div>
              <h3 className="text-base font-black text-white">Select Destination</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Choose any destination across 28 States & 8 UTs (High-Altitude Treks, Pilgrimage, Coastal, Desert, or Forest).
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div variants={staggerItemVariant} className="relative p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-black text-lg">
                02
              </div>
              <h3 className="text-base font-black text-white">Multi-Pillar Risk Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                6 regional physics engines analyze rainfall, slope incline, barometric oxygen, and medical shelter reach.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div variants={staggerItemVariant} className="relative p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-black text-lg">
                03
              </div>
              <h3 className="text-base font-black text-white">Safety-Optimized Itinerary</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                OSRM generates elevation-corrected waypoints, emergency shelter stops, daylight curfew cutoffs, and INR budgets.
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div variants={staggerItemVariant} className="relative p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-black text-lg">
                04
              </div>
              <h3 className="text-base font-black text-white">Autonomous Rerouting</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Live WebSocket streams detect sudden cloudbursts and auto-activate safe bypass corridors in under 450ms.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE DEMO SHOWCASE (INTERACTIVE SIMULATION)                            */}
      {/* ========================================================================= */}
      <section id="demo" className="py-20 border-t border-slate-900 bg-slate-950/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto space-y-4 mb-12"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Radio className="w-3.5 h-3.5" />
              <span>INTERACTIVE DISASTER BENCH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Experience Real-Time Disaster Response in Action
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Test how IGNITE automatically catches an extreme weather event and re-routes tourists before they enter hazardous terrain.
            </p>
          </motion.div>

          {/* Interactive Simulation Dashboard Box */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900/90 border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden">
            {/* Spring Animated Toast / Alert */}
            {showToast && (
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-500 text-white shadow-2xl border border-red-300/40 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold animate-pulse"
                variants={slideInToastVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-200" />
                  <span>⚠️ URGENT: Cloudburst & Flash Flood at Rambara (Score: 84/100). Activating Garur Chatti High-Ground Bypass.</span>
                </div>
                <span className="text-[10px] font-mono bg-black/30 px-2 py-1 rounded-md shrink-0">
                  REROUTE: &lt;450ms
                </span>
              </motion.div>
            )}

            {/* Simulation Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 text-left">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase">Simulation Target</span>
                <h3 className="text-xl font-black text-white">Kedarnath Yatra Corridor (Uttarakhand)</h3>
              </div>

              {/* Simulation Action Controls */}
              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                {simStep === 'normal' ? (
                  <button
                    onClick={handleTriggerHazard}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CloudRain className="w-4 h-4" />
                    <span>Trigger Flash Flood Hazard</span>
                  </button>
                ) : (
                  <button
                    onClick={handleResetDemo}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4 text-emerald-400" />
                    <span>Reset Simulation</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visual Route Corridor Representation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">STATUS</div>
                <div className={`font-black text-sm mt-1 ${simStep === 'normal' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {simStep === 'normal' ? '🟢 Normal Trail Open' : '🟡 Active Reroute Corridor'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">ACTIVE TRAIL</div>
                <div className="font-mono font-bold text-sm text-white mt-1">
                  {simStep === 'rerouted' ? 'Garur Chatti High Ridge' : 'Main Mandakini Trail'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">SDRF EVACUATION TIME</div>
                <div className="font-mono font-bold text-sm text-emerald-400 mt-1">
                  {simStep === 'rerouted' ? '6.5 Minutes (Optimal)' : '14.0 Minutes'}
                </div>
              </div>
            </div>

            {/* Interactive Simulation Footer Link */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
              <span>Full disaster test bench supports 6 regional hazard models with live WebSocket telemetry.</span>
              <button
                onClick={onLaunchApp}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full Interactive Bench</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CORE FEATURES GRID (8 HIGH-IMPACT CARDS)                               */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRODUCTION-GRADE CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Engineered for Real-World Field Resilience
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Eight unified subsystems designed to protect tourists, pilgrims, and solo trekkers across all terrains.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {/* 1. Risk Engine */}
            <motion.div variants={staggerItemVariant} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all text-left space-y-3 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">6-Pillar Risk Engine</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Adaptive regional models for Hill, Coastal, Desert, Forest, Plains, and Urban tourist circuits.
              </p>
            </motion.div>

            {/* 2. Automated SOS */}
            <motion.div variants={staggerItemVariant} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-red-500/40 transition-all text-left space-y-3 group">
              <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">112 SDRF SMS SOS</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                1-Click emergency beacon broadcasting GPS lat/lon, altitude, and medical blood group via SMS.
              </p>
            </motion.div>

            {/* 3. Dynamic Rerouting */}
            <motion.div variants={staggerItemVariant} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all text-left space-y-3 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">OSRM Dynamic Rerouting</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Real-time mathematical bypass calculation when active trails are blocked by flash floods or rockfalls.
              </p>
            </motion.div>

            {/* 4. 2G Offline Fallback */}
            <motion.div variants={staggerItemVariant} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all text-left space-y-3 group">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <WifiOff className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">2G Zero-Tower Resilience</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Local IndexedDB state caching ensuring uninterrupted map and emergency guidance without internet.
              </p>
            </motion.div>

            {/* 5. Explainability Panel */}
            <motion.div variants={staggerItemVariant} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all text-left space-y-3 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Explainability Panel</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Plain-language breakdown of safety health scores with official government agency attribution (IMD, GSI).
              </p>
            </motion.div>

            {/* 6. Dynamic Budget Optimizer */}
            <motion.div variants={staggerItemVariant} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all text-left space-y-3 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">INR Budget Optimizer</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Deterministic daily cost allocation across transport, stays, safety gear, and mandatory emergency funds.
              </p>
            </motion.div>

            {/* 7. Multilingual Briefings */}
            <motion.div variants={staggerItemVariant} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all text-left space-y-3 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Bilingual Audio Briefings</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Native voice synthesis in English and Hindi for hands-free situational awareness on trails.
              </p>
            </motion.div>

            {/* 8. Group Mesh Radar */}
            <motion.div variants={staggerItemVariant} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all text-left space-y-3 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-white">Group Tracker Radar</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Live coordinate sync for pilgrim groups and families with automatic separation distance alerts.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EXPLAINABILITY HIGHLIGHT (KEY DIFFERENTIATOR)                           */}
      {/* ========================================================================= */}
      <section id="explainability" className="py-20 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>CORE DIFFERENTIATOR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Explainable AI: Trust Grounded in Physics & Data
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              No black-box hallucination. Every safety recommendation is broken down into verifiable environmental components with official government data sources.
            </p>
          </motion.div>

          {/* Interactive Formula & Factor Breakdown Box */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Factor List Buttons */}
            <div className="lg:col-span-6 space-y-3 text-left">
              {explainabilityFactors.map((factor, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedFactor(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedFactor === idx
                      ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={selectedFactor === idx ? 'text-emerald-300' : 'text-white'}>
                      {factor.name}
                    </span>
                    <span className="font-mono text-emerald-400">{factor.weight}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full mt-2 overflow-hidden">
                    <div className={`${factor.barColor} h-full rounded-full`} style={{ width: `${factor.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Factor Deep-Dive Card */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700 p-6 sm:p-8 space-y-4 text-left shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
                    Factor Inspection
                  </span>
                  <span className={`text-xs font-mono font-bold ${explainabilityFactors[selectedFactor].statusColor}`}>
                    {explainabilityFactors[selectedFactor].status}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">
                  {explainabilityFactors[selectedFactor].name}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {explainabilityFactors[selectedFactor].desc}
                </p>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">VERIFYING AGENCY</div>
                  <div className="text-xs font-bold text-white font-mono">
                    {explainabilityFactors[selectedFactor].agency}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Factor Weighting in Composite Risk:</span>
                  <span className="font-bold text-emerald-400">{explainabilityFactors[selectedFactor].weight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TECH ARCHITECTURE SNAPSHOT                                             */}
      {/* ========================================================================= */}
      <section id="architecture" className="py-20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              <Code2 className="w-3.5 h-3.5" />
              <span>SYSTEM ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              High-Throughput Disaster-Resilient Architecture
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Decoupled micro-architecture designed for sub-second telemetry ingestion, graph-based routing, and offline browser persistence.
            </p>
          </motion.div>

          {/* Architecture Diagram Nodes */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 text-left font-mono">
            {/* Layer 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-[10px] text-emerald-400 font-bold">01 • PRESENTATION</div>
              <div className="text-sm font-black text-white">React 19 + Framer Motion</div>
              <p className="text-[11px] text-slate-400 font-sans">Leaflet map tiles, IndexedDB 2G offline cache & bilingual audio briefings.</p>
            </div>

            {/* Layer 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-[10px] text-emerald-400 font-bold">02 • RISK ENGINE</div>
              <div className="text-sm font-black text-white">FastAPI + Python 3.14</div>
              <p className="text-[11px] text-slate-400 font-sans">6 regional risk formulas, Naismith grade pacing & elevation math.</p>
            </div>

            {/* Layer 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-[10px] text-emerald-400 font-bold">03 • GEOSPATIAL DATA</div>
              <div className="text-sm font-black text-white">OSRM + Overpass QL</div>
              <p className="text-[11px] text-slate-400 font-sans">OpenStreetMap POI ingestion, PostGIS topological distance & shelters.</p>
            </div>

            {/* Layer 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-[10px] text-emerald-400 font-bold">04 • DISASTER MESH</div>
              <div className="text-sm font-black text-white">WebSocket + SMS SOS</div>
              <p className="text-[11px] text-slate-400 font-sans">Real-time hazard broadcast channel & 112 emergency SDRF gateway.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. IMPACT & NATIONAL SCOPE                                                */}
      {/* ========================================================================= */}
      <section id="impact" className="py-20 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto text-center font-mono">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                {visitorCount.toLocaleString()}+
              </div>
              <div className="text-xs text-slate-400">Simulated Pilgrims & Trekkers Monitored</div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">&lt;450ms</div>
              <div className="text-xs text-slate-400">Autonomous Hazard Reroute Computation Time</div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-400">Zero-Network 2G Offline Operational Capability</div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">28+8</div>
              <div className="text-xs text-slate-400">All Indian States & Union Territories Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TEAM SECTION (SMART INDIA HACKATHON 2026)                              */}
      {/* ========================================================================= */}
      <section id="team" className="py-20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>HACKATHON INNOVATION TEAM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Meet the Engineers Behind IGNITE
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Built with passion for Smart India Hackathon (SIH 2026) to solve national tourist safety and emergency response coordination.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Member 1: Arnav */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                A
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Arnav</h3>
                <p className="text-xs text-emerald-400 font-mono">Lead Architect & Systems Engineering</p>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Full-stack orchestration, OSRM routing pipelines, and high-concurrency WebSocket telemetry architecture.
              </p>
            </div>

            {/* Member 2: Tarun Kumar Agnihotri */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                T
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Tarun Kumar Agnihotri</h3>
                <p className="text-xs text-amber-400 font-mono">Backend & Geospatial ML Engineer</p>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Multi-pillar risk score formulas, OpenStreetMap Overpass ingestion, and regional hazard modeling.
              </p>
            </div>

            {/* Member 3: Shubh Jaiswal */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
              <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg">
                S
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Shubh Jaiswal</h3>
                <p className="text-xs text-teal-400 font-mono">Frontend & UI/UX Design Specialist</p>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Linear-grade glassmorphic motion UI, mobile-first responsive interfaces, and bilingual accessibility systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FINAL CALL TO ACTION & FOOTER                                         */}
      {/* ========================================================================= */}
      <footer className="py-16 border-t border-slate-900 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Main CTA Box */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center max-w-4xl mx-auto space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Experience the Future of Safe Travel?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto font-sans leading-relaxed">
              Explore safe itineraries, test disaster simulations, and inspect explainable risk factors across India right now in the live demo.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onLaunchApp}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Launch Interactive App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://github.com/arnnnnaaavvvvv/IGNITE.git"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
              >
                Inspect GitHub Codebase
              </a>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-900 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <IgniteLogo size="sm" />
              <span>IGNITE • National Tourist Safety & Autonomous Route Defense</span>
            </div>
            <div>
              <span>Smart India Hackathon (SIH 2026) Finalist</span>
            </div>
            <div className="text-emerald-400">
              <span>Aligned with NDMA & SDRF 112 Protocol</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
