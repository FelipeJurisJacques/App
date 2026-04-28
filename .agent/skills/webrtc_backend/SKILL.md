---
name: webrtc-backend
description: "Especialista em desenvolvimento de backend para WebRTC utilizando Java Spring Boot, focado em alta performance com Virtual Threads e infraestrutura de rede (STUN/TURN)."
risk: unknown
source: local
date_added: "2026-04-28"
---

# WebRTC Backend Skill

Este skill define os padrões e rotas para a implementação de sinalização WebRTC e serviços de infraestrutura ICE no projeto.

## Rotas e Funcionalidades

### 1. Sinalização (WebSocket)
- **Endpoint**: `/signaling`
- **Protocolo**: WSS (WebSocket Secure)
- **Mensagens**:
    - `OFFER`: Cliente inicia a conexão.
    - `ANSWER`: Resposta à oferta.
    - `ICE_CANDIDATE`: Troca de informações de rede.
- **Implementação**: Utiliza `SignalingHandler` com Java Virtual Threads para gerenciar conexões simultâneas de transferência de arquivos.

### 2. Infraestrutura ICE (REST)
- **Endpoint**: `GET /api/webrtc/ice-servers`
- **Funcionalidade**: Retorna a lista de servidores STUN e TURN configurados.
- **Configuração**:
    - STUN: `stun:stun.l.google.com:19302` (Google Free)
    - TURN: `turn:localhost:3478` (Coturn via Docker)

## Diretrizes de Implementação

- **Virtual Threads**: Sempre habilitar `spring.threads.virtual.enabled=true` para suportar milhares de sessões de sinalização leves.
- **NAT Traversal**: Garantir que o serviço `coturn` esteja acessível e com as portas UDP abertas no Docker.
- **PWA Integration**: O frontend deve consumir o endpoint de ICE servers antes de inicializar o `RTCPeerConnection`.

## Uso Recomendado

- Implementação de novos fluxos de sinalização.
- Debug de conectividade entre pares (ICE failed).
- Otimização de performance em transferências de arquivos grandes via `RTCDataChannel`.
