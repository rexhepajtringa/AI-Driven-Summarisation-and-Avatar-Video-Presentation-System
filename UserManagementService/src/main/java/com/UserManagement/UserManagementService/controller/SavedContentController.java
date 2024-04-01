package com.UserManagement.UserManagementService.controller;

import com.UserManagement.UserManagementService.ContentType;
import com.UserManagement.UserManagementService.model.SavedContent;
import com.UserManagement.UserManagementService.service.SavedContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/content")
public class SavedContentController {

    @Autowired
    private SavedContentService savedContentService;

    @PostMapping("/{userId}")
    public ResponseEntity<SavedContent> saveContent(@PathVariable Long userId, @RequestBody SavedContent content) {
        try {
            SavedContent savedContent = savedContentService.saveContent(userId, content);
            System.out.println(savedContent);

            return ResponseEntity.ok(savedContent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
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
    
    @GetMapping("/user/{userId}/type/{contentType}")
    public ResponseEntity<List<SavedContent>> getContentsByUserIdAndType(@PathVariable Long userId, @PathVariable String contentType) {
        try {
            ContentType type = ContentType.valueOf(contentType.toUpperCase());
            List<SavedContent> contents = savedContentService.getContentsByUserIdAndType(userId, type);
            return ResponseEntity.ok(contents);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
