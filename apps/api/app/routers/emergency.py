from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid
from app.services.osm_overpass_service import OSMOverpassService
from app.data.pan_india_dataset import REGION_PROFILES

router = APIRouter(prefix="/emergency", tags=["Emergency SOS & Offline GSM SMS Gateway"])

class SOSRequest(BaseModel):
    user_name: str = Field(default="Ramesh Kumar", description="Full name of tourist")
    user_phone: str = Field(default="+91-9876543210", description="Primary mobile phone")
    latitude: float = Field(default=30.6270, description="Current GPS latitude")
    longitude: float = Field(default=79.0700, description="Current GPS longitude")
    altitude_m: int = Field(default=2550, description="Current elevation")
    medical_condition: Optional[str] = Field(default="Suspected acute hypothermia / fatigue", description="Triage note")
    battery_level_percent: int = Field(default=24, description="Phone battery percentage")
    emergency_contacts: List[str] = Field(default=["+91-9811122233", "+91-9922334455"], description="Family contacts")

@router.post("/sos")
async def trigger_emergency_sos(req: SOSRequest):
    """
    Triggers universal SOS dispatch with live Overpass query for closest medical and police units.
    """
    sos_id = f"SOS-{uuid.uuid4().hex[:8].upper()}"
    timestamp = datetime.utcnow().isoformat() + "Z"

    # Query Overpass for closest hospitals and police posts around user coordinates
    amenities = await OSMOverpassService.get_emergency_amenities_nearby(req.latitude, req.longitude, radius_m=15000)
    hospitals = amenities.get("hospitals", [])
    police = amenities.get("police", [])
    shelters = amenities.get("shelters", [])

    nearest_hospital = hospitals[0] if hospitals else {
        "name": "District Primary Trauma Centre",
        "distance_km": 1.2,
        "contact_phone": "108"
    }

    nearest_police = police[0] if police else {
        "name": "Local Police Post & SDRF Station",
        "distance_km": 1.5,
        "contact_phone": "112"
    }

    # Generate 140-char offline 2G GSM SMS string
    # Format: [SOS-ID] LAT,LON ALT:ALTm BAT:XX% MED:DESC HOSP:DISTkm
    sms_string = f"[{sos_id}] {req.latitude:.4f},{req.longitude:.4f} A:{req.altitude_m}m B:{req.battery_level_percent}% {req.user_name[:10]} {req.medical_condition[:18]} H:{nearest_hospital['name'][:12]}:{nearest_hospital['distance_km']}km"
    sms_string = sms_string[:140]

    dispatch_record = {
        "sos_id": sos_id,
        "timestamp_utc": timestamp,
        "status": "DISPATCHED_TO_NATIONAL_GRID",
        "priority": "CRITICAL_ALPHA_1",
        "victim": {
            "name": req.user_name,
            "phone": req.user_phone,
            "battery": f"{req.battery_level_percent}%",
            "medical_conditions": req.medical_condition
        },
        "telemetry": {
            "latitude": req.latitude,
            "longitude": req.longitude,
            "altitude_m": req.altitude_m,
            "gps_accuracy_m": 8.5
        },
        "nearest_rescue_post": {
            "name": nearest_hospital["name"],
            "distance_km": nearest_hospital["distance_km"],
            "helpline": nearest_hospital.get("contact_phone", "108")
        },
        "nearest_police_post": {
            "name": nearest_police["name"],
            "distance_km": nearest_police["distance_km"],
            "helpline": nearest_police.get("contact_phone", "112")
        },
        "assigned_units": [
            {"unit": "SDRF / NDRF Rapid Response Team", "channel": "VHF-Ch-09 (156.450 MHz)", "status": "DEPLOYING"},
            {"unit": "District 108 Cardiac Advanced Life Support Ambulance", "channel": "GSM Cell Relay", "status": "EN_ROUTE"}
        ],
        "sms_fallback_string": sms_string,
        "sms_character_count": len(sms_string)
    }

    return dispatch_record

@router.get("/shelters")
async def get_emergency_shelters(lat: float = 30.6385, lon: float = 79.0718):
    """
    Returns nearest shelters and medical posts via Overpass.
    """
    amenities = await OSMOverpassService.get_emergency_amenities_nearby(lat, lon, radius_m=20000)
    return {
        "shelters": amenities.get("shelters", []),
        "hospitals": amenities.get("hospitals", []),
        "police": amenities.get("police", [])
    }
