import asyncio
import pytest
import jwt
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.core.region_rules import RegionRuleManager, REGION_CONFIGS
from app.services.destination_resolver import DestinationResolver
from app.services.adaptive_risk_engine import AdaptiveRiskEngine
from app.services.sos_service import SOSService
from app.core.database import SpatialHazardRepository

client = TestClient(app)

# -----------------------------------------------------------------------------
# 1. PARAMETRIZED REGION CLASSIFIER & GENERALIZATION TEST
# -----------------------------------------------------------------------------
@pytest.mark.parametrize("place_name,lat,lon,state,elevation_m,expected_region", [
    # 1. Hill / Mountain
    ("Munnar Top Station", 10.0889, 77.0595, "Kerala", 1530.0, "HILL_MOUNTAIN"),
    ("Manali Rohtang Pass", 32.2432, 77.1892, "Himachal Pradesh", 2050.0, "HILL_MOUNTAIN"),
    ("Kedarnath Dham", 30.7352, 79.0669, "Uttarakhand", 3583.0, "HILL_MOUNTAIN"),
    ("Leh Ladakh Circuit", 34.1526, 77.5771, "Ladakh", 3500.0, "HILL_MOUNTAIN"),
    
    # 2. Coastal / Marine
    ("Puri Blue Flag Beach", 19.8135, 85.8312, "Odisha", 10.0, "COASTAL_MARINE"),
    ("Calangute Beach Goa", 15.5440, 73.7554, "Goa", 8.0, "COASTAL_MARINE"),
    ("Kovalam Lighthouse Beach", 8.4004, 76.9787, "Kerala", 12.0, "COASTAL_MARINE"),
    ("Dhanushkodi Marine Point", 9.1770, 79.4180, "Tamil Nadu", 5.0, "COASTAL_MARINE"),
    
    # 3. Forest / Wildlife
    ("Kaziranga Tiger Reserve", 26.5775, 93.1711, "Assam", 80.0, "FOREST_WILDLIFE"),
    ("Jim Corbett Safari", 29.5300, 78.7747, "Uttarakhand", 400.0, "FOREST_WILDLIFE"),
    ("Bandhavgarh National Park", 23.7226, 81.0267, "Madhya Pradesh", 320.0, "FOREST_WILDLIFE"),
    ("Periyar Wildlife Sanctuary", 9.4679, 77.1435, "Kerala", 300.0, "FOREST_WILDLIFE"),
    
    # 4. Desert / Arid
    ("Sam Sand Dunes Jaisalmer", 26.9157, 70.9083, "Rajasthan", 225.0, "DESERT_ARID"),
    ("Great Rann of Kutch Desert", 23.8344, 69.8336, "Gujarat", 15.0, "DESERT_ARID"),
    ("Bikaner Thar Dune", 28.0176, 73.3119, "Rajasthan", 240.0, "DESERT_ARID"),
    
    # 5. Urban / Heritage
    ("Varanasi Dashashwamedh Ghat", 25.3176, 82.9739, "Uttar Pradesh", 80.0, "URBAN_HERITAGE"),
    ("Tirupati Balaji Temple", 13.6288, 79.4192, "Andhra Pradesh", 160.0, "URBAN_HERITAGE"),
    ("Jaipur Hawa Mahal City", 26.9124, 75.7873, "Rajasthan", 430.0, "URBAN_HERITAGE"),
])
def test_region_classifier_generalization(place_name, lat, lon, state, elevation_m, expected_region):
    classified = DestinationResolver._classify_region(
        name=place_name,
        lat=lat,
        lon=lon,
        state=state,
        elevation_m=elevation_m
    )
    assert classified == expected_region, f"Failed for {place_name}: got {classified}, expected {expected_region}"


# -----------------------------------------------------------------------------
# 2. RISK ENGINE WEIGHT FORMULATION & EXPLAINABILITY VALIDATION
# -----------------------------------------------------------------------------
def test_risk_engine_weight_formulations():
    # Verify all 5 region profiles have weights summing to 1.0 (100%)
    for reg_key, profile in REGION_CONFIGS.items():
        weights = profile["weights"]
        total_weight = sum(weights.values())
        assert abs(total_weight - 1.0) < 0.001, f"Weights for {reg_key} sum to {total_weight}, must sum to 1.0"

    # Test 1: Coastal Cyclone Surge is weighted higher in COASTAL_MARINE than in HILL_MOUNTAIN
    coastal_weights = RegionRuleManager.get_weights("COASTAL_MARINE")
    assert "marine_cyclone_tide" in coastal_weights
    assert coastal_weights["marine_cyclone_tide"] == 0.35

    # Test 2: Extreme heat/dehydration dominates in DESERT_ARID
    desert_weights = RegionRuleManager.get_weights("DESERT_ARID")
    assert "heat_dehydration" in desert_weights
    assert desert_weights["heat_dehydration"] == 0.40

    # Test 3: Landslide dominates in HILL_MOUNTAIN
    hill_weights = RegionRuleManager.get_weights("HILL_MOUNTAIN")
    assert "terrain_landslide" in hill_weights
    assert hill_weights["terrain_landslide"] == 0.30

    # Test 4: Crowd stampede dominates in URBAN_HERITAGE
    urban_weights = RegionRuleManager.get_weights("URBAN_HERITAGE")
    assert "crowd_stampede_chokepoint" in urban_weights
    assert urban_weights["crowd_stampede_chokepoint"] == 0.40

    # Test 5: Crowd bottleneck and riverine flood in PLAINS_RIVERINE
    plains_weights = RegionRuleManager.get_weights("PLAINS_RIVERINE")
    assert "crowd_stampede_chokepoint" in plains_weights
    assert plains_weights["crowd_stampede_chokepoint"] == 0.35
    assert plains_weights["riverine_flood"] == 0.25


# -----------------------------------------------------------------------------
# 3. BOUNDARY ENFORCEMENT & AMBIGUOUS PLACE HANDLING
# -----------------------------------------------------------------------------
def test_sovereign_territory_validation():
    # Coordinates inside India
    assert DestinationResolver.is_within_india(28.6139, 77.2090) is True  # Delhi
    assert DestinationResolver.is_within_india(8.4004, 76.9787) is True   # Kerala
    assert DestinationResolver.is_within_india(34.1526, 77.5771) is True  # Ladakh

    # Coordinates outside India (e.g. Paris, London, New York)
    assert DestinationResolver.is_within_india(48.8566, 2.3522) is False   # Paris
    assert DestinationResolver.is_within_india(40.7128, -74.0060) is False # New York
    assert DestinationResolver.is_within_india(51.5074, -0.1278) is False  # London


# -----------------------------------------------------------------------------
# 4. SECURITY AUDIT: JWT TOKEN VALIDATION & TAMPER PROOFING
# -----------------------------------------------------------------------------
def test_jwt_security_and_guest_tokens():
    # 1. Valid Guest Token
    resp_guest = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer guest_9876543210"})
    assert resp_guest.status_code == 200
    assert resp_guest.json()["user"]["is_guest"] is True

    # 2. Cryptographically signed valid JWT Token
    valid_jwt = jwt.encode({"sub": "user_tourist_99", "email": "tourist@nic.in", "name": "Arnav Sharma"}, settings.JWT_SECRET, algorithm="HS256")
    resp_valid = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {valid_jwt}"})
    assert resp_valid.status_code == 200
    assert resp_valid.json()["user"]["uid"] == "user_tourist_99"

    # 3. Tampered / Invalid JWT Token MUST BE REJECTED WITH 401
    tampered_jwt = valid_jwt[:-6] + "xxxxxx"
    resp_tampered = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {tampered_jwt}"})
    assert resp_tampered.status_code == 401


# -----------------------------------------------------------------------------
# 5. EMERGENCY SOS & 140-CHAR 2G GSM GATEWAY TEST
# -----------------------------------------------------------------------------
def test_sos_dispatch_and_sms_length():
    resp = client.post("/api/v1/sos/trigger", json={
        "user_name": "Ramesh Kumar",
        "user_phone": "+91-9876543210",
        "latitude": 19.8000,
        "longitude": 85.8300,
        "altitude_m": 12,
        "medical_condition": "Acute dehydration",
        "battery_level_percent": 14,
        "emergency_contacts": ["+91-9811122233"]
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "sos_id" in data
    assert "sms_fallback_string" in data
    assert len(data["sms_fallback_string"]) <= 140
    assert "nearest_hospital" in data
    assert "nearest_police_post" in data


# -----------------------------------------------------------------------------
# 6. BUDGET OPTIMIZER: 15% EMERGENCY MEDICAL RESERVE TEST
# -----------------------------------------------------------------------------
def test_itinerary_15_percent_emergency_reserve():
    resp = client.post("/api/v1/itinerary/generate", json={
        "destination": "Munnar",
        "duration_days": 2,
        "budget_tier": "STANDARD",
        "total_budget_inr": 20000.0,
        "fitness_level": "MODERATE",
        "language": "en"
    })
    assert resp.status_code == 200
    data = resp.json()
    breakdown = data["budget_breakdown"]
    reserve = breakdown["categories"]["emergency_medical_reserve_inr"]
    assert reserve == 3000.0  # Exactly 15% of 20000.0
    assert data["region_type"] == "HILL_MOUNTAIN"
    assert len(data["mandatory_safety_advisories"]) > 0


# -----------------------------------------------------------------------------
# 7. SPATIAL GEOFENCING & BOUNDING BOX INTERSECTION
# -----------------------------------------------------------------------------
def test_spatial_geofencing_detection():
    # Point inside Kedarnath Rambara Landslide Zone (30.6250, 79.0700)
    resp_breach = client.post("/api/v1/geofence/check", json={
        "destination_id": "Kedarnath",
        "lat": 30.6250,
        "lon": 79.0700,
        "accuracy_m": 5.0
    })
    assert resp_breach.status_code == 200
    data_breach = resp_breach.json()
    assert data_breach["is_inside_hazard"] is True
    assert data_breach["status"] == "BREACH"

    # Point far outside hazard zone (e.g. 30.5526, 79.0669 Sonprayag Base)
    resp_clear = client.post("/api/v1/geofence/check", json={
        "destination_id": "Kedarnath",
        "lat": 30.5526,
        "lon": 79.0669,
        "accuracy_m": 5.0
    })
    assert resp_clear.status_code == 200
    assert resp_clear.json()["is_inside_hazard"] is False


# -----------------------------------------------------------------------------
# 8. PAN-INDIA MULTI-GENRE TRAVEL CATEGORIES & DESTINATIONS
# -----------------------------------------------------------------------------
def test_pan_india_travel_categories_endpoint():
    resp = client.get("/api/v1/destinations/categories")
    assert resp.status_code == 200
    data = resp.json()
    assert "categories" in data
    assert len(data["categories"]) >= 6
    
    cat_ids = [c["id"] for c in data["categories"]]
    assert "top_picks" in cat_ids
    assert "hill_stations" in cat_ids
    assert "beaches" in cat_ids
    assert "wildlife" in cat_ids
    assert "heritage" in cat_ids
    assert "spiritual" in cat_ids
    assert "adventure" in cat_ids

    # Verify top picks contain destinations
    top_picks = next(c for c in data["categories"] if c["id"] == "top_picks")
    assert len(top_picks["destinations"]) > 0


def test_pan_india_multi_genre_destination_resolution():
    # Test Goa resolution
    resp_goa = client.post("/api/v1/destinations/resolve", json={"query": "Goa Beaches"})
    assert resp_goa.status_code == 200
    data_goa = resp_goa.json()
    assert data_goa["region_type"] == "COASTAL_MARINE"
    assert data_goa["state_ut"] == "Goa"

    # Test Leh Ladakh resolution
    resp_leh = client.post("/api/v1/destinations/resolve", json={"query": "Leh Ladakh"})
    assert resp_leh.status_code == 200
    data_leh = resp_leh.json()
    assert data_leh["region_type"] == "HILL_MOUNTAIN"
    assert data_leh["elevation_m"] >= 3000

    # Test Jaipur resolution
    resp_jpr = client.post("/api/v1/destinations/resolve", json={"query": "Jaipur Amer Fort"})
    assert resp_jpr.status_code == 200
    data_jpr = resp_jpr.json()
    assert data_jpr["region_type"] == "URBAN_HERITAGE"
    assert data_jpr["state_ut"] == "Rajasthan"


if __name__ == "__main__":
    pytest.main(["-v", __file__])

