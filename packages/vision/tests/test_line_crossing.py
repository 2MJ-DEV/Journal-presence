from datetime import datetime, timezone

from line_crossing import Line, LineCrossingDetector


def test_entry_is_emitted_once_after_crossing():
    detector = LineCrossingDetector(Line((0, 100), (640, 100)), cooldown_seconds=8)
    now = datetime(2026, 9, 15, 8, 0, tzinfo=timezone.utc)
    assert detector.update(7, (30, 80), now) is None
    crossing = detector.update(7, (30, 120), now)
    assert crossing is not None
    assert crossing.direction == 'ENTRY'
    assert detector.update(7, (30, 125), now) is None


def test_reverse_crossing_is_exit():
    detector = LineCrossingDetector(Line((0, 100), (640, 100)), cooldown_seconds=0)
    now = datetime(2026, 9, 15, 8, 0, tzinfo=timezone.utc)
    detector.update(2, (30, 120), now)
    crossing = detector.update(2, (30, 80), now)
    assert crossing is not None
    assert crossing.direction == 'EXIT'
