
# AI-Driven Summarisation & Avatar Video Presentation System

This project is a microservice-based system that automates document comprehension by summarising uploaded files with GPT-3.5, generating natural speech via ElevenLabs, and producing lip-synced avatar presentation videos using GooeyAI. It follows a scalable Spring Boot microservices architecture with an API Gateway, Config Server, Eureka Naming Server, and a React frontend. Users can upload documents, generate summaries, audio, and videos, and securely store their outputs through a dedicated user management service.

## Microservices

**Document Handling Service**
Receives uploaded files (PDF, DOCX, TXT), extracts the text using parsing tools, cleans it, and exposes it to the summarisation service through REST endpoints.

**Summary Service**
Uses the GPT-3.5 API to produce an abstractive summary from the extracted text and returns the summary in a structured form for the rest of the pipeline.

**Text-to-Voice Service**
Takes the generated summary text and creates an audio file using the ElevenLabs API. Supports basic options like voice selection and output format.

**Avatar Video Service**
Generates a short lip-sync video by combining an uploaded image with the generated audio. This is done through the GooeyAI Lipsync API, which returns an MP4 once processing finishes.

**User Management Service**
Handles registration, login, and JWT-based authentication. Stores user information along with all saved summaries, audio files, and videos.

**API Gateway**
Acts as the single entry point for the frontend. Routes incoming requests to the correct microservice and applies request filtering as needed.

**Naming Server (Eureka)**
Provides service discovery so microservices can find each other dynamically at runtime, enabling scaling without fixed service addresses.

**Spring Cloud Config Server**
Holds configuration files for all services and ensures consistent externalised configuration across environments.

**React Frontend**
UI for uploading documents, generating summaries, speech, and videos, and browsing saved content. Communicates only with the API Gateway.

