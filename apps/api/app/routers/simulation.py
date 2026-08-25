from fastapi import APIRouter, Query
from typing import Dict, Any, List, Optional
from app.services.destination_resolver import DestinationResolver
from app.core.region_rules import RegionRuleManager, REGION_CONFIGS

router = APIRouter(prefix="/simulation", tags=["Pan-India Disaster Simulation Bench"])

# Comprehensive Pan-India Major Disaster Benchmark Scenarios across all 6 environmental zones
PAN_INDIA_SIMULATION_SCENARIOS = [
    {
        "id": "scenario_himalaya_cloudburst",
        "title": "Himalayan Cloudburst & Landslide (Kedarnath / Manali)",
        "title_hi": "हिमालयी बादल फटना एवं भूस्खलन (केदारनाथ / मनाली)",
        "destination_match": "Kedarnath",
        "zone_name": "Himalayan North Zone",
        "region_type": "HILL_MOUNTAIN",
        "description": "Intense 42mm/hr flash rainfall with IMD Red Alert. Landslide breach triggers emergency reroute to Upper Ridge bypass.",
        "weather": {
            "precipitation_mm_hr": 42.0,
            "wind_speed_kmh": 45.0,
            "temperature_c": 6.0,
            "visibility_km": 0.8,
            "imd_alert": "RED"
        },
        "hazard_active": True,
        "expected_risk_category": "CRITICAL",
        "primary_agency": "SDRF Uttarakhand / Mountain Rescue Brigade",
        "evacuation_target": "GMVN Emergency Shelter & High-Ground Ridge"
    },
    {
        "id": "scenario_coastal_cyclone",
        "title": "Bay of Bengal Cyclone & Tidal Surge (Puri / Golden Beach)",
        "title_hi": "बंगाल की खाड़ी चक्रवात एवं समुद्री लहरें (पुरी / गोल्डन बीच)",
        "destination_match": "Puri",
        "zone_name": "Bay of Bengal Coastal Zone",
        "region_type": "COASTAL_MARINE",
        "description": "INCOIS High Wave alert (3.8m storm surge) and 65km/h gale winds. Marine police enforce mandatory beach evacuation to Multi-Purpose Cyclone Shelter.",
        "weather": {
            "precipitation_mm_hr": 35.0,
            "wind_speed_kmh": 68.0,
            "temperature_c": 27.0,
            "visibility_km": 1.2,
            "imd_alert": "RED"
        },
        "hazard_active": True,
        "expected_risk_category": "CRITICAL",
        "primary_agency": "Indian Coast Guard & Odisha Disaster Rapid Action Force (ODRAF)",
        "evacuation_target": "Puri Multi-Purpose Cyclone Shelter"
    },
    {
        "id": "scenario_arabian_marine_squall",
        "title": "Arabian Sea Gale & Rip Current Swell (Goa / Calangute)",
        "title_hi": "अरब सागर चक्रवाती लहरें एवं रिप करंट (गोवा)",
        "destination_match": "Goa Beaches & Promenade",
        "zone_name": "Arabian Sea Coastal Zone",
        "region_type": "COASTAL_MARINE",
        "description": "INCOIS High Swell Warning (3.2m waves) with sudden 58km/h monsoon squalls. Coastal police hoist double red flags; watersports halted.",
        "weather": {
            "precipitation_mm_hr": 29.0,
            "wind_speed_kmh": 58.0,
            "temperature_c": 28.0,
            "visibility_km": 2.0,
            "imd_alert": "ORANGE"
        },
        "hazard_active": True,
        "expected_risk_category": "HIGH",
        "primary_agency": "Goa Coastal Police & Lifeguard Safety Corps",
        "evacuation_target": "Calangute Tourist Security Centre"
    },
    {
        "id": "scenario_kaziranga_flood",
        "title": "Brahmaputra River Surge & Animal Corridor Flood (Kaziranga)",
        "title_hi": "ब्रह्मपुत्र नदी बाढ़ एवं वन्यजीव पलायन (काजीरंगा)",
        "destination_match": "Kaziranga",
        "zone_name": "Northeast Wildlife Corridor",
        "region_type": "FOREST_WILDLIFE",
        "description": "Central Water Commission flood level breach. Safari routes diverted to artificial high-ground ridges with armed forest escort.",
        "weather": {
            "precipitation_mm_hr": 28.0,
            "wind_speed_kmh": 24.0,
            "temperature_c": 24.0,
            "visibility_km": 2.5,
            "imd_alert": "ORANGE"
        },
        "hazard_active": True,
        "expected_risk_category": "HIGH",
        "primary_agency": "Assam Forest Protection Force & NDRF 1st Battalion",
        "evacuation_target": "Kohora Eco-Rest House High Platform"
    },
    {
        "id": "scenario_thar_heatwave",
        "title": "Thar Desert 46°C Extreme Heat & Dust Storm (Jaisalmer)",
        "title_hi": "थार मरुस्थल भीषण लू एवं अंधड़ (जैसलमेर)",
        "destination_match": "Jaisalmer",
        "zone_name": "Thar Arid & Desert Zone",
        "region_type": "DESERT_ARID",
        "description": "IMD Severe Heatwave Red Alert (46°C) with 40km/h blinding sandstorm. Outdoor dune traversal halted; tourists guided to RTDC emergency shelter.",
        "weather": {
            "precipitation_mm_hr": 0.0,
            "wind_speed_kmh": 44.0,
            "temperature_c": 46.0,
            "visibility_km": 0.6,
            "imd_alert": "RED"
        },
        "hazard_active": True,
        "expected_risk_category": "CRITICAL",
        "primary_agency": "Border Tourism Patrol & District Disaster Management Authority (DDMA)",
        "evacuation_target": "RTDC Sam Dunes Emergency Shelter"
    },
    {
        "id": "scenario_varanasi_flood_stampede",
        "title": "Ganga High Flood & Ghat Chokepoint Surge (Varanasi)",
        "title_hi": "गंगा बाढ़ चेतावनी एवं घाट संकीर्ण मार्ग भीड़ (वाराणसी)",
        "destination_match": "Kashi Vishwanath & Ghats",
        "zone_name": "Gangetic Riverine & Heritage Zone",
        "region_type": "URBAN_HERITAGE",
        "description": "CWC river level breach near Dashashwamedh Ghat with peak aarti crowd bottlenecks. Police initiate one-way corridor diversion.",
        "weather": {
            "precipitation_mm_hr": 22.0,
            "wind_speed_kmh": 32.0,
            "temperature_c": 33.0,
            "visibility_km": 3.0,
            "imd_alert": "ORANGE"
        },
        "hazard_active": True,
        "expected_risk_category": "HIGH",
        "primary_agency": "Varanasi Commissionerate & NDRF 11th Battalion",
        "evacuation_target": "Dashashwamedh Municipal Relief Hub"
    },
    {
        "id": "scenario_ladakh_blizzard_hypoxia",
        "title": "Trans-Himalayan Blizzard & Hypoxia Surge (Leh Ladakh)",
        "title_hi": "लद्दाख बर्फीला तूफान एवं ऑक्सीजन कमी (लेह)",
        "destination_match": "Leh, Pangong Tso & Khardung La",
        "zone_name": "Trans-Himalayan High Altitude",
        "region_type": "HILL_MOUNTAIN",
        "description": "Sudden sub-zero blizzard (-12°C) at 3,500m+ with rapid whiteout. ITBP halts high-pass traffic and activates oxygen resuscitation pods.",
        "weather": {
            "precipitation_mm_hr": 14.0,
            "wind_speed_kmh": 52.0,
            "temperature_c": -12.0,
            "visibility_km": 0.4,
            "imd_alert": "RED"
        },
        "hazard_active": True,
        "expected_risk_category": "CRITICAL",
        "primary_agency": "Indo-Tibetan Border Police (ITBP) & Ladakh Mountain Rescue",
        "evacuation_target": "SNM Hospital Transit Care Centre"
    },
    {
        "id": "scenario_western_ghats_landslip",
        "title": "Western Ghats Torrential Inundation & Debris Flow (Munnar)",
        "title_hi": "पश्चिमी घाट मूसलाधार बारिश एवं भूस्खलन (मुन्नार)",
        "destination_match": "Munnar & Anamudi Highlands",
        "zone_name": "Western Ghats Ecological Belt",
        "region_type": "HILL_MOUNTAIN",
        "description": "Continuous 38mm/hr precipitation triggering steep slope soil saturation. State Highways department shuts landslide-prone gap road.",
        "weather": {
            "precipitation_mm_hr": 38.0,
            "wind_speed_kmh": 40.0,
            "temperature_c": 16.0,
            "visibility_km": 1.0,
            "imd_alert": "RED"
        },
        "hazard_active": True,
        "expected_risk_category": "CRITICAL",
        "primary_agency": "Kerala Fire & Rescue Services / SDRF",
        "evacuation_target": "Munnar Tea Estate Community Hall"
    },
    {
        "id": "scenario_clear_baseline",
        "title": "Clear Morning Weather (Pan-India Normal Baseline)",
        "title_hi": "साफ़ मौसम एवं सामान्य स्थिति (अखिल भारतीय)",
        "destination_match": "All",
        "zone_name": "National Baseline",
        "region_type": "ALL",
        "description": "Ideal meteorological baseline across the Indian subcontinent. Clear skies, normal temperatures, zero active government disaster alerts.",
        "weather": {
            "precipitation_mm_hr": 0.0,
            "wind_speed_kmh": 10.0,
            "temperature_c": 22.0,
            "visibility_km": 10.0,
            "imd_alert": "NONE"
        },
        "hazard_active": False,
        "expected_risk_category": "LOW",
        "primary_agency": "Multi-Agency Emergency Coordination Centre",
        "evacuation_target": "Normal Operating Corridors"
    }
]

# National Early Warning Live Bulletins across India
NATIONAL_DISASTER_BULLETINS = [
    {
        "id": "nb_imd_01",
        "agency": "India Meteorological Department (IMD)",
        "badge_color": "red",
        "severity": "RED",
        "headline": "Special Cyclone & Squall Advisory along Eastern & Western Coastlines",
        "headline_hi": "तटीय क्षेत्रों के लिए विशेष चक्रवात एवं तेज हवा चेतावनी",
        "impact_regions": ["Odisha", "West Bengal", "Goa", "Gujarat", "Andaman"],
        "timestamp": "Live Synced • 12 mins ago"
    },
    {
        "id": "nb_cwc_02",
        "agency": "Central Water Commission (CWC)",
        "badge_color": "amber",
        "severity": "ORANGE",
        "headline": "Upper Brahmaputra & Ganga Basin Hydro-Discharge Flood Watch",
        "headline_hi": "ब्रह्मपुत्र एवं गंगा बेसिन में जलस्तर वृद्धि चेतावनी",
        "impact_regions": ["Assam", "Uttarakhand", "Uttar Pradesh", "Bihar"],
        "timestamp": "Live Synced • 28 mins ago"
    },
    {
        "id": "nb_incois_03",
        "agency": "INCOIS Ocean Information Services",
        "badge_color": "red",
        "severity": "RED",
        "headline": "High Wave Surge (3.2m - 4.5m) and Rip Current Coastal Alert",
        "headline_hi": "समुद्री ऊंची लहरें एवं ज्वारभाटा अलर्ट",
        "impact_regions": ["Puri", "Digha", "Kovalam", "Goa", "Rameswaram"],
        "timestamp": "Live Synced • 41 mins ago"
    },
    {
        "id": "nb_ndrf_04",
        "agency": "National Disaster Response Force (NDRF)",
        "badge_color": "emerald",
        "severity": "INFO",
        "headline": "Pre-positioned 32 Quick Reaction Teams in High-Vulnerability Tourist Belts",
        "headline_hi": "संवेदनशील पर्यटन क्षेत्रों में 32 त्वरित प्रतिक्रिया दल तैनात",
        "impact_regions": ["Pan-India Multi-Region Grid"],
        "timestamp": "Live Synced • 1 hr ago"
    }
]

# Curated Historical Incidents by Known Destinations
CURATED_INCIDENT_HISTORY: Dict[str, List[Dict[str, Any]]] = {
    "kedarnath": [
        {
            "id": "inc_kedar_2013",
            "year_or_date": "Historical Precedent (2013)",
            "title": "Chorabari Lake Outburst & Mandakini Flash Flood",
            "category": "GLACIAL_LAKE_BURST",
            "severity": "CRITICAL",
            "description": "Multi-day 350mm cloudburst triggered Chorabari moraine dam collapse and severe mudflow down the valley.",
            "mitigation_taken": "Constructed 3-tier concrete flood retention barrier, upper ridge bypass trail, and real-time radar siren towers.",
            "reporting_agency": "Geological Survey of India (GSI) & SDRF"
        },
        {
            "id": "inc_kedar_2023",
            "year_or_date": "Recent Incident (2023)",
            "title": "Junglechatti Slope Breach & Landslip",
            "category": "LANDSLIDE",
            "severity": "HIGH",
            "description": "Continuous 48mm/hr downpour triggered localized debris rockfall across the central trekking trail.",
            "mitigation_taken": "Automated geo-sensor tripwire activated, diverting 1,400 pilgrims to Bheembali emergency shelters within 15 minutes.",
            "reporting_agency": "Uttarakhand SDRF & District Administration"
        },
        {
            "id": "inc_kedar_2024",
            "year_or_date": "Season Protocol (2024)",
            "title": "Lincheli Frost & Hypothermia Alert",
            "category": "ALTITUDE_AMS",
            "severity": "MODERATE",
            "description": "Sudden evening temperature drop to -4°C during pilgrim surge causing acute mountain sickness (AMS) cases.",
            "mitigation_taken": "Deployed portable hyperbaric oxygen chambers and enforced 17:30 IST strict curfew at Gaurikund base.",
            "reporting_agency": "Six Sigma High Altitude Medical Service"
        }
    ],
    "puri": [
        {
            "id": "inc_puri_2019",
            "year_or_date": "Extremely Severe Cyclone Fani (2019)",
            "title": "Category 5 Landfall & 4.5m Coastal Storm Surge",
            "category": "CYCLONE_SURGE",
            "severity": "CRITICAL",
            "description": "Wind speeds exceeded 215 km/h with massive storm surge inundating beachfront tourist avenues.",
            "mitigation_taken": "Mass evacuation of 1.2 million citizens to 800+ reinforced Multi-Purpose Cyclone Shelters with zero tourist casualties.",
            "reporting_agency": "IMD / Odisha State Disaster Management Authority (OSDMA)"
        },
        {
            "id": "inc_puri_2023",
            "year_or_date": "Monsoon Swell (2023)",
            "title": "Golden Beach Rip Current & Sandbar Breach",
            "category": "RIP_CURRENT",
            "severity": "HIGH",
            "description": "Spring tide rip current combined with 55km/h squall winds caused dangerous littoral drag.",
            "mitigation_taken": "Lifeguard towers deployed jet-ski rescue and hoisted double red flag beach quarantine.",
            "reporting_agency": "INCOIS & Marine Police Puri"
        }
    ],
    "kaziranga": [
        {
            "id": "inc_kazi_2020",
            "year_or_date": "Major Monsoon Flood (2020)",
            "title": "Brahmaputra High Flood Level (HFL) Breach",
            "category": "RIVER_FLOOD",
            "severity": "CRITICAL",
            "description": "Over 85% of Kaziranga National Park inundated by heavy upstream monsoon run-off from Arunachal hills.",
            "mitigation_taken": "Constructed 33 artificial high-ground highlands (chapories) and imposed speed limit on NH-37 animal corridor.",
            "reporting_agency": "Assam Forest Dept & CWC"
        },
        {
            "id": "inc_kazi_2024",
            "year_or_date": "Corridor Alert (2024)",
            "title": "Panbari Animal Migration Highway Inundation",
            "category": "WILDLIFE_CONFLICT",
            "severity": "HIGH",
            "description": "Elephant herds moving to Karbi Anglong hills across flooded tourist vehicle tracks.",
            "mitigation_taken": "Nighttime safari moratorium activated and automated drone tracking deployed by Forest Rapid Action.",
            "reporting_agency": "NDRF & Assam Wildlife Division"
        }
    ],
    "jaisalmer": [
        {
            "id": "inc_jais_2021",
            "year_or_date": "Record Heatwave (2021)",
            "title": "48.2°C Extreme Temperature & Sandstorm",
            "category": "EXTREME_HEAT",
            "severity": "CRITICAL",
            "description": "Severe heat dome combined with 45km/h blinding dust storms reducing visibility to under 100 meters in Sam dunes.",
            "mitigation_taken": "Mandatory daytime curfew (11:30 - 15:30) for desert safaris and distribution of ORS electrolyte hydration packs.",
            "reporting_agency": "IMD Rajasthan & District Health Society"
        },
        {
            "id": "inc_jais_2023",
            "year_or_date": "Cyclone Biparjoy Remnants (2023)",
            "title": "Unprecedented Desert Flash Rain & Sand Slush",
            "category": "FLASH_FLOOD",
            "severity": "HIGH",
            "description": "Rare cyclonic depression over arid Thar caused sudden desert washouts along dune vehicle trails.",
            "mitigation_taken": "4x4 Emergency recovery vehicles escorted stranded safari tourists to RTDC shelter.",
            "reporting_agency": "Border Tourism Patrol & SDRF"
        }
    ],
    "varanasi": [
        {
            "id": "inc_varanasi_2019",
            "year_or_date": "Ganga Inundation (2019)",
            "title": "Ganga River Crossing Danger Mark (71.26m)",
            "category": "RIVER_FLOOD",
            "severity": "HIGH",
            "description": "River swollen past ghat steps submerging Manikarnika and Dashashwamedh lower pavilions.",
            "mitigation_taken": "Boating operations suspended, aarti relocated to upper rooftop terraces, and NDRF motorboats deployed.",
            "reporting_agency": "Central Water Commission & Varanasi DDMA"
        },
        {
            "id": "inc_varanasi_2022",
            "year_or_date": "Surge Event (2022)",
            "title": "Kashi Corridor Dev Deepawali Crowd Bottleneck",
            "category": "CROWD_SURGE",
            "severity": "HIGH",
            "description": "Over 1.5 million pilgrims converging at riverfront chokepoints in narrow heritage alleys.",
            "mitigation_taken": "Dynamic QR holding zones activated with barricaded one-way queue dispersal into Maidagin road.",
            "reporting_agency": "Varanasi City Police & PAC"
        }
    ],
    "manali": [
        {
            "id": "inc_manali_2023",
            "year_or_date": "Monsoon Deluge (2023)",
            "title": "Beas River Flash Inundation & Highway Washout",
            "category": "FLASH_FLOOD",
            "severity": "CRITICAL",
            "description": "Unprecedented rainfall swollen Beas river destroyed sections of the Kullu-Manali national highway.",
            "mitigation_taken": "SDRF and Indian Air Force air-dropped emergency provisions and established ropeway bypasses.",
            "reporting_agency": "Himachal Disaster Management Authority (HPSDMA)"
        },
        {
            "id": "inc_manali_2024",
            "year_or_date": "Winter Blizzard (2024)",
            "title": "Solang Valley Sudden Snowstorm & Tourist Vehicle Stranding",
            "category": "ALTITUDE_AMS",
            "severity": "HIGH",
            "description": "Heavy sub-zero snowfall blocked 300+ vehicles near Atal Tunnel south portal.",
            "mitigation_taken": "BRO snow-cutters deployed alongside Himachal Police emergency fuel & warming camps.",
            "reporting_agency": "Border Roads Organisation (BRO) & Police"
        }
    ],
    "goa": [
        {
            "id": "inc_goa_2021",
            "year_or_date": "Cyclone Tauktae (2021)",
            "title": "High Wave Damage & Beachfront Power Grid Outage",
            "category": "CYCLONE_SURGE",
            "severity": "HIGH",
            "description": "Gale winds up to 90 km/h uprooted trees and inundated coastal shacks along Candolim-Baga stretch.",
            "mitigation_taken": "Coastal electricity grid isolated and tourist groups relocated inland to municipal community centers.",
            "reporting_agency": "Goa SDMA & Coast Guard"
        },
        {
            "id": "inc_goa_2023",
            "year_or_date": "Monsoon Surge (2023)",
            "title": "Baga Beach Dangerous Swell & High Tide Inrush",
            "category": "RIP_CURRENT",
            "severity": "MODERATE",
            "description": "Monsoon rough sea conditions resulting in red flags along all north Goa beaches.",
            "mitigation_taken": "Strict swimming ban enforced with 24/7 drone shoreline monitoring by Drishti Marine.",
            "reporting_agency": "Drishti Marine & Marine Police"
        }
    ],
    "munnar": [
        {
            "id": "inc_munnar_2018",
            "year_or_date": "Mega Deluge (2018)",
            "title": "Idukki Highland Landslides & Road Severance",
            "category": "LANDSLIDE",
            "severity": "CRITICAL",
            "description": "Historic monsoon downpours triggered over 100 major and minor landslips across Munnar tea hill routes.",
            "mitigation_taken": "Army engineering columns bridged severed tea estate roads and established satellite relay points.",
            "reporting_agency": "Kerala State Disaster Management Authority (KSDMA)"
        },
        {
            "id": "inc_munnar_2024",
            "year_or_date": "Monsoon Alert (2024)",
            "title": "Gap Road Slope Settlement & Rockfall Precaution",
            "category": "LANDSLIDE",
            "severity": "HIGH",
            "description": "Continuous rainfall saturated weathered granite boulders along the Kochi-Dhanushkodi national highway.",
            "mitigation_taken": "Night travel prohibited between 19:00 and 06:00 IST with geo-mesh rockfall barriers deployed.",
            "reporting_agency": "NHAI & District Police Idukki"
        }
    ],
    "badrinath": [
        {
            "id": "inc_badri_2023",
            "year_or_date": "Monsoon Landslide (2023)",
            "title": "Lambagar Active Debris Slide & Highway Blockade",
            "category": "LANDSLIDE",
            "severity": "HIGH",
            "description": "Heavy monsoon rain triggered rockfall at Lambagar slide zone, temporarily halting pilgrim convoys.",
            "mitigation_taken": "BRO heavy earthmovers cleared highway within 3 hours while pilgrims sheltered at GMVN Pandukeshwar.",
            "reporting_agency": "BRO & SDRF Chamoli"
        },
        {
            "id": "inc_badri_2024",
            "year_or_date": "Flash Swell (2024)",
            "title": "Alaknanda River Level Rise & Tapt Kund Precaution",
            "category": "FLASH_FLOOD",
            "severity": "MODERATE",
            "description": "Glacial meltwater and rain increased Alaknanda river velocity near temple bathing ghats.",
            "mitigation_taken": "Police raised warning sirens and restricted ghat access to upper cemented platforms.",
            "reporting_agency": "Badrinath-Kedarnath Temple Committee (BKTC) & SDRF"
        }
    ]
}


def _generate_place_tailored_scenarios(
    dest_data: Dict[str, Any],
    region_type: str,
    elevation_m: int
) -> List[Dict[str, Any]]:
    """
    Synthesizes custom hazard and stress-test simulation scenarios tailored to a specific Indian place.
    """
    name = dest_data.get("canonical_name", "Destination")
    name_hi = dest_data.get("name_hi", name)
    state = dest_data.get("state_ut", "India")
    profile = RegionRuleManager.get_profile(region_type)
    agency = profile.get("emergency_agency", "State Disaster Response Force")

    scenarios = []

    if region_type == "HILL_MOUNTAIN":
        is_high_alt = elevation_m > 2500
        scenarios.append({
            "id": f"sc_{dest_data['id']}_cloudburst",
            "title": f"Extreme Mountain Cloudburst & Active Landslide ({name})",
            "title_hi": f"{name_hi} - बादल फटना एवं भूस्खलन चेतावनी",
            "destination_match": name,
            "zone_name": f"{state} Alpine Sector ({elevation_m}m)",
            "region_type": "HILL_MOUNTAIN",
            "description": f"Intense 45mm/hr torrential downpour across {name}. Saturated hillside debris triggers active rockfall across primary access corridor.",
            "weather": {
                "precipitation_mm_hr": 45.0,
                "wind_speed_kmh": 48.0,
                "temperature_c": 5.0 if is_high_alt else 14.0,
                "visibility_km": 0.6,
                "imd_alert": "RED"
            },
            "hazard_active": True,
            "expected_risk_category": "CRITICAL",
            "primary_agency": agency,
            "evacuation_target": f"{name} Upper Ridge Safe Shelter"
        })
        scenarios.append({
            "id": f"sc_{dest_data['id']}_blizzard_ams",
            "title": f"Sudden Alpine Blizzard & Sub-Zero Hypothermia ({name})",
            "title_hi": f"{name_hi} - बर्फीला तूफान एवं अत्यधिक ठंड",
            "destination_match": name,
            "zone_name": f"{state} High Altitude Ridge",
            "region_type": "HILL_MOUNTAIN",
            "description": f"Rapid temperature plunge to {-5 if is_high_alt else 2}°C with 55km/h freezing winds. Oxygen booths & warming shelters activated.",
            "weather": {
                "precipitation_mm_hr": 16.0,
                "wind_speed_kmh": 55.0,
                "temperature_c": -5.0 if is_high_alt else 2.0,
                "visibility_km": 0.8,
                "imd_alert": "ORANGE"
            },
            "hazard_active": True,
            "expected_risk_category": "HIGH",
            "primary_agency": agency,
            "evacuation_target": "Medical Oxygen Post & Warm Relief Transit"
        })
        scenarios.append({
            "id": f"sc_{dest_data['id']}_crowd_curfew",
            "title": f"Peak Visitor Chokepoint & Route Curfew ({name})",
            "title_hi": f"{name_hi} - भारी भीड़ एवं मार्ग नियंत्रण",
            "destination_match": name,
            "zone_name": f"{state} Corridor Control",
            "region_type": "HILL_MOUNTAIN",
            "description": f"Trail bottleneck detected near {name} entrance. Police enforce {profile.get('curfew_time', '17:30 IST')} strict traversal curfew.",
            "weather": {
                "precipitation_mm_hr": 5.0,
                "wind_speed_kmh": 18.0,
                "temperature_c": 12.0,
                "visibility_km": 5.0,
                "imd_alert": "NONE"
            },
            "hazard_active": True,
            "expected_risk_category": "MODERATE",
            "primary_agency": agency,
            "evacuation_target": "Barricaded Staging & Queue Dispersal Hub"
        })

    elif region_type == "COASTAL_MARINE":
        scenarios.append({
            "id": f"sc_{dest_data['id']}_cyclone_surge",
            "title": f"Severe Marine Cyclone & 4.2m Tidal Surge ({name})",
            "title_hi": f"{name_hi} - भीषण समुद्री चक्रवात एवं ऊंची लहरें",
            "destination_match": name,
            "zone_name": f"{state} Coastal Littoral Zone",
            "region_type": "COASTAL_MARINE",
            "description": f"INCOIS Red Alert tidal surge and 72km/h gale winds. Marine police order immediate beachfront evacuation to reinforced shelters.",
            "weather": {
                "precipitation_mm_hr": 38.0,
                "wind_speed_kmh": 72.0,
                "temperature_c": 26.0,
                "visibility_km": 1.0,
                "imd_alert": "RED"
            },
            "hazard_active": True,
            "expected_risk_category": "CRITICAL",
            "primary_agency": agency,
            "evacuation_target": f"{name} Multi-Purpose Cyclone Shelter"
        })
        scenarios.append({
            "id": f"sc_{dest_data['id']}_rip_tide",
            "title": f"High Swell Rip Current & Beach Inundation ({name})",
            "title_hi": f"{name_hi} - खतरनाक समुद्री लहरें (रिप करंट)",
            "destination_match": name,
            "zone_name": f"{state} Shoreline Sector",
            "region_type": "COASTAL_MARINE",
            "description": f"Dangerous underwater undertows and breaking waves breaching the sandbar. Double red flags hoisted across {name}.",
            "weather": {
                "precipitation_mm_hr": 12.0,
                "wind_speed_kmh": 42.0,
                "temperature_c": 29.0,
                "visibility_km": 4.0,
                "imd_alert": "ORANGE"
            },
            "hazard_active": True,
            "expected_risk_category": "HIGH",
            "primary_agency": agency,
            "evacuation_target": "Coast Guard Safety Observation Deck"
        })

    elif region_type == "FOREST_WILDLIFE":
        scenarios.append({
            "id": f"sc_{dest_data['id']}_river_inundation",
            "title": f"River Basin Overflow & Wildlife Corridor Inundation ({name})",
            "title_hi": f"{name_hi} - नदी जलस्तर वृद्धि एवं वन्यजीव गलियारा जलभराव",
            "destination_match": name,
            "zone_name": f"{state} Protected Forest Reserve",
            "region_type": "FOREST_WILDLIFE",
            "description": f"Monsoon catchment runoff inundates low-lying safari tracks in {name}. Armed forest escorts divert tourist jeeps to elevated ridges.",
            "weather": {
                "precipitation_mm_hr": 32.0,
                "wind_speed_kmh": 26.0,
                "temperature_c": 23.0,
                "visibility_km": 2.0,
                "imd_alert": "ORANGE"
            },
            "hazard_active": True,
            "expected_risk_category": "HIGH",
            "primary_agency": agency,
            "evacuation_target": "Elevated Forest Rest Post & High Chhatri"
        })
        scenarios.append({
            "id": f"sc_{dest_data['id']}_forest_fire",
            "title": f"Forest Fire FSI Alert & Safari Corridor Blockade ({name})",
            "title_hi": f"{name_hi} - वनाग्नि चेतावनी एवं सफारी मार्ग रुकावट",
            "destination_match": name,
            "zone_name": f"{state} Core Sanctuary Area",
            "region_type": "FOREST_WILDLIFE",
            "description": f"Forest Survey of India satellite heat anomaly alert. Core forest sector quarantined to safeguard visitors.",
            "weather": {
                "precipitation_mm_hr": 0.0,
                "wind_speed_kmh": 36.0,
                "temperature_c": 39.0,
                "visibility_km": 2.5,
                "imd_alert": "ORANGE"
            },
            "hazard_active": True,
            "expected_risk_category": "HIGH",
            "primary_agency": agency,
            "evacuation_target": "Main Forest Gate Control Station"
        })

    elif region_type == "DESERT_ARID":
        scenarios.append({
            "id": f"sc_{dest_data['id']}_heatwave_sandstorm",
            "title": f"47°C Severe Heatwave & Blinding Sandstorm ({name})",
            "title_hi": f"{name_hi} - 47°C भीषण लू एवं भयंकर रेतीला तूफ़ान",
            "destination_match": name,
            "zone_name": f"{state} Arid Dune Circuit",
            "region_type": "DESERT_ARID",
            "description": f"IMD Extreme Heatwave Red Alert (47°C) with 46km/h dust storm reducing visibility to 300m. Outdoor dune excursions halted.",
            "weather": {
                "precipitation_mm_hr": 0.0,
                "wind_speed_kmh": 46.0,
                "temperature_c": 47.0,
                "visibility_km": 0.3,
                "imd_alert": "RED"
            },
            "hazard_active": True,
            "expected_risk_category": "CRITICAL",
            "primary_agency": agency,
            "evacuation_target": "RTDC Air-Cooled Dune Disaster Relief Shelter"
        })

    else:  # URBAN_HERITAGE & PLAINS_RIVERINE
        scenarios.append({
            "id": f"sc_{dest_data['id']}_crowd_crush",
            "title": f"Darshan Chokepoint Surge & Stampede Mitigation ({name})",
            "title_hi": f"{name_hi} - भीड़ दबाव एवं भगदड़ नियंत्रण अलर्ट",
            "destination_match": name,
            "zone_name": f"{state} Urban & Heritage Circuit",
            "region_type": "URBAN_HERITAGE",
            "description": f"Massive crowd surge exceeding corridor holding capacity at {name}. Quick Reaction Police deploy barricaded one-way channels.",
            "weather": {
                "precipitation_mm_hr": 6.0,
                "wind_speed_kmh": 15.0,
                "temperature_c": 31.0,
                "visibility_km": 6.0,
                "imd_alert": "NONE"
            },
            "hazard_active": True,
            "expected_risk_category": "CRITICAL",
            "primary_agency": agency,
            "evacuation_target": "Municipal Disaster Holding Pavilion"
        })
        scenarios.append({
            "id": f"sc_{dest_data['id']}_urban_flood",
            "title": f"Riverine Surge & Street Waterlogging ({name})",
            "title_hi": f"{name_hi} - जलभराव एवं नदी जलस्तर चेतावनी",
            "destination_match": name,
            "zone_name": f"{state} Lowland River Corridor",
            "region_type": "URBAN_HERITAGE",
            "description": f"Torrential 30mm/hr monsoon cloudburst causing street waterlogging and transit chokepoints across {name}.",
            "weather": {
                "precipitation_mm_hr": 30.0,
                "wind_speed_kmh": 28.0,
                "temperature_c": 28.0,
                "visibility_km": 2.0,
                "imd_alert": "ORANGE"
            },
            "hazard_active": True,
            "expected_risk_category": "HIGH",
            "primary_agency": agency,
            "evacuation_target": "Elevated Civic Centre & Transit Point"
        })

    # Baseline Clear Weather Scenario for this destination
    scenarios.append({
        "id": f"sc_{dest_data['id']}_clear_normal",
        "title": f"Clear Weather Telemetry Baseline ({name})",
        "title_hi": f"{name_hi} - सामान्य मौसम एवं सुगम मार्ग",
        "destination_match": name,
        "zone_name": f"{state} ({name})",
        "region_type": region_type,
        "description": f"Optimal tourist and pilgrimage conditions at {name}. Zero active hazard warnings. Safe for all scheduled activities.",
        "weather": {
            "precipitation_mm_hr": 0.0,
            "wind_speed_kmh": 10.0,
            "temperature_c": 18.0 if elevation_m > 1500 else 26.0,
            "visibility_km": 10.0,
            "imd_alert": "NONE"
        },
        "hazard_active": False,
        "expected_risk_category": "LOW",
        "primary_agency": agency,
        "evacuation_target": "Standard Scheduled Route"
    })

    return scenarios


def _get_historical_incident_records(dest_data: Dict[str, Any], region_type: str) -> List[Dict[str, Any]]:
    """
    Retrieves curated or dynamically compiled historical incident records for a destination.
    """
    q_key = dest_data.get("id", "").replace("dest_", "").lower()
    name = dest_data.get("canonical_name", "Destination")
    state = dest_data.get("state_ut", "India")
    profile = RegionRuleManager.get_profile(region_type)
    agency = profile.get("emergency_agency", "Local Administration")

    for key, records in CURATED_INCIDENT_HISTORY.items():
        if key in q_key or key in name.lower():
            return records

    # Extract historical incidents from destination's own hazard zones and pilgrimage metadata if present
    records = []
    hz_list = dest_data.get("hazard_zones", [])
    for idx, hz in enumerate(hz_list[:2]):
        records.append({
            "id": f"inc_dyn_{idx}_{dest_data.get('id', 'item')}",
            "year_or_date": "Regional Hazard Baseline",
            "title": f"{hz.get('category', 'ENVIRONMENTAL').replace('_', ' ').title()} Vulnerability Belt ({name})",
            "category": hz.get("category", "ENVIRONMENTAL"),
            "severity": hz.get("severity", "HIGH"),
            "description": hz.get("historical_incident", f"Monitored hazard zone in {name}, {state}."),
            "mitigation_taken": f"Monitored by {agency} with safe bypass corridors and automated siren alerts.",
            "reporting_agency": agency
        })

    # Pilgrimage metadata crowd crush historical incident
    pilgrim_meta = dest_data.get("pilgrimage_metadata")
    if pilgrim_meta and pilgrim_meta.get("historical_crowd_crush_incidents"):
        records.append({
            "id": f"inc_dyn_crowd_{dest_data.get('id', 'item')}",
            "year_or_date": "Peak Season Crowd History",
            "title": f"Visitor Density & Access Corridor Chokepoints ({name})",
            "category": "CROWD_SURGE",
            "severity": pilgrim_meta.get("crowd_crush_risk_level", "HIGH"),
            "description": pilgrim_meta["historical_crowd_crush_incidents"],
            "mitigation_taken": "Biometric holding gates and staggered batch release channels.",
            "reporting_agency": f"{agency} & District Police"
        })

    if not records:
        primary_haz = profile.get("primary_hazards", ["WEATHER_SQUALL"])[0]
        records.append({
            "id": f"inc_dyn_std_{dest_data.get('id', 'item')}",
            "year_or_date": "National Safety Atlas Record",
            "title": f"{primary_haz.replace('_', ' ').title()} Safety Benchmark ({name})",
            "category": primary_haz,
            "severity": "MODERATE",
            "description": f"Standard {region_type.replace('_', ' ').lower()} incident mitigation protocols active for {name}, {state}.",
            "mitigation_taken": f"Rapid response team coverage via {agency}.",
            "reporting_agency": agency
        })

    return records


@router.get("/scenarios")
async def get_simulation_scenarios(
    destination: Optional[str] = Query(default=None, description="Optional destination name to filter incidents and scenarios for a specific place")
):
    """
    Returns disaster scenarios, incident records, and evacuation benchmarks.
    - When `destination` is provided: returns location-tailored scenarios, historical incident records,
      active hazard zones, emergency shelters, and local emergency helplines for that specific place.
    - When `destination` is omitted or empty: returns major Pan-India live disaster bench updates across India,
      multi-region scenarios, and national multi-agency disaster bulletins.
    """
    dest_str = (destination or "").strip()

    if dest_str and dest_str.lower() not in ["", "all", "all india", "pan-india", "pan india", "national", "none"]:
        try:
            dest_data = await DestinationResolver.resolve(dest_str)
            region_type = dest_data.get("region_type", "HILL_MOUNTAIN")
            elevation_m = dest_data.get("elevation_m", 2500)
            profile = RegionRuleManager.get_profile(region_type)

            tailored_scenarios = _generate_place_tailored_scenarios(dest_data, region_type, elevation_m)
            incident_history = _get_historical_incident_records(dest_data, region_type)

            return {
                "is_pan_india": False,
                "destination": dest_data["canonical_name"],
                "destination_id": dest_data.get("id"),
                "state_ut": dest_data.get("state_ut", "India"),
                "region_type": region_type,
                "region_name": profile.get("name", region_type),
                "elevation_m": elevation_m,
                "emergency_agency": profile.get("emergency_agency", "State Disaster Response Force"),
                "emergency_helplines": [
                    {"label": "National Emergency SOS", "number": "112"},
                    {"label": "State Disaster Control Room", "number": "1070"},
                    {"label": "District Disaster Helpline", "number": "1077"},
                    {"label": "Ambulance & High Altitude Medical", "number": "108"}
                ],
                "scenarios": tailored_scenarios,
                "incident_history": incident_history,
                "active_hazard_zones": dest_data.get("hazard_zones", []),
                "shelters": dest_data.get("shelters", []),
                "national_disaster_bulletins": NATIONAL_DISASTER_BULLETINS
            }
        except Exception as e:
            print(f"[Simulation Router] Destination resolution notice for '{dest_str}': {e}")

    # Default Pan-India View (No place selected)
    return {
        "is_pan_india": True,
        "destination": "All India (National Grid)",
        "state_ut": "28 States & 8 Union Territories",
        "region_type": "PAN_INDIA",
        "region_name": "Pan-India Multi-Region Hazard Grid",
        "scenarios": PAN_INDIA_SIMULATION_SCENARIOS,
        "national_disaster_bulletins": NATIONAL_DISASTER_BULLETINS,
        "pan_india_zones_summary": {
            "total_active_scenarios": len(PAN_INDIA_SIMULATION_SCENARIOS),
            "critical_alerts": sum(1 for s in PAN_INDIA_SIMULATION_SCENARIOS if s["expected_risk_category"] == "CRITICAL"),
            "high_alerts": sum(1 for s in PAN_INDIA_SIMULATION_SCENARIOS if s["expected_risk_category"] == "HIGH"),
            "monitoring_agencies": [
                "India Meteorological Department (IMD)",
                "National Disaster Response Force (NDRF)",
                "Central Water Commission (CWC)",
                "Indian National Centre for Ocean Information Services (INCOIS)",
                "State Disaster Response Forces (SDRF)"
            ]
        }
    }
