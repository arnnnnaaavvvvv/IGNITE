from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.services.destination_resolver import DestinationResolver
from app.core.database import SpatialHazardRepository

router = APIRouter(prefix="/geofence", tags=["Spatial Geo-Fencing Engine"])

class GeofenceCheckRequest(BaseModel):
    destination_id: str = Field(default="Kedarnath", description="Destination or Place name")
    lat: float = Field(default=30.6270, description="Tourist latitude")
    lon: float = Field(default=79.0700, description="Tourist longitude")
    accuracy_m: float = Field(default=10.0, description="GPS accuracy in meters")

@router.post("/check")
async def check_geofence_breach(req: GeofenceCheckRequest):
    """
    Evaluates tourist GPS coordinates against generic PostGIS hazard polygons.
    """
    dest = await DestinationResolver.resolve(req.destination_id)
    hazard_zones = dest.get("hazard_zones", [])
    
    breached_hazard = await SpatialHazardRepository.evaluate_point_in_hazards(req.lat, req.lon, hazard_zones)
    
    if breached_hazard:
        return {
            "status": "BREACH",
            "is_inside_hazard": True,
            "hazard": breached_hazard,
            "directive": f"CRITICAL: You have entered active hazard perimeter '{breached_hazard['name']}'. Initiate immediate diversion."
        }
    
    return {
        "status": "CLEAR",
        "is_inside_hazard": False,
        "hazard": None,
        "directive": "Normal corridor parameters. You are within the verified safe zone."
    }
