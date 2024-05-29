import unittest
from flask import json
from app import create_app
import requests_mock

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        # Create mock voices cache
        self.mock_voices_cache = [
            {
                "voice_id": "1",
                "name": "Voice 1",
                "labels": {
                    "accent": "american",
                    "gender": "female",
                    "age": "young",
                    "use case": "narration"
                },
                "preview_url": "http://example.com/voice1"
            }
        ]
        self.app = create_app(voices_cache=self.mock_voices_cache)
        self.client = self.app.test_client()

    def test_get_voices(self):
        # Make a request to the /voices endpoint
        response = self.client.get('/voices')
        self.assertEqual(response.status_code, 200)

        # Check the response data
        data = json.loads(response.data)
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["voice_id"], "1")
        self.assertEqual(data[0]["name"], "Voice 1")
        self.assertEqual(data[0]["preview_url"], "http://example.com/voice1")
        self.assertIn("American", data[0]["description"])
        self.assertIn("Female", data[0]["description"])
        self.assertIn("Young", data[0]["description"])
        self.assertIn("Narration Use Case", data[0]["description"])

    @requests_mock.Mocker()
    def test_synthesize_speech(self, mocker):
        # Mock the ElevenLabs API response for text-to-speech synthesis
        mock_response = {
            "audio_url": "http://example.com/audio1"
        }
        mocker.post("https://api.elevenlabs.io/v1/text-to-speech/1", json=mock_response)

        # Create a request payload
        payload = {
            "text": "Hello, world!",
            "voice_id": "1"
        }

        # Make a request to the /synthesize-speech endpoint
        response = self.client.post('/synthesize-speech', json=payload)
        self.assertEqual(response.status_code, 200)

        # Check the response data
        data = json.loads(response.data)
        self.assertEqual(data["audio_url"], "http://example.com/audio1")

    @requests_mock.Mocker()
    def test_synthesize_speech_error(self, mocker):
        # Mock the ElevenLabs API response for text-to-speech synthesis error
        mocker.post("https://api.elevenlabs.io/v1/text-to-speech/1", status_code=400)

        # Create a request payload
        payload = {
            "text": "Hello, world!",
            "voice_id": "1"
        }

        # Make a request to the /synthesize-speech endpoint
        response = self.client.post('/synthesize-speech', json=payload)
        self.assertEqual(response.status_code, 400)

        # Check the response data
        data = json.loads(response.data)
        self.assertIn("error", data)
        
def test_summarization_to_audio_integration(self):
    # Mock the summarization service response
    summary_response = "This is a test summary."
    requests_mock.get('http://summarization-service/api/summarize', text=summary_response)

    # Mock the audio generation service response
    audio_response = {
        "audio_url": "http://example.com/audio1"
    }
    requests_mock.post("https://api.elevenlabs.io/v1/text-to-speech/1", json=audio_response)

    # Simulate the integration workflow
    summarization_payload = {
        "text": "This is a test text.",
        "tone": "informative",
        "sentence_length": "short",
        "include_references": False
    }
    summary_result = self.client.post('/api/summarize', json=summarization_payload)
    self.assertEqual(summary_result.status_code, 200)
    summarized_text = summary_result.data.decode()

    audio_payload = {
        "text": summarized_text,
        "voice_id": "1"
    }
    audio_result = self.client.post('/synthesize-speech', json=audio_payload)
    self.assertEqual(audio_result.status_code, 200)
    audio_data = json.loads(audio_result.data)
    self.assertEqual(audio_data["audio_url"], "http://example.com/audio1")


if __name__ == '__main__':
    unittest.main()
