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
const transcriptButton = document.getElementById("transcriptButton");

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

    function formatTimestamp(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = (seconds % 60).toFixed(2);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(5, "0")}`;
    }

    transcriptButton.addEventListener("click", function () {
        const formData = new FormData();
        formData.append("video", videoFile);

        const startTrimFormatted = formatTimestamp(startTrim);
        const endTrimFormatted = formatTimestamp(endTrim);

        formData.append("start", startTrimFormatted);
        formData.append("end", endTrimFormatted);

        fetch("/transcribe", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                transcriptElement.innerText = data.transcript;
            })            
            .catch((error) => console.error("Error:", error));
    });    
});

