from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.alert_service import generate_alerts
from backend import offline_service


app = FastAPI(
    title="Rakshak-Route API",
    description="Prototype API for low-connectivity convoy monitoring",
    version="0.3.0",
)


# Allow the local frontend to access the backend API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class OfflineUpdate(BaseModel):
    """Validated telemetry payload for the educational prototype."""

    vehicle_id: str = Field(min_length=1, max_length=64)
    location: dict[str, float] | None = None
    fuel_level_percent: int | None = Field(default=None, ge=0, le=100)
    oxygen_level_percent: int | None = Field(default=None, ge=0, le=100)
    emergency: bool = False
    data_type: Literal["simulated"] = "simulated"


class SynchronizeRequest(BaseModel):
    """Request to simulate connectivity restoration."""

    is_online: bool


@app.get("/")
def home():
    return {
        "project": "Rakshak-Route",
        "status": "running",
        "message": "Convoy monitoring API is ready",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "environment": "development",
    }


@app.get("/api/convoy")
def get_convoy_status():
    fuel_level = 78
    oxygen_level = 96

    alerts = generate_alerts(
        fuel_level_percent=fuel_level,
        oxygen_level_percent=oxygen_level,
    )

    return {
        "vehicle_id": "CONVOY-001",
        "location": {
            "latitude": 34.1526,
            "longitude": 77.5771,
        },
        "fuel_level_percent": fuel_level,
        "oxygen_level_percent": oxygen_level,
        "emergency": False,
        "data_type": "simulated",
        "alerts": alerts,
    }


@app.post("/api/offline/updates", status_code=201)
def create_offline_update(update: OfflineUpdate):
    """Store a simulated convoy update in the local offline queue."""

    update_data = update.model_dump(exclude_none=True)
    return offline_service.save_offline_update(update_data)


@app.get("/api/offline/updates")
def get_offline_updates():
    """Return updates waiting in the local queue."""

    updates = offline_service.load_offline_updates()

    return {
        "status": "success",
        "pending_count": len(updates),
        "updates": updates,
    }


@app.post("/api/offline/synchronize")
def synchronize_offline_updates(request: SynchronizeRequest):
    """Run the project's simulated synchronization workflow."""

    return offline_service.synchronize_updates(
        is_online=request.is_online
    )
