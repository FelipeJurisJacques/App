# WebRTC Backend Implementation

This module provides signaling and NAT traversal support for WebRTC file transfers.

## Production Configuration

> [!IMPORTANT]
> In production environments, WebRTC **requires** secure connections (HTTPS/WSS).
> - Configure SSL certificates (e.g., Let's Encrypt) in your Nginx reverse proxy.
> - Ensure `coturn` is configured with TLS (port 5349).
> - All signaling messages must be transmitted over `wss://`.

## Architecture
- **Signaling**: WebSocket based (`/signaling`).
- **Concurrency**: Java Virtual Threads enabled for high-throughput signaling.
- **NAT Traversal**: Coturn (TURN) + Google STUN.
