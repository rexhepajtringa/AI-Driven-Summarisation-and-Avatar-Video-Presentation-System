package com.myapp.documenthandlingservice;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.hamcrest.Matchers.containsString;

@SpringBootTest
@AutoConfigureMockMvc
public class DocumentHandlingServiceApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void uploadDocumentWithPdfShouldReturnOk() throws Exception {
        // Assuming "PDF content" is the text you expect to be extracted from the PDF file
        String expectedExtractedText = "PDF content";
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", expectedExtractedText.getBytes());

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(expectedExtractedText)));
    }

    @Test
    public void uploadDocumentWithUnsupportedFileTypeShouldReturnBadRequest() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "unsupported_file.txt", "text/plain", "Some unsupported content".getBytes());

        mockMvc.perform(multipart("/document/uploadPdf").file(file))
                .andExpect(status().isBadRequest());
    }

    // You can add more tests here to cover other scenarios, such as:
    // - Uploading a Word document with the correct MIME type and expecting a successful extraction.
    // - Handling of files with MIME types not supported by your service, ensuring the service responds with the correct error message or status code.
    // - Testing the uploadText endpoint to ensure it correctly returns the text it receives.
}
