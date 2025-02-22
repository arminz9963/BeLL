from flask import Flask, request, jsonify, render_template
from io import BytesIO
import subprocess
from groq import Groq

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


UPLOAD_FOLDER = 'uploads'  # Optional, falls du doch Dateien speichern möchtest

def convert_video_to_mp3(input_file, output_file):
    ffmpeg_cmd = [
        "ffmpeg",
        "-i", input_file,
        "-vn",  # Video ausschließen
        "-acodec", "libmp3lame",  # MP3 Codec
        "-ab", "192k",  # Bitrate
        "-ar", "44100",  # Abtastrate
        "-y",  # Überschreiben, falls Datei existiert
        output_file
    ]
    
    try:
        subprocess.run(ffmpeg_cmd, check=True)
        print("Video zu MP3 konvertiert")
    except subprocess.CalledProcessError:
        print("Fehler bei der Konvertierung von Video zu MP3")
        raise

def transcribe_audio(mp3_file):
    client = Groq(api_key="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")
    
    with open(mp3_file, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(mp3_file, file.read()),
            model="whisper-large-v3-turbo",
            prompt="transcribe the following audio, note punctuation",
            language="de",
        )
        return transcription.text



@app.route('/upload', methods=['POST'])
def upload_video():
    # Überprüfen, ob eine Datei im POST-Request enthalten ist
    if 'video' not in request.files:
        return jsonify({'error': 'Keine Datei gesendet'}), 400
    
    video_file = request.files['video']
    
    if not video_file:
        return jsonify({'error': 'Keine Videodatei gefunden'}), 400
    
    # Temporäre In-Memory-Datei erstellen
    video_bytes = video_file.read()
    video_in_memory = BytesIO(video_bytes)
    
    # Konvertiere das Video in MP3 (mit FFmpeg direkt aus dem Memory Stream)
    mp3_filename = "audio.mp3"
    mp3_path = BytesIO()

    try:
        convert_video_to_mp3(video_in_memory, mp3_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Transkribieren der MP3-Datei aus dem Speicher
    try:
        transcript = transcribe_audio(mp3_path)
    except Exception as e:
        return jsonify({'error': 'Fehler bei der Transkription'}), 500
    
    return jsonify({
        'transcript': transcript
    })

if __name__ == '__main__':
    app.run(debug=True)
