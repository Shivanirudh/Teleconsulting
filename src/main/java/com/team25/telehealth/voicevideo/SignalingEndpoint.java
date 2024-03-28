package com.team25.telehealth.voicevideo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SignalingEndpoint extends TextWebSocketHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Map<String, Room> rooms = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // This is where you would typically check the user's credentials and assign roles
        // For this example, let's assume the user is a moderator
        session.getAttributes().put("role", "moderator");
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        Signal signal = objectMapper.readValue(message.getPayload(), Signal.class);
        handleSignal(session, signal);
    }

    private void handleSignal(WebSocketSession session, Signal signal) throws IOException {
        switch (signal.getType()) {
            case "CHECK_ROOM":
                checkRoom(session, signal.getData());
                break;
            case "CREATE_ROOM":
                createRoom(session, signal.getData());
                break;
            case "JOIN_ROOM":
                joinRoom(session, signal.getData());
                break;
            case "SEND_OFFER":
                sendOffer(session, signal.getData());
                break;
            case "SEND_ICE":
                sendIceCandidate(session, signal.getData());
                break;
            case "SEND_ANSWER":
                sendAnswer(session, signal.getData());
                break;
            case "MUTE_AUDIO":
                muteAudio(session, signal.getData());
                break;
            case "UNMUTE_AUDIO":
                unmuteAudio(session, signal.getData());
                break;
            case "MUTE_VIDEO":
                muteVideo(session, signal.getData());
                break;
            case "UNMUTE_VIDEO":
                unmuteVideo(session, signal.getData());
                break;
            case "LEAVE_ROOM":
                leaveRoom(session, signal.getData());
                break;
            // Add other cases as needed...
        }
    }

    private void checkRoom(WebSocketSession session, String roomId) throws IOException {
        if (!rooms.containsKey(roomId)) {
            createRoom(session, roomId);
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Signal("ROOM_CREATED", roomId))));
        }
    }

    private void createRoom(WebSocketSession session, String roomId) throws IOException {
        if (rooms.containsKey(roomId)) {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Signal("ROOM_EXISTS", roomId))));
            return;
        }
        rooms.put(roomId, new Room(roomId));
        rooms.get(roomId).addParticipant(session.getPrincipal().getName(), session);
    }

    private void joinRoom(WebSocketSession session, String roomId) throws IOException {
        if (!rooms.containsKey(roomId)) {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Error("Room not found"))));
            return;
        }
        rooms.get(roomId).addParticipant(session.getPrincipal().getName(), session);
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Message("Joined room successfully"))));
        // Send existing participants information to the new user
        for (WebSocketSession participant : rooms.get(roomId).getParticipants().values()) {
            if (participant != session) {
                participant
                        .sendMessage(new TextMessage(objectMapper.writeValueAsString(new Message("New participant joined"))));
            }
        }
    }

    private void sendOffer(WebSocketSession session, String data) throws IOException {
        Room room = getRoomBySession(session);
        if (room == null) {
            return;
        }
        room.getParticipants().values().stream()
                .filter(p -> p != session)
                .forEach(p -> {
                    try {
                        p.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Signal("RECEIVE_OFFER", data))));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
    }
    private void sendIceCandidate(WebSocketSession session, String data) throws IOException {
        Room room = getRoomBySession(session);
        if (room == null) {
            return;
        }
        room.getParticipants().values().stream()
                .filter(p -> p != session)
                .forEach(p -> {
                    try {
                        p.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Signal("RECEIVE_ICE", data))));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    private void sendAnswer(WebSocketSession session, String data) throws IOException {
        Room room = getRoomBySession(session);
        if (room == null) {
            return;
        }
        room.getParticipants().values().stream()
                .filter(p -> p != session)
                .forEach(p -> {
                    try {
                        p.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Signal("RECEIVE_ANSWER", data))));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    private void muteAudio(WebSocketSession session, String data) throws IOException {
        Room room = getRoomBySession(session);
        if (room == null || !session.getAttributes().get("role").equals("moderator")) {
            return;
        }
        // Send a signal to all other participants in the room to mute the user's audio
        room.getParticipants().values().stream()
                .filter(p -> p != session)
                .forEach(p -> {
                    try {
                        p.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Signal("MUTE_AUDIO", data))));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    private void unmuteAudio(WebSocketSession session, String data) throws IOException {
        Room room = getRoomBySession(session);
        if (room == null || !session.getAttributes().get("role").equals("moderator")) {
            return;
        }
        // Send a signal to all other participants in the room to unmute the user's audio
        room.getParticipants().values().stream()
                .filter(p -> p != session)
                .forEach(p -> {
                    try {
                        p.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Signal("UNMUTE_AUDIO", data))));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    private Room getRoomBySession(WebSocketSession session) {
        return rooms.values().stream()
                .filter(room -> room.getParticipants().containsValue(session))
                .findFirst()
                .orElse(null);
    }

    private void muteVideo(WebSocketSession session, String data) throws IOException {
        Room room = getRoomBySession(session);
        if (room == null || !session.getAttributes().get("role").equals("moderator")) {
            return;
        }
        room.getParticipants().values().stream()
                .filter(p -> p != session)
                .forEach(p -> {
                    try {
                        p.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Signal("MUTE_VIDEO", data))));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    private void unmuteVideo(WebSocketSession session, String data) throws IOException {
        Room room = getRoomBySession(session);
        if (room == null || !session.getAttributes().get("role").equals("moderator")) {
            return;
        }
        room.getParticipants().values().stream()
                .filter(p -> p != session)
                .forEach(p -> {
                    try {
                        p.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Signal("UNMUTE_VIDEO", data))));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    private void leaveRoom(WebSocketSession session, String data) throws IOException {
        Room room = getRoomBySession(session);
        if (room == null) {
            return;
        }
        room.removeParticipant(session.getPrincipal().getName());
        if (room.getParticipants().isEmpty()) {
            rooms.remove(room.getId());
        } else {
            room.getParticipants().values().forEach(p -> {
                try {
                    p.sendMessage(new TextMessage(objectMapper.writeValueAsString(new Signal("PARTICIPANT_LEFT", data))));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            });
        }
    }
}
