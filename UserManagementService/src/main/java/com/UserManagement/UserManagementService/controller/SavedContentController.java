package com.UserManagement.UserManagementService.controller;

import com.UserManagement.UserManagementService.ContentType;
import com.UserManagement.UserManagementService.model.SavedContent;
import com.UserManagement.UserManagementService.service.SavedContentService;

import jakarta.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavedContent>> getAllContentsByUserId(@PathVariable Long userId) {
        List<SavedContent> contents = savedContentService.getAllContentsByUserId(userId);
        return ResponseEntity.ok(contents);
    }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
    // savedContentService.deleteContent(id);
    // return ResponseEntity.ok().build();
    // }

    @GetMapping("/content/{id}")
    public ResponseEntity<?> getContentById(@PathVariable Long id) {
        Optional<SavedContent> optionalContent = savedContentService.getContentById(id);
        if (!optionalContent.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        try {
            SavedContent content = optionalContent.get();
            String objectName = content.getContentUrl().substring(content.getContentUrl().lastIndexOf('/') + 1);

            switch (content.getContentType()) {
                case TEXT:
                    String textContent = savedContentService.downloadTextContent(objectName);
                    return ResponseEntity.ok(textContent);

                case VIDEO:
                case AUDIO:
                    byte[] data = savedContentService.downloadContent(objectName);
                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(content.getContentType().getMediaType()))
                            .body(data);

                default:
                    return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to download content.");
        }
    }

    @DeleteMapping("/database/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {
        try {
            savedContentService.deleteContent(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/user/{userId}/content/{contentId}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long userId, @PathVariable Long contentId) {
        try {
            savedContentService.deleteContentByUserIdAndContentId(userId, contentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/type/{contentType}")
    public ResponseEntity<List<SavedContent>> getAllContentsByUserIdAndType(@PathVariable Long userId,
            @PathVariable ContentType contentType) {
        try {
            List<SavedContent> contents = savedContentService.getAllContentsByUserIdAndType(userId, contentType);
            return ResponseEntity.ok(contents);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
