from time import time
import subprocess
from groq import Groq

def convert_mp4_to_mp3(input_file, output_file):
    """
    Konvertiert eine MP4-Datei in eine MP3-Datei.
    :param input_file: Pfad zur MP4-Datei
    :param output_file: Pfad zur MP3-Datei
    """
    command = [
        "ffmpeg", "-i", input_file, "-vn",
        "-acodec", "libmp3lame", "-ab", "192k", "-ar", "44100", "-y", output_file
    ]
    
    try:
        subprocess.run(command, check=True)
        print("Datei erfolgreich konvertiert.")
    except subprocess.CalledProcessError as e:
        print("Fehler bei der Konvertierung:", e)

def transcribe_audio(file_path, api_key, model="whisper-large-v3-turbo", language="de"):
    """
    Erstellt eine Transkription einer MP3-Datei mit Groq Whisper.
    :param file_path: Pfad zur MP3-Datei
    :param api_key: Groq API-Schlüssel
    :param model: Modell für die Transkription
    :param language: Sprache der Audiodatei
    """
    client = Groq(api_key=api_key)
    
    with open(file_path, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(file_path, file.read()),
            model=model,
            prompt="Transkribiere die folgende Audiodatei, beachte die Zeichensetzung",
            language=language,
        )
        return transcription.text

# Beispielaufruf
def main():
    start = time()
    mp4_file = "C:\\main\\BeLL\\main\\transcribing\\testvideo.mp4"
    mp3_file = "C:\\main\\BeLL\\main\\transcribing\\audio.mp3"
    api_key = "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"
    
    convert_mp4_to_mp3(mp4_file, mp3_file)
    text = transcribe_audio(mp3_file, api_key)
    print(text)
    end = time()
    print("Dauer:", end - start, "Sekunden")
    
if __name__ == "__main__":
    main()



