from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict, Any
from app.services.group_service import GroupTrackingService

router = APIRouter(prefix="/group", tags=["Group Tracking & Separation Alert"])

class MemberLocation(BaseModel):
    user_id: str
    name: str
    role: str = "MEMBER"
    lat: float
    lon: float
    altitude_m: int = 2700
    battery_pct: int = 80

class GroupSyncRequest(BaseModel):
    trip_id: str = "trip_kedar_2026"
    leader_location: Dict[str, float] = Field(
        default_factory=lambda: {"lat": 30.6380, "lon": 79.0712},
        description="Leader coordinates"
    )
    members: List[MemberLocation] = Field(
        default_factory=lambda: [
            {"user_id": "usr_1", "name": "Pooja", "role": "MEMBER", "lat": 30.6375, "lon": 79.0708, "altitude_m": 2725, "battery_pct": 65},
            {"user_id": "usr_2", "name": "Rajesh (Strayed)", "role": "MEMBER", "lat": 30.6330, "lon": 79.0680, "altitude_m": 2610, "battery_pct": 34}
        ]
    )
    separation_threshold_m: float = 150.0

@router.post("/sync")
async def sync_group_locations(req: GroupSyncRequest):
    """
    Evaluates positions of all family/trekking group members and triggers alerts if someone is separated.
    """
    member_dicts = [m.model_dump() for m in req.members]
    result = GroupTrackingService.evaluate_group_dispersion(
        leader_loc=req.leader_location,
        members=member_dicts,
        separation_threshold_m=req.separation_threshold_m
    )
    return result
