from typing import Dict, Any, List, Optional
from app.services.destination_resolver import DestinationResolver
from app.services.adaptive_risk_engine import AdaptiveRiskEngine
from app.core.region_rules import RegionRuleManager

class ItineraryService:
    """
    Generalized Pan-India Itinerary & Logistics Optimization Service.
    Generates multi-day safety plans for any destination in India.
    """

    @classmethod
    async def generate_itinerary(
        cls,
        destination_query: str,
        duration_days: int = 2,
        budget_tier: str = "STANDARD",
        total_budget_inr: float = 12000.0,
        fitness_level: str = "MODERATE",
        language: str = "en",
        weather_override: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Dynamically resolves place and generates safety-weighted itinerary.
        """
        dest = await DestinationResolver.resolve(destination_query)
        region_type = dest.get("region_type", "HILL_MOUNTAIN")
        region_profile = RegionRuleManager.get_profile(region_type)
        
        days_count = max(1, min(3, duration_days))
        checkpoints = dest.get("checkpoints", [])
        hazard_zones = dest.get("hazard_zones", [])

        # Budget Allocation with 15% emergency reserve
        budget_summary = cls._calculate_regional_budget(total_budget_inr, budget_tier, days_count, region_type)

        # Build day-wise plan
        days_plan = []
        overall_scores = []

        if days_count == 1:
            day_cps = checkpoints
            day_items = cls._evaluate_items(day_cps, region_type, hazard_zones, weather_override)
            day_score = round(sum(i["total_risk_score"] for i in day_items) / max(1, len(day_items)), 1)
            days_plan.append({
                "day_number": 1,
                "title": f"Day 1: Full-Day Circuit across {dest['canonical_name']}",
                "distance_km": 14.0,
                "elevation_gain_m": 450 if region_type == "HILL_MOUNTAIN" else 50,
                "acclimatization_safety": f"Curfew: {region_profile['curfew_time']}. Ensure return before sunset.",
                "checkpoints": day_items,
                "day_risk_score": day_score
            })
            overall_scores.append(day_score)

        elif days_count == 2:
            mid = max(1, len(checkpoints) // 2)
            d1_cps = checkpoints[:mid + 1]
            d2_cps = checkpoints[mid:] if len(checkpoints) > mid else checkpoints

            d1_items = cls._evaluate_items(d1_cps, region_type, hazard_zones, weather_override)
            d2_items = cls._evaluate_items(d2_cps, region_type, hazard_zones, weather_override)

            d1_score = round(sum(i["total_risk_score"] for i in d1_items) / max(1, len(d1_items)), 1)
            d2_score = round(sum(i["total_risk_score"] for i in d2_items) / max(1, len(d2_items)), 1)

            days_plan.append({
                "day_number": 1,
                "title": f"Day 1: Arrival & Core Sector Transit ({dest['canonical_name']})",
                "distance_km": 11.0,
                "elevation_gain_m": 350 if region_type == "HILL_MOUNTAIN" else 30,
                "acclimatization_safety": f"Safe pacing. Night halt strictly adhering to {region_profile['curfew_time']} curfew.",
                "checkpoints": d1_items,
                "day_risk_score": d1_score
            })
            days_plan.append({
                "day_number": 2,
                "title": f"Day 2: Landmark Circuit & Safe Departure",
                "distance_km": 12.5,
                "elevation_gain_m": 200 if region_type == "HILL_MOUNTAIN" else 20,
                "acclimatization_safety": "Return transit on approved bypass corridors.",
                "checkpoints": d2_items,
                "day_risk_score": d2_score
            })
            overall_scores.extend([d1_score, d2_score])

        else: # 3-Day Plan
            chunk = max(1, len(checkpoints) // 3)
            d1_cps = checkpoints[:chunk + 1]
            d2_cps = checkpoints[chunk: chunk * 2 + 1] if len(checkpoints) > chunk * 2 else checkpoints[:2]
            d3_cps = checkpoints[chunk * 2:] if len(checkpoints) > chunk * 2 else checkpoints

            d1_items = cls._evaluate_items(d1_cps, region_type, hazard_zones, weather_override)
            d2_items = cls._evaluate_items(d2_cps, region_type, hazard_zones, weather_override)
            d3_items = cls._evaluate_items(d3_cps, region_type, hazard_zones, weather_override)

            d1_score = round(sum(i["total_risk_score"] for i in d1_items) / max(1, len(d1_items)), 1)
            d2_score = round(sum(i["total_risk_score"] for i in d2_items) / max(1, len(d2_items)), 1)
            d3_score = round(sum(i["total_risk_score"] for i in d3_items) / max(1, len(d3_items)), 1)

            days_plan.append({"day_number": 1, "title": f"Day 1: Base Check-in & Orientation ({dest['canonical_name']})", "distance_km": 6.0, "elevation_gain_m": 200 if region_type == "HILL_MOUNTAIN" else 20, "acclimatization_safety": "Low intensity start.", "checkpoints": d1_items, "day_risk_score": d1_score})
            days_plan.append({"day_number": 2, "title": f"Day 2: Prime Excursion & Regional Circuit", "distance_km": 8.5, "elevation_gain_m": 350 if region_type == "HILL_MOUNTAIN" else 40, "acclimatization_safety": "Peak sector activity with hydration stops.", "checkpoints": d2_items, "day_risk_score": d2_score})
            days_plan.append({"day_number": 3, "title": f"Day 3: Scenic Overlook & Safe Return", "distance_km": 10.0, "elevation_gain_m": 100 if region_type == "HILL_MOUNTAIN" else 10, "acclimatization_safety": "Controlled departure along bypass route.", "checkpoints": d3_items, "day_risk_score": d3_score})
            overall_scores.extend([d1_score, d2_score, d3_score])

        overall_score = round(sum(overall_scores) / max(1, len(overall_scores)), 1)

        return {
            "destination_id": dest["id"],
            "destination": dest["canonical_name"],
            "state_ut": dest["state_ut"],
            "region_type": region_type,
            "region_name": region_profile["name"],
            "emergency_agency": region_profile["emergency_agency"],
            "duration_days": days_count,
            "fitness_level": fitness_level,
            "overall_safety_score": overall_score,
            "overall_risk_category": "LOW" if overall_score <= 35 else ("MODERATE" if overall_score <= 65 else "HIGH"),
            "budget_breakdown": budget_summary,
            "days": days_plan,
            "mandatory_safety_advisories": region_profile["advisories"],
            "trail_coords": dest.get("trail_coords", []),
            "bypass_coords": dest.get("bypass_coords", []),
            "hazard_zones": dest.get("hazard_zones", []),
            "shelters": dest.get("shelters", [])
        }

    @classmethod
    def _evaluate_items(cls, checkpoints, region_type, hazard_zones, weather):
        items = []
        for idx, cp in enumerate(checkpoints):
            risk_eval = AdaptiveRiskEngine.evaluate_checkpoint_risk(
                checkpoint=cp,
                region_type=region_type,
                hazard_zones=hazard_zones,
                weather=weather
            )
            items.append({
                "sequence": idx + 1,
                "checkpoint_id": cp["id"],
                "name": cp["name"],
                "name_hi": cp.get("name_hi", cp["name"]),
                "altitude_m": cp.get("altitude_m", 100),
                "lat": cp["lat"],
                "lon": cp["lon"],
                "facilities": cp.get("facilities", ["First Aid"]),
                "has_oxygen_booth": cp.get("has_oxygen_booth", False),
                "total_risk_score": risk_eval["total_risk_score"],
                "risk_level": risk_eval["risk_level"],
                "badge_color": risk_eval["badge_color"],
                "sub_scores": risk_eval["sub_scores"],
                "reroute_needed": risk_eval["reroute_needed"]
            })
        return items

    @classmethod
    def _calculate_regional_budget(cls, total_budget: float, tier: str, days: int, region_type: str) -> Dict[str, Any]:
        """
        Calculates realistic expense distribution tailored to Indian region types.
        """
        if tier == "BUDGET":
            stay_per_night = 500.0 # Govt dorms / simple homestay
            food_per_day = 400.0
            special_permit = 200.0 if region_type == "FOREST_WILDLIFE" else 50.0
        elif tier == "STANDARD":
            stay_per_night = 1500.0 # State tourism cottages (GMVN/OTDC/RTDC/KTDC)
            food_per_day = 700.0
            special_permit = 1200.0 if region_type == "FOREST_WILDLIFE" else 300.0
        else: # COMFORT
            stay_per_night = 3800.0 # Heritage resort / premium eco-lodge
            food_per_day = 1200.0
            special_permit = 2500.0

        stay_total = stay_per_night * max(1, days - 1)
        food_total = food_per_day * days
        transit_total = 800.0 * days
        
        # Mandatory 15% Medical / Regional Emergency Cushion
        emergency_buffer = round(total_budget * 0.15, 2)
        allocated = round(stay_total + food_total + transit_total + special_permit + emergency_buffer, 2)
        remaining = round(max(0.0, total_budget - allocated), 2)

        return {
            "tier": tier,
            "total_budget_inr": total_budget,
            "allocated_total_inr": allocated,
            "remaining_balance_inr": remaining,
            "categories": {
                "accommodation_inr": stay_total,
                "food_and_hydration_inr": food_total,
                "local_transit_taxi_inr": transit_total,
                "permits_safari_darshan_inr": special_permit,
                "emergency_medical_reserve_inr": emergency_buffer
            }
        }
