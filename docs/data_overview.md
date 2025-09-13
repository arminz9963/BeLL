# Datenübersicht

Dieses Dokument dient zur Übersicht aller Datensets in `data/`

## Vorbereitung

- **data_prep.py**, **testing_ai_data**: Vorbereiten der verschiedenen Trainingsdaten und Überprüfen der generierten KI Trainingsdaten
- **daten.csv**: Eigene Daten, direkt aus den auf der Webseite geschnittenen Videos erzeugt (25 Einträge)
- **roh.json**: Daten von meinem externen Betreuer Herrn Rose (316 Einträge)
- **roh_alpaca.json**: Daten von meinem externen Betreuer Herrn Rose (316 Einträge) im Alpaca Format
- **ai_data.json**: Daten im ShareGPT, die mithilfe von Gemini 2.5 generiert wurden (105 Einträge)
- **ai_data_alpaca.json**: Daten im Alpaca Format, die mithilfe von Gemini 2.5 generiert wurden (120 Einträge)

## Datensets

### Datenset 1

- **trainingsdaten1.json**: 20 Einträge aus `daten.csv` im ShareGPT Format, das Transkript ist als JSON `{'end': 18.44, 'start': 18.26, 'word': 'wir'}` und die Schnitte als nested Array `[[10.23, 15.89], [61.45, 67.67]]`
- **testdaten1.json**: 5 weitere Einträge aus `daten.csv` im ShareGPT Format, das Transkript ist als JSON und die Schnitte als nested Array (komplementär zu `trainingsdaten1.json`)

---

### Datenset 2

- **trainingsdaten2.json**: 20 Einträge aus `daten.csv` im ShareGPT Format, das Transkript ist im eigenen Format `Aufnahme [0.44, 0.96]` und die Schnitte sind als nested Array
- **testdaten2.json**: 5 weitere Einträge aus `daten.csv`, komplementär zu `trainingsdaten2.json`

---

### Datenset 3

- **trainingsdaten3.json**: 20 Einträge aus `daten.csv` im ShareGPT Format, das Transkript ist im eigenen Format und die Schnitte sind als Tuple-Array-Komplex `[(10.23, 33.32), (44.42, 56.89)]`
- **trainingsdaten3_alpaca.json**: wie `trainingsdaten3.json`, bloß im Alpaca Format
- **testdaten3.json**: 5 weitere Einträge aus `daten.csv`, komplementär zu `trainingsdaten3.json`

---

### Datenset 4

- **trainingsdaten4.json**: 20 Einträge aus `daten.csv` im ShareGPT Format, das Transkript ist im eigenen Format und die Schnitte sind als Tuple-Array-Komplex. Zusätzlich wurde das Schnitte Format erneut im Prompt erklärt.
- **testdaten4.json**: 5 weitere Einträge aus `daten.csv`, komplementär zu `trainingsdaten4.json`

---

### Datenset 5

- **trainingsdaten5_50.json**: 50 Einträge im ShareGPT Format, wobei 20 aus `daten.csv` und 30 aus `ai_data.json` stammen. Transkript und Schnitteformat sind wie bei `trainingsdaten3.json`
- **trainingsdaten5_100_v1.json**: wie `trainingsdaten3_50.json`, bloß bestehend aus 100 Einträgen, wobei 20 aus `daten.csv` und 80 aus `ai_data.json`
- **trainingsdaten5_100_v1_alpaca.json**: wie `trainingsdaten3_100.json` bloß im Alpaca Format
- **trainingsdaten5_100_v2.json**: wie `trainingsdaten3_50.json`, bloß bestehend aus 100 Einträgen, die alle aus `ai_data.json` stammen
- **testdaten5.json**: wie `testdaten3.json`, zusätzlich 5 weitere Einträgen aus `ai_data.json` (Insgesamt 10 Einträge)
- **testdaten5_alpaca.json**: wie `testdaten3_v2.json`, bloß im Alpaca Format
- **testdaten5_v2_alpaca.json**: 100 Einträge im Alpaca Format aus `roh_alpaca.json`

---

### Datenset 6

- **trainingsdaten6_alpaca.json**: 426 Einträge im Alpaca Format, wobei 20 aus `daten.csv`, 100 aus `ai_data.json` und 306 aus `roh_alpaca.json` stammen. Transkript und Schnitteformat sind wie bei `trainingsdaten3.json`
- **testdaten6_alpaca.json**: wie `testdaten3_v2_alpaca.json`, zusätzlich 10 weitere Einträge aus `roh_alpaca.json`

## Hinweis

Innerhalb der einzelnen Datensets gibt es keine Überschneidungen zwischen Trainings- und Testdaten. Jeder Eintrag wird in genau einem der beiden Sets verwendet. Dadurch wird sichergestellt, dass das LLM bei der Inferenz auf Daten trifft, mit denen es zuvor nicht gefinetuned wurde.
