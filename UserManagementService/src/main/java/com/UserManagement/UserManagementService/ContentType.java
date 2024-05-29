package com.UserManagement.UserManagementService;

public enum ContentType {
    TEXT("text/plain"),
    AUDIO("audio/mpeg"), 
    VIDEO("video/mp4");   

    private final String mediaType;

    ContentType(String mediaType) {
        this.mediaType = mediaType;
    }

    public String getMediaType() {
        return this.mediaType;
    }
}
