def generate_alerts(fuel_level_percent, oxygen_level_percent):
    alerts = []

    if fuel_level_percent <= 20:
        alerts.append({
            "type": "LOW_FUEL",
            "message": "Fuel level is low",
            "severity": "warning",
        })

    if oxygen_level_percent <= 90:
        alerts.append({
            "type": "LOW_OXYGEN_READING",
            "message": "Simulated oxygen reading is low",
            "severity": "warning",
        })

    if not alerts:
        alerts.append({
            "type": "NO_ALERT",
            "message": "No alerts detected",
            "severity": "info",
        })

    return alerts
