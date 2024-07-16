#!/bin/bash

# Build images
docker-compose build

# Tag images
docker tag text-to-voice:latest trexhepaj/text-to-voice:latest
docker tag avatar-video-service:latest trexhepaj/avatar-video-service:latest
docker tag trexhepaj/mmv-naming-server:0.0.1-SNAPSHOT trexhepaj/mmv-naming-server:0.0.1-SNAPSHOT
docker tag trexhepaj/mmv-document-handling-service:0.0.1-SNAPSHOT trexhepaj/mmv-document-handling-service:0.0.1-SNAPSHOT
docker tag trexhepaj/mmv-api-gateway:0.0.1-SNAPSHOT trexhepaj/mmv-api-gateway:0.0.1-SNAPSHOT
docker tag trexhepaj/mmv-spring-cloud-config-server:0.0.1-SNAPSHOT trexhepaj/mmv-spring-cloud-config-server:0.0.1-SNAPSHOT
docker tag trexhepaj/mmv-summary-service:0.0.1-SNAPSHOT trexhepaj/mmv-summary-service:0.0.1-SNAPSHOT
docker tag trexhepaj/mmv-usermanagementservice:0.0.1-SNAPSHOT trexhepaj/mmv-usermanagementservice:0.0.1-SNAPSHOT
docker tag trexhepaj/vite-react-frontend:latest trexhepaj/vite-react-frontend:latest

# Login to Docker Hub
docker login

# Push images
docker push trexhepaj/text-to-voice:latest
docker push trexhepaj/avatar-video-service:latest
docker push trexhepaj/mmv-naming-server:0.0.1-SNAPSHOT
docker push trexhepaj/mmv-document-handling-service:0.0.1-SNAPSHOT
docker push trexhepaj/mmv-api-gateway:0.0.1-SNAPSHOT
docker push trexhepaj/mmv-spring-cloud-config-server:0.0.1-SNAPSHOT
docker push trexhepaj/mmv-summary-service:0.0.1-SNAPSHOT
docker push trexhepaj/mmv-usermanagementservice:0.0.1-SNAPSHOT
docker push trexhepaj/vite-react-frontend:latest
