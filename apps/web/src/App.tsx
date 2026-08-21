import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { TrailMap } from './components/Map/TrailMap';
import { TripWizard } from './components/Planner/TripWizard';
import { ItineraryView } from './components/Itinerary/ItineraryView';
import { ExplainabilityPanel } from './components/Explainability/ExplainabilityPanel';
import { DisasterBench } from './components/Simulation/DisasterBench';
import { SOSModal } from './components/Emergency/SOSModal';
import { GroupTrackerModal } from './components/Group/GroupTrackerModal';
import { AuthModal } from './components/Auth/AuthModal';
import { OfflineCacheService } from './services/offlineCache';
import { SafeTrailWebSocketClient } from './services/websocketClient';
import type {
  Checkpoint,
  HazardZone,
  EmergencyShelter,
  ItineraryResponse,
  SimulationScenario,
} from './types';
import { AlertTriangle, WifiOff, CheckCircle, MapPin } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'itinerary' | 'explainability' | 'simulation' | 'group'>('map');
  const [language, setLanguage] = useState('en');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // User Profile
  const [currentUser, setCurrentUser] = useState<any>(OfflineCacheService.getUserSession() || { name: 'Tourist Guest' });

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

  const wsClientRef = useRef<SafeTrailWebSocketClient | null>(null);

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
    const ws = new SafeTrailWebSocketClient(
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

  // Live Scenario Injection Handler (Multi-Region Pan-India Demo)
  const handleTriggerScenario = async (scenario: SimulationScenario) => {
    setActiveScenario(scenario);
    const targetDest = scenario.destination_match !== 'All' ? scenario.destination_match : currentDestinationName;
    
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isSimulatingHazard={isBypassActive}
        isWebSocketConnected={isWebSocketConnected}
        userName={currentUser?.name || 'Tourist Guest'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Offline Fallback Banner */}
        {isOfflineMode && cachedTime && (
          <div className="p-3.5 rounded-2xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-amber-400" />
              <span>Offline 2G Fallback Mode Active. Displaying cached itinerary for <strong>{currentDestinationName}</strong>.</span>
            </div>
            <span className="text-[10px] font-mono text-amber-400">Cached: {new Date(cachedTime).toLocaleTimeString()}</span>
          </div>
        )}

        {/* Dynamic Hazard Alert Top Bar */}
        {isBypassActive && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/90 via-slate-900/90 to-red-950/90 border border-red-500/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="text-xs font-black tracking-wider uppercase text-red-300">
                  CRITICAL REGIONAL HAZARD ACTIVE ({rerouteData?.destination || currentDestinationName})
                </div>
                <div className="text-xs text-slate-300">
                  {rerouteData?.instructions || 'Regional hazard threshold exceeded. Safe bypass trail engaged.'}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('map')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 whitespace-nowrap cursor-pointer"
            >
              View Reroute on Map
            </button>
          </div>
        )}

        {/* Tab 1: Interactive Map & Autocomplete Planner */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
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
                  onResetToIndia={handleResetToIndia}
                  onSelectCheckpoint={(cp) => setSelectedCheckpoint(cp)}
                />
              </div>

              <div className="space-y-4">
                <TripWizard
                  onGenerate={generateItinerary}
                  isLoading={isGenerating}
                  selectedDestinationName={currentDestinationName}
                  onPreviewDestination={(dest) => {
                    setPreviewCoordinates(dest);
                    if (dest) setCurrentDestinationName(dest.name);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Safe Itinerary & Regional Budget Logistics */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {itinerary ? (
              <ItineraryView
                itinerary={itinerary}
                onSelectCheckpoint={(cp) => {
                  setSelectedCheckpoint(cp);
                  setActiveTab('explainability');
                }}
              />
            ) : (
              <div className="glass-panel p-12 rounded-2xl text-center text-slate-300 max-w-lg mx-auto space-y-4 my-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">No Active Itinerary Generated</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Search any Indian destination in the Map & Planner tab and click <span className="text-emerald-400 font-semibold">&ldquo;Generate Safe Itinerary &amp; Risk Matrix&rdquo;</span> to synthesize a tailored schedule with verified safety protocols.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('map')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  Go to Map &amp; Planner
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Risk Explainability Panel */}
        {activeTab === 'explainability' && (
          <div className="space-y-6">
            <ExplainabilityPanel
              subScores={selectedCheckpoint?.sub_scores || (itinerary?.days?.[0]?.checkpoints?.[0]?.sub_scores)}
              checkpointName={selectedCheckpoint?.name || currentDestinationName}
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
          <div className="space-y-6">
            <DisasterBench
              scenarios={scenarios}
              onTriggerScenario={handleTriggerScenario}
              activeScenarioId={activeScenario?.id}
              isSimulating={isBypassActive}
              rerouteData={rerouteData}
            />
          </div>
        )}

        {/* Tab 5: Group Live Radar */}
        {activeTab === 'group' && (
          <div className="space-y-6">
            <GroupTrackerModal
              destinationName={currentDestinationName}
              leaderLocation={{
                lat: checkpoints[0]?.lat || 28.6139,
                lon: checkpoints[0]?.lon || 77.2090,
                altitude_m: checkpoints[0]?.altitude_m || 210,
              }}
            />
          </div>
        )}
      </main>

      {/* Universal Emergency SOS Panic Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        userCoords={{
          lat: checkpoints[0]?.lat || 30.6270,
          lon: checkpoints[0]?.lon || 79.0700,
          altitude_m: checkpoints[0]?.altitude_m || 2550,
        }}
      />

      {/* Tourist Identity & Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onUserLogin={(user) => setCurrentUser(user)}
      />

      {/* Modern Footer */}
      <footer className="mt-auto border-t border-slate-900 glass-panel py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <span className="flex items-center gap-1.5 justify-center">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>SafeTrail AI • Pan-India Tourist Safety & Smart Route Planner</span>
          </span>
          <span>Active: {currentDestinationName ? `${currentDestinationName} (${itinerary?.region_name || 'National Network'})` : 'Pan-India Explorer (28 States & 8 UTs)'}</span>
          <span className="text-emerald-400">PostGIS • Overpass QL • Redis TTL • OSRM Routing</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
