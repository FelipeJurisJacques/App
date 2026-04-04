---
name: docker-environment
description: "Specify that the project is compiled, executed, and tested within a Docker container identified by `docker/docker-compose.yaml`."
risk: low
source: user-defined
date_added: "2026-04-04"
---

# Docker Development Environment

This skill specifies that the current project MUST be managed using Docker containers. All operations related to building, running, and testing the application should take place within the containerized environment.

## 1. Environment Identification

- **Definition File**: `docker/docker-compose.yaml`
- **Primary Container**: `application_node_container` (Service: `application_node`)
- **Web Server Container**: `application_nginx_container` (Service: `application_nginx`)

## 2. Command Execution

All development commands (compilation, script execution, testing) must be executed inside the `application_node_container`.

### Execution Pattern

To run commands, use:
```powershell
docker exec application_node_container <command>
```

**Examples:**
- **Install dependencies:** `docker exec application_node_container npm install`
- **Build project:** `docker exec application_node_container npm run build`
- **Run tests:** `docker exec application_node_container npm test`

## 3. Directory Mapping (Volume Mounting)

The following directory mappings are active as per `docker/docker-compose.yaml`:

| Host Path (relative to project root) | Container Path | Purpose |
| :--- | :--- | :--- |
| `./source/` | `/workspace/source/` | Source code |
| `./public/` | `/workspace/public/` | Compiled assets and static files |
| `./data/node_modules/` | `/workspace/node_modules/` | Persistent dependencies |
| `./source/application/package.json` | `/workspace/package.json` | Project configuration |

## 4. Operational Requirements

- **Strictness**: DO NOT run build or test commands directly on the host machine.
- **Port Mapping**:
    - Nginx (Web Server): Port `80`
    - Node.js (Dev / Tooling): Port `9005`
- **Working Directory**: The default working directory inside the container is `/workspace/`.

## 5. Troubleshooting

If the container is not running, ensure it is started with:
```powershell
docker compose -f ./docker/docker-compose.yaml up -d
```
