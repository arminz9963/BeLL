# groq ai transcribing
import subprocess
import requests

# Funktion zum Konvertieren von Video in MP3
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

# Funktion zum Hochladen und Transkribieren mit Groq-Cloud Whisper
def transcribe_with_groq(audio_path, api_key):
    url = "https://api.groq.com/v1/audio/transcriptions"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    files = {
        "file": open(audio_path, "rb")
    }
    data = {
        "model": "whisper-large-v3",
        "language": "de"  # Falls das Audio Deutsch ist
    }

    response = requests.post(url, headers=headers, files=files, data=data)

    if response.status_code == 200:
        print("Transkription erfolgreich:")
        print(response.json()["text"])
    else:
        print("Fehler bei der Transkription:", response.text)

# Dateipfade
video_path = "C:\\BeLL\\testvideo.mp4"  # Pfad zum Video
mp3_path = "C:\\BeLL\\audio.mp3"  # Pfad zur MP3-Datei
groq_api_key = "gsk_63tD5SaWbcoMCjYA6wQfWGdyb3FYebD9GiB0l3LcuCcHB0sHKBO"  

# Video zu MP3 konvertieren
convert_video_to_mp3(video_path, mp3_path)

# MP3 mit Groq-Cloud Whisper transkribieren
transcribe_with_groq(mp3_path, groq_api_key)
