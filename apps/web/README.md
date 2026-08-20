# SafeTrail AI — Frontend Web Client

React 18 + Vite + TypeScript web application for **SafeTrail AI: Pan-India Destination-Agnostic Tourist Safety & Smart Route Planner**.

---

## Key Features

- **Dynamic Place Autocomplete**: Search arbitrary Indian destinations with auto-geocoding, state detection, and real ground elevation sampling.
- **Popular Pilgrimage Circuits Tray**: Quick-select tabs and chips for **Char Dham (Cardinal)**, **Chota Char Dham (Himalayan)**, **12 Jyotirlingas**, and **Prominent Shrines** (Ajmer Sharif, Shirdi, Palitana 3,500 Steps, Akshardham).
- **Interactive Multi-Factor Risk Gauge**: Visual breakdown of sub-scores across all 6 environmental classifications (`HILL_MOUNTAIN`, `COASTAL_MARINE`, `FOREST_WILDLIFE`, `DESERT_ARID`, `URBAN_HERITAGE`, `PLAINS_RIVERINE`).
- **Interactive Leaflet Trail & Hazard Map**: Renders live GPS track, PostGIS hazard zones, safe topological bypass corridors, and nearest emergency shelters.
- **IndexedDB (`SafeTrailOfflineDB`) & 2G GSM Fallback**: Full offline caching of itineraries and map layers with 140-character 2G SMS SOS panic payload.
- **Multilingual Voice Explainability**: English & Hindi Web Speech API text-to-speech briefings for safety scores and curfew advisories.
- **Group Mesh Radar & Disaster Simulator**: Real-time group separation tracking and simulated extreme weather injection (cloudbursts, cyclones, floods, heatwaves, crowd surges).

---

## Development

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Type-check and build production bundle
npm run build
```

Production bundle is output to `dist/` and served statically on Vercel.
