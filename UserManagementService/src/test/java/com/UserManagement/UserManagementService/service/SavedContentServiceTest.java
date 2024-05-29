package com.UserManagement.UserManagementService.service;

import com.UserManagement.UserManagementService.ContentType;
import com.UserManagement.UserManagementService.Role;
import com.UserManagement.UserManagementService.model.SavedContent;
import com.UserManagement.UserManagementService.model.User;
import com.UserManagement.UserManagementService.repository.SavedContentRepository;
import com.UserManagement.UserManagementService.repository.UserRepository;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.Storage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class SavedContentServiceTest {

    @InjectMocks
    private SavedContentService savedContentService;

    @Mock
    private SavedContentRepository savedContentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Storage storage;

    private User user;
    private SavedContent savedContent;
    private MultipartFile file;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new User("testuser", "password", "testuser@example.com", Role.USER, LocalDateTime.now(), LocalDateTime.now());
        savedContent = new SavedContent();
        savedContent.setTitle("Test Title");
        savedContent.setContentUrl("https://storage.googleapis.com/summarizer_user_content/test-file.txt");
        savedContent.setContentType(ContentType.TEXT);
        savedContent.setUser(user);
        savedContent.setCreatedAt(LocalDateTime.now());
        file = mock(MultipartFile.class);
    }

  

    @Test
    public void whenSaveContentWithNonExistentUser_thenThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            savedContentService.saveContent(1L, file, "Test Title", ContentType.TEXT);
        });
    }

    @Test
    public void whenGetAllContentsByUserId_thenReturnContentList() {
        when(savedContentRepository.findAllByUserId(1L)).thenReturn(List.of(savedContent));

        List<SavedContent> contents = savedContentService.getAllContentsByUserId(1L);

        assertThat(contents.size()).isEqualTo(1);
        assertThat(contents.get(0).getTitle()).isEqualTo("Test Title");
    }

    @Test
    public void whenGetContentById_thenReturnContent() {
        when(savedContentRepository.findById(1L)).thenReturn(Optional.of(savedContent));

        Optional<SavedContent> result = savedContentService.getContentById(1L);

        assertThat(result.isPresent()).isTrue();
        assertThat(result.get().getTitle()).isEqualTo("Test Title");
    }

    @Test
    public void whenDeleteContent_thenRepositoryDeletes() {
        doNothing().when(savedContentRepository).deleteById(1L);

        savedContentService.deleteContent(1L);

        verify(savedContentRepository, times(1)).deleteById(1L);
    }


 
}
