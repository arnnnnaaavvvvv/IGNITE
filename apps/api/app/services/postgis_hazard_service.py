from typing import List, Dict, Any
from app.core.database import SpatialHazardRepository
from app.core.redis_cache import cache_manager

class PostGISHazardService:
    """
    Spatial Hazard Zone Aggregation Layer using PostGIS Bounding Box queries.
    """

    @classmethod
    async def get_hazards_for_bounding_box(
        cls,
        min_lon: float,
        min_lat: float,
        max_lon: float,
        max_lat: float
    ) -> List[Dict[str, Any]]:
        cache_key = f"hazard:bbox:{round(min_lon,2)}:{round(min_lat,2)}:{round(max_lon,2)}:{round(max_lat,2)}"
        cached = await cache_manager.get_json(cache_key)
        if cached:
            return cached

        hazards = await SpatialHazardRepository.query_hazards_by_bbox(min_lon, min_lat, max_lon, max_lat)
        await cache_manager.set_json(cache_key, hazards, ttl_seconds=3600)
        return hazards
