# IGNITE — System Architecture

IGNITE is an AI-powered tourist safety and dynamic route planning system designed for high reliability and explainable risk mitigation across Indian tourist corridors.

```mermaid
graph TD
    Client[Next.js 14 Web / Mobile Client] -->|Geo-coordinates & Preferences| API[FastAPI Gateway]
    API --> Weather[Open-Meteo & Meteorological Telemetry]
    API --> Density[Crowd Density & Terrain Hazard Sensors]
    API --> DB[(PostgreSQL + PostGIS Spatial DB)]
    
    subgraph Core Safety & Pathing Engine
        API --> RiskEngine[Deterministic Risk Scoring AST]
        RiskEngine --> ReRoute[Dynamic Pathing & Safe Itinerary Generator]
        RiskEngine --> GeoFence[Active Geo-fencing & SOS Alerting]
    end
    
    ReRoute -->|Explainable Risk-Scored Route| Client
```

## Architectural Highlights
- **Deterministic Risk AST**: Computes dynamic safety weights using multi-factor telemetry without black-box hallucinations.
- **PostGIS Spatial Partitioning**: Sub-millisecond geographic proximity indexing for emergency services and danger zones.
- **Dynamic Re-Routing**: Real-time itinerary recalculation triggered by live weather fluctuations or crowd surges.
