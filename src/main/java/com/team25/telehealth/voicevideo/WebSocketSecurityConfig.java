package com.team25.telehealth.voicevideo;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@AllArgsConstructor
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {
    private final SignalingEndpoint signalingEndpoint;
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/signal")
                .setAllowedOrigins("*")
                .withSockJS(); // Enable SockJS fallback for browsers that don't support native WebSocket
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config
                .setApplicationDestinationPrefixes("/app")
                .enableSimpleBroker("/topic");
    }
}
