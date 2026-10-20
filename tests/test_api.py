import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend import offline_service

client = TestClient(app)


@pytest.fixture(autouse=True)
def temporary_offline_queue(tmp_path, monkeypatch):
    """Keep API tests isolated from the real offline queue."""
    queue_file = tmp_path / "offline_queue.json"
    monkeypatch.setattr(offline_service, "QUEUE_FILE", queue_file)


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


def test_create_offline_update():
    payload = {
        "vehicle_id": "CONVOY-TEST-001",
        "location": {
            "latitude": 34.1526,
            "longitude": 77.5771,
        },
        "fuel_level_percent": 75,
        "oxygen_level_percent": 95,
        "emergency": False,
        "data_type": "simulated",
    }

    response = client.post("/api/offline/updates", json=payload)

    assert response.status_code == 201
    assert response.json()["status"] == "saved"
    assert response.json()["queued_updates"] == 1


def test_get_offline_updates():
    payload = {
        "vehicle_id": "CONVOY-TEST-002",
        "fuel_level_percent": 70,
        "oxygen_level_percent": 94,
    }

    client.post("/api/offline/updates", json=payload)

    response = client.get("/api/offline/updates")

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["pending_count"] == 1
    assert response.json()["updates"][0]["vehicle_id"] == "CONVOY-TEST-002"


def test_offline_synchronization_keeps_updates_queued():
    payload = {
        "vehicle_id": "CONVOY-TEST-003",
        "fuel_level_percent": 65,
        "oxygen_level_percent": 92,
    }

    client.post("/api/offline/updates", json=payload)

    response = client.post(
        "/api/offline/synchronize",
        json={"is_online": False},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "offline"
    assert response.json()["synchronized"] == 0
    assert response.json()["pending"] == 1

    queue_response = client.get("/api/offline/updates")
    assert queue_response.json()["pending_count"] == 1


def test_online_synchronization_clears_simulated_queue():
    payload = {
        "vehicle_id": "CONVOY-TEST-004",
        "fuel_level_percent": 60,
        "oxygen_level_percent": 91,
    }

    client.post("/api/offline/updates", json=payload)

    response = client.post(
        "/api/offline/synchronize",
        json={"is_online": True},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["synchronized"] == 1
    assert response.json()["pending"] == 0

    queue_response = client.get("/api/offline/updates")
    assert queue_response.json()["pending_count"] == 0


@pytest.mark.parametrize(
    "field,value",
    [
        ("fuel_level_percent", 101),
        ("fuel_level_percent", -1),
        ("oxygen_level_percent", 101),
        ("oxygen_level_percent", -1),
    ],
)
def test_invalid_telemetry_values_are_rejected(field, value):
    payload = {
        "vehicle_id": "CONVOY-INVALID-001",
        field: value,
    }

    response = client.post("/api/offline/updates", json=payload)

    assert response.status_code == 422
