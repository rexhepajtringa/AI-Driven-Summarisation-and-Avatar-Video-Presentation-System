package com.myapp.documenthandlingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan
public class DocumentHandlingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocumentHandlingServiceApplication.class, args);
	}

}
