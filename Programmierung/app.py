import os
import tempfile
from flask import Flask, render_template, request, jsonify
from v2.logic import convert_mp4_to_mp3, transcribe_audio

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/transcribe', methods=['POST'])
def transcribe():
    mp4_file = request.files['video']
    api_key = "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"
    start_time = request.form['start']
    end_time = request.form['end']

    # temporärer File für das Video
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_video:
        mp4_file.save(temp_video)
        temp_video_path = temp_video.name

    # temporäres File für die Audio
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio:
        temp_audio_path = temp_audio.name

    try:
        # Video in Audio
        convert_mp4_to_mp3(temp_video_path, temp_audio_path, start_time, end_time)
        # Transkribierung
        text = transcribe_audio(temp_audio_path, api_key)
    finally:
        # Löschen der temporären Dateien
        os.remove(temp_video_path)
        os.remove(temp_audio_path)

    return jsonify({"transcript": text})

if __name__ == '__main__':
    app.run(debug=True)
