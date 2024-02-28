package com.example.summaryservice;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register a WebSocket endpoint that the clients will use to connect to your WebSocket server.
        registry.addEndpoint("/ws").setAllowedOrigins("*").withSockJS();
        // .setAllowedOrigins("*") allows connections from any domain
        // .withSockJS() is optional and provides fallback options for browsers that don’t support WebSocket
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Defines memory-based message broker to carry the messages back to the client on destinations prefixed with "/topic"
        registry.enableSimpleBroker("/topic");
        // Defines prefix for the destinations that will be routed to @MessageMapping-annotated methods
        registry.setApplicationDestinationPrefixes("/app");
    }
}
