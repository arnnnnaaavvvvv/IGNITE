import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "IGNITE — Pan-India Tourist Safety & Smart Route Planner"
    VERSION: str = "2.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Caching & Database
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./safetrail.db")
    
    # External APIs
    OVERPASS_API_URL: str = os.getenv("OVERPASS_API_URL", "https://overpass-api.de/api/interpreter")
    OSRM_ROUTING_URL: str = os.getenv("OSRM_ROUTING_URL", "https://router.project-osrm.org")
    OPEN_METEO_URL: str = os.getenv("OPEN_METEO_URL", "https://api.open-meteo.com/v1/forecast")
    NOMINATIM_URL: str = os.getenv("NOMINATIM_URL", "https://nominatim.openstreetmap.org")
    
    # LLM & AI Engine
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    
    # Auth & Security
    FIREBASE_PROJECT_ID: Optional[str] = os.getenv("FIREBASE_PROJECT_ID", "safetrail-ai")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "safetrail-pan-india-super-secret-key-2026")
    
    # Regional Curfews & Safety Defaults
    DEFAULT_CURFEW_HOUR: int = 18

    class Config:
        case_sensitive = True

settings = Settings()
