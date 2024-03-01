package com.example.summaryservice;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class GptController {

    private final GptService gptService;

    public GptController(GptService gptService) {
        this.gptService = gptService;
    }
    
    @PostMapping("/summarize")
    public ResponseEntity<?> summarize(@RequestBody SummaryRequest summaryRequest) {
        try {
            String summary = gptService.summarizeText(summaryRequest.getText(), summaryRequest.getTone(), summaryRequest.getSentenceLength(), summaryRequest.getIncludeReferences());
            return ResponseEntity.ok(summary); 
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }
}
