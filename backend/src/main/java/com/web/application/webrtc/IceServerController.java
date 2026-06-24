package com.web.application.webrtc;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/webrtc")
public class IceServerController {

    @GetMapping("/ice-servers")
    public List<Map<String, Object>> getIceServers() {
        return List.of(
            Map.of("urls", List.of("stun:stun.l.google.com:19302")),
            Map.of(
                "urls", List.of("turn:localhost:3478"),
                "username", "user",
                "credential", "password"
            )
        );
    }
}
