let videoFile;
const videoInput = document.getElementById("videoInput");
const uploadButton = document.getElementById("uploadButton");
const removeVideoButton = document.getElementById("removeVideo");
const videoPlayer = document.getElementById("videoPlayer");
const startRange = document.getElementById("startRange");
const endRange = document.getElementById("endRange");
const startInput = document.getElementById("startInput");
const endInput = document.getElementById("endInput");
const totalDuration = document.getElementById("totalDuration");
const videoContainer = document.getElementById("videoContainer");
const controls = document.getElementById("controls");
const transcriptElement = document.getElementById("transcript");

let startTrim = 0;
let endTrim = 0;

document.addEventListener("DOMContentLoaded", function () {
    videoInput.addEventListener("change", function (event) {
        videoFile = event.target.files[0];
        if (videoFile) {
            const videoURL = URL.createObjectURL(videoFile);
            videoPlayer.src = videoURL;
            uploadButton.style.display = "none";
            removeVideoButton.style.display = "block";
            videoPlayer.style.display = "block";
            controls.style.display = "block";
            videoContainer.style.border = "none";
            videoPlayer.addEventListener("loadedmetadata", () => {
                startTrim = 0;
                endTrim = videoPlayer.duration;
                startRange.min = 0;
                endRange.min = 0;
                startRange.max = videoPlayer.duration;
                endRange.max = videoPlayer.duration;
                startRange.value = startTrim;
                endRange.value = endTrim;
                totalDuration.textContent = formatTime(endTrim - startTrim);
                updateTrimTimes();
            });

            uploadVideo();
        }   
    
    });

    removeVideoButton.addEventListener("click", function () {
        videoPlayer.src = "";
        videoInput.value = "";
        uploadButton.style.display = "block";
        removeVideoButton.style.display = "none";
        videoPlayer.style.display = "none";
        controls.style.display = "none";
        videoContainer.style.border = "2px dashed black";
        transcriptElement.innerText = "";
    });

    function updateTrimTimes() {
        startInput.value = formatTime(startTrim);
        endInput.value = formatTime(endTrim);
        totalDuration.textContent = formatTime(endTrim - startTrim);
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);
        return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
    }

    startRange.addEventListener("input", function () {
        if (parseFloat(startRange.value) >= parseFloat(endRange.value)) {
            startRange.value = parseFloat(endRange.value) - 0.01;
        }
        startTrim = parseFloat(startRange.value);
        updateTrimTimes();
    });

    endRange.addEventListener("input", function () {
        if (parseFloat(endRange.value) <= parseFloat(startRange.value)) {
            endRange.value = parseFloat(startRange.value) + 0.01;
        }
        endTrim = parseFloat(endRange.value);
        updateTrimTimes();
    });

    videoPlayer.addEventListener("timeupdate", function () {
        if (videoPlayer.currentTime < startTrim) {
            videoPlayer.currentTime = startTrim;
        }
        if (videoPlayer.currentTime > endTrim) {
            videoPlayer.pause();
            videoPlayer.currentTime = startTrim;
        }
    });

    startInput.addEventListener("blur", function () {
        updateTimeFromInput(startInput, "start");
    });

    endInput.addEventListener("blur", function () {
        updateTimeFromInput(endInput, "end");
    });

    function updateTimeFromInput(input, type) {
        let value = input.value;
        value = value.replace(/[^0-9:.]/g, "");

        const parts = value.split(":");
        let minutes = "00";
        let seconds = "00";
        let milliseconds = "00";

        if (parts[0]) minutes = parts[0].padStart(2, "0");
        if (parts[1]) {
            let secondParts = parts[1].split(".");
            seconds = secondParts[0].padStart(2, "0");
            if (secondParts[1]) milliseconds = secondParts[1].padEnd(2, "0");
        }

        if (parseInt(seconds) > 59) seconds = "59";
        if (parseInt(minutes) > 59) minutes = "59";

        const formattedTime = `${minutes}:${seconds}.${milliseconds}`;
        input.value = formattedTime;

        let totalSeconds = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 100;

        if (type === "start") {
            startTrim = Math.min(totalSeconds, videoPlayer.duration);
        } else {
            endTrim = Math.min(totalSeconds, videoPlayer.duration);
        }

        if (startTrim >= endTrim) {
            startTrim = endTrim - 0.01;
        }

        startRange.value = startTrim;
        endRange.value = endTrim;

        updateTrimTimes();
    }

});

function trimVideo() {
    console.log("Start trimming video");
    
    // Überprüfen, ob startTrim und endTrim gültig sind:
    console.log("Start Trim:", startTrim);
    console.log("End Trim:", endTrim);
    
    // Weitere Überprüfungen der URL oder der zu sendenden Daten
    const videoData = { start: startTrim, end: endTrim };
    console.log("Video Data to send:", videoData);

    // Hier könnte eine Fetch-Anfrage an den Server sein:
    fetch(`/trim_video`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(videoData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Video trimmed", data);
    })
    .catch(error => console.error('Error:', error));
}


function uploadVideo() {
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("start_time", startTrim);
    formData.append("end_time", endTrim);

    fetch("/upload", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log("Transkript:", data.transcript);
        transcriptElement.innerText = data.transcript;
        // Zeige das geschnittene Video
        videoPlayer.src = data.output_video;
        videoPlayer.style.display = "block";
    })
    .catch(error => {
        console.error("Fehler:", error);
    });
}
