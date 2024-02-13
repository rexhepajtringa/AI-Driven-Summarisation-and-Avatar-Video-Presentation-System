document.getElementById("submitBtn").addEventListener("click", function() {
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
