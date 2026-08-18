"""
Region-Specific Rule Configurations and Mathematical Weights for SafeTrail AI.
Encapsulates region-specific weights, hazard thresholds, curfew limits, and regional emergency agencies.
"""
from typing import Dict, Any, List

REGION_CONFIGS: Dict[str, Dict[str, Any]] = {
    "HILL_MOUNTAIN": {
        "id": "HILL_MOUNTAIN",
        "name": "Himalayan & Hill Mountain",
        "name_hi": "पर्वतीय एवं उच्च हिमालयी क्षेत्र",
        "primary_hazards": ["LANDSLIDE", "ALTITUDE_AMS", "CLOUD_BURST", "FLASH_FLOOD", "HYPOTHERMIA"],
        "curfew_time": "17:30 IST",
        "emergency_agency": "SDRF / Mountain Rescue Brigade",
        "risk_thresholds": {
            "low": 35.0,
            "moderate": 65.0,
            "high": 80.0,
            "critical": 100.0
        },
        "weights": {
            "terrain_landslide": 0.30,
            "weather_squall": 0.25,
            "altitude_hypoxia": 0.20,
            "medical_isolation": 0.15,
            "crowd_slowdown": 0.10
        },
        "advisories": [
            "Mandatory acclimatization halt above 2,800m altitude.",
            "Trekking past 17:30 IST is prohibited by State Police due to freezing temperatures.",
            "Carry 1 portable oxygen canister and waterproof alpine gear."
        ]
    },
    "COASTAL_MARINE": {
        "id": "COASTAL_MARINE",
        "name": "Coastal & Marine Sector",
        "name_hi": "तटीय एवं समुद्री क्षेत्र",
        "primary_hazards": ["CYCLONE_SURGE", "HIGH_TIDE", "RIP_CURRENT", "HEAVY_RAIN", "UV_HEAT"],
        "curfew_time": "19:00 IST",
        "emergency_agency": "Indian Coast Guard & Marine Police",
        "risk_thresholds": {
            "low": 35.0,
            "moderate": 65.0,
            "high": 80.0,
            "critical": 100.0
        },
        "weights": {
            "marine_cyclone_tide": 0.35,
            "weather_precipitation": 0.25,
            "rip_current_beach": 0.15,
            "heat_uv_stress": 0.15,
            "crowd_density": 0.10
        },
        "advisories": [
            "Check INCOIS high wave / tidal surge bulletin before entering sea.",
            "Swimming prohibited near red-flagged rip-current sandbars.",
            "Observe Coast Guard cyclone early warning flags."
        ]
    },
    "FOREST_WILDLIFE": {
        "id": "FOREST_WILDLIFE",
        "name": "Forest & Wildlife Sanctuary",
        "name_hi": "वन्यजीव अभयारण्य एवं राष्ट्रीय उद्यान",
        "primary_hazards": ["WILDLIFE_CONFLICT", "FOREST_FIRE", "MONSOON_RIVER_FLOOD", "ISOLATION"],
        "curfew_time": "17:00 IST",
        "emergency_agency": "Forest Protection Force & Rapid Response Team",
        "risk_thresholds": {
            "low": 35.0,
            "moderate": 65.0,
            "high": 80.0,
            "critical": 100.0
        },
        "weights": {
            "wildlife_corridor": 0.30,
            "forest_fire_fsi": 0.25,
            "weather_flash_flood": 0.20,
            "remote_isolation": 0.20,
            "permit_bottleneck": 0.05
        },
        "advisories": [
            "Strict entry curfew after 17:00 IST. Alighting from safari vehicle is illegal.",
            "Avoid designated elephant / tiger migratory corridors.",
            "Forest fire alert (FSI) must be verified before entering remote core sectors."
        ]
    },
    "DESERT_ARID": {
        "id": "DESERT_ARID",
        "name": "Desert & Arid Dune Circuit",
        "name_hi": "मरुस्थलीय एवं शुष्क क्षेत्र",
        "primary_hazards": ["EXTREME_HEAT", "DEHYDRATION", "DUST_STORM", "SAND_IMMOBILIZATION"],
        "curfew_time": "20:00 IST",
        "emergency_agency": "Border Tourism Patrol & Local Administration",
        "risk_thresholds": {
            "low": 35.0,
            "moderate": 65.0,
            "high": 80.0,
            "critical": 100.0
        },
        "weights": {
            "heat_dehydration": 0.40,
            "dust_sandstorm": 0.25,
            "oasis_water_isolation": 0.25,
            "sand_mobility": 0.10
        },
        "advisories": [
            "Avoid outdoor dune traversal between 11:30 AM and 03:30 PM due to extreme UV & heat stress.",
            "Maintain a minimum of 4 litres of electrolyte-enriched water per person per day.",
            "Seek shelter immediately upon visual detection of IMD dust storm fronts."
        ]
    },
    "URBAN_HERITAGE": {
        "id": "URBAN_HERITAGE",
        "name": "Urban Pilgrimage & Heritage City",
        "name_hi": "शहरी तीर्थस्थल एवं ऐतिहासिक धरोहर",
        "primary_hazards": ["CROWD_SURGE", "URBAN_WATERLOGGING", "TRAFFIC_GRIDLOCK", "AIR_QUALITY"],
        "curfew_time": "22:00 IST",
        "emergency_agency": "City Traffic & Quick Reaction Police Command",
        "risk_thresholds": {
            "low": 35.0,
            "moderate": 65.0,
            "high": 80.0,
            "critical": 100.0
        },
        "weights": {
            "crowd_stampede_chokepoint": 0.40,
            "urban_waterlogging": 0.25,
            "emergency_transit_time": 0.20,
            "air_quality_aqi": 0.15
        },
        "advisories": [
            "Avoid narrow river ghats and temple chokepoints during peak aarti / festival surge.",
            "Use pre-booked biometric darshan queues to avoid stampede bottlenecks.",
            "Follow designated municipal one-way pedestrian corridors."
        ]
    }
}

class RegionRuleManager:
    """
    Manager class to retrieve and inspect modular regional safety rules and configurations.
    """
    @classmethod
    def get_profile(cls, region_type: str) -> Dict[str, Any]:
        return REGION_CONFIGS.get(region_type, REGION_CONFIGS["HILL_MOUNTAIN"])

    @classmethod
    def get_weights(cls, region_type: str) -> Dict[str, float]:
        profile = cls.get_profile(region_type)
        return profile.get("weights", {})

    @classmethod
    def get_curfew(cls, region_type: str) -> str:
        profile = cls.get_profile(region_type)
        return profile.get("curfew_time", "18:00 IST")

    @classmethod
    def get_all_configs(cls) -> Dict[str, Dict[str, Any]]:
        return REGION_CONFIGS
