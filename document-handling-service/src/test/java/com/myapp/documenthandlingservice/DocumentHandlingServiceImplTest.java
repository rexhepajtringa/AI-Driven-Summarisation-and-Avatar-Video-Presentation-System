package com.myapp.documenthandlingservice;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.io.IOException;
import java.io.InputStream;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

public class DocumentHandlingServiceImplTest {

    @InjectMocks
    private DocumentHandlingServiceImpl documentHandlingService;

    @Mock
    private MultipartFile file;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testExtractTextFromPdf() throws IOException {
        InputStream inputStream = getClass().getResourceAsStream("/test.pdf");
        when(file.getInputStream()).thenReturn(inputStream);

        String result = documentHandlingService.extractTextFromPdf(file);
        assertNotNull(result);
    }

    @Test
    public void testExtractTextFromWord() throws IOException {
        InputStream inputStream = getClass().getResourceAsStream("/test.docx");
        when(file.getInputStream()).thenReturn(inputStream);
        when(file.getContentType()).thenReturn("application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        String result = documentHandlingService.extractTextFromWord(file);
        assertNotNull(result);
    }

    @Test
    public void testExtractTextFromTextFile() throws IOException {
        InputStream inputStream = getClass().getResourceAsStream("/test.txt");
        when(file.getInputStream()).thenReturn(inputStream);
        when(file.getBytes()).thenReturn(inputStream.readAllBytes());

        String result = documentHandlingService.extractTextFromTextFile(file);
        assertNotNull(result);
    }
}
