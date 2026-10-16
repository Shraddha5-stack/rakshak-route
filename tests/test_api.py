from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_home_endpoint():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["project"] == "Rakshak-Route"
    assert response.json()["status"] == "running"


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_convoy_endpoint():
    response = client.get("/api/convoy")

    assert response.status_code == 200

    data = response.json()

    assert data["vehicle_id"] == "CONVOY-001"
    assert data["fuel_level_percent"] == 78
    assert data["oxygen_level_percent"] == 96
    assert data["emergency"] is False
    assert data["data_type"] == "simulated"
