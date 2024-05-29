package com.myapp.documenthandlingservice;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.io.InputStream;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

public class DocumentHandlingControllerIntegrationTest {

    private MockMvc mockMvc;

    @InjectMocks
    private DocumentHandlingController documentHandlingController;

    @Mock
    private DocumentHandlingService documentHandlingService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(documentHandlingController).build();
    }

    @Test
    public void testUploadDocument_Pdf() throws Exception {
        InputStream inputStream = getClass().getResourceAsStream("/test.pdf");
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", inputStream);

        when(documentHandlingService.extractTextFromPdf((MultipartFile) any(MultipartFile.class))).thenReturn("Extracted text from PDF");

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("Extracted text from PDF"));
    }

    @Test
    public void testUploadDocument_Word() throws Exception {
        InputStream inputStream = getClass().getResourceAsStream("/test.docx");
        MockMultipartFile file = new MockMultipartFile("file", "test.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", inputStream);

        when(documentHandlingService.extractTextFromWord((MultipartFile) any(MultipartFile.class))).thenReturn("Extracted text from Word");

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("Extracted text from Word"));
    }

    @Test
    public void testUploadDocument_Text() throws Exception {
        InputStream inputStream = getClass().getResourceAsStream("/test.txt");
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", inputStream);

        when(documentHandlingService.extractTextFromTextFile((MultipartFile) any(MultipartFile.class))).thenReturn("Extracted text from Text");

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("Extracted text from Text"));
    }

    @Test
    public void testUploadDocumentWithUnsupportedFileTypeShouldReturnBadRequest() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.unsupported", "application/unsupported", "Unsupported content".getBytes());

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isBadRequest());
    }
}
