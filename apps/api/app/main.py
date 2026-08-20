from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.redis_cache import cache_manager
from app.routers import destinations, itinerary, risk, emergency, sos, group, simulation, geofence, auth, websocket

app = FastAPI(
    title="SafeTrail AI — Pan-India Tourist Safety & Smart Route Planner",
    version=settings.VERSION,
    description="Production-Grade Destination-Agnostic Tourist Safety & Smart Risk-Weighted Itinerary Engine",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Enable CORS for Next.js / Vite web application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sliding Window Rate Limiter (60 req/min) to protect downstream OSM/Meteo/LLM APIs
from app.core.rate_limiter import RateLimiterMiddleware
app.add_middleware(RateLimiterMiddleware, max_requests=60, window_seconds=60)

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(destinations.router, prefix=settings.API_V1_STR)
app.include_router(itinerary.router, prefix=settings.API_V1_STR)
app.include_router(risk.router, prefix=settings.API_V1_STR)
app.include_router(geofence.router, prefix=settings.API_V1_STR)
app.include_router(sos.router, prefix=settings.API_V1_STR)
app.include_router(emergency.router, prefix=settings.API_V1_STR)
app.include_router(group.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)
app.include_router(websocket.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    await cache_manager.initialize()
    print("[SafeTrail API] Initialized successfully. All Pan-India modules active.")

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "SafeTrail AI — Pan-India Tourist Safety Engine",
        "version": settings.VERSION,
        "supported_region_types": [
            "HILL_MOUNTAIN",
            "COASTAL_MARINE",
            "FOREST_WILDLIFE",
            "DESERT_ARID",
            "URBAN_HERITAGE",
            "PLAINS_RIVERINE"
        ],
        "redis_caching": "ACTIVE (Async Redis / Fast InMemory Fallback)",
        "spatial_engine": "PostGIS / Shapely Polygon Intersection",
        "coverage": "All 28 States & 8 Union Territories of India (OSM Geocoding + Overpass + OSRM + Open-Meteo Elevation)"
    }
