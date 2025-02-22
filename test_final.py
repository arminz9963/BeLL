import os
from groq import Groq
from time import time

start = time()
client = Groq(api_key="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")
filename = os.path.dirname(__file__) + "/audio.mp3"

with open(filename, "rb") as file:
    transcription = client.audio.transcriptions.create(
      file=(filename, file.read()),
      model="whisper-large-v3-turbo",
      prompt="transcribe the following audio, note punctuation ",
      language="de",
    )
    print(transcription.text)

end = time()

print(end-start)