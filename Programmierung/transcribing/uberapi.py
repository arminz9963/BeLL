from time import time
import requests

mp3_file = "C:\\main\\BeLL\\Programmierung\\transcribing\\audio2.mp3"
api_key = "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"
    
url = "https://api.groq.com/openai/v1/audio/transcriptions"

import os
from groq import Groq

client = Groq(api_key=api_key)
filename = mp3_file#

with open(filename, "rb") as file:
    transcription = client.audio.transcriptions.create(
      file=(filename, file.read()),
      model="whisper-large-v3",
      prompt="Specify context or spelling",  # Optional
      response_format="verbose_json",  # Optional
      language="de",  # Optional
      temperature=0.0,  # Optional
      timestamp_granularities=["word"],  # Optional
    )
    with open("output.txt", "w", encoding="utf-8") as f:
        f.write(str(transcription.words))
    f.close()
    print("done")