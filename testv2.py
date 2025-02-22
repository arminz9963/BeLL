import subprocess
import whisper

def convert_video_to_mp3(input_file, output_file):
    ffmpeg_cmd = [
        "ffmpeg",
        "-i", input_file,
        "-vn",
        "-acodec", "libmp3lame",
        "-ab", "192k",
        "-ar", "44100",
        "-y",
        output_file
    ]

    try:
        subprocess.run(ffmpeg_cmd, check=True)
        print("success")
    except:
        print("Fehler")

convert_video_to_mp3("C:\\BeLL\\testvideo.mp4", "C:\\BeLL\\audio.mp3")

import time

start = time.time()
model = whisper.load_model("tiny")
result = model.transcribe("audio.mp3")

with open("text22.txt", "w") as f:
    f.write(result["text"])

end = time.time()

print(end-start)