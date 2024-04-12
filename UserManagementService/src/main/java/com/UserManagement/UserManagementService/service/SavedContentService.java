package com.UserManagement.UserManagementService.service;

import com.UserManagement.UserManagementService.ContentType;
import com.UserManagement.UserManagementService.model.SavedContent;
import com.UserManagement.UserManagementService.model.User;
import com.UserManagement.UserManagementService.repository.SavedContentRepository;
import com.UserManagement.UserManagementService.repository.UserRepository;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SavedContentService {

    private static final String BUCKET_NAME = "summarizer_user_content";
    private static final Storage storage = StorageOptions.getDefaultInstance().getService();

    @Autowired
    private SavedContentRepository savedContentRepository;

    @Autowired
    private UserRepository userRepository;

    
    public SavedContent saveContent(Long userId, MultipartFile file, String title, ContentType contentType) throws IOException {
        // Generate a unique filename to prevent overwrites
        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName.contains(".") ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String uniqueFileName = UUID.randomUUID().toString() + extension; // Ensure the file name is unique
        
        File tempFile = convertMultiPartToFile(file, uniqueFileName);
        String fileUrl = uploadFile(tempFile, BUCKET_NAME, uniqueFileName);
        tempFile.delete();

        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found");
        }

        SavedContent content = new SavedContent();
        content.setTitle(title);
        content.setContentUrl(fileUrl);
        content.setContentType(contentType);
        content.setUser(userOptional.get());
        content.setCreatedAt(LocalDateTime.now());
        return savedContentRepository.save(content);
    }
    
    private File convertMultiPartToFile(MultipartFile file, String uniqueFileName) throws IOException {
        File convFile = new File(uniqueFileName);
        FileOutputStream fos = new FileOutputStream(convFile);
        fos.write(file.getBytes());
        fos.close();
        return convFile;
    }
    
//    public SavedContent saveContent(Long userId, MultipartFile file, String title, ContentType contentType) throws IOException {
//        String objectName = file.getOriginalFilename();
//        File tempFile = convertMultiPartToFile(file);
//        String fileUrl = uploadFile(tempFile, BUCKET_NAME, objectName);
//        tempFile.delete();
//
//        Optional<User> userOptional = userRepository.findById(userId);
//        if (!userOptional.isPresent()) {
//            throw new RuntimeException("User not found");
//        }
//
//        SavedContent content = new SavedContent();
//        content.setTitle(title);
//        content.setContentUrl(fileUrl);
//        content.setContentType(contentType);
//        content.setUser(userOptional.get());
//        content.setCreatedAt(LocalDateTime.now());
//        return savedContentRepository.save(content);
//    }

    public List<SavedContent> getAllContentsByUserId(Long userId) {
        return savedContentRepository.findAllByUserId(userId);
    }

    public Optional<SavedContent> getContentById(Long id) {
        return savedContentRepository.findById(id);
    }

    public void deleteContent(Long id) {
        savedContentRepository.deleteById(id);
    }

    private String uploadFile(File file, String bucketName, String objectName) throws IOException {
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        storage.create(blobInfo, Files.readAllBytes(file.toPath()));
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);
    }
    public byte[] downloadContent(String objectName) throws IOException {
        Blob blob = storage.get(BlobId.of(BUCKET_NAME, objectName));
        if (blob == null) {
            throw new IOException("Blob not found for objectName: " + objectName);
        }
        return blob.getContent(Blob.BlobSourceOption.generationMatch());
    }

    public String downloadTextContent(String objectName) throws IOException {
        Blob blob = storage.get(BlobId.of(BUCKET_NAME, objectName));
        if (blob == null) {
            throw new IOException("Blob not found for objectName: " + objectName);
        }
        return new String(blob.getContent(Blob.BlobSourceOption.generationMatch()));
    }

    
	public List<SavedContent> getAllContentsByUserIdAndType(Long userId, ContentType contentType) {
		  return savedContentRepository.findAllByUserIdAndContentType(userId, contentType);
	}

	}
