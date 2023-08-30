let mediaRecorder;
let audioChunks = [];
let currentRecordingId;
let recordingToDelete = null; // To hold the name of the recording selected for deletion

async function startRecording() {
    document.getElementById("analysisOutput").innerText = ''; // Clear the analysis text
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = document.querySelector("#audioPlayer");
            audio.src = audioUrl;
            saveAudio(audioBlob);
        };
        
        mediaRecorder.start();
        startTimer();
        // Update button styles
        const startButton = document.querySelector("button[onclick='startRecording()']");
        const stopButton = document.querySelector("button[onclick='stopRecording()']");
        startButton.disabled = true;
        stopButton.classList.add("crimson");
        stopButton.disabled = false;
    } catch (err) {
        console.error("Error accessing the microphone:", err);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        stopTimer();
    }
    
    // Reset button styles
    const startButton = document.querySelector("button[onclick='startRecording()']");
    const stopButton = document.querySelector("button[onclick='stopRecording()']");
    startButton.disabled = false;
    stopButton.classList.remove("crimson");
    stopButton.disabled = true;
    
    // Show the naming modal after stopping the recording
    showNamingModal();
}   

/*function saveAudio(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recordedAudio.wav");

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentRecordingId = data.id;
            document.getElementById("renameUI").style.display = "block";
            refreshRecordingsList();
        } else {
            console.error("Error uploading audio:", data.message);
        }
    });
}

function renameRecording() {
    const newName = document.getElementById("renameInput").value;
    fetch(`/rename/${currentRecordingId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newName: newName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("renameUI").style.display = "none";
            refreshRecordingsList();
        } else {
            console.error("Error renaming recording:", data.message);
        }
    });
}*/

function showNamingModal() {
    const defaultName = "snoofus-" + Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
    document.getElementById("recordingName").value = defaultName;
    document.getElementById("namingModal").style.display = "block";
}

function showDiscardConfirmation() {
    document.getElementById("namingModal").style.display = "none";
    document.getElementById("discardModal").style.display = "block";
}

function saveRecordingWithName() {
    const recordingName = document.getElementById("recordingName").value;
    saveAudioWithName(currentRecordingBlob, recordingName);
    document.getElementById("namingModal").style.display = "none";
}

function discardRecording() {
    document.getElementById("discardModal").style.display = "none";
    currentRecordingBlob = null;  // Discard the current recording blob
}

function saveAudio(blob) {
    currentRecordingBlob = blob;
}

function saveAudioWithName(blob, name) {
    const formData = new FormData();
    formData.append("audio", blob, `${name}.wav`);

    fetch("/saveRecording", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Recording saved successfully!");
            refreshRecordingsList(name);  // Pass the name of the saved recording
        } else {
            alert("Error saving recording: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error saving recording:", error);
        alert("An error occurred while saving the recording.");
    });
}


function refreshRecordingsList(selectedName) {
    fetch("/getRecordings")
    .then(response => response.json())
    .then(data => {
        const recordingsDropdown = document.getElementById("recordingsDropdown");
        recordingsDropdown.innerHTML = "<option value=''>None</option>";  // Reset to default option

        data.recordings.forEach(recording => {
            recordingsDropdown.innerHTML += `<option value="${recording.name}">${recording.name}</option>`;
        });

        if (selectedName) {
            recordingsDropdown.value = selectedName;  // Set the selected option to the recent recording name
        }
        clearAnalysisAndToggleButtons();
    });
}

function updateAudioPlayer() {
    const recordingsDropdown = document.getElementById("recordingsDropdown");
    const selectedRecording = recordingsDropdown.value;
    const audioPlayer = document.getElementById("audioPlayer");

    if (selectedRecording) {
        audioPlayer.src = `/uploads/${selectedRecording}.wav`;
    } else {
        audioPlayer.src = "";  // Clear the source if "None" is selected
    }
    clearAnalysisAndToggleButtons();
}

function clearAnalysisAndToggleButtons() {
    document.getElementById("analysisOutput").innerText = ''; // Clear the analysis text
    toggleButtons();
}

function toggleButtons() {
    const recordingsDropdown = document.getElementById("recordingsDropdown");
    const actionsDiv = document.getElementById("actions");
    if (recordingsDropdown.options.length > 0) {
        actionsDiv.style.display = "block";
    } else {
        actionsDiv.style.display = "none";
    }
}

function analyzeSelectedRecording() {
    const selectedRecording = document.getElementById("recordingsDropdown").value;
    if (selectedRecording) {
        // Show the modal
        showModal();
        
        fetch(`/analyze/${selectedRecording}`)
        .then(response => response.json())
        .then(data => {
            closeModal(); // Close the modal after analysis
            if (data.success) {
                document.getElementById("analysisOutput").innerText = data.analysis;
            } else {
                document.getElementById("analysisOutput").innerText = "Error during analysis: " + data.message;
            }
        });
    }
}

function confirmDeleteFor(selectedRecording) {
    recordingToDelete = selectedRecording;
    document.getElementById("deleteModal").style.display = "block";
}

function confirmDeleteAll() {
    recordingToDelete = "all";
    document.getElementById("deleteModal").style.display = "block";
}

function confirmDelete() {
    if (recordingToDelete === "all") {
        // Logic to delete all recordings
        deleteAllRecordings();
    } else {
        // Logic to delete the selected recording
        deleteRecording(recordingToDelete);
    }
    closeDeleteModal();
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
    recordingToDelete = null;
}

function deleteRecording(name) {
    // Make a POST request to delete a specific recording
    fetch(`/deleteRecording/${name}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            // Refresh the recordings list or provide some feedback to the user
            location.reload();
        } else {
            alert('Error deleting recording.');
        }
    });
}

function deleteAllRecordings() {
    // Make a POST request to delete all recordings
    fetch('/deleteAllRecordings', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            // Refresh the recordings list or provide some feedback to the user
            location.reload();
        } else {
            alert('Error deleting all recordings.');
        }
    });
}

const catImages = [ // List of cat image filenames in the static directory
    "cat1.png",
    "cat2.png",
    "cat3.png",
    "cat4.png",
    "cat5.png",
    "cat6.png",
    "cat7.png",
    "cat8.png"
    // ... add more filenames as needed ...
];

function randomCatImage() {
    const randomIndex = Math.floor(Math.random() * catImages.length);
    return "static/" + catImages[randomIndex];
}

function showModal() {
    const modal = document.getElementById("analysisModal");
    const catImageElement = modal.querySelector(".cat-image");
    catImageElement.src = randomCatImage();  // Set the source of the image to a random cat image
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("analysisModal");
    modal.style.display = "none";
}

function deleteSelectedRecording() {
    const selectedRecording = document.getElementById("recordingsDropdown").value;
    if (selectedRecording) {
        fetch(`/delete/${selectedRecording}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Recording '${selectedRecording}' deleted successfully!`);
                refreshRecordingsList();
            } else {
                alert("Error during deletion:", data.message);
            }
        });
    }
}

// Add a timer
let recordingInterval;
let seconds = 0;
let minutes = 0;

function startTimer() {
    // Reset the timer to zero
    seconds = 0;
    minutes = 0;
    document.getElementById("timer").innerText = "00:00";

    recordingInterval = setInterval(function() {
        seconds++;
        if (seconds >= 60) {
            minutes++;
            seconds = 0;
        }
        document.getElementById("timer").innerText = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(recordingInterval);
    // Do not reset the timer here. Let it display the last counted value.
}
