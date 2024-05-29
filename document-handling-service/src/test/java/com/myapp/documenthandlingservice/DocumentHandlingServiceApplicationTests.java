package com.myapp.documenthandlingservice;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

@SpringBootTest
public class DocumentHandlingServiceApplicationTests {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void contextLoads() {
        assertNotNull(applicationContext);
    }

    @Test
    void testDocumentHandlingServiceBeanExists() {
        assertNotNull(applicationContext.getBean(DocumentHandlingService.class));
    }
}
