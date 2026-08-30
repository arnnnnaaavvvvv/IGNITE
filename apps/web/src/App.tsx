import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/Landing/LandingPage';
import { AceternityBackground } from './components/Common/AceternityBackground';
import { TrailMap } from './components/Map/TrailMap';
import { TripWizard } from './components/Planner/TripWizard';
import { ItineraryView } from './components/Itinerary/ItineraryView';
import { ItineraryModal } from './components/Itinerary/ItineraryModal';
import { ExplainabilityPanel } from './components/Explainability/ExplainabilityPanel';
import { DisasterBench } from './components/Simulation/DisasterBench';
import { SOSModal } from './components/Emergency/SOSModal';
import { GroupTrackerModal } from './components/Group/GroupTrackerModal';
import { OfflineCacheService } from './services/offlineCache';
import { IgniteWebSocketClient } from './services/websocketClient';
import type {
  Checkpoint,
  HazardZone,
  EmergencyShelter,
  ItineraryResponse,
  SimulationScenario,
} from './types';
import { AlertTriangle, WifiOff, MapPin, Compass, Search } from 'lucide-react';
import { t, getLocalizedDestinationName } from './services/i18n';

export function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'itinerary' | 'explainability' | 'simulation' | 'group'>('overview');
  const [mobileViewMode, setMobileViewMode] = useState<'plan' | 'map'>('plan');
  const [language, setLanguage] = useState<string>(() => {
    try {
      return localStorage.getItem('ignite_lang') || 'en';
    } catch {
      return 'en';
    }
  });
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);

  // Core Destination & Map Data States
  const [currentDestinationName, setCurrentDestinationName] = useState('');
  const [previewCoordinates, setPreviewCoordinates] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [hazardZones, setHazardZones] = useState<HazardZone[]>([]);
  const [shelters, setShelters] = useState<EmergencyShelter[]>([]);
  const [mainTrail, setMainTrail] = useState<[number, number, number?][]>([]);
  const [bypassTrail, setBypassTrail] = useState<[number, number, number?][]>([]);
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);

  // Planner & Itinerary State
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [cachedTime, setCachedTime] = useState<string | null>(null);

  // WebSocket & Live Reroute State
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);
  const [rerouteData, setRerouteData] = useState<any>(null);
  const [isBypassActive, setIsBypassActive] = useState(false);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<any>(null);

  const wsClientRef = useRef<IgniteWebSocketClient | null>(null);

  // Initialize WebSocket & Initial Scenarios Load
  useEffect(() => {
    async function loadInitialData() {
      try {
        const scRes = await fetch('/api/v1/simulation/scenarios');
        const scData = await scRes.json();
        setScenarios(scData.scenarios || []);
      } catch (err) {
        console.warn('Backend scenarios notice:', err);
        setCachedTime(new Date().toISOString());
      }
    }
    loadInitialData();

    // Connect WebSocket
    const ws = new IgniteWebSocketClient(
      'active_trip_01',
      (alertPayload) => {
        console.log('[WebSocket Alert Received]:', alertPayload);
        if (alertPayload.type === 'HAZARD_ALERT' || alertPayload.is_reroute_required) {
          setRerouteData(alertPayload);
          setIsBypassActive(true);
        } else if (alertPayload.type === 'NORMAL_TELEMETRY_UPDATE') {
          setIsBypassActive(false);
        }
      },
      (connected) => {
        setIsWebSocketConnected(connected);
      }
    );
    ws.connect();
    wsClientRef.current = ws;

    return () => {
      ws.disconnect();
    };
  }, [language]);

  // Scroll to top whenever tab or view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Universal Itinerary Generation Handler
  const generateItinerary = async (params: {
    destination: string;
    duration_days: number;
    start_date?: string;
    end_date?: string;
    budget_tier: string;
    total_budget_inr: number;
    fitness_level: string;
  }) => {
    if (!params.destination || !params.destination.trim()) {
      return;
    }
    setIsGenerating(true);
    setIsItineraryModalOpen(true);
    try {
      const res = await fetch('/api/v1/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          language,
          weather_simulation: activeScenario?.weather || null,
        }),
      });
      const data: ItineraryResponse = await res.json();
      setItinerary(data);
      setCurrentDestinationName(data.destination);
      setPreviewCoordinates(null);
      setMainTrail(data.trail_coords || []);
      setBypassTrail(data.bypass_coords || []);
      setHazardZones(data.hazard_zones || []);
      setShelters(data.shelters || []);
      setIsOfflineMode(false);

      // Save to client offline cache
      OfflineCacheService.saveActiveTrip(data);

      const allCps: Checkpoint[] = [];
      data.days?.forEach((day) => {
        day.checkpoints?.forEach((cp) => {
          allCps.push({
            id: cp.checkpoint_id,
            name: cp.name,
            name_hi: cp.name_hi,
            altitude_m: cp.altitude_m,
            lat: cp.lat,
            lon: cp.lon,
            facilities: cp.facilities,
            has_oxygen_booth: cp.has_oxygen_booth,
          });
        });
      });
      setCheckpoints(allCps);

      if (data.days?.[0]?.checkpoints?.[0]) {
        setSelectedCheckpoint(data.days[0].checkpoints[0]);
      }
    } catch (err) {
      console.error('Error generating itinerary:', err);
      setIsOfflineMode(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetToIndia = () => {
    setPreviewCoordinates(null);
    setCurrentDestinationName('');
    setMainTrail([]);
    setBypassTrail([]);
    setCheckpoints([]);
    setHazardZones([]);
    setShelters([]);
    setItinerary(null);
  };

  // Live Scenario Injection Handler
  const handleTriggerScenario = async (scenario: SimulationScenario) => {
    setActiveScenario(scenario);
    const targetDest = (scenario.destination_match && scenario.destination_match !== 'All')
      ? scenario.destination_match
      : (currentDestinationName || 'Kedarnath');
    
    setCurrentDestinationName(targetDest);

    try {
      const res = await fetch('/api/v1/risk/recheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: 'active_trip_01',
          destination_id: targetDest,
          lat: checkpoints[0]?.lat || 30.6270,
          lon: checkpoints[0]?.lon || 79.0700,
          altitude_m: checkpoints[0]?.altitude_m || 2550,
          language,
          weather: scenario.weather,
        }),
      });
      const data = await res.json();
      setRerouteData(data);
      setIsBypassActive(data.reroute_triggered);

      await generateItinerary({
        destination: targetDest,
        duration_days: itinerary?.duration_days || 2,
        budget_tier: itinerary?.budget_breakdown?.tier || 'STANDARD',
        total_budget_inr: itinerary?.budget_breakdown?.total_budget_inr || 12000,
        fitness_level: itinerary?.fitness_level || 'MODERATE',
      });
    } catch (err) {
      console.error('Error triggering simulation scenario:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-emerald-500/30 selection:text-white font-sans antialiased relative">
      {/* Landing Page Amber Glow & Dot-Grid Background (Landing Only) */}
      {activeTab === 'overview' && <AceternityBackground />}

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenSOS={() => setIsSOSOpen(true)}
        isSimulatingHazard={isBypassActive}
        isWebSocketConnected={isWebSocketConnected}
      />

      {/* Overview Landing Page (Magic UI Startup Template) */}
      {activeTab === 'overview' && (
        <LandingPage
          onLaunchMap={(destName) => {
            if (destName) {
              setCurrentDestinationName(destName);
            }
            setActiveTab('map');
          }}
          onLaunchSimulation={() => {
            setActiveTab('simulation');
          }}
          onOpenSOS={() => setIsSOSOpen(true)}
          onSelectTab={(tab) => setActiveTab(tab)}
          language={language}
          isWebSocketConnected={isWebSocketConnected}
        />
      )}

      {/* Main Tool Content Area */}
      {activeTab !== 'overview' && (
        <>
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 pb-24 md:pb-8 relative z-10">
            {/* Offline Fallback Banner */}
            {isOfflineMode && cachedTime && (
              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{t('offline_banner_title', language)} <strong className="text-white font-semibold">{getLocalizedDestinationName(currentDestinationName, language)}</strong>.</span>
                </div>
                <span className="text-[11px] font-mono text-amber-400/90 self-end sm:self-auto bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20">{t('cached_at', language)}: {new Date(cachedTime).toLocaleTimeString()}</span>
              </div>
            )}

            {/* Dynamic Hazard Alert Top Bar */}
            {isBypassActive && (
              <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold tracking-wide uppercase text-red-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {t('critical_hazard_active', language)} ({getLocalizedDestinationName(rerouteData?.destination || currentDestinationName, language)})
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      {language === 'hi' && rerouteData?.instructions_hi ? rerouteData.instructions_hi : (rerouteData?.instructions || (language === 'hi' ? 'खतरे की सीमा पार। सुरक्षित बाईपास मार्ग सक्रिय।' : 'Hazard threshold exceeded. Safe detour route active.'))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('map')}
                  className="btn-tactile w-full sm:w-auto px-3.5 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold text-xs whitespace-nowrap cursor-pointer text-center"
                >
                  {t('view_reroute_map', language)}
                </button>
              </div>
            )}

            {/* Tab 1: Interactive Map & Autocomplete Planner */}
            {activeTab === 'map' && (
              <div className="space-y-4">
                {/* Mobile View Toggle: Available on small/medium screens (< lg) */}
                <div className="flex lg:hidden items-center justify-center p-1 bg-[#0e1017] rounded-xl border border-white/[0.08] max-w-sm mx-auto shadow-md">
                  <button
                    type="button"
                    onClick={() => setMobileViewMode('plan')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      mobileViewMode === 'plan'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'स्थान खोजें व प्लान' : 'Search & Plan'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileViewMode('map')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      mobileViewMode === 'map'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'नक्शा देखें' : 'Map View'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                  {/* Map Column: Full height on desktop, visible on mobile when mobileViewMode === 'map' */}
                  <div className={`lg:col-span-7 flex flex-col h-[380px] sm:h-[480px] lg:h-full min-h-[340px] lg:min-h-[680px] ${mobileViewMode === 'plan' ? 'hidden lg:flex' : 'flex'}`}>
                    <TrailMap
                      checkpoints={checkpoints}
                      hazardZones={hazardZones}
                      shelters={shelters}
                      mainTrailCoords={mainTrail}
                      bypassTrailCoords={bypassTrail}
                      isBypassActive={isBypassActive}
                      destinationName={currentDestinationName}
                      regionType={itinerary?.region_type}
                      previewCoordinates={previewCoordinates}
                      language={language}
                      onResetToIndia={handleResetToIndia}
                      onSelectCheckpoint={(cp) => setSelectedCheckpoint(cp)}
                      onSwitchToPlan={() => setMobileViewMode('plan')}
                    />
                  </div>

                  {/* TripWizard Column: Full height on desktop, visible on mobile when mobileViewMode === 'plan' */}
                  <div className={`lg:col-span-5 flex flex-col min-h-[480px] lg:min-h-[680px] h-full ${mobileViewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}>
                    <TripWizard
                      onGenerate={generateItinerary}
                      isLoading={isGenerating}
                      selectedDestinationName={currentDestinationName}
                      language={language}
                      onPreviewDestination={(dest) => {
                        setPreviewCoordinates(dest);
                        if (dest) setCurrentDestinationName(dest.name);
                      }}
                      onSwitchToMap={() => setMobileViewMode('map')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Safe Itinerary & Regional Budget Logistics */}
            {activeTab === 'itinerary' && (
              <div className="space-y-4">
                {itinerary ? (
                  <ItineraryView
                    itinerary={itinerary}
                    language={language}
                    onSelectCheckpoint={(cp) => {
                      setSelectedCheckpoint(cp);
                      setActiveTab('explainability');
                    }}
                  />
                ) : (
                  <div className="glass-panel p-10 rounded-xl text-center text-slate-300 max-w-md mx-auto space-y-3 my-8">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{t('no_itinerary_title', language)}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {t('no_itinerary_desc', language)}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('map')}
                      className="btn-tactile px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                    >
                      {t('btn_go_map', language)}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Risk Explainability Panel */}
            {activeTab === 'explainability' && (
              <div className="space-y-4">
                <ExplainabilityPanel
                  subScores={selectedCheckpoint?.sub_scores || (itinerary?.days?.[0]?.checkpoints?.[0]?.sub_scores)}
                  checkpointName={getLocalizedDestinationName(selectedCheckpoint?.name || currentDestinationName, language)}
                  totalScore={selectedCheckpoint?.total_risk_score || itinerary?.overall_safety_score || 25}
                  explanationText={
                    itinerary?.explainability?.summary_text ||
                    'Route safety verified with regional multi-agency precautions.'
                  }
                  language={language}
                  regionType={itinerary?.region_type}
                  regionName={itinerary?.region_name}
                />
              </div>
            )}

            {/* Tab 4: Disaster Bench & Multi-Region Simulator */}
            {activeTab === 'simulation' && (
              <div className="space-y-4">
                <DisasterBench
                  scenarios={scenarios}
                  onTriggerScenario={handleTriggerScenario}
                  activeScenarioId={activeScenario?.id}
                  isSimulating={isBypassActive}
                  rerouteData={rerouteData}
                  selectedDestinationName={currentDestinationName}
                  language={language}
                  onSelectDestination={(destName) => {
                    setCurrentDestinationName(destName);
                  }}
                  onNavigateToMap={() => setActiveTab('map')}
                />
              </div>
            )}

            {/* Tab 5: Group Live Radar */}
            {activeTab === 'group' && (
              <div className="space-y-4">
                <GroupTrackerModal
                  destinationName={getLocalizedDestinationName(currentDestinationName, language)}
                  language={language}
                  leaderLocation={{
                    lat: checkpoints[0]?.lat || 28.6139,
                    lon: checkpoints[0]?.lon || 77.2090,
                    altitude_m: checkpoints[0]?.altitude_m || 210,
                  }}
                />
              </div>
            )}
          </main>

          {/* High-Precision Command Footer */}
          <footer className="mt-auto border-t border-white/[0.08] bg-[#090a0f] py-3 px-6 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="font-semibold text-slate-200">IGNITE</span>
                <span className="text-slate-600">•</span>
                <span>{t('footer_title', language)}</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {t('footer_active', language)}: <span className="text-white font-medium">{currentDestinationName ? `${getLocalizedDestinationName(currentDestinationName, language)} (${itinerary?.region_name || 'National Network'})` : t('footer_pan_india', language)}</span>
              </span>
            </div>
          </footer>
        </>
      )}

      {/* Universal Emergency SOS Panic Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        language={language}
        userCoords={{
          lat: checkpoints[0]?.lat || 30.6270,
          lon: checkpoints[0]?.lon || 79.0700,
          altitude_m: checkpoints[0]?.altitude_m || 2550,
        }}
      />

      {/* In-Place Safe Itinerary & Risk Matrix Modal */}
      <ItineraryModal
        isOpen={isItineraryModalOpen}
        isLoading={isGenerating}
        itinerary={itinerary}
        language={language}
        selectedCheckpoint={selectedCheckpoint}
        onSelectCheckpoint={(cp) => setSelectedCheckpoint(cp)}
        onClose={() => setIsItineraryModalOpen(false)}
      />
    </div>
  );
}

export default App;
