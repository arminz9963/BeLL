# BeLL Videoschnitt-KI

Dieses Projekt entstand im Rahmen meiner Besonderen Lernleistung.

---

Auf der Webseite kann man ein MP4-Video hochladen, diese nach Belieben schneiden und anschließend absenden.  
Die Daten (Transkript mit word-level Timestamps, Schnittpunkte, Beschreibung) werden gespeichert.

---

Anschließend wurden die Daten verarbeitet, aufbereitet und mithilfe von [unsloth.ai](https://docs.unsloth.ai/) wurden mehrere LLMs feinabgestimmt

---

Die trainierten LLMs sind unter [huggingface.co](https://huggingface.co/arminz9963/bell/tree/main) zu finden. Für mehr Informationen über die verschiedenen Modelle: [Modellübersicht](model_overview.md)

## Projektstruktur

- **ai_answers/**: Quellenangabe für die Dokumentation
- **app/**: Flask Backend
- **archive/**: HTML und JS vor dem Design von DeepSeek
- **data/**: siehe [Dateiübersicht](data_overview.md)
- **docs/**: Projektdokumentationen
- **inference/**: Code zum Testen der Modelle
- **result/**: Auswertung der Testergebnisse, sowie Testung von 3 nicht-feinabgestimmten Modellen
- **static/**: Javascript des Frontend, TailwindCSS Input/Output und Icon der Webseite
- **templates/**: HTML Webseite vom Frontend
- **tests/**: Testergebnisse der Modelle

## Benutzen der Webseite

### Voraussetzungen

**Software:**

- Python 3.12 oder höher
- Node.js 16 oder höher
- [FFmpeg](https://www.ffmpeg.org/download.html) (zum PATH hinzufügen)

**Python Libarys**

```
python -m pip install flask flask-cors groq
```

**TailwindCSS**

```
npm install
```

**API Key** <br>
Erstelle einen API key auf [groq.cloud](https://console.groq.com/keys) und speichere ihn in in der Datei `app/api_key.txt`.

### Ausführung

1. Gehe in den CMD und navigiere in den Porjektordner
2. Starte TaiwlwindCSS:

   ```
   npx tailwindcss -i ./static/css/styles.css -o ./static/css/output.css --watch
   ```

3. Öffne einen neues CMD-Fenster und gehe erneut in den Projektordner
4. Starte den flask Server:

   ```
   cd app
   python app.py
   ```

5. Die Webseite ist nun unter `http://localhost:5000` erreichbar

---

_Ein Projekt von Armin Z., betreut von Herrn Seifert und Herrn Rose_
