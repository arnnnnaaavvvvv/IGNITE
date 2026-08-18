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

@router.get("/region-config")
async def get_region_configurations():
    """
    Returns all 5 canonical region rules, weights, and curfews.
    """
    return {"region_configs": RegionRuleManager.get_all_configs()}
