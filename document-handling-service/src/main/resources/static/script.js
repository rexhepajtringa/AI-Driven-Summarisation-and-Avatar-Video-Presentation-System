document.getElementById("uploadBtn").addEventListener("click", function() {
    var textInput = document.getElementById("textInput").value;
    var fileInput = document.getElementById("fileInput").files[0];
    
    if (textInput) {
        sendText(textInput);
    } else if (fileInput) {
        sendFile(fileInput);
    } else {
        alert("Please enter text or upload a file");
    }
});

function sendText(text) {
    // Replace with your endpoint for handling text
    var url = "http://localhost:8080/api/document/uploadText";
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: text
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("output").value = data;
    })
    .catch(error => console.error('Error:', error));
}

function sendFile(file) {
    // Replace with your endpoint for handling file uploads
    var url = "http://localhost:8080/api/document/uploadPdf";
    
    var formData = new FormData();
    formData.append("file", file);

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById("output").value = data;
    })
    .catch(error => console.error('Error:', error));
}

// Include SockJS library from a CDN


// Then, establish a connection using SockJS
var sock = new SockJS('https://localhost:8100/ws');

sock.onopen = function() {
    console.log('Connection to SockJS established');
        sock.send(JSON.stringify({ action: "subscribe", topic: "/topic/summary" }));

};

sock.onmessage = function(e) {
    console.log('Message:', e.data);
    var message = JSON.parse(e.data);
    if (message.topic === "/topic/summary") {
        document.getElementById("summaryOutput").value = message.summary; // Assuming the message contains a 'summary' field
    }
};

sock.onclose = function() {
    console.log('Close SockJS connection');
};



sock.onerror = function(error) {
    console.log(`WebSocket error: ${error.message}`);
};

document.getElementById("summarizeBtn").addEventListener("click", function() {
    var text = document.getElementById("output").value;
    if (!text) {
        alert("Please upload text or a file and convert it to text before summarizing.");
    }
    // No need to send POST request here. The backend will handle summarization based on Kafka messages.
});



/*
document.getElementById("summarizeBtn").addEventListener("click", function() {
    var text = document.getElementById("output").value;
    if (text) {
        sendTextForSummarization(text);
    } else {
        alert("Please upload text before summarizing");
    }
});

function sendTextForSummarization(text) {
    var url = "http://localhost:8100/api/summarize";
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("summaryOutput").value = data.summary;
    })
    .catch(error => console.error('Error:', error));
 */

