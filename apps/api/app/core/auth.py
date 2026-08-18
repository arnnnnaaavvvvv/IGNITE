import jwt
from typing import Optional, Dict, Any
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

security = HTTPBearer(auto_error=False)

class AuthService:
    """
    Firebase Auth JWT Token Validator with Guest Mode support.
    """
    @classmethod
    async def verify_token(cls, token: str) -> Dict[str, Any]:
        if not token:
            raise HTTPException(status_code=401, detail="Missing authorization token")

        if token.startswith("guest_"):
            return {
                "uid": token,
                "email": "tourist_guest@safetrail.gov.in",
                "name": "Registered Guest Tourist",
                "is_guest": True
            }

        # Cryptographically verify JWT signature with HMAC-SHA256
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
            return {
                "uid": payload.get("sub", payload.get("user_id", "user_auth_101")),
                "email": payload.get("email", "tourist@safetrail.gov.in"),
                "name": payload.get("name", "Verified Tourist"),
                "is_guest": False
            }
        except jwt.PyJWTError as e:
            raise HTTPException(status_code=401, detail=f"Invalid or expired authorization token: {str(e)}")

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> Dict[str, Any]:
    if not credentials:
        # Default to demo guest user for unauthenticated requests
        return {
            "uid": "guest_anon_session",
            "email": "guest@safetrail.gov.in",
            "name": "Guest Tourist",
            "is_guest": True
        }
    return await AuthService.verify_token(credentials.credentials)
