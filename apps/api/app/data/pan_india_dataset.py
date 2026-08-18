"""
Pan-India Geographic, Hazard, and Emergency Dataset.
Covers diverse destinations across all 5 canonical region types:
- HILL_MOUNTAIN (e.g. Kedarnath, Manali, Munnar)
- COASTAL_MARINE (e.g. Puri, Goa, Rameshwaram, Dhanushkodi)
- FOREST_WILDLIFE (e.g. Kaziranga, Jim Corbett, Bandhavgarh)
- DESERT_ARID (e.g. Jaisalmer, Rann of Kutch)
- URBAN_HERITAGE (e.g. Varanasi, Tirupati, Jaipur)
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

# Pre-seeded Diverse National Destinations
PAN_INDIA_DESTINATIONS = [
    {
        "id": "dest_kedarnath",
        "canonical_name": "Kedarnath Dham",
        "name_hi": "श्री केदारनाथ धाम",
        "state_ut": "Uttarakhand",
        "region_type": "HILL_MOUNTAIN",
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
        ]
    },
    {
        "id": "dest_puri",
        "canonical_name": "Puri & Golden Beach Corridor",
        "name_hi": "पुरी एवं गोल्डन बीच कॉरिडोर",
        "state_ut": "Odisha",
        "region_type": "COASTAL_MARINE",
        "lat": 19.8135,
        "lon": 85.8312,
        "elevation_m": 10,
        "description": "Major coastal pilgrimage and marine beach circuit vulnerable to Bay of Bengal tropical cyclones, tidal surges, and rip currents.",
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
            {"id": "cp_p4", "name": "Gundicha Temple Transit", "name_hi": "गुंडीचा मंदिर", "lat": 19.8180, "lon": 85.8450, "altitude_m": 12, "facilities": ["Drinking Water Hub", "OTDC Tourist Rest"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 1.0, "nearest_sdrf_dist_km": 1.2},
            {"id": "cp_p5", "name": "Konark Marine Drive Endpoint", "name_hi": "कोणार्क मरीन ड्राइव", "lat": 19.8876, "lon": 86.0945, "altitude_m": 8, "facilities": ["OTDC Panthanivas", "Coast Guard Station"], "has_oxygen_booth": False, "nearest_hospital_dist_km": 1.5, "nearest_sdrf_dist_km": 0.8}
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
        ]
    },
    {
        "id": "dest_kaziranga",
        "canonical_name": "Kaziranga National Park",
        "name_hi": "काजीरंगा राष्ट्रीय उद्यान",
        "state_ut": "Assam",
        "region_type": "FOREST_WILDLIFE",
        "lat": 26.5775,
        "lon": 93.1711,
        "elevation_m": 80,
        "description": "UNESCO World Heritage wildlife sanctuary with flood plain ecosystems, elephant corridors, and Brahmaputra seasonal overflow.",
        "trail_coords": [
            [93.1600, 26.5700, 75],  # Kohora Entry Gate
            [93.1680, 26.5820, 80],  # Central Range Range Office
            [93.1800, 26.5950, 82],  # Mihimukh Elephant Safari Point
            [93.2050, 26.6120, 85],  # Donga View Tower (Core Rhino Zone)
            [93.1450, 26.5580, 80]   # Bagori Western Range
        ],
        "bypass_coords": [
            [93.1680, 26.5820, 80],
            [93.1750, 26.5750, 105], # High Ground Artificial Highland Bypass
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
        "lat": 26.9157,
        "lon": 70.9083,
        "elevation_m": 225,
        "description": "Thar Desert circuit characterized by extreme temperature fluctuations (45°C+ summer), sandstorms, and remote dune isolation.",
        "trail_coords": [
            [70.9120, 26.9120, 225], # Golden Fort Gate
            [70.8800, 26.8950, 220], # Gadisar Lake
            [70.5500, 26.8300, 205], # Kuldhara Heritage Village
            [70.3000, 26.8250, 195], # Sam Sand Dunes Core
            [70.1500, 26.8100, 180]  # Desert National Park Khuri
        ],
        "bypass_coords": [
            [70.5500, 26.8300, 205],
            [70.4500, 26.8600, 215], # Paved State Highway bypass avoiding loose sand corridor
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
        "lat": 32.2432,
        "lon": 77.1892,
        "elevation_m": 2050,
        "description": "Popular mountain adventure tourism hub prone to Beas river flash floods, Rohtang rockfalls, and winter blizzard blocks.",
        "trail_coords": [
            [77.1892, 32.2432, 2050], # Mall Road Manali
            [77.1820, 32.2510, 2080], # Hadimba Devi Temple
            [77.1750, 32.2700, 2200], # Vashisht Hot Springs
            [77.1550, 32.3150, 2480], # Solang Valley
            [77.1700, 32.3600, 3060]  # Atal Tunnel South Portal
        ],
        "bypass_coords": [
            [77.1750, 32.2700, 2200],
            [77.1950, 32.2900, 2350], # Left bank bypass avoiding riverside highway
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
