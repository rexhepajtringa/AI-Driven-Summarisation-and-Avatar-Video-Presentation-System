package com.myapp.documenthandlingservice;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface DocumentHandlingService {
    String extractTextFromPdf(MultipartFile file) throws IOException;
	String extractTextFromWord(MultipartFile file) throws IOException;
    String extractTextFromTextFile(MultipartFile file) throws IOException;

}
