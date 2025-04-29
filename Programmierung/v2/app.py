import os
import tempfile
from flask import Flask, render_template, request, jsonify
from logic import convert_mp4_to_mp3, transcribe_audio
import csv

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
    mp4_file = request.files["video"]
    api_key = "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"

    # temporärer File für das Video
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_video:
        mp4_file.save(temp_video)
        temp_video_path = temp_video.name

    # temporäres File für die Audio
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio:
        temp_audio_path = temp_audio.name

    try:
        # Video in Audio
        convert_mp4_to_mp3(temp_video_path, temp_audio_path)
        # Transkribierung
        transcript = transcribe_audio(temp_audio_path, api_key)
    finally:
        # Löschen der temporären Dateien
        os.remove(temp_video_path)
        os.remove(temp_audio_path)

    return jsonify(transcript)

@app.route("/daten_senden", methods=["POST"])
def daten_senden():
    data = request.get_json()
    print(data)
    transkript = data["transkript"]
    schnitte = data["schnitte"]
    beschreibung = data["beschreibung"]

    with open("daten.csv", "a", encoding="utf-8") as datei:
        writer = csv.writer(datei)
        writer.writerow([transkript, schnitte, beschreibung])
    datei.close()

    return "", 200 # HTTP mitteilen, dass alles passt

if __name__ == "__main__":
    app.run(debug=True, port=5000)