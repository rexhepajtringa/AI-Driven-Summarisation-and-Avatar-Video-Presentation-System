package com.example.summaryservice;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GptService {

    private final RestTemplate restTemplate;
    private final String openAiUrl = "https://api.openai.com/v1/chat/completions";
    private final String apiKey = "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"; 

    public GptService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String summarizeText(String inputText, String tone, String summaryLength, Boolean includeReferences) throws JsonProcessingException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        if (summaryLength == null) {
            summaryLength = "medium";
        }

        Map<String, String> lengthInstructions = Map.of(
            "very short", "in a very concise manner, aiming for a 10 second speech.",
            "short", "concisely, aiming for 20 second speech.",
            "medium", "with a moderate level of detail, aiming for a 30 second speech.",
            "long", "in a lot of detail, aiming for a speech up to 1 minute."
        );

        String lengthInstruction = lengthInstructions.getOrDefault(summaryLength.toLowerCase(), "with a moderate level of detail, aiming for around four sentences");

        String referencesInstruction = includeReferences != null && includeReferences
                                       ? " Support your speech with references in a natural-speaking manner."
                                       : "";

        String prompt = String.format("You are a summarizer that prepares text as scripts for video presentations. Remember, the summarized text will not be for reading, it will be for a speaking video. Summarize the following text in a %s speaking tone, %s.%s", tone, lengthInstruction, referencesInstruction);
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", prompt));
        messages.add(Map.of("role", "user", "content", inputText));

        Map<String, Object> payload = Map.of(
            "model", "gpt-3.5-turbo",
            "max_tokens", 500,
            "messages", messages
        );

        ObjectMapper objectMapper = new ObjectMapper();
        String body = objectMapper.writeValueAsString(payload);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> responseEntity = restTemplate.postForEntity(openAiUrl, request, String.class);
            return extractContentFromResponse(responseEntity.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while summarizing text", e);
        }
    }

    private String extractContentFromResponse(String jsonResponse) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        
        JsonNode choicesNode = rootNode.path("choices");
        if (!choicesNode.isEmpty() && choicesNode.isArray() && choicesNode.has(0)) {
            JsonNode firstChoiceNode = choicesNode.get(0);
            JsonNode messageNode = firstChoiceNode.path("message");
            JsonNode contentNode = messageNode.path("content");
            if (!contentNode.isMissingNode()) {
                return contentNode.asText();
            }
        }
        return "No content found";
    }

}
