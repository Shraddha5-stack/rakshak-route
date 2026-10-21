# Rakshak-Route

**Resilient Convoy Tracking for Low-Connectivity Environments**

Rakshak-Route is an educational prototype exploring simulated convoy
tracking and offline data handling in areas with unreliable internet
connectivity.

## Problem Statement

Unreliable network connectivity can interrupt vehicle monitoring.
This project demonstrates how simulated telemetry updates can be stored
locally and processed through a synchronization workflow.

## Implemented Features

- FastAPI backend for simulated convoy telemetry.
- Web dashboard using HTML, CSS, and JavaScript.
- Simulated fuel and oxygen readings.
- Threshold-based alerts.
- Emergency status support.
- Offline update submission through a web form.
- API endpoints to add and retrieve queued updates.
- JSON-based offline queue.
- Docker Compose frontend and backend services.
- Persistent queue storage using a Docker named volume.
- Simulated offline and online synchronization.
- Automated API tests.

## Technology Stack

- Python
- FastAPI
- HTML, CSS, JavaScript
- Docker and Docker Compose
- Git and GitHub
- Pytest

## Architecture

The frontend communicates with the FastAPI backend over HTTP.

The backend provides convoy telemetry and offline update endpoints.
Pending updates are stored in a JSON queue. Docker Compose uses a named
volume to preserve queue data when the backend container is recreated.

The synchronization endpoint demonstrates offline and online behavior.
It does not verify delivery to a remote server.

## Run the Project

Clone the repository:

```bash
git clone https://github.com/Shraddha5-stack/rakshak-route.git
cd rakshak-route
```

Start the application with Docker Compose:

```bash
docker compose up -d --build
```

Open the dashboard:

http://127.0.0.1:5500

Check backend health:

http://127.0.0.1:8000/health

Stop the containers without deleting persistent queue data:

```bash
docker compose down
```

**Important:** Avoid `docker compose down -v` if you want to preserve
the named volume containing queued updates.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check backend health |
| GET | `/api/convoy` | Retrieve simulated convoy telemetry |
| POST | `/api/offline/updates` | Submit a simulated offline update |
| GET | `/api/offline/updates` | Retrieve pending updates |
| POST | `/api/offline/synchronize` | Run the synchronization simulation |

Check the pending update queue:

```bash
curl -s http://127.0.0.1:8000/api/offline/updates | python3 -m json.tool
```

Simulate synchronization while offline:

```bash
curl -s -X POST http://127.0.0.1:8000/api/offline/synchronize \
  -H "Content-Type: application/json" \
  -d '{"is_online": false}'
```

Simulate synchronization while online:

```bash
curl -s -X POST http://127.0.0.1:8000/api/offline/synchronize \
  -H "Content-Type: application/json" \
  -d '{"is_online": true}'
```

The online simulation may clear the local queue. Use test data when
demonstrating this workflow.

## Testing

Activate the virtual environment and run the tests:

```bash
source .venv/bin/activate
PYTHONPATH=. python -m pytest -q
```

The latest recorded test run passed **19 tests**, with one
Starlette deprecation warning.

## Persistence Verification

The backend was recreated using:

```bash
docker compose up -d --force-recreate backend
```

After recreation, the backend health endpoint returned a healthy status
and previously queued simulated data remained available.

The Docker named volume is:

`rakshak-route_offline_queue_data`

## Current Limitations

- Vehicle locations and telemetry are simulated.
- Emergency and health readings are demonstration data.
- Synchronization is simulated and does not verify remote delivery.
- AWS Elastic Beanstalk deployment is not implemented yet.
- Amazon SQS integration is not implemented yet.
- This project is not intended for operational military tracking or
  medical monitoring.

## Future Enhancements

- AWS Elastic Beanstalk deployment.
- Amazon SQS integration.
- Improved error handling and logging.
- Additional synchronization and recovery tests.
- Further frontend accessibility improvements.

## Disclaimer

Rakshak-Route is an educational prototype. It is not an operational
military tracking or medical monitoring system.
