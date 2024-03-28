package com.team25.telehealth.voicevideo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
public class Room {
    private final String id;
    private Map<String, WebSocketSession> participants = new HashMap<>();
    public Room(String id) {
        this.id = id;
    }

    // Getters and setters

    public void addParticipant(String userId, WebSocketSession session) {
        participants.put(userId, session);
    }

    public void removeParticipant(String userId) {
        participants.remove(userId);
    }

    public boolean containsParticipant(String userId) {
        return participants.containsKey(userId);
    }
}
