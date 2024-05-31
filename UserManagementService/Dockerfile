# Use an official OpenJDK runtime as a parent image
FROM openjdk:11-jre-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the target directory to the container
COPY target/mmv-usermanagementservice-0.0.1-SNAPSHOT.jar app.jar

# Expose the port that your application runs on
EXPOSE 8300

# Run the JAR file
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
