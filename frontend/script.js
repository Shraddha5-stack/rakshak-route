"use strict";

// Rakshak-Route dashboard
// Educational prototype: all readings are simulated.

const API_URL = window.RAKSHAK_API_URL || "http://127.0.0.1:8000/api/convoy";

// Display convoy information received from the API
function displayConvoyData(data) {
    const vehicleId = document.getElementById("vehicleId");
    const fuelValue = document.getElementById("fuelValue");
    const oxygenValue = document.getElementById("oxygenValue");
    const fuelBar = document.getElementById("fuelBar");
    const oxygenBar = document.getElementById("oxygenBar");
    const latitude = document.getElementById("latitude");
    const longitude = document.getElementById("longitude");

    if (
        !vehicleId ||
        !fuelValue ||
        !oxygenValue ||
        !fuelBar ||
        !oxygenBar ||
        !latitude ||
        !longitude
    ) {
        console.error("Dashboard HTML elements are missing.");
        return;
    }

    vehicleId.textContent = data.vehicle_id;

    fuelValue.textContent = `${data.fuel_level_percent}%`;
    fuelBar.style.width = `${data.fuel_level_percent}%`;
    fuelBar.setAttribute("aria-valuenow", data.fuel_level_percent);

    oxygenValue.textContent = `${data.oxygen_level_percent}%`;
    oxygenBar.style.width = `${data.oxygen_level_percent}%`;
    oxygenBar.setAttribute("aria-valuenow", data.oxygen_level_percent);

    latitude.textContent = data.location.latitude;
    longitude.textContent = data.location.longitude;

    displayAlerts(data.alerts || []);
}

// Display alerts received from the backend API
function displayAlerts(alerts) {
    const alertList = document.getElementById("alertList");

    if (!alertList) {
        console.error("Alert container was not found.");
        return;
    }

    alertList.replaceChildren();

    alerts.forEach((alert) => {
        const item = document.createElement("p");

        item.className = "alert-item";

        if (alert.severity === "warning") {
            item.classList.add("warning");
        }

        item.textContent = `${alert.type}: ${alert.message}`;
        alertList.appendChild(item);
    });

    if (alerts.length === 0) {
        const item = document.createElement("p");
        item.className = "alert-item";
        item.textContent = "No alerts available.";
        alertList.appendChild(item);
    }
}

// Display browser connectivity for demonstration only
function updateConnectivityStatus() {
    const connectionText = document.getElementById("connectionText");
    const networkState = document.getElementById("networkState");

    if (!connectionText || !networkState) {
        return;
    }

    if (navigator.onLine) {
        connectionText.textContent = "BROWSER ONLINE";
        networkState.textContent = "BROWSER ONLINE";
    } else {
        connectionText.textContent = "BROWSER OFFLINE";
        networkState.textContent = "BROWSER OFFLINE";
    }
}

// Fetch live API response and initialize the dashboard
async function initializeDashboard() {
    updateConnectivityStatus();

    window.addEventListener("online", updateConnectivityStatus);
    window.addEventListener("offline", updateConnectivityStatus);

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`API request failed: HTTP ${response.status}`);
        }

        const convoyData = await response.json();

        displayConvoyData(convoyData);

        console.log("Rakshak-Route dashboard initialized.");
        console.log("API data received:", convoyData);
        console.log("Data type:", convoyData.data_type);
    } catch (error) {
        console.error("Unable to load convoy data:", error);

        const alertList = document.getElementById("alertList");

        if (alertList) {
            alertList.replaceChildren();

            const item = document.createElement("p");
            item.className = "alert-item warning";
            item.textContent =
                "Unable to load convoy data. Check the API server and connection.";

            alertList.appendChild(item);
        }
    }
}

// Start when the HTML document is ready
document.addEventListener("DOMContentLoaded", initializeDashboard);
