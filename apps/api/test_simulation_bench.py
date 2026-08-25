import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_simulation_pan_india_default():
    """
    Verifies that requesting /api/v1/simulation/scenarios with no place returns
    all major live disaster bench updates and national bulletins across India.
    """
    response = client.get("/api/v1/simulation/scenarios")
    assert response.status_code == 200
    data = response.json()
    assert data["is_pan_india"] is True
    assert "destination" in data
    assert "scenarios" in data
    assert len(data["scenarios"]) >= 5
    assert "national_disaster_bulletins" in data
    assert len(data["national_disaster_bulletins"]) >= 3
    assert "pan_india_zones_summary" in data
    assert data["pan_india_zones_summary"]["critical_alerts"] > 0

def test_simulation_place_kedarnath():
    """
    Verifies that requesting /api/v1/simulation/scenarios for Kedarnath returns
    Himalayan-specific scenarios, incident history (2013 flash flood, 2023 landslip),
    and local emergency agencies.
    """
    response = client.get("/api/v1/simulation/scenarios?destination=Kedarnath")
    assert response.status_code == 200
    data = response.json()
    assert data["is_pan_india"] is False
    assert "Kedarnath" in data["destination"]
    assert data["region_type"] == "HILL_MOUNTAIN"
    assert "incident_history" in data
    assert len(data["incident_history"]) >= 2
    # Verify 2013 flood or mountain landslide incident is present
    has_mountain_incident = any("Chorabari" in inc["title"] or "Landslide" in inc["title"] or "GLACIAL" in inc["category"] or "LANDSLIDE" in inc["category"] for inc in data["incident_history"])
    assert has_mountain_incident
    # Verify mountain-tailored scenarios
    assert len(data["scenarios"]) >= 3
    assert any("Cloudburst" in s["title"] or "HILL_MOUNTAIN" == s["region_type"] for s in data["scenarios"])

def test_simulation_place_puri():
    """
    Verifies Coastal/Marine tailored scenarios and cyclone incident history for Puri.
    """
    response = client.get("/api/v1/simulation/scenarios?destination=Puri")
    assert response.status_code == 200
    data = response.json()
    assert data["is_pan_india"] is False
    assert data["region_type"] == "COASTAL_MARINE"
    assert any("Cyclone" in s["title"] or "COASTAL_MARINE" == s["region_type"] for s in data["scenarios"])
    assert any("Fani" in inc["title"] or "CYCLONE" in inc["category"] or "RIP_CURRENT" in inc["category"] for inc in data["incident_history"])

def test_simulation_place_jaisalmer():
    """
    Verifies Desert/Arid tailored heatwave & sandstorm scenarios for Jaisalmer.
    """
    response = client.get("/api/v1/simulation/scenarios?destination=Jaisalmer")
    assert response.status_code == 200
    data = response.json()
    assert data["is_pan_india"] is False
    assert data["region_type"] == "DESERT_ARID"
    assert any("Heatwave" in s["title"] or "DESERT_ARID" == s["region_type"] for s in data["scenarios"])
