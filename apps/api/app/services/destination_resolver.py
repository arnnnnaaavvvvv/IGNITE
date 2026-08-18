import math
import httpx
from typing import Dict, Any, List, Optional
from fastapi import HTTPException
from app.core.region_rules import RegionRuleManager, REGION_CONFIGS
from app.services.osm_overpass_service import OSMOverpassService
from app.services.osrm_routing_service import OSRMRoutingService
from app.core.redis_cache import cache_manager

# Sovereign Indian Geographic Bounding Box
INDIA_BOUNDS = {
    "min_lat": 6.0,
    "max_lat": 37.6,
    "min_lon": 68.0,
    "max_lon": 97.5
}

class DestinationResolver:
    """
    100% Destination-Agnostic Place Resolver & Environmental Classifier.
    Geocodes arbitrary place names across India into coordinates, bounding boxes,
    real elevation profiles, Overpass POIs, and OSRM road geometries.
    Enforces strict Indian territory validation and place name disambiguation.
    """

    COASTAL_STATES = {
        "goa", "kerala", "tamil nadu", "andhra pradesh", "odisha", "west bengal",
        "maharashtra", "gujarat", "karnataka", "puducherry", "andaman and nicobar islands",
        "lakshadweep", "daman and diu"
    }

    HILL_STATES = {
        "uttarakhand", "himachal pradesh", "jammu and kashmir", "ladakh", "sikkim",
        "arunachal pradesh", "meghalaya", "nagaland", "manipur", "mizoram", "tripura"
    }

    @classmethod
    def is_within_india(cls, lat: float, lon: float) -> bool:
        """
        Validates if coordinates fall within the sovereign bounds of India.
        """
        return (
            INDIA_BOUNDS["min_lat"] <= lat <= INDIA_BOUNDS["max_lat"] and
            INDIA_BOUNDS["min_lon"] <= lon <= INDIA_BOUNDS["max_lon"]
        )

    @classmethod
    async def search(cls, query: str) -> List[Dict[str, Any]]:
        """
        Instant search across indexed hotspots and live Nominatim suggestions.
        """
        q = query.strip().lower()
        if not q:
            from app.data.pan_india_dataset import PAN_INDIA_DESTINATIONS
            return [
                {
                    "id": d["id"],
                    "canonical_name": d["canonical_name"],
                    "name_hi": d.get("name_hi", d["canonical_name"]),
                    "state_ut": d["state_ut"],
                    "region_type": d["region_type"],
                    "region_name": REGION_CONFIGS[d["region_type"]]["name"],
                    "elevation_m": d["elevation_m"]
                }
                for d in PAN_INDIA_DESTINATIONS
            ]

        # 1. First check pre-seeded catalog
        from app.data.pan_india_dataset import PAN_INDIA_DESTINATIONS
        results = []
        for d in PAN_INDIA_DESTINATIONS:
            if q in d["canonical_name"].lower() or q in d["state_ut"].lower() or q in d["region_type"].lower():
                results.append({
                    "id": d["id"],
                    "canonical_name": d["canonical_name"],
                    "name_hi": d.get("name_hi", d["canonical_name"]),
                    "state_ut": d["state_ut"],
                    "region_type": d["region_type"],
                    "region_name": REGION_CONFIGS[d["region_type"]]["name"],
                    "elevation_m": d["elevation_m"]
                })

        # 2. Query live Nominatim API for dynamic place suggestions across India
        if len(results) < 4:
            try:
                url = "https://nominatim.openstreetmap.org/search"
                params = {
                    "q": f"{query}, India",
                    "format": "json",
                    "addressdetails": 1,
                    "limit": 6,
                    "countrycodes": "in"
                }
                headers = {"User-Agent": "SafeTrail-PanIndia-Safety/2.0"}
                async with httpx.AsyncClient(timeout=3.5) as client:
                    resp = await client.get(url, params=params, headers=headers)
                    if resp.status_code == 200:
                        for hit in resp.json():
                            name = hit.get("name", hit.get("display_name", "").split(",")[0]).strip()
                            addr = hit.get("address", {})
                            state = addr.get("state", addr.get("county", "India"))
                            lat = float(hit["lat"])
                            lon = float(hit["lon"])
                            
                            # Ensure within India
                            if not cls.is_within_india(lat, lon):
                                continue

                            reg_type = cls._classify_region(name, lat, lon, state, 100)
                            
                            if not any(r["canonical_name"].lower() == name.lower() and r.get("state_ut", "").lower() == state.lower() for r in results):
                                results.append({
                                    "id": f"dest_{name.lower().replace(' ', '_')}_{state.lower().replace(' ', '_')[:4]}",
                                    "canonical_name": f"{name} ({state})",
                                    "name_hi": name,
                                    "state_ut": state,
                                    "region_type": reg_type,
                                    "region_name": REGION_CONFIGS[reg_type]["name"],
                                    "elevation_m": 150,
                                    "lat": lat,
                                    "lon": lon
                                })
            except Exception as e:
                print(f"[DestinationResolver] Live search suggestion fallback: {e}")

        return results[:8]

    @classmethod
    async def search_with_disambiguation(cls, query: str) -> Dict[str, Any]:
        """
        Disambiguates place names that have multiple occurrences in different Indian States
        (e.g., 'Bilaspur', 'Rampur', 'Aurangabad').
        """
        matches = await cls.search(query)
        is_ambiguous = len(matches) > 1 and len(set(m.get("state_ut") for m in matches)) > 1
        
        return {
            "query": query,
            "is_ambiguous": is_ambiguous,
            "match_count": len(matches),
            "candidates": matches,
            "suggested_action": "SELECT_CANDIDATE" if is_ambiguous else "AUTO_RESOLVE"
        }

    @classmethod
    async def resolve(cls, query: str) -> Dict[str, Any]:
        """
        Resolves any arbitrary user-entered Indian place name to a complete destination data package.
        Validates boundaries and prevents non-Indian location leaks.
        """
        q = query.strip().lower()

        # Check Cache
        cache_key = f"dest:resolve:{q}"
        cached = await cache_manager.get_json(cache_key)
        if cached:
            return cached

        # 1. Match in known pre-seeded database
        from app.data.pan_india_dataset import PAN_INDIA_DESTINATIONS
        for d in PAN_INDIA_DESTINATIONS:
            if q == d["canonical_name"].lower() or d["id"] == query or q == d["id"] or q == d["canonical_name"].lower().split()[0]:
                profile = RegionRuleManager.get_profile(d["region_type"])
                res = {
                    **d,
                    "region_profile": profile,
                    "is_dynamically_geocoded": False
                }
                await cache_manager.set_json(cache_key, res, ttl_seconds=86400)
                return res

        # 2. Dynamic Geocoding via Nominatim API + Open-Meteo Elevation + Overpass + OSRM
        geocoded = await cls._geocode_arbitrary_place(query)
        if geocoded:
            await cache_manager.set_json(cache_key, geocoded, ttl_seconds=86400)
            return geocoded

        # 3. Default fallback to safe baseline
        default_dest = PAN_INDIA_DESTINATIONS[0]
        res = {
            **default_dest,
            "region_profile": RegionRuleManager.get_profile(default_dest["region_type"]),
            "is_dynamically_geocoded": False
        }
        return res

    @classmethod
    async def _fetch_real_elevation(cls, lat: float, lon: float) -> float:
        """
        Queries Open-Meteo elevation API for real elevation in meters.
        """
        try:
            url = f"https://api.open-meteo.com/v1/elevation?latitude={lat}&longitude={lon}"
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(url)
                if resp.status_code == 200:
                    elevations = resp.json().get("elevation", [])
                    if elevations:
                        return float(elevations[0])
        except Exception as e:
            print(f"[DestinationResolver] Open-Meteo elevation query notice: {e}")
        return 150.0

    @classmethod
    async def _geocode_arbitrary_place(cls, place_name: str) -> Optional[Dict[str, Any]]:
        """
        Geocodes any Indian place, enforces Indian territorial boundaries,
        queries real elevation, Overpass for live hospitals/police, and computes OSRM route.
        """
        lat, lon, name, state = 28.6139, 77.2090, place_name.title(), "India"
        boundingbox = [lat - 0.05, lat + 0.05, lon - 0.05, lon + 0.05]
        found_hit = False

        try:
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                "q": f"{place_name}, India",
                "format": "json",
                "addressdetails": 1,
                "limit": 5,
                "countrycodes": "in"
            }
            headers = {"User-Agent": "SafeTrail-PanIndia-Safety/2.0"}
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(url, params=params, headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    if data:
                        # Prioritize tourism, natural, place, boundary, leisure, historic over food stalls/shops
                        best_hit = data[0]
                        for candidate in data:
                            c_class = candidate.get("class", "")
                            c_type = candidate.get("type", "")
                            if c_class in ["tourism", "natural", "place", "boundary", "leisure", "historic", "waterway"]:
                                best_hit = candidate
                                break
                            elif c_class not in ["shop", "amenity"] and c_type not in ["fast_food", "restaurant", "cafe"]:
                                best_hit = candidate

                        hit = best_hit
                        lat = float(hit["lat"])
                        lon = float(hit["lon"])
                        name = hit.get("name", hit.get("display_name", "").split(",")[0]).strip() or place_name.title()
                        addr = hit.get("address", {})
                        state = addr.get("state", addr.get("county", "India"))
                        if "boundingbox" in hit:
                            bb = hit["boundingbox"]
                            boundingbox = [float(bb[0]), float(bb[1]), float(bb[2]), float(bb[3])]
                        found_hit = True
        except Exception as e:
            print(f"[DestinationResolver] Nominatim geocode exception: {e}")

        # Check territorial boundary constraint
        if found_hit and not cls.is_within_india(lat, lon):
            raise HTTPException(
                status_code=400,
                detail=f"Location '{place_name}' (GPS: {lat:.2f}, {lon:.2f}) is outside Indian sovereign territory. SafeTrail AI covers all 28 States and 8 UTs of India."
            )

        # Fetch real elevation from Open-Meteo
        real_elevation = await cls._fetch_real_elevation(lat, lon)

        # Classify region based on rules, real elevation, state, and geographic heuristics
        region_type = cls._classify_region(name, lat, lon, state, real_elevation)
        profile = RegionRuleManager.get_profile(region_type)
        
        # Query Overpass for live real-world emergency amenities around these exact coordinates
        amenities = await OSMOverpassService.get_emergency_amenities_nearby(lat, lon, radius_m=15000)
        hospitals = amenities.get("hospitals", [])
        shelters = amenities.get("shelters", [])

        elevation_m = int(round(real_elevation))

        # Build dynamic sequential checkpoints around resolved destination
        cps = [
            {
                "id": "cp_dyn_origin",
                "name": f"{name} Entry & Transit Hub",
                "name_hi": f"{name} प्रवेश केंद्र",
                "lat": round(lat - 0.02, 5),
                "lon": round(lon - 0.02, 5),
                "altitude_m": max(10, elevation_m - 30),
                "facilities": ["Tourist Info", "First Aid", "Police Post"],
                "has_oxygen_booth": region_type == "HILL_MOUNTAIN" and elevation_m > 2500,
                "nearest_hospital_dist_km": hospitals[0]["distance_km"] if hospitals else 1.2,
                "nearest_sdrf_dist_km": 1.0
            },
            {
                "id": "cp_dyn_center",
                "name": f"{name} Central Landmark",
                "name_hi": f"{name} केंद्रीय स्थल",
                "lat": round(lat, 5),
                "lon": round(lon, 5),
                "altitude_m": elevation_m,
                "facilities": ["Tourist Reception", "Water Station", "Dispensary"],
                "has_oxygen_booth": region_type == "HILL_MOUNTAIN" and elevation_m > 2500,
                "nearest_hospital_dist_km": 0.8,
                "nearest_sdrf_dist_km": 0.5
            },
            {
                "id": "cp_dyn_viewpoint",
                "name": f"{name} Scenic Ridge / Promenade",
                "name_hi": f"{name} व्यू पॉइंट",
                "lat": round(lat + 0.02, 5),
                "lon": round(lon + 0.02, 5),
                "altitude_m": elevation_m + 50,
                "facilities": ["Emergency Shelter", "Wireless Station"],
                "has_oxygen_booth": False,
                "nearest_hospital_dist_km": 2.5,
                "nearest_sdrf_dist_km": 1.5
            }
        ]

        # Query OSRM for real road polylines
        route_coords = [[cp["lon"], cp["lat"]] for cp in cps]
        osrm_res = await OSRMRoutingService.get_route(route_coords, profile="foot" if region_type == "HILL_MOUNTAIN" else "driving")
        main_trail = [[c[0], c[1], elevation_m] for c in osrm_res["geometry"]]

        # Build dynamic safe bypass trail
        bypass_coords = [
            [cps[0]["lon"], cps[0]["lat"], elevation_m],
            [round(cps[0]["lon"] + 0.015, 5), round(cps[0]["lat"] + 0.015, 5), elevation_m + 15],
            [cps[2]["lon"], cps[2]["lat"], elevation_m + 50]
        ]

        # Dynamic Environmental Hazard Baseline
        primary_hazard = profile["primary_hazards"][0]
        hazard = {
            "id": f"hz_{name.lower().replace(' ', '_')}",
            "name": f"{name} {primary_hazard.replace('_', ' ').title()} Vulnerability Belt",
            "category": primary_hazard,
            "severity": "MODERATE" if elevation_m < 2000 else "HIGH",
            "base_hazard_weight": 0.65,
            "polygon_coordinates": [
                [round(lon - 0.012, 5), round(lat - 0.010, 5)],
                [round(lon + 0.016, 5), round(lat - 0.010, 5)],
                [round(lon + 0.016, 5), round(lat + 0.014, 5)],
                [round(lon - 0.012, 5), round(lat + 0.014, 5)],
                [round(lon - 0.012, 5), round(lat - 0.010, 5)]
            ],
            "historical_incident": f"Environmental baseline hazard for {region_type} ({primary_hazard.replace('_', ' ').title()}) monitored by {profile['emergency_agency']}."
        }

        # Dynamically register into spatial query repository
        from app.core.database import SpatialHazardRepository
        SpatialHazardRepository.register_hazard_zone(hazard)

        # Emergency Shelters
        shelter_records = []
        for sh in shelters[:3]:
            shelter_records.append({
                "id": sh["id"],
                "name": sh["name"],
                "lat": sh["lat"],
                "lon": sh["lon"],
                "capacity_persons": 1000,
                "has_backup_power": True,
                "contact_phone": sh.get("contact_phone", "112")
            })

        return {
            "id": f"dest_{name.lower().replace(' ', '_')}",
            "canonical_name": name,
            "state_ut": state,
            "region_type": region_type,
            "lat": lat,
            "lon": lon,
            "elevation_m": elevation_m,
            "description": f"Destination classified under {profile['name']}. Monitored by {profile['emergency_agency']}.",
            "trail_coords": main_trail,
            "bypass_coords": bypass_coords,
            "checkpoints": cps,
            "hazard_zones": [hazard],
            "shelters": shelter_records,
            "region_profile": profile,
            "boundingbox": boundingbox,
            "is_dynamically_geocoded": True
        }

    @classmethod
    def _classify_region(cls, name: str, lat: float, lon: float, state: str, elevation_m: float = 150.0) -> str:
        """
        Rules-based classification mapping any location in India to 1 of 5 canonical regions:
        HILL_MOUNTAIN, COASTAL_MARINE, FOREST_WILDLIFE, DESERT_ARID, URBAN_HERITAGE.
        """
        name_lower = name.lower()
        state_lower = state.lower()

        # Rule 1: Forest & Wildlife Sanctuaries
        forest_keywords = [
            "national park", "tiger", "sanctuary", "forest", "wildlife", "safari", "jungle",
            "kaziranga", "corbett", "gir", "kanha", "bandhavgarh", "periyar", "sundarbans",
            "coorg", "wayanad", "mudumalai", "tadoba", "nagarhole", "ranthambore", "kabini", "simlipal"
        ]
        if any(kw in name_lower for kw in forest_keywords):
            return "FOREST_WILDLIFE"

        # Rule 2: Coastal & Marine Regions
        coastal_keywords = [
            "beach", "coast", "sea", "marine", "puri", "goa", "dhanushkodi", "rameshwaram",
            "kovalam", "varkala", "digha", "alibaug", "gokarna", "andaman", "nicobar",
            "pondicherry", "puducherry", "kochi", "cochin", "mangalore", "kanyakumari", "marina beach"
        ]
        if any(kw in name_lower for kw in coastal_keywords):
            return "COASTAL_MARINE"
        if elevation_m <= 45.0 and any(cs in state_lower for cs in cls.COASTAL_STATES):
            if any(kw in name_lower for kw in ["port", "harbor", "island", "bay", "lighthouse", "cove"]):
                return "COASTAL_MARINE"

        # Rule 3: Desert & Arid Dune Circuit
        desert_keywords = [
            "desert", "sand", "dune", "jaisalmer", "bikaner", "kutch", "barmer", "thar",
            "pushkar", "jodhpur", "sam sand dunes", "khuri", "osian"
        ]
        if any(kw in name_lower for kw in desert_keywords):
            return "DESERT_ARID"
        if (("rajasthan" in state_lower or "gujarat" in state_lower) and
            lat >= 24.5 and lat <= 29.5 and lon >= 69.5 and lon <= 74.5 and elevation_m < 400.0):
            return "DESERT_ARID"

        # Rule 4: Himalayan & Hill Mountain
        hill_keywords = [
            "trek", "valley", "pass", "peak", "western ghats", "eastern ghats", "hill", "kedarnath", "badrinath", "manali",
            "shimla", "munnar", "ooty", "kodaikanal", "darjeeling", "gangtok", "mussoorie",
            "nainital", "leh", "ladakh", "kaza", "spiti", "kullu", "dharamshala", "tawang",
            "pahalgam", "gulmarg", "sonamarg", "rishikesh", "mount", "range", "altitude"
        ]
        if elevation_m >= 900.0 or any(hs in state_lower for hs in cls.HILL_STATES) or (elevation_m >= 500.0 and any(kw in name_lower for kw in hill_keywords)) or any(kw in name_lower for kw in ["trek", "himalaya", "peak", "valley", "pass", "ridge"]):
            return "HILL_MOUNTAIN"
        if lat > 29.0 and lon < 80.0 and elevation_m > 600.0:
            return "HILL_MOUNTAIN"

        # Rule 5: Urban & Heritage City (Default)
        return "URBAN_HERITAGE"
