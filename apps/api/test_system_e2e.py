import asyncio
import httpx
from app.main import app
from app.core.redis_cache import cache_manager

async def run_all_tests():
    print("=== Running SafeTrail AI Destination-Agnostic E2E Test Suite ===", flush=True)
    await cache_manager.initialize()
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test", timeout=10.0) as client:
        # 1. Health
        print("[1/9] Testing /health...", flush=True)
        resp = await client.get("/health")
        assert resp.status_code == 200, f"Health failed: {resp.text}"
        print(" -> PASS: /health ->", resp.json()["status"], flush=True)

        # 2. Search
        print("[2/9] Testing /api/v1/destinations/search...", flush=True)
        resp = await client.get("/api/v1/destinations/search?q=Puri")
        assert resp.status_code == 200
        results = resp.json().get("results", [])
        assert len(results) > 0
        print(f" -> PASS: /api/v1/destinations/search -> found {len(results)} matches for 'Puri'", flush=True)

        # 3. Resolve diverse regions
        print("[3/9] Testing /api/v1/destinations/resolve across 5 canonical regions...", flush=True)
        test_cases = [
            ("Munnar", "HILL_MOUNTAIN"),
            ("Puri Beach", "COASTAL_MARINE"),
            ("Kaziranga National Park", "FOREST_WILDLIFE"),
            ("Jaisalmer Sand Dunes", "DESERT_ARID"),
            ("Varanasi", "URBAN_HERITAGE"),
        ]
        for place, expected_region in test_cases:
            resp = await client.post("/api/v1/destinations/resolve", json={"query": place})
            assert resp.status_code == 200, f"Resolve failed for {place}: {resp.text}"
            data = resp.json()
            assert "region_type" in data
            assert "lat" in data and "lon" in data
            assert "hazard_zones" in data
            assert "checkpoints" in data
            print(f" -> PASS: resolve ('{place}') -> {data['canonical_name']} -> {data['region_type']} ({data.get('elevation_m')}m)", flush=True)

        # 4. Region configs
        print("[4/9] Testing /api/v1/destinations/region-config...", flush=True)
        resp = await client.get("/api/v1/destinations/region-config")
        assert resp.status_code == 200
        configs = resp.json().get("region_configs", {})
        assert "HILL_MOUNTAIN" in configs and "COASTAL_MARINE" in configs
        print(f" -> PASS: /api/v1/destinations/region-config -> {len(configs)} canonical region profiles loaded", flush=True)

        # 5. Itinerary generation
        print("[5/9] Testing /api/v1/itinerary/generate with 15% emergency reserve...", flush=True)
        for dest in ["Manali", "Goa", "Kaziranga"]:
            resp = await client.post("/api/v1/itinerary/generate", json={
                "destination": dest,
                "duration_days": 2,
                "budget_tier": "STANDARD",
                "total_budget_inr": 15000,
                "fitness_level": "MODERATE",
                "language": "en"
            })
            assert resp.status_code == 200, f"Itinerary failed for {dest}: {resp.text}"
            data = resp.json()
            assert "days" in data and len(data["days"]) == 2
            assert "budget_breakdown" in data
            reserve = data["budget_breakdown"]["categories"]["emergency_medical_reserve_inr"]
            assert reserve == 2250.0 # 15% of 15000
            print(f" -> PASS: itinerary ('{dest}') -> 2 days, Risk: {data['overall_safety_score']}/100, Reserve: Rs.{reserve}", flush=True)

        # 6. Risk Recheck
        print("[6/9] Testing /api/v1/risk/recheck with high hazard simulation...", flush=True)
        resp = await client.post("/api/v1/risk/recheck", json={
            "trip_id": "test_trip_123",
            "destination_id": "Puri",
            "lat": 19.7983,
            "lon": 85.8249,
            "altitude_m": 8,
            "weather": {
                "precipitation_mm_hr": 45.0,
                "wind_speed_kmh": 65.0,
                "temperature_c": 28.0,
                "imd_alert": "RED"
            }
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["reroute_triggered"] is True
        print(f" -> PASS: risk recheck -> Risk: {data['current_risk_score']}/100 ({data['risk_level']}), Action: {data['action_type']}", flush=True)

        # 7. SOS Trigger
        print("[7/9] Testing /api/v1/sos/trigger...", flush=True)
        resp = await client.post("/api/v1/sos/trigger", json={
            "user_name": "Arnav Sharma",
            "user_phone": "+91-9876543210",
            "latitude": 19.8000,
            "longitude": 85.8300,
            "altitude_m": 12,
            "medical_condition": "Severe dehydration and exhaustion",
            "battery_level_percent": 15,
            "emergency_contacts": ["+91-9811122233"]
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "sos_id" in data
        assert "sms_fallback_string" in data
        assert len(data["sms_fallback_string"]) <= 140
        print(f" -> PASS: SOS trigger -> SOS ID: {data['sos_id']}, SMS ({len(data['sms_fallback_string'])} chars): '{data['sms_fallback_string']}'", flush=True)

        # 8. Geofence
        print("[8/9] Testing /api/v1/geofence/check...", flush=True)
        resp = await client.post("/api/v1/geofence/check", json={
            "destination_id": "Kedarnath",
            "lat": 30.6400,
            "lon": 79.0700,
            "accuracy_m": 5.0
        })
        assert resp.status_code == 200
        print(f" -> PASS: geofence check -> Status: {resp.json()['status']}", flush=True)

        # 9. Auth Guest Session
        print("[9/9] Testing /api/v1/auth/guest-session & /me...", flush=True)
        resp = await client.post("/api/v1/auth/guest-session", json={
            "phone": "+919876543210",
            "name": "Guest Tourist"
        })
        assert resp.status_code == 200
        token = resp.json()["access_token"]
        resp_me = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert resp_me.status_code == 200
        print(" -> PASS: auth guest session & /me profile verification", flush=True)

    print("\n=======================================================", flush=True)
    print(" ALL 9 E2E ASYNC TESTS COMPLETED & PASSED (100%) ", flush=True)
    print("=======================================================", flush=True)

if __name__ == "__main__":
    asyncio.run(run_all_tests())
