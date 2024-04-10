package com.UserManagement.UserManagementService.service;


import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class GCSUtil {

    private static final Storage storage = StorageOptions.getDefaultInstance().getService();

    public static String uploadFile(String filePath, String bucketName, String objectName) throws IOException {
        BlobId blobId = BlobId.of(bucketName, objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        Blob blob = storage.create(blobInfo, Files.readAllBytes(Paths.get(filePath)));
        return blob.getMediaLink(); // Returns the direct link to the file in GCS
    }
}