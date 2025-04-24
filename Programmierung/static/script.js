// Variablen zum Speichern der verschiedenen HTML-Elemente und Zustände
let videoFile; // Die Videodatei, die der Nutzer hochlädt
const videoInput = document.getElementById("videoInput"); // Das HTML-Element für das Video-Upload-Feld
const uploadButton = document.getElementById("uploadButton"); // Der Upload-Button
const removeVideoButton = document.getElementById("removeVideo"); // Der Button zum Entfernen des Videos
const videoPlayer = document.getElementById("videoPlayer"); // Das Video-Player-Element
const startRange = document.getElementById("startRange"); // Der Startbereich des Schiebereglers für den Schnitt
const endRange = document.getElementById("endRange"); // Der Endbereich des Schiebereglers für den Schnitt
const startInput = document.getElementById("startInput"); // Das Textfeld für die Startzeit des Schnitts
const endInput = document.getElementById("endInput"); // Das Textfeld für die Endzeit des Schnitts
const totalDuration = document.getElementById("totalDuration"); // Das Element, das die Gesamtdauer des Schnitts anzeigt
const videoContainer = document.getElementById("videoContainer"); // Das Container-Element für das Video
const controls = document.getElementById("controls"); // Das Steuerungselement für das Video
const transcriptElement = document.getElementById("transcript"); // Das Element, das die Transkription anzeigt
const transcriptButton = document.getElementById("transcriptButton"); // Der Button zum Abrufen der Transkription

let startTrim = 0; // Der Startzeitpunkt des Schnitts in Sekunden
let endTrim = 0; // Der Endzeitpunkt des Schnitts in Sekunden


let cutSectionCount = 0;  // Zählt die Anzahl der Schnittbereiche

function addCutSection() {
    cutSectionCount++;  // Erhöht den Zähler

    const schnittBereich = document.createElement('div');
    schnittBereich.classList.add('schnittbereich');
    schnittBereich.id = `schnitt-${cutSectionCount}`;

    // HTML für den Schnittbereich
    schnittBereich.innerHTML = `
    <p>Trimmen:</p>
    <input type="range" class="startRange" min="0" step="0.01" style="width: 40%" value="0"/>
    <input type="range" class="endRange" min="0" step="0.01" style="width: 40%" value="0"/>
    <br />
    <span>Start: <input type="text" class="startInput" maxlength="8" value="00:00.00" /></span>
    <span style="margin-left: 20px">Ende: <input type="text" class="endInput" maxlength="8" value="00:00.00" /></span>
    <br/><br/>
  `;

    // Füge den neuen Schnittbereich in den Container ein
    document.getElementById('schnitte-container').appendChild(schnittBereich);

    // Füge Event-Listener zu den neuen Schiebereglern und Textfeldern hinzu
    setupCutSection(schnittBereich);
}

document.getElementById("addcutSectionButton").addEventListener("click", addCutSection);




// Diese Funktion wird ausgeführt, wenn das Dokument vollständig geladen wurde
document.addEventListener("DOMContentLoaded", function () {


    // Wenn der Benutzer eine Datei auswählt (Video hochlädt)
    videoInput.addEventListener("change", function (event) {
        videoFile = event.target.files[0]; // Die ausgewählte Videodatei wird gespeichert
        if (videoFile) {
            const videoURL = URL.createObjectURL(videoFile); // Die URL für die Datei wird erstellt
            videoPlayer.src = videoURL; // Die Quelle des Video-Players wird auf die hochgeladene Datei gesetzt
            uploadButton.style.display = "none"; // Der Upload-Button wird ausgeblendet
            removeVideoButton.style.display = "block"; // Der Entfernen-Button wird angezeigt
            videoPlayer.style.display = "block"; // Der Video-Player wird angezeigt
            controls.style.display = "block"; // Die Steuerungselemente werden angezeigt
            videoContainer.style.border = "none"; // Die Container-Grenze wird entfernt
            videoPlayer.addEventListener("loadedmetadata", () => {
                startTrim = 0; // Der Startzeitpunkt wird auf 0 gesetzt
                endTrim = videoPlayer.duration; // Die Gesamtlänge des Videos wird als Endzeitpunkt gesetzt
                startRange.min = 0; // Der minimale Wert für den Start-Schieberegler wird auf 0 gesetzt
                endRange.min = 0; // Der minimale Wert für den End-Schieberegler wird auf 0 gesetzt
                startRange.max = videoPlayer.duration; // Der maximale Wert für den Start-Schieberegler wird auf die Videolänge gesetzt
                endRange.max = videoPlayer.duration; // Der maximale Wert für den End-Schieberegler wird auf die Videolänge gesetzt
                startRange.value = startTrim; // Der Startwert des Schiebereglers wird auf den Startzeitpunkt gesetzt
                endRange.value = endTrim; // Der Endwert des Schiebereglers wird auf den Endzeitpunkt gesetzt
                totalDuration.textContent = formatTime(endTrim - startTrim); // Die Gesamtdauer des Schnitts wird formatiert und angezeigt
                updateTrimTimes(); // Die Anzeigewerte für Start- und Endzeit werden aktualisiert
            });
        }
    });

    // Wenn der Benutzer das Video entfernen möchte
    removeVideoButton.addEventListener("click", function () {
        videoPlayer.src = ""; // Die Quelle des Video-Players wird geleert
        videoInput.value = ""; // Das Video-Input-Feld wird zurückgesetzt
        uploadButton.style.display = "block"; // Der Upload-Button wird wieder angezeigt
        removeVideoButton.style.display = "none"; // Der Entfernen-Button wird ausgeblendet
        videoPlayer.style.display = "none"; // Der Video-Player wird ausgeblendet
        controls.style.display = "none"; // Die Steuerungselemente werden ausgeblendet
        videoContainer.style.border = "2px dashed black"; // Der Container bekommt wieder einen gestrichelten Rand
        transcriptElement.innerText = ""; // Die Transkription wird gelöscht
    });

    // Diese Funktion aktualisiert die angezeigten Zeiten für Start und Ende des Schnitts
    function updateTrimTimes() {
        startInput.value = formatTime(startTrim); // Das Startzeitfeld wird formatiert und aktualisiert
        endInput.value = formatTime(endTrim); // Das Endzeitfeld wird formatiert und aktualisiert
        totalDuration.textContent = formatTime(endTrim - startTrim); // Die Gesamtdauer des Schnitts wird aktualisiert
    }

    // Diese Funktion formatiert eine Zeit (in Sekunden) in das Format MM:SS:MS
    function formatTime(seconds) {
        const min = Math.floor(seconds / 60); // Minuten berechnen
        const sec = Math.floor(seconds % 60); // Sekunden berechnen
        const ms = Math.floor((seconds % 1) * 100); // Millisekunden berechnen
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms).padStart(2, "0")}`; // Zeit im Format MM:SS.ms zurückgeben
    }

    // Wenn der Benutzer den Start-Schieberegler bewegt
    startRange.addEventListener("input", function () {
        if (parseFloat(startRange.value) >= parseFloat(endRange.value)) {
            startRange.value = parseFloat(endRange.value) - 0.01; // Startzeit muss immer vor der Endzeit liegen
        }
        startTrim = parseFloat(startRange.value); // Der Startzeitpunkt wird auf den Wert des Schiebereglers gesetzt
        updateTrimTimes(); // Die angezeigten Zeiten werden aktualisiert
    });

    // Wenn der Benutzer den End-Schieberegler bewegt
    endRange.addEventListener("input", function () {
        if (parseFloat(endRange.value) <= parseFloat(startRange.value)) {
            endRange.value = parseFloat(startRange.value) + 0.01; // Endzeit muss immer nach der Startzeit liegen
        }
        endTrim = parseFloat(endRange.value); // Der Endzeitpunkt wird auf den Wert des Schiebereglers gesetzt
        updateTrimTimes(); // Die angezeigten Zeiten werden aktualisiert
    });

    // Wenn das Video abgespielt wird und die aktuelle Zeit außerhalb des Schnitts liegt
    videoPlayer.addEventListener("timeupdate", function () {
        if (videoPlayer.currentTime < startTrim) {
            videoPlayer.currentTime = startTrim; // Wenn die Zeit vor dem Startzeitpunkt liegt, wird der Player auf den Startzeitpunkt gesetzt
        }
        if (videoPlayer.currentTime > endTrim) {
            videoPlayer.pause(); // Wenn die Zeit nach dem Endzeitpunkt liegt, wird das Video pausiert
            videoPlayer.currentTime = startTrim; // Die Wiedergabe wird zum Startzeitpunkt zurückgesetzt
        }
    });

    // Wenn der Benutzer das Startzeitfeld bearbeitet und den Fokus verliert
    startInput.addEventListener("blur", function () {
        updateTimeFromInput(startInput, "start"); // Die Eingabewerte werden verarbeitet und der Startzeitpunkt wird aktualisiert
    });

    // Wenn der Benutzer das Endzeitfeld bearbeitet und den Fokus verliert
    endInput.addEventListener("blur", function () {
        updateTimeFromInput(endInput, "end"); // Die Eingabewerte werden verarbeitet und der Endzeitpunkt wird aktualisiert
    });

    // Diese Funktion verarbeitet die Eingabewerte und aktualisiert den Start- oder Endzeitpunkt
    function updateTimeFromInput(input, type) {
        let value = input.value; // Der Wert aus dem Eingabefeld wird gespeichert
        value = value.replace(/[^0-9:.]/g, ""); // Ungültige Zeichen werden entfernt

        const parts = value.split(":"); // Der Wert wird in Minuten, Sekunden und Millisekunden unterteilt
        let minutes = "00";
        let seconds = "00";
        let milliseconds = "00";

        if (parts[0]) minutes = parts[0].padStart(2, "0"); // Minuten werden gesetzt
        if (parts[1]) {
            let secondParts = parts[1].split(".");
            seconds = secondParts[0].padStart(2, "0"); // Sekunden werden gesetzt
            if (secondParts[1]) milliseconds = secondParts[1].padEnd(2, "0"); // Millisekunden werden gesetzt
        }

        if (parseInt(seconds) > 59) seconds = "59"; // Wenn die Sekunden größer als 59 sind, werden sie auf 59 gesetzt
        if (parseInt(minutes) > 59) minutes = "59"; // Wenn die Minuten größer als 59 sind, werden sie auf 59 gesetzt

        const formattedTime = `${minutes}:${seconds}.${milliseconds}`; // Formatierte Zeit wird zusammengesetzt
        input.value = formattedTime; // Das Eingabefeld wird mit der formatierten Zeit aktualisiert

        let totalSeconds = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 100; // Gesamte Zeit in Sekunden berechnen

        if (type === "start") {
            startTrim = Math.min(totalSeconds, videoPlayer.duration); // Der Startzeitpunkt wird aktualisiert
        } else {
            endTrim = Math.min(totalSeconds, videoPlayer.duration); // Der Endzeitpunkt wird aktualisiert
        }

        if (startTrim >= endTrim) {
            startTrim = endTrim - 0.01; // Sicherstellen, dass der Startzeitpunkt vor dem Endzeitpunkt bleibt
        }

        startRange.value = startTrim; // Der Wert des Start-Schiebereglers wird aktualisiert
        endRange.value = endTrim; // Der Wert des End-Schiebereglers wird aktualisiert
        updateTrimTimes(); // Die angezeigten Zeiten werden aktualisiert
    }

    // Diese Funktion formatiert die Zeitstempel in Stunden:Minuten:Sekunden.Millisekunden
    function formatTimestamp(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = (seconds % 60).toFixed(2);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(5, "0")}`;
    }

    // Wenn der Benutzer auf den Transkriptions-Button klickt
    transcriptButton.addEventListener("click", function () {
        const formData = new FormData(); // Ein neues FormData-Objekt wird erstellt
        formData.append("video", videoFile); // Die Videodatei wird zum FormData hinzugefügt

        // Die Start- und Endzeit werden formatiert und zum FormData hinzugefügt
        const startTrimFormatted = formatTimestamp(startTrim);
        const endTrimFormatted = formatTimestamp(endTrim);
        formData.append("start", startTrimFormatted);
        formData.append("end", endTrimFormatted);

        // Eine POST-Anfrage wird an den Server gesendet, um die Transkription zu erhalten
        fetch("/transcribe", {
            method: "POST",
            body: formData, // Die Formulardaten (Video und Zeitbereich) werden gesendet
        })
            .then((response) => response.json()) // Die Antwort wird als JSON verarbeitet
            .then((data) => {
                transcriptElement.innerText = data.transcript; // Die Transkription wird im entsprechenden HTML-Element angezeigt
            })
            .catch((error) => console.error("Error:", error)); // Fehler werden in der Konsole ausgegeben
    });


});
