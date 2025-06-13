import os
import tempfile
from flask import Flask, render_template, request, jsonify
from logic import convert_mp4_to_mp3, transcribe_audio, get_api_key
import csv
import json
from flask_cors import CORS
import time



api_key = get_api_key("api_key.txt")
csv_path = "../daten.csv"

app = Flask(__name__, template_folder='../templates', static_folder='../static')

CORS(app)  # CORS aktivieren, um Anfragen von anderen Ursprüngen zuzulassen

@app.route("/")
def index():
    print(app.static_folder)  # Zeigt, wo Flask nach static sucht
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
    mp4_file = request.files["video"]

    # temporäre Datei für das Video
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_video:
        mp4_file.save(temp_video)
        temp_video_path = temp_video.name

    # temporäres Datei für die Audio
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_audio:
        temp_audio_path = temp_audio.name

    try:
        start = time.time()
        # Video in Audio
        convert_mp4_to_mp3(temp_video_path, temp_audio_path)
        # Transkribierung
        transkript = transcribe_audio(temp_audio_path, api_key)
        end = time.time()
        print(f"Transkription abgeschlossen in {end - start:.2f} Sekunden")
    
    finally:
        # Löschen der temporären Dateien
        os.remove(temp_video_path)
        os.remove(temp_audio_path)

    return jsonify(transkript)

@app.route("/daten_senden", methods=["POST"])
def daten_senden():
    data = request.get_json()
    print(data)
    transkript = data["transkript"]
    schnitte = data["schnitte"]
    beschreibung = data["beschreibung"]

    with open(csv_path, "a", encoding="utf-8", newline="") as datei:
        writer = csv.writer(datei)
        # transkript und schnitte serialisieren, da komplexe Strukturen
        writer.writerow([
            json.dumps(transkript, ensure_ascii=False),
            json.dumps(schnitte),
            json.dumps(beschreibung, ensure_ascii=False)
        ])

    print("Daten erfolgreich in der CSV-Datei gespeichert.")

    return "Daten in CSV gespeichert!", 200 # HTTP mitteilen, dass alles passt

if __name__ == "__main__":
    app.run(debug=True, port=5000)