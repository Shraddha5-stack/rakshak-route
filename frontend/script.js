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
document.addEventListener("DOMContentLoaded", () => {
    initializeDashboard();
    initializeOfflineUpdates();
});

// Offline queue API endpoint
const OFFLINE_UPDATES_URL = API_URL.replace(
    /\/api\/convoy\/?$/,
    "/api/offline/updates"
);

// Show a status message below the offline update form
function showOfflineFormMessage(message, isError = false) {
    const messageElement = document.getElementById("offline-form-message");

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;
    messageElement.style.color = isError ? "red" : "green";
}

// Load and display pending updates from the backend
async function loadOfflineQueue() {
    const countElement = document.getElementById("queue-count");
    const listElement = document.getElementById("offline-queue-list");

    if (!countElement || !listElement) {
        return;
    }

    countElement.textContent = "Loading pending updates...";

    try {
        const response = await fetch(OFFLINE_UPDATES_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        listElement.replaceChildren();

        countElement.textContent =
            `Pending updates: ${result.pending_count}`;

        if (result.updates.length === 0) {
            const item = document.createElement("li");
            item.textContent = "No pending updates.";
            listElement.appendChild(item);
            return;
        }

        result.updates.forEach((update) => {
            const item = document.createElement("li");

            const locationText = update.location
                ? ` | Location: ${update.location.latitude ?? "N/A"}, ${update.location.longitude ?? "N/A"}`
                : "";

            item.textContent =
                `${update.vehicle_id} | Fuel: ${update.fuel_level_percent ?? "N/A"}%` +
                ` | Oxygen: ${update.oxygen_level_percent ?? "N/A"}%` +
                ` | Emergency: ${update.emergency ? "YES" : "NO"}` +
                locationText;

            listElement.appendChild(item);
        });
    } catch (error) {
        console.error("Unable to load offline queue:", error);
        countElement.textContent =
            "Unable to load queue. Check the backend connection.";
    }
}

// Connect the offline update form to the backend
function initializeOfflineUpdates() {
    const form = document.getElementById("offline-update-form");
    const refreshButton = document.getElementById("refresh-queue");

    if (!form) {
        console.error("Offline update form was not found.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');

        const payload = {
            vehicle_id: document.getElementById("vehicle-id").value.trim(),
            fuel_level_percent: Number(
                document.getElementById("fuel-level").value
            ),
            oxygen_level_percent: Number(
                document.getElementById("oxygen-level").value
            ),
            emergency: document.getElementById("emergency").checked,
            data_type: "simulated"
        };

        if (!payload.vehicle_id) {
            showOfflineFormMessage("Vehicle ID is required.", true);
            return;
        }

        submitButton.disabled = true;
        showOfflineFormMessage("Saving update...");

        try {
            const response = await fetch(OFFLINE_UPDATES_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.detail
                        ? JSON.stringify(result.detail)
                        : `HTTP ${response.status}`
                );
            }

            showOfflineFormMessage(
                `Update saved successfully. Queued updates: ${result.queued_updates}`
            );

            await loadOfflineQueue();
        } catch (error) {
            console.error("Unable to save offline update:", error);

            showOfflineFormMessage(
                "Could not save update. Check the backend connection and try again.",
                true
            );
        } finally {
            submitButton.disabled = false;
        }
    });

    if (refreshButton) {
        refreshButton.addEventListener("click", loadOfflineQueue);
    }

    loadOfflineQueue();
}
