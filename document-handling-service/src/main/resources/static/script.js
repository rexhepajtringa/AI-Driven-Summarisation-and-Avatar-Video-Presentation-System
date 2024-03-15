document.addEventListener('DOMContentLoaded', function() {
	function autoGrowTextArea(textArea) {
		textArea.style.height = 'auto';
		textArea.style.height = textArea.scrollHeight + 'px';
	}

	var outputTextArea = document.getElementById('output');
	outputTextArea.addEventListener('input', function() {
		autoGrowTextArea(outputTextArea);
	});

	var summaryTextArea = document.getElementById('summaryOutput');
	summaryTextArea.addEventListener('input', function() {
		autoGrowTextArea(summaryTextArea);
	});

	document.getElementById('uploadBtn').addEventListener('click', function() {
		var fileInput = document.getElementById('fileInput');

		if (fileInput.files.length > 0) {
			sendFile(fileInput.files[0]);
		} else {
			alert("Please select a file to upload.");
		}
	});

	function sendFile(file) {
		var url = "http://localhost:8765/DOCUMENT-HANDLING-SERVICE/api/document/uploadPdf";

		var formData = new FormData();
		formData.append("file", file);

		fetch(url, {
			method: 'POST',
			body: formData
		})
			.then(response => response.text())
			.then(data => {
				document.getElementById("output").value = data;
				autoGrowTextArea(document.getElementById("output"));
			})
			.catch(error => console.error('Error:', error));
	}

	document.getElementById("summarizeBtn").addEventListener("click", function() {
		var text = document.getElementById("output").value;
		var tone = document.getElementById("toneSelect").value;
		var length = parseInt(document.getElementById("lengthInput").value);
		var includeReferences = document.getElementById("includeReferences").checked;

		if (text) {
			sendTextForSummarization(text, tone, length, includeReferences);
		} else {
			alert("Please upload text before summarizing");
		}
	});

	function sendTextForSummarization(text, tone, length, includeReferences) {
		var url = "http://localhost:8765/SUMMARY-SERVICE/api/summarize";

		var payload = {
			text: text,
			tone: tone,
			length: length,
			includeReferences: includeReferences
		};

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then(response => {
				if (response.ok) {
					return response.text();
				} else {
					throw new Error('Server response wasn\'t OK');
				}
			})
			.then(summaryText => {
				document.getElementById("summaryOutput").value = summaryText;
				autoGrowTextArea(document.getElementById("summaryOutput"));
			})
			.catch(error => console.error('Error:', error));
	}
	
	
	
document.getElementById('speakBtn').addEventListener('click', function() {
	var text = document.getElementById("summaryOutput").value;
	if (!text) {
		alert("Please generate a summary to speak.");
		return;
	}
	sendTextToSpeech(text);
});


summaryOutput.addEventListener('input', function() {
    // Show the 'Speak' button when the text changes
    document.getElementById('speakBtn').style.display = 'inline-block'; // or 'block', depending on your layout
    // Hide the audio player container
    document.getElementById('audioPlayerContainer').style.display = 'none';
    
    // Optionally, stop and clear the current audio if it's playing
    var audioPlayer = document.getElementById('audioPlayer');
    if (!audioPlayer.paused) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    audioPlayer.src = ''; // Clear the current source
	autoGrowTextArea(summaryTextArea);
});

let audioBlob = null; // Global reference to the audio blob

function sendTextToSpeech(text) {
    var url = "http://localhost:8765/TEXT-TO-VOICE-SERVICE/text-to-speech";
    var payload = { text: text };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => response.blob())
        .then(blob => {
            audioBlob = blob; // Save the blob for later
            var audioURL = window.URL.createObjectURL(blob);
            var audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.src = audioURL;
            audioPlayer.play();
            
            // Hide the Speak button and show the audio player with controls
            document.getElementById('speakBtn').style.display = 'none';
            var audioPlayerContainer = document.getElementById('audioPlayerContainer');
            audioPlayerContainer.style.display = 'block';
            
            // Enable the upload button for the avatar video service
            document.getElementById('uploadAvatarBtn').disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('speakBtn').style.display = 'inline-block';
            var audioPlayerContainer = document.getElementById('audioPlayerContainer');
            audioPlayerContainer.style.display = 'none';
        });
}

 const imageInput = document.getElementById('imageInput');
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const outputVideo = document.getElementById('outputVideo');
    
    // Event listener for the image and audio upload button
    uploadAvatarBtn.addEventListener('click', function() {
        const imageFile = imageInput.files[0];
        
        if (!imageFile || !audioBlob) {
            alert("Please select both an image and an audio file.");
            return;
        }
        
        uploadAvatarVideo(imageFile, audioBlob);
    });
    
    // Function to upload the image and audio and retrieve the video URL
    function uploadAvatarVideo(imageFile, audioBlob) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('audio', audioBlob, 'audio.mp3');
        console.log(formData);
        fetch('http://localhost:8765/AVATAR-VIDEO-SERVICE/lip-sync', { // Make sure this matches the Flask server's URL and port
            method: 'POST',
            body: formData
            // Note: Don't set the Content-Type header manually, the browser will do it with the correct boundary
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if(data.output_video_url) {
                outputVideo.src = data.output_video_url;
                outputVideo.load(); // Load the new video URL
                outputVideo.play(); // Play the video
            } else {
                throw new Error('No video URL in response');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

});
