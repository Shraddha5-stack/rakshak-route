import json

from backend import offline_service


def test_save_offline_update(tmp_path, monkeypatch):
    queue_file = tmp_path / "offline_queue.json"
    monkeypatch.setattr(offline_service, "QUEUE_FILE", queue_file)

    update = {
        "vehicle_id": "CONVOY-001",
        "fuel_level_percent": 78,
        "data_type": "simulated",
    }

    result = offline_service.save_offline_update(update)

    assert result["status"] == "saved"
    assert result["queued_updates"] == 1

    saved_updates = json.loads(queue_file.read_text(encoding="utf-8"))
    assert saved_updates == [update]


def test_updates_remain_queued_when_offline(tmp_path, monkeypatch):
    queue_file = tmp_path / "offline_queue.json"
    monkeypatch.setattr(offline_service, "QUEUE_FILE", queue_file)

    offline_service.save_offline_update({
        "vehicle_id": "CONVOY-001",
        "data_type": "simulated",
    })

    result = offline_service.synchronize_updates(is_online=False)

    assert result["status"] == "offline"
    assert result["synchronized"] == 0
    assert result["pending"] == 1
    assert queue_file.exists()


def test_synchronize_queued_updates_when_online(tmp_path, monkeypatch):
    queue_file = tmp_path / "offline_queue.json"
    monkeypatch.setattr(offline_service, "QUEUE_FILE", queue_file)

    offline_service.save_offline_update({
        "vehicle_id": "CONVOY-001",
        "data_type": "simulated",
    })
    offline_service.save_offline_update({
        "vehicle_id": "CONVOY-002",
        "data_type": "simulated",
    })

    result = offline_service.synchronize_updates(is_online=True)

    assert result["status"] == "success"
    assert result["synchronized"] == 2
    assert result["pending"] == 0
    assert not queue_file.exists()


def test_synchronize_empty_queue(tmp_path, monkeypatch):
    queue_file = tmp_path / "offline_queue.json"
    monkeypatch.setattr(offline_service, "QUEUE_FILE", queue_file)

    result = offline_service.synchronize_updates(is_online=True)

    assert result["status"] == "success"
    assert result["synchronized"] == 0
    assert result["pending"] == 0
