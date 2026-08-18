from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.services.sos_service import SOSService

router = APIRouter(prefix="/sos", tags=["Emergency SOS Gateway"])

class SOSRequest(BaseModel):
    user_name: str = Field(default="Tourist User", description="Full name of tourist")
    user_phone: str = Field(default="+91-9876543210", description="Primary mobile phone")
    latitude: float = Field(default=28.6139, description="Current GPS latitude")
    longitude: float = Field(default=77.2090, description="Current GPS longitude")
    altitude_m: int = Field(default=210, description="Current elevation in meters")
    medical_condition: Optional[str] = Field(default="Acute distress / fatigue", description="Triage notes")
    battery_level_percent: int = Field(default=35, description="Phone battery percentage")
    emergency_contacts: List[str] = Field(default=["+91-9811122233", "+91-9922334455"], description="Emergency phone numbers")

@router.post("/trigger")
async def trigger_sos(req: SOSRequest):
    """
    Triggers destination-agnostic SOS dispatch:
    - Queries Overpass dynamically for nearest hospitals and police posts around user's live GPS coordinates.
    - Generates 140-char offline 2G GSM SMS text.
    - Queues emergency contact notifications.
    """
    dispatch_record = await SOSService.trigger_emergency_sos(
        user_name=req.user_name,
        phone_number=req.user_phone,
        lat=req.latitude,
        lon=req.longitude,
        altitude_m=req.altitude_m,
        battery_percentage=req.battery_level_percent,
        medical_notes=req.medical_condition or "Emergency",
        emergency_contacts=req.emergency_contacts
    )
    return dispatch_record
