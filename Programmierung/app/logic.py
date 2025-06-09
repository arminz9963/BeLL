import time
import subprocess
from groq import Groq

def convert_mp4_to_mp3(input_file, output_file, start_time=None, end_time=None):
    """
    Konvertiert eine MP4-Datei in eine MP3-Datei mit optionalen Start- und Endzeiten.
    input_file: Pfad zur MP4-Datei
    output_file: Pfad zur MP3-Datei
    start_time: Startzeit im Format "MM:SS.ss" (optional)
    end_time: Endzeit im Format "MM:SS.ss" (optional)
    """
    command = ["ffmpeg", "-i", input_file, "-vn",
               "-acodec", "libmp3lame", "-ab", "192k", "-ar", "44100", "-y"]
    
    if start_time:
        command.extend(["-ss", start_time])
    if end_time:
        command.extend(["-to", end_time])
    
    command.append(output_file)
    
    try:
        subprocess.run(command, check=True)
        print("Datei erfolgreich konvertiert zu MP3.")
    except subprocess.CalledProcessError as e:
        print("Fehler bei der Konvertierung:", e)

def transcribe_audio(file_path, api_key, language="de"):
    """
    Erstellt eine Transkription einer MP3-Datei mit Groq Whisper.
    """

    client = Groq(api_key=api_key)
    print("Transkription beginnt...")
    with open(file_path, "rb") as file:
        transcription = client.audio.transcriptions.create(
            file=(file_path, file.read()),
            model="whisper-large-v3-turbo",
            prompt="Transkribiere die folgende Audiodatei, beachte die Zeichensetzung",
            language=language,
            temperature=0.0,
            timestamp_granularities=["word"],
            response_format="verbose_json",
        )
        print("Transkript erfolgreich erstellt.")
        return transcription.words
    
# Beispielaufruf
def main():
    start = time.time()
    mp4_file = "C:\\main\\BeLL\\Programmierung\\transcribing\\testvideo.mp4"
    mp3_file = "C:\\main\\BeLL\\Programmierung\\transcribing\\audio.mp3"
    api_key = "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"
    start_time = "01:10.33"  # Optional: Startzeit mit Millisekunden
    end_time = "02:33.89"  # Optional: Endzeit mit Millisekunden
    
    convert_mp4_to_mp3(mp4_file, mp3_file, start_time, end_time)
    text = transcribe_audio(mp3_file, api_key)
    print(text)
    end = time.time()
    print(f"Gesamtzeit: {end - start}s")

if __name__ == "__main__":
    main()
