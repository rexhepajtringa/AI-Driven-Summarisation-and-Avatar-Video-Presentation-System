from flask import Flask, request, jsonify
import requests
import os
from py_eureka_client import eureka_client
import json

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

eureka_server = "http://host.docker.internal:8761"
app_name = "avatar-video-service"
app_port = 5020

eureka_client.init(
    eureka_server=eureka_server,
    app_name=app_name,
    instance_port=app_port,
    instance_host='192.168.2.4',
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
        headers={"Authorization": "Bearer " + os.getenv("GOOEY_API_KEY")},
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=app_port, debug=True)
