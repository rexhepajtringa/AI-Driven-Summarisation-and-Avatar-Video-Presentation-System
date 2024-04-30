from flask import Flask, request, jsonify, Response
import requests
import os
from py_eureka_client import eureka_client
import json



def create_app():
    app = Flask(__name__)

    # Eureka and ElevenLabs configuration
    eureka_server = "http://naming-server:8761/eureka"
    app_name = "avatar-video-service"
    app_port = 8900
  
    GOOEY_API_KEY='sk-XBO3A62bORJyEOUuYVmAgDwoG9E9Jr03t9kKEAxB9hg18tcx'

    # Initialize Eureka client
    eureka_client.init(
        eureka_server=eureka_server,
        app_name=app_name,
        instance_port=app_port,
    )


    

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

 
 
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
