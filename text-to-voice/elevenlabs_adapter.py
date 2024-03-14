import os
import uuid
import requests
from .text_to_speech_interface import TextToSpeechInterface


class ElevenLabsAdapter(TextToSpeechInterface):
    def __init__(self, api_key, model_id, voice_id):
        self.api_key = api_key
        self.model_id = model_id
        self.voice_id = voice_id
        self.url = "https://api.elevenlabs.io/v1/text-to-speech/{}".format(self.voice_id)
        self.headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": self.api_key
        }

    def synthesize_text(self, text, voice_settings=None):
        voice_settings = voice_settings or {
            "stability": 0.5,
            "similarity_boost": 0.5
        }
        
        data = {
            "text": text,
            "model_id": self.model_id,
            "voice_settings": voice_settings
        }

        response = requests.post(self.url, json=data, headers=self.headers)
        if response.status_code != 200:
            raise Exception("ElevenLabs API error: {}".format(response.text))

        file_name = f"{uuid.uuid4()}.mp3"
        file_path = os.path.join("audio_files", file_name)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
                    
        return file_path

