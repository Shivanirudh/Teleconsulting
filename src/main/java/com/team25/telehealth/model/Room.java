package com.team25.telehealth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@Data
@AllArgsConstructor
public class Room {
    private final String roomId;
    private final int maxParticipants;
    private HashSet<String> participants;
    public Room(String id) {
        this.maxParticipants = 3;
        this.roomId = id;
        participants = new HashSet<>();
    }

    // Getters and setters

    public void addParticipant(String userId) {
        participants.add(userId);
    }

    public void removeParticipant(String userId) {
        participants.remove(userId);
    }

    public boolean containsParticipant(String userId) {
        return participants.contains(userId);
    }

    public int numberOfParticipants() {
        return participants.size();
    }

    public boolean exceedingMaxLimitOfParticipants() {
        return numberOfParticipants() >= maxParticipants;
    }
}
