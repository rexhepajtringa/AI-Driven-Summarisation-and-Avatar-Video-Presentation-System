package com.example.summaryservice;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

class GptControllerTest {

    private MockMvc mockMvc;

    @Mock
    private GptService gptService;

    @InjectMocks
    private GptController gptController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(gptController).build();
    }

    @Test
    void testSummarize() throws Exception {

        String summary = "This is a summary.";
        when(gptService.summarizeText(any(String.class), any(String.class), any(String.class), any(Boolean.class)))
                .thenReturn(summary);

        SummaryRequest summaryRequest = new SummaryRequest();
        summaryRequest.setText("This is a test text.");
        summaryRequest.setTone("formal");
        summaryRequest.setSentenceLength("short");
        summaryRequest.setIncludeReferences(false);

        ObjectMapper objectMapper = new ObjectMapper();
        String requestJson = objectMapper.writeValueAsString(summaryRequest);

        mockMvc.perform(post("/api/summarize")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(content().string(summary));
    }

}
