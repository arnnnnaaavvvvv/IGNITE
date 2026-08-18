from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from app.services.itinerary_service import ItineraryService
from app.services.explainability_service import ExplainabilityService
from app.services.llm_itinerary_service import LLMItineraryService

router = APIRouter(prefix="/itinerary", tags=["Itinerary & Budget Planner"])

class ItineraryRequest(BaseModel):
    destination: str = Field(default="Kedarnath", description="Any target destination in India")
    duration_days: int = Field(default=2, ge=1, le=3, description="Duration in days")
    budget_tier: str = Field(default="STANDARD", description="BUDGET, STANDARD, or COMFORT")
    total_budget_inr: float = Field(default=12000.0, ge=1000.0, description="Total budget in INR")
    fitness_level: str = Field(default="MODERATE", description="BEGINNER, MODERATE, or EXPERIENCED")
    language: str = Field(default="en", description="Preferred language code (en, hi, etc.)")
    weather_simulation: Optional[Dict[str, Any]] = None

@router.post("/generate")
async def generate_itinerary(req: ItineraryRequest):
    """
    Computes a risk-weighted, budget-allocated, and region-tailored itinerary for any destination in India.
    Integrates live Overpass POIs, OSRM polylines, and structured LLM reasoning.
    """
    itinerary = await ItineraryService.generate_itinerary(
        destination_query=req.destination,
        duration_days=req.duration_days,
        budget_tier=req.budget_tier,
        total_budget_inr=req.total_budget_inr,
        fitness_level=req.fitness_level,
        language=req.language,
        weather_override=req.weather_simulation
    )

    explanation = ExplainabilityService.generate_trip_summary_explanation(itinerary, lang=req.language)
    itinerary["explainability"] = explanation

    # Enrich with structured LLM layer
    enriched = await LLMItineraryService.enrich_itinerary_with_llm(itinerary, language=req.language)
    return enriched
