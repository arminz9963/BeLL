import json
import re

with open(f"data/roh.json", "r", encoding="utf-8") as file:
    roh_data = json.load(file)

entry = roh_data[11]

transkript = entry["transcription"]

pattern = r"(.*?)\[(\d+\.?\d*),(\d+\.?\d*)\]"
matches = re.findall(pattern, transkript)

parts = []
for word, start, end in matches:
    start = round(float(start), 2)
    end = round(float(end), 2)
    parts.append(f"{word.strip()} [{start}, {end}]")

output = " ".join(parts)
print(output)
