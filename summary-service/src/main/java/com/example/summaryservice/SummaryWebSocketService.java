package com.example.summaryservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class SummaryWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public SummaryWebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendSummary(String summary) {
        // Assuming you have a WebSocket configuration that defines a broker with "/topic" endpoint
        messagingTemplate.convertAndSend("/topic/summary", summary);
    }
}
