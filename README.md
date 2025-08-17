# BeLL Videoschnitt-KI  
> Dieses Projekt entstand im Rahmen meiner Besonderen Lernleistung.  
> Auf der Webseite kann man ein MP4-Video hochladen, diese nach Belieben schneiden und anschließend absenden.  
> Die Daten (Transkript mit word-level Timestamps, Schnittpunkte, Beschreibung) werden gespeichert.

## Voraussetzungen

**Software:**  
- Python 3.12 oder höher  
- Node.js 16 oder höher  
- FFmpeg (für Videobearbeitung)


**Python Libarys** <br>
`python -m pip install flask flask-cors groq`

**TailwindCSS** <br>
`npm install`

**API Key**
Erstelle einen API key auf [groq.cloud](https://console.groq.com/keys) und speichere ihn in in der Datei `app/api_key.txt`.

## Ausführung der Webseite

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

*Ein Projekt von Armin Z., betreut von Herrn Seifert und Herrn Rose*
