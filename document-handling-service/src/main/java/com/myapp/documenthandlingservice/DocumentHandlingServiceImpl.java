package com.myapp.documenthandlingservice;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class DocumentHandlingServiceImpl implements DocumentHandlingService {

	@Override
	public String extractTextFromPdf(MultipartFile file) throws IOException {
		try (InputStream inputStream = file.getInputStream(); PDDocument document = PDDocument.load(inputStream)) {
			PDFTextStripper stripper = new PDFTextStripper();
			return stripper.getText(document);
		}
	}

	@Override
	public String extractTextFromWord(MultipartFile file) throws IOException {
		if (!file.getContentType().equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
			throw new IllegalArgumentException("Unsupported file type.");
		}

		try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {
			XWPFWordExtractor extractor = new XWPFWordExtractor(doc);
			return extractor.getText();
		}
	}
}
