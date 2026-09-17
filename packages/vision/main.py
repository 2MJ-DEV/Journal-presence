from __future__ import annotations

import argparse
import logging
from pathlib import Path

import yaml

from line_crossing import Line
from vision_engine import VisionConfig, VisionEngine

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


def load_config(path: str) -> dict:
    config_path = Path(path)
    if not config_path.is_absolute():
        config_path = (Path(__file__).resolve().parent / config_path).resolve()
    with config_path.open('r', encoding='utf-8') as stream:
        return yaml.safe_load(stream)


def main() -> None:
    parser = argparse.ArgumentParser(description='Smart Lab OpenCV vision engine')
    parser.add_argument('--config', default='config.yaml')
    parser.add_argument('--display', action='store_true')
    args = parser.parse_args()
    raw = load_config(args.config)
    base_dir = Path(__file__).resolve().parent

    faces_dir = raw['faces_dir']
    if not Path(faces_dir).is_absolute():
        faces_dir = str(base_dir / faces_dir)

    line = raw['line']
    config = VisionConfig(
        camera_id=raw['camera_id'],
        api_url=raw['api_url'],
        model=raw.get('model', 'yolov8n.pt'),
        faces_dir=faces_dir,
        line=Line(tuple(line['start']), tuple(line['end']), line.get('orientation', 'horizontal')),
        recognition_threshold=float(raw.get('recognition_threshold', 0.48)),
        person_confidence=float(raw.get('person_confidence', 0.55)),
        cooldown_seconds=float(raw.get('cooldown_seconds', 8)),
    )
    VisionEngine(config).run(raw.get('video_source', 0), args.display)


if __name__ == '__main__':
    main()
