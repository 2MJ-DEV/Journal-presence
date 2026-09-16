from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import face_recognition

@dataclass(frozen=True)
class Identity:
    student_id: str
    confidence: float

class FaceRecognizer:
    def __init__(self, faces_dir: str, threshold: float = 0.48) -> None:
        self.threshold = threshold
        self.encodings: list[Any] = []
        self.student_ids: list[str] = []
        self._load_faces(Path(faces_dir))

    def _load_faces(self, faces_dir: Path) -> None:
        if not faces_dir.exists():
            raise FileNotFoundError(f'Dossier de visages introuvable: {faces_dir}')
        for image_path in sorted(faces_dir.glob('*')):
            if image_path.suffix.lower() not in {'.jpg', '.jpeg', '.png'}:
                continue
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)
            if len(encodings) != 1:
                raise ValueError(f'{image_path}: une seule face est attendue')
            self.encodings.append(encodings[0])
            self.student_ids.append(image_path.stem)
        if not self.encodings:
            raise ValueError(f'Aucun visage exploitable dans {faces_dir}')

    def identify(self, person_image: Any) -> Identity | None:
        locations = face_recognition.face_locations(person_image, model='hog')
        encodings = face_recognition.face_encodings(person_image, locations)
        if not encodings:
            return None
        distances = face_recognition.face_distance(self.encodings, encodings[0])
        index = int(distances.argmin())
        distance = float(distances[index])
        if distance > self.threshold:
            return None
        return Identity(student_id=self.student_ids[index], confidence=max(0.0, 1.0 - distance))
