from flask import Flask, request, jsonify, Response
import requests
from py_eureka_client import eureka_client

def create_app(voices_cache=None):
    app = Flask(__name__)

    # Eureka and ElevenLabs configuration
    eureka_server = "http://host.docker.internal:8761"
    app_name = "text-to-voice-service"
    app_port = 5000
    ELEVENLABS_VOICES_ENDPOINT = "https://api.elevenlabs.io/v1/voices"
    ELEVENLABS_API_KEY = '94b13cc597a918c00ed33c585d887e65'

    # Initialize Eureka client
    eureka_client.init(
        eureka_server=eureka_server,
        app_name=app_name,
        instance_port=app_port,
        instance_host='192.168.1.16'
    )

    if voices_cache is None:
        headers = {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY  # Correct API key header
        }
        response = requests.get(ELEVENLABS_VOICES_ENDPOINT, headers=headers)
        voices_cache = response.json().get("voices", [])

    def capitalize_label(label):
        if label and isinstance(label, str):
            return label.title()
        return label

    @app.route('/voices', methods=['GET'])
    def get_voices():
        simplified_voices = [
            {
                "voice_id": voice["voice_id"],
                "name": voice["name"],
                "preview_url": voice.get("preview_url"),
                "description": ", ".join(filter(None, [
                    capitalize_label(voice.get("labels", {}).get("accent")),
                    capitalize_label(voice.get("labels", {}).get("gender")),
                    capitalize_label(voice.get("labels", {}).get("age")),
                    (capitalize_label(voice.get("labels", {}).get("use case", "")) + " Use Case").strip(),
                ]))
            } for voice in voices_cache
        ]
        return jsonify(simplified_voices)

    @app.route('/synthesize-speech', methods=['POST'])
    def synthesize_speech():
        data = request.json
        text = data["text"]
        voice_id = data["voice_id"]

        headers = {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }

        synthesis_response = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            json={
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.5
                }
            },
            headers=headers
        )

        if synthesis_response.ok:
            try:
                json_response = synthesis_response.json()
                return jsonify(json_response)
            except requests.exceptions.JSONDecodeError:
                return Response(synthesis_response.content, mimetype=synthesis_response.headers.get('Content-Type', 'application/octet-stream'))
        else:
            return jsonify({"error": "Error synthesizing speech"}), synthesis_response.status_code

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
