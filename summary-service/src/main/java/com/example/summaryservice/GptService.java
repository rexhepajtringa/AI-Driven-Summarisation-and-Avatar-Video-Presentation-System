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

    public String summarizeText(String inputText, String tone, Integer sentenceLength, Boolean includeReferences) throws JsonProcessingException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        int maxTokens = sentenceLength != null ? sentenceLength * 50 : 200; 
        
        String prompt = String.format("Summarize the following text in a %s tone:", tone);
        
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", prompt));
        messages.add(Map.of("role", "user", "content", inputText));

        if (includeReferences != null && includeReferences) {
            messages.add(Map.of("role", "system", "content", "Please include references."));
        }

        Map<String, Object> payload = Map.of(
            "model", "gpt-3.5-turbo",
            "max_tokens", maxTokens,
            "messages", messages
        );

        ObjectMapper objectMapper = new ObjectMapper();
        String body = objectMapper.writeValueAsString(payload);

        HttpEntity<String> request = new HttpEntity<>(body, headers);

        String responseJson = restTemplate.postForEntity(openAiUrl, request, String.class).getBody();
        return extractContentFromResponse(responseJson);         
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