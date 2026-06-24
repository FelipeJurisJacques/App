package com.web.application.webrtc;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SignalingHandler extends TextWebSocketHandler {

    // Simple session management: peerId -> WebSocketSession
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // In a real app, we would wait for a 'join' message to map peerId
        // For now, we'll use the session ID as a placeholder peerId
        sessions.put(session.getId(), session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        // Forwarding logic: messages should contain a 'targetId'
        // For this implementation, we broadcast to all other sessions for simplicity in a 1-to-1 discovery
        // In production, use specific routing based on JSON targetId
        broadcast(session, message);
    }

    private void broadcast(WebSocketSession sender, TextMessage message) {
        sessions.values().parallelStream()
                .filter(s -> !s.getId().equals(sender.getId()) && s.isOpen())
                .forEach(s -> {
                    try {
                        s.sendMessage(message);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                });
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session.getId());
    }
}
