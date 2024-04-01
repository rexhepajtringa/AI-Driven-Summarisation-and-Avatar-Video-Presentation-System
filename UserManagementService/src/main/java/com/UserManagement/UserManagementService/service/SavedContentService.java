package com.UserManagement.UserManagementService.service;

import com.UserManagement.UserManagementService.ContentType;
import com.UserManagement.UserManagementService.model.SavedContent;
import com.UserManagement.UserManagementService.model.User;
import com.UserManagement.UserManagementService.repository.SavedContentRepository;
import com.UserManagement.UserManagementService.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SavedContentService {

    @Autowired
    private SavedContentRepository savedContentRepository;

    @Autowired
    private UserRepository userRepository;

    public SavedContent saveContent(Long userId, SavedContent content) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            content.setUser(userOptional.get());
            content.setCreatedAt(LocalDateTime.now());
            return savedContentRepository.save(content);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public Optional<SavedContent> getContentById(Long id) {
        return savedContentRepository.findById(id);
    }

    public List<SavedContent> getAllContentsByUserId(Long userId) {
        return savedContentRepository.findAllByUserId(userId);
    }

    public void deleteContent(Long id) {
        savedContentRepository.deleteById(id);
    }
    
    public List<SavedContent> getContentsByUserIdAndType(Long userId, ContentType contentType) {
        return savedContentRepository.findAllByUserIdAndContentType(userId, contentType);
    }
}
