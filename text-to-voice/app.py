from flask import Flask, request, jsonify, send_file
from gtts import gTTS
import os
import uuid
from py_eureka_client import eureka_client
# from flask_cors import CORS



app = Flask(__name__)

eureka_server = "http://localhost:8761"
app_name = "text-to-voice-service"
app_port = 5000
# CORS(app, resources={r"/*": {"origins": "*"}})  # This will enable CORS for all routes under "/api/"
  # This will enable CORS for all routes


eureka_client.init(
    eureka_server=eureka_server,
    app_name=app_name,
    instance_host='localhost',  # Add this line to explicitly set the host
    instance_port=app_port
)


@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    try:
        data = request.json
        text = data.get('text', '')
        # if not text:
        #     return jsonify({"error": "No text provided"}), 400

        # tts = gTTS(text)
        # file_name = f"{uuid.uuid4()}.mp3"
        # file_path = os.path.join("audio_files", file_name)

        # os.makedirs(os.path.dirname(file_path), exist_ok=True)  # Ensure the directory exists
        # tts.save(file_path)

        # # Return the generated audio file
        # return send_file(file_path, as_attachment=True, download_name=file_name)
        return jsonify({"text": "Hello World"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    # Starting the Flask app and Eureka client
    # Eureka client is started automatically by py_eureka_client when the Flask app starts.
    app.run(host='0.0.0.0', port=app_port)




