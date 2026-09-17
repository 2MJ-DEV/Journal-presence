from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

import requests

MovementType = Literal["ENTRY", "EXIT"]

@dataclass(frozen=True)
class VisionEvent:
    student_id: str
    movement_type: MovementType
    camera_id: str
    confidence: float
    timestamp: datetime
    event_id: str = ''

    def to_api_payload(self) -> dict[str, object]:
        payload = {
            'eventId': self.event_id or str(uuid4()),
            'studentId': self.student_id,
            'type': self.movement_type,
            'cameraId': self.camera_id,
            'confidence': self.confidence,
            'timestamp': self.timestamp.astimezone(timezone.utc).isoformat(),
            'source': 'VISION',
        }
        return payload

class EventPublisher:
    def __init__(self, api_url: str, timeout_seconds: float = 5.0) -> None:
        self.endpoint = api_url.rstrip('/') + '/vision/events'
        self.timeout_seconds = timeout_seconds

    def publish(self, event: VisionEvent) -> dict[str, object]:
        payload = event.to_api_payload()
        response = requests.post(self.endpoint, json=payload, timeout=self.timeout_seconds)
        response.raise_for_status()
        if not response.content:
            return {'accepted': True, 'duplicate': False, 'source': 'VISION'}
        try:
            return response.json()
        except ValueError:
            return {'accepted': True, 'duplicate': False, 'source': 'VISION'}
