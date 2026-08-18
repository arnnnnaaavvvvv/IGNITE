# 🏆 SafeTrail AI: Judge-Facing One-Pager
### *The Sovereign-Scale, Destination-Agnostic Tourist Safety & Smart Routing System for India*

---

## 🎯 The Core Differentiator
Most hackathon tourism projects are **single-location toys**: they hardcode waypoints, hazard polygons, and rules for a single temple, hill town, or trek (e.g., only Kedarnath or only Manali). When a user enters any other Indian location, they crash, return empty data, or silently claim the region is 100% safe.

**SafeTrail AI solves this fundamentally.**  
It is built from the ground up as a **universal, data-driven safety infrastructure** covering all **28 States and 8 Union Territories of India**. Any tourist can type in any arbitrary landmark, wildlife sanctuary, beach, desert dune, or heritage city, and the platform dynamically resolves the geographic context, applies the exact regional mathematical risk model, and computes real-world escape corridors in real time.

---

## ⚡ 5 Architectural Pillars

### 1. Dynamic Geographic Context Engine
- **OSM Nominatim Geocoding**: Resolves any arbitrary Indian place name to precise coordinates with sovereign Indian bounding-box validation (`6.0°N–37.6°N`, `68.0°E–97.5°E`).
- **Real-World Elevation Sampling**: Integrates Open-Meteo Elevation API to sample ground altitude in meters across India.
- **Dynamic Overpass QL Mesh**: Scans a 15km live radius for genuine hospitals, police posts, and relief shelters around the tourist.

### 2. Multi-Region Mathematical Risk Matrix
SafeTrail AI dynamically swaps mathematical scoring formulations and weight vectors based on **5 Canonical Environmental Classifications**:
- **🏔️ Hill / Mountain**: Landslide (30%), Alpine Weather (25%), AMS Hypoxia (20%), Medical Isolation (15%), Trail Bottlenecks (10%). Curfew: 17:30 IST.
- **🏖️ Coastal / Marine**: Cyclone/Wave Surge (35%), Precipitation/Gale (25%), Rip Currents (15%), UV/Heat (15%), Beach Density (10%). Curfew: 19:00 IST.
- **🐅 Forest / Wildlife**: Wildlife Corridor (30%), FSI Forest Fire (25%), Flash River Flood (20%), Core Isolation (20%), Permit Queue (5%). Curfew: 17:00 IST.
- **🏜️ Desert / Arid**: Heat & Dehydration (40%), Sandstorm Front (25%), Water Point Isolation (25%), Sand Mobility (10%). Curfew: 20:00 IST.
- **🏛️ Urban / Heritage**: Crowd Chokepoints (40%), Waterlogging (25%), Ambulance Transit Time (20%), Air Quality AQI (15%). Curfew: 22:00 IST.

### 3. Active Hazard Geo-Fencing & WebSocket Dynamic Rerouting
- Computes spatial intersections (`ST_Intersects`) between live tourist GPS coordinates and multi-polygon hazard zones.
- When an IMD Red/Orange alert or hazard breach occurs (Risk Score > 65.0), the system automatically triggers an **Emergency Reroute** directive, displaying a **safe topological bypass trail** and routing the tourist to the nearest verified disaster shelter.

### 4. Zero-Network 2G GSM SMS Gateway & Offline Resilience
- In mountain passes or dense forests with zero 4G/5G data, browser **IndexedDB (`SafeTrailOfflineDB`)** stores the complete offline itinerary and map layers.
- The SOS Panic Beacon formats a standard **140-character 2G SMS** payload (`[SOS-ID] GPS:LAT,LON ALT:Xm BAT:X% NAME MED:X HOSP:NAME:Xkm Call:112`) transmitted via GSM cell tower relay.

### 5. Regulated Logistics & 15% Emergency Reserve
- Automatically optimizes day-wise itineraries respecting regional curfews.
- Enforces a mandatory **15% emergency liquidity reserve** ensuring tourists never strand themselves without emergency evacuation funds.

---

## 📊 Live Demo Showcase Scenarios

| Scenario | Injected Hazard | Region Model Engaged | Expected System Response |
| :--- | :--- | :--- | :--- |
| **Himalayan Cloudburst** | 42mm/hr rain, IMD Red Alert | `HILL_MOUNTAIN` | Reroutes from active landslide to upper ridge bypass; directs to SDRF High-Altitude Bunker. |
| **Bay of Bengal Cyclone** | 68km/h gale, 3.8m tidal surge | `COASTAL_MARINE` | Evacuates tourist from sea-surge zone to Multi-Purpose Cyclone Shelter; enforces 19:00 beach curfew. |
| **Brahmaputra Flood** | CWC River surge (28mm/hr rain) | `FOREST_WILDLIFE` | Diverts safari path to artificial high-ground ridge; summons Forest Protection escort. |
| **Thar Desert Heatwave** | 46°C extreme heat, 44km/h dust storm | `DESERT_ARID` | Halts outdoor dune traversal; diverts tourist to RTDC Permanent Desert Shelter. |

---

## 🛡️ Production Readiness & Verification Highlights
- **100% Test Pass Rate**: 24/24 automated unit & security audit tests passed across all 5 region types.
- **Secure by Design**: Cryptographic JWT validation, gateway sliding-window rate limiting, and PostGIS injection defenses.
- **Fast & Scalable**: Asynchronous FastAPI backend with multi-tier Redis TTL caching and non-blocking in-memory fallback.
