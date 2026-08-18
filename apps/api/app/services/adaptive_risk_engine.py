from typing import Dict, Any, List, Optional
from shapely.geometry import Point, Polygon
from app.core.region_rules import RegionRuleManager, REGION_CONFIGS

class AdaptiveRiskEngine:
    """
    Pan-India Multi-Region Deterministic Risk Engine.
    Dynamically swaps mathematical formulations and weight vectors based on
    the destination's environmental region type.
    """

    @classmethod
    def evaluate_checkpoint_risk(
        cls,
        checkpoint: Dict[str, Any],
        region_type: str = "HILL_MOUNTAIN",
        hazard_zones: List[Dict[str, Any]] = None,
        weather: Optional[Dict[str, Any]] = None,
        daily_ascent_m: int = 400
    ) -> Dict[str, Any]:
        """
        Evaluates checkpoint safety score (0-100) using the region-specific mathematical model.
        """
        if not weather:
            weather = {
                "precipitation_mm_hr": 0.0,
                "wind_speed_kmh": 12.0,
                "temperature_c": 22.0,
                "visibility_km": 10.0,
                "imd_alert": "NONE"
            }

        hazard_zones = hazard_zones or []
        point = Point(checkpoint["lon"], checkpoint["lat"])
        
        # Spatial hazard intersection test
        in_hazard = False
        matched_hazard_name = "Stable Sector"
        base_hazard_weight = 0.15
        for hz in hazard_zones:
            poly = Polygon(hz["polygon_coordinates"])
            if poly.contains(point) or poly.distance(point) < 0.003:
                in_hazard = True
                matched_hazard_name = hz["name"]
                base_hazard_weight = hz.get("base_hazard_weight", 0.70)
                break

        # Retrieve modular weight configuration
        weights = RegionRuleManager.get_weights(region_type)
        sub_scores = {}
        final_score = 25.0
        
        if region_type == "COASTAL_MARINE":
            sub_scores = cls._compute_coastal_sub_scores(checkpoint, weather, in_hazard, matched_hazard_name, base_hazard_weight)
            w = weights or REGION_CONFIGS["COASTAL_MARINE"]["weights"]
            raw = (
                sub_scores["marine_surge"]["score"] * w.get("marine_cyclone_tide", 0.35) +
                sub_scores["weather_precip"]["score"] * w.get("weather_precipitation", 0.25) +
                sub_scores["rip_current"]["score"] * w.get("rip_current_beach", 0.15) +
                sub_scores["heat_uv"]["score"] * w.get("heat_uv_stress", 0.15) +
                sub_scores["crowd"]["score"] * w.get("crowd_density", 0.10)
            )
            final_score = raw

        elif region_type == "FOREST_WILDLIFE":
            sub_scores = cls._compute_forest_sub_scores(checkpoint, weather, in_hazard, matched_hazard_name, base_hazard_weight)
            w = weights or REGION_CONFIGS["FOREST_WILDLIFE"]["weights"]
            raw = (
                sub_scores["wildlife_corridor"]["score"] * w.get("wildlife_corridor", 0.30) +
                sub_scores["forest_fire_fsi"]["score"] * w.get("forest_fire_fsi", 0.25) +
                sub_scores["weather_flood"]["score"] * w.get("weather_flash_flood", 0.20) +
                sub_scores["isolation"]["score"] * w.get("remote_isolation", 0.20) +
                sub_scores["permit_queue"]["score"] * w.get("permit_bottleneck", 0.05)
            )
            final_score = raw

        elif region_type == "DESERT_ARID":
            sub_scores = cls._compute_desert_sub_scores(checkpoint, weather, in_hazard, matched_hazard_name, base_hazard_weight)
            w = weights or REGION_CONFIGS["DESERT_ARID"]["weights"]
            raw = (
                sub_scores["heat_dehydration"]["score"] * w.get("heat_dehydration", 0.40) +
                sub_scores["dust_sandstorm"]["score"] * w.get("dust_sandstorm", 0.25) +
                sub_scores["water_isolation"]["score"] * w.get("oasis_water_isolation", 0.25) +
                sub_scores["sand_mobility"]["score"] * w.get("sand_mobility", 0.10)
            )
            final_score = raw

        elif region_type == "URBAN_HERITAGE":
            sub_scores = cls._compute_urban_sub_scores(checkpoint, weather, in_hazard, matched_hazard_name)
            w = weights or REGION_CONFIGS["URBAN_HERITAGE"]["weights"]
            raw = (
                sub_scores["crowd_stampede"]["score"] * w.get("crowd_stampede_chokepoint", 0.40) +
                sub_scores["urban_flood"]["score"] * w.get("urban_waterlogging", 0.25) +
                sub_scores["emergency_transit"]["score"] * w.get("emergency_transit_time", 0.20) +
                sub_scores["aqi_pollution"]["score"] * w.get("air_quality_aqi", 0.15)
            )
            final_score = raw

        else: # HILL_MOUNTAIN (Default)
            sub_scores = cls._compute_hill_sub_scores(checkpoint, weather, in_hazard, matched_hazard_name, base_hazard_weight, daily_ascent_m)
            w = weights or REGION_CONFIGS["HILL_MOUNTAIN"]["weights"]
            raw = (
                sub_scores["terrain_landslide"]["score"] * w.get("terrain_landslide", 0.30) +
                sub_scores["weather_squall"]["score"] * w.get("weather_squall", 0.25) +
                sub_scores["altitude_hypoxia"]["score"] * w.get("altitude_hypoxia", 0.20) +
                sub_scores["medical_isolation"]["score"] * w.get("medical_isolation", 0.15) +
                sub_scores["crowd_slowdown"]["score"] * w.get("crowd_slowdown", 0.10)
            )
            final_score = raw

        # Apply IMD/National alert multiplier
        alert = weather.get("imd_alert", "NONE")
        if alert == "RED":
            final_score = min(100.0, max(85.0, final_score * 1.6))
        elif alert == "ORANGE":
            final_score = min(100.0, max(65.0, final_score * 1.3))
        elif alert == "YELLOW":
            final_score = min(100.0, max(40.0, final_score * 1.15))

        final_score = round(min(100.0, final_score), 1)

        # Categorize using modular profile thresholds
        profile = RegionRuleManager.get_profile(region_type)
        thresholds = profile.get("risk_thresholds", {"low": 35.0, "moderate": 65.0, "high": 80.0})

        if final_score <= thresholds["low"]:
            risk_level = "LOW"
            badge_color = "emerald"
        elif final_score <= thresholds["moderate"]:
            risk_level = "MODERATE"
            badge_color = "amber"
        elif final_score <= thresholds["high"]:
            risk_level = "HIGH"
            badge_color = "orange"
        else:
            risk_level = "CRITICAL"
            badge_color = "red"

        return {
            "checkpoint_id": checkpoint["id"],
            "name": checkpoint["name"],
            "name_hi": checkpoint.get("name_hi", checkpoint["name"]),
            "lat": checkpoint["lat"],
            "lon": checkpoint["lon"],
            "altitude_m": checkpoint.get("altitude_m", 100),
            "region_type": region_type,
            "total_risk_score": final_score,
            "risk_level": risk_level,
            "badge_color": badge_color,
            "sub_scores": sub_scores,
            "reroute_needed": final_score > thresholds["moderate"]
        }

    # Region-Specific Sub-Factor Calculations
    @staticmethod
    def _compute_hill_sub_scores(cp, weather, in_hazard, hazard_name, base_weight, daily_ascent):
        precip = weather.get("precipitation_mm_hr", 0.0)
        temp = weather.get("temperature_c", 15.0)
        alt = cp.get("altitude_m", 2000)

        # Terrain / Landslide (0-100)
        t_score = min(100.0, (base_weight * 70.0) + (30.0 if alt > 2500 else 15.0))
        # Weather / Squall
        w_score = min(100.0, precip * 2.5 + weather.get("wind_speed_kmh", 10) * 0.8 + (max(0, 5 - temp) * 4))
        # Altitude / AMS
        a_score = 0.0 if alt < 2500 else min(100.0, ((alt - 2500) / 1500.0) * 50.0 + (daily_ascent / 10.0))
        # Isolation
        i_score = min(100.0, (cp.get("nearest_hospital_dist_km", 2.0) / 12.0) * 100.0)
        # Crowd
        c_score = 20.0

        return {
            "terrain_landslide": {"score": round(t_score, 1), "label": "Landslide & Slope", "details": f"{hazard_name} ({'Inside Hazard' if in_hazard else 'Stable'})"},
            "weather_squall": {"score": round(w_score, 1), "label": "Alpine Weather & Rain", "details": f"Rain: {precip}mm/h, Temp: {temp}°C"},
            "altitude_hypoxia": {"score": round(a_score, 1), "label": "Altitude & Hypoxia (AMS)", "details": f"Elevation: {alt}m (+{daily_ascent}m ascent)"},
            "medical_isolation": {"score": round(i_score, 1), "label": "Emergency Hospital Distance", "details": f"Nearest post: {cp.get('nearest_hospital_dist_km', 1.0)}km"},
            "crowd_slowdown": {"score": round(c_score, 1), "label": "Trail Chokepoint Transit", "details": "Normal trail flow"}
        }

    @staticmethod
    def _compute_coastal_sub_scores(cp, weather, in_hazard, hazard_name, base_weight):
        precip = weather.get("precipitation_mm_hr", 0.0)
        wind = weather.get("wind_speed_kmh", 15.0)
        temp = weather.get("temperature_c", 30.0)

        m_score = min(100.0, (base_weight * 60.0) + (wind * 0.8))
        w_score = min(100.0, precip * 2.2 + wind * 0.7)
        r_score = min(100.0, (70.0 if in_hazard else 25.0) + (wind * 0.5))
        u_score = min(100.0, max(0, temp - 32) * 8.0)
        c_score = 30.0

        return {
            "marine_surge": {"score": round(m_score, 1), "label": "Cyclone & Wave Surge (INCOIS)", "details": f"Tidal risk: {hazard_name}"},
            "weather_precip": {"score": round(w_score, 1), "label": "Coastal Rainfall & Gale", "details": f"Wind: {wind}km/h, Rain: {precip}mm/h"},
            "rip_current": {"score": round(r_score, 1), "label": "Beach Rip-Current Zone", "details": "Red-flagged rip currents near sandbars" if in_hazard else "Lifeguard monitored beach"},
            "heat_uv": {"score": round(u_score, 1), "label": "Tropical Heat & UV Index", "details": f"Temp: {temp}°C (High humidity)"},
            "crowd": {"score": round(c_score, 1), "label": "Promenade & Beach Density", "details": "Moderate tourist flow"}
        }

    @staticmethod
    def _compute_forest_sub_scores(cp, weather, in_hazard, hazard_name, base_weight):
        precip = weather.get("precipitation_mm_hr", 0.0)
        temp = weather.get("temperature_c", 26.0)

        wld_score = min(100.0, (75.0 if in_hazard else 30.0))
        fire_score = min(100.0, (max(0, temp - 35) * 10.0) + (5.0 if precip > 5 else 20.0))
        fld_score = min(100.0, precip * 3.0)
        iso_score = min(100.0, (cp.get("nearest_hospital_dist_km", 5.0) / 15.0) * 100.0)
        prm_score = 15.0

        return {
            "wildlife_corridor": {"score": round(wld_score, 1), "label": "Wildlife Migratory Corridor", "details": f"Zone: {hazard_name} (Armed Forest Escort Active)"},
            "forest_fire_fsi": {"score": round(fire_score, 1), "label": "Forest Fire Risk (FSI MODIS)", "details": "Low fire anomaly index in sector"},
            "weather_flood": {"score": round(fld_score, 1), "label": "Monsoon River Overflow", "details": f"Precipitation: {precip}mm/h"},
            "isolation": {"score": round(iso_score, 1), "label": "Core Forest Range Isolation", "details": f"Nearest ranger post: {cp.get('nearest_hospital_dist_km', 4.0)}km"},
            "permit_queue": {"score": round(prm_score, 1), "label": "Safari Gate Processing", "details": "Regulated vehicle batching"}
        }

    @staticmethod
    def _compute_desert_sub_scores(cp, weather, in_hazard, hazard_name, base_weight):
        temp = weather.get("temperature_c", 38.0)
        wind = weather.get("wind_speed_kmh", 20.0)

        heat_score = min(100.0, max(0, temp - 30) * 6.5)
        dust_score = min(100.0, (wind * 1.5) + (35.0 if in_hazard else 10.0))
        wat_score = min(100.0, (cp.get("nearest_hospital_dist_km", 8.0) / 20.0) * 100.0)
        snd_score = min(100.0, 45.0 if in_hazard else 15.0)

        return {
            "heat_dehydration": {"score": round(heat_score, 1), "label": "Extreme Heat & Dehydration", "details": f"Ambient: {temp}°C (Critical afternoon threshold)"},
            "dust_sandstorm": {"score": round(dust_score, 1), "label": "IMD Sandstorm & Dust Front", "details": f"Wind: {wind}km/h across loose dunes"},
            "water_isolation": {"score": round(wat_score, 1), "label": "Oasis & Hydration Isolation", "details": f"Water point dist: {cp.get('nearest_hospital_dist_km', 5.0)}km"},
            "sand_mobility": {"score": round(snd_score, 1), "label": "Dune Terrain Vehicle Traction", "details": "Soft sand corridor"}
        }

    @staticmethod
    def _compute_urban_sub_scores(cp, weather, in_hazard, hazard_name):
        precip = weather.get("precipitation_mm_hr", 0.0)

        crw_score = 65.0 if in_hazard else 35.0
        fld_score = min(100.0, precip * 3.5)
        trs_score = 30.0
        aqi_score = 45.0

        return {
            "crowd_stampede": {"score": round(crw_score, 1), "label": "Crowd Bottleneck & Surge", "details": "Dense ghat / temple queue formation"},
            "urban_flood": {"score": round(fld_score, 1), "label": "Municipal Waterlogging", "details": f"Rainfall: {precip}mm/h in drainage basin"},
            "emergency_transit": {"score": round(trs_score, 1), "label": "Ambulance Transit Time", "details": "Urban gridlock traffic index"},
            "aqi_pollution": {"score": round(aqi_score, 1), "label": "Air Quality (AQI)", "details": "Moderate particulate level"}
        }
