import subprocess
import wave
from vosk import Model, KaldiRecognizer

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

# Funktion zum Konvertieren von MP3 zu WAV
def convert_mp3_to_wav(input_mp3, output_wav):
    ffmpeg_cmd = [
        "ffmpeg",
        "-i", input_mp3,
        output_wav
    ]
    
    try:
        subprocess.run(ffmpeg_cmd, check=True)
        print("MP3 zu WAV konvertiert")
    except subprocess.CalledProcessError:
        print("Fehler bei der Konvertierung von MP3 zu WAV")

# Funktion zum Transkribieren der WAV-Datei mit Vosk
def transcribe_audio(audio_path):
    wf = wave.open(audio_path, "rb")
    model = Model(r"C:\BeLL\models\vosk-model-small-de-0.15")  # Pfad zum Vosk-Modell
    recognizer = KaldiRecognizer(model, wf.getframerate())

    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if recognizer.AcceptWaveform(data):
            print(recognizer.Result())

    print(recognizer.FinalResult())

# Der eigentliche Ablauf
video_path = r"C:\BeLL\testvideo.mp4"  # Pfad zum Video
mp3_path = r"C:\BeLL\audio.mp3"  # Pfad zur MP3-Datei
wav_path = r"C:\BeLL\audio.wav"  # Pfad zur WAV-Datei

# Video zu MP3 konvertieren
convert_video_to_mp3(video_path, mp3_path)

# MP3 zu WAV konvertieren
convert_mp3_to_wav(mp3_path, wav_path)

# WAV transkribieren
transcribe_audio(wav_path)
