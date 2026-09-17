from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

import cv2

from event_publisher import EventPublisher, VisionEvent
from face_recognizer import FaceRecognizer
from line_crossing import Line, LineCrossingDetector
from person_tracker import PersonTracker

logger = logging.getLogger(__name__)

@dataclass(frozen=True)
class VisionConfig:
    camera_id: str
    api_url: str
    model: str
    faces_dir: str
    line: Line
    recognition_threshold: float = 0.48
    person_confidence: float = 0.55
    cooldown_seconds: float = 8.0

class VisionEngine:
    def __init__(self, config: VisionConfig) -> None:
        self.config = config
        self.tracker = PersonTracker(config.model, config.person_confidence)
        self.recognizer = FaceRecognizer(config.faces_dir, config.recognition_threshold)
        self.crossing = LineCrossingDetector(config.line, config.cooldown_seconds)
        self.publisher = EventPublisher(config.api_url)
        self.identities: dict[int, tuple[str, float]] = {}

    @staticmethod
    def _crop(frame: Any, box: tuple[int, int, int, int]) -> Any:
        height, width = frame.shape[:2]
        x1, y1, x2, y2 = box
        return frame[max(0, y1):min(height, y2), max(0, x1):min(width, x2)]

    @staticmethod
    def _center(box: tuple[int, int, int, int]) -> tuple[int, int]:
        x1, y1, x2, y2 = box
        return ((x1 + x2) // 2, (y1 + y2) // 2)

    def process_frame(self, frame: Any) -> list[dict[str, object]]:
        published: list[dict[str, object]] = []
        people = self.tracker.track(frame)
        active_track_ids = {person.track_id for person in people}

        for track_id in list(self.identities):
            if track_id not in active_track_ids:
                del self.identities[track_id]

        for person in people:
            crop = self._crop(frame, person.box)
            if crop.size == 0:
                continue
            identity = self.recognizer.identify(crop)
            if identity:
                self.identities[person.track_id] = (identity.student_id, identity.confidence)
            crossing = self.crossing.update(person.track_id, self._center(person.box))
            if crossing is None:
                continue
            known = self.identities.get(person.track_id)
            if known is None:
                logger.info('Franchissement ignore: identite inconnue pour track=%s', person.track_id)
                continue
            student_id, face_confidence = known
            confidence = min(person.confidence, face_confidence)
            if confidence < self.config.recognition_threshold:
                logger.info('Franchissement ignore: confiance faible %.3f', confidence)
                continue
            event = VisionEvent(
                student_id=student_id,
                movement_type=crossing.direction,
                camera_id=self.config.camera_id,
                confidence=confidence,
                timestamp=crossing.timestamp,
            )
            try:
                result = self.publisher.publish(event)
                published.append(result)
                logger.info('Mouvement publie: student=%s type=%s', student_id, crossing.direction)
            except Exception:
                logger.exception('Publication impossible; le mouvement n est pas marque comme traite')
        return published

    def run(self, source: int | str = 0, display: bool = False) -> None:
        capture = cv2.VideoCapture(source)
        if not capture.isOpened():
            raise RuntimeError(f'Impossible d ouvrir la source video: {source}')
        try:
            while True:
                ok, frame = capture.read()
                if not ok:
                    raise RuntimeError('La camera ne fournit plus d image')
                self.process_frame(frame)
                if display:
                    cv2.imshow('Smart Lab Vision', frame)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
        finally:
            capture.release()
            if display:
                cv2.destroyAllWindows()
