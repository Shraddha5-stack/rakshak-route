from fastapi import FastAPI

app = FastAPI(
    title="Rakshak-Route API",
    description="Prototype API for low-connectivity convoy monitoring",
    version="0.2.0",
)


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
    return {
        "vehicle_id": "CONVOY-001",
        "location": {
            "latitude": 34.1526,
            "longitude": 77.5771,
        },
        "fuel_level_percent": 78,
        "oxygen_level_percent": 96,
        "emergency": False,
        "data_type": "simulated",
    }
