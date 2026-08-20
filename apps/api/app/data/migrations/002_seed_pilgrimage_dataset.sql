-- =============================================================================
-- Migration: 002_seed_pilgrimage_dataset.sql
-- Description: Pan-India Pilgrimage Destination Dataset Schema & Seed Data
-- Database Engine: PostgreSQL 14+ with PostGIS 3+
-- Architecture: Generic Destination-Agnostic Spatial Model
-- =============================================================================

-- Enable PostGIS spatial extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. Table: region_types
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS region_types (
    code VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    primary_hazards TEXT[] NOT NULL,
    curfew_time VARCHAR(32) NOT NULL DEFAULT '18:00 IST',
    emergency_agency VARCHAR(255) NOT NULL,
    weights_json JSONB NOT NULL,
    risk_thresholds_json JSONB NOT NULL,
    advisories TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Canonical Region Types
INSERT INTO region_types (code, name, name_hi, primary_hazards, curfew_time, emergency_agency, weights_json, risk_thresholds_json, advisories)
VALUES
(
    'HILL_MOUNTAIN',
    'Himalayan & Hill Mountain',
    'पर्वतीय एवं उच्च हिमालयी क्षेत्र',
    ARRAY['LANDSLIDE', 'ALTITUDE_AMS', 'CLOUD_BURST', 'FLASH_FLOOD', 'HYPOTHERMIA'],
    '17:30 IST',
    'SDRF / Mountain Rescue Brigade',
    '{"terrain_landslide": 0.30, "weather_squall": 0.25, "altitude_hypoxia": 0.20, "medical_isolation": 0.15, "crowd_slowdown": 0.10}'::jsonb,
    '{"low": 35.0, "moderate": 65.0, "high": 80.0, "critical": 100.0}'::jsonb,
    ARRAY['Mandatory acclimatization halt above 2,800m altitude.', 'Trekking past 17:30 IST is prohibited by State Police due to freezing temperatures.', 'Carry 1 portable oxygen canister and waterproof alpine gear.']
),
(
    'COASTAL_MARINE',
    'Coastal & Marine Sector',
    'तटीय एवं समुद्री क्षेत्र',
    ARRAY['CYCLONE_SURGE', 'HIGH_TIDE', 'RIP_CURRENT', 'HEAVY_RAIN', 'UV_HEAT'],
    '19:00 IST',
    'Indian Coast Guard & Marine Police',
    '{"marine_cyclone_tide": 0.35, "weather_precipitation": 0.25, "rip_current_beach": 0.15, "heat_uv_stress": 0.15, "crowd_density": 0.10}'::jsonb,
    '{"low": 35.0, "moderate": 65.0, "high": 80.0, "critical": 100.0}'::jsonb,
    ARRAY['Check INCOIS high wave / tidal surge bulletin before entering sea.', 'Swimming prohibited near red-flagged rip-current sandbars.', 'Observe Coast Guard cyclone early warning flags.']
),
(
    'PLAINS_RIVERINE',
    'Plains & Riverine Corridor',
    'मैदानी एवं नदी घाटी क्षेत्र',
    ARRAY['CROWD_SURGE', 'RIVER_FLOOD', 'HEATWAVE', 'BOTTLENECK_STAMPEDE'],
    '21:30 IST',
    'District Disaster Management Authority (DDMA) & NDRF',
    '{"crowd_stampede_chokepoint": 0.35, "riverine_flood": 0.25, "heat_stress": 0.20, "emergency_transit_time": 0.20}'::jsonb,
    '{"low": 35.0, "moderate": 65.0, "high": 80.0, "critical": 100.0}'::jsonb,
    ARRAY['Utilize barricaded one-way queue channels during religious festival surges.', 'Maintain hydration during extreme summer heatwaves (40°C+).', 'Avoid ghat riverfront steps during active monsoon discharge alerts.']
),
(
    'URBAN_HERITAGE',
    'Urban Pilgrimage & Heritage City',
    'शहरी तीर्थस्थल एवं ऐतिहासिक धरोहर',
    ARRAY['CROWD_SURGE', 'URBAN_WATERLOGGING', 'TRAFFIC_GRIDLOCK', 'AIR_QUALITY'],
    '22:00 IST',
    'City Traffic & Quick Reaction Police Command',
    '{"crowd_stampede_chokepoint": 0.40, "urban_waterlogging": 0.25, "emergency_transit_time": 0.20, "air_quality_aqi": 0.15}'::jsonb,
    '{"low": 35.0, "moderate": 65.0, "high": 80.0, "critical": 100.0}'::jsonb,
    ARRAY['Avoid narrow alleys and temple chokepoints during peak aarti / festival surge.', 'Use pre-booked biometric darshan queues to avoid stampede bottlenecks.', 'Follow designated municipal one-way pedestrian corridors.']
),
(
    'DESERT_ARID',
    'Desert & Arid Dune Circuit',
    'मरुस्थलीय एवं शुष्क क्षेत्र',
    ARRAY['EXTREME_HEAT', 'DEHYDRATION', 'DUST_STORM', 'SAND_IMMOBILIZATION'],
    '20:00 IST',
    'Border Tourism Patrol & Local Administration',
    '{"heat_dehydration": 0.40, "dust_sandstorm": 0.25, "oasis_water_isolation": 0.25, "sand_mobility": 0.10}'::jsonb,
    '{"low": 35.0, "moderate": 65.0, "high": 80.0, "critical": 100.0}'::jsonb,
    ARRAY['Avoid outdoor dune traversal between 11:30 AM and 03:30 PM due to extreme UV & heat stress.', 'Maintain a minimum of 4 litres of electrolyte-enriched water per person per day.', 'Seek shelter immediately upon visual detection of IMD dust storm fronts.']
),
(
    'FOREST_WILDLIFE',
    'Forest & Wildlife Sanctuary',
    'वन्यजीव अभयारण्य एवं राष्ट्रीय उद्यान',
    ARRAY['WILDLIFE_CONFLICT', 'FOREST_FIRE', 'MONSOON_RIVER_FLOOD', 'ISOLATION'],
    '17:00 IST',
    'Forest Protection Force & Rapid Response Team',
    '{"wildlife_corridor": 0.30, "forest_fire_fsi": 0.25, "weather_flash_flood": 0.20, "remote_isolation": 0.20, "permit_bottleneck": 0.05}'::jsonb,
    '{"low": 35.0, "moderate": 65.0, "high": 80.0, "critical": 100.0}'::jsonb,
    ARRAY['Strict entry curfew after 17:00 IST. Alighting from safari vehicle is illegal.', 'Avoid designated elephant / tiger migratory corridors.', 'Forest fire alert (FSI) must be verified before entering remote core sectors.']
)
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name,
    name_hi = EXCLUDED.name_hi,
    primary_hazards = EXCLUDED.primary_hazards,
    curfew_time = EXCLUDED.curfew_time,
    emergency_agency = EXCLUDED.emergency_agency,
    weights_json = EXCLUDED.weights_json,
    risk_thresholds_json = EXCLUDED.risk_thresholds_json,
    advisories = EXCLUDED.advisories;


-- -----------------------------------------------------------------------------
-- 2. Table: destinations
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS destinations (
    id VARCHAR(64) PRIMARY KEY,
    canonical_name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    state_ut VARCHAR(128) NOT NULL,
    region_type VARCHAR(64) NOT NULL REFERENCES region_types(code),
    elevation_m INT NOT NULL DEFAULT 100,
    category VARCHAR(64) NOT NULL DEFAULT 'general',
    description TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_destinations_geom ON destinations USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_region_type ON destinations(region_type);


-- -----------------------------------------------------------------------------
-- 3. Table: pilgrimage_metadata
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pilgrimage_metadata (
    destination_id VARCHAR(64) PRIMARY KEY REFERENCES destinations(id) ON DELETE CASCADE,
    circuits JSONB NOT NULL DEFAULT '[]'::jsonb,
    peak_seasons JSONB NOT NULL DEFAULT '[]'::jsonb,
    crowd_crush_risk_level VARCHAR(32) NOT NULL DEFAULT 'MODERATE', -- LOW, MODERATE, HIGH, SEVERE
    historical_crowd_crush_incidents TEXT,
    mobility_tier VARCHAR(64) NOT NULL DEFAULT 'PAVED_WALKWAY', -- PAVED_WALKWAY, MODERATE_INCLINE, STEEP_TREK_STAIRS, HIGH_ALTITUDE_TREK
    physical_exertion_note TEXT,
    nearest_medical_infra JSONB NOT NULL DEFAULT '{}'::jsonb,
    security_screening_level VARCHAR(32) NOT NULL DEFAULT 'STANDARD', -- STANDARD, ELEVATED, BIOMETRIC_HOLDING
    connectivity_status VARCHAR(64) NOT NULL DEFAULT 'STABLE_4G'
);


-- -----------------------------------------------------------------------------
-- 4. Table: hazard_zones
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hazard_zones (
    id VARCHAR(64) PRIMARY KEY,
    destination_id VARCHAR(64) REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    category VARCHAR(64) NOT NULL, -- LANDSLIDE, CYCLONE_SURGE, HEATWAVE, CROWD_STAMPEDE, RIVER_FLOOD
    severity VARCHAR(32) NOT NULL DEFAULT 'MODERATE', -- LOW, MODERATE, HIGH, CRITICAL
    region_type VARCHAR(64) NOT NULL REFERENCES region_types(code),
    base_hazard_weight FLOAT NOT NULL DEFAULT 0.70,
    boundary GEOMETRY(Polygon, 4326) NOT NULL,
    historical_incident TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_hazard_zones_boundary ON hazard_zones USING GIST(boundary);


-- -----------------------------------------------------------------------------
-- 5. Seed Data: 21 Curated Pilgrimage Destinations
-- -----------------------------------------------------------------------------

-- 1. Badrinath (Char Dham Cardinal & Chota Char Dham)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_badrinath',
    'Badrinath Dham',
    'श्री बद्रीनाथ धाम',
    'Uttarakhand',
    'HILL_MOUNTAIN',
    3133,
    'pilgrimage',
    'High-altitude cardinal and Himalayan Char Dham shrine dedicated to Lord Vishnu, along the Alaknanda river surrounded by Nar-Narayan peaks.',
    ST_SetSRID(ST_MakePoint(79.4912, 30.7447), 4326)
) ON CONFLICT (id) DO UPDATE SET 
    canonical_name = EXCLUDED.canonical_name,
    name_hi = EXCLUDED.name_hi,
    state_ut = EXCLUDED.state_ut,
    region_type = EXCLUDED.region_type,
    elevation_m = EXCLUDED.elevation_m,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_badrinath',
    '["Char Dham", "Chota Char Dham"]'::jsonb,
    '[{"name": "May Opening & June Summer Surge", "crowd_multiplier": 1.7}, {"name": "Autumn Sept-Oct Closing Surge", "crowd_multiplier": 1.5}]'::jsonb,
    'HIGH',
    'Heavy highway vehicle bottlenecks and queue chokepoints along Alaknanda river causeway during monsoon cloudburst events.',
    'MODERATE_INCLINE',
    'Road accessible but high altitude (3,133m) causes hypoxia, AMS, and rapid temperature drops below freezing.',
    '{"hospital_name": "Badrinath Combined Health Centre", "distance_km": 0.4, "has_oxygen_bank": true, "emergency_helipad": "Badrinath Army Helipad"}'::jsonb,
    'BIOMETRIC_HOLDING',
    'INTERMITTENT_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons, crowd_crush_risk_level = EXCLUDED.crowd_crush_risk_level, mobility_tier = EXCLUDED.mobility_tier, nearest_medical_infra = EXCLUDED.nearest_medical_infra;

-- 2. Dwarka (Char Dham Cardinal & Jyotirlinga Region)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_dwarka',
    'Dwarkadhish Temple',
    'श्री द्वारकाधीश मंदिर',
    'Gujarat',
    'COASTAL_MARINE',
    10,
    'pilgrimage',
    'Ancient western cardinal Char Dham temple situated at the confluence of Gomti River and Arabian Sea.',
    ST_SetSRID(ST_MakePoint(68.9685, 22.2442), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_dwarka',
    '["Char Dham"]'::jsonb,
    '[{"name": "Janmashtami Festival", "crowd_multiplier": 2.2}, {"name": "Diwali & New Year", "crowd_multiplier": 1.6}]'::jsonb,
    'HIGH',
    'Gomti Ghat and temple entry gate bottlenecks during Janmashtami midnight aarti.',
    'PAVED_WALKWAY',
    'Flat coastal terrain with stone stairs to Gomti Ghat; high humidity and coastal heat exhaustion risk.',
    '{"hospital_name": "Dwarka Sub-District Civil Hospital", "distance_km": 1.2, "has_oxygen_bank": true, "emergency_helipad": "Dwarka Helipad"}'::jsonb,
    'ELEVATED',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 3. Puri (Char Dham Cardinal)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_puri',
    'Puri Shri Jagannath Dham',
    'श्री जगन्नाथ मंदिर पुरी',
    'Odisha',
    'COASTAL_MARINE',
    10,
    'pilgrimage',
    'Eastern cardinal Char Dham shrine on the Bay of Bengal coastline, famed for the grand annual Ratha Yatra festival.',
    ST_SetSRID(ST_MakePoint(85.8312, 19.8135), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_puri',
    '["Char Dham"]'::jsonb,
    '[{"name": "Ratha Yatra (Ashadha Shukla)", "crowd_multiplier": 3.0}, {"name": "Snana Yatra", "crowd_multiplier": 2.0}]'::jsonb,
    'SEVERE',
    'Over 1.5 million pilgrims gather on Grand Road (Bada Danda); historic surge stampedes during chariot pulling.',
    'PAVED_WALKWAY',
    'Flat coastal terrain; intense summer heat (38°C+) and extreme humidity during Ratha Yatra.',
    '{"hospital_name": "Puri District Headquarters Hospital", "distance_km": 0.8, "has_oxygen_bank": true, "emergency_helipad": "Talabania Helipad"}'::jsonb,
    'BIOMETRIC_HOLDING',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 4. Rameswaram (Char Dham Cardinal & 12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_rameswaram',
    'Ramanathaswamy Temple Rameswaram',
    'श्री रामनाथस्वामी मंदिर रामेश्वरम',
    'Tamil Nadu',
    'COASTAL_MARINE',
    10,
    'pilgrimage',
    'Southern cardinal Char Dham and Jyotirlinga island temple on Pamban Island, connected via Pamban sea bridge.',
    ST_SetSRID(ST_MakePoint(79.3174, 9.2881), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_rameswaram',
    '["Char Dham", "12 Jyotirlingas"]'::jsonb,
    '[{"name": "Mahashivratri", "crowd_multiplier": 2.1}, {"name": "Thai Amavasai / Aadi Amavasai", "crowd_multiplier": 2.4}]'::jsonb,
    'HIGH',
    'Agni Theertham sea bathing chokepoints and narrow 22-wells holy theertham corridors.',
    'PAVED_WALKWAY',
    'Island terrain vulnerable to cyclone isolation if Pamban bridge is closed due to gale winds (>58km/h).',
    '{"hospital_name": "Rameswaram Government Hospital", "distance_km": 1.0, "has_oxygen_bank": true, "emergency_helipad": "Mandapam Coast Guard Base"}'::jsonb,
    'ELEVATED',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 5. Yamunotri (Chota Char Dham)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_yamunotri',
    'Yamunotri Dham',
    'श्री यमुनोत्री धाम',
    'Uttarakhand',
    'HILL_MOUNTAIN',
    3293,
    'pilgrimage',
    'Origin of the sacred Yamuna River in the Garhwal Himalayas, reached via a steep 6km mountain trek from Janki Chatti.',
    ST_SetSRID(ST_MakePoint(78.4600, 31.0140), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_yamunotri',
    '["Chota Char Dham"]'::jsonb,
    '[{"name": "May Opening & June Peak", "crowd_multiplier": 2.0}, {"name": "September Yatra Peak", "crowd_multiplier": 1.6}]'::jsonb,
    'HIGH',
    'Narrow cliffside trekking paths between Janki Chatti and Yamunotri experience mule/pedestrian bottlenecks.',
    'HIGH_ALTITUDE_TREK',
    'Steep 6km vertical trek with 1,000m elevation gain; high cardiovascular and AMS risk for elderly pilgrims.',
    '{"hospital_name": "Janki Chatti Primary Health Centre", "distance_km": 6.0, "has_oxygen_bank": true, "emergency_helipad": "Kharsali Helipad"}'::jsonb,
    'STANDARD',
    'WEAK_2G_INTERMITTENT'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 6. Gangotri (Chota Char Dham)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_gangotri',
    'Gangotri Dham',
    'श्री गंगोत्री धाम',
    'Uttarakhand',
    'HILL_MOUNTAIN',
    3100,
    'pilgrimage',
    'Source of the holy Bhagirathi/Ganga river in Uttarkashi district, nestled in Greater Himalayas pine forests.',
    ST_SetSRID(ST_MakePoint(78.9398, 30.9947), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_gangotri',
    '["Chota Char Dham"]'::jsonb,
    '[{"name": "Akshaya Tritiya Opening & May-June", "crowd_multiplier": 1.9}, {"name": "Navratri in Autumn", "crowd_multiplier": 1.4}]'::jsonb,
    'MODERATE',
    'Road access along Bhagirathi gorge vulnerable to landslide blockades at Sukhitop and Harshil.',
    'MODERATE_INCLINE',
    'High altitude (3,100m) with cold alpine temperatures; Gaumukh trek origin requires advanced permits.',
    '{"hospital_name": "Gangotri Medical Relief Post / Harshil Army Hospital", "distance_km": 0.5, "has_oxygen_bank": true, "emergency_helipad": "Harshil Helipad"}'::jsonb,
    'STANDARD',
    'INTERMITTENT_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 7. Kedarnath (Chota Char Dham & 12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_kedarnath',
    'Kedarnath Dham',
    'श्री केदारनाथ धाम',
    'Uttarakhand',
    'HILL_MOUNTAIN',
    3583,
    'pilgrimage',
    'Highest of the 12 Jyotirlingas and key Himalayan shrine in the Mandakini valley, accessed via a 16km alpine trek from Gaurikund.',
    ST_SetSRID(ST_MakePoint(79.0669, 30.7352), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_kedarnath',
    '["Chota Char Dham", "12 Jyotirlingas"]'::jsonb,
    '[{"name": "May-June Opening Surge", "crowd_multiplier": 2.5}, {"name": "Shravan Month & Mahashivratri", "crowd_multiplier": 2.0}]'::jsonb,
    'SEVERE',
    'Severe crowd surges at temple plaza and Lincholi-Bheembali trail bottlenecks; 2013 flood & subsequent flash rain debris alerts.',
    'HIGH_ALTITUDE_TREK',
    'Strenuous 16km mountain trail with 1,800m ascent; extreme hypoxia and rapid hypothermia risk past 17:30 IST.',
    '{"hospital_name": "Kedarnath Disaster Hospital & SDRF Medical Camp", "distance_km": 0.2, "has_oxygen_bank": true, "emergency_helipad": "Kedarnath Base Helipad"}'::jsonb,
    'BIOMETRIC_HOLDING',
    'INTERMITTENT_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 8. Somnath (12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_somnath',
    'Somnath Jyotirlinga Temple',
    'श्री सोमनाथ ज्योतिर्लिंग मंदिर',
    'Gujarat',
    'COASTAL_MARINE',
    8,
    'pilgrimage',
    'First among the 12 Jyotirlingas, situated on the pristine Arabian Sea coastline in Prabhas Patan, Veraval.',
    ST_SetSRID(ST_MakePoint(70.4012, 20.8880), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_somnath',
    '["12 Jyotirlingas"]'::jsonb,
    '[{"name": "Mahashivratri", "crowd_multiplier": 2.6}, {"name": "Shravan Month (Mondays)", "crowd_multiplier": 2.2}, {"name": "Kartik Purnima Fair", "crowd_multiplier": 2.0}]'::jsonb,
    'HIGH',
    'Heavy evening aarti and laser-show promenade crowd density near the sea-wall promenade.',
    'PAVED_WALKWAY',
    'Flat coastal walkways with wheelchair ramps; coastal cyclone and high tide wave surge monitoring active.',
    '{"hospital_name": "Veraval Civil Hospital", "distance_km": 5.0, "has_oxygen_bank": true, "emergency_helipad": "Somnath Helipad"}'::jsonb,
    'ELEVATED',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 9. Mallikarjuna (Srisailam - 12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_mallikarjuna',
    'Mallikarjuna Jyotirlinga Srisailam',
    'श्री मल्लिकार्जुन ज्योतिर्लिंग श्रीशैलम',
    'Andhra Pradesh',
    'HILL_MOUNTAIN',
    476,
    'pilgrimage',
    'Sacred hilltop Jyotirlinga and Shakti Peetha located in the dense Nallamala forest hills along the Krishna river.',
    ST_SetSRID(ST_MakePoint(78.8687, 16.0745), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_mallikarjuna',
    '["12 Jyotirlingas"]'::jsonb,
    '[{"name": "Mahashivratri Brahmotsavam", "crowd_multiplier": 2.7}, {"name": "Karthika Masam", "crowd_multiplier": 2.1}, {"name": "Ugadi", "crowd_multiplier": 1.8}]'::jsonb,
    'HIGH',
    'Nallamala forest ghat road traffic bottlenecks and Pathalaganga river ropeway queue surges.',
    'MODERATE_INCLINE',
    'Ghat road curves, steep stone steps down to Pathalaganga river; summer heat can exceed 42°C.',
    '{"hospital_name": "Srisailam Devasthanam Area Hospital", "distance_km": 0.8, "has_oxygen_bank": true, "emergency_helipad": "Sunnipenta Helipad"}'::jsonb,
    'ELEVATED',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 10. Mahakaleshwar (Ujjain - 12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_mahakaleshwar',
    'Mahakaleshwar Jyotirlinga Ujjain',
    'श्री महाकालेश्वर ज्योतिर्लिंग उज्जैन',
    'Madhya Pradesh',
    'PLAINS_RIVERINE',
    494,
    'pilgrimage',
    'Renowned south-facing Dakshinmukhi Jyotirlinga on the banks of Shipra River, famous for the daily Bhasma Aarti and Simhastha Kumbh.',
    ST_SetSRID(ST_MakePoint(75.7682, 23.1827), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_mahakaleshwar',
    '["12 Jyotirlingas"]'::jsonb,
    '[{"name": "Mahashivratri & Shravan Sawari", "crowd_multiplier": 3.0}, {"name": "Simhastha Kumbh Mela", "crowd_multiplier": 4.5}, {"name": "Nagchandreshwar (Nag Panchami)", "crowd_multiplier": 2.8}]'::jsonb,
    'SEVERE',
    'Massive crowd accumulation in Mahakal Lok corridor and Bhasma Aarti holding halls; historical rush during Nag Panchami.',
    'PAVED_WALKWAY',
    'Extensive 1.5km covered corridor walking; extreme summer temperatures (up to 45°C) in Malwa plains.',
    '{"hospital_name": "Ujjain District Civil Hospital / Madhav Nagar Hospital", "distance_km": 1.5, "has_oxygen_bank": true, "emergency_helipad": "Ujjain Police Line Helipad"}'::jsonb,
    'BIOMETRIC_HOLDING',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 11. Omkareshwar (12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_omkareshwar',
    'Omkareshwar Jyotirlinga',
    'श्री ओंकारेश्वर ज्योतिर्लिंग',
    'Madhya Pradesh',
    'PLAINS_RIVERINE',
    185,
    'pilgrimage',
    'Sacred Om-shaped Mandhata river island in the Narmada River housing the Jyotirlinga and Mamleshwar shrine.',
    ST_SetSRID(ST_MakePoint(76.1517, 22.2464), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_omkareshwar',
    '["12 Jyotirlingas"]'::jsonb,
    '[{"name": "Shravan Month (Mondays)", "crowd_multiplier": 2.4}, {"name": "Mahashivratri", "crowd_multiplier": 2.6}, {"name": "Kartik Purnima", "crowd_multiplier": 2.0}]'::jsonb,
    'HIGH',
    'Narmada suspension bridge and Mamleshwar bridge bottlenecks; riverboat boarding points during monsoon water release from Omkareshwar Dam.',
    'MODERATE_INCLINE',
    'Island parikrama involves steep stone steps; river currents require caution during dam floodgate discharge.',
    '{"hospital_name": "Omkareshwar Government Hospital", "distance_km": 1.0, "has_oxygen_bank": true, "emergency_helipad": "Omkareshwar Helipad"}'::jsonb,
    'ELEVATED',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 12. Bhimashankar (12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_bhimashankar',
    'Bhimashankar Jyotirlinga',
    'श्री भीमाशंकर ज्योतिर्लिंग',
    'Maharashtra',
    'HILL_MOUNTAIN',
    1005,
    'pilgrimage',
    'Jyotirlinga shrine situated in the Sahyadri Western Ghats ranges at the source of Bhima River, enveloped by wildlife sanctuary.',
    ST_SetSRID(ST_MakePoint(73.5354, 19.0722), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_bhimashankar',
    '["12 Jyotirlingas"]'::jsonb,
    '[{"name": "Mahashivratri", "crowd_multiplier": 2.5}, {"name": "Shravan Month (Monsoon)", "crowd_multiplier": 2.3}]'::jsonb,
    'HIGH',
    'Steep descent steps to temple become dangerously slick in torrential Sahyadri rains; ghat road landslides.',
    'MODERATE_INCLINE',
    '250+ stone steps down into valley; heavy fog, low visibility (<50m), and monsoon hypothermia risk.',
    '{"hospital_name": "Bhimashankar Rural Hospital / Ghodegaon PHC", "distance_km": 12.0, "has_oxygen_bank": false, "emergency_helipad": "Khandas Helipad"}'::jsonb,
    'STANDARD',
    'WEAK_2G_INTERMITTENT'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 13. Kashi Vishwanath (12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_kashi_vishwanath',
    'Kashi Vishwanath Temple Varanasi',
    'श्री काशी विश्वनाथ मंदिर वाराणसी',
    'Uttar Pradesh',
    'URBAN_HERITAGE',
    80,
    'pilgrimage',
    'Pinnacle of Shaivite pilgrimage on the western bank of the sacred Ganga River, featuring the Vishwanath Corridor.',
    ST_SetSRID(ST_MakePoint(83.0107, 25.3109), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_kashi_vishwanath',
    '["12 Jyotirlingas"]'::jsonb,
    '[{"name": "Shravan Month Kanwar Yatra", "crowd_multiplier": 3.2}, {"name": "Mahashivratri", "crowd_multiplier": 2.8}, {"name": "Dev Deepawali", "crowd_multiplier": 2.5}]'::jsonb,
    'SEVERE',
    'Heavy congestion in historic alleyways, Godowlia-Dashashwamedh corridor, and Ganga river ghat steps during aarti.',
    'PAVED_WALKWAY',
    'Flat corridor with extensive pedestrian movement; extreme humid heat during monsoon and intense crowd density.',
    '{"hospital_name": "Banaras Hindu University (BHU) Sir Sunderlal Hospital / Kabir Chaura Hospital", "distance_km": 2.5, "has_oxygen_bank": true, "emergency_helipad": "BHU Helipad"}'::jsonb,
    'BIOMETRIC_HOLDING',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 14. Trimbakeshwar (12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_trimbakeshwar',
    'Trimbakeshwar Jyotirlinga',
    'श्री त्र्यंबकेश्वर ज्योतिर्लिंग',
    'Maharashtra',
    'HILL_MOUNTAIN',
    720,
    'pilgrimage',
    'Ancient Jyotirlinga at the foothills of Brahmagiri mountain, the source of the Godavari River in Nashik district.',
    ST_SetSRID(ST_MakePoint(73.5308, 19.9322), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_trimbakeshwar',
    '["12 Jyotirlingas"]'::jsonb,
    '[{"name": "Nashik-Trimbakeshwar Kumbh Mela", "crowd_multiplier": 4.0}, {"name": "Shravan Somwar", "crowd_multiplier": 2.4}, {"name": "Mahashivratri", "crowd_multiplier": 2.2}]'::jsonb,
    'SEVERE',
    'Kushavarta Kund holy bathing tank and inner sanctum queue bottlenecks; intense Kumbh Mela surge history.',
    'MODERATE_INCLINE',
    'Paved town terrain with optional steep climb to Brahmagiri Hill peak (750 steps); heavy monsoon runoff.',
    '{"hospital_name": "Trimbakeshwar Sub-District Hospital", "distance_km": 0.6, "has_oxygen_bank": true, "emergency_helipad": "Trimbak Police Ground"}'::jsonb,
    'BIOMETRIC_HOLDING',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 15. Vaidyanath (Baidyanath Dham, Deoghar - 12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_vaidyanath',
    'Baidyanath Jyotirlinga Deoghar',
    'श्री बैद्यनाथ ज्योतिर्लिंग देवघर',
    'Jharkhand',
    'PLAINS_RIVERINE',
    254,
    'pilgrimage',
    'Major Jyotirlinga and Shakti Peetha complex, destination of the massive 105km Sultanganj-Deoghar Shravani Mela Kanwar Yatra.',
    ST_SetSRID(ST_MakePoint(86.7000, 24.4925), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_vaidyanath',
    '["12 Jyotirlingas"]'::jsonb,
    '[{"name": "Shravani Mela (Month-long)", "crowd_multiplier": 3.5}, {"name": "Mahashivratri", "crowd_multiplier": 2.5}]'::jsonb,
    'SEVERE',
    '5+ million Kanwariyas visit in Shravan; historic 2015 stampede near Belabagan queue route. High crowd-surge control enforced.',
    'PAVED_WALKWAY',
    'Long pedestrian queue routes (8-12km walking in barefoot holding lines); heat exhaustion and blister fatigue.',
    '{"hospital_name": "Deoghar Sadar Hospital & AIIMS Deoghar", "distance_km": 2.0, "has_oxygen_bank": true, "emergency_helipad": "Deoghar Airport Helipad"}'::jsonb,
    'BIOMETRIC_HOLDING',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 16. Nageshwar (12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_nageshwar',
    'Nageshwar Jyotirlinga',
    'श्री नागेश्वर ज्योतिर्लिंग',
    'Gujarat',
    'COASTAL_MARINE',
    15,
    'pilgrimage',
    'Coastal Jyotirlinga temple situated between Dwarka and Beyt Dwarka, housing a towering 80-foot Lord Shiva statue.',
    ST_SetSRID(ST_MakePoint(69.0538, 22.3353), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_nageshwar',
    '["12 Jyotirlingas"]'::jsonb,
    '[{"name": "Mahashivratri", "crowd_multiplier": 2.2}, {"name": "Shravan Mondays", "crowd_multiplier": 1.8}]'::jsonb,
    'MODERATE',
    'Spillover tourist crowds from Dwarka circuit; manageable open plaza space.',
    'PAVED_WALKWAY',
    'Flat coastal terrain with open courtyards; high midday sun exposure and hydration needs.',
    '{"hospital_name": "Mithapur Tata Hospital / Dwarka Civil Hospital", "distance_km": 10.0, "has_oxygen_bank": true, "emergency_helipad": "Mithapur Airstrip"}'::jsonb,
    'STANDARD',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 17. Grishneshwar (12 Jyotirlingas)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_grishneshwar',
    'Grishneshwar Jyotirlinga Ellora',
    'श्री घृष्णेश्वर ज्योतिर्लिंग वेरुळ',
    'Maharashtra',
    'PLAINS_RIVERINE',
    570,
    'pilgrimage',
    'Twelfth Jyotirlinga located at Verul village adjacent to UNESCO World Heritage Ellora Caves in Chhatrapati Sambhajinagar district.',
    ST_SetSRID(ST_MakePoint(75.1722, 20.0244), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_grishneshwar',
    '["12 Jyotirlingas"]'::jsonb,
    '[{"name": "Mahashivratri", "crowd_multiplier": 2.4}, {"name": "Shravan Month", "crowd_multiplier": 2.0}]'::jsonb,
    'MODERATE',
    'Weekend combined tourist/pilgrim congestion with Ellora cave visitors.',
    'PAVED_WALKWAY',
    'Flat stone courtyard with traditional dress regulations; summer afternoon temperatures exceed 41°C.',
    '{"hospital_name": "Khuldabad Rural Hospital", "distance_km": 4.0, "has_oxygen_bank": true, "emergency_helipad": "Aurangabad Airport Helipad"}'::jsonb,
    'STANDARD',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 18. Ajmer Sharif Dargah
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_ajmer_sharif',
    'Ajmer Sharif Dargah',
    'अजमेर शरीफ दरगाह',
    'Rajasthan',
    'PLAINS_RIVERINE',
    480,
    'pilgrimage',
    'Sufi shrine of revered saint Khwaja Moinuddin Chishti in Ajmer, visited by millions across all faiths during the annual Urs festival.',
    ST_SetSRID(ST_MakePoint(74.6282, 26.4561), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_ajmer_sharif',
    '["Sacred Shrines", "Heritage Pilgrimage"]'::jsonb,
    '[{"name": "Annual Urs Festival (Rajab Month)", "crowd_multiplier": 3.2}, {"name": "Weekend & Eid Surges", "crowd_multiplier": 2.0}]'::jsonb,
    'SEVERE',
    'Extremely narrow Dargah Bazaar alleyways and Nizam Gate entry bottlenecks during the 6-day Urs gathering.',
    'PAVED_WALKWAY',
    'Flat but densely crowded bazaars; arid summer heatwaves (44°C+) and dehydration risk.',
    '{"hospital_name": "Jawaharlal Nehru Medical College Hospital Ajmer", "distance_km": 1.8, "has_oxygen_bank": true, "emergency_helipad": "Ajmer Police Ground"}'::jsonb,
    'BIOMETRIC_HOLDING',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 19. Shirdi Sai Baba Temple
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_shirdi',
    'Shirdi Sai Baba Samadhi Mandir',
    'श्री शिर्डी साईं बाबा मंदिर',
    'Maharashtra',
    'PLAINS_RIVERINE',
    504,
    'pilgrimage',
    'Globally renowned pilgrimage centre honoring Shri Sai Baba, welcoming tens of thousands of daily devotees in Ahmednagar district.',
    ST_SetSRID(ST_MakePoint(74.4764, 19.7667), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_shirdi',
    '["Sacred Shrines", "Maharashtra Pilgrimage"]'::jsonb,
    '[{"name": "Ram Navami & Guru Purnima", "crowd_multiplier": 2.8}, {"name": "Vijayadashami Punyatithi", "crowd_multiplier": 3.0}, {"name": "Year-end Holiday Peak", "crowd_multiplier": 2.2}]'::jsonb,
    'HIGH',
    'Continuous 24x7 darshan queue complex handling 80,000+ daily visitors; holding hall queue surges during festival aartis.',
    'PAVED_WALKWAY',
    'Multi-tier covered holding halls with ramps and elevators; air-conditioned queues reduce physical heat stress.',
    '{"hospital_name": "Shri Saibaba Super Speciality Hospital", "distance_km": 0.5, "has_oxygen_bank": true, "emergency_helipad": "Shirdi Airport / Sansthan Helipad"}'::jsonb,
    'BIOMETRIC_HOLDING',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 20. Palitana Temples (Shatrunjaya)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_palitana',
    'Palitana Shatrunjaya Temples',
    'पालीताना शत्रुंजय तीर्थ',
    'Gujarat',
    'HILL_MOUNTAIN',
    603,
    'pilgrimage',
    'Pinnacle of Jain pilgrimage comprising 900+ marble-carved temples crowning Shatrunjaya Hill, ascended via 3,500+ stone steps.',
    ST_SetSRID(ST_MakePoint(71.7828, 21.5033), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_palitana',
    '["Sacred Shrines", "Jain Tirth Circuit"]'::jsonb,
    '[{"name": "Kartik Purnima & Chaitra Purnima (6 Gau Pheri)", "crowd_multiplier": 3.2}, {"name": "Paryushan Parva", "crowd_multiplier": 2.2}]'::jsonb,
    'HIGH',
    '3,500-step staircase chokepoints and hilltop temple complex entry gates during 6 Gau Pheri parikrama with 100,000+ pilgrims.',
    'STEEP_TREK_STAIRS',
    'Demanding 3.5km vertical stair climb (3,500+ stone steps). Severe heat exhaustion / dehydration risk after 10:00 AM; doli available for elderly.',
    '{"hospital_name": "Palitana Mansinhji Civil Hospital", "distance_km": 2.5, "has_oxygen_bank": true, "emergency_helipad": "Bhavnagar Helipad / Airbase"}'::jsonb,
    'ELEVATED',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- 21. Swaminarayan Akshardham (Delhi)
INSERT INTO destinations (id, canonical_name, name_hi, state_ut, region_type, elevation_m, category, description, location)
VALUES (
    'dest_akshardham',
    'Swaminarayan Akshardham Temple Delhi',
    'स्वामीनारायण अक्षरधाम दिल्ली',
    'Delhi',
    'URBAN_HERITAGE',
    210,
    'pilgrimage',
    'Monumental spiritual and cultural campus on the Yamuna riverfront, featuring sandstone architecture, exhibitions, and water shows.',
    ST_SetSRID(ST_MakePoint(77.2773, 28.6127), 4326)
) ON CONFLICT (id) DO UPDATE SET canonical_name = EXCLUDED.canonical_name, location = EXCLUDED.location;

INSERT INTO pilgrimage_metadata (destination_id, circuits, peak_seasons, crowd_crush_risk_level, historical_crowd_crush_incidents, mobility_tier, physical_exertion_note, nearest_medical_infra, security_screening_level, connectivity_status)
VALUES (
    'dest_akshardham',
    '["Sacred Shrines", "Delhi Heritage Circuit"]'::jsonb,
    '[{"name": "Diwali & Janmashtami", "crowd_multiplier": 2.4}, {"name": "National Holidays & Weekends", "crowd_multiplier": 2.0}]'::jsonb,
    'MODERATE',
    'Intensive multi-tier security screening queues (cloakroom / electronics check) causing entry plaza delays on holiday evenings.',
    'PAVED_WALKWAY',
    '100-acre flat paved stone campus with extensive pedestrian walking; summer heat island effect & winter high AQI/smog.',
    '{"hospital_name": "Max Super Speciality Hospital Patparganj / LBS Hospital", "distance_km": 3.0, "has_oxygen_bank": true, "emergency_helipad": "CWG Village Helipad"}'::jsonb,
    'BIOMETRIC_HOLDING',
    'STABLE_4G'
) ON CONFLICT (destination_id) DO UPDATE SET circuits = EXCLUDED.circuits, peak_seasons = EXCLUDED.peak_seasons;

-- -----------------------------------------------------------------------------
-- 6. Spatial Hazard Zones for Pilgrimage Sites
-- -----------------------------------------------------------------------------

-- Kedarnath Landslide & Glacial Hazard Belt
INSERT INTO hazard_zones (id, destination_id, name, name_hi, category, severity, region_type, base_hazard_weight, boundary, historical_incident)
VALUES (
    'hz_k_rambara',
    'dest_kedarnath',
    'Rambara Active Debris Slide & Glacial Runoff (GSI)',
    'रामबाड़ा भूस्खलन क्षेत्र',
    'LANDSLIDE',
    'HIGH',
    'HILL_MOUNTAIN',
    0.85,
    ST_SetSRID(ST_PolygonFromText('POLYGON((79.0680 30.6200, 79.0725 30.6200, 79.0730 30.6320, 79.0675 30.6320, 79.0680 30.6200))'), 4326),
    'Flash flood & steep debris washout in heavy monsoon rains along Mandakini gorge'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, boundary = EXCLUDED.boundary;

-- Rameswaram Cyclone Surge & Tidal Inundation Zone
INSERT INTO hazard_zones (id, destination_id, name, name_hi, category, severity, region_type, base_hazard_weight, boundary, historical_incident)
VALUES (
    'hz_rameshwaram_cyclone',
    'dest_rameswaram',
    'Pamban Island Cyclone Surge & Tidal Wave Zone (INCOIS)',
    'पाम्बन द्वीप चक्रवात एवं ज्वार जोखिम क्षेत्र',
    'CYCLONE_SURGE',
    'HIGH',
    'COASTAL_MARINE',
    0.80,
    ST_SetSRID(ST_PolygonFromText('POLYGON((79.2800 9.2600, 79.3500 9.2600, 79.3500 9.3200, 79.2800 9.3200, 79.2800 9.2600))'), 4326),
    'Severe cyclonic storms (1964 Dhanushkodi, 2018 Gaja) causing sea ingress and temporary Pamban bridge rail suspension'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, boundary = EXCLUDED.boundary;

-- Palitana Shatrunjaya Staircase Heat Exhaustion & Stampede Zone
INSERT INTO hazard_zones (id, destination_id, name, name_hi, category, severity, region_type, base_hazard_weight, boundary, historical_incident)
VALUES (
    'hz_palitana_heat_stair',
    'dest_palitana',
    'Shatrunjaya 3500-Step Staircase Heat Exhaustion & Chokepoint (NDMA)',
    'शत्रुंजय 3500 सीढ़ी ताप एवं भीड़ दबाव क्षेत्र',
    'CROWD_STAMPEDE',
    'HIGH',
    'HILL_MOUNTAIN',
    0.75,
    ST_SetSRID(ST_PolygonFromText('POLYGON((71.7700 21.4900, 71.8000 21.4900, 71.8000 21.5200, 71.7700 21.5200, 71.7700 21.4900))'), 4326),
    'Midday heat stroke and stair congestion during 6 Gau Pheri festival when temperatures surpass 42°C on exposed marble steps'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, boundary = EXCLUDED.boundary;

-- Shirdi Temple Entry & Holding Plaza High-Density Chokepoint
INSERT INTO hazard_zones (id, destination_id, name, name_hi, category, severity, region_type, base_hazard_weight, boundary, historical_incident)
VALUES (
    'hz_shirdi_crowd_corridor',
    'dest_shirdi',
    'Shirdi Samadhi Mandir Complex High-Density Holding Zone',
    'शिर्डी समाधि मंदिर उच्च घनत्व कॉरिडोर',
    'CROWD_STAMPEDE',
    'HIGH',
    'PLAINS_RIVERINE',
    0.70,
    ST_SetSRID(ST_PolygonFromText('POLYGON((74.4700 19.7600, 74.4850 19.7600, 74.4850 19.7750, 74.4700 19.7750, 74.4700 19.7600))'), 4326),
    'Massive darshan queue surges exceeding 100,000 pilgrims on Punyatithi and Ram Navami'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, boundary = EXCLUDED.boundary;

-- Akshardham Security Screening & Yamuna Floodplain Buffer
INSERT INTO hazard_zones (id, destination_id, name, name_hi, category, severity, region_type, base_hazard_weight, boundary, historical_incident)
VALUES (
    'hz_akshardham_urban_buffer',
    'dest_akshardham',
    'Akshardham Yamuna Lowland Buffer & Screening Corridor (DDMA)',
    'अक्षरधाम सुरक्षा एवं यमुना बफर क्षेत्र',
    'CROWD_STAMPEDE',
    'MODERATE',
    'URBAN_HERITAGE',
    0.55,
    ST_SetSRID(ST_PolygonFromText('POLYGON((77.2700 28.6050, 77.2850 28.6050, 77.2850 28.6200, 77.2700 28.6200, 77.2700 28.6050))'), 4326),
    'Yamuna river high flood discharge levels (Hathnikund barrage) and high-density weekend security check line bottlenecks'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, boundary = EXCLUDED.boundary;

-- =============================================================================
-- Migration Completed Successfully
-- =============================================================================
