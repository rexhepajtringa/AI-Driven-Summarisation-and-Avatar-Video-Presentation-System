package com.example.summaryservice;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class GptController {

    private final GptService gptService;

    public GptController(GptService gptService) {
        this.gptService = gptService;
    }

    @PostMapping("/summarize")
    public String summarize(@RequestBody String text) {
        try {
            return gptService.summarizeText(text);
        } catch (Exception e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
