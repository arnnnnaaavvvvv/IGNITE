from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter(prefix="/simulation", tags=["Pan-India Disaster Simulation Bench"])

PAN_INDIA_SIMULATION_SCENARIOS = [
    {
        "id": "scenario_himalaya_cloudburst",
        "title": "Himalayan Cloudburst & Landslide (Kedarnath / Manali)",
        "title_hi": "हिमालयी बादल फटना एवं भूस्खलन",
        "destination_match": "Kedarnath",
        "region_type": "HILL_MOUNTAIN",
        "description": "Intense 42mm/hr flash rainfall with IMD Red Alert. Landslide breach triggers emergency reroute to Upper Ridge bypass.",
        "weather": {
            "precipitation_mm_hr": 42.0,
            "wind_speed_kmh": 45.0,
            "temperature_c": 6.0,
            "visibility_km": 0.8,
            "imd_alert": "RED"
        },
        "hazard_active": True,
        "expected_risk_category": "CRITICAL"
    },
    {
        "id": "scenario_coastal_cyclone",
        "title": "Bay of Bengal Cyclone & Tidal Surge (Puri / Golden Beach)",
        "title_hi": "बंगाल की खाड़ी चक्रवात एवं समुद्री लहरें (पुरी)",
        "destination_match": "Puri",
        "region_type": "COASTAL_MARINE",
        "description": "INCOIS High Wave alert (3.8m storm surge) and 65km/h gale winds. Marine police enforce mandatory beach evacuation to Multi-Purpose Cyclone Shelter.",
        "weather": {
            "precipitation_mm_hr": 35.0,
            "wind_speed_kmh": 68.0,
            "temperature_c": 27.0,
            "visibility_km": 1.2,
            "imd_alert": "RED"
        },
        "hazard_active": True,
        "expected_risk_category": "CRITICAL"
    },
    {
        "id": "scenario_kaziranga_flood",
        "title": "Brahmaputra River Surge & Animal Corridor Flood (Kaziranga)",
        "title_hi": "ब्रह्मपुत्र नदी बाढ़ एवं वन्यजीव पलायन (काजीरंगा)",
        "destination_match": "Kaziranga",
        "region_type": "FOREST_WILDLIFE",
        "description": "Central Water Commission flood level breach. Safari routes diverted to artificial high-ground ridges with armed forest escort.",
        "weather": {
            "precipitation_mm_hr": 28.0,
            "wind_speed_kmh": 24.0,
            "temperature_c": 24.0,
            "visibility_km": 2.5,
            "imd_alert": "ORANGE"
        },
        "hazard_active": True,
        "expected_risk_category": "HIGH"
    },
    {
        "id": "scenario_thar_heatwave",
        "title": "Thar Desert 46°C Extreme Heat & Dust Storm (Jaisalmer)",
        "title_hi": "थार मरुस्थल भीषण लू एवं अंधड़ (जैसलमेर)",
        "destination_match": "Jaisalmer",
        "region_type": "DESERT_ARID",
        "description": "IMD Severe Heatwave Red Alert (46°C) with 40km/h blinding sandstorm. Outdoor dune traversal halted; tourists guided to RTDC emergency shelter.",
        "weather": {
            "precipitation_mm_hr": 0.0,
            "wind_speed_kmh": 44.0,
            "temperature_c": 46.0,
            "visibility_km": 0.6,
            "imd_alert": "RED"
        },
        "hazard_active": True,
        "expected_risk_category": "CRITICAL"
    },
    {
        "id": "scenario_clear_baseline",
        "title": "Clear Morning Weather (All Regions)",
        "title_hi": "साफ़ मौसम एवं सामान्य स्थिति",
        "destination_match": "All",
        "region_type": "ALL",
        "description": "Ideal meteorological baseline. Clear skies, normal temperatures, zero active government disaster alerts.",
        "weather": {
            "precipitation_mm_hr": 0.0,
            "wind_speed_kmh": 10.0,
            "temperature_c": 22.0,
            "visibility_km": 10.0,
            "imd_alert": "NONE"
        },
        "hazard_active": False,
        "expected_risk_category": "LOW"
    }
]

@router.get("/scenarios")
async def get_simulation_scenarios():
    """
    Returns multi-region Pan-India disaster scenarios for live testing and demonstration.
    """
    return {"scenarios": PAN_INDIA_SIMULATION_SCENARIOS}
