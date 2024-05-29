import pytest
from flask import json
import requests_mock
from unittest.mock import patch
from app import create_app  

@patch('app.eureka_client')
def test_get_voices(mock_eureka_client):
    voices_cache = [
        {
            "voice_id": "1",
            "name": "Voice One",
            "labels": {
                "accent": "american",
                "gender": "male",
                "age": "adult",
                "use case": "general"
            },
            "preview_url": "http://example.com/voice1"
        },
        {
            "voice_id": "2",
            "name": "Voice Two",
            "labels": {
                "accent": "british",
                "gender": "female",
                "age": "child",
                "use case": "storytelling"
            },
            "preview_url": "http://example.com/voice2"
        }
    ]

    with requests_mock.Mocker() as m:
        m.get("https://api.elevenlabs.io/v1/voices", json={"voices": voices_cache})

        app = create_app(voices_cache)
        client = app.test_client()

        # Test GET /voices
        response = client.get('/voices')
        assert response.status_code == 200

        data = json.loads(response.data)
        assert len(data) == 2
        assert data[0]["voice_id"] == "1"
        assert data[0]["name"] == "Voice One"
        assert data[0]["description"] == "American, Male, Adult, General Use Case"

        assert data[1]["voice_id"] == "2"
        assert data[1]["name"] == "Voice Two"
        assert data[1]["description"] == "British, Female, Child, Storytelling Use Case"


@patch('app.eureka_client')
def test_synthesize_speech(mock_eureka_client):
    # Mock ElevenLabs API
    with requests_mock.Mocker() as m:
        m.get("https://api.elevenlabs.io/v1/voices", json={"voices": []})
        m.post("https://api.elevenlabs.io/v1/text-to-speech/1", json={"audio_url": "http://example.com/audio"})

        app = create_app()
        client = app.test_client()

        # Test POST /synthesize-speech
        response = client.post('/synthesize-speech', json={
            "text": "Hello, this is a test.",
            "voice_id": "1"
        })

        assert response.status_code == 200

        data = json.loads(response.data)
        assert "audio_url" in data
        assert data["audio_url"] == "http://example.com/audio"

if __name__ == "__main__":
    pytest.main()
