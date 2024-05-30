package com.UserManagement.UserManagementService.repository;

import com.UserManagement.UserManagementService.ContentType;
import com.UserManagement.UserManagementService.model.SavedContent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import java.util.List;

public interface SavedContentRepository extends JpaRepository<SavedContent, Long> {
    List<SavedContent> findAllByUserId(Long userId);

    List<SavedContent> findAllByUserIdAndContentType(Long userId, ContentType contentType);

    Optional<SavedContent> findByUserIdAndId(Long userId, Long id);

}
