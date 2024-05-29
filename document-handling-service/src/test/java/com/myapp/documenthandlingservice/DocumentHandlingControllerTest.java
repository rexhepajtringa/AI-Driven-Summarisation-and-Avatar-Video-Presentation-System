package com.myapp.documenthandlingservice;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

public class DocumentHandlingControllerTest {

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
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "PDF content".getBytes());
        when(documentHandlingService.extractTextFromPdf(any(MultipartFile.class))).thenReturn("Extracted text from PDF");

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("Extracted text from PDF"));
    }

    @Test
    public void testUploadDocument_Word() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Word content".getBytes());
        when(documentHandlingService.extractTextFromWord(any(MultipartFile.class))).thenReturn("Extracted text from Word");

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("Extracted text from Word"));
    }

    @Test
    public void testUploadDocument_Text() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "Text content".getBytes());
        when(documentHandlingService.extractTextFromTextFile(any(MultipartFile.class))).thenReturn("Extracted text from Text");

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("Extracted text from Text"));
    }

    @Test
    public void testUploadText() throws Exception {
        String text = "Sample text content";

        mockMvc.perform(post("/document/uploadText")
                .content(text)
                .contentType(MediaType.TEXT_PLAIN))
                .andExpect(status().isOk())
                .andExpect(content().string(text));
    }
}
