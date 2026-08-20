import json
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime
from datetime import datetime
from shapely.geometry import Polygon, Point, box
from app.core.config import settings

Base = declarative_base()

class RegionTypeModel(Base):
    """
    Modular Region Type Definition Model.
    """
    __tablename__ = "region_types"

    code = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    name_hi = Column(String(255), nullable=True)
    primary_hazards = Column(Text, nullable=False) # JSON or Comma-separated
    curfew_time = Column(String(32), default="18:00 IST")
    emergency_agency = Column(String(255), nullable=False)
    weights_json = Column(Text, nullable=False)
    risk_thresholds_json = Column(Text, nullable=False)
    advisories = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DestinationModel(Base):
    """
    Generic PostGIS-compatible Destination Reference Model.
    """
    __tablename__ = "destinations"

    id = Column(String(64), primary_key=True, index=True)
    canonical_name = Column(String(255), nullable=False, index=True)
    name_hi = Column(String(255), nullable=True)
    state_ut = Column(String(128), nullable=False, index=True)
    region_type = Column(String(64), nullable=False, index=True)
    elevation_m = Column(Integer, default=100)
    category = Column(String(64), default="general", index=True) # pilgrimage, adventure, wildlife, heritage
    description = Column(Text, nullable=True)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PilgrimageMetadataModel(Base):
    """
    Pilgrimage-Specific Metadata Model for Crowd & Festival Calendars.
    """
    __tablename__ = "pilgrimage_metadata"

    destination_id = Column(String(64), primary_key=True, index=True)
    circuits_json = Column(Text, default="[]") # e.g. ["Char Dham", "12 Jyotirlingas"]
    peak_seasons_json = Column(Text, default="[]") # Peak festival crowd multiplier calendar
    crowd_crush_risk_level = Column(String(32), default="MODERATE")
    historical_crowd_crush_incidents = Column(Text, nullable=True)
    mobility_tier = Column(String(64), default="PAVED_WALKWAY")
    physical_exertion_note = Column(Text, nullable=True)
    nearest_medical_infra_json = Column(Text, default="{}")
    security_screening_level = Column(String(32), default="STANDARD")
    connectivity_status = Column(String(64), default="STABLE_4G")

class HazardZoneModel(Base):
    """
    Generic PostGIS-compatible Hazard Zones Model.
    Supports bounding box spatial intersections ST_Intersects for ANY region in India.
    """
    __tablename__ = "hazard_zones"

    id = Column(String(64), primary_key=True, index=True)
    destination_id = Column(String(64), nullable=True, index=True)
    name = Column(String(255), nullable=False)
    name_hi = Column(String(255), nullable=True)
    category = Column(String(64), nullable=False) # LANDSLIDE, RIVER_FLOOD, CYCLONE_SURGE, FOREST_FIRE, HEATWAVE, CROWD_STAMPEDE
    severity = Column(String(32), nullable=False) # LOW, MODERATE, HIGH, CRITICAL
    region_type = Column(String(64), nullable=False) # HILL_MOUNTAIN, COASTAL_MARINE, etc.
    base_hazard_weight = Column(Float, default=0.75)
    polygon_geojson = Column(Text, nullable=False) # Serialized GeoJSON [[lon, lat], ...]
    min_lon = Column(Float, index=True)
    min_lat = Column(Float, index=True)
    max_lon = Column(Float, index=True)
    max_lat = Column(Float, index=True)
    historical_incident = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TripModel(Base):
    """
    Generic Active Trip Session Model for live background condition monitoring.
    """
    __tablename__ = "active_trips"

    id = Column(String(64), primary_key=True, index=True)
    destination_name = Column(String(255), nullable=False)
    region_type = Column(String(64), nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lon = Column(Float, nullable=False)
    current_risk_score = Column(Float, default=20.0)
    current_status = Column(String(32), default="ACTIVE") # ACTIVE, REROUTED, EMERGENCY
    last_checked_at = Column(DateTime, default=datetime.utcnow)
    itinerary_json = Column(Text, nullable=True)

# Engine & Session Factory
try:
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
except Exception:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
async_session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

# Spatial Bounding Box Query Engine
class SpatialHazardRepository:
    """
    Generic Spatial PostGIS Hazard Queries by Bounding Box.
    Works for any arbitrary coordinates in India.
    """
    _dynamic_hazards: List[Dict[str, Any]] = []

    @classmethod
    def register_hazard_zone(cls, hazard_zone: Dict[str, Any]):
        """
        Dynamically registers a new hazard zone into the spatial bounding-box index.
        """
        if not any(h.get("id") == hazard_zone.get("id") for h in cls._dynamic_hazards):
            cls._dynamic_hazards.append(hazard_zone)

    @classmethod
    async def query_hazards_by_bbox(
        cls,
        min_lon: float,
        min_lat: float,
        max_lon: float,
        max_lat: float
    ) -> List[Dict[str, Any]]:
        """
        Performs spatial intersection (ST_Intersects) between bounding box and hazard polygons.
        Supports both pre-seeded national datasets and dynamically geocoded hazards.
        """
        search_box = box(min_lon, min_lat, max_lon, max_lat)
        
        # Load from pre-seeded catalog + dynamically registered hazards
        from app.data.pan_india_dataset import PAN_INDIA_DESTINATIONS
        
        matched_hazards = []
        all_hazards = list(cls._dynamic_hazards)
        for dest in PAN_INDIA_DESTINATIONS:
            for hz in dest.get("hazard_zones", []):
                if not any(h.get("id") == hz.get("id") for h in all_hazards):
                    all_hazards.append(hz)

        for hz in all_hazards:
            coords = hz.get("polygon_coordinates", [])
            if len(coords) >= 3:
                poly = Polygon(coords)
                if poly.intersects(search_box):
                    matched_hazards.append(hz)
                    
        return matched_hazards

    @classmethod
    async def evaluate_point_in_hazards(
        cls,
        lat: float,
        lon: float,
        hazard_zones: List[Dict[str, Any]]
    ) -> Optional[Dict[str, Any]]:
        """
        Checks if a GPS point intersects any known active hazard polygon.
        """
        pt = Point(lon, lat)
        for hz in hazard_zones:
            poly = Polygon(hz["polygon_coordinates"])
            if poly.contains(pt) or poly.distance(pt) < 0.005: # ~500m buffer
                return hz
        return None
