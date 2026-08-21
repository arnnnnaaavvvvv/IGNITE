from fastapi import APIRouter, Query
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.services.destination_resolver import DestinationResolver
from app.core.region_rules import RegionRuleManager, REGION_CONFIGS

router = APIRouter(prefix="/destinations", tags=["Pan-India Destination Resolver"])

class ResolveRequest(BaseModel):
    query: str = Field(default="Kedarnath", description="Any place name, hill station, wildlife sanctuary, beach, or city in India")
    language: str = Field(default="en", description="Language code")

@router.post("/resolve")
async def resolve_destination(req: ResolveRequest):
    """
    Resolves any free-text Indian place name to coordinates, real elevation, region profile, POIs, and safety ruleset.
    """
    result = await DestinationResolver.resolve(req.query)
    return result

@router.get("/search")
async def search_destinations(q: str = Query(default="", description="Search query")):
    """
    Instant search / autocomplete endpoint for arbitrary Indian destinations.
    """
    results = await DestinationResolver.search(q)
    return {"results": results}

@router.get("/featured")
async def get_featured_destinations():
    """
    Returns representative destinations across all 5 canonical region types across India.
    """
    all_dest = await DestinationResolver.search("")
    return {
        "featured": all_dest,
        "region_profiles": REGION_CONFIGS
    }

@router.get("/circuits")
async def get_pilgrimage_circuits():
    """
    Returns curated national pilgrimage circuits (Char Dham, Chota Char Dham, 12 Jyotirlingas, Prominent Shrines).
    """
    from app.data.pan_india_dataset import PILGRIMAGE_CIRCUITS, PAN_INDIA_DESTINATIONS
    
    # Enrich circuit items with destination details
    dest_map = {d["id"]: d for d in PAN_INDIA_DESTINATIONS}
    enriched_circuits = []
    for c in PILGRIMAGE_CIRCUITS:
        c_items = []
        for dest_id in c["destinations"]:
            if dest_id in dest_map:
                d = dest_map[dest_id]
                c_items.append({
                    "id": d["id"],
                    "canonical_name": d["canonical_name"],
                    "name_hi": d.get("name_hi", d["canonical_name"]),
                    "state_ut": d["state_ut"],
                    "region_type": d["region_type"],
                    "elevation_m": d["elevation_m"],
                    "lat": d["lat"],
                    "lon": d["lon"],
                    "category": d.get("category", "pilgrimage"),
                    "pilgrimage_metadata": d.get("pilgrimage_metadata")
                })
        enriched_circuits.append({
            **c,
            "destination_records": c_items
        })

    return {"circuits": enriched_circuits}

@router.get("/categories")
async def get_travel_categories():
    """
    Returns curated multi-genre travel categories across India (Top Picks, Hill Stations, Beaches, Wildlife, Heritage, Spiritual, Adventure).
    """
    from app.data.pan_india_dataset import TRAVEL_CATEGORIES, PILGRIMAGE_CIRCUITS, PAN_INDIA_DESTINATIONS
    
    dest_map = {d["id"]: d for d in PAN_INDIA_DESTINATIONS}
    enriched_categories = []
    
    for cat in TRAVEL_CATEGORIES:
        items = []
        for dest_id in cat.get("destination_ids", []):
            if dest_id in dest_map:
                d = dest_map[dest_id]
                items.append({
                    "id": d["id"],
                    "canonical_name": d["canonical_name"],
                    "name_hi": d.get("name_hi", d["canonical_name"]),
                    "state_ut": d["state_ut"],
                    "region_type": d["region_type"],
                    "category": d.get("category", "general"),
                    "elevation_m": d["elevation_m"],
                    "lat": d["lat"],
                    "lon": d["lon"],
                    "pilgrimage_metadata": d.get("pilgrimage_metadata")
                })
        enriched_categories.append({
            **cat,
            "destinations": items
        })

    return {
        "categories": enriched_categories,
        "circuits": PILGRIMAGE_CIRCUITS
    }

@router.get("/region-config")
async def get_region_configurations():
    """
    Returns canonical region rules, weights, and curfews.
    """
    return {"region_configs": RegionRuleManager.get_all_configs()}


