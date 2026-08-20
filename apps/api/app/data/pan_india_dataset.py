"""
Pan-India Geographic, Hazard, and Emergency Dataset.
Covers diverse destinations across all canonical region types:
- HILL_MOUNTAIN (e.g. Kedarnath, Badrinath, Yamunotri, Gangotri, Palitana, Bhimashankar, Trimbakeshwar, Mallikarjuna, Manali)
- COASTAL_MARINE (e.g. Puri, Dwarka, Rameswaram, Somnath, Nageshwar, Goa)
- PLAINS_RIVERINE (e.g. Mahakaleshwar, Omkareshwar, Baidyanath, Ajmer Sharif, Shirdi, Grishneshwar)
- URBAN_HERITAGE (e.g. Kashi Vishwanath, Akshardham, Varanasi)
- FOREST_WILDLIFE (e.g. Kaziranga)
- DESERT_ARID (e.g. Jaisalmer)
"""

# Region Type Definitions with Risk Weights & Safety Directives
REGION_PROFILES = {
    "HILL_MOUNTAIN": {
        "id": "HILL_MOUNTAIN",
        "name": "Himalayan & Hill Mountain",
        "name_hi": "पर्वतीय एवं उच्च हिमालयी क्षेत्र",
        "primary_hazards": ["LANDSLIDE", "ALTITUDE_AMS", "CLOUD_BURST", "FLASH_FLOOD", "HYPOTHERMIA"],
        "curfew_time": "17:30 IST",
        "emergency_agency": "SDRF / Mountain Rescue Brigade",
        "weights": {
            "terrain_landslide": 0.30,
            "weather_squall": 0.25,
            "altitude_hypoxia": 0.20,
            "medical_isolation": 0.15,
            "crowd_slowdown": 0.10
        },
        "advisories": [
            "Mandatory acclimatization halt above 2,800m altitude.",
            "Trekking past 17:30 IST is prohibited by State Police due to freezing temperatures.",
            "Carry 1 portable oxygen canister and waterproof alpine gear."
        ]
    },
    "COASTAL_MARINE": {
        "id": "COASTAL_MARINE",
        "name": "Coastal & Marine Sector",
        "name_hi": "तटीय एवं समुद्री क्षेत्र",
        "primary_hazards": ["CYCLONE_SURGE", "HIGH_TIDE", "RIP_CURRENT", "HEAVY_RAIN", "UV_HEAT"],
        "curfew_time": "19:00 IST",
        "emergency_agency": "Indian Coast Guard & Marine Police",
        "weights": {
            "marine_cyclone_tide": 0.35,
            "weather_precipitation": 0.25,
            "rip_current_beach": 0.15,
            "heat_uv_stress": 0.15,
            "crowd_density": 0.10
        },
        "advisories": [
            "Check INCOIS high wave / tidal surge bulletin before entering sea.",
            "Swimming prohibited near red-flagged rip-current sandbars.",
            "Observe Coast Guard cyclone early warning flags."
        ]
    },
    "PLAINS_RIVERINE": {
        "id": "PLAINS_RIVERINE",
        "name": "Plains & Riverine Corridor",
        "name_hi": "मैदानी एवं नदी घाटी क्षेत्र",
        "primary_hazards": ["CROWD_SURGE", "RIVER_FLOOD", "HEATWAVE", "BOTTLENECK_STAMPEDE"],
        "curfew_time": "21:30 IST",
        "emergency_agency": "District Disaster Management Authority (DDMA) & NDRF",
        "weights": {
            "crowd_stampede_chokepoint": 0.35,
            "riverine_flood": 0.25,
            "heat_stress": 0.20,
            "emergency_transit_time": 0.20
        },
        "advisories": [
            "Utilize barricaded one-way queue channels during religious festival surges.",
            "Maintain hydration during extreme summer heatwaves (40°C+).",
            "Avoid ghat riverfront steps during active monsoon discharge alerts."
        ]
    },
    "FOREST_WILDLIFE": {
        "id": "FOREST_WILDLIFE",
        "name": "Forest & Wildlife Sanctuary",
        "name_hi": "वन्यजीव अभयारण्य एवं राष्ट्रीय उद्यान",
        "primary_hazards": ["WILDLIFE_CONFLICT", "FOREST_FIRE", "MONSOON_RIVER_FLOOD", "ISOLATION"],
        "curfew_time": "17:00 IST",
        "emergency_agency": "Forest Protection Force & Rapid Response Team",
        "weights": {
            "wildlife_corridor": 0.30,
            "forest_fire_fsi": 0.25,
            "weather_flash_flood": 0.20,
            "remote_isolation": 0.20,
            "permit_bottleneck": 0.05
        },
        "advisories": [
            "Strict entry curfew after 17:00 IST. Alighting from safari vehicle is illegal.",
            "Avoid designated elephant / tiger migratory corridors.",
            "Forest fire alert (FSI) must be verified before entering remote core sectors."
        ]
    },
    "DESERT_ARID": {
        "id": "DESERT_ARID",
        "name": "Desert & Arid Dune Circuit",
        "name_hi": "मरुस्थलीय एवं शुष्क क्षेत्र",
        "primary_hazards": ["EXTREME_HEAT", "DEHYDRATION", "DUST_STORM", "SAND_IMMOBILIZATION"],
        "curfew_time": "20:00 IST",
        "emergency_agency": "Border Tourism Patrol & Local Administration",
        "weights": {
            "heat_dehydration": 0.40,
            "dust_sandstorm": 0.25,
            "oasis_water_isolation": 0.25,
            "sand_mobility": 0.10
        },
        "advisories": [
            "Avoid outdoor dune traversal between 11:30 AM and 03:30 PM due to extreme UV & heat stress.",
            "Maintain a minimum of 4 litres of electrolyte-enriched water per person per day.",
            "Seek shelter immediately upon visual detection of IMD dust storm fronts."
        ]
    },
    "URBAN_HERITAGE": {
        "id": "URBAN_HERITAGE",
        "name": "Urban Pilgrimage & Heritage City",
        "name_hi": "शहरी तीर्थस्थल एवं ऐतिहासिक धरोहर",
        "primary_hazards": ["CROWD_SURGE", "URBAN_WATERLOGGING", "TRAFFIC_GRIDLOCK", "AIR_QUALITY"],
        "curfew_time": "22:00 IST",
        "emergency_agency": "City Traffic & Quick Reaction Police Command",
        "weights": {
            "crowd_stampede_chokepoint": 0.40,
            "urban_waterlogging": 0.25,
            "emergency_transit_time": 0.20,
            "air_quality_aqi": 0.15
        },
        "advisories": [
            "Avoid narrow river ghats and temple chokepoints during peak aarti / festival surge.",
            "Use pre-booked biometric darshan queues to avoid stampede bottlenecks.",
            "Follow designated municipal one-way pedestrian corridors."
        ]
    }
}

# Pre-seeded Diverse National Destinations (Including Comprehensive Pilgrimage Catalog)
PAN_INDIA_DESTINATIONS = [
    # -------------------------------------------------------------------------
    # 1. Char Dham & Chota Char Dham: Badrinath
    # -------------------------------------------------------------------------
    {
        "id": "dest_badrinath",
        "canonical_name": "Badrinath Dham",
        "name_hi": "श्री बद्रीनाथ धाम",
        "state_ut": "Uttarakhand",
        "region_type": "HILL_MOUNTAIN",
        "category": "pilgrimage",
        "lat": 30.7447,
        "lon": 79.4912,
        "elevation_m": 3133,
        "description": "High-altitude cardinal and Himalayan Char Dham shrine dedicated to Lord Vishnu, along the Alaknanda river surrounded by Nar-Narayan peaks.",
        "trail_coords": [
            [79.4850, 30.7380, 3050], # Joshimath-Badrinath Highway Entrance
            [79.4880, 30.7410, 3100], # Tapt Kund Hot Springs
            [79.4912, 30.7447, 3133], # Badrinath Mandir Plaza
            [79.4960, 30.7490, 3180], # Mana First Indian Village
            [79.5020, 30.7550, 3250]  # Saraswati River Confluence (Bhim Pul)
        ],
        "bypass_coords": [
            [79.4850, 30.7380, 3050],
            [79.4900, 30.7430, 3120],
            [79.4960, 30.7490, 3180]
        ],
        "checkpoints": [
            {"id": "cp_b1", "name": "Badrinath Bus Stand & Biometric Check", "name_hi": "बद्रीनाथ बस स्टैंड", "lat": 30.7380, "lon": 79.4850, "altitude_m": 3050, "facilities": ["Biometric Verification", "Tourist Rest House", "Police Post"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.3, "nearest_sdrf_dist_km": 0.2},
            {"id": "cp_b2", "name": "Tapt Kund Thermal Springs", "name_hi": "तप्त कुंड", "lat": 30.7410, "lon": 79.4880, "altitude_m": 3100, "facilities": ["Bathing Ghat", "First Aid", "SDRF Helpdesk"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.2, "nearest_sdrf_dist_km": 0.1},
            {"id": "cp_b3", "name": "Shri Badrinath Mandir Plaza", "name_hi": "श्री बद्रीनाथ मंदिर", "lat": 30.7447, "lon": 79.4912, "altitude_m": 3133, "facilities": ["Temple Holding Hall", "Disaster Relief Post", "Emergency Oxygen"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.4, "nearest_sdrf_dist_km": 0.1},
            {"id": "cp_b4", "name": "Mana Village & Bhim Pul", "name_hi": "माणा गांव", "lat": 30.7550, "lon": 79.5020, "altitude_m": 3250, "facilities": ["ITBP Border Post", "Primary Health Desk"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 3.0, "nearest_sdrf_dist_km": 1.5}
        ],
        "hazard_zones": [
            {
                "id": "hz_badrinath_landslide",
                "name": "Alaknanda Gorge & Lambagar Active Slide Belt (GSI)",
                "category": "LANDSLIDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.82,
                "polygon_coordinates": [[79.4800, 30.7300], [79.5050, 30.7300], [79.5050, 30.7500], [79.4800, 30.7500], [79.4800, 30.7300]],
                "historical_incident": "Monsoon debris slide and rockfall blocking highway access to Badrinath"
            }
        ],
        "shelters": [
            {"id": "sh_badrinath_gmvn", "name": "GMVN Devlok Badrinath Shelter", "lat": 30.7400, "lon": 79.4870, "capacity_persons": 1500, "has_backup_power": True, "contact_phone": "+91-1389-222212"},
            {"id": "sh_badrinath_army", "name": "Army Transit Camp Shelter", "lat": 30.7450, "lon": 79.4930, "capacity_persons": 1000, "has_backup_power": True, "contact_phone": "1077"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Char Dham", "Chota Char Dham"],
            "peak_seasons": [
                {"name": "May Opening & June Summer Surge", "crowd_multiplier": 1.7},
                {"name": "Autumn Sept-Oct Closing Surge", "crowd_multiplier": 1.5}
            ],
            "crowd_crush_risk_level": "HIGH",
            "historical_crowd_crush_incidents": "Heavy vehicle bottlenecks and queue chokepoints along Alaknanda causeway during monsoon rain events.",
            "mobility_tier": "MODERATE_INCLINE",
            "physical_exertion_note": "Road accessible with high altitude (3,133m) hypoxia, AMS, and freezing evening temperatures.",
            "nearest_medical_infra": {
                "hospital_name": "Badrinath Combined Health Centre",
                "distance_km": 0.4,
                "has_oxygen_bank": True,
                "emergency_helipad": "Badrinath Army Helipad"
            },
            "security_screening_level": "BIOMETRIC_HOLDING",
            "connectivity_status": "INTERMITTENT_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 2. Char Dham: Dwarka (Dwarkadhish)
    # -------------------------------------------------------------------------
    {
        "id": "dest_dwarka",
        "canonical_name": "Dwarkadhish Temple Dwarka",
        "name_hi": "श्री द्वारकाधीश मंदिर",
        "state_ut": "Gujarat",
        "region_type": "COASTAL_MARINE",
        "category": "pilgrimage",
        "lat": 22.2442,
        "lon": 68.9685,
        "elevation_m": 10,
        "description": "Ancient western cardinal Char Dham temple situated at the confluence of Gomti River and Arabian Sea.",
        "trail_coords": [
            [68.9620, 22.2380, 5],   # Dwarka Beach Promenade
            [68.9650, 22.2410, 8],   # Gomti Ghat Sangam
            [68.9685, 22.2442, 10],  # Dwarkadhish Mandir Plaza
            [68.9740, 22.2490, 12],  # Rukmini Devi Temple Road
            [68.9810, 22.2550, 15]   # Shivrajpur Blue Flag Beach Highway
        ],
        "bypass_coords": [
            [68.9620, 22.2380, 5],
            [68.9700, 22.2460, 12],
            [68.9740, 22.2490, 12]
        ],
        "checkpoints": [
            {"id": "cp_dw1", "name": "Gomti Ghat Sangam Point", "name_hi": "गोमती घाट संगम", "lat": 22.2410, "lon": 68.9650, "altitude_m": 8, "facilities": ["Lifeguard Watch", "Bathing Ghat", "First Aid"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 0.8, "nearest_sdrf_dist_km": 0.5},
            {"id": "cp_dw2", "name": "Dwarkadhish Main Shikhar Plaza", "name_hi": "द्वारकाधीश मंदिर शिखर", "lat": 22.2442, "lon": 68.9685, "altitude_m": 10, "facilities": ["Temple Police Control", "Crowd Holding Plazas", "Dispensary"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 1.2, "nearest_sdrf_dist_km": 0.6},
            {"id": "cp_dw3", "name": "Rukmini Devi Mandir Transit", "name_hi": "रुक्मिणी देवी मंदिर", "lat": 22.2490, "lon": 68.9740, "altitude_m": 12, "facilities": ["Tourist Info", "Hydration Kiosk"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 2.0, "nearest_sdrf_dist_km": 1.0}
        ],
        "hazard_zones": [
            {
                "id": "hz_dwarka_cyclone",
                "name": "Dwarka Arabian Sea Cyclone Surge & High Tide Belt (INCOIS)",
                "category": "CYCLONE_SURGE",
                "severity": "HIGH",
                "base_hazard_weight": 0.78,
                "polygon_coordinates": [[68.9550, 22.2300], [68.9750, 22.2300], [68.9750, 22.2500], [68.9550, 22.2500], [68.9550, 22.2300]],
                "historical_incident": "Severe cyclonic gale winds (Biparjoy 2023) and high tidal wave surge along coastal promenade"
            }
        ],
        "shelters": [
            {"id": "sh_dwarka_cyclone", "name": "Dwarka Multi-Purpose Cyclone Shelter", "lat": 22.2430, "lon": 68.9700, "capacity_persons": 2000, "has_backup_power": True, "contact_phone": "+91-2892-234244"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Char Dham"],
            "peak_seasons": [
                {"name": "Janmashtami Festival", "crowd_multiplier": 2.2},
                {"name": "Diwali & Gujarati New Year", "crowd_multiplier": 1.6}
            ],
            "crowd_crush_risk_level": "HIGH",
            "historical_crowd_crush_incidents": "Gomti Ghat and entry gate bottlenecks during Janmashtami midnight aarti.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Flat coastal terrain with stone stairs to Gomti Ghat; high humidity and heat exhaustion risk in summer.",
            "nearest_medical_infra": {
                "hospital_name": "Dwarka Sub-District Civil Hospital",
                "distance_km": 1.2,
                "has_oxygen_bank": True,
                "emergency_helipad": "Dwarka Helipad"
            },
            "security_screening_level": "ELEVATED",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 3. Char Dham: Puri (Jagannath Dham)
    # -------------------------------------------------------------------------
    {
        "id": "dest_puri",
        "canonical_name": "Puri Shri Jagannath Dham",
        "name_hi": "श्री जगन्नाथ मंदिर पुरी",
        "state_ut": "Odisha",
        "region_type": "COASTAL_MARINE",
        "category": "pilgrimage",
        "lat": 19.8135,
        "lon": 85.8312,
        "elevation_m": 10,
        "description": "Eastern cardinal Char Dham shrine on the Bay of Bengal coastline, famed for the grand annual Ratha Yatra festival.",
        "trail_coords": [
            [85.8180, 19.8050, 6],   # Swargadwar Beach
            [85.8240, 19.8100, 8],   # Golden Beach Promenade
            [85.8312, 19.8135, 10],  # Jagannath Temple Square
            [85.8450, 19.8180, 12],  # Gundicha Temple
            [85.8750, 19.8250, 5],   # Balighai Beach
            [86.0945, 19.8876, 8]    # Konark Sun Temple Marine Drive
        ],
        "bypass_coords": [
            [85.8240, 19.8100, 8],
            [85.8350, 19.8250, 14],  # Elevated inland bypass during high tide
            [85.8450, 19.8180, 12]
        ],
        "checkpoints": [
            {"id": "cp_p1", "name": "Swargadwar Marine Watch", "name_hi": "स्वर्गद्वार तटीय चौकी", "lat": 19.8050, "lon": 85.8180, "altitude_m": 6, "facilities": ["Lifeguard Tower", "Coast Guard Beacon", "First Aid Center"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 0.8, "nearest_sdrf_dist_km": 1.0},
            {"id": "cp_p2", "name": "Golden Beach Blue Flag Hub", "name_hi": "गोल्डन बीच", "lat": 19.8100, "lon": 85.8240, "altitude_m": 8, "facilities": ["Tourist Police Post", "Emergency Siren", "Ambulance Stand"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 0.5, "nearest_sdrf_dist_km": 0.6},
            {"id": "cp_p3", "name": "Shri Jagannath Temple Plaza", "name_hi": "श्री जगन्नाथ मंदिर", "lat": 19.8135, "lon": 85.8312, "altitude_m": 10, "facilities": ["Temple Police Control", "Crowd Holding Plazas", "Medical Dispensary"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.3, "nearest_sdrf_dist_km": 0.4},
            {"id": "cp_p4", "name": "Gundicha Temple Transit", "name_hi": "गुंडीचा मंदिर", "lat": 19.8180, "lon": 85.8450, "altitude_m": 12, "facilities": ["Drinking Water Hub", "OTDC Tourist Rest"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 1.0, "nearest_sdrf_dist_km": 1.2}
        ],
        "hazard_zones": [
            {
                "id": "hz_p_tidal_surge",
                "name": "Puri South Shore High Tidal Surge Zone (INCOIS)",
                "category": "COASTAL_SURGE",
                "severity": "HIGH",
                "base_hazard_weight": 0.80,
                "polygon_coordinates": [[85.8100, 19.8000], [85.8300, 19.8000], [85.8300, 19.8120], [85.8100, 19.8120], [85.8100, 19.8000]],
                "historical_incident": "Sea ingress and severe rip currents during monsoon high tide (>3.5m wave height)"
            }
        ],
        "shelters": [
            {"id": "sh_p_cyclone_1", "name": "Puri Multi-Purpose Cyclone Shelter", "lat": 19.8120, "lon": 85.8280, "capacity_persons": 3000, "has_backup_power": True, "contact_phone": "1077"},
            {"id": "sh_p_district_hq", "name": "District Disaster Control & Hospital", "lat": 19.8190, "lon": 85.8350, "capacity_persons": 2500, "has_backup_power": True, "contact_phone": "+91-6752-223321"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Char Dham"],
            "peak_seasons": [
                {"name": "Ratha Yatra (Ashadha Shukla)", "crowd_multiplier": 3.0},
                {"name": "Snana Yatra", "crowd_multiplier": 2.0}
            ],
            "crowd_crush_risk_level": "SEVERE",
            "historical_crowd_crush_incidents": "Over 1.5 million pilgrims gather on Grand Road (Bada Danda); historic surge stampedes during chariot pulling.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Flat coastal terrain; intense summer heat (38°C+) and extreme humidity during Ratha Yatra.",
            "nearest_medical_infra": {
                "hospital_name": "Puri District Headquarters Hospital",
                "distance_km": 0.8,
                "has_oxygen_bank": True,
                "emergency_helipad": "Talabania Helipad"
            },
            "security_screening_level": "BIOMETRIC_HOLDING",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 4. Char Dham & 12 Jyotirlingas: Rameswaram
    # -------------------------------------------------------------------------
    {
        "id": "dest_rameswaram",
        "canonical_name": "Ramanathaswamy Temple Rameswaram",
        "name_hi": "श्री रामनाथस्वामी मंदिर रामेश्वरम",
        "state_ut": "Tamil Nadu",
        "region_type": "COASTAL_MARINE",
        "category": "pilgrimage",
        "lat": 9.2881,
        "lon": 79.3174,
        "elevation_m": 10,
        "description": "Southern cardinal Char Dham and Jyotirlinga island temple on Pamban Island, connected via Pamban sea bridge.",
        "trail_coords": [
            [79.2850, 9.2780, 5],   # Pamban Bridge Approach
            [79.3050, 9.2830, 8],   # Agni Theertham Beach
            [79.3174, 9.2881, 10],  # Ramanathaswamy Temple Corridor
            [79.3500, 9.2950, 6],   # Kothandaramaswamy Temple
            [79.4180, 9.1770, 4]    # Dhanushkodi Ghost Town & Sangam
        ],
        "bypass_coords": [
            [79.2850, 9.2780, 5],
            [79.3100, 9.2900, 10],
            [79.3500, 9.2950, 6]
        ],
        "checkpoints": [
            {"id": "cp_rm1", "name": "Pamban Sea Bridge Checkpost", "name_hi": "पाम्बन ब्रिज चेकपोस्ट", "lat": 9.2780, "lon": 79.2850, "altitude_m": 5, "facilities": ["Police Control", "Weather Anemometer Post"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 4.0, "nearest_sdrf_dist_km": 2.0},
            {"id": "cp_rm2", "name": "Agni Theertham Holy Sea Bathing", "name_hi": "अग्नि तीर्थम", "lat": 9.2830, "lon": 79.3050, "altitude_m": 8, "facilities": ["Lifeguard Watch", "First Aid Kiosk", "Coast Guard Patrol"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 1.0, "nearest_sdrf_dist_km": 0.5},
            {"id": "cp_rm3", "name": "Ramanathaswamy Temple 22-Wells Corridor", "name_hi": "श्री रामनाथस्वामी मंदिर", "lat": 9.2881, "lon": 79.3174, "altitude_m": 10, "facilities": ["Holding Plazas", "Medical Room", "Dispensary"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 1.0, "nearest_sdrf_dist_km": 0.8},
            {"id": "cp_rm4", "name": "Dhanushkodi Ocean Confluence Point", "name_hi": "धनुषकोडी संगम", "lat": 9.1770, "lon": 79.4180, "altitude_m": 4, "facilities": ["Coast Guard Post", "Emergency Wireless Tower"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 18.0, "nearest_sdrf_dist_km": 12.0}
        ],
        "hazard_zones": [
            {
                "id": "hz_rameshwaram_cyclone",
                "name": "Pamban Island Cyclone Surge & High Wind Zone (INCOIS)",
                "category": "CYCLONE_SURGE",
                "severity": "HIGH",
                "base_hazard_weight": 0.80,
                "polygon_coordinates": [[79.2800, 9.2600], [79.3500, 9.2600], [79.3500, 9.3200], [79.2800, 9.3200], [79.2800, 9.2600]],
                "historical_incident": "Severe cyclonic storms (1964 Dhanushkodi, 2018 Gaja) causing sea ingress and temporary Pamban bridge rail suspension"
            }
        ],
        "shelters": [
            {"id": "sh_rameshwaram_shelter", "name": "Mandapam Disaster Relief & Cyclone Shelter", "lat": 9.2820, "lon": 79.3000, "capacity_persons": 2500, "has_backup_power": True, "contact_phone": "+91-4573-221223"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Char Dham", "12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Mahashivratri", "crowd_multiplier": 2.1},
                {"name": "Thai Amavasai / Aadi Amavasai", "crowd_multiplier": 2.4}
            ],
            "crowd_crush_risk_level": "HIGH",
            "historical_crowd_crush_incidents": "Agni Theertham sea bathing chokepoints and narrow 22-wells holy theertham corridors.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Island terrain vulnerable to cyclone isolation if Pamban bridge is closed due to gale winds (>58km/h).",
            "nearest_medical_infra": {
                "hospital_name": "Rameswaram Government Hospital",
                "distance_km": 1.0,
                "has_oxygen_bank": True,
                "emergency_helipad": "Mandapam Coast Guard Base"
            },
            "security_screening_level": "ELEVATED",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 5. Chota Char Dham: Yamunotri
    # -------------------------------------------------------------------------
    {
        "id": "dest_yamunotri",
        "canonical_name": "Yamunotri Dham",
        "name_hi": "श्री यमुनोत्री धाम",
        "state_ut": "Uttarakhand",
        "region_type": "HILL_MOUNTAIN",
        "category": "pilgrimage",
        "lat": 31.0140,
        "lon": 78.4600,
        "elevation_m": 3293,
        "description": "Origin of the sacred Yamuna River in the Garhwal Himalayas, reached via a steep 6km mountain trek from Janki Chatti.",
        "trail_coords": [
            [78.4350, 30.9850, 2650], # Janki Chatti Base
            [78.4420, 30.9950, 2850], # Phool Chatti
            [78.4500, 31.0050, 3100], # Bhairon Ghati Halt
            [78.4600, 31.0140, 3293]  # Yamunotri Temple & Surya Kund
        ],
        "bypass_coords": [
            [78.4350, 30.9850, 2650],
            [78.4480, 31.0000, 2980],
            [78.4600, 31.0140, 3293]
        ],
        "checkpoints": [
            {"id": "cp_y1", "name": "Janki Chatti Base Camp", "name_hi": "जानकी चट्टी", "lat": 30.9850, "lon": 78.4350, "altitude_m": 2650, "facilities": ["Pony Stand", "Biometric Slip", "Civil Hospital"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.2, "nearest_sdrf_dist_km": 0.1},
            {"id": "cp_y2", "name": "Bhairon Ghati Midpoint", "name_hi": "भैरों घाटी", "lat": 31.0050, "lon": 78.4500, "altitude_m": 3100, "facilities": ["SDRF First Aid", "Emergency Oxygen", "Water Kiosk"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 3.0, "nearest_sdrf_dist_km": 0.5},
            {"id": "cp_y3", "name": "Yamunotri Mandir & Surya Kund", "name_hi": "श्री यमुनोत्री मंदिर", "lat": 31.0140, "lon": 78.4600, "altitude_m": 3293, "facilities": ["Thermal Kund", "Disaster Relief Hut", "Medical Tent"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 6.0, "nearest_sdrf_dist_km": 0.2}
        ],
        "hazard_zones": [
            {
                "id": "hz_yamunotri_landslide",
                "name": "Janki Chatti - Yamunotri Cliffside Landslide & Rockfall Zone (GSI)",
                "category": "LANDSLIDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.85,
                "polygon_coordinates": [[78.4300, 30.9800], [78.4700, 30.9800], [78.4700, 31.0200], [78.4300, 31.0200], [78.4300, 30.9800]],
                "historical_incident": "Rockfalls on narrow pony trail during sudden Himalayan squalls"
            }
        ],
        "shelters": [
            {"id": "sh_yamunotri_gmvn", "name": "GMVN Janki Chatti Permanent Shelter", "lat": 30.9860, "lon": 78.4360, "capacity_persons": 1000, "has_backup_power": True, "contact_phone": "+91-1375-233324"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Chota Char Dham"],
            "peak_seasons": [
                {"name": "May Opening & June Peak", "crowd_multiplier": 2.0},
                {"name": "September Yatra Peak", "crowd_multiplier": 1.6}
            ],
            "crowd_crush_risk_level": "HIGH",
            "historical_crowd_crush_incidents": "Narrow cliffside trekking paths between Janki Chatti and Yamunotri experience mule/pedestrian bottlenecks.",
            "mobility_tier": "HIGH_ALTITUDE_TREK",
            "physical_exertion_note": "Steep 6km vertical trek with 1,000m elevation gain; high cardiovascular and AMS risk for elderly pilgrims.",
            "nearest_medical_infra": {
                "hospital_name": "Janki Chatti Primary Health Centre",
                "distance_km": 6.0,
                "has_oxygen_bank": True,
                "emergency_helipad": "Kharsali Helipad"
            },
            "security_screening_level": "STANDARD",
            "connectivity_status": "WEAK_2G_INTERMITTENT"
        }
    },

    # -------------------------------------------------------------------------
    # 6. Chota Char Dham: Gangotri
    # -------------------------------------------------------------------------
    {
        "id": "dest_gangotri",
        "canonical_name": "Gangotri Dham",
        "name_hi": "श्री गंगोत्री धाम",
        "state_ut": "Uttarakhand",
        "region_type": "HILL_MOUNTAIN",
        "category": "pilgrimage",
        "lat": 30.9947,
        "lon": 78.9398,
        "elevation_m": 3100,
        "description": "Source of the holy Bhagirathi/Ganga river in Uttarkashi district, nestled in Greater Himalayas pine forests.",
        "trail_coords": [
            [78.9250, 30.9850, 3020], # Harshil-Gangotri Road Entrance
            [78.9320, 30.9900, 3060], # Surya Kund Waterfalls
            [78.9398, 30.9947, 3100], # Gangotri Mandir Complex
            [78.9550, 31.0050, 3250]  # Gaumukh Trek Origin Checkpoint
        ],
        "bypass_coords": [
            [78.9250, 30.9850, 3020],
            [78.9350, 30.9920, 3080],
            [78.9398, 30.9947, 3100]
        ],
        "checkpoints": [
            {"id": "cp_g1", "name": "Gangotri Bus Terminal & Forest Desk", "name_hi": "गंगोत्री बस टर्मिनल", "lat": 30.9850, "lon": 78.9250, "altitude_m": 3020, "facilities": ["Permit Counter", "Police Station", "First Aid"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.4, "nearest_sdrf_dist_km": 0.2},
            {"id": "cp_g2", "name": "Gangotri Mandir Plaza", "name_hi": "श्री गंगोत्री मंदिर", "lat": 30.9947, "lon": 78.9398, "altitude_m": 3100, "facilities": ["Holding Plazas", "Medical Tent", "SDRF Relief Post"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.5, "nearest_sdrf_dist_km": 0.1}
        ],
        "hazard_zones": [
            {
                "id": "hz_gangotri_flood",
                "name": "Bhagirathi Gorge Cloudburst & River Flash Flood Zone (CWC)",
                "category": "RIVER_FLOOD",
                "severity": "HIGH",
                "base_hazard_weight": 0.80,
                "polygon_coordinates": [[78.9200, 30.9800], [78.9500, 30.9800], [78.9500, 31.0100], [78.9200, 31.0100], [78.9200, 30.9800]],
                "historical_incident": "Monsoon cloudburst and Bhagirathi river swelling"
            }
        ],
        "shelters": [
            {"id": "sh_gangotri_gmvn", "name": "GMVN Gangotri Yatri Nivas", "lat": 30.9900, "lon": 78.9350, "capacity_persons": 1200, "has_backup_power": True, "contact_phone": "+91-1377-222229"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Chota Char Dham"],
            "peak_seasons": [
                {"name": "Akshaya Tritiya Opening & May-June", "crowd_multiplier": 1.9},
                {"name": "Navratri in Autumn", "crowd_multiplier": 1.4}
            ],
            "crowd_crush_risk_level": "MODERATE",
            "historical_crowd_crush_incidents": "Road access along Bhagirathi gorge vulnerable to landslide blockades at Sukhitop and Harshil.",
            "mobility_tier": "MODERATE_INCLINE",
            "physical_exertion_note": "High altitude (3,100m) with cold alpine temperatures; Gaumukh trek origin requires advanced permits.",
            "nearest_medical_infra": {
                "hospital_name": "Gangotri Medical Relief Post / Harshil Army Hospital",
                "distance_km": 0.5,
                "has_oxygen_bank": True,
                "emergency_helipad": "Harshil Helipad"
            },
            "security_screening_level": "STANDARD",
            "connectivity_status": "INTERMITTENT_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 7. Chota Char Dham & 12 Jyotirlingas: Kedarnath
    # -------------------------------------------------------------------------
    {
        "id": "dest_kedarnath",
        "canonical_name": "Kedarnath Dham",
        "name_hi": "श्री केदारनाथ धाम",
        "state_ut": "Uttarakhand",
        "region_type": "HILL_MOUNTAIN",
        "category": "pilgrimage",
        "lat": 30.7352,
        "lon": 79.0669,
        "elevation_m": 3583,
        "description": "High-altitude Himalayan pilgrimage shrine subject to steep slopes, landslides, and sudden weather squalls.",
        "trail_coords": [
            [79.0669, 30.5526, 1829], # Sonprayag
            [79.0678, 30.5925, 1982], # Gaurikund
            [79.0688, 30.6150, 2370], # Jungle Chatti
            [79.0712, 30.6380, 2730], # Bheembali
            [79.0748, 30.6810, 3300], # Lincholi
            [79.0690, 30.7230, 3550], # Base Camp
            [79.0669, 30.7352, 3583]  # Kedarnath Temple
        ],
        "bypass_coords": [
            [79.0688, 30.6150, 2370],
            [79.0645, 30.6240, 2580],
            [79.0660, 30.6330, 2690],
            [79.0712, 30.6380, 2730]
        ],
        "checkpoints": [
            {"id": "cp_k1", "name": "Sonprayag Base", "name_hi": "सोनप्रयाग", "lat": 30.5526, "lon": 79.0669, "altitude_m": 1829, "facilities": ["Biometric Slip", "Taxi Stand", "Hospital"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.2, "nearest_sdrf_dist_km": 0.2},
            {"id": "cp_k2", "name": "Gaurikund Trek Origin", "name_hi": "गौरीकुंड", "lat": 30.5925, "lon": 79.0678, "altitude_m": 1982, "facilities": ["GMVN Rest House", "SDRF Post", "Pony Stand"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.3, "nearest_sdrf_dist_km": 0.1},
            {"id": "cp_k3", "name": "Jungle Chatti", "name_hi": "जंगल चट्टी", "lat": 30.6150, "lon": 79.0688, "altitude_m": 2370, "facilities": ["Emergency Shelter", "Water Point"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 3.0, "nearest_sdrf_dist_km": 1.5},
            {"id": "cp_k4", "name": "Bheembali Camp", "name_hi": "भीमबली", "lat": 30.6380, "lon": 79.0712, "altitude_m": 2730, "facilities": ["SDRF Base", "Hyperbaric Oxygen Tent", "GMVN Huts"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.1, "nearest_sdrf_dist_km": 0.05},
            {"id": "cp_k5", "name": "Lincholi Halt", "name_hi": "लिनचोली", "lat": 30.6810, "lon": 79.0748, "altitude_m": 3300, "facilities": ["24x7 Oxygen Parlour", "NDRF Bunker", "Helipad"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.2, "nearest_sdrf_dist_km": 0.2},
            {"id": "cp_k6", "name": "Kedarnath Mandir", "name_hi": "केदारनाथ मंदिर", "lat": 30.7352, "lon": 79.0669, "altitude_m": 3583, "facilities": ["Shrine Complex", "Disaster Plaza", "Army Medical"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.2, "nearest_sdrf_dist_km": 0.1}
        ],
        "hazard_zones": [
            {
                "id": "hz_k_rambara",
                "name": "Rambara Active Debris Slide (GSI)",
                "category": "LANDSLIDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.85,
                "polygon_coordinates": [[79.0680, 30.6200], [79.0725, 30.6200], [79.0730, 30.6320], [79.0675, 30.6320], [79.0680, 30.6200]],
                "historical_incident": "Flash flood & debris washout in heavy monsoon rains"
            }
        ],
        "shelters": [
            {"id": "sh_k_bheembali", "name": "Bheembali SDRF Pre-Fab Shelter", "lat": 30.6385, "lon": 79.0718, "capacity_persons": 1200, "has_backup_power": True, "contact_phone": "1070"},
            {"id": "sh_k_lincholi", "name": "Lincholi High Altitude Bunker", "lat": 30.6815, "lon": 79.0752, "capacity_persons": 1000, "has_backup_power": True, "contact_phone": "1077"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Chota Char Dham", "12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "May-June Opening Surge", "crowd_multiplier": 2.5},
                {"name": "Shravan Month & Mahashivratri", "crowd_multiplier": 2.0}
            ],
            "crowd_crush_risk_level": "SEVERE",
            "historical_crowd_crush_incidents": "Severe crowd surges at temple plaza and Lincholi-Bheembali trail bottlenecks; 2013 flood & subsequent flash rain debris alerts.",
            "mobility_tier": "HIGH_ALTITUDE_TREK",
            "physical_exertion_note": "Strenuous 16km mountain trail with 1,800m ascent; extreme hypoxia and rapid hypothermia risk past 17:30 IST.",
            "nearest_medical_infra": {
                "hospital_name": "Kedarnath Disaster Hospital & SDRF Medical Camp",
                "distance_km": 0.2,
                "has_oxygen_bank": True,
                "emergency_helipad": "Kedarnath Base Helipad"
            },
            "security_screening_level": "BIOMETRIC_HOLDING",
            "connectivity_status": "INTERMITTENT_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 8. 12 Jyotirlingas: Somnath
    # -------------------------------------------------------------------------
    {
        "id": "dest_somnath",
        "canonical_name": "Somnath Jyotirlinga Temple",
        "name_hi": "श्री सोमनाथ ज्योतिर्लिंग मंदिर",
        "state_ut": "Gujarat",
        "region_type": "COASTAL_MARINE",
        "category": "pilgrimage",
        "lat": 20.8880,
        "lon": 70.4012,
        "elevation_m": 8,
        "description": "First among the 12 Jyotirlingas, situated on the pristine Arabian Sea coastline in Prabhas Patan, Veraval.",
        "trail_coords": [
            [70.3950, 20.8820, 5],
            [70.4012, 20.8880, 8],
            [70.4080, 20.8930, 10]
        ],
        "bypass_coords": [
            [70.3950, 20.8820, 5],
            [70.4040, 20.8900, 10],
            [70.4080, 20.8930, 10]
        ],
        "checkpoints": [
            {"id": "cp_sn1", "name": "Somnath Promenade Beach Watch", "name_hi": "सोमनाथ तट चौकी", "lat": 20.8850, "lon": 70.3980, "altitude_m": 5, "facilities": ["Tourist Police", "First Aid"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 4.5, "nearest_sdrf_dist_km": 1.0},
            {"id": "cp_sn2", "name": "Shri Somnath Mandir Plaza", "name_hi": "श्री सोमनाथ मंदिर", "lat": 20.8880, "lon": 70.4012, "altitude_m": 8, "facilities": ["Security Holding", "Dispensary", "Ambulance Post"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 5.0, "nearest_sdrf_dist_km": 0.8}
        ],
        "hazard_zones": [
            {
                "id": "hz_somnath_surge",
                "name": "Prabhas Patan Coastal Wave Surge Belt (INCOIS)",
                "category": "CYCLONE_SURGE",
                "severity": "HIGH",
                "base_hazard_weight": 0.76,
                "polygon_coordinates": [[70.3900, 20.8800], [70.4150, 20.8800], [70.4150, 20.9000], [70.3900, 20.9000], [70.3900, 20.8800]],
                "historical_incident": "Monsoon high tidal sea ingress along the promenade wall"
            }
        ],
        "shelters": [
            {"id": "sh_somnath_trust", "name": "Shri Somnath Trust Disaster Relief Hall", "lat": 20.8890, "lon": 70.4030, "capacity_persons": 2000, "has_backup_power": True, "contact_phone": "+91-2876-231200"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Mahashivratri", "crowd_multiplier": 2.6},
                {"name": "Shravan Month (Mondays)", "crowd_multiplier": 2.2},
                {"name": "Kartik Purnima Fair", "crowd_multiplier": 2.0}
            ],
            "crowd_crush_risk_level": "HIGH",
            "historical_crowd_crush_incidents": "Heavy evening aarti and laser-show promenade crowd density near the sea-wall promenade.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Flat coastal walkways with wheelchair ramps; coastal cyclone and high tide wave surge monitoring active.",
            "nearest_medical_infra": {
                "hospital_name": "Veraval Civil Hospital",
                "distance_km": 5.0,
                "has_oxygen_bank": True,
                "emergency_helipad": "Somnath Helipad"
            },
            "security_screening_level": "ELEVATED",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 9. 12 Jyotirlingas: Mallikarjuna (Srisailam)
    # -------------------------------------------------------------------------
    {
        "id": "dest_mallikarjuna",
        "canonical_name": "Mallikarjuna Jyotirlinga Srisailam",
        "name_hi": "श्री मल्लिकार्जुन ज्योतिर्लिंग श्रीशैलम",
        "state_ut": "Andhra Pradesh",
        "region_type": "HILL_MOUNTAIN",
        "category": "pilgrimage",
        "lat": 16.0745,
        "lon": 78.8687,
        "elevation_m": 476,
        "description": "Sacred hilltop Jyotirlinga and Shakti Peetha located in the dense Nallamala forest hills along the Krishna river.",
        "trail_coords": [
            [78.8550, 16.0650, 420],
            [78.8687, 16.0745, 476],
            [78.8780, 16.0820, 310]  # Pathalaganga Krishna River
        ],
        "bypass_coords": [
            [78.8550, 16.0650, 420],
            [78.8650, 16.0700, 460],
            [78.8687, 16.0745, 476]
        ],
        "checkpoints": [
            {"id": "cp_ml1", "name": "Srisailam Hill Entry Ghat Post", "name_hi": "श्रीशैलम घाट चेकपोस्ट", "lat": 16.0650, "lon": 78.8550, "altitude_m": 420, "facilities": ["Police Post", "Forest Desk"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 2.0, "nearest_sdrf_dist_km": 1.0},
            {"id": "cp_ml2", "name": "Mallikarjuna Swamy Temple Complex", "name_hi": "श्री मल्लिकार्जुन स्वामी मंदिर", "lat": 16.0745, "lon": 78.8687, "altitude_m": 476, "facilities": ["Queue Complexes", "Medical Dispensary", "Devasthanam Hospital"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.8, "nearest_sdrf_dist_km": 0.5}
        ],
        "hazard_zones": [
            {
                "id": "hz_srisailam_ghat",
                "name": "Nallamala Ghat Road Landslide & Wild Animal Corridor (AP Forest)",
                "category": "LANDSLIDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.72,
                "polygon_coordinates": [[78.8400, 16.0500], [78.8900, 16.0500], [78.8900, 16.0900], [78.8400, 16.0900], [78.8400, 16.0500]],
                "historical_incident": "Monsoon rockfall along ghat curves and summer forest heat"
            }
        ],
        "shelters": [
            {"id": "sh_srisailam_choultry", "name": "Srisailam Devasthanam Mega Shelter", "lat": 16.0760, "lon": 78.8700, "capacity_persons": 3000, "has_backup_power": True, "contact_phone": "+91-8524-288888"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Mahashivratri Brahmotsavam", "crowd_multiplier": 2.7},
                {"name": "Karthika Masam", "crowd_multiplier": 2.1}
            ],
            "crowd_crush_risk_level": "HIGH",
            "historical_crowd_crush_incidents": "Nallamala forest ghat road traffic bottlenecks and Pathalaganga ropeway queue surges.",
            "mobility_tier": "MODERATE_INCLINE",
            "physical_exertion_note": "Ghat road curves, steep stone steps down to Pathalaganga river; summer heat can exceed 42°C.",
            "nearest_medical_infra": {
                "hospital_name": "Srisailam Devasthanam Area Hospital",
                "distance_km": 0.8,
                "has_oxygen_bank": True,
                "emergency_helipad": "Sunnipenta Helipad"
            },
            "security_screening_level": "ELEVATED",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 10. 12 Jyotirlingas: Mahakaleshwar (Ujjain)
    # -------------------------------------------------------------------------
    {
        "id": "dest_mahakaleshwar",
        "canonical_name": "Mahakaleshwar Jyotirlinga Ujjain",
        "name_hi": "श्री महाकालेश्वर ज्योतिर्लिंग उज्जैन",
        "state_ut": "Madhya Pradesh",
        "region_type": "PLAINS_RIVERINE",
        "category": "pilgrimage",
        "lat": 23.1827,
        "lon": 75.7682,
        "elevation_m": 494,
        "description": "Renowned south-facing Dakshinmukhi Jyotirlinga on the banks of Shipra River, famous for the daily Bhasma Aarti and Simhastha Kumbh.",
        "trail_coords": [
            [75.7580, 23.1750, 485], # Ram Ghat Shipra River
            [75.7630, 23.1790, 490], # Mahakal Lok Corridor Entrance
            [75.7682, 23.1827, 494], # Mahakaleshwar Mandir
            [75.7750, 23.1880, 498]  # Harsiddhi Temple Square
        ],
        "bypass_coords": [
            [75.7580, 23.1750, 485],
            [75.7650, 23.1840, 495],
            [75.7750, 23.1880, 498]
        ],
        "checkpoints": [
            {"id": "cp_mk1", "name": "Ram Ghat Shipra Holy Bathing", "name_hi": "राम घाट क्षिप्रा", "lat": 23.1750, "lon": 75.7580, "altitude_m": 485, "facilities": ["SDRF Boat Patrol", "First Aid", "Police Post"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 1.2, "nearest_sdrf_dist_km": 0.2},
            {"id": "cp_mk2", "name": "Mahakal Lok Grand Corridor", "name_hi": "श्री महाकाल लोक", "lat": 23.1790, "lon": 75.7630, "altitude_m": 490, "facilities": ["Automated Queue System", "E-Cart Shuttle", "Water Kiosk"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 1.0, "nearest_sdrf_dist_km": 0.3},
            {"id": "cp_mk3", "name": "Mahakaleshwar Sanctum & Bhasma Aarti Holding", "name_hi": "महाकालेश्वर गर्भगृह", "lat": 23.1827, "lon": 75.7682, "altitude_m": 494, "facilities": ["Biometric Holding Halls", "Medical Trauma Room", "Civil Hospital Desk"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 1.5, "nearest_sdrf_dist_km": 0.2}
        ],
        "hazard_zones": [
            {
                "id": "hz_mahakal_crowd",
                "name": "Mahakal Lok & Bhasma Aarti High-Density Surge Corridor (DDMA)",
                "category": "CROWD_STAMPEDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.78,
                "polygon_coordinates": [[75.7600, 23.1750], [75.7750, 23.1750], [75.7750, 23.1900], [75.7600, 23.1900], [75.7600, 23.1750]],
                "historical_incident": "Massive festival crowd surges during Shravan Sawari and Nag Panchami"
            }
        ],
        "shelters": [
            {"id": "sh_mahakal_yatri", "name": "Mahakal Yatri Niwas Relief Campus", "lat": 23.1810, "lon": 75.7700, "capacity_persons": 3500, "has_backup_power": True, "contact_phone": "+91-734-2550563"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Mahashivratri & Shravan Sawari", "crowd_multiplier": 3.0},
                {"name": "Simhastha Kumbh Mela", "crowd_multiplier": 4.5},
                {"name": "Nagchandreshwar (Nag Panchami)", "crowd_multiplier": 2.8}
            ],
            "crowd_crush_risk_level": "SEVERE",
            "historical_crowd_crush_incidents": "Massive crowd accumulation in Mahakal Lok corridor and Bhasma Aarti holding halls; historical rush during Nag Panchami.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Extensive 1.5km covered corridor walking; extreme summer temperatures (up to 45°C) in Malwa plains.",
            "nearest_medical_infra": {
                "hospital_name": "Ujjain District Civil Hospital / Madhav Nagar Hospital",
                "distance_km": 1.5,
                "has_oxygen_bank": True,
                "emergency_helipad": "Ujjain Police Line Helipad"
            },
            "security_screening_level": "BIOMETRIC_HOLDING",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 11. 12 Jyotirlingas: Omkareshwar
    # -------------------------------------------------------------------------
    {
        "id": "dest_omkareshwar",
        "canonical_name": "Omkareshwar Jyotirlinga",
        "name_hi": "श्री ओंकारेश्वर ज्योतिर्लिंग",
        "state_ut": "Madhya Pradesh",
        "region_type": "PLAINS_RIVERINE",
        "category": "pilgrimage",
        "lat": 22.2464,
        "lon": 76.1517,
        "elevation_m": 185,
        "description": "Sacred Om-shaped Mandhata river island in the Narmada River housing the Jyotirlinga and Mamleshwar shrine.",
        "trail_coords": [
            [76.1420, 22.2410, 175],
            [76.1480, 22.2440, 180],
            [76.1517, 22.2464, 185],
            [76.1580, 22.2510, 190]
        ],
        "bypass_coords": [
            [76.1420, 22.2410, 175],
            [76.1500, 22.2480, 188],
            [76.1580, 22.2510, 190]
        ],
        "checkpoints": [
            {"id": "cp_om1", "name": "Narmada Jhula Suspension Bridge", "name_hi": "नर्मदा झूला पुल", "lat": 22.2440, "lon": 76.1480, "altitude_m": 180, "facilities": ["Bridge Police", "First Aid"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 1.2, "nearest_sdrf_dist_km": 0.4},
            {"id": "cp_om2", "name": "Omkareshwar Mandhata Temple", "name_hi": "श्री ओंकारेश्वर मंदिर", "lat": 22.2464, "lon": 76.1517, "altitude_m": 185, "facilities": ["Queue Corridor", "Medical Post", "Boat Rescue Unit"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 1.0, "nearest_sdrf_dist_km": 0.3}
        ],
        "hazard_zones": [
            {
                "id": "hz_omkareshwar_dam",
                "name": "Narmada River Dam Release & Suspension Bridge Surge Zone (CWC)",
                "category": "RIVER_FLOOD",
                "severity": "HIGH",
                "base_hazard_weight": 0.75,
                "polygon_coordinates": [[76.1400, 22.2400], [76.1600, 22.2400], [76.1600, 22.2550], [76.1400, 22.2550], [76.1400, 22.2400]],
                "historical_incident": "Rapid river swelling upon Omkareshwar Dam gate opening during monsoon peak"
            }
        ],
        "shelters": [
            {"id": "sh_omkar_ashram", "name": "Gajanan Maharaj Ashram Relief Shelter", "lat": 22.2450, "lon": 76.1500, "capacity_persons": 1800, "has_backup_power": True, "contact_phone": "+91-7280-271224"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Shravan Month (Mondays)", "crowd_multiplier": 2.4},
                {"name": "Mahashivratri", "crowd_multiplier": 2.6}
            ],
            "crowd_crush_risk_level": "HIGH",
            "historical_crowd_crush_incidents": "Narmada suspension bridge and Mamleshwar bridge bottlenecks; riverboat boarding points during monsoon water release from Omkareshwar Dam.",
            "mobility_tier": "MODERATE_INCLINE",
            "physical_exertion_note": "Island parikrama involves steep stone steps; river currents require caution during dam floodgate discharge.",
            "nearest_medical_infra": {
                "hospital_name": "Omkareshwar Government Hospital",
                "distance_km": 1.0,
                "has_oxygen_bank": True,
                "emergency_helipad": "Omkareshwar Helipad"
            },
            "security_screening_level": "ELEVATED",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 12. 12 Jyotirlingas: Bhimashankar
    # -------------------------------------------------------------------------
    {
        "id": "dest_bhimashankar",
        "canonical_name": "Bhimashankar Jyotirlinga",
        "name_hi": "श्री भीमाशंकर ज्योतिर्लिंग",
        "state_ut": "Maharashtra",
        "region_type": "HILL_MOUNTAIN",
        "category": "pilgrimage",
        "lat": 19.0722,
        "lon": 73.5354,
        "elevation_m": 1005,
        "description": "Jyotirlinga shrine situated in the Sahyadri Western Ghats ranges at the source of Bhima River, enveloped by wildlife sanctuary.",
        "trail_coords": [
            [73.5250, 19.0650, 950],
            [73.5354, 19.0722, 1005],
            [73.5450, 19.0800, 1040]
        ],
        "bypass_coords": [
            [73.5250, 19.0650, 950],
            [73.5320, 19.0750, 990],
            [73.5450, 19.0800, 1040]
        ],
        "checkpoints": [
            {"id": "cp_bm1", "name": "Bhimashankar Forest Bus Stand", "name_hi": "भीमाशंकर बस स्टैंड", "lat": 19.0680, "lon": 73.5280, "altitude_m": 960, "facilities": ["Forest Post", "Police Chowki"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 10.0, "nearest_sdrf_dist_km": 2.0},
            {"id": "cp_bm2", "name": "Bhimashankar Mandir Deep Valley", "name_hi": "भीमाशंकर मंदिर", "lat": 19.0722, "lon": 73.5354, "altitude_m": 1005, "facilities": ["Holding Hall", "First Aid", "SDRF Emergency Unit"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 12.0, "nearest_sdrf_dist_km": 0.5}
        ],
        "hazard_zones": [
            {
                "id": "hz_bhimashankar_ghat",
                "name": "Sahyadri Western Ghats Torrential Monsoon & Landslide Belt",
                "category": "LANDSLIDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.78,
                "polygon_coordinates": [[73.5200, 19.0600], [73.5500, 19.0600], [73.5500, 19.0900], [73.5200, 19.0900], [73.5200, 19.0600]],
                "historical_incident": "Dense fog with <30m visibility, rockfalls on narrow ghat curves, and slippery stone staircases"
            }
        ],
        "shelters": [
            {"id": "sh_bhimashankar_mtde", "name": "MTDC Bhimashankar Tourist Rest House", "lat": 19.0700, "lon": 73.5300, "capacity_persons": 800, "has_backup_power": True, "contact_phone": "+91-2135-234234"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Mahashivratri", "crowd_multiplier": 2.5},
                {"name": "Shravan Month (Monsoon)", "crowd_multiplier": 2.3}
            ],
            "crowd_crush_risk_level": "HIGH",
            "historical_crowd_crush_incidents": "Steep descent steps to temple become dangerously slick in torrential Sahyadri rains; ghat road landslides.",
            "mobility_tier": "MODERATE_INCLINE",
            "physical_exertion_note": "250+ stone steps down into valley; heavy fog, low visibility (<50m), and monsoon hypothermia risk.",
            "nearest_medical_infra": {
                "hospital_name": "Bhimashankar Rural Hospital / Ghodegaon PHC",
                "distance_km": 12.0,
                "has_oxygen_bank": False,
                "emergency_helipad": "Khandas Helipad"
            },
            "security_screening_level": "STANDARD",
            "connectivity_status": "WEAK_2G_INTERMITTENT"
        }
    },

    # -------------------------------------------------------------------------
    # 13. 12 Jyotirlingas: Kashi Vishwanath (Varanasi)
    # -------------------------------------------------------------------------
    {
        "id": "dest_kashi_vishwanath",
        "canonical_name": "Kashi Vishwanath Temple Varanasi",
        "name_hi": "श्री काशी विश्वनाथ मंदिर वाराणसी",
        "state_ut": "Uttar Pradesh",
        "region_type": "URBAN_HERITAGE",
        "category": "pilgrimage",
        "lat": 25.3109,
        "lon": 83.0107,
        "elevation_m": 80,
        "description": "Pinnacle of Shaivite pilgrimage on the western bank of the sacred Ganga River, featuring the Vishwanath Corridor.",
        "trail_coords": [
            [83.0020, 25.3050, 75],  # Godowlia Crossing
            [83.0070, 25.3080, 78],  # Dashashwamedh Ghat
            [83.0107, 25.3109, 80],  # Kashi Vishwanath Mandir Plaza
            [83.0140, 25.3130, 82],  # Manikarnika Ghat
            [83.0180, 25.3180, 85]   # Lalita Ghat Ganga View
        ],
        "bypass_coords": [
            [83.0020, 25.3050, 75],
            [83.0090, 25.3150, 80],
            [83.0180, 25.3180, 85]
        ],
        "checkpoints": [
            {"id": "cp_kv1", "name": "Godowlia Chowk Pedestrian Corridor", "name_hi": "गोदौलिया चौक", "lat": 25.3050, "lon": 83.0020, "altitude_m": 75, "facilities": ["Traffic Police Hub", "First Aid Booth"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 2.0, "nearest_sdrf_dist_km": 0.8},
            {"id": "cp_kv2", "name": "Dashashwamedh Ganga Aarti Ghat", "name_hi": "दशाश्वमेध घाट", "lat": 25.3080, "lon": 83.0070, "altitude_m": 78, "facilities": ["NDRF Boat Command", "River Patrol Tower", "Medical Camp"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 1.5, "nearest_sdrf_dist_km": 0.2},
            {"id": "cp_kv3", "name": "Vishwanath Corridor Gateway", "name_hi": "काशी विश्वनाथ कॉरिडोर", "lat": 25.3109, "lon": 83.0107, "altitude_m": 80, "facilities": ["Biometric Darshan Queues", "Holding Halls", "Hospital Dispensary"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 2.5, "nearest_sdrf_dist_km": 0.3}
        ],
        "hazard_zones": [
            {
                "id": "hz_varanasi_crowd",
                "name": "Godowlia-Dashashwamedh High Density Corridor & Ghat Inundation (DDMA)",
                "category": "CROWD_STAMPEDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.80,
                "polygon_coordinates": [[83.0000, 25.3000], [83.0200, 25.3000], [83.0200, 25.3200], [83.0000, 25.3200], [83.0000, 25.3000]],
                "historical_incident": "Massive Kanwariya footfalls in Shravan month and monsoon high flood water levels submerging lower steps"
            }
        ],
        "shelters": [
            {"id": "sh_varanasi_corridor", "name": "Kashi Vishwanath Corridor Mumukshu Bhawan", "lat": 25.3115, "lon": 83.0120, "capacity_persons": 3000, "has_backup_power": True, "contact_phone": "+91-542-2392629"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Shravan Month Kanwar Yatra", "crowd_multiplier": 3.2},
                {"name": "Mahashivratri", "crowd_multiplier": 2.8},
                {"name": "Dev Deepawali", "crowd_multiplier": 2.5}
            ],
            "crowd_crush_risk_level": "SEVERE",
            "historical_crowd_crush_incidents": "Heavy congestion in historic alleyways, Godowlia-Dashashwamedh corridor, and Ganga river ghat steps during aarti.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Flat corridor with extensive pedestrian movement; extreme humid heat during monsoon and intense crowd density.",
            "nearest_medical_infra": {
                "hospital_name": "Banaras Hindu University (BHU) Sir Sunderlal Hospital / Kabir Chaura Hospital",
                "distance_km": 2.5,
                "has_oxygen_bank": True,
                "emergency_helipad": "BHU Helipad"
            },
            "security_screening_level": "BIOMETRIC_HOLDING",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 14. 12 Jyotirlingas: Trimbakeshwar
    # -------------------------------------------------------------------------
    {
        "id": "dest_trimbakeshwar",
        "canonical_name": "Trimbakeshwar Jyotirlinga",
        "name_hi": "श्री त्र्यंबकेश्वर ज्योतिर्लिंग",
        "state_ut": "Maharashtra",
        "region_type": "HILL_MOUNTAIN",
        "category": "pilgrimage",
        "lat": 19.9322,
        "lon": 73.5308,
        "elevation_m": 720,
        "description": "Ancient Jyotirlinga at the foothills of Brahmagiri mountain, the source of the Godavari River in Nashik district.",
        "trail_coords": [
            [73.5220, 19.9250, 700],
            [73.5308, 19.9322, 720],
            [73.5380, 19.9400, 850]  # Brahmagiri Trek
        ],
        "bypass_coords": [
            [73.5220, 19.9250, 700],
            [73.5280, 19.9350, 715],
            [73.5380, 19.9400, 850]
        ],
        "checkpoints": [
            {"id": "cp_tr1", "name": "Kushavarta Holy Kund", "name_hi": "कुशावर्त तीर्थ", "lat": 19.9300, "lon": 73.5280, "altitude_m": 710, "facilities": ["Bathing Ghat", "First Aid"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 0.5, "nearest_sdrf_dist_km": 0.3},
            {"id": "cp_tr2", "name": "Trimbakeshwar Mandir Core", "name_hi": "त्र्यंबकेश्वर मंदिर", "lat": 19.9322, "lon": 73.5308, "altitude_m": 720, "facilities": ["Holding Plazas", "Medical Center", "Police Control"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.6, "nearest_sdrf_dist_km": 0.2}
        ],
        "hazard_zones": [
            {
                "id": "hz_trimbak_surge",
                "name": "Kushavarta Kund & Brahmagiri Runoff Surge Belt",
                "category": "CROWD_STAMPEDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.76,
                "polygon_coordinates": [[73.5200, 19.9200], [73.5450, 19.9200], [73.5450, 19.9450], [73.5200, 19.9450], [73.5200, 19.9200]],
                "historical_incident": "Heavy Kumbh Mela crowd surges and monsoon waterlogging"
            }
        ],
        "shelters": [
            {"id": "sh_trimbak_bhawan", "name": "Trimbakeshwar Sansthan Bhakta Niwas", "lat": 19.9330, "lon": 73.5320, "capacity_persons": 2000, "has_backup_power": True, "contact_phone": "+91-2594-233215"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Nashik-Trimbakeshwar Kumbh Mela", "crowd_multiplier": 4.0},
                {"name": "Shravan Somwar", "crowd_multiplier": 2.4}
            ],
            "crowd_crush_risk_level": "SEVERE",
            "historical_crowd_crush_incidents": "Kushavarta Kund holy bathing tank and inner sanctum queue bottlenecks; intense Kumbh Mela surge history.",
            "mobility_tier": "MODERATE_INCLINE",
            "physical_exertion_note": "Paved town terrain with optional steep climb to Brahmagiri Hill peak (750 steps); heavy monsoon runoff.",
            "nearest_medical_infra": {
                "hospital_name": "Trimbakeshwar Sub-District Hospital",
                "distance_km": 0.6,
                "has_oxygen_bank": True,
                "emergency_helipad": "Trimbak Police Ground"
            },
            "security_screening_level": "BIOMETRIC_HOLDING",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 15. 12 Jyotirlingas: Vaidyanath (Baidyanath Dham, Deoghar)
    # -------------------------------------------------------------------------
    {
        "id": "dest_vaidyanath",
        "canonical_name": "Baidyanath Jyotirlinga Deoghar",
        "name_hi": "श्री बैद्यनाथ ज्योतिर्लिंग देवघर",
        "state_ut": "Jharkhand",
        "region_type": "PLAINS_RIVERINE",
        "category": "pilgrimage",
        "lat": 24.4925,
        "lon": 86.7000,
        "elevation_m": 254,
        "description": "Major Jyotirlinga and Shakti Peetha complex, destination of the massive 105km Sultanganj-Deoghar Shravani Mela Kanwar Yatra.",
        "trail_coords": [
            [86.6850, 24.4820, 245],
            [86.6950, 24.4880, 250],
            [86.7000, 24.4925, 254],
            [86.7080, 24.4980, 260]
        ],
        "bypass_coords": [
            [86.6850, 24.4820, 245],
            [86.6920, 24.4940, 252],
            [86.7080, 24.4980, 260]
        ],
        "checkpoints": [
            {"id": "cp_vd1", "name": "Baidyanath Kanwariya Queue Complex", "name_hi": "कांवरिया कतार परिसर", "lat": 24.4880, "lon": 86.6950, "altitude_m": 250, "facilities": ["Barricaded Queue Line", "Drinking Water", "NDRF Camp"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 1.5, "nearest_sdrf_dist_km": 0.3},
            {"id": "cp_vd2", "name": "Baba Baidyanath Mandir Plaza", "name_hi": "बाबा बैद्यनाथ मंदिर", "lat": 24.4925, "lon": 86.7000, "altitude_m": 254, "facilities": ["Holding Plazas", "Medical Center", "Sadar Hospital Post"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 2.0, "nearest_sdrf_dist_km": 0.2}
        ],
        "hazard_zones": [
            {
                "id": "hz_vaidyanath_kanwar",
                "name": "Deoghar Shravani Mela Kanwar Route Surge Zone (NDMA)",
                "category": "CROWD_STAMPEDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.82,
                "polygon_coordinates": [[86.6800, 24.4800], [86.7150, 24.4800], [86.7150, 24.5050], [86.6800, 24.5050], [86.6800, 24.4800]],
                "historical_incident": "5+ million Kanwariyas in Shravan; historic surge risk near Belabagan queue gates"
            }
        ],
        "shelters": [
            {"id": "sh_vaidyanath_dharamsala", "name": "Deoghar District Shravani Mela Mega Shelter", "lat": 24.4910, "lon": 86.6980, "capacity_persons": 4000, "has_backup_power": True, "contact_phone": "+91-6432-222201"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Shravani Mela (Month-long)", "crowd_multiplier": 3.5},
                {"name": "Mahashivratri", "crowd_multiplier": 2.5}
            ],
            "crowd_crush_risk_level": "SEVERE",
            "historical_crowd_crush_incidents": "5+ million Kanwariyas visit in Shravan; historic 2015 stampede near Belabagan queue route. High crowd-surge control enforced.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Long pedestrian queue routes (8-12km walking in barefoot holding lines); heat exhaustion and blister fatigue.",
            "nearest_medical_infra": {
                "hospital_name": "Deoghar Sadar Hospital & AIIMS Deoghar",
                "distance_km": 2.0,
                "has_oxygen_bank": True,
                "emergency_helipad": "Deoghar Airport Helipad"
            },
            "security_screening_level": "BIOMETRIC_HOLDING",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 16. 12 Jyotirlingas: Nageshwar
    # -------------------------------------------------------------------------
    {
        "id": "dest_nageshwar",
        "canonical_name": "Nageshwar Jyotirlinga",
        "name_hi": "श्री नागेश्वर ज्योतिर्लिंग",
        "state_ut": "Gujarat",
        "region_type": "COASTAL_MARINE",
        "category": "pilgrimage",
        "lat": 22.3353,
        "lon": 69.0538,
        "elevation_m": 15,
        "description": "Coastal Jyotirlinga temple situated between Dwarka and Beyt Dwarka, housing a towering 80-foot Lord Shiva statue.",
        "trail_coords": [
            [69.0450, 22.3280, 12],
            [69.0538, 22.3353, 15],
            [69.0620, 22.3420, 18]
        ],
        "bypass_coords": [
            [69.0450, 22.3280, 12],
            [69.0520, 22.3380, 16],
            [69.0620, 22.3420, 18]
        ],
        "checkpoints": [
            {"id": "cp_ng1", "name": "Nageshwar Temple Plaza", "name_hi": "नागेश्वर मंदिर परिसर", "lat": 22.3353, "lon": 69.0538, "altitude_m": 15, "facilities": ["Parking Bay", "First Aid Booth", "Information Desk"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 10.0, "nearest_sdrf_dist_km": 4.0}
        ],
        "hazard_zones": [
            {
                "id": "hz_nageshwar_heat",
                "name": "Coastal Saurashtra Arid Heat & Wind Belt",
                "category": "HEATWAVE",
                "severity": "MODERATE",
                "base_hazard_weight": 0.60,
                "polygon_coordinates": [[69.0400, 22.3200], [69.0700, 22.3200], [69.0700, 22.3500], [69.0400, 22.3500], [69.0400, 22.3200]],
                "historical_incident": "Summer heatwave (42°C) and coastal cyclonic squalls"
            }
        ],
        "shelters": [
            {"id": "sh_nageshwar_hall", "name": "Nageshwar Trust Pilgrim Shelter", "lat": 22.3360, "lon": 69.0550, "capacity_persons": 1000, "has_backup_power": True, "contact_phone": "+91-2892-234555"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Mahashivratri", "crowd_multiplier": 2.2},
                {"name": "Shravan Mondays", "crowd_multiplier": 1.8}
            ],
            "crowd_crush_risk_level": "MODERATE",
            "historical_crowd_crush_incidents": "Spillover tourist crowds from Dwarka circuit; manageable open plaza space.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Flat coastal terrain with open courtyards; high midday sun exposure and hydration needs.",
            "nearest_medical_infra": {
                "hospital_name": "Mithapur Tata Hospital / Dwarka Civil Hospital",
                "distance_km": 10.0,
                "has_oxygen_bank": True,
                "emergency_helipad": "Mithapur Airstrip"
            },
            "security_screening_level": "STANDARD",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 17. 12 Jyotirlingas: Grishneshwar (Ellora)
    # -------------------------------------------------------------------------
    {
        "id": "dest_grishneshwar",
        "canonical_name": "Grishneshwar Jyotirlinga Ellora",
        "name_hi": "श्री घृष्णेश्वर ज्योतिर्लिंग वेरुळ",
        "state_ut": "Maharashtra",
        "region_type": "PLAINS_RIVERINE",
        "category": "pilgrimage",
        "lat": 20.0244,
        "lon": 75.1722,
        "elevation_m": 570,
        "description": "Twelfth Jyotirlinga located at Verul village adjacent to UNESCO World Heritage Ellora Caves in Chhatrapati Sambhajinagar district.",
        "trail_coords": [
            [75.1650, 20.0180, 560],
            [75.1722, 20.0244, 570],
            [75.1800, 20.0300, 580]  # Ellora Caves Entrance
        ],
        "bypass_coords": [
            [75.1650, 20.0180, 560],
            [75.1700, 20.0280, 575],
            [75.1800, 20.0300, 580]
        ],
        "checkpoints": [
            {"id": "cp_gr1", "name": "Grishneshwar Mandir Gate", "name_hi": "घृष्णेश्वर मंदिर द्वार", "lat": 20.0244, "lon": 75.1722, "altitude_m": 570, "facilities": ["Security Desk", "First Aid Kiosk"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 4.0, "nearest_sdrf_dist_km": 1.0}
        ],
        "hazard_zones": [
            {
                "id": "hz_grishneshwar_traffic",
                "name": "Ellora-Verul Tourism Traffic & Heat Belt",
                "category": "HEATWAVE",
                "severity": "MODERATE",
                "base_hazard_weight": 0.60,
                "polygon_coordinates": [[75.1600, 20.0150], [75.1850, 20.0150], [75.1850, 20.0350], [75.1600, 20.0350], [75.1600, 20.0150]],
                "historical_incident": "Summer temperature surges (41°C+) and highway traffic bottlenecks during holidays"
            }
        ],
        "shelters": [
            {"id": "sh_grishneshwar_hall", "name": "Verul Pilgrim Community Hall", "lat": 20.0250, "lon": 75.1740, "capacity_persons": 1000, "has_backup_power": True, "contact_phone": "+91-2437-244585"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["12 Jyotirlingas"],
            "peak_seasons": [
                {"name": "Mahashivratri", "crowd_multiplier": 2.4},
                {"name": "Shravan Month", "crowd_multiplier": 2.0}
            ],
            "crowd_crush_risk_level": "MODERATE",
            "historical_crowd_crush_incidents": "Weekend combined tourist/pilgrim congestion with Ellora cave visitors.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Flat stone courtyard with traditional dress regulations; summer afternoon temperatures exceed 41°C.",
            "nearest_medical_infra": {
                "hospital_name": "Khuldabad Rural Hospital",
                "distance_km": 4.0,
                "has_oxygen_bank": True,
                "emergency_helipad": "Aurangabad Airport Helipad"
            },
            "security_screening_level": "STANDARD",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 18. Ajmer Sharif Dargah
    # -------------------------------------------------------------------------
    {
        "id": "dest_ajmer_sharif",
        "canonical_name": "Ajmer Sharif Dargah",
        "name_hi": "अजमेर शरीफ दरगाह",
        "state_ut": "Rajasthan",
        "region_type": "PLAINS_RIVERINE",
        "category": "pilgrimage",
        "lat": 26.4561,
        "lon": 74.6282,
        "elevation_m": 480,
        "description": "Sufi shrine of revered saint Khwaja Moinuddin Chishti in Ajmer, visited by millions across all faiths during the annual Urs festival.",
        "trail_coords": [
            [74.6210, 26.4500, 470], # Dargah Bazaar Entrance
            [74.6250, 26.4530, 475], # Nizam Gate
            [74.6282, 26.4561, 480], # Buland Darwaza & Sanctum
            [74.6340, 26.4610, 490]  # Ana Sagar Lake Promenade
        ],
        "bypass_coords": [
            [74.6210, 26.4500, 470],
            [74.6290, 26.4580, 482],
            [74.6340, 26.4610, 490]
        ],
        "checkpoints": [
            {"id": "cp_aj1", "name": "Dargah Bazaar Police Holding Gate", "name_hi": "दरगाह बाजार गेट", "lat": 26.4530, "lon": 74.6250, "altitude_m": 475, "facilities": ["Police Control Room", "First Aid Center"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 1.5, "nearest_sdrf_dist_km": 0.4},
            {"id": "cp_aj2", "name": "Buland Darwaza & Main Dargah Courtyard", "name_hi": "बुलंद दरवाजा दरगाह", "lat": 26.4561, "lon": 74.6282, "altitude_m": 480, "facilities": ["Holding Plazas", "Medical Center", "Drinking Water Point"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 1.8, "nearest_sdrf_dist_km": 0.3}
        ],
        "hazard_zones": [
            {
                "id": "hz_ajmer_bazaar_crowd",
                "name": "Dargah Bazaar Narrow Alley Chokepoint & Summer Heat Belt (DDMA)",
                "category": "CROWD_STAMPEDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.80,
                "polygon_coordinates": [[74.6200, 26.4500], [74.6350, 26.4500], [74.6350, 26.4650], [74.6200, 26.4650], [74.6200, 26.4500]],
                "historical_incident": "Extreme crowd accumulation in narrow alleyways during the 6-day annual Urs"
            }
        ],
        "shelters": [
            {"id": "sh_ajmer_vishram", "name": "Ajmer Dargah Committee Vishram Sthali", "lat": 26.4580, "lon": 74.6300, "capacity_persons": 5000, "has_backup_power": True, "contact_phone": "+91-145-2429084"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Sacred Shrines", "Heritage Pilgrimage"],
            "peak_seasons": [
                {"name": "Annual Urs Festival (Rajab Month)", "crowd_multiplier": 3.2},
                {"name": "Weekend & Eid Surges", "crowd_multiplier": 2.0}
            ],
            "crowd_crush_risk_level": "SEVERE",
            "historical_crowd_crush_incidents": "Extremely narrow Dargah Bazaar alleyways and Nizam Gate entry bottlenecks during the 6-day Urs gathering.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Flat but densely crowded bazaars; arid summer heatwaves (44°C+) and dehydration risk.",
            "nearest_medical_infra": {
                "hospital_name": "Jawaharlal Nehru Medical College Hospital Ajmer",
                "distance_km": 1.8,
                "has_oxygen_bank": True,
                "emergency_helipad": "Ajmer Police Ground"
            },
            "security_screening_level": "BIOMETRIC_HOLDING",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 19. Shirdi Sai Baba Temple
    # -------------------------------------------------------------------------
    {
        "id": "dest_shirdi",
        "canonical_name": "Shirdi Sai Baba Samadhi Mandir",
        "name_hi": "श्री शिर्डी साईं बाबा मंदिर",
        "state_ut": "Maharashtra",
        "region_type": "PLAINS_RIVERINE",
        "category": "pilgrimage",
        "lat": 19.7667,
        "lon": 74.4764,
        "elevation_m": 504,
        "description": "Globally renowned pilgrimage centre honoring Shri Sai Baba, welcoming tens of thousands of daily devotees in Ahmednagar district.",
        "trail_coords": [
            [74.4700, 19.7600, 500], # Shirdi Bus Stand
            [74.4730, 19.7630, 502], # Bhakta Niwas Corridor
            [74.4764, 19.7667, 504], # Samadhi Mandir Complex
            [74.4820, 19.7720, 508]  # Khandoba Temple Entrance
        ],
        "bypass_coords": [
            [74.4700, 19.7600, 500],
            [74.4780, 19.7680, 505],
            [74.4820, 19.7720, 508]
        ],
        "checkpoints": [
            {"id": "cp_sh1", "name": "Shirdi Central Queue Complex 1", "name_hi": "शिर्डी दर्शन कतार संकुल", "lat": 19.7630, "lon": 74.4730, "altitude_m": 502, "facilities": ["AC Holding Halls", "RO Water Kiosk", "Sansthan Medical Post"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.4, "nearest_sdrf_dist_km": 0.2},
            {"id": "cp_sh2", "name": "Samadhi Mandir Inner Courtyard", "name_hi": "समाधि मंदिर परिसर", "lat": 19.7667, "lon": 74.4764, "altitude_m": 504, "facilities": ["Biometric Check", "Emergency First Aid", "Security Command"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.5, "nearest_sdrf_dist_km": 0.2}
        ],
        "hazard_zones": [
            {
                "id": "hz_shirdi_crowd_corridor",
                "name": "Shirdi Samadhi Mandir Complex High-Density Holding Zone",
                "category": "CROWD_STAMPEDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.70,
                "polygon_coordinates": [[74.4700, 19.7600], [74.4850, 19.7600], [74.4850, 19.7750], [74.4700, 19.7750], [74.4700, 19.7600]],
                "historical_incident": "Massive darshan queue surges exceeding 100,000 pilgrims on Punyatithi and Ram Navami"
            }
        ],
        "shelters": [
            {"id": "sh_shirdi_bhakta", "name": "Shri Sai Baba Sansthan Mega Bhakta Niwas", "lat": 19.7680, "lon": 74.4790, "capacity_persons": 6000, "has_backup_power": True, "contact_phone": "+91-2423-258500"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Sacred Shrines", "Maharashtra Pilgrimage"],
            "peak_seasons": [
                {"name": "Ram Navami & Guru Purnima", "crowd_multiplier": 2.8},
                {"name": "Vijayadashami Punyatithi", "crowd_multiplier": 3.0},
                {"name": "Year-end Holiday Peak", "crowd_multiplier": 2.2}
            ],
            "crowd_crush_risk_level": "HIGH",
            "historical_crowd_crush_incidents": "Continuous 24x7 darshan queue complex handling 80,000+ daily visitors; holding hall queue surges during festival aartis.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "Multi-tier covered holding halls with ramps and elevators; air-conditioned queues reduce physical heat stress.",
            "nearest_medical_infra": {
                "hospital_name": "Shri Saibaba Super Speciality Hospital",
                "distance_km": 0.5,
                "has_oxygen_bank": True,
                "emergency_helipad": "Shirdi Airport / Sansthan Helipad"
            },
            "security_screening_level": "BIOMETRIC_HOLDING",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 20. Palitana Temples (Shatrunjaya)
    # -------------------------------------------------------------------------
    {
        "id": "dest_palitana",
        "canonical_name": "Palitana Shatrunjaya Temples",
        "name_hi": "पालीताना शत्रुंजय तीर्थ",
        "state_ut": "Gujarat",
        "region_type": "HILL_MOUNTAIN",
        "category": "pilgrimage",
        "lat": 21.5033,
        "lon": 71.7828,
        "elevation_m": 603,
        "description": "Pinnacle of Jain pilgrimage comprising 900+ marble-carved temples crowning Shatrunjaya Hill, ascended via 3,500+ stone steps.",
        "trail_coords": [
            [71.8250, 21.5200, 150], # Palitana Town Base
            [71.8050, 21.5120, 250], # Jay Taleti Foot of Hill
            [71.7950, 21.5080, 420], # Hinglaj Mata / Mid-way Rest Halt
            [71.7828, 21.5033, 603]  # Adinath Dada Tirth Core Summit
        ],
        "bypass_coords": [
            [71.8050, 21.5120, 250],
            [71.7900, 21.5060, 480],
            [71.7828, 21.5033, 603]
        ],
        "checkpoints": [
            {"id": "cp_pal1", "name": "Jay Taleti Base Origin", "name_hi": "जय तळेटी पायथा", "lat": 21.5120, "lon": 71.8050, "altitude_m": 250, "facilities": ["Doli (Palanquin) Station", "First Aid Kiosk", "Anandji Kalyanji Trust Office"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 2.0, "nearest_sdrf_dist_km": 0.5},
            {"id": "cp_pal2", "name": "Hinglaj Rest Point (1,800th Step)", "name_hi": "हिंगलाज विश्राम स्थल", "lat": 21.5080, "lon": 71.7950, "altitude_m": 420, "facilities": ["Covered Shade", "Emergency Glucose/Water Desk"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 2.8, "nearest_sdrf_dist_km": 1.0},
            {"id": "cp_pal3", "name": "Shri Adinath Main Tirth Complex", "name_hi": "श्री आदिनाथ मुख्य मंदिर", "lat": 21.5033, "lon": 71.7828, "altitude_m": 603, "facilities": ["Marble Temple Complex", "Medical Tent", "Trust Relief Post"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 3.5, "nearest_sdrf_dist_km": 1.2}
        ],
        "hazard_zones": [
            {
                "id": "hz_palitana_heat_stair",
                "name": "Shatrunjaya 3500-Step Staircase Heat Exhaustion & Chokepoint (NDMA)",
                "category": "CROWD_STAMPEDE",
                "severity": "HIGH",
                "base_hazard_weight": 0.75,
                "polygon_coordinates": [[71.7700, 21.4900], [71.8000, 21.4900], [71.8000, 21.5200], [71.7700, 21.5200], [71.7700, 21.4900]],
                "historical_incident": "Midday heat stroke and stair congestion during 6 Gau Pheri festival when temperatures surpass 42°C on exposed marble steps"
            }
        ],
        "shelters": [
            {"id": "sh_palitana_dharmashala", "name": "Anandji Kalyanji Trust Yatri Niwas", "lat": 21.5150, "lon": 71.8100, "capacity_persons": 3000, "has_backup_power": True, "contact_phone": "+91-2848-252156"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Sacred Shrines", "Jain Tirth Circuit"],
            "peak_seasons": [
                {"name": "Kartik Purnima & Chaitra Purnima (6 Gau Pheri)", "crowd_multiplier": 3.2},
                {"name": "Paryushan Parva", "crowd_multiplier": 2.2}
            ],
            "crowd_crush_risk_level": "HIGH",
            "historical_crowd_crush_incidents": "3,500-step staircase chokepoints and hilltop temple complex entry gates during 6 Gau Pheri parikrama with 100,000+ pilgrims.",
            "mobility_tier": "STEEP_TREK_STAIRS",
            "physical_exertion_note": "Demanding 3.5km vertical stair climb (3,500+ stone steps). Severe heat exhaustion / dehydration risk after 10:00 AM; doli available for elderly.",
            "nearest_medical_infra": {
                "hospital_name": "Palitana Mansinhji Civil Hospital",
                "distance_km": 2.5,
                "has_oxygen_bank": True,
                "emergency_helipad": "Bhavnagar Helipad / Airbase"
            },
            "security_screening_level": "ELEVATED",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # 21. Swaminarayan Akshardham (Delhi)
    # -------------------------------------------------------------------------
    {
        "id": "dest_akshardham",
        "canonical_name": "Swaminarayan Akshardham Temple Delhi",
        "name_hi": "स्वामीनारायण अक्षरधाम दिल्ली",
        "state_ut": "Delhi",
        "region_type": "URBAN_HERITAGE",
        "category": "pilgrimage",
        "lat": 28.6127,
        "lon": 77.2773,
        "elevation_m": 210,
        "description": "Monumental spiritual and cultural campus on the Yamuna riverfront, featuring sandstone architecture, exhibitions, and water shows.",
        "trail_coords": [
            [77.2720, 28.6080, 205], # Akshardham Metro Station & Entry
            [77.2750, 28.6100, 208], # Security Screening Cloakroom Plaza
            [77.2773, 28.6127, 210], # Central Monument Mandir
            [77.2810, 28.6150, 212]  # Sahaj Anand Water Show Arena
        ],
        "bypass_coords": [
            [77.2720, 28.6080, 205],
            [77.2780, 28.6140, 210],
            [77.2810, 28.6150, 212]
        ],
        "checkpoints": [
            {"id": "cp_ak1", "name": "Akshardham Metro & Security Checkpoint", "name_hi": "अक्षरधाम सुरक्षा जांच केंद्र", "lat": 28.6080, "lon": 77.2720, "altitude_m": 205, "facilities": ["Multi-tier Security Gate", "Cloakroom Facility", "First Aid Kiosk"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 2.5, "nearest_sdrf_dist_km": 1.0},
            {"id": "cp_ak2", "name": "Main Monument Mandir Plaza", "name_hi": "मुख्य अक्षरधाम मंदिर", "lat": 28.6127, "lon": 77.2773, "altitude_m": 210, "facilities": ["Holding Plazas", "Medical Center", "Ambulance Bay"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 3.0, "nearest_sdrf_dist_km": 0.5}
        ],
        "hazard_zones": [
            {
                "id": "hz_akshardham_urban_buffer",
                "name": "Akshardham Yamuna Lowland Buffer & Screening Corridor (DDMA)",
                "category": "CROWD_STAMPEDE",
                "severity": "MODERATE",
                "base_hazard_weight": 0.55,
                "polygon_coordinates": [[77.2700, 28.6050], [77.2850, 28.6050], [77.2850, 28.6200], [77.2700, 28.6200], [77.2700, 28.6050]],
                "historical_incident": "Yamuna river high flood discharge levels (Hathnikund barrage) and high-density weekend security check line bottlenecks"
            }
        ],
        "shelters": [
            {"id": "sh_akshardham_pavilion", "name": "Akshardham Campus Disaster Assembly Area", "lat": 28.6110, "lon": 77.2750, "capacity_persons": 5000, "has_backup_power": True, "contact_phone": "+91-11-43442344"}
        ],
        "pilgrimage_metadata": {
            "circuits": ["Sacred Shrines", "Delhi Heritage Circuit"],
            "peak_seasons": [
                {"name": "Diwali & Janmashtami", "crowd_multiplier": 2.4},
                {"name": "National Holidays & Weekends", "crowd_multiplier": 2.0}
            ],
            "crowd_crush_risk_level": "MODERATE",
            "historical_crowd_crush_incidents": "Intensive multi-tier security screening queues (cloakroom / electronics check) causing entry plaza delays on holiday evenings.",
            "mobility_tier": "PAVED_WALKWAY",
            "physical_exertion_note": "100-acre flat paved stone campus with extensive pedestrian walking; summer heat island effect & winter high AQI/smog.",
            "nearest_medical_infra": {
                "hospital_name": "Max Super Speciality Hospital Patparganj / LBS Hospital",
                "distance_km": 3.0,
                "has_oxygen_bank": True,
                "emergency_helipad": "CWG Village Helipad"
            },
            "security_screening_level": "BIOMETRIC_HOLDING",
            "connectivity_status": "STABLE_4G"
        }
    },

    # -------------------------------------------------------------------------
    # Non-Pilgrimage Diverse National Benchmarks (Wildlife, Desert, Adventure)
    # -------------------------------------------------------------------------
    {
        "id": "dest_kaziranga",
        "canonical_name": "Kaziranga National Park",
        "name_hi": "काजीरंगा राष्ट्रीय उद्यान",
        "state_ut": "Assam",
        "region_type": "FOREST_WILDLIFE",
        "category": "wildlife",
        "lat": 26.5775,
        "lon": 93.1711,
        "elevation_m": 80,
        "description": "UNESCO World Heritage wildlife sanctuary with flood plain ecosystems, elephant corridors, and Brahmaputra seasonal overflow.",
        "trail_coords": [
            [93.1600, 26.5700, 75],
            [93.1680, 26.5820, 80],
            [93.1800, 26.5950, 82],
            [93.2050, 26.6120, 85],
            [93.1450, 26.5580, 80]
        ],
        "bypass_coords": [
            [93.1680, 26.5820, 80],
            [93.1750, 26.5750, 105],
            [93.2050, 26.6120, 85]
        ],
        "checkpoints": [
            {"id": "cp_kz1", "name": "Kohora Main Gate & Permit Counter", "name_hi": "कोहोरा मुख्य द्वार", "lat": 26.5700, "lon": 93.1600, "altitude_m": 75, "facilities": ["Forest Permit Desk", "Armed Escort Counter", "Primary Health Centre"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 0.4, "nearest_sdrf_dist_km": 0.5},
            {"id": "cp_kz2", "name": "Central Range Office", "name_hi": "केंद्रीय वन परिक्षेत्र", "lat": 26.5820, "lon": 93.1680, "altitude_m": 80, "facilities": ["Forest Wireless Relay", "Veterinary Clinic", "Emergency Shelter"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 0.2, "nearest_sdrf_dist_km": 0.3},
            {"id": "cp_kz3", "name": "Mihimukh Safari Hub", "name_hi": "मिहीमुख सफारी हब", "lat": 26.5950, "lon": 93.1800, "altitude_m": 82, "facilities": ["Watch Tower", "Emergency Flare Booth", "First Aid"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 2.5, "nearest_sdrf_dist_km": 1.2},
            {"id": "cp_kz4", "name": "Donga Core Watchtower", "name_hi": "डोंगा कोर वॉचटावर", "lat": 26.6120, "lon": 93.2050, "altitude_m": 85, "facilities": ["Highland Animal Shelter", "Wireless Station"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 6.0, "nearest_sdrf_dist_km": 3.0}
        ],
        "hazard_zones": [
            {
                "id": "hz_kz_flood_plain",
                "name": "Brahmaputra Lowland Flood & Animal Corridor (CWC/FSI)",
                "category": "RIVER_FLOOD",
                "severity": "HIGH",
                "base_hazard_weight": 0.75,
                "polygon_coordinates": [[93.1500, 26.5800], [93.2200, 26.5800], [93.2200, 26.6300], [93.1500, 26.6300], [93.1500, 26.5800]],
                "historical_incident": "Seasonal flash inundation causing large wildlife herd migration across National Highway 715"
            }
        ],
        "shelters": [
            {"id": "sh_kz_highland_1", "name": "Kohora Highland Wildlife & Tourist Shelter", "lat": 26.5750, "lon": 93.1650, "capacity_persons": 800, "has_backup_power": True, "contact_phone": "+91-3776-268007"},
            {"id": "sh_kz_bokakhat_sdrf", "name": "Bokakhat SDRF Disaster Relief Camp", "lat": 26.6200, "lon": 93.5900, "capacity_persons": 1500, "has_backup_power": True, "contact_phone": "1077"}
        ]
    },
    {
        "id": "dest_jaisalmer",
        "canonical_name": "Jaisalmer & Sam Sand Dunes",
        "name_hi": "जैसलमेर एवं सम सैंड ड्यून्स",
        "state_ut": "Rajasthan",
        "region_type": "DESERT_ARID",
        "category": "desert",
        "lat": 26.9157,
        "lon": 70.9083,
        "elevation_m": 225,
        "description": "Thar Desert circuit characterized by extreme temperature fluctuations (45°C+ summer), sandstorms, and remote dune isolation.",
        "trail_coords": [
            [70.9120, 26.9120, 225],
            [70.8800, 26.8950, 220],
            [70.5500, 26.8300, 205],
            [70.3000, 26.8250, 195],
            [70.1500, 26.8100, 180]
        ],
        "bypass_coords": [
            [70.5500, 26.8300, 205],
            [70.4500, 26.8600, 215],
            [70.3000, 26.8250, 195]
        ],
        "checkpoints": [
            {"id": "cp_js1", "name": "Jaisalmer Fort Entry Plaza", "name_hi": "जैसलमेर किला", "lat": 26.9120, "lon": 70.9120, "altitude_m": 225, "facilities": ["Tourist Reception Centre", "Police Station", "City Hospital"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 0.3, "nearest_sdrf_dist_km": 0.5},
            {"id": "cp_js2", "name": "Gadisar Water Pavilion", "name_hi": "गड़सीसर झील", "lat": 26.8950, "lon": 70.8800, "altitude_m": 220, "facilities": ["Shaded Rest Pavilion", "Hydration Kiosk"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 1.2, "nearest_sdrf_dist_km": 1.5},
            {"id": "cp_js3", "name": "Kuldhara Heritage Transit", "name_hi": "कुलधरा गांव", "lat": 26.8300, "lon": 70.5500, "altitude_m": 205, "facilities": ["Archaeological Rest Post", "Emergency Wireless"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 14.0, "nearest_sdrf_dist_km": 12.0},
            {"id": "cp_js4", "name": "Sam Dunes Desert Hub", "name_hi": "सम सैंड ड्यून्स", "lat": 26.8250, "lon": 70.3000, "altitude_m": 195, "facilities": ["RTDC Desert Camp", "Border Patrol Post", "First Aid Tent"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 35.0, "nearest_sdrf_dist_km": 4.0}
        ],
        "hazard_zones": [
            {
                "id": "hz_js_heat_dune",
                "name": "Sam Outer Dunes Extreme Heat & Sandstorm Belt (IMD)",
                "category": "HEATWAVE",
                "severity": "HIGH",
                "base_hazard_weight": 0.80,
                "polygon_coordinates": [[70.2000, 26.7800], [70.3800, 26.7800], [70.3800, 26.8800], [70.2000, 26.8800], [70.2000, 26.7800]],
                "historical_incident": "Severe sandstorm and 48°C extreme heat index leading to rapid vehicle immobilization"
            }
        ],
        "shelters": [
            {"id": "sh_js_rtdc", "name": "RTDC Sam Desert Permanent Shelter", "lat": 26.8260, "lon": 70.3050, "capacity_persons": 600, "has_backup_power": True, "contact_phone": "+91-2992-252406"},
            {"id": "sh_js_bsf_base", "name": "BSF Border Tourism Emergency Post", "lat": 26.8300, "lon": 70.2800, "capacity_persons": 400, "has_backup_power": True, "contact_phone": "112"}
        ]
    },
    {
        "id": "dest_manali",
        "canonical_name": "Manali & Solang Valley",
        "name_hi": "मनाली एवं सोलांग घाटी",
        "state_ut": "Himachal Pradesh",
        "region_type": "HILL_MOUNTAIN",
        "category": "adventure",
        "lat": 32.2432,
        "lon": 77.1892,
        "elevation_m": 2050,
        "description": "Popular mountain adventure tourism hub prone to Beas river flash floods, Rohtang rockfalls, and winter blizzard blocks.",
        "trail_coords": [
            [77.1892, 32.2432, 2050],
            [77.1820, 32.2510, 2080],
            [77.1750, 32.2700, 2200],
            [77.1550, 32.3150, 2480],
            [77.1700, 32.3600, 3060]
        ],
        "bypass_coords": [
            [77.1750, 32.2700, 2200],
            [77.1950, 32.2900, 2350],
            [77.1550, 32.3150, 2480]
        ],
        "checkpoints": [
            {"id": "cp_mn1", "name": "Manali Town Plaza", "name_hi": "मनाली शहर", "lat": 32.2432, "lon": 77.1892, "altitude_m": 2050, "facilities": ["Civil Hospital", "Police Station", "HPTDC Info"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 0.2, "nearest_sdrf_dist_km": 0.3},
            {"id": "cp_mn2", "name": "Solang Adventure Arena", "name_hi": "सोलांग घाटी", "lat": 32.3150, "lon": 77.1550, "altitude_m": 2480, "facilities": ["Mountain Rescue Post", "First Aid", "Ropeway Base"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 8.0, "nearest_sdrf_dist_km": 1.0},
            {"id": "cp_mn3", "name": "Atal Tunnel South Portal", "name_hi": "अटल टनल साउथ पोर्टल", "lat": 32.3600, "lon": 77.1700, "altitude_m": 3060, "facilities": ["BRO Control Room", "Oxygen Parlour", "Emergency Bay"], "has_oxygen_booth": True, "nearest_hospital_dist_km": 15.0, "nearest_sdrf_dist_km": 0.1}
        ],
        "hazard_zones": [
            {
                "id": "hz_mn_beas_flood",
                "name": "Beas Riverbed Flash Inundation Zone (CWC)",
                "category": "RIVER_FLOOD",
                "severity": "HIGH",
                "base_hazard_weight": 0.80,
                "polygon_coordinates": [[77.1800, 32.2300], [77.1950, 32.2300], [77.1850, 32.2800], [77.1700, 32.2800], [77.1800, 32.2300]],
                "historical_incident": "Severe river swelling and bridge damage during cloudbursts"
            }
        ],
        "shelters": [
            {"id": "sh_mn_civil", "name": "Manali Municipal Disaster Relief Hall", "lat": 32.2450, "lon": 77.1910, "capacity_persons": 1000, "has_backup_power": True, "contact_phone": "+91-1902-252326"},
            {"id": "sh_mn_bro", "name": "BRO Emergency Shelter at Dhundi", "lat": 32.3550, "lon": 77.1650, "capacity_persons": 500, "has_backup_power": True, "contact_phone": "1077"}
        ]
    }
]

# Curated Pilgrimage Circuits Mapping
PILGRIMAGE_CIRCUITS = [
    {
        "id": "circuit_char_dham_cardinal",
        "name": "Char Dham (Cardinal)",
        "name_hi": "चार धाम (मुख्य महातीर्थ)",
        "description": "The four sacred cardinal pilgrimage sites established across India: Badrinath (North), Dwarka (West), Puri (East), and Rameswaram (South).",
        "icon": "compass",
        "destinations": ["dest_badrinath", "dest_dwarka", "dest_puri", "dest_rameswaram"]
    },
    {
        "id": "circuit_chota_char_dham",
        "name": "Chota Char Dham (Himalayan)",
        "name_hi": "छोटा चार धाम (उत्तराखंड)",
        "description": "High-altitude Himalayan pilgrimage circuit across the Garhwal mountains: Yamunotri, Gangotri, Kedarnath, and Badrinath.",
        "icon": "mountain",
        "destinations": ["dest_yamunotri", "dest_gangotri", "dest_kedarnath", "dest_badrinath"]
    },
    {
        "id": "circuit_12_jyotirlingas",
        "name": "12 Jyotirlingas",
        "name_hi": "द्वादश ज्योतिर्लिंग",
        "description": "The 12 most sacred manifestation shrines of Lord Shiva across coastal, mountain, plains, and riverine sectors of India.",
        "icon": "shield",
        "destinations": [
            "dest_somnath",
            "dest_mallikarjuna",
            "dest_mahakaleshwar",
            "dest_omkareshwar",
            "dest_kedarnath",
            "dest_bhimashankar",
            "dest_kashi_vishwanath",
            "dest_trimbakeshwar",
            "dest_vaidyanath",
            "dest_nageshwar",
            "dest_rameswaram",
            "dest_grishneshwar"
        ]
    },
    {
        "id": "circuit_sacred_shrines",
        "name": "Prominent Shrines & Tirths",
        "name_hi": "प्रमुख धार्मिक एवं तीर्थ स्थल",
        "description": "Iconic multi-faith pilgrimage destinations: Ajmer Sharif Dargah, Shirdi Sai Baba, Palitana Jain Tirth, and Akshardham Temple.",
        "icon": "landmark",
        "destinations": ["dest_ajmer_sharif", "dest_shirdi", "dest_palitana", "dest_akshardham"]
    }
]
