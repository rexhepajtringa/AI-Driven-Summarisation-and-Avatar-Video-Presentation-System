from flask import Flask, request, jsonify, Response
import requests
import os
from py_eureka_client import eureka_client
import json



def create_app():
    app = Flask(__name__)

    # Eureka and ElevenLabs configuration
    eureka_server = "http://naming-server:8761/eureka"
    app_name = "text-to-voice-service"
    app_port = 5000
    ELEVENLABS_VOICES_ENDPOINT = "https://api.elevenlabs.io/v1/voices"
    ELEVENLABS_API_KEY = '94b13cc597a918c00ed33c585d887e65'
    GOOEY_API_KEY='sk-XBO3A62bORJyEOUuYVmAgDwoG9E9Jr03t9kKEAxB9hg18tcx'

    # Initialize Eureka client
    eureka_client.init(
        eureka_server=eureka_server,
        app_name=app_name,
        instance_port=app_port,
    )


    voices_cache = []

    with app.app_context():
        # Load voices cache
        headers = {
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY  # Correct API key header
        }
        response = requests.get(ELEVENLABS_VOICES_ENDPOINT, headers=headers)
        voices_cache = response.json().get("voices", [])

    
    


    def capitalize_label(label):
        if label and isinstance(label, str):
            # The title() method capitalizes the first letter of each word
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
                    # ... Add other labels here
                ]))
            } for voice in voices_cache[:-1]
        ]
        return jsonify(simplified_voices)



    @app.route('/lip-sync', methods=['POST'])
    def lip_sync():
        if 'image' not in request.files or 'audio' not in request.files:
            return jsonify({'error': 'Missing image or audio file'}), 400

        image = request.files['image']
        audio = request.files['audio']

        if image.filename == '' or audio.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        files = [
            ('input_face', (image.filename, image.read(), 'image/jpeg')),
            ('input_audio', (audio.filename, audio.read(), 'audio/mpeg')),
        ]

        payload = {}
        response = requests.post(
            "https://api.gooey.ai/v2/Lipsync/form/",
            headers={"Authorization": "Bearer " + 'sk-XBO3A62bORJyEOUuYVmAgDwoG9E9Jr03t9kKEAxB9hg18tcx'},
            files=files,
            data={"json": json.dumps(payload)},
        )

        if not response.ok:
            return jsonify({
                'error': 'Failed to process with Gooey AI',
                'details': response.text
            }), response.status_code

        response_data = response.json()
        output_video_url = response_data.get('output', {}).get('output_video')

        if not output_video_url:
            return jsonify({
                'error': 'Output video URL not found in Gooey AI response',
                'details': response_data
            }), 400

        return jsonify({'output_video_url': output_video_url}), 200

 
 
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
            # Check if the response is JSON
            try:
                json_response = synthesis_response.json()
                return jsonify(json_response)
            except requests.exceptions.JSONDecodeError:
                # If response is not JSON, return the raw response with the correct mimetype
                return Response(synthesis_response.content, mimetype=synthesis_response.headers.get('Content-Type', 'application/octet-stream'))
        else:
            # Handle error case
            return jsonify({"error": "Error synthesizing speech"}), synthesis_response.status_code




    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)