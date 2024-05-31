package com.example.summaryservice;

public class SummaryRequest {
    private String text;
    private String tone;
    private String sentenceLength;
    private Boolean includeReferences;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTone() {
        return tone;
    }

    public void setTone(String tone) {
        this.tone = tone;
    }

    public String getSentenceLength() {
        return sentenceLength;
    }

    public void setSentenceLength(String sentenceLength) {
        this.sentenceLength = sentenceLength;
    }

    public Boolean getIncludeReferences() {
        return includeReferences;
    }

    public void setIncludeReferences(Boolean includeReferences) {
        this.includeReferences = includeReferences;
    }
}
