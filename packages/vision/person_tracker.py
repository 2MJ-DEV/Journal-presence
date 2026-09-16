from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from ultralytics import YOLO

@dataclass(frozen=True)
class PersonDetection:
    track_id: int
    box: tuple[int, int, int, int]
    confidence: float

class PersonTracker:
    def __init__(self, model_path: str = 'yolov8n.pt', confidence: float = 0.55) -> None:
        self.model = YOLO(model_path)
        self.confidence = confidence

    def track(self, frame: Any) -> list[PersonDetection]:
        results = self.model.track(frame, persist=True, classes=[0], conf=self.confidence, verbose=False)
        if not results or results[0].boxes is None or results[0].boxes.id is None:
            return []
        boxes = results[0].boxes
        tracks: list[PersonDetection] = []
        for box, track_id, confidence in zip(boxes.xyxy.int().cpu().tolist(), boxes.id.int().cpu().tolist(), boxes.conf.cpu().tolist()):
            x1, y1, x2, y2 = box
            tracks.append(PersonDetection(track_id=track_id, box=(x1, y1, x2, y2), confidence=float(confidence)))
        return tracks
