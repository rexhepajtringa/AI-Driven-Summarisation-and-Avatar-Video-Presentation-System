package com.example.summaryservice;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@Service
public class GptService {

    private final RestTemplate restTemplate;
    private final String openAiUrl = "https://api.openai.com/v1/chat/completions";
    private final String apiKey = "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"; // Ensure to secure your API key
    
    @Autowired
    private SummaryWebSocketService summaryWebSocketService; // WebSocket service to send summaries to the frontend

    public GptService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String summarizeText(String inputText) throws JsonProcessingException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        ObjectMapper objectMapper = new ObjectMapper();
        String body = objectMapper.writeValueAsString(Map.of(
            "model", "gpt-3.5-turbo",
            "messages", List.of(
                Map.of("role", "system", "content", "Summarize the following text:"),
                Map.of("role", "user", "content", inputText)
            )
        ));

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(openAiUrl, request, String.class);
        
        String summary = extractContentFromResponse(response.getBody());
        
        // Send summary to frontend via WebSocket
        summaryWebSocketService.sendSummary(summary);
        
        return summary;
    }
    
    public String extractContentFromResponse(String jsonResponse) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        
        // Navigate through the JSON structure to get to the content you want
        JsonNode choicesNode = rootNode.path("choices");
        if (!choicesNode.isEmpty() && choicesNode.isArray() && choicesNode.has(0)) {
            JsonNode firstChoiceNode = choicesNode.get(0);
            JsonNode messageNode = firstChoiceNode.path("message");
            JsonNode contentNode = messageNode.path("content");
            if (!contentNode.isMissingNode()) {
                // Return the text content
                return contentNode.asText();
            }
        }
        return "No content found"; // Fallback message if the content couldn't be extracted
    }

}


