package com.myapp.documenthandlingservice;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/document")
public class DocumentHandlingController {
	
	private final KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private DocumentHandlingService documentHandlingService;

    @Autowired
    public DocumentHandlingController(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @PostMapping("/uploadPdf")
    public ResponseEntity<String> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
        	
        	 String extractedText;
             String contentType = file.getContentType();
             
             if (contentType.equals("application/pdf")) {
                 extractedText = documentHandlingService.extractTextFromPdf(file);
             } else if (contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                 extractedText = documentHandlingService.extractTextFromWord(file);
             } else {
                 throw new IllegalArgumentException("Unsupported document type.");
             }
             System.out.println(extractedText);
           //  kafkaTemplate.send("extractedText", extractedText);
            return ResponseEntity.ok(extractedText);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process the PDF file");
        }
    }
    
    @PostMapping("/uploadText")
    public ResponseEntity<String> uploadText(@RequestBody String text) {
        try {
            return ResponseEntity.ok(text);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to process the text: " + e.getMessage());
        }
    }
}
