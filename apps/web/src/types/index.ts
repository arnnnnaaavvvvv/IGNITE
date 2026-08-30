export type RegionType = 'HILL_MOUNTAIN' | 'COASTAL_MARINE' | 'FOREST_WILDLIFE' | 'DESERT_ARID' | 'URBAN_HERITAGE' | 'PLAINS_RIVERINE';

export interface PilgrimageMetadata {
  circuits: string[];
  peak_seasons: Array<{ name: string; crowd_multiplier: number }>;
  crowd_crush_risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  historical_crowd_crush_incidents?: string;
  mobility_tier: 'PAVED_WALKWAY' | 'MODERATE_INCLINE' | 'STEEP_TREK_STAIRS' | 'HIGH_ALTITUDE_TREK';
  physical_exertion_note?: string;
  nearest_medical_infra?: {
    hospital_name: string;
    distance_km: number;
    has_oxygen_bank?: boolean;
    emergency_helipad?: string;
  };
  security_screening_level?: 'STANDARD' | 'ELEVATED' | 'BIOMETRIC_HOLDING';
  connectivity_status?: string;
}

export interface PilgrimageCircuit {
  id: string;
  name: string;
  name_hi?: string;
  description: string;
  icon: string;
  destinations: string[];
  destination_records?: DestinationSearchResult[];
}

export interface TravelCategory {
  id: string;
  name: string;
  name_hi?: string;
  icon: string;
  description: string;
  destination_ids?: string[];
  destinations?: DestinationSearchResult[];
}


export interface Checkpoint {
  id: string;
  name: string;
  name_hi?: string;
  lat: number;
  lon: number;
  altitude_m: number;
  type?: string;
  facilities: string[];
  nearest_sdrf_dist_km?: number;
  nearest_hospital_dist_km?: number;
  has_oxygen_booth?: boolean;
  has_helipad?: boolean;
  sub_scores?: SubScores;
  total_risk_score?: number;
}

export interface HazardZone {
  id: string;
  name: string;
  name_hi?: string;
  category: string;
  severity: string;
  base_hazard_weight: number;
  polygon_coordinates: [number, number][]; // [lon, lat]
  historical_incident: string;
  recommended_safe_bypass_trail?: string;
}

export interface EmergencyShelter {
  id: string;
  name: string;
  lat: number;
  lon: number;
  capacity_persons?: number;
  has_backup_power?: boolean;
  has_food_stock?: boolean;
  contact_phone?: string;
  distance_m?: number;
  distance_km?: number;
}

export interface SubScoreFactor {
  score: number;
  label: string;
  details: string;
}

export interface SubScores {
  [key: string]: SubScoreFactor;
}

export interface ItineraryItem {
  sequence: number;
  checkpoint_id: string;
  name: string;
  name_hi?: string;
  altitude_m: number;
  lat: number;
  lon: number;
  facilities: string[];
  has_oxygen_booth: boolean;
  total_risk_score: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  badge_color: string;
  sub_scores: SubScores;
  reroute_needed: boolean;
  opening_hours?: string;
  opening_hours_hi?: string;
  best_view_time?: string;
  best_view_time_hi?: string;
  best_view_tip?: string;
  best_view_tip_hi?: string;
  why_visit?: string;
  why_visit_hi?: string;
}

export interface DayPlan {
  day_number: number;
  date?: string;
  date_display?: string;
  title: string;
  title_hi?: string;
  distance_km: number;
  elevation_gain_m: number;
  acclimatization_safety: string;
  day_highlight?: string;
  day_highlight_hi?: string;
  checkpoints: ItineraryItem[];
  day_risk_score: number;
  traffic_level?: 'LOW' | 'MODERATE' | 'HIGH';
  traffic_summary?: string;
  traffic_summary_hi?: string;
  suggested_route?: string;
  suggested_route_hi?: string;
  alternate_route?: string;
  alternate_route_hi?: string;
  is_alternate_recommended?: boolean;
}

export interface BudgetBreakdown {
  tier: string;
  total_budget_inr: number;
  allocated_total_inr: number;
  remaining_balance_inr: number;
  categories: {
    [key: string]: number;
  };
}

export interface ItineraryResponse {
  destination_id: string;
  destination: string;
  state_ut: string;
  region_type: RegionType;
  region_name: string;
  category?: string;
  emergency_agency: string;
  duration_days: number;
  start_date?: string;
  end_date?: string;
  fitness_level: string;
  overall_safety_score: number;
  overall_risk_category: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  budget_breakdown: BudgetBreakdown;
  days: DayPlan[];
  mandatory_safety_advisories: string[];
  trail_coords: [number, number, number?][];
  bypass_coords: [number, number, number?][];
  hazard_zones: HazardZone[];
  shelters: EmergencyShelter[];
  pilgrimage_metadata?: PilgrimageMetadata;
  explainability: {
    summary_text: string;
    overall_score: number;
    region_type: string;
    emergency_agency: string;
    key_positives: string[];
    watchpoints: string[];
  };
}

export interface DestinationSearchResult {
  id: string;
  canonical_name: string;
  name_hi?: string;
  state_ut: string;
  region_type: RegionType;
  region_name: string;
  category?: string;
  elevation_m: number;
  lat?: number;
  lon?: number;
  pilgrimage_metadata?: PilgrimageMetadata;
}

export interface IncidentHistoryRecord {
  id: string;
  year_or_date: string;
  title: string;
  title_hi?: string;
  category: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | string;
  description: string;
  description_hi?: string;
  mitigation_taken: string;
  mitigation_taken_hi?: string;
  reporting_agency: string;
}

export interface NationalDisasterBulletin {
  id: string;
  agency: string;
  badge_color: string;
  headline: string;
  headline_hi?: string;
  impact_regions: string[];
  severity: 'INFO' | 'ORANGE' | 'RED' | string;
  timestamp: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  title_hi?: string;
  destination_match: string;
  zone_name?: string;
  region_type: string;
  description: string;
  description_hi?: string;
  weather: {
    precipitation_mm_hr: number;
    wind_speed_kmh: number;
    temperature_c: number;
    visibility_km: number;
    imd_alert: string;
  };
  hazard_active: boolean;
  expected_risk_category: string;
  primary_agency?: string;
  evacuation_target?: string;
}

export interface SimulationResponse {
  is_pan_india: boolean;
  destination?: string;
  destination_id?: string;
  state_ut?: string;
  region_type?: RegionType | string;
  region_name?: string;
  elevation_m?: number;
  emergency_agency?: string;
  emergency_helplines?: Array<{ label: string; number: string }>;
  scenarios: SimulationScenario[];
  incident_history?: IncidentHistoryRecord[];
  active_hazard_zones?: HazardZone[];
  shelters?: EmergencyShelter[];
  national_disaster_bulletins?: NationalDisasterBulletin[];
  pan_india_zones_summary?: {
    total_active_scenarios: number;
    critical_alerts: number;
    high_alerts: number;
    monitoring_agencies: string[];
  };
}

export interface SOSDispatch {
  sos_id: string;
  timestamp_utc: string;
  status: string;
  priority: string;
  victim: {
    name: string;
    phone: string;
    battery: string;
    medical_conditions: string;
  };
  telemetry: {
    latitude: number;
    longitude: number;
    altitude_m: number;
    gps_accuracy_m: number;
  };
  nearest_rescue_post: EmergencyShelter;
  assigned_units: Array<{ unit: string; channel: string; status: string }>;
  sms_fallback_string: string;
}
