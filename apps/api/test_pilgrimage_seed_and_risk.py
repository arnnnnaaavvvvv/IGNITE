import pytest
import inspect
from fastapi.testclient import TestClient
from app.main import app
from app.core.region_rules import RegionRuleManager, REGION_CONFIGS
from app.services.destination_resolver import DestinationResolver
from app.services.adaptive_risk_engine import AdaptiveRiskEngine
from app.data.pan_india_dataset import PAN_INDIA_DESTINATIONS, PILGRIMAGE_CIRCUITS

client = TestClient(app)

# -----------------------------------------------------------------------------
# 1. 21 PILGRIMAGE DESTINATIONS SEED CATALOG & RESOLUTION TEST
# -----------------------------------------------------------------------------
ALL_PILGRIMAGE_DESTINATIONS = [
    # 1. Char Dham Cardinal
    ("Badrinath Dham", "Uttarakhand", "HILL_MOUNTAIN", 3133),
    ("Dwarkadhish Temple Dwarka", "Gujarat", "COASTAL_MARINE", 10),
    ("Puri Shri Jagannath Dham", "Odisha", "COASTAL_MARINE", 10),
    ("Ramanathaswamy Temple Rameswaram", "Tamil Nadu", "COASTAL_MARINE", 10),
    
    # 2. Chota Char Dham (Himalayan)
    ("Yamunotri Dham", "Uttarakhand", "HILL_MOUNTAIN", 3293),
    ("Gangotri Dham", "Uttarakhand", "HILL_MOUNTAIN", 3100),
    ("Kedarnath Dham", "Uttarakhand", "HILL_MOUNTAIN", 3583),
    
    # 3. 12 Jyotirlingas
    ("Somnath Jyotirlinga Temple", "Gujarat", "COASTAL_MARINE", 8),
    ("Mallikarjuna Jyotirlinga Srisailam", "Andhra Pradesh", "HILL_MOUNTAIN", 476),
    ("Mahakaleshwar Jyotirlinga Ujjain", "Madhya Pradesh", "PLAINS_RIVERINE", 494),
    ("Omkareshwar Jyotirlinga", "Madhya Pradesh", "PLAINS_RIVERINE", 185),
    ("Bhimashankar Jyotirlinga", "Maharashtra", "HILL_MOUNTAIN", 1005),
    ("Kashi Vishwanath Temple Varanasi", "Uttar Pradesh", "URBAN_HERITAGE", 80),
    ("Trimbakeshwar Jyotirlinga", "Maharashtra", "HILL_MOUNTAIN", 720),
    ("Baidyanath Jyotirlinga Deoghar", "Jharkhand", "PLAINS_RIVERINE", 254),
    ("Nageshwar Jyotirlinga", "Gujarat", "COASTAL_MARINE", 15),
    ("Grishneshwar Jyotirlinga Ellora", "Maharashtra", "PLAINS_RIVERINE", 570),
    
    # 4. Prominent Shrines
    ("Ajmer Sharif Dargah", "Rajasthan", "PLAINS_RIVERINE", 480),
    ("Shirdi Sai Baba Samadhi Mandir", "Maharashtra", "PLAINS_RIVERINE", 504),
    ("Palitana Shatrunjaya Temples", "Gujarat", "HILL_MOUNTAIN", 603),
    ("Swaminarayan Akshardham Temple Delhi", "Delhi", "URBAN_HERITAGE", 210),
]

@pytest.mark.parametrize("name,state,expected_region,min_elevation", ALL_PILGRIMAGE_DESTINATIONS)
def test_generic_destination_resolution_for_all_pilgrimage_sites(name, state, expected_region, min_elevation):
    """
    Confirms all 21 pilgrimage seed destinations resolve cleanly through the generic
    destinations/resolve API endpoint without any special-cased routing logic.
    """
    resp = client.post("/api/v1/destinations/resolve", json={"query": name})
    assert resp.status_code == 200, f"Failed to resolve {name}: {resp.text}"
    
    data = resp.json()
    assert data["canonical_name"] == name
    assert data["state_ut"] == state
    assert data["region_type"] == expected_region
    assert data["category"] == "pilgrimage"
    assert "lat" in data and "lon" in data
    assert len(data.get("checkpoints", [])) > 0
    assert len(data.get("hazard_zones", [])) > 0
    assert data.get("is_dynamically_geocoded") is False
    
    # Verify pilgrimage metadata is attached
    meta = data.get("pilgrimage_metadata")
    assert meta is not None, f"Missing pilgrimage_metadata for {name}"
    assert "circuits" in meta
    assert len(meta["circuits"]) > 0
    assert "crowd_crush_risk_level" in meta
    assert "mobility_tier" in meta


# -----------------------------------------------------------------------------
# 2. CIRCUITS ENDPOINT & SEARCH TESTING
# -----------------------------------------------------------------------------
def test_pilgrimage_circuits_endpoint():
    """
    Tests /api/v1/destinations/circuits endpoint returns all 4 canonical circuits.
    """
    resp = client.get("/api/v1/destinations/circuits")
    assert resp.status_code == 200
    circuits = resp.json().get("circuits", [])
    assert len(circuits) == 4
    
    circuit_names = [c["name"] for c in circuits]
    assert "Char Dham (Cardinal)" in circuit_names
    assert "Chota Char Dham (Himalayan)" in circuit_names
    assert "12 Jyotirlingas" in circuit_names
    assert "Prominent Shrines & Tirths" in circuit_names
    
    # Verify all circuits have enriched destination records
    for c in circuits:
        assert len(c["destination_records"]) > 0
        for d in c["destination_records"]:
            assert "canonical_name" in d
            assert "lat" in d and "lon" in d
            assert d["category"] == "pilgrimage"


def test_destination_search_with_pilgrimage_queries():
    """
    Tests destination search/autocomplete for pilgrimage queries.
    """
    # 1. Query by circuit name
    resp = client.get("/api/v1/destinations/search?q=Char Dham")
    assert resp.status_code == 200
    results = resp.json().get("results", [])
    assert len(results) >= 4
    
    # 2. Query by temple keyword
    resp = client.get("/api/v1/destinations/search?q=Jyotirlinga")
    assert resp.status_code == 200
    results = resp.json().get("results", [])
    assert len(results) >= 8

    # 3. Query by specific shrine
    resp = client.get("/api/v1/destinations/search?q=Palitana")
    assert resp.status_code == 200
    results = resp.json().get("results", [])
    assert len(results) > 0
    assert "Palitana" in results[0]["canonical_name"]


# -----------------------------------------------------------------------------
# 3. RISK ENGINE VALIDATION ACROSS 4 KEY ARCHETYPES
# -----------------------------------------------------------------------------

def test_risk_archetype_1_high_altitude_hill_kedarnath():
    """
    Archetype 1: High-Altitude Hill Pilgrimage (Kedarnath Dham).
    Validates: AMS altitude factor, terrain landslide weighting (0.30), 17:30 curfew.
    """
    dest = next(d for d in PAN_INDIA_DESTINATIONS if d["id"] == "dest_kedarnath")
    cp = dest["checkpoints"][-1] # Kedarnath Mandir (3583m)
    
    weather = {
        "precipitation_mm_hr": 10.0,
        "wind_speed_kmh": 25.0,
        "temperature_c": 2.0,
        "visibility_km": 5.0,
        "imd_alert": "NONE"
    }
    
    eval_result = AdaptiveRiskEngine.evaluate_checkpoint_risk(
        checkpoint=cp,
        region_type="HILL_MOUNTAIN",
        hazard_zones=dest["hazard_zones"],
        weather=weather,
        daily_ascent_m=600,
        pilgrimage_metadata=dest.get("pilgrimage_metadata")
    )
    
    sub = eval_result["sub_scores"]
    assert "terrain_landslide" in sub
    assert "altitude_hypoxia" in sub
    assert sub["altitude_hypoxia"]["score"] > 35.0, "High altitude >3500m must trigger hypoxia score"
    assert "weather_squall" in sub
    assert "crowd_slowdown" in sub
    
    weights = RegionRuleManager.get_weights("HILL_MOUNTAIN")
    assert weights["terrain_landslide"] == 0.30
    assert weights["altitude_hypoxia"] == 0.20
    assert RegionRuleManager.get_curfew("HILL_MOUNTAIN") == "17:30 IST"


def test_risk_archetype_2_coastal_island_rameswaram():
    """
    Archetype 2: Coastal / Island Pilgrimage (Ramanathaswamy Temple Rameswaram).
    Validates: Cyclone / tidal surge weighting (0.35), rip current, 19:00 curfew.
    """
    dest = next(d for d in PAN_INDIA_DESTINATIONS if d["id"] == "dest_rameswaram")
    cp = dest["checkpoints"][1] # Agni Theertham
    
    weather = {
        "precipitation_mm_hr": 25.0,
        "wind_speed_kmh": 45.0,
        "temperature_c": 32.0,
        "visibility_km": 6.0,
        "imd_alert": "NONE"
    }
    
    eval_result = AdaptiveRiskEngine.evaluate_checkpoint_risk(
        checkpoint=cp,
        region_type="COASTAL_MARINE",
        hazard_zones=dest["hazard_zones"],
        weather=weather,
        pilgrimage_metadata=dest.get("pilgrimage_metadata")
    )
    
    sub = eval_result["sub_scores"]
    assert "marine_surge" in sub
    assert sub["marine_surge"]["score"] > 40.0, "Coastal storm wind must elevate marine surge"
    assert "rip_current" in sub
    assert "heat_uv" in sub
    assert "crowd" in sub
    
    weights = RegionRuleManager.get_weights("COASTAL_MARINE")
    assert weights["marine_cyclone_tide"] == 0.35
    assert RegionRuleManager.get_curfew("COASTAL_MARINE") == "19:00 IST"
    assert RegionRuleManager.get_profile("COASTAL_MARINE")["emergency_agency"] == "Indian Coast Guard & Marine Police"


def test_risk_archetype_3_urban_akshardham():
    """
    Archetype 3: Urban Pilgrimage (Swaminarayan Akshardham Temple Delhi).
    Validates: Crowd & security holding weighting (0.40), urban flood (0.25), 22:00 curfew.
    """
    dest = next(d for d in PAN_INDIA_DESTINATIONS if d["id"] == "dest_akshardham")
    cp = dest["checkpoints"][0] # Security Checkpoint
    
    weather = {
        "precipitation_mm_hr": 15.0,
        "wind_speed_kmh": 10.0,
        "temperature_c": 34.0,
        "visibility_km": 4.0,
        "imd_alert": "NONE"
    }
    
    eval_result = AdaptiveRiskEngine.evaluate_checkpoint_risk(
        checkpoint=cp,
        region_type="URBAN_HERITAGE",
        hazard_zones=dest["hazard_zones"],
        weather=weather,
        pilgrimage_metadata=dest.get("pilgrimage_metadata")
    )
    
    sub = eval_result["sub_scores"]
    assert "crowd_stampede" in sub
    assert "urban_flood" in sub
    assert "emergency_transit" in sub
    assert "aqi_pollution" in sub
    
    weights = RegionRuleManager.get_weights("URBAN_HERITAGE")
    assert weights["crowd_stampede_chokepoint"] == 0.40
    assert RegionRuleManager.get_curfew("URBAN_HERITAGE") == "22:00 IST"


def test_risk_archetype_4_dense_crowd_plains_shirdi():
    """
    Archetype 4: Dense-Crowd Plains Pilgrimage (Shirdi Sai Baba Temple).
    Validates: Crowd & queue bottleneck (0.35), riverine flood (0.25), heat stress (0.20), 21:30 curfew.
    """
    dest = next(d for d in PAN_INDIA_DESTINATIONS if d["id"] == "dest_shirdi")
    cp = dest["checkpoints"][0] # Queue Complex 1
    
    weather = {
        "precipitation_mm_hr": 5.0,
        "wind_speed_kmh": 12.0,
        "temperature_c": 38.0,
        "visibility_km": 10.0,
        "imd_alert": "NONE"
    }
    
    eval_result = AdaptiveRiskEngine.evaluate_checkpoint_risk(
        checkpoint=cp,
        region_type="PLAINS_RIVERINE",
        hazard_zones=dest["hazard_zones"],
        weather=weather,
        pilgrimage_metadata=dest.get("pilgrimage_metadata")
    )
    
    sub = eval_result["sub_scores"]
    assert "crowd_stampede" in sub
    assert "riverine_flood" in sub
    assert "heat_stress" in sub
    assert sub["heat_stress"]["score"] > 35.0, "38°C ambient temperature must elevate plains heat stress"
    assert "emergency_transit" in sub
    
    weights = RegionRuleManager.get_weights("PLAINS_RIVERINE")
    assert weights["crowd_stampede_chokepoint"] == 0.35
    assert weights["riverine_flood"] == 0.25
    assert RegionRuleManager.get_curfew("PLAINS_RIVERINE") == "21:30 IST"


def test_hilltop_staircase_complex_palitana():
    """
    Validates Palitana Shatrunjaya: 3,500-step staircase exertion & heat exhaustion
    distinct from high-altitude Himalayan AMS.
    """
    dest = next(d for d in PAN_INDIA_DESTINATIONS if d["id"] == "dest_palitana")
    cp = dest["checkpoints"][1] # Hinglaj Rest Point (1800th step, 420m)
    
    weather = {
        "precipitation_mm_hr": 0.0,
        "wind_speed_kmh": 10.0,
        "temperature_c": 36.0,
        "visibility_km": 10.0,
        "imd_alert": "NONE"
    }
    
    eval_result = AdaptiveRiskEngine.evaluate_checkpoint_risk(
        checkpoint=cp,
        region_type="HILL_MOUNTAIN",
        hazard_zones=dest["hazard_zones"],
        weather=weather,
        daily_ascent_m=350,
        pilgrimage_metadata=dest.get("pilgrimage_metadata")
    )
    
    sub = eval_result["sub_scores"]
    # For Palitana (altitude 420m < 2500m), altitude hypoxia should be 0, but slope exertion & heat are high
    assert sub["altitude_hypoxia"]["score"] == 0.0
    assert "Staircase" in sub["terrain_landslide"]["label"] or "Slope" in sub["terrain_landslide"]["label"]
    assert sub["terrain_landslide"]["score"] > 50.0


# -----------------------------------------------------------------------------
# 4. ARCHITECTURAL INTEGRITY: NO HARDCODED DESTINATION CODE PATHS
# -----------------------------------------------------------------------------
def test_no_hardcoded_destination_conditionals_in_risk_engine():
    """
    Ensures that the AdaptiveRiskEngine and DestinationResolver do not contain
    hardcoded 'if destination == X' branching — all differentiation must flow through
    region_type + hazard_profile + pilgrimage_metadata.
    """
    source_risk = inspect.getsource(AdaptiveRiskEngine)
    source_resolver = inspect.getsource(DestinationResolver)
    
    forbidden_hardcoded_patterns = [
        'if name == "Kedarnath"',
        'if name == "Rameswaram"',
        'if name == "Shirdi"',
        'if name == "Palitana"',
        'if name == "Akshardham"',
        'if destination == "Kedarnath"',
        'if dest == "Kedarnath"',
    ]
    
    for pattern in forbidden_hardcoded_patterns:
        assert pattern not in source_risk, f"Found forbidden hardcoded destination pattern in AdaptiveRiskEngine: {pattern}"
        assert pattern not in source_resolver, f"Found forbidden hardcoded destination pattern in DestinationResolver: {pattern}"
