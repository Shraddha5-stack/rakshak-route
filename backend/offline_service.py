import json
from pathlib import Path


QUEUE_FILE = Path(__file__).parent / "offline_queue.json"


def save_offline_update(update):
    """Save a convoy update to the local offline queue."""
    updates = load_offline_updates()
    updates.append(update)

    QUEUE_FILE.parent.mkdir(parents=True, exist_ok=True)

    with QUEUE_FILE.open("w", encoding="utf-8") as file:
        json.dump(updates, file, indent=4)

    return {
        "status": "saved",
        "message": "Update stored locally for later synchronization",
        "queued_updates": len(updates),
    }


def load_offline_updates():
    """Load pending updates from the local JSON queue."""
    if not QUEUE_FILE.exists():
        return []

    with QUEUE_FILE.open("r", encoding="utf-8") as file:
        return json.load(file)


def synchronize_updates(is_online):
    """Synchronize queued updates when connectivity is available."""
    updates = load_offline_updates()

    if not is_online:
        return {
            "status": "offline",
            "synchronized": 0,
            "pending": len(updates),
            "message": "No network; updates remain queued",
        }

    if not updates:
        return {
            "status": "success",
            "synchronized": 0,
            "pending": 0,
            "message": "No pending updates to synchronize",
        }

    synchronized_count = len(updates)

    QUEUE_FILE.unlink(missing_ok=True)

    return {
        "status": "success",
        "synchronized": synchronized_count,
        "pending": 0,
        "message": "Queued updates synchronized in the simulation",
    }
