import json

with open('data/ai_data_alpaca.json', 'r') as file:
    data = json.load(file)

print(len(data))