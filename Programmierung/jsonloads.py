import json
import csv

with open("daten.csv", "r", encoding="utf-8") as file:
    csv_reader = csv.reader(file)
    next(csv_reader)  # Überspringe die Kopfzeile, falls vorhanden
    for row in csv_reader:
        transkript = json.loads(row[0])
        schnitte = json.loads(row[1])
        beschreibung = row[2]

        print("Transkript:", transkript)
        print("Schnitte:", schnitte)
        print("Beschreibung:", beschreibung)
        print("---")

