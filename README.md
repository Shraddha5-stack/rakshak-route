# Rakshak-Route

**Resilient Convoy Tracking for Low-Connectivity Environments**

## Overview

Rakshak-Route is an educational prototype designed to explore convoy
tracking and vehicle safety in areas with unreliable internet connectivity.

## Problem

Unreliable network connectivity can make remote vehicle monitoring difficult.
This project explores ways to collect and synchronize vehicle telemetry
when internet access is unavailable.

## Planned Features

- Simulated vehicle location tracking
- Vehicle fuel status monitoring
- Simulated health and oxygen readings
- Emergency alerts
- Local data storage during network outages
- Data synchronization after connectivity returns
- Web-based monitoring dashboard
- Docker packaging
- AWS Elastic Beanstalk deployment
- Amazon SQS integration

## Technology Stack

- Python
- FastAPI
- HTML, CSS and JavaScript
- Git and GitHub
- Docker
- AWS Elastic Beanstalk
- Amazon SQS

## Project Status

Day 1: Initial project structure and Python environment created.

## Disclaimer

This is an educational prototype. Location, health readings, and
connectivity failures will initially be simulated. It is not an
operational military tracking or medical monitoring system.

## Current Implementation Status

Rakshak-Route is an educational prototype built with FastAPI, HTML, CSS,
JavaScript, Docker, and Docker Compose.

Implemented capabilities include:

- Simulated convoy telemetry API
- Fuel and oxygen threshold-based alerts
- Offline convoy updates stored in a JSON queue
- API endpoints to submit and retrieve pending updates
- Docker Compose services for the frontend and backend
- Persistent offline queue using a Docker named volume
- Automated API tests

## Docker Persistence Verification

The backend was recreated using:

`docker compose up -d --force-recreate backend`

After recreation, the backend health endpoint returned a healthy status,
and the previously queued simulated convoy update remained available.

Verified demonstration data:

- Vehicle ID: `CONVOY-DOCKER-001`
- Fuel level: 75%
- Oxygen level: 94%
- Emergency: false

The queue is stored in the Docker named volume
`rakshak-route_offline_queue_data`.

The automated test suite previously completed with 19 passing tests.

Run tests from the project root:

`PYTHONPATH=. python -m pytest -q`

## Future Enhancements

- AWS Elastic Beanstalk deployment
- Amazon SQS integration
- Improved frontend integration for offline updates
- Better error handling, logging, and monitoring
- Additional deployment and recovery testing

## Disclaimer

This is an educational prototype. Vehicle locations, telemetry, and
connectivity scenarios are simulated. The synchronization workflow is
currently a simulation and does not demonstrate verified delivery to a
remote system.

This project is not an operational military tracking or medical
monitoring system.
