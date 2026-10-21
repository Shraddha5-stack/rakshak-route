from backend.alert_service import generate_alerts


def test_low_fuel_generates_warning():
    alerts = generate_alerts(20, 95)

    assert any(alert["type"] == "LOW_FUEL" for alert in alerts)


def test_low_oxygen_generates_warning():
    alerts = generate_alerts(75, 90)

    assert any(
        alert["type"] == "LOW_OXYGEN_READING"
        for alert in alerts
    )


def test_normal_readings_generate_no_alert():
    alerts = generate_alerts(78, 96)

    assert len(alerts) == 1
    assert alerts[0]["type"] == "NO_ALERT"


def test_both_low_readings_generate_both_alerts():
    alerts = generate_alerts(15, 85)

    alert_types = {alert["type"] for alert in alerts}

    assert "LOW_FUEL" in alert_types
    assert "LOW_OXYGEN_READING" in alert_types
