import os
from groq import Groq

# Initialize the Groq client
client = Groq(api_key="gsk_63tD5SaWbcoMCjYA6wQfWGdyb3FYebD9GiB0l3LcuCcHB0sHKBO")

filename = "C:\\main\\BeLL\\main\\transcribing\\audio.mp3"

with open(filename, "rb") as file:
    transcription = client.audio.transcriptions.create(
      file=(filename, file.read()),
      model="whisper-large-v3",
      prompt="transcribe the following audio in the german language as text.",
      response_format="verbose_json",
    )
    print(transcription.text)
      