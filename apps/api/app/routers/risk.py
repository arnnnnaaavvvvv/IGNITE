from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from app.services.destination_resolver import DestinationResolver
from app.services.adaptive_risk_engine import AdaptiveRiskEngine
from app.services.background_monitor import BackgroundTripMonitor
from app.core.region_rules import RegionRuleManager

router = APIRouter(prefix="/risk", tags=["Risk Engine & Geofencing"])

class RecheckRequest(BaseModel):
    trip_id: Optional[str] = Field(default="active_trip_01", description="Unique active trip ID")
    destination_id: Optional[str] = Field(default="Kedarnath", description="Destination ID or Name")
    lat: float = Field(default=30.6270, description="Current latitude")
    lon: float = Field(default=79.0700, description="Current longitude")
    altitude_m: int = Field(default=2550, description="Current elevation in meters")
    language: str = Field(default="en", description="Language code")
    weather: Optional[Dict[str, Any]] = None

@router.post("/recheck")
async def live_risk_recheck(req: RecheckRequest):
    """
    Evaluates safety at user's current coordinates across any region type in India
    and broadcasts live alerts via WebSocket.
    """
    dest = await DestinationResolver.resolve(req.destination_id or "Kedarnath")
    region_type = dest.get("region_type", "HILL_MOUNTAIN")
    hazard_zones = dest.get("hazard_zones", [])
    shelters = dest.get("shelters", [])

    pseudo_cp = {
        "id": "live_pos",
        "name": f"Current Position ({dest['canonical_name']})",
        "name_hi": "वर्तमान स्थिति",
        "lat": req.lat,
        "lon": req.lon,
        "altitude_m": req.altitude_m,
        "nearest_hospital_dist_km": 2.0
    }

    risk_eval = AdaptiveRiskEngine.evaluate_checkpoint_risk(
        checkpoint=pseudo_cp,
        region_type=region_type,
        hazard_zones=hazard_zones,
        weather=req.weather
    )

    nearest_shelter = shelters[0] if shelters else {
        "name": "Local District Emergency Shelter",
        "distance_m": 500,
        "contact_phone": "112"
    }

    is_high_risk = risk_eval["total_risk_score"] > 65.0

    if is_high_risk:
        action_type = "EMERGENCY_REROUTE"
        instructions = f"Hazard threshold breached ({risk_eval['total_risk_score']}/100 - {risk_eval['risk_level']}). Divert immediately to {nearest_shelter['name']}. Safe bypass trail engaged."
        instructions_hi = f"खतरे की सीमा पार ({risk_eval['total_risk_score']}/100)। तुरंत {nearest_shelter['name']} की ओर प्रस्थान करें।"
    else:
        action_type = "PROCEED_SAFELY"
        instructions = f"Conditions in {dest['canonical_name']} are within safe operational parameters. Follow standard {region_type} safety rules."
        instructions_hi = "स्थिति सामान्य है। निर्धारित मार्ग पर सुरक्षित आगे बढ़ें।"

    response = {
        "destination": dest["canonical_name"],
        "region_type": region_type,
        "current_risk_score": risk_eval["total_risk_score"],
        "risk_level": risk_eval["risk_level"],
        "action_type": action_type,
        "instructions": instructions,
        "instructions_hi": instructions_hi,
        "nearest_shelter": nearest_shelter,
        "reroute_triggered": is_high_risk,
        "sub_scores": risk_eval["sub_scores"]
    }

    # Trigger background WebSocket notification
    await BackgroundTripMonitor.recheck_trip_and_broadcast(
        trip_id=req.trip_id or "active_trip_01",
        destination_name=dest["canonical_name"],
        current_lat=req.lat,
        current_lon=req.lon,
        weather_override=req.weather
    )

    return response

@router.get("/hazards")
async def get_hazard_zones(destination: Optional[str] = "Kedarnath"):
    dest = await DestinationResolver.resolve(destination or "Kedarnath")
    return {
        "destination": dest["canonical_name"],
        "region_type": dest["region_type"],
        "hazard_zones": dest.get("hazard_zones", []),
        "main_trail": dest.get("trail_coords", []),
        "bypass_trail": dest.get("bypass_coords", [])
    }

@router.get("/checkpoints")
async def get_checkpoints(destination: Optional[str] = "Kedarnath"):
    dest = await DestinationResolver.resolve(destination or "Kedarnath")
    return {
        "destination": dest["canonical_name"],
        "region_type": dest["region_type"],
        "checkpoints": dest.get("checkpoints", []),
        "shelters": dest.get("shelters", [])
    }

@router.get("/rules/{region_type}")
async def get_region_rule_profile(region_type: str):
    """
    Returns specific weights, curfew, and hazard thresholds for a region type.
    """
    return RegionRuleManager.get_profile(region_type)
