import asyncio
from typing import Dict, Any, Optional
from datetime import datetime
from app.services.destination_resolver import DestinationResolver
from app.services.adaptive_risk_engine import AdaptiveRiskEngine
from app.services.weather_service import WeatherService
from app.routers.websocket import ws_manager

class BackgroundTripMonitor:
    """
    Background worker re-checking live meteorological and geological hazard conditions
    for active trips and broadcasting dynamic reroute alerts over WebSockets.
    """

    @classmethod
    async def recheck_trip_and_broadcast(
        cls,
        trip_id: str,
        destination_name: str,
        current_lat: float,
        current_lon: float,
        weather_override: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        dest = await DestinationResolver.resolve(destination_name)
        region_type = dest.get("region_type", "HILL_MOUNTAIN")
        hazard_zones = dest.get("hazard_zones", [])
        shelters = dest.get("shelters", [])

        # Fetch live weather or use simulated override
        weather = weather_override or await WeatherService.get_live_weather(current_lat, current_lon)

        pseudo_cp = {
            "id": f"active_pos_{trip_id}",
            "name": f"Live Position ({dest['canonical_name']})",
            "lat": current_lat,
            "lon": current_lon,
            "altitude_m": dest.get("elevation_m", 100),
            "nearest_hospital_dist_km": 1.5
        }

        risk_eval = AdaptiveRiskEngine.evaluate_checkpoint_risk(
            checkpoint=pseudo_cp,
            region_type=region_type,
            hazard_zones=hazard_zones,
            weather=weather
        )

        is_critical = risk_eval["total_risk_score"] > 65.0
        nearest_shelter = shelters[0] if shelters else {"name": "District Emergency Relief Post", "distance_m": 450}

        alert_payload = {
            "type": "HAZARD_ALERT" if is_critical else "NORMAL_TELEMETRY_UPDATE",
            "trip_id": trip_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "destination": dest["canonical_name"],
            "region_type": region_type,
            "risk_score": risk_eval["total_risk_score"],
            "risk_level": risk_eval["risk_level"],
            "is_reroute_required": is_critical,
            "action_type": "EMERGENCY_REROUTE" if is_critical else "PROCEED",
            "instructions": f"Critical condition spike detected in {dest['canonical_name']}. Divert immediately to {nearest_shelter['name']}. Safe bypass trail engaged." if is_critical else "All telemetry parameters normal.",
            "nearest_shelter": nearest_shelter,
            "weather": weather
        }

        # Broadcast over WebSocket to all subscribers of this trip
        await ws_manager.broadcast_alert(trip_id, alert_payload)
        return alert_payload
