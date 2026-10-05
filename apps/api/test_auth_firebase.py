import pytest
import jwt
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_guest_session_creation():
    """Verify quick guest session generation for emergency/offline access"""
    response = client.post("/api/v1/auth/guest-session", json={"phone": "+919876543210", "name": "Arnav Test"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["is_guest"] is True
    assert data["user"]["name"] == "Arnav Test"

def test_unauthenticated_me_defaults_to_guest():
    """Verify unauthenticated requests gracefully default to a guest session"""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "guest"
    assert data["user"]["is_guest"] is True

def test_authenticated_me_with_guest_bearer():
    """Verify guest bearer token authentication"""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer guest_9876543210"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "guest"
    assert data["user"]["uid"] == "guest_9876543210"

def test_authenticated_me_with_hmac_jwt():
    """Verify HMAC JWT token authentication for local/test tokens"""
    token = jwt.encode(
        {"sub": "usr_9988", "name": "Kedarnath Trekker", "email": "trekker@ignite.in"},
        settings.JWT_SECRET,
        algorithm="HS256"
    )
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "authenticated"
    assert data["user"]["uid"] == "usr_9988"
    assert data["user"]["email"] == "trekker@ignite.in"

def test_sync_user_endpoint():
    """Verify user session sync endpoint"""
    token = jwt.encode(
        {"sub": "usr_sync_01", "name": "Sync User", "email": "sync@ignite.in"},
        settings.JWT_SECRET,
        algorithm="HS256"
    )
    response = client.post(
        "/api/v1/auth/sync",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "synced"
    assert data["authenticated"] is True
    assert data["user"]["uid"] == "usr_sync_01"

def test_invalid_token_returns_401():
    """Verify malformed or invalid token returns 401 unauthorized"""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid_malformed_token_xyz"}
    )
    assert response.status_code == 401
