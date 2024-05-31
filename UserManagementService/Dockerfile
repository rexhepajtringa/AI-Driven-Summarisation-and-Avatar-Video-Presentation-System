FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/mmv-usermanagementservice-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8300

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
