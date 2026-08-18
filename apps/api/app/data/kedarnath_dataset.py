"""
Geospatial and Topological Dataset for the Kedarnath Pilgrimage & Trekking Corridor
Contains authentic waypoints, elevation profiles, GSI hazard zones, emergency infrastructure, and trail paths.
"""

# Major Trek Checkpoints with Elevation & Medical Infrastructure
KEDARNATH_CHECKPOINTS = [
    {
        "id": "cp_sonprayag",
        "name": "Sonprayag",
        "name_hi": "सोनप्रयाग",
        "lat": 30.5526,
        "lon": 79.0669,
        "altitude_m": 1829,
        "type": "BASE_TRANSIT",
        "facilities": ["Biometric Registration Counter", "Shuttle Taxi Stand", "Primary Health Centre", "Police Post", "ATM"],
        "nearest_sdrf_dist_km": 0.2,
        "nearest_hospital_dist_km": 0.3,
        "has_oxygen_booth": True,
        "has_helipad": False
    },
    {
        "id": "cp_gaurikund",
        "name": "Gaurikund (Trek Start)",
        "name_hi": "गौरीकुंड",
        "lat": 30.5925,
        "lon": 79.0678,
        "altitude_m": 1982,
        "type": "TREK_ORIGIN",
        "facilities": ["Hot Water Kund", "Horse / Pony Registration Stand", "GMVN Rest House", "SDRF Control Room", "First Aid Center"],
        "nearest_sdrf_dist_km": 0.1,
        "nearest_hospital_dist_km": 0.2,
        "has_oxygen_booth": True,
        "has_helipad": False
    },
    {
        "id": "cp_jungle_chatti",
        "name": "Jungle Chatti",
        "name_hi": "जंगल चट्टी",
        "lat": 30.6150,
        "lon": 79.0688,
        "altitude_m": 2370,
        "type": "REST_STOP",
        "facilities": ["Emergency Shelter", "Drinking Water Point", "Medical Aid Post", "Refreshment Kiosks"],
        "nearest_sdrf_dist_km": 1.8,
        "nearest_hospital_dist_km": 4.0,
        "has_oxygen_booth": True,
        "has_helipad": False
    },
    {
        "id": "cp_bheembali",
        "name": "Bheembali",
        "name_hi": "भीमबली",
        "lat": 30.6380,
        "lon": 79.0712,
        "altitude_m": 2730,
        "type": "MAJOR_CHECKPOINT",
        "facilities": ["SDRF High Altitude Rescue Camp", "GMVN Wooden Huts", "Hyperbaric Oxygen Tent", "Bio-Toilets", "Helipad (Emergency)"],
        "nearest_sdrf_dist_km": 0.05,
        "nearest_hospital_dist_km": 0.1,
        "has_oxygen_booth": True,
        "has_helipad": True
    },
    {
        "id": "cp_chhoti_lincholi",
        "name": "Chhoti Lincholi",
        "name_hi": "छोटी लिनचोली",
        "lat": 30.6620,
        "lon": 79.0735,
        "altitude_m": 3150,
        "type": "REST_STOP",
        "facilities": ["Tented Accommodation", "Medical Relief Post", "Tea Stalls", "Wireless VHF Relay"],
        "nearest_sdrf_dist_km": 1.2,
        "nearest_hospital_dist_km": 3.0,
        "has_oxygen_booth": True,
        "has_helipad": False
    },
    {
        "id": "cp_lincholi",
        "name": "Lincholi",
        "name_hi": "लिनचोली",
        "lat": 30.6810,
        "lon": 79.0748,
        "altitude_m": 3300,
        "type": "MAJOR_CHECKPOINT",
        "facilities": ["Large GMVN Cottage Complex", "NDRF Base Camp", "24x7 Oxygen Parlour", "Helipad", "Police Checkpost"],
        "nearest_sdrf_dist_km": 0.2,
        "nearest_hospital_dist_km": 0.3,
        "has_oxygen_booth": True,
        "has_helipad": True
    },
    {
        "id": "cp_kedar_base_camp",
        "name": "Kedarnath Base Camp",
        "name_hi": "केदारनाथ बेस कैंप",
        "lat": 30.7230,
        "lon": 79.0690,
        "altitude_m": 3550,
        "type": "BASE_CAMP",
        "facilities": ["Govt Disaster Shelters", "Main Army Medical Hospital", "Helipad", "Mobile Tower (BSNL/Jio)", "Public Kitchen"],
        "nearest_sdrf_dist_km": 0.1,
        "nearest_hospital_dist_km": 0.2,
        "has_oxygen_booth": True,
        "has_helipad": True
    },
    {
        "id": "cp_kedarnath_temple",
        "name": "Shri Kedarnath Ji Temple",
        "name_hi": "श्री केदारनाथ जी मंदिर",
        "lat": 30.7352,
        "lon": 79.0669,
        "altitude_m": 3583,
        "type": "DESTINATION_SHRINE",
        "facilities": ["Mandir Samiti Office", "Darshan Queue Complex", "Emergency Evacuation Plaza", "Bhakti Niwas GMVN", "Police Control Room"],
        "nearest_sdrf_dist_km": 0.15,
        "nearest_hospital_dist_km": 0.3,
        "has_oxygen_booth": True,
        "has_helipad": False
    }
]

# Geological Hazard & Landslide Susceptibility Zones (GSI Data Representation)
HAZARD_ZONES = [
    {
        "id": "hz_rambara_slide",
        "name": "Rambara Active Debris Flow Zone",
        "name_hi": "रामबाड़ा सक्रिय मलबा प्रवाह क्षेत्र",
        "category": "LANDSLIDE_PRONE",
        "severity": "HIGH",
        "base_hazard_weight": 0.85,
        "polygon_coordinates": [
            [79.0680, 30.6200],
            [79.0725, 30.6200],
            [79.0730, 30.6320],
            [79.0675, 30.6320],
            [79.0680, 30.6200]
        ],
        "historical_incident": "Flash flood & debris washout in heavy monsoon rains",
        "recommended_safe_bypass_trail": "trail_upper_ridge_bheembali"
    },
    {
        "id": "hz_jungle_chatti_cliff",
        "name": "Jungle Chatti Shooting Stones Corridor",
        "name_hi": "जंगल चट्टी पत्थर गिरने का संवेदनशील क्षेत्र",
        "category": "SHOOTING_STONES",
        "severity": "MEDIUM",
        "base_hazard_weight": 0.65,
        "polygon_coordinates": [
            [79.0660, 30.6050],
            [79.0705, 30.6050],
            [79.0710, 30.6120],
            [79.0655, 30.6120],
            [79.0660, 30.6050]
        ],
        "historical_incident": "Loose rockfall during continuous rain > 20mm/hr",
        "recommended_safe_bypass_trail": "trail_covered_shed_path"
    },
    {
        "id": "hz_lincholi_crevasse",
        "name": "Lincholi Upper Snow & Silt Slip Zone",
        "name_hi": "लिनचोली ऊपरी हिम एवं गाद फिसलन क्षेत्र",
        "category": "AVALANCHE_SILT_SLIP",
        "severity": "HIGH",
        "base_hazard_weight": 0.75,
        "polygon_coordinates": [
            [79.0720, 30.6900],
            [79.0770, 30.6900],
            [79.0775, 30.7100],
            [79.0715, 30.7100],
            [79.0720, 30.6900]
        ],
        "historical_incident": "Sudden soil saturation during cloudbursts",
        "recommended_safe_bypass_trail": "trail_lincholi_paved_bypass"
    }
]

# Emergency Shelters & Safe Havens along the Route
EMERGENCY_SHELTERS = [
    {
        "id": "sh_sonprayag_shed",
        "name": "Sonprayag Rain Shelter Complex",
        "lat": 30.5530,
        "lon": 79.0665,
        "capacity_persons": 1500,
        "has_backup_power": True,
        "has_food_stock": True,
        "contact_phone": "+91-1364-268220"
    },
    {
        "id": "sh_gaurikund_gmvn",
        "name": "Gaurikund GMVN Disaster Shelter",
        "lat": 30.5930,
        "lon": 79.0682,
        "capacity_persons": 800,
        "has_backup_power": True,
        "has_food_stock": True,
        "contact_phone": "+91-1364-269123"
    },
    {
        "id": "sh_jungle_chatti_bunker",
        "name": "Jungle Chatti High-Grade Polycarbonate Shelter",
        "lat": 30.6155,
        "lon": 79.0692,
        "capacity_persons": 400,
        "has_backup_power": True,
        "has_food_stock": True,
        "contact_phone": "+91-1364-269190"
    },
    {
        "id": "sh_bheembali_sdrf",
        "name": "Bheembali SDRF Pre-Fab Shelter & Hospital",
        "lat": 30.6385,
        "lon": 79.0718,
        "capacity_persons": 1200,
        "has_backup_power": True,
        "has_food_stock": True,
        "contact_phone": "1070"
    },
    {
        "id": "sh_lincholi_ndrf",
        "name": "Lincholi Emergency Mountain Bunker",
        "lat": 30.6815,
        "lon": 79.0752,
        "capacity_persons": 1000,
        "has_backup_power": True,
        "has_food_stock": True,
        "contact_phone": "1077"
    },
    {
        "id": "sh_kedar_base_hangar",
        "name": "Kedarnath Base Camp Weather Dome & Shelter",
        "lat": 30.7240,
        "lon": 79.0695,
        "capacity_persons": 3000,
        "has_backup_power": True,
        "has_food_stock": True,
        "contact_phone": "112"
    }
]

# Baseline Trail Coordinates (LineString connecting Sonprayag to Kedarnath Temple)
MAIN_TRAIL_COORDINATES = [
    [79.0669, 30.5526, 1829], # Sonprayag
    [79.0673, 30.5750, 1900],
    [79.0678, 30.5925, 1982], # Gaurikund
    [79.0682, 30.6030, 2180],
    [79.0688, 30.6150, 2370], # Jungle Chatti
    [79.0700, 30.6270, 2550], # Rambara Bridge Approach
    [79.0712, 30.6380, 2730], # Bheembali
    [79.0725, 30.6500, 2940],
    [79.0735, 30.6620, 3150], # Chhoti Lincholi
    [79.0748, 30.6810, 3300], # Lincholi
    [79.0720, 30.7020, 3440], # Kedar Dome View Point
    [79.0690, 30.7230, 3550], # Base Camp
    [79.0669, 30.7352, 3583]  # Kedarnath Temple
]

# High-Altitude Safe Bypass Trail (Used during Rambara hazard spike)
BYPASS_TRAIL_COORDINATES = [
    [79.0688, 30.6150, 2370], # From Jungle Chatti
    [79.0645, 30.6240, 2580], # Upper Ridge Western Trail (avoiding river bed slide zone)
    [79.0660, 30.6330, 2690],
    [79.0712, 30.6380, 2730]  # Re-joining Bheembali SDRF Safe Post
]
