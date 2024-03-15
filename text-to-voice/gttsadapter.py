from gtts import gTTS
import os
import uuid
from .text_to_speech_interface import TextToSpeechInterface

class GTTSAdapter(TextToSpeechInterface):
    def synthesize_text(self, text):
        tts = gTTS(text)
        file_name = f"{uuid.uuid4()}.mp3"
        file_path = os.path.join("audio_files", file_name)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        tts.save(file_path)
        return file_path
