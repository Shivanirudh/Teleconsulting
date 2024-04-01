package com.team25.telehealth.voicevideo;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

//@Configuration
//@EnableWebSocket
//@AllArgsConstructor
//public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {
//    private final SignalingEndpoint signalingEndpoint;
//    @Override
//    public void registerStompEndpoints(StompEndpointRegistry registry) {
//        registry.addEndpoint("/signal")
//                .setAllowedOrigins("*")
//                .withSockJS(); // Enable SockJS fallback for browsers that don't support native WebSocket
//    }
//
//    @Override
//    public void configureMessageBroker(MessageBrokerRegistry config) {
//        config
//                .setApplicationDestinationPrefixes("/app")
//                .enableSimpleBroker("/topic");
//    }
//}
@Configuration
@EnableWebSocket
public class WebSocketSecurityConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new SocketHandler(), "/socket")
                .setAllowedOrigins("*");
    }
}