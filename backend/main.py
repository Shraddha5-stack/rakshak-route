from fastapi import FastAPI

app = FastAPI(
    title="Rakshak-Route API",
    description="Prototype API for low-connectivity convoy monitoring",
    version="0.1.0",
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
