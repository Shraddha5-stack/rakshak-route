"use strict";

// Rakshak-Route dashboard
// Educational prototype: all readings are simulated.

const convoyData = {
    vehicle_id: "CONVOY-001",

    location: {
        latitude: 34.1526,
        longitude: 77.5771
    },

    fuel_level_percent: 78,
    oxygen_level_percent: 96,

    data_type: "simulated"
};


// Display convoy information
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

    oxygenValue.textContent = `${data.oxygen_level_percent}%`;
    oxygenBar.style.width = `${data.oxygen_level_percent}%`;

    latitude.textContent = data.location.latitude;
    longitude.textContent = data.location.longitude;

    displayAlerts(data);
}


// Generate alerts using illustrative thresholds
function generateAlerts(data) {
    const alerts = [];

    if (data.fuel_level_percent <= 20) {
        alerts.push({
            type: "LOW_FUEL",
            message: "Fuel level is low.",
            severity: "warning"
        });
    }

    if (data.oxygen_level_percent <= 90) {
        alerts.push({
            type: "LOW_OXYGEN_READING",
            message: "Simulated oxygen reading is low.",
            severity: "warning"
        });
    }

    if (alerts.length === 0) {
        alerts.push({
            type: "NO_ALERT",
            message: "No alerts detected in the simulated readings.",
            severity: "info"
        });
    }

    return alerts;
}


// Display generated alerts
function displayAlerts(data) {
    const alertList = document.getElementById("alertList");

    if (!alertList) {
        console.error("Alert container was not found.");
        return;
    }

    const alerts = generateAlerts(data);

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


// Initialize the dashboard
function initializeDashboard() {
    displayConvoyData(convoyData);
    updateConnectivityStatus();

    window.addEventListener("online", updateConnectivityStatus);
    window.addEventListener("offline", updateConnectivityStatus);

    console.log("Rakshak-Route dashboard initialized.");
    console.log("Data type:", convoyData.data_type);
}


// Start when the HTML document is ready
document.addEventListener("DOMContentLoaded", initializeDashboard);
