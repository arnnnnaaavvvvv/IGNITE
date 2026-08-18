import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Checkpoint, HazardZone, EmergencyShelter } from '../../types';
import { ShieldCheck, AlertOctagon, Compass } from 'lucide-react';

interface TrailMapProps {
  checkpoints: Checkpoint[];
  hazardZones: HazardZone[];
  shelters: EmergencyShelter[];
  mainTrailCoords: [number, number, number?][];
  bypassTrailCoords?: [number, number, number?][];
  userLocation?: { lat: number; lon: number; altitude_m: number };
  activeHazardId?: string;
  isBypassActive?: boolean;
  onSelectCheckpoint?: (cp: Checkpoint) => void;
  destinationName?: string;
  regionType?: string;
}

export const TrailMap: React.FC<TrailMapProps> = ({
  checkpoints,
  hazardZones,
  shelters,
  mainTrailCoords,
  bypassTrailCoords = [],
  userLocation,
  activeHazardId,
  isBypassActive = false,
  onSelectCheckpoint,
  destinationName = 'Destination',
  regionType = 'HILL_MOUNTAIN',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [showHazards, setShowHazards] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showCheckpoints, setShowCheckpoints] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [30.6400, 79.0700],
        zoom: 12,
        minZoom: 5,
        maxZoom: 18,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark Topo / Road tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      layersRef.current.trails = L.layerGroup().addTo(map);
      layersRef.current.hazards = L.layerGroup().addTo(map);
      layersRef.current.shelters = L.layerGroup().addTo(map);
      layersRef.current.checkpoints = L.layerGroup().addTo(map);
      layersRef.current.user = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Centering & Render Elements when destination/coords change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Draw Main Trail Polyline & Fit Bounds
    layersRef.current.trails.clearLayers();
    if (mainTrailCoords && mainTrailCoords.length > 0) {
      const latlngs: L.LatLngExpression[] = mainTrailCoords.map((c) => [c[1], c[0]]);
      
      const trailPolyline = L.polyline(latlngs, {
        color: isBypassActive ? '#f97316' : '#10b981',
        weight: 5,
        opacity: 0.9,
        dashArray: isBypassActive ? '6, 8' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
      });
      trailPolyline.bindTooltip(isBypassActive ? 'Main Route (Degraded/Active Hazard)' : `Verified Safe Route (${destinationName})`, {
        sticky: true,
        className: 'bg-slate-900 text-slate-100 text-xs px-2 py-1 rounded border border-slate-700',
      });
      layersRef.current.trails.addLayer(trailPolyline);

      // Draw Bypass if active
      if (isBypassActive && bypassTrailCoords && bypassTrailCoords.length > 0) {
        const bypassLatLngs: L.LatLngExpression[] = bypassTrailCoords.map((c) => [c[1], c[0]]);
        const bypassPolyline = L.polyline(bypassLatLngs, {
          color: '#38bdf8',
          weight: 6,
          opacity: 1.0,
          lineCap: 'round',
        });
        bypassPolyline.bindTooltip('⚡ RECOMMENDED SAFE BYPASS CORRIDOR', {
          permanent: true,
          direction: 'top',
          className: 'bg-cyan-900 text-cyan-200 text-xs font-bold px-2 py-1 rounded border border-cyan-500 shadow-lg',
        });
        layersRef.current.trails.addLayer(bypassPolyline);
      }

      // Smoothly re-center map bounds to active destination
      try {
        const bounds = L.latLngBounds(latlngs);
        map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 13, duration: 1.2 });
      } catch (err) {
        console.error('Failed to fit map bounds:', err);
      }
    }

    // 2. Draw Hazard Zones (PostGIS Polygons)
    layersRef.current.hazards.clearLayers();
    if (showHazards && hazardZones) {
      hazardZones.forEach((hz) => {
        const isTriggered = hz.id === activeHazardId;
        const polygonLatLngs: L.LatLngExpression[] = hz.polygon_coordinates.map((c) => [c[1], c[0]]);

        const polygon = L.polygon(polygonLatLngs, {
          color: isTriggered ? '#ef4444' : '#f97316',
          fillColor: isTriggered ? '#ef4444' : '#ea580c',
          fillOpacity: isTriggered ? 0.45 : 0.25,
          weight: isTriggered ? 3 : 1.5,
          dashArray: isTriggered ? '4, 4' : undefined,
        });

        polygon.on('click', () => {
          setSelectedItem({ type: 'HAZARD', data: hz });
        });

        polygon.bindTooltip(`⚠️ ${hz.name}`, {
          sticky: true,
          className: 'bg-slate-950 text-orange-300 text-xs px-2 py-1 rounded border border-orange-500/50',
        });

        layersRef.current.hazards.addLayer(polygon);
      });
    }

    // 3. Draw Emergency Shelters & Regional Posts
    layersRef.current.shelters.clearLayers();
    if (showShelters && shelters) {
      shelters.forEach((sh) => {
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-icon',
          html: `<div style="background-color: #0284c7; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([sh.lat, sh.lon], { icon: shelterIcon });
        marker.on('click', () => {
          setSelectedItem({ type: 'SHELTER', data: sh });
        });
        marker.bindTooltip(`🛡️ ${sh.name} (Cap: ${sh.capacity_persons})`, {
          direction: 'top',
          offset: [0, -12],
          className: 'bg-slate-900 text-sky-200 text-xs px-2 py-1 rounded border border-sky-600',
        });
        layersRef.current.shelters.addLayer(marker);
      });
    }

    // 4. Draw Checkpoint Markers
    layersRef.current.checkpoints.clearLayers();
    if (showCheckpoints && checkpoints) {
      checkpoints.forEach((cp, idx) => {
        const isEnd = idx === checkpoints.length - 1;
        const isStart = idx === 0;

        const markerColor = isEnd ? '#eab308' : isStart ? '#10b981' : '#64748b';
        const checkpointIcon = L.divIcon({
          className: 'custom-cp-icon',
          html: `<div style="background-color: ${markerColor}; color: black; font-weight: 800; font-size: 11px; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.4);">${idx + 1}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([cp.lat, cp.lon], { icon: checkpointIcon });
        marker.on('click', () => {
          setSelectedItem({ type: 'CHECKPOINT', data: cp });
          if (onSelectCheckpoint) onSelectCheckpoint(cp);
        });
        marker.bindTooltip(`${cp.name} (${cp.altitude_m}m)`, {
          direction: 'top',
          offset: [0, -12],
          className: 'bg-slate-900 text-slate-100 text-xs px-2 py-1 rounded border border-slate-700',
        });
        layersRef.current.checkpoints.addLayer(marker);
      });
    }

    // 5. Draw Live User Pin
    layersRef.current.user.clearLayers();
    if (userLocation && checkpoints.length > 0) {
      const uLat = checkpoints[0].lat;
      const uLon = checkpoints[0].lon;
      const userIcon = L.divIcon({
        className: 'custom-user-icon',
        html: `<div style="position: relative; width: 24px; height: 24px;"><div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: radar-pulse 2s infinite;"></div><div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; border-radius: 50%; background: #3b82f6; border: 2px solid white; box-shadow: 0 0 10px #3b82f6;"></div></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([uLat, uLon], { icon: userIcon });
      marker.bindTooltip(`📍 You (${checkpoints[0].altitude_m}m)`, { permanent: true, direction: 'right' });
      layersRef.current.user.addLayer(marker);
    }
  }, [
    checkpoints,
    hazardZones,
    shelters,
    mainTrailCoords,
    bypassTrailCoords,
    userLocation,
    activeHazardId,
    isBypassActive,
    showHazards,
    showShelters,
    showCheckpoints,
    onSelectCheckpoint,
    destinationName,
    regionType
  ]);

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl glass-panel">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Layer Toggle Controls Floating Bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
        <button
          onClick={() => setShowHazards(!showHazards)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all shadow-md cursor-pointer ${
            showHazards
              ? 'bg-orange-500/80 text-white border border-orange-400'
              : 'bg-slate-900/80 text-slate-400 border border-slate-700'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Regional Hazards ({hazardZones ? hazardZones.length : 0})</span>
        </button>

        <button
          onClick={() => setShowShelters(!showShelters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all shadow-md cursor-pointer ${
            showShelters
              ? 'bg-sky-600/80 text-white border border-sky-400'
              : 'bg-slate-900/80 text-slate-400 border border-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Emergency Shelters</span>
        </button>

        <button
          onClick={() => setShowCheckpoints(!showCheckpoints)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all shadow-md cursor-pointer ${
            showCheckpoints
              ? 'bg-emerald-600/80 text-white border border-emerald-400'
              : 'bg-slate-900/80 text-slate-400 border border-slate-700'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Checkpoints ({checkpoints ? checkpoints.length : 0})</span>
        </button>
      </div>

      {/* Dynamic Status Banner */}
      {isBypassActive && (
        <div className="absolute top-4 right-4 z-10 max-w-sm glass-panel bg-red-950/80 border-red-500 text-red-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 animate-pulse">
          <AlertOctagon className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <div className="text-xs font-black tracking-wide text-red-300">DYNAMIC REROUTE ACTIVE</div>
            <div className="text-[11px] text-slate-300">Regional hazard spike detected. Safe bypass corridor engaged.</div>
          </div>
        </div>
      )}

      {/* Selection Details Floating Modal Card */}
      {selectedItem && (
        <div className="absolute bottom-6 left-6 z-10 max-w-md w-full glass-panel bg-slate-950/90 border-slate-700/80 p-4 rounded-xl shadow-2xl text-slate-200">
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              {selectedItem.type === 'HAZARD' && <AlertOctagon className="w-5 h-5 text-red-400" />}
              {selectedItem.type === 'SHELTER' && <ShieldCheck className="w-5 h-5 text-sky-400" />}
              {selectedItem.type === 'CHECKPOINT' && <Compass className="w-5 h-5 text-emerald-400" />}
              <span className="font-bold text-sm text-white">{selectedItem.data.name}</span>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {selectedItem.type === 'CHECKPOINT' && (
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Altitude:</span>
                <span className="font-mono font-bold text-emerald-400">{selectedItem.data.altitude_m} meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Oxygen Booth:</span>
                <span className={selectedItem.data.has_oxygen_booth ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  {selectedItem.data.has_oxygen_booth ? '✓ Available (24x7)' : '✗ Not Available'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nearest Emergency Unit:</span>
                <span className="font-mono text-cyan-300">{selectedItem.data.nearest_hospital_dist_km || 0.5} km</span>
              </div>
              <div className="mt-2 pt-1 border-t border-slate-800/80 flex flex-wrap gap-1">
                {(selectedItem.data.facilities || []).map((fac: string, i: number) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300">
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedItem.type === 'HAZARD' && (
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-orange-400">{selectedItem.data.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Severity Level:</span>
                <span className="font-bold text-red-400">{selectedItem.data.severity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Base Hazard Weight:</span>
                <span className="font-mono text-amber-300">{Math.round((selectedItem.data.base_hazard_weight || 0.75) * 100)}%</span>
              </div>
              <p className="text-[11px] text-slate-300 bg-red-950/40 p-2 rounded border border-red-900/50 mt-1">
                {selectedItem.data.historical_incident}
              </p>
            </div>
          )}

          {selectedItem.type === 'SHELTER' && (
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Max Capacity:</span>
                <span className="font-mono font-bold text-sky-400">{selectedItem.data.capacity_persons} Persons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Power & Food:</span>
                <span className="text-emerald-400 font-semibold">✓ Verified Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Helpline:</span>
                <span className="font-mono text-amber-300">{selectedItem.data.contact_phone}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
