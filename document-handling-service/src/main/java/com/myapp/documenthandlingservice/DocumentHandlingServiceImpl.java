package com.myapp.documenthandlingservice;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
public class DocumentHandlingServiceImpl implements DocumentHandlingService {

	 @Override
	    public String extractTextFromPdf(MultipartFile file) throws IOException {
	        try (InputStream inputStream = file.getInputStream(); PDDocument document = PDDocument.load(inputStream)) {
	            PDFTextStripper stripper = new PDFTextStripper();
	            String extractedText = stripper.getText(document);
	            return postProcessExtractedText(extractedText);
	        }
	    }

	    @Override
	    public String extractTextFromWord(MultipartFile file) throws IOException {
	        if (!file.getContentType().equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
	            throw new IllegalArgumentException("Unsupported file type.");
	        }

	        try (XWPFDocument doc = new XWPFDocument(file.getInputStream());
	             XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
	            String extractedText = extractor.getText();
	            return postProcessExtractedText(extractedText);
	        }
	    }
	    
	    @Override
	    public String extractTextFromTextFile(MultipartFile file) throws IOException {
	        String content = new String(file.getBytes(), StandardCharsets.UTF_8);
	        return postProcessExtractedText(content);
	    }
	
	private String postProcessExtractedText(String text) {
	    String standardizedText = text.replaceAll("\r\n", "\n");
	    String normalizedSentenceEndings = standardizedText.replaceAll("([.!?])\\s*", "$1 ");
	    String noExtraSpaces = normalizedSentenceEndings.replaceAll("[ \t]+", " ");
	    String mergeSingleLineBreaks = noExtraSpaces.replaceAll("(?<!\n)\n(?!\\n)", " ");
	    String formattedLists = mergeSingleLineBreaks
	            .replaceAll("(?m)^([\\*\\-\\•]|\\d+\\.)\\s", "\n$1 ")
	            .replaceAll("\n([\\*\\-\\•]|\\d+\\.) ", "\n\n$1 "); 
	    String withHeadersEnhanced = formattedLists.replaceAll("\n([A-Z][A-Za-z\\s]+)\n", "\n\n$1\n\n"); 
	    String doubleSpacedParagraphs = withHeadersEnhanced.replaceAll("\n\n+", "\n\n");

	    return doubleSpacedParagraphs.trim(); 
	}

	
}
