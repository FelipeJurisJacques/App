/**
 * WebRTC Service Skeleton
 * 
 * TODO: Implement signaling and RTCDataChannel logic in the next stage.
 * This service will be responsible for:
 * 1. Fetching ICE servers from the backend.
 * 2. Managing RTCPeerConnection lifecycle.
 * 3. Handling file transfer via RTCDataChannel.
 */

export class WebRTCService {
    private peerConnection: RTCPeerConnection | null = null;
    private dataChannel: RTCDataChannel | null = null;

    constructor() {
        console.log("WebRTCService initialized (Skeleton)");
    }

    /**
     * Fetch ICE servers configuration from Spring Boot backend
     */
    async fetchIceServers(): Promise<RTCIceServer[]> {
        // Implementation will come in the next stage
        return [];
    }

    /**
     * Initialize P2P Connection
     */
    async connect(): Promise<void> {
        // Implementation will come in the next stage
    }

    /**
     * Send file via DataChannel
     */
    async sendFile(file: File): Promise<void> {
        // Implementation will come in the next stage
    }
}

export const webRTCService = new WebRTCService();
