import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { Checkpoint, HazardZone, EmergencyShelter } from '../../types';
import { ShieldCheck, AlertOctagon, Compass, MapPin, Globe, X } from 'lucide-react';
import { t, getLocalizedDestinationName } from '../../services/i18n';

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
  previewCoordinates?: { lat: number; lon: number; name?: string } | null;
  language?: string;
  onResetToIndia?: () => void;
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
  destinationName = '',
  regionType = 'HILL_MOUNTAIN',
  previewCoordinates = null,
  language = 'en',
  onResetToIndia,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [showHazards, setShowHazards] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showCheckpoints, setShowCheckpoints] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const lastFlownKeyRef = useRef<string>('');

  // Initialize Leaflet Map centered on India by default
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.8000, 79.5000],
        zoom: 4.8,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Official OpenStreetMap standard tiles (100% Free, Open Source, Never Requires API Key)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
        maxZoom: 19,
      }).addTo(map);

      layersRef.current.trails = L.layerGroup().addTo(map);
      layersRef.current.hazards = L.layerGroup().addTo(map);
      layersRef.current.shelters = L.layerGroup().addTo(map);
      layersRef.current.checkpoints = L.layerGroup().addTo(map);
      layersRef.current.preview = L.layerGroup().addTo(map);
      layersRef.current.user = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Centering & Render Elements when destination/coords change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Draw Main Trail Polyline & Fit Bounds if itinerary is active
    layersRef.current.trails.clearLayers();
    if (mainTrailCoords && mainTrailCoords.length > 0) {
      layersRef.current.preview.clearLayers();

      const latlngs: L.LatLngExpression[] = mainTrailCoords.map((c) => [c[1], c[0]]);
      
      const trailPolyline = L.polyline(latlngs, {
        color: isBypassActive ? '#f97316' : '#10b981',
        weight: 4,
        opacity: 0.9,
        dashArray: isBypassActive ? '6, 6' : undefined,
        lineCap: 'round',
        lineJoin: 'round',
      });
      trailPolyline.bindTooltip(isBypassActive ? 'Main Route (Degraded)' : `Safe Route (${destinationName})`, {
        sticky: true,
        className: 'bg-slate-900 text-slate-100 text-xs px-2 py-1 rounded border border-slate-700',
      });
      layersRef.current.trails.addLayer(trailPolyline);

      // Draw Bypass if active
      if (isBypassActive && bypassTrailCoords && bypassTrailCoords.length > 0) {
        const bypassLatLngs: L.LatLngExpression[] = bypassTrailCoords.map((c) => [c[1], c[0]]);
        const bypassPolyline = L.polyline(bypassLatLngs, {
          color: '#38bdf8',
          weight: 4,
          opacity: 1.0,
          lineCap: 'round',
        });
        bypassPolyline.bindTooltip('SAFE BYPASS CORRIDOR', {
          permanent: true,
          direction: 'top',
          className: 'bg-sky-950 text-sky-200 text-xs font-bold px-2 py-1 rounded border border-sky-500',
        });
        layersRef.current.trails.addLayer(bypassPolyline);
      }

      // Smoothly re-center map bounds once per trail update
      const trailKey = `trail-${mainTrailCoords.length}-${mainTrailCoords[0]?.[0]}-${mainTrailCoords[0]?.[1]}`;
      if (lastFlownKeyRef.current !== trailKey) {
        lastFlownKeyRef.current = trailKey;
        try {
          const bounds = L.latLngBounds(latlngs);
          map.stop();
          map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 13, duration: 1.2 });
        } catch (err) {
          console.error('Failed to fit map bounds:', err);
        }
      }
    } else if (previewCoordinates && previewCoordinates.lat && previewCoordinates.lon) {
      layersRef.current.preview.clearLayers();
      layersRef.current.hazards.clearLayers();
      layersRef.current.shelters.clearLayers();
      layersRef.current.checkpoints.clearLayers();

      const previewIcon = L.divIcon({
        className: 'custom-preview-icon',
        html: `
          <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
            <div class="target-beacon-pulse" style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(16, 185, 129, 0.4);"></div>
            <div style="position: relative; z-index: 10; width: 16px; height: 16px; border-radius: 50%; background: #10b981; border: 2px solid white; display: flex; align-items: center; justify-content: center;">
              <div style="width: 4px; height: 4px; border-radius: 50%; background: white;"></div>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([previewCoordinates.lat, previewCoordinates.lon], { icon: previewIcon });
      marker.bindTooltip(`${previewCoordinates.name || 'Selected Destination'}`, {
        permanent: true,
        direction: 'top',
        offset: [0, -10],
        className: 'bg-slate-950 text-emerald-300 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-500/40',
      });
      layersRef.current.preview.addLayer(marker);

      const previewKey = `preview-${previewCoordinates.lat.toFixed(4)}-${previewCoordinates.lon.toFixed(4)}`;
      if (lastFlownKeyRef.current !== previewKey) {
        lastFlownKeyRef.current = previewKey;
        map.stop();
        map.flyTo([previewCoordinates.lat, previewCoordinates.lon], 12, {
          duration: 1.2,
        });
      }
    } else {
      layersRef.current.preview.clearLayers();
      layersRef.current.trails.clearLayers();
      layersRef.current.hazards.clearLayers();
      layersRef.current.shelters.clearLayers();
      layersRef.current.checkpoints.clearLayers();

      if (lastFlownKeyRef.current !== 'india-overview') {
        lastFlownKeyRef.current = 'india-overview';
        map.stop();
        map.flyTo([22.8000, 79.5000], 4.8, { duration: 1.2 });
      }
    }

    // 2. Draw Hazard Zones (Polygons)
    layersRef.current.hazards.clearLayers();
    if (showHazards && hazardZones) {
      hazardZones.forEach((hz) => {
        const isTriggered = hz.id === activeHazardId;
        const polygonLatLngs: L.LatLngExpression[] = hz.polygon_coordinates.map((c) => [c[1], c[0]]);

        const polygon = L.polygon(polygonLatLngs, {
          color: isTriggered ? '#ef4444' : '#f97316',
          fillColor: isTriggered ? '#ef4444' : '#ea580c',
          fillOpacity: isTriggered ? 0.35 : 0.2,
          weight: isTriggered ? 2 : 1,
          dashArray: isTriggered ? '4, 4' : undefined,
        });

        polygon.on('click', () => {
          setSelectedItem({ type: 'HAZARD', data: hz });
        });

        polygon.bindTooltip(`${hz.name}`, {
          sticky: true,
          className: 'bg-slate-950 text-orange-300 text-xs px-2 py-0.5 rounded border border-orange-500/40',
        });

        layersRef.current.hazards.addLayer(polygon);
      });
    }

    // 3. Draw Emergency Shelters
    layersRef.current.shelters.clearLayers();
    if (showShelters && shelters) {
      shelters.forEach((sh) => {
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-icon',
          html: `<div style="background-color: #0284c7; width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid white; display: flex; align-items: center; justify-content: center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([sh.lat, sh.lon], { icon: shelterIcon });
        marker.on('click', () => {
          setSelectedItem({ type: 'SHELTER', data: sh });
        });
        marker.bindTooltip(`${sh.name} (${sh.capacity_persons}p)`, {
          direction: 'top',
          offset: [0, -10],
          className: 'bg-slate-900 text-sky-200 text-xs px-2 py-0.5 rounded border border-sky-600',
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

        const markerColor = isEnd ? '#eab308' : isStart ? '#10b981' : '#475569';
        const checkpointIcon = L.divIcon({
          className: 'custom-cp-icon',
          html: `<div style="background-color: ${markerColor}; color: white; font-weight: 700; font-size: 10px; width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid white; display: flex; align-items: center; justify-content: center;">${idx + 1}</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([cp.lat, cp.lon], { icon: checkpointIcon });
        marker.on('click', () => {
          setSelectedItem({ type: 'CHECKPOINT', data: cp });
          if (onSelectCheckpoint) onSelectCheckpoint(cp);
        });
        marker.bindTooltip(`${cp.name} (${cp.altitude_m}m)`, {
          direction: 'top',
          offset: [0, -10],
          className: 'bg-slate-900 text-slate-100 text-xs px-2 py-0.5 rounded border border-slate-700',
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
        html: `<div style="position: relative; width: 20px; height: 20px;"><div style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background: rgba(59, 130, 246, 0.4); animation: radar-pulse 2s infinite;"></div><div style="position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #3b82f6; border: 1.5px solid white;"></div></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([uLat, uLon], { icon: userIcon });
      marker.bindTooltip(`You (${checkpoints[0].altitude_m}m)`, { permanent: true, direction: 'right' });
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
    regionType,
    previewCoordinates,
  ]);

  const hasActiveTrail = mainTrailCoords && mainTrailCoords.length > 0;
  const isPreviewing = previewCoordinates && previewCoordinates.lat;

  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-full flex-1 rounded-xl overflow-hidden border border-white/[0.08] glass-panel flex flex-col">
      <div ref={mapContainerRef} className="w-full h-full min-h-[520px] flex-1 z-0" />

      {/* Layer Toggle Controls Floating Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[70%] sm:max-w-none">
        {hasActiveTrail && (
          <>
            <button
              onClick={() => setShowHazards(!showHazards)}
              className={`btn-tactile flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-md cursor-pointer border ${
                showHazards
                  ? 'bg-orange-950/80 text-orange-200 border-orange-500/40'
                  : 'bg-[#090a0f]/90 text-slate-400 border-white/[0.08]'
              }`}
            >
              <AlertOctagon className="w-3 h-3 text-orange-400" />
              <span>{language === 'hi' ? 'खतरे' : 'Hazards'} ({hazardZones ? hazardZones.length : 0})</span>
            </button>

            <button
              onClick={() => setShowShelters(!showShelters)}
              className={`btn-tactile flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-md cursor-pointer border ${
                showShelters
                  ? 'bg-sky-950/80 text-sky-200 border-sky-500/40'
                  : 'bg-[#090a0f]/90 text-slate-400 border-white/[0.08]'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              <span>{language === 'hi' ? 'आश्रय स्थल' : 'Shelters'} ({shelters ? shelters.length : 0})</span>
            </button>

            <button
              onClick={() => setShowCheckpoints(!showCheckpoints)}
              className={`btn-tactile flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium backdrop-blur-md cursor-pointer border ${
                showCheckpoints
                  ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40'
                  : 'bg-[#090a0f]/90 text-slate-400 border-white/[0.08]'
              }`}
            >
              <Compass className="w-3 h-3 text-emerald-400" />
              <span>{language === 'hi' ? 'चेकपॉइंट' : 'Points'} ({checkpoints ? checkpoints.length : 0})</span>
            </button>
          </>
        )}

        {(hasActiveTrail || isPreviewing) && onResetToIndia && (
          <button
            type="button"
            onClick={onResetToIndia}
            className="btn-tactile flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#090a0f]/95 hover:bg-[#151928] text-slate-200 border border-white/[0.08] backdrop-blur-md cursor-pointer"
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>{t('btn_reset_india', language)}</span>
          </button>
        )}
      </div>

      {/* Top Right Floating Status Pill */}
      <div className="absolute top-3 right-3 z-10 max-w-[45%] sm:max-w-sm">
        {isBypassActive ? (
          <div className="bg-red-950/90 border border-red-500/50 text-red-200 px-3 py-1.5 rounded-md flex items-center gap-2 text-xs">
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
            <div className="min-w-0 font-semibold font-mono">
              {language === 'hi' ? 'बाईपास मार्ग सक्रिय' : 'REROUTE ACTIVE'}
            </div>
          </div>
        ) : hasActiveTrail ? (
          <div className="bg-[#090a0f]/90 border border-white/[0.08] text-slate-200 px-3 py-1.5 rounded-md flex items-center gap-2 text-xs backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[120px] font-medium">{getLocalizedDestinationName(destinationName, language)}</span>
          </div>
        ) : isPreviewing ? (
          <div className="bg-[#090a0f]/90 border border-sky-500/40 text-sky-200 px-3 py-1.5 rounded-md flex items-center gap-2 text-xs backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-semibold text-white truncate">{getLocalizedDestinationName(previewCoordinates?.name || '', language)}</span>
          </div>
        ) : (
          <div className="bg-[#090a0f]/90 border border-white/[0.08] text-slate-300 px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs backdrop-blur-md">
            <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{language === 'hi' ? 'अखिल भारतीय' : 'Pan-India Grid'}</span>
          </div>
        )}
      </div>

      {/* Selection Details Floating Modal Card */}
      {selectedItem && (
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm w-auto z-20 bg-[#0e1017]/95 border border-white/[0.12] p-3 rounded-lg shadow-xl text-slate-200 backdrop-blur-xl animate-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2 border-b border-white/[0.08] pb-2 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              {selectedItem.type === 'HAZARD' && <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />}
              {selectedItem.type === 'SHELTER' && <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />}
              {selectedItem.type === 'CHECKPOINT' && <Compass className="w-4 h-4 text-emerald-400 shrink-0" />}
              <span className="font-semibold text-xs text-white truncate">{selectedItem.data.name}</span>
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {selectedItem.type === 'CHECKPOINT' && (
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Altitude:</span>
                <span className="font-mono font-medium text-emerald-400">{selectedItem.data.altitude_m}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Oxygen Booth:</span>
                <span className={selectedItem.data.has_oxygen_booth ? 'text-emerald-400' : 'text-slate-500'}>
                  {selectedItem.data.has_oxygen_booth ? 'Available (24x7)' : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Unit:</span>
                <span className="font-mono text-slate-300">{selectedItem.data.nearest_hospital_dist_km || 0.5} km</span>
              </div>
              <div className="mt-2 pt-1 border-t border-white/[0.06] flex flex-wrap gap-1">
                {(selectedItem.data.facilities || []).map((fac: string, i: number) => (
                  <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300">
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedItem.type === 'HAZARD' && (
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-medium text-orange-400">{selectedItem.data.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Severity:</span>
                <span className="font-medium text-red-400">{selectedItem.data.severity}</span>
              </div>
              <p className="text-[11px] text-slate-300 bg-red-950/30 p-1.5 rounded border border-red-900/40 mt-1">
                {selectedItem.data.historical_incident}
              </p>
            </div>
          )}

          {selectedItem.type === 'SHELTER' && (
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Capacity:</span>
                <span className="font-mono font-medium text-sky-400">{selectedItem.data.capacity_persons} Persons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Helpline:</span>
                <span className="font-mono text-slate-300">{selectedItem.data.contact_phone}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
