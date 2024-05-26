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
        // Load the test.pdf file from the src/test/resources directory
        InputStream inputStream = getClass().getResourceAsStream("/test.pdf");
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", inputStream);

        when(documentHandlingService.extractTextFromPdf((MultipartFile) any(MultipartFile.class))).thenReturn("Extracted text from PDF");

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string("Extracted text from PDF"));
    }

    @Test
    public void testUploadDocumentWithUnsupportedFileTypeShouldReturnBadRequest() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.unsupported", "application/unsupported", "Unsupported content".getBytes());

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isBadRequest());
    }
}
