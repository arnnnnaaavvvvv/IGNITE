from datetime import datetime, timedelta, date
from typing import Dict, Any, List, Optional
from app.services.destination_resolver import DestinationResolver
from app.services.adaptive_risk_engine import AdaptiveRiskEngine
from app.core.region_rules import RegionRuleManager

class ItineraryService:
    """
    Generalized Pan-India Itinerary & Logistics Optimization Service.
    Generates multi-day safety plans for any destination in India with:
    - Clear daily visit suggestions ("Where to visit today")
    - Best view timings & photography / lighting recommendations
    - Opening and closing hours for every attraction
    - Date-aware traffic and route safety analysis
    - Alternate detour suggestions
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
        Dynamically resolves place and generates safety-weighted itinerary with custom date ranges,
        live traffic assessment, opening/closing hours, and best view timings.
        """
        dest = await DestinationResolver.resolve(destination_query)
        region_type = dest.get("region_type", "HILL_MOUNTAIN")
        region_profile = RegionRuleManager.get_profile(region_type)
        dest_name = dest["canonical_name"]

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

            # Partition checkpoints for this day and build friendly plain English titles
            if days_count == 1:
                day_cps = checkpoints
                title = f"Day 1 ({short_date}): Full-Day Sightseeing across {dest_name}"
                title_hi = f"दिन 1 ({short_date}): {dest_name} के प्रमुख दर्शनीय स्थल"
                dist_km = 12.0
                elev_gain = 350 if region_type == "HILL_MOUNTAIN" else 40
                pacing_note = "Comfortable pace. Start by 8:30 AM to enjoy all sights before evening." if region_type != "HILL_MOUNTAIN" else "Steady pace. Start by 7:00 AM and reach your stay before 5:30 PM."
            elif days_count == 2:
                mid = max(1, total_cps // 2)
                if day_idx == 1:
                    day_cps = checkpoints[:mid + 1]
                    first_cp_name = checkpoints[0]["name"] if checkpoints else dest_name
                    title = f"Day 1 ({short_date}): Arrival & Sightseeing around {first_cp_name}"
                    title_hi = f"दिन 1 ({short_date}): आगमन एवं {first_cp_name} के आसपास भ्रमण"
                    dist_km = 9.5
                    elev_gain = 280 if region_type == "HILL_MOUNTAIN" else 30
                    pacing_note = "Relaxed pace. Enjoy the afternoon sights and return to hotel by 10:00 PM." if region_type != "HILL_MOUNTAIN" else "Steady pace. Reach your overnight stay before 5:30 PM."
                else:
                    day_cps = checkpoints[mid:] if total_cps > mid else checkpoints
                    second_cp_name = checkpoints[-1]["name"] if checkpoints else dest_name
                    title = f"Day 2 ({short_date}): Major Landmarks & {second_cp_name} Tour"
                    title_hi = f"दिन 2 ({short_date}): प्रमुख स्मारक एवं {second_cp_name} भ्रमण"
                    dist_km = 11.0
                    elev_gain = 180 if region_type == "HILL_MOUNTAIN" else 20
                    pacing_note = "Comfortable travel day with time for photography and local dining."
            elif days_count == 3:
                chunk = max(1, total_cps // 3)
                if day_idx == 1:
                    day_cps = checkpoints[:chunk + 1]
                    title = f"Day 1 ({short_date}): Arrival & Orientation in {dest_name}"
                    title_hi = f"दिन 1 ({short_date}): आगमन एवं {dest_name} में विश्राम व भ्रमण"
                    dist_km = 6.0
                    elev_gain = 180 if region_type == "HILL_MOUNTAIN" else 20
                    pacing_note = "Easy, relaxing start. Settle in and explore nearby spots."
                elif day_idx == 2:
                    day_cps = checkpoints[chunk: chunk * 2 + 1] if total_cps > chunk * 2 else checkpoints[:2]
                    title = f"Day 2 ({short_date}): Prime Attractions & Scenic Tour"
                    title_hi = f"दिन 2 ({short_date}): मुख्य आकर्षण एवं दर्शनीय स्थल"
                    dist_km = 9.5
                    elev_gain = 320 if region_type == "HILL_MOUNTAIN" else 35
                    pacing_note = "Full sightseeing day. Visit morning spots early to skip ticket queues."
                else:
                    day_cps = checkpoints[chunk * 2:] if total_cps > chunk * 2 else checkpoints
                    title = f"Day 3 ({short_date}): Scenic Views & Return Travel"
                    title_hi = f"दिन 3 ({short_date}): मनमोहक दृश्य एवं सुरक्षित वापसी"
                    dist_km = 7.5
                    elev_gain = 120 if region_type == "HILL_MOUNTAIN" else 15
                    pacing_note = "Leisurely departure day with plenty of time for souvenir shopping."
            else:
                # Custom Extended Duration (4 - 30 days)
                start_i = int(((day_idx - 1) / days_count) * total_cps)
                end_i = max(start_i + 1, int((day_idx / days_count) * total_cps) + 1)
                day_cps = checkpoints[start_i:end_i] if start_i < total_cps else checkpoints[-2:]
                if not day_cps:
                    day_cps = [checkpoints[0]] if checkpoints else []

                if day_idx == 1:
                    title = f"Day 1 ({short_date}): Arrival & Local Exploration in {dest_name}"
                    title_hi = f"दिन 1 ({short_date}): आगमन एवं स्थानीय भ्रमण"
                    dist_km = 5.5
                    elev_gain = 150 if region_type == "HILL_MOUNTAIN" else 20
                    pacing_note = "Gentle start with light walking and local orientation."
                elif day_idx == days_count:
                    title = f"Day {day_idx} ({short_date}): Trip Finale & Departure"
                    title_hi = f"दिन {day_idx} ({short_date}): यात्रा समापन एवं प्रस्थान"
                    dist_km = 6.5
                    elev_gain = 80 if region_type == "HILL_MOUNTAIN" else 10
                    pacing_note = "Safe and comfortable departure."
                elif day_idx % 3 == 0 and region_type == "HILL_MOUNTAIN":
                    title = f"Day {day_idx} ({short_date}): Relaxed Rest Day & Scenic Walks"
                    title_hi = f"दिन {day_idx} ({short_date}): विश्राम एवं आसपास टहलना"
                    dist_km = 4.0
                    elev_gain = 100
                    pacing_note = "Restful day to recharge and enjoy the mountain views."
                else:
                    title = f"Day {day_idx} ({short_date}): Sightseeing Circuit & Local Sights"
                    title_hi = f"दिन {day_idx} ({short_date}): दर्शनीय स्थल भ्रमण"
                    dist_km = 8.0
                    elev_gain = 220 if region_type == "HILL_MOUNTAIN" else 25
                    pacing_note = "Steady sightseeing with comfortable rest intervals."

            day_items = cls._evaluate_items(day_cps, region_type, hazard_zones, weather_override, dest.get("pilgrimage_metadata"))
            day_score = round(sum(i["total_risk_score"] for i in day_items) / max(1, len(day_items)), 1) if day_items else 20.0

            # Dynamic Date-Aware Traffic & Alternate Route Calculation
            traffic_route_info = cls._generate_day_traffic_and_routes(cur_date, dest_name, region_type, day_score)

            # Build where to visit highlight for this day
            cp_names = [cp["name"] for cp in day_items]
            if len(cp_names) >= 2:
                day_highlight = f"Visit {cp_names[0]} during morning hours, then continue to {cp_names[-1]} for scenic views and photography."
                day_highlight_hi = f"सुबह के समय {day_items[0].get('name_hi', cp_names[0])} जाएं, फिर सुंदर दृश्यों के लिए {day_items[-1].get('name_hi', cp_names[-1])} का भ्रमण करें।"
            elif len(cp_names) == 1:
                day_highlight = f"Explore {cp_names[0]} with plenty of time for sightseeing, photography, and local dining."
                day_highlight_hi = f"{day_items[0].get('name_hi', cp_names[0])} का इत्मीनान से भ्रमण करें और आसपास के नजारों का आनंद लें।"
            else:
                day_highlight = f"Explore key sights and scenic viewpoints across {dest_name}."
                day_highlight_hi = f"{dest_name} के प्रमुख दर्शनीय स्थलों और मनोरम दृश्यों का आनंद लें।"

            days_plan.append({
                "day_number": day_idx,
                "date": date_iso,
                "date_display": date_display,
                "title": title,
                "title_hi": title_hi,
                "distance_km": dist_km,
                "elevation_gain_m": elev_gain,
                "acclimatization_safety": pacing_note,
                "day_highlight": day_highlight,
                "day_highlight_hi": day_highlight_hi,
                "checkpoints": day_items,
                "day_risk_score": day_score,
                "traffic_level": traffic_route_info["traffic_level"],
                "traffic_summary": traffic_route_info["traffic_summary"],
                "traffic_summary_hi": traffic_route_info["traffic_summary_hi"],
                "suggested_route": traffic_route_info["suggested_route"],
                "suggested_route_hi": traffic_route_info["suggested_route_hi"],
                "alternate_route": traffic_route_info["alternate_route"],
                "alternate_route_hi": traffic_route_info["alternate_route_hi"],
                "is_alternate_recommended": traffic_route_info["is_alternate_recommended"]
            })
            overall_scores.append(day_score)

        overall_score = round(sum(overall_scores) / max(1, len(overall_scores)), 1) if overall_scores else 25.0

        # Destination-tailored plain English travel advice
        tailored_advisories = cls._generate_tailored_advisories(dest_name, region_type, region_profile["advisories"])

        return {
            "destination_id": dest["id"],
            "destination": dest_name,
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
            "mandatory_safety_advisories": tailored_advisories,
            "trail_coords": dest.get("trail_coords", []),
            "bypass_coords": dest.get("bypass_coords", []),
            "hazard_zones": dest.get("hazard_zones", []),
            "shelters": dest.get("shelters", []),
            "pilgrimage_metadata": dest.get("pilgrimage_metadata")
        }

    @classmethod
    def _generate_day_traffic_and_routes(cls, cur_date: date, dest_name: str, region_type: str, day_score: float) -> Dict[str, Any]:
        """
        Determines traffic forecast for the selected date and recommends safe & alternate routes.
        """
        day_name = cur_date.strftime("%A")
        is_weekend = day_name in ["Saturday", "Sunday"]
        is_friday = day_name == "Friday"
        name_lower = dest_name.lower()

        if is_weekend:
            traffic_level = "HIGH"
            traffic_summary = f"Weekend Peak ({day_name}) • High visitor traffic at major sights"
            traffic_summary_hi = f"सप्ताहांत भीड़ ({day_name}) • प्रमुख स्थलों पर अधिक आवागमन"
            is_alt_rec = True
        elif is_friday:
            traffic_level = "MODERATE"
            traffic_summary = f"Moderate Flow ({day_name}) • Steady visitor movement"
            traffic_summary_hi = f"मध्यम आवागमन ({day_name}) • सामान्य आवाजाही"
            is_alt_rec = day_score > 35
        else:
            traffic_level = "LOW"
            traffic_summary = f"Light Traffic ({day_name}) • Best time for quick and quiet sightseeing"
            traffic_summary_hi = f"कम ट्रैफिक ({day_name}) • घूमने और दर्शन के लिए सबसे उत्तम समय"
            is_alt_rec = day_score > 50

        # Destination Specific Route & Alternate Detour
        if "jaipur" in name_lower or "amer" in name_lower or "hawa mahal" in name_lower:
            suggested_route = "Primary Route: MI Road & Amer Road via Old City Gates"
            suggested_route_hi = "मुख्य मार्ग: एमआई रोड एवं आमेर रोड (पुराने शहर के द्वार से)"
            alternate_route = "Alternate Route (Less Traffic): Use Jaipur Bypass & JLN Marg — skips Old City market bottlenecks and saves 25 mins."
            alternate_route_hi = "वैकल्पिक मार्ग (कम ट्रैफिक): जयपुर बाईपास व जेएलएन मार्ग लें — पुराने शहर के जाम से 25 मिनट की बचत।"
        elif "kedarnath" in name_lower or "badrinath" in name_lower or "rishikesh" in name_lower:
            suggested_route = "Primary Trail: Main Valley Pilgrimage Trail along the river corridor"
            suggested_route_hi = "मुख्य मार्ग: नदी किनारे मुख्य तीर्थ यात्रा ट्रेक"
            alternate_route = "Alternate Route (Safer / Less Crowded): Take Upper Ridge Bypass Trail via Bheembali — gradual slope and avoids riverbank congestion."
            alternate_route_hi = "वैकल्पिक मार्ग (सुरक्षित व कम भीड़): भीमबली से ऊपरी रिज बाईपास मार्ग लें — चढ़ाई आसान और संकरे रास्तों से बचाव।"
        elif "leh" in name_lower or "ladakh" in name_lower or "khardung" in name_lower:
            suggested_route = "Primary Route: Leh-Manali / Leh-Srinagar Highway & Khardung La Pass Road"
            suggested_route_hi = "मुख्य मार्ग: लेह हाईवे एवं खारदुंग ला दर्रा मार्ग"
            alternate_route = "Alternate Route (Scenic Bypass): Upper Choglamsar Scenic By-road — avoids city junction congestion."
            alternate_route_hi = "वैकल्पिक मार्ग (सुगम बाईपास): ऊपरी चोगलमसार बाईपास मार्ग — शहर के ट्रैफिक से बचाव।"
        elif "puri" in name_lower or "goa" in name_lower or "digha" in name_lower or region_type == "COASTAL_MARINE":
            suggested_route = "Primary Route: Main Beach Boulevard & Temple Grand Road"
            suggested_route_hi = "मुख्य मार्ग: मुख्य बीच रोड एवं ग्रैंड रोड"
            alternate_route = "Alternate Route (Less Congested): Marine Drive Coastal Link Road — smooth movement with direct parking access."
            alternate_route_hi = "वैकल्पिक मार्ग (कम जाम): मरीन ड्राइव कोस्टल लिंक रोड — बिना जाम के सुगम आवागमन व पार्किंग सुविधा।"
        elif "manali" in name_lower or "munnar" in name_lower or region_type == "HILL_MOUNTAIN":
            suggested_route = "Primary Route: Main Highway Corridor (NH-3 / State Highway)"
            suggested_route_hi = "मुख्य मार्ग: मुख्य हाईवे एवं पर्यटन मार्ग"
            alternate_route = "Alternate Route (Scenic & Quiet): Left Bank Valley By-road — avoids tourist bus queues and steep chokepoints."
            alternate_route_hi = "वैकल्पिक मार्ग (शांत व सुगम): लेफ्ट बैंक बाईपास मार्ग — पर्यटक बसों की कतारों और संकरे मोड़ों से बचाव।"
        elif "kaziranga" in name_lower or "jim corbett" in name_lower or region_type == "FOREST_WILDLIFE":
            suggested_route = "Primary Route: Central Forest Gate Safari Circuit"
            suggested_route_hi = "मुख्य मार्ग: सेंट्रल गेट सफारी सर्किट"
            alternate_route = "Alternate Route (Less Crowded): Western Range High-Ground Track with armed forest escort."
            alternate_route_hi = "वैकल्पिक मार्ग (कम भीड़): वेस्टर्न रेंज हाई-ग्राउंड ट्रैक (वन रक्षकों की निगरानी में)।"
        elif "varanasi" in name_lower or "kashi" in name_lower or "ayodhya" in name_lower or "mathura" in name_lower:
            suggested_route = "Primary Route: Main Temple Heritage Plaza Corridor"
            suggested_route_hi = "मुख्य मार्ग: मुख्य मंदिर कॉरिडोर एवं घाट मार्ग"
            alternate_route = "Alternate Route (Pedestrian Friendly): Dashashwamedh Upper Link & Maidagin Bypass — avoids tight alley bottlenecks."
            alternate_route_hi = "वैकल्पिक मार्ग (पैदल चलने के लिए सुगम): मैदागिन बाईपास व ऊपरी लिंक रोड — संकरी गलियों की भीड़ से बचाव।"
        else:
            suggested_route = f"Primary Route: Main Central Transit Corridor ({dest_name})"
            suggested_route_hi = f"मुख्य मार्ग: मुख्य शहर एवं पर्यटन मार्ग ({dest_name})"
            alternate_route = f"Alternate Route (Less Traffic): Ring Road / Outer Green Corridor ({dest_name}) — skips central city signals."
            alternate_route_hi = f"वैकल्पिक मार्ग (कम ट्रैफिक): आउटर रिंग रोड / बाईपास ({dest_name}) — शहर के ट्रैफिक से बचाव।"

        return {
            "traffic_level": traffic_level,
            "traffic_summary": traffic_summary,
            "traffic_summary_hi": traffic_summary_hi,
            "suggested_route": suggested_route,
            "suggested_route_hi": suggested_route_hi,
            "alternate_route": alternate_route,
            "alternate_route_hi": alternate_route_hi,
            "is_alternate_recommended": is_alt_rec
        }

    @classmethod
    def _generate_tailored_advisories(cls, dest_name: str, region_type: str, fallback_advisories: List[str]) -> List[str]:
        """
        Produces destination-specific, practical advice in plain English.
        """
        name_lower = dest_name.lower()
        if "jaipur" in name_lower or "amer" in name_lower:
            return [
                "Visit Amer Fort & City Palace early (before 10:30 AM) to avoid long ticket lines and afternoon heat.",
                "Use pre-booked digital passes or official ticket counters at monument entry gates.",
                "Carry a water bottle and wear comfortable walking shoes for heritage fort courtyards."
            ]
        elif "kedarnath" in name_lower:
            return [
                "Start daily morning walk by 06:00 AM and reach your night shelter before 5:30 PM.",
                "Drink plenty of water and take brief rest stops above 2,700m elevation.",
                "Keep warm thermal layers and basic personal first-aid in your day pack."
            ]
        elif "leh" in name_lower or "ladakh" in name_lower or "khardung" in name_lower:
            return [
                "Spend your first 24–48 hours resting in Leh to allow your body to adjust to high altitude.",
                "Visit Khardung La Pass between 08:30 AM and 11:30 AM before weather becomes windy and cold.",
                "Drink 3–4 litres of water daily and carry portable oxygen canisters."
            ]
        elif "puri" in name_lower or "goa" in name_lower:
            return [
                "Swim only in lifeguard-patrolled zones with green flags.",
                "Follow evening beach safety guidelines and avoid swimming after sunset.",
                "Stay hydrated and carry sunscreen during sunny hours."
            ]
        elif "manali" in name_lower:
            return [
                "Start early to cross mountain passes and avoid peak tourist vehicle queues.",
                "Take time on Day 1 to rest and adjust to the mountain air.",
                "Carry warm windproof jackets and emergency snacks."
            ]
        elif "varanasi" in name_lower:
            return [
                "Reach the evening prayer ghats 45 minutes early for a comfortable seating spot.",
                "Use the designated one-way pedestrian lanes along the temple corridors.",
                "Wear slip-resistant footwear when walking near river steps."
            ]
        else:
            return [
                "Start morning sightseeing early to enjoy popular sights with fewer crowds.",
                "Carry drinking water and keep local emergency helpline numbers saved on your phone.",
                "Follow local signage and designated one-way visitor walkways."
            ]

    @classmethod
    def _generate_checkpoint_timings_and_views(cls, cp_name: str, region_type: str, altitude_m: int, idx: int) -> Dict[str, str]:
        """
        Generates realistic opening/closing hours, optimal viewing timings, and photography tips.
        """
        name_l = cp_name.lower()

        # 1. Temples, Mandirs, Dhams, Ashrams, Ghats
        if any(w in name_l for w in ["temple", "mandir", "dham", "shrine", "jyotirlinga", "ghat", "aarti", "gurudwara", "monastery", "gompa", "math", "dargah"]):
            opening = "04:30 AM – 09:30 PM"
            opening_hi = "प्रातः 04:30 – रात्रि 09:30"
            best_time = "06:00 AM – 08:30 AM"
            best_time_hi = "सुबह 06:00 – 08:30"
            best_tip = "Morning prayers and serene aarti before the peak rush of devotees"
            best_tip_hi = "प्रातःकालीन आरती एवं शांत वातावरण (दिन की भीड़ से पहले)"
            why_visit = "Spiritual centerpiece with serene ambiance and rich heritage."
            why_visit_hi = "आध्यात्मिक शांति और भव्य भक्तिमय वातावरण।"

        # 2. Forts, Palaces, Museums, Monolithic monuments
        elif any(w in name_l for w in ["fort", "palace", "mahal", "museum", "monument", "memorial", "qila", "ruins", "haveli"]):
            opening = "08:30 AM – 05:30 PM"
            opening_hi = "सुबह 08:30 – शाम 05:30"
            best_time = "09:00 AM – 11:00 AM" if idx == 0 else "03:30 PM – 05:30 PM"
            best_time_hi = "सुबह 09:00 – 11:00" if idx == 0 else "दोपहर 03:30 – शाम 05:30"
            best_tip = "Golden sunlight on ancient architecture with great lighting for photography"
            best_tip_hi = "ऐतिहासिक स्थापत्य कला पर सुनहरी धूप और फोटोग्राफी के लिए सबसे अच्छा समय"
            why_visit = "Iconic historical landmark with panoramic courtyard views and royal architecture."
            why_visit_hi = "भव्य वास्तुकला एवं मनोरम दृश्य वाला प्रसिद्ध ऐतिहासिक स्थल।"

        # 3. High Mountain Passes, Peaks, Ridges, Treks, Lakes
        elif any(w in name_l for w in ["pass", "la", "peak", "ridge", "lake", "glacier", "tal", "kund", "meadow", "bugyal", "valley", "viewpoint", "point"]) or (region_type == "HILL_MOUNTAIN" and altitude_m > 2500):
            opening = "Open 24/7 (Safe Daylight: 06:00 AM – 05:00 PM)"
            opening_hi = "24 घंटे खुला (दिन का सुरक्षित समय: प्रातः 06:00 – शाम 05:00)"
            best_time = "07:30 AM – 10:30 AM"
            best_time_hi = "सुबह 07:30 – 10:30"
            best_tip = "Crystal clear mountain views before high-altitude clouds and winds gather"
            best_tip_hi = "बादलों और तेज हवाओं से पहले बर्फ से ढकी चोटियों का स्पष्ट मनमोहक दृश्य"
            why_visit = "Breathtaking natural panorama, crisp mountain air, and dramatic snow-capped vistas."
            why_visit_hi = "बर्फ से ढकी चोटियों का अद्भुत दृश्य और शांत प्राकृतिक वातावरण।"

        # 4. Beaches, Promenades, Marine Drives, Coasts
        elif any(w in name_l for w in ["beach", "sea", "coast", "promenade", "marine", "cove", "lighthouse", "island"]):
            opening = "06:00 AM – 07:30 PM"
            opening_hi = "सुबह 06:00 – शाम 07:30"
            best_time = "04:30 PM – 06:45 PM"
            best_time_hi = "शाम 04:30 – 06:45"
            best_tip = "Spectacular sunset horizon with gentle sea breeze and active lifeguard patrol"
            best_tip_hi = "समुद्र तट पर मनमोहक सूर्यास्त एवं सुहावनी समुद्री हवा"
            why_visit = "Vibrant shoreline experience with stunning ocean views and relaxed coastal breeze."
            why_visit_hi = "शानदार समुद्री लहरों और सुहावने वातावरण का आनंद।"

        # 5. National Parks, Wildlife Sanctuaries, Safaris, Reserves
        elif any(w in name_l for w in ["safari", "national park", "sanctuary", "forest", "reserve", "wildlife", "zoo"]):
            opening = "06:00 AM – 10:30 AM & 02:30 PM – 05:30 PM"
            opening_hi = "प्रातः 06:00 – 10:30 एवं दोपहर 02:30 – शाम 05:30"
            best_time = "06:30 AM – 09:00 AM"
            best_time_hi = "सुबह 06:30 – 09:00"
            best_tip = "Early morning safari slot when animals and birds are most active around waterholes"
            best_tip_hi = "प्रातःकालीन सफारी जब वन्यजीव जलस्रोतों के पास सर्वाधिक सक्रिय रहते हैं"
            why_visit = "Thrilling wildlife encounters, pristine jungle trails, and exotic birdwatching."
            why_visit_hi = "रोमांचक जंगल सफारी और दुर्लभ वन्यजीवों को करीब से देखने का अवसर।"

        # 6. Transit Hubs, Acclimatization Centers, Base Camps
        elif any(w in name_l for w in ["transit", "hub", "station", "stand", "base", "acclimatization", "reception", "entry"]):
            opening = "24 Hours (Helpdesks: 07:00 AM – 09:00 PM)"
            opening_hi = "24 घंटे (सहायता केंद्र: सुबह 07:00 – रात 09:00)"
            best_time = "08:00 AM – 11:00 AM"
            best_time_hi = "सुबह 08:00 – 11:00"
            best_tip = "Get permits, verify health metrics, and collect updated local route advisories"
            best_tip_hi = "परमिट सत्यापन, स्वास्थ्य जांच एवं स्थानीय रूट जानकारी प्राप्त करने का सर्वोत्तम समय"
            why_visit = "Essential arrival base for orientation, gear checks, and local assistance."
            why_visit_hi = "यात्रा की तैयारी, स्वास्थ्य जांच और आवश्यक जानकारी प्राप्त करने का मुख्य केंद्र।"

        # 7. General Urban, Markets, Bazaars, Gardens
        else:
            opening = "09:00 AM – 08:00 PM"
            opening_hi = "सुबह 09:00 – रात 08:00"
            best_time = "04:00 PM – 06:30 PM"
            best_time_hi = "शाम 04:00 – 06:30"
            best_tip = "Pleasant evening temperatures with vibrant local culture and photography spots"
            best_tip_hi = "शाम का सुहावना मौसम, जीवंत संस्कृति और बेहतरीन तस्वीरें लेने का समय"
            why_visit = "Lively local destination with authentic regional atmosphere and scenic surroundings."
            why_visit_hi = "स्थानीय संस्कृति और सुंदर वातावरण का सुखद अनुभव।"

        return {
            "opening_hours": opening,
            "opening_hours_hi": opening_hi,
            "best_view_time": best_time,
            "best_view_time_hi": best_time_hi,
            "best_view_tip": best_tip,
            "best_view_tip_hi": best_tip_hi,
            "why_visit": why_visit,
            "why_visit_hi": why_visit_hi
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
            raw_facs = cp.get("facilities", ["Tourist Help", "First Aid"])
            # Simplify facility labels to everyday language
            cleaned_facs = [
                f.replace("Archaeological Medical Wing", "Medical Wing")
                 .replace("SNM Hospital Helpdesk", "Medical Help Desk")
                 .replace("Oxygen Parlour", "Oxygen Booth")
                 .replace("Army Medical Post", "Military Medical Post")
                 .replace("Hyperbaric Chamber", "Emergency Oxygen Chamber")
                 .replace("BRO Rescue", "Mountain Rescue Post")
                 .replace("Tourist Police Helpdesk", "Tourist Help Desk")
                 .replace("Tourist Security Post", "Safety Post")
                 .replace("Information Kiosk", "Information Desk")
                for f in raw_facs
            ]

            timing_info = cls._generate_checkpoint_timings_and_views(cp["name"], region_type, cp.get("altitude_m", 100), idx)

            items.append({
                "sequence": idx + 1,
                "checkpoint_id": cp["id"],
                "name": cp["name"],
                "name_hi": cp.get("name_hi", cp["name"]),
                "altitude_m": cp.get("altitude_m", 100),
                "lat": cp["lat"],
                "lon": cp["lon"],
                "facilities": cleaned_facs,
                "has_oxygen_booth": cp.get("has_oxygen_booth", False),
                "total_risk_score": risk_eval["total_risk_score"],
                "risk_level": risk_eval["risk_level"],
                "badge_color": risk_eval["badge_color"],
                "sub_scores": risk_eval["sub_scores"],
                "reroute_needed": risk_eval["reroute_needed"],
                "opening_hours": timing_info["opening_hours"],
                "opening_hours_hi": timing_info["opening_hours_hi"],
                "best_view_time": timing_info["best_view_time"],
                "best_view_time_hi": timing_info["best_view_time_hi"],
                "best_view_tip": timing_info["best_view_tip"],
                "best_view_tip_hi": timing_info["best_view_tip_hi"],
                "why_visit": timing_info["why_visit"],
                "why_visit_hi": timing_info["why_visit_hi"]
            })
        return items

    @classmethod
    def _calculate_regional_budget(cls, total_budget: float, tier: str, days: int, region_type: str) -> Dict[str, Any]:
        if tier == "BUDGET":
            stay_per_night = 500.0
            food_per_day = 400.0
            special_permit = 200.0 if region_type == "FOREST_WILDLIFE" else 50.0
        elif tier == "STANDARD":
            stay_per_night = 1500.0
            food_per_day = 700.0
            special_permit = 1200.0 if region_type == "FOREST_WILDLIFE" else 300.0
        else: # COMFORT
            stay_per_night = 3800.0
            food_per_day = 1200.0
            special_permit = 2500.0

        stay_total = stay_per_night * max(1, days - 1)
        food_total = food_per_day * days
        transit_total = 800.0 * days
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
