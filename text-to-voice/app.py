from flask import Flask, request, jsonify, send_file
from gtts import gTTS
import os
import uuid
from py_eureka_client import eureka_client
from .gttsadapter import GTTSAdapter
from .elevenlabs_adapter import ElevenLabsAdapter
from gtts import gTTS
import os
import uuid
# from flask_cors import CORS

app = Flask(__name__)

eureka_server = "http://host.docker.internal:8761"
app_name = "text-to-voice-service"
app_port = 5000


eureka_client.init(
    eureka_server=eureka_server,
    app_name=app_name,
    instance_port=app_port,
    instance_host='192.168.2.5',  # The IP address of your machine on the local network
)

# Assuming you're using an environment variable to select the service
import os
tts_adapter = GTTSAdapter  # Default to gTTS if not specified

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.json
        text = data.get('text', '')
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        file_path = tts_adapter.synthesize_text(tts_adapter, text)
        
        return send_file(file_path, as_attachment=True, download_name=os.path.basename(file_path))
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    # Starting the Flask app and Eureka client
    # Eureka client is started automatically by py_eureka_client when the Flask app starts.
    app.run(host='0.0.0.0', port=app_port, debug=True)



