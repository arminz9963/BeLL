// ==================== globale Variablen ==================== //
const videoInput = document.getElementById("VideoInput");
const videoPlayer = document.getElementById("VideoPlayer");
const videoInputLabel = document.getElementById("VideoInputLabel");
const restContainer = document.getElementById("restContainer");
const geschnittenesVideoPlayBtn = document.getElementById("geschnittenesVideoPlayBtn");
const absendeBtn = document.getElementById("AbsendeBtn");
const DauerAnzeige = document.getElementById("dauerGeschnittenesVideo");
const VideoContainer = document.getElementById("VideoContainer");
let Schnitte = [];
let transkript = null;
const addNewCutBtn = document.getElementById("addNewCutBtn");
let cutSectionCount = 0 // Anzahl der Schnitte, die bisher hinzugefügt wurden
let aktuellerSchnitt = 0; // Aktueller Schnitt, der gerade bearbeitet wird beim Abspielen des geschnittenen Videos
const SchnittContainer = document.getElementById("SchnittContainer");
const BeschreibungDiv = document.getElementsByClassName("Beschreibung")[0];
const BeschreibungInput = document.getElementById("BeschreibungInput");
let warnParagraph = document.getElementById("warnParagraph1");
let warnParagraph2 = document.getElementById("warnParagraph2");



// ==================== Event Listener ==================== //

// Wird aufgerufen, wenn das Video geladen ist
videoPlayer.addEventListener("loadeddata", function () {
    const duration = videoPlayer.duration;

    // Video transkribieren
    const formData = new FormData();
    formData.append("video", videoInput.files[0]);
    // Eine Anfrage wird an den Server gesendet, um die Transkription zu erhalten
    fetch("/upload", {
        method: "POST",
        body: formData, // Die Formulardaten (Video) wird gesendet
    })
        .then((response) => response.json()) // Antwort wird als JSON geparsed
        .then(data => {
            transkript = data
        })
        .catch((error) => {
            console.error("Fehler bei der Transkription:", error);
            popup("Die Groq Server sind momentan überlastet. Bitte versuche es später erneut.");
        })
});

// Wird aufgerufen, wenn das Video ausgewählt wird
videoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) { // Überprüfen, ob eine Datei ausgewählt wurde
        const url = URL.createObjectURL(file); // Erstellt temporäre URL fürs Video
        videoPlayer.src = url;
        videoPlayer.load();
    }

    // UI anpassen, wenn ein Video ausgewählt wurde
    videoInput.style.display = "none";
    videoPlayer.style.display = "block";
    videoInputLabel.style.display = "none";
    restContainer.style.display = "block";
    geschnittenesVideoPlayBtn.style.display = "flex";
    DauerAnzeige.style.display = "block";
});


// Wird aufgerufen, wenn der Schnitt hinzuügen Button geklickt wird 
addNewCutBtn.addEventListener("click", function () {
    cutSectionCount++;
    Schnitte.push([0, videoPlayer.duration]);

    // HTML für den neuen Schnitt-Container erstellen
    const cutSection = document.createElement("div");
    cutSection.className = "cutSection bg-dark-700 rounded-lg p-4 mb-4";
    cutSection.id = `Schnitt${cutSectionCount}`;

    cutSection.innerHTML = `
    <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-medium">Schnitt ${cutSectionCount}</h3>
        <button class="deleteCutBtn bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition" style="margin-right: 20px">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        </button>
    </div>
    <div class="space-y-4">
        <div>
        <label class="block text-sm text-gray-400 mb-1">Startzeit</label>
        <div class="flex items-center gap-4">
            <input type="range" class="startRange w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" min="0" step="0.01" value="0"/>
            <input type="text" class="startInput bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-24 text-center" maxlength="8" value="00:00.00" />
        </div>
        </div>
        <div>
        <label class="block text-sm text-gray-400 mb-1">Endzeit</label>
        <div class="flex items-center gap-4">
            <input type="range" class="endRange w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" min="0" step="0.01" value="0"/>
            <input type="text" class="endInput bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-24 text-center" maxlength="8" value="00:00.01" />
        </div>
        </div>
    </div>
    `;

    SchnittContainer.append(cutSection);



    // Alle Controls für den neuen Schnitt-Container zuweisen
    const startRange = cutSection.querySelector(".startRange");
    const endRange = cutSection.querySelector(".endRange");
    const startInput = cutSection.querySelector(".startInput");
    const endInput = cutSection.querySelector(".endInput");
    const deleteCutBtn = cutSection.querySelector(".deleteCutBtn");

    // IDs für die neuen Controls setzen
    startRange.dataset.index = cutSectionCount - 1;
    endRange.dataset.index = cutSectionCount - 1;
    startInput.dataset.index = cutSectionCount - 1;
    endInput.dataset.index = cutSectionCount - 1;
    deleteCutBtn.dataset.index = cutSectionCount - 1;

    // Start- und Endzeitpunkte initialisieren
    startRange.min = 0;
    startRange.max = videoPlayer.duration - 0.01;
    startRange.value = 0;
    endRange.min = 0.01;
    endRange.max = videoPlayer.duration;
    endRange.value = videoPlayer.duration;
    endInput.value = formatTime(endRange.value);
    startInput.value = formatTime(startRange.value);

    // Event-Listener für die neuen Controls hinzufügen

    // wird aufgerufen, wenn der Start-Slider bewegt wird
    startRange.addEventListener("input", function () {
        if (parseFloat(startRange.value) >= parseFloat(endRange.value)) {
            startRange.value = parseFloat(endRange.value) - 0.01;
        }
        startInput.value = formatTime(startRange.value);
        Schnitte[startRange.dataset.index][0] = parseFloat(startRange.value);
    });

    // wird aufgerufen, wenn der End-Slider bewegt wird
    endRange.addEventListener("input", function () {
        if (parseFloat(endRange.value) <= parseFloat(startRange.value)) {
            endRange.value = parseFloat(startRange.value) + 0.01;
        }
        endInput.value = formatTime(endRange.value);
        Schnitte[endRange.dataset.index][1] = parseFloat(endRange.value);
    });

    // wird aufgerufen, wenn das Start-Eingabefeld verlassen wird
    startInput.addEventListener("blur", function () {
        const time = checkTimeFromInput(startInput.value);
        startInput.value = time;
        if (formatTimeToSeconds(time) >= parseFloat(endRange.value)) {
            startInput.value = formatTime(parseFloat(endRange.value) - 0.01);
        }
        startRange.value = formatTimeToSeconds(time);
        Schnitte[startInput.dataset.index][0] = parseFloat(startRange.value);
    });

    // wird aufgerufen, wenn das End-Eingabefeld verlassen wird
    endInput.addEventListener("blur", function () {
        const time = checkTimeFromInput(endInput.value);
        endInput.value = time;
        if (formatTimeToSeconds(time) <= parseFloat(startRange.value)) {
            endInput.value = formatTime(parseFloat(startRange.value) + 0.01);
        }
        endRange.value = formatTimeToSeconds(time);
        Schnitte[endInput.dataset.index][1] = parseFloat(endRange.value);
    });

    // wird aufgerufen, wenn der Delete-Button geklickt wird
    deleteCutBtn.addEventListener("click", function () {
        Schnitte.splice(deleteCutBtn.dataset.index, 1); // Entfernt den Schnitt aus dem Array
        SchnittContainer.removeChild(cutSection); // Entfernt den Schnitt-Container aus dem DOM
        cutSectionCount--;

        // Alle Schnitte neu nummerieren und IDs aktualisieren
        const allCutSections = SchnittContainer.querySelectorAll(".cutSection");
        allCutSections.forEach((section, newIndex) => {
            section.id = `Schnitt${newIndex + 1}`;
            section.querySelector("h3").innerText = `Schnitt ${newIndex + 1}`;
            section.querySelector(".startRange").dataset.index = newIndex;
            section.querySelector(".endRange").dataset.index = newIndex;
            section.querySelector(".startInput").dataset.index = newIndex;
            section.querySelector(".endInput").dataset.index = newIndex;
            section.querySelector(".deleteCutBtn").dataset.index = newIndex;
        });
    });



});


// Wird aufgerufen, wenn der Play-Button für das geschnittene Video geklickt wird
geschnittenesVideoPlayBtn.addEventListener("click", function () {
    aktuellerSchnitt = 0; // Startindex zurücksetzen

    // Löschen des vorherigen Event-Listeners, um Mehrfachaufrufe zu vermeiden
    videoPlayer.removeEventListener("timeupdate", onTimeUpdate);
    // wird aufgerufen, wenn die Zeit des Videos sich ändert
    videoPlayer.addEventListener("timeupdate", onTimeUpdate);

    // Starten beim ersten Schnitt
    springenZumSchnitt(aktuellerSchnitt);

    // Dauer berechnen und anzeigen
    let geschnitteneDauer = 0;
    Schnitte.forEach(([start, end]) => geschnitteneDauer += (end - start));
    DauerAnzeige.innerText = `Dauer geschnittenes Video: ${formatTime(geschnitteneDauer)}`;
});


// Wird aufgerufen, wenn der Absende-Button geklickt wird
absendeBtn.addEventListener("click", function () {

    // Wenn Warnparagraphen schon existiert, vorher löschen (damit sie nicht doppelt erscheinen)
    if (warnParagraph) {
        BeschreibungDiv.removeChild(warnParagraph);
    }
    if (warnParagraph2) {
        BeschreibungDiv.removeChild(warnParagraph2);
    }

    // Prüfen ob mindestens ein Schnitt vorhanden ist
    if (cutSectionCount < 1) {
        warnParagraph = document.createElement("p");
        warnParagraph.id = "warnParagraph1"; // ID geben zum Wiederfinden
        warnParagraph.textContent = "Bitte füge einen Schnitt hinzu!";
        BeschreibungDiv.appendChild(warnParagraph);
    }

    // Prüfen ob eine Beschreibung eingegeben wurde
    if (BeschreibungInput.value.trim() === "") {
        warnParagraph2 = document.createElement("p");
        warnParagraph2.id = "warnParagraph2"; // ID für zweiten Warntext
        warnParagraph2.textContent = "Bitte füge eine Beschreibung hinzu!";
        BeschreibungDiv.appendChild(warnParagraph2);
    }

    // Prüfen ob Transkript vorhanden ist
    if (!transkript) {
        popup("Die Transkription ist noch nicht abgeschlossen – bitte habe einen Moment Geduld und versuche es anschließend erneut.");
        return; // Abbrechen
    }

    // Daten senden, wenn Beschreibung, mindestens ein Schnitt und Transkript vorhanden ist
    if (cutSectionCount >= 1 && BeschreibungInput.value.trim() !== "" && transkript) {
        daten = {
            transkript: transkript,
            schnitte: Schnitte,
            beschreibung: String(BeschreibungInput.value)
        };

        // Senden der Daten an den Server
        fetch("/daten_senden", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(daten)
        })
            .then(() => {
                console.log("Daten erfolgreich gesendet");
                popup("Das Video wurde erfolgreich gesendet!");
                resetLayout();
            })
            .catch((error) => {
                console.error("Fehler bei der Transkription:", error);

            })
    }

});


// ==================== Funktionen ==================== //

function formatTime(seconds) {
    // Konvertiert Sekunden in das Format MM:SS.ms
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms).padStart(2, "0")}`; // Zeit im Format MM:SS.ms zurückgeben
}

function formatTimeToSeconds(timeString) {
    // Konvertiert einen Zeitstring im Format MM:SS.ms in Sekunden
    const parts = timeString.split(/[:.]/); // Teilt den String in Minuten, Sekunden und Millisekunden
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    const milliseconds = parseInt(parts[2], 10);
    return minutes * 60 + seconds + milliseconds / 100;
}

function checkTimeFromInput(inputString) {
    // Checkt, ob der eingegebene Zeitstring im Format MM:SS.ms vorliegt und ob er innerhalb der Videolänge liegt
    const regex = /^([0-9]{1,2}):([0-5][0-9])\.(\d{2})$/; // Regex für das Format MM:SS.ms
    if (regex.test(inputString)) {
        if (formatTimeToSeconds(inputString) <= videoPlayer.duration) {
            return inputString
        }
    }
    else {
        return "00:00.00"
    }
}

// Wird aufgerufen, beim Abspielen des geschnittenen Videos
// Springt zum Schnitt mit dem angegebenen Index
function springenZumSchnitt(index) {
    // Überprüfen, ob der Index gültig ist
    if (index < Schnitte.length) {
        videoPlayer.currentTime = Schnitte[index][0];
        videoPlayer.play();
    } else {
        videoPlayer.pause();
    }
}

// Wird aufegrufen, beim Abspielen des geschnittenen Videos
// Checkt, ob die aktuelle Zeit, die Endzeit des aktuellen Schnitts erreicht hat
function onTimeUpdate() {
    if (aktuellerSchnitt >= Schnitte.length) return;

    const [start, end] = Schnitte[aktuellerSchnitt];

    // Wenn aktuelle Zeit Endzeit erreicht, zum nächsten Schnitt springen
    if (videoPlayer.currentTime >= end) {
        aktuellerSchnitt++;
        springenZumSchnitt(aktuellerSchnitt);
    }
}


function resetLayout() {
    // Setzt das Layout zurück, um ein neues Video hochzuladen

    // UI zurücksetzen
    videoInput.style.display = "none";
    videoPlayer.style.display = "none";
    videoInputLabel.style.display = "flex";
    restContainer.style.display = "none";
    geschnittenesVideoPlayBtn.style.display = "none";
    DauerAnzeige.style.display = "none";

    // Video-Element zurücksetzen
    videoInput.value = "";
    videoPlayer.src = "";
    videoPlayer.currentTime = 0;

    // Alle relevanten Daten zurücksetzen
    BeschreibungInput.value = "";
    SchnittContainer.innerHTML = "";
    Schnitte = [];
    cutSectionCount = 0;
    transkript = null;

}


function popup(text) {
    // Erstellt ein Popup-Fenster mit der angegebenen Nachricht und einem OK-Button zum schließen

    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50";

    const popup = document.createElement("div");
    popup.className = "bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl";

    const message = document.createElement("p");
    message.className = "text-white mb-4 text-center";
    message.textContent = text;

    const okButton = document.createElement("button");
    okButton.className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition mt-4";
    okButton.textContent = "OK";

    okButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    popup.appendChild(message);
    popup.appendChild(okButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}
