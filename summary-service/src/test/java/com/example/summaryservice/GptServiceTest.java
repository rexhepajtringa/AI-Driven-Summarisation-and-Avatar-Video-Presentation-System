package com.example.summaryservice;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class GptServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private GptService gptService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @SuppressWarnings("unchecked")
	@Test
    void testSummarizeText() throws JsonProcessingException {
        String inputText = "This is a test text.";
        String tone = "formal";
        String summaryLength = "short";
        Boolean includeReferences = false;

        String expectedResponseBody = "{ \"choices\": [ { \"message\": { \"content\": \"This is a summary.\" } } ] }";
        ResponseEntity<String> responseEntity = new ResponseEntity<>(expectedResponseBody, HttpStatus.OK);

        when(restTemplate.postForEntity(any(String.class), any(HttpEntity.class), any(Class.class)))
                .thenReturn(responseEntity);

        String result = gptService.summarizeText(inputText, tone, summaryLength, includeReferences);

       
        assertEquals("This is a summary.", result);
    }

    @Test
    void testSummarizeText_withNullSummaryLength() throws JsonProcessingException {
        String inputText = "This is a test text.";
        String tone = "formal";
        Boolean includeReferences = false;

        String expectedResponseBody = "{ \"choices\": [ { \"message\": { \"content\": \"This is a summary.\" } } ] }";
        ResponseEntity<String> responseEntity = new ResponseEntity<>(expectedResponseBody, HttpStatus.OK);

        when(restTemplate.postForEntity(any(String.class), any(HttpEntity.class), any(Class.class)))
                .thenReturn(responseEntity);

        String result = gptService.summarizeText(inputText, tone, null, includeReferences);

        assertEquals("This is a summary.", result);
    }

}
