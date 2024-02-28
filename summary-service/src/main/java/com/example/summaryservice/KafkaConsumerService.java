package com.example.summaryservice;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class KafkaConsumerService {

    private final GptService gptService;

    @Autowired
    public KafkaConsumerService(GptService gptService) {
        this.gptService = gptService;
    }

    @KafkaListener(topics = "extractedText", groupId = "document-handler")
    public void consume(String message) {
        try {
            // No need to parse JSON, assuming message is plain text
            System.out.println(message);
            String summary = gptService.summarizeText(message);
            System.out.println(summary);
            // Note: Assuming summarizeText method handles WebSocket ommunication
        } catch (Exception e) {
            e.printStackTrace();
            // Log the error or handle it appropriately
        }
    }
}