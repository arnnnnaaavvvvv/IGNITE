from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict, Any
from app.core.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Firebase Auth & Session Management"])

class GuestLoginRequest(BaseModel):
    phone: str = "+919876543210"
    name: str = "Tourist User"

@router.post("/guest-session")
async def create_guest_session(req: GuestLoginRequest):
    """
    Issues a quick guest session token for offline and emergency operation without registration barriers.
    """
    token = f"guest_{req.phone.replace('+', '')}"
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "uid": token,
            "name": req.name,
            "phone": req.phone,
            "is_guest": True
        }
    }

@router.get("/me")
async def get_my_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Returns current authenticated user profile.
    """
    return {"user": current_user}
