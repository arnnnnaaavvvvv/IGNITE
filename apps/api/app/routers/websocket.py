import json
import asyncio
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["Real-time WebSocket Alert Mesh"])

class WebSocketConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, trip_id: str, websocket: WebSocket):
        await websocket.accept()
        if trip_id not in self.active_connections:
            self.active_connections[trip_id] = []
        self.active_connections[trip_id].append(websocket)
        print(f"[WebSocket] Client connected to trip mesh channel: {trip_id}")

    def disconnect(self, trip_id: str, websocket: WebSocket):
        if trip_id in self.active_connections:
            if websocket in self.active_connections[trip_id]:
                self.active_connections[trip_id].remove(websocket)
            if not self.active_connections[trip_id]:
                del self.active_connections[trip_id]

    async def broadcast_alert(self, trip_id: str, alert_payload: dict):
        targets = self.active_connections.get(trip_id, [])
        # Also broadcast to global channel if exists
        targets = targets + self.active_connections.get("global", [])
        
        dead_connections = []
        for ws in set(targets):
            try:
                await ws.send_text(json.dumps(alert_payload))
            except Exception:
                dead_connections.append(ws)

        for dead in dead_connections:
            for ch in list(self.active_connections.keys()):
                if dead in self.active_connections[ch]:
                    self.active_connections[ch].remove(dead)

ws_manager = WebSocketConnectionManager()

@router.websocket("/alerts/{trip_id}")
async def websocket_alert_endpoint(websocket: WebSocket, trip_id: str):
    await ws_manager.connect(trip_id, websocket)
    try:
        # Send initial confirmation handshake
        await websocket.send_text(json.dumps({
            "type": "CONNECTION_ESTABLISHED",
            "trip_id": trip_id,
            "channel": f"mesh_{trip_id}",
            "status": "LISTENING_LIVE_HAZARD_TELEMETRY"
        }))
        while True:
            # Keep-alive heartbeat listener
            data = await websocket.receive_text()
            # Echo heartbeat
            await websocket.send_text(json.dumps({
                "type": "HEARTBEAT_ACK",
                "received": data
            }))
    except WebSocketDisconnect:
        ws_manager.disconnect(trip_id, websocket)
        print(f"[WebSocket] Client disconnected from channel: {trip_id}")
    except Exception as e:
        ws_manager.disconnect(trip_id, websocket)
        print(f"[WebSocket] Channel exception: {e}")
