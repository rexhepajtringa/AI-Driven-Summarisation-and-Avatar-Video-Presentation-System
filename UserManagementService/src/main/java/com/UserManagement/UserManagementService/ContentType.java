package com.UserManagement.UserManagementService;

public enum ContentType {
    TEXT("text/plain"),
    AUDIO("audio/mpeg"),  // You may adjust the MIME type based on the specific audio format you expect (e.g., audio/wav)
    VIDEO("video/mp4");   // Adjust the MIME type based on the specific video format you expect (e.g., video/webm)

    private final String mediaType;

    ContentType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getMediaType() {
        return this.mediaType;
    }
}
