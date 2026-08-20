from datetime import datetime, timedelta, date
from typing import Dict, Any, List, Optional
from app.services.destination_resolver import DestinationResolver
from app.services.adaptive_risk_engine import AdaptiveRiskEngine
from app.core.region_rules import RegionRuleManager

class ItineraryService:
    """
    Generalized Pan-India Itinerary & Logistics Optimization Service.
    Generates multi-day safety plans for any destination in India with custom dates and pacing.
    """

    @classmethod
    async def generate_itinerary(
        cls,
        destination_query: str,
        duration_days: int = 2,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        budget_tier: str = "STANDARD",
        total_budget_inr: float = 12000.0,
        fitness_level: str = "MODERATE",
        language: str = "en",
        weather_override: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Dynamically resolves place and generates safety-weighted itinerary with custom date ranges.
        """
        dest = await DestinationResolver.resolve(destination_query)
        region_type = dest.get("region_type", "HILL_MOUNTAIN")
        region_profile = RegionRuleManager.get_profile(region_type)

        # Parse and sanitize date range
        dt_start = date.today()
        if start_date:
            try:
                dt_start = datetime.strptime(start_date, "%Y-%m-%d").date()
            except Exception:
                dt_start = date.today()

        days_count = max(1, min(30, duration_days))
        if end_date:
            try:
                dt_end = datetime.strptime(end_date, "%Y-%m-%d").date()
                calc_days = (dt_end - dt_start).days + 1
                if calc_days >= 1:
                    days_count = max(1, min(30, calc_days))
            except Exception:
                pass

        dt_end = dt_start + timedelta(days=days_count - 1)
        start_date_str = dt_start.strftime("%Y-%m-%d")
        end_date_str = dt_end.strftime("%Y-%m-%d")

        checkpoints = dest.get("checkpoints", [])
        hazard_zones = dest.get("hazard_zones", [])

        # Budget Allocation with 15% emergency reserve
        budget_summary = cls._calculate_regional_budget(total_budget_inr, budget_tier, days_count, region_type)

        # Build dynamic day-wise plan
        days_plan = []
        overall_scores = []
        total_cps = len(checkpoints)

        for day_idx in range(1, days_count + 1):
            cur_date = dt_start + timedelta(days=day_idx - 1)
            date_iso = cur_date.strftime("%Y-%m-%d")
            date_display = cur_date.strftime("%a, %d %b %Y")
            short_date = cur_date.strftime("%d %b")

            # Partition checkpoints for this day
            if days_count == 1:
                day_cps = checkpoints
                title = f"Day 1 ({short_date}): Full-Day Circuit across {dest['canonical_name']}"
                dist_km = 14.0
                elev_gain = 450 if region_type == "HILL_MOUNTAIN" else 50
                pacing_note = f"Curfew: {region_profile['curfew_time']}. Strict departure before 07:30 IST required."
            elif days_count == 2:
                mid = max(1, total_cps // 2)
                day_cps = checkpoints[:mid + 1] if day_idx == 1 else (checkpoints[mid:] if total_cps > mid else checkpoints)
                if day_idx == 1:
                    title = f"Day 1 ({short_date}): Arrival & Core Sector Transit ({dest['canonical_name']})"
                    dist_km = 11.0
                    elev_gain = 350 if region_type == "HILL_MOUNTAIN" else 30
                    pacing_note = f"Safe pacing. Night halt strictly adhering to {region_profile['curfew_time']} curfew."
                else:
                    title = f"Day 2 ({short_date}): Landmark Circuit & Safe Departure"
                    dist_km = 12.5
                    elev_gain = 200 if region_type == "HILL_MOUNTAIN" else 20
                    pacing_note = "Return transit along verified safe bypass corridors."
            elif days_count == 3:
                chunk = max(1, total_cps // 3)
                if day_idx == 1:
                    day_cps = checkpoints[:chunk + 1]
                    title = f"Day 1 ({short_date}): Base Check-in & Acclimatization ({dest['canonical_name']})"
                    dist_km = 6.0
                    elev_gain = 200 if region_type == "HILL_MOUNTAIN" else 20
                    pacing_note = "Low intensity acclimatization pacing. Monitor hydration."
                elif day_idx == 2:
                    day_cps = checkpoints[chunk: chunk * 2 + 1] if total_cps > chunk * 2 else checkpoints[:2]
                    title = f"Day 2 ({short_date}): Prime Excursion & Regional Circuit"
                    dist_km = 9.5
                    elev_gain = 380 if region_type == "HILL_MOUNTAIN" else 40
                    pacing_note = "Peak sector exploration with scheduled safety halts."
                else:
                    day_cps = checkpoints[chunk * 2:] if total_cps > chunk * 2 else checkpoints
                    title = f"Day 3 ({short_date}): Scenic Overlook & Safe Return"
                    dist_km = 8.0
                    elev_gain = 120 if region_type == "HILL_MOUNTAIN" else 10
                    pacing_note = "Controlled departure along designated egress trail."
            else:
                # Custom Extended Duration (4 - 30 days)
                start_i = int(((day_idx - 1) / days_count) * total_cps)
                end_i = max(start_i + 1, int((day_idx / days_count) * total_cps) + 1)
                day_cps = checkpoints[start_i:end_i] if start_i < total_cps else checkpoints[-2:]
                if not day_cps:
                    day_cps = [checkpoints[0]] if checkpoints else []

                if day_idx == 1:
                    title = f"Day 1 ({short_date}): Base Arrival & Altitude Acclimatization"
                    dist_km = 5.5
                    elev_gain = 180 if region_type == "HILL_MOUNTAIN" else 20
                    pacing_note = "Low physical load. Baseline health checks & environmental orientation."
                elif day_idx == days_count:
                    title = f"Day {day_idx} ({short_date}): Expedition Finale & Return Transit"
                    dist_km = 7.0
                    elev_gain = 90 if region_type == "HILL_MOUNTAIN" else 10
                    pacing_note = "Safe descent / egress to nearest transport terminal."
                elif day_idx % 3 == 0 and region_type == "HILL_MOUNTAIN":
                    title = f"Day {day_idx} ({short_date}): Acclimatization Rest & Radial Exploration"
                    dist_km = 4.0
                    elev_gain = 150
                    pacing_note = "Active rest interval. High fluid intake and altitude acclimatization buffer."
                else:
                    title = f"Day {day_idx} ({short_date}): Stage {day_idx} Sector Traverse & POI Exploration"
                    dist_km = 8.5
                    elev_gain = 280 if region_type == "HILL_MOUNTAIN" else 30
                    pacing_note = f"Steady cadence adhering to {region_profile['curfew_time']} safety curfew."

            day_items = cls._evaluate_items(day_cps, region_type, hazard_zones, weather_override, dest.get("pilgrimage_metadata"))
            day_score = round(sum(i["total_risk_score"] for i in day_items) / max(1, len(day_items)), 1) if day_items else 20.0

            days_plan.append({
                "day_number": day_idx,
                "date": date_iso,
                "date_display": date_display,
                "title": title,
                "distance_km": dist_km,
                "elevation_gain_m": elev_gain,
                "acclimatization_safety": pacing_note,
                "checkpoints": day_items,
                "day_risk_score": day_score
            })
            overall_scores.append(day_score)

        overall_score = round(sum(overall_scores) / max(1, len(overall_scores)), 1) if overall_scores else 25.0

        return {
            "destination_id": dest["id"],
            "destination": dest["canonical_name"],
            "state_ut": dest["state_ut"],
            "region_type": region_type,
            "region_name": region_profile["name"],
            "category": dest.get("category", "general"),
            "emergency_agency": region_profile["emergency_agency"],
            "duration_days": days_count,
            "start_date": start_date_str,
            "end_date": end_date_str,
            "fitness_level": fitness_level,
            "overall_safety_score": overall_score,
            "overall_risk_category": "LOW" if overall_score <= 35 else ("MODERATE" if overall_score <= 65 else "HIGH"),
            "budget_breakdown": budget_summary,
            "days": days_plan,
            "mandatory_safety_advisories": region_profile["advisories"],
            "trail_coords": dest.get("trail_coords", []),
            "bypass_coords": dest.get("bypass_coords", []),
            "hazard_zones": dest.get("hazard_zones", []),
            "shelters": dest.get("shelters", []),
            "pilgrimage_metadata": dest.get("pilgrimage_metadata")
        }

    @classmethod
    def _evaluate_items(cls, checkpoints, region_type, hazard_zones, weather, pilgrimage_metadata=None):
        items = []
        for idx, cp in enumerate(checkpoints):
            risk_eval = AdaptiveRiskEngine.evaluate_checkpoint_risk(
                checkpoint=cp,
                region_type=region_type,
                hazard_zones=hazard_zones,
                weather=weather,
                pilgrimage_metadata=pilgrimage_metadata
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
