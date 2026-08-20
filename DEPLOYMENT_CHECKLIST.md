# 🚀 SafeTrail AI: Production Deployment Checklist

### Target Architecture: Cloud Run / AWS ECS / Self-Hosted Docker Swarm

---

## 1. Environment Variables Configuration

Create a `.env` file in `apps/api/` based on the following template:

```ini
# Application Metadata
PROJECT_NAME="SafeTrail AI — Pan-India Tourist Safety & Smart Route Planner"
VERSION="2.0.0"
API_V1_STR="/api/v1"
ENVIRONMENT="production" # production | staging | development

# Database (PostgreSQL with PostGIS extension enabled)
# For production: postgresql+asyncpg://user:secure_password@postgis-db-host:5432/safetraildb
DATABASE_URL="sqlite+aiosqlite:///./safetrail.db"

# Redis Cache (Async Redis Cluster / Standalone)
# Note: If Redis is unavailable, SafeTrail automatically activates high-performance async in-memory fallback
REDIS_URL="redis://localhost:6379/0"

# External Geospatial & Routing APIs
OVERPASS_API_URL="https://overpass-api.de/api/interpreter"
OSRM_ROUTING_URL="https://router.project-osrm.org"
OPEN_METEO_URL="https://api.open-meteo.com/v1/forecast"
NOMINATIM_URL="https://nominatim.openstreetmap.org"

# AI / LLM Engine (Optional - system falls back to deterministic explainability)
GEMINI_API_KEY=""

# Security & Cryptography (MANDATORY IN PRODUCTION)
# Generate via: openssl rand -hex 32
JWT_SECRET="changeme_generate_64_character_cryptographic_random_hex_key"
FIREBASE_PROJECT_ID="safetrail-ai"

# Safety Defaults
DEFAULT_CURFEW_HOUR=18
RATE_LIMIT_REQUESTS_PER_MINUTE=60
```

---

## 2. PostgreSQL + PostGIS Setup (Production Database)

When deploying to a PostGIS-enabled database, run the initial schema and pilgrimage seed migrations:
```bash
# Apply initial schema & spatial indexing
psql -U postgres -d safetraildb -f apps/api/app/data/migrations/001_initial_postgis_schema.sql

# Apply 21-Destination Pilgrimage Dataset seed migration
psql -U postgres -d safetraildb -f apps/api/app/data/migrations/002_seed_pilgrimage_dataset.sql
```

The migration automatically creates `region_types`, `destinations`, `pilgrimage_metadata`, and `hazard_zones` with spatial `GIST` indexes.

---

## 3. Reverse Proxy & WebSocket Configuration (Nginx)

To ensure WebSockets (`/api/v1/ws/*`) and HTTP rate-limiting work seamlessly through Nginx / Cloudflare:

```nginx
upstream fastapi_backend {
    server 127.0.0.1:8000;
    keepalive 64;
}

server {
    listen 80;
    server_name safetrail.gov.in api.safetrail.gov.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.safetrail.gov.in;

    ssl_certificate /etc/letsencrypt/live/safetrail.gov.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/safetrail.gov.in/privkey.pem;

    # Gateway Timeout for Overpass / Nominatim
    proxy_connect_timeout 10s;
    proxy_read_timeout 60s;
    proxy_send_timeout 60s;

    # REST API endpoints
    location /api/ {
        proxy_pass http://fastapi_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket Real-Time Alert Mesh
    location /api/v1/ws/ {
        proxy_pass http://fastapi_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

---

## 4. Docker Containerization

### Dockerfile (Backend `apps/api/Dockerfile`):
```dockerfile
FROM python:3.11-slim

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends libgeos-dev gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### Dockerfile (Frontend `apps/web/Dockerfile`):
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 5. Pre-Deployment Verification Checklist

- [x] **Rate Limiting Activated**: `RateLimiterMiddleware` registered in `main.py`.
- [x] **Cryptographic Auth Validated**: `jwt.decode` enforces HMAC-SHA256 signature verification.
- [x] **Sovereign Boundary Enforcement**: Requests outside India rejected with HTTP 400.
- [x] **Dynamic Hazard Indexing**: Bounding-box queries index both pre-seeded catalog and dynamically geocoded hazards.
- [x] **Multi-Region Formulas Validated**: All 6 canonical regions (Hill, Coastal, Forest, Desert, Urban, Plains) tested with summing weight vectors.
- [x] **Pilgrimage Dataset & Circuits**: 21 destinations seeded across Char Dham, Chota Char Dham, 12 Jyotirlingas, and Prominent Shrines.
- [x] **IndexedDB & 2G GSM Fallback**: 140-char SMS payload generated; IndexedDB persists offline itinerary.
- [x] **Zero TypeScript Errors**: `npm run build` bundled successfully in <450ms.
- [x] **Automated Test Suite**: 53/53 unit, security, integration, and pilgrimage archetype tests passing.

