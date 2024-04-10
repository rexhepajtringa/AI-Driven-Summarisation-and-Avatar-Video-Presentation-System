package com.UserManagement.UserManagementService.controller;

import com.UserManagement.UserManagementService.ContentType;
import com.UserManagement.UserManagementService.model.SavedContent;
import com.UserManagement.UserManagementService.service.SavedContentService;

import jakarta.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/content")
public class SavedContentController {

    @Autowired
    private SavedContentService savedContentService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> saveContent(@PathVariable Long userId, @RequestParam("file") MultipartFile file,
                                         @RequestParam("title") String title, @RequestParam("contentType") ContentType contentType) {
        try {
            SavedContent savedContent = savedContentService.saveContent(userId, file, title, contentType);
            return ResponseEntity.ok(savedContent);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload the file.");
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("User not found.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<SavedContent> getContentById(@PathVariable Long id) {
        return savedContentService.getContentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    
    

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavedContent>> getAllContentsByUserId(@PathVariable Long userId) {
        List<SavedContent> contents = savedContentService.getAllContentsByUserId(userId);
        return ResponseEntity.ok(contents);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        savedContentService.deleteContent(id);
        return ResponseEntity.ok().build();
    }

    
    @GetMapping("/text/{id}")
    public ResponseEntity<String> getTextContentById(@PathVariable Long id) {
        Optional<SavedContent> optionalContent = savedContentService.getContentById(id);
        if (!optionalContent.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        try {
            SavedContent content = optionalContent.get();
            // Assuming getContentUrl() returns the full URL, you need to extract just the object name.
            String objectName = content.getContentUrl(); 
            String actualObjectName = objectName.substring(objectName.lastIndexOf('/') + 1);
            String textContent = savedContentService.downloadTextContent(actualObjectName);
            return ResponseEntity.ok(textContent);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    
//    @GetMapping("/content/text/{id}")
//    public ResponseEntity<String> getTextContentById(@PathVariable Long id) {
//    	return (ResponseEntity<String>) savedContentService.getContentById(id)
//    	        .map(content -> {
//    	            try {
//    	                String objectName = content.getContentUrl();
//    	                String textContent = savedContentService.downloadTextContent(objectName);
//    	                return ResponseEntity.ok(textContent);
//    	            } catch (IOException e) {
//    	                e.printStackTrace();
//    	                // This should return ResponseEntity<String> to match the return type of the method.
//    	                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//    	            }
//    	        }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
//
//    }

    
    @GetMapping("/user/{userId}/type/{contentType}")
    public ResponseEntity<List<SavedContent>> getAllContentsByUserIdAndType(@PathVariable Long userId, @PathVariable ContentType contentType) {
        try {
            List<SavedContent> contents = savedContentService.getAllContentsByUserIdAndType(userId, contentType);
            return ResponseEntity.ok(contents);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
