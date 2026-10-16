from backend.alert_service import generate_alerts


def test_normal_readings():
    alerts = generate_alerts(
        fuel_level_percent=78,
        oxygen_level_percent=96,
    )

    assert len(alerts) == 1
    assert alerts[0]["type"] == "NO_ALERT"


def test_low_fuel_alert():
    alerts = generate_alerts(
        fuel_level_percent=15,
        oxygen_level_percent=96,
    )

    assert len(alerts) == 1
    assert alerts[0]["type"] == "LOW_FUEL"


def test_low_oxygen_reading_alert():
    alerts = generate_alerts(
        fuel_level_percent=78,
        oxygen_level_percent=85,
    )

    assert len(alerts) == 1
    assert alerts[0]["type"] == "LOW_OXYGEN_READING"


def test_both_alerts():
    alerts = generate_alerts(
        fuel_level_percent=15,
        oxygen_level_percent=85,
    )

    alert_types = [alert["type"] for alert in alerts]

    assert "LOW_FUEL" in alert_types
    assert "LOW_OXYGEN_READING" in alert_types
    assert len(alerts) == 2
