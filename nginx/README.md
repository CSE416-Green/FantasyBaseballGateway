# Nginx WebSocket Proxy

Nginx acts as a reverse proxy for WebSocket connections to the player stats backend, with authentication validation through the Express Gateway.

## Architecture

```
Client Request (ws://localhost/ws/*)
    ↓
Nginx (Port 80)
    ↓
Auth Check (Gateway at http://host.docker.internal:8080)
    ↓
If 200 OK → Proxy to Backend (http://host.docker.internal:3000)
    ↓
WebSocket Connection Established
```

## Prerequisites

- Docker installed and running
- Express Gateway running locally on `localhost:8080`
- WebSocket backend service running on `localhost:3001`

## Starting Nginx

Run the Docker container with the following command:

```bash
docker run --rm -d \
  --name fantasy-nginx \
  -e GATEWAY_URL=http://host.docker.internal:8080 \
  -e PLAYER_STATS_API_URL=http://host.docker.internal:3000 \
  -p 80:80 \
  -v $(pwd)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx:latest
```

Or use port 8081 if port 80 is already in use:

```bash
docker rm -f nginx 2>/dev/null || true && docker build -t fantasy-nginx . && docker run --rm -d --name nginx -p 8081:80 fantasy-nginx && sleep 2 && docker ps --filter name=nginx --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

## Testing WebSocket Connection

With the API key `admin-key-id:admin-key-secret`:

```bash
wscat -c ws://localhost/ws/test -H 'Authorization: apiKey admin-key-id:admin-key-secret'
```

Or with port 8081:

```bash
wscat -c ws://localhost:8081/ws/test -H 'Authorization: apiKey admin-key-id:admin-key-secret'
```

## Configuration

The nginx configuration (`nginx.conf`) includes:

- **Authentication**: Validates all `/ws/*` requests against the Gateway
- **Rate Limiting**: Applied by Express Gateway
- **IP Whitelisting**: Applied by Express Gateway
- **WebSocket Headers**: Properly configured upgrade headers
- **Timeouts**: 7 days for read/send, 10 seconds for connect
- **Buffering**: Disabled for optimal WebSocket performance

## Environment Variables

- `GATEWAY_URL`: Full URL to Express Gateway (default: `http://host.docker.internal:8080`)
- `PLAYER_STATS_API_URL`: Full URL to backend service (default: `http://host.docker.internal:3000`)

## Request Flow

1. Client sends WebSocket upgrade request to nginx
2. Nginx extracts auth headers and sends internal subrequest to Gateway
3. Gateway validates: IP whitelist → key auth → rate limit
4. If validation passes (200 OK), nginx upgrades the WebSocket connection
5. If validation fails (401/403/429), connection is rejected
6. Successful connections are proxied to the backend service

## Logs

View nginx logs:

```bash
docker logs fantasy-nginx
```

Follow logs in real-time:

```bash
docker logs -f fantasy-nginx
```
