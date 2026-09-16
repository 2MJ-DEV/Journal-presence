from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Literal

Direction = Literal['ENTRY', 'EXIT']

@dataclass(frozen=True)
class Line:
    start: tuple[int, int]
    end: tuple[int, int]
    orientation: Literal['horizontal', 'vertical'] = 'horizontal'

@dataclass(frozen=True)
class Crossing:
    track_id: int
    direction: Direction
    timestamp: datetime

class LineCrossingDetector:
    def __init__(self, line: Line, cooldown_seconds: float = 8.0) -> None:
        self.line = line
        self.cooldown = timedelta(seconds=cooldown_seconds)
        self.previous_side: dict[int, int] = {}
        self.last_crossing: dict[int, datetime] = {}

    def _side(self, point: tuple[int, int]) -> int:
        if self.line.orientation == 'vertical':
            axis = self.line.start[0]
            value = point[0] - axis
        else:
            axis = self.line.start[1]
            value = point[1] - axis
        return 1 if value >= 0 else -1

    def update(self, track_id: int, center: tuple[int, int], now: datetime | None = None) -> Crossing | None:
        now = now or datetime.now(timezone.utc)
        current = self._side(center)
        previous = self.previous_side.get(track_id)
        self.previous_side[track_id] = current
        if previous is None or previous == current:
            return None
        last = self.last_crossing.get(track_id)
        if last and now - last < self.cooldown:
            return None
        self.last_crossing[track_id] = now
        direction: Direction = 'ENTRY' if previous < current else 'EXIT'
        return Crossing(track_id=track_id, direction=direction, timestamp=now)
