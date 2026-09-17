from datetime import datetime, timezone

from event_publisher import VisionEvent


def test_vision_event_payload_contains_vision_contract_fields():
    event = VisionEvent(
        student_id='123e4567-e89b-12d3-a456-426614174000',
        movement_type='ENTRY',
        camera_id='00000000-0000-0000-0000-000000000001',
        confidence=0.94,
        timestamp=datetime(2026, 9, 15, 8, 0, tzinfo=timezone.utc),
        event_id='evt-123',
    )

    payload = event.to_api_payload()

    assert payload['eventId'] == 'evt-123'
    assert payload['studentId'] == '123e4567-e89b-12d3-a456-426614174000'
    assert payload['type'] == 'ENTRY'
    assert payload['cameraId'] == '00000000-0000-0000-0000-000000000001'
    assert payload['confidence'] == 0.94
    assert payload['source'] == 'VISION'
