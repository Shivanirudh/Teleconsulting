package com.team25.telehealth.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.socket.WebSocketSession;

import java.time.LocalDateTime;
import java.util.*;

@Data
@AllArgsConstructor
public class Room {
    private final String roomId;
//    private final int maxParticipants;
    private List<String> participants;
    private List<String> completedParticipants;
    private Map<String, String> participantAppointment;

    private String currentPatient;
    private String currentDoctor;
    private String seniorDoctor;
    public Room(String id) {
//        this.maxParticipants = 11;
        this.roomId = id;
        participants = new ArrayList<>();
        this.currentDoctor = null;
        this.currentPatient = null;
        this.seniorDoctor = null;
        completedParticipants = new ArrayList<>();
        participantAppointment = new HashMap<>();
    }

    // Getters and setters

    public void addParticipant(String userId) {
        participants.add(userId);
    }

    public void addCompletedParticipant(String userId) {
        completedParticipants.add(userId);
    }

    public void removeParticipant(String userId) {
        participants.remove(userId);
    }

    public boolean containsParticipant(String userId) {
        return participants.contains(userId);
    }

    public boolean containsCompletedParticipant(String userId) {
        return completedParticipants.contains(userId);
    }

//    public int numberOfParticipants() {
//        return participants.size();
//    }

//    public boolean exceedingMaxLimitOfParticipants() {
//        return numberOfParticipants() >= maxParticipants;
//    }
}
