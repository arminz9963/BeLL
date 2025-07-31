import json

with open("data/trainingsdaten.json", "r") as f:
    data = json.load(f)

for i, sample in enumerate(data):
    if not isinstance(sample.get("conversations"), list):
        print(f"⚠️ Problem bei Index {i}: {sample.get('conversations')}")

for i, sample in enumerate(data):
    convos = sample.get("conversations")
    if not isinstance(convos, list):
        print(f"❌ Not a list at {i}")
    else:
        for j, c in enumerate(convos):
            if not isinstance(c, dict):
                print(f"❌ Bad conversation at sample {i}, index {j}: {c}")

