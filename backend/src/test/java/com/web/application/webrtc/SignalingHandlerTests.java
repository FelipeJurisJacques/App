package com.web.application.webrtc;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import static org.mockito.Mockito.*;

public class SignalingHandlerTests {

    @Test
    public void testBroadcast() throws Exception {
        SignalingHandler handler = new SignalingHandler();
        
        WebSocketSession session1 = mock(WebSocketSession.class);
        WebSocketSession session2 = mock(WebSocketSession.class);
        
        when(session1.getId()).thenReturn("1");
        when(session1.isOpen()).thenReturn(true);
        
        when(session2.getId()).thenReturn("2");
        when(session2.isOpen()).thenReturn(true);
        
        handler.afterConnectionEstablished(session1);
        handler.afterConnectionEstablished(session2);
        
        TextMessage message = new TextMessage("test message");
        handler.handleTextMessage(session1, message);
        
        // Session 2 should receive the message from Session 1
        verify(session2, times(1)).sendMessage(message);
        // Session 1 should NOT receive its own message
        verify(session1, never()).sendMessage(message);
    }
}
