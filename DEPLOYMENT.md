# Deployment Guide

This application is designed for one Node.js process with a persistent SQLite volume. Use PostgreSQL or another shared data architecture before scaling to multiple application instances.

## Required production configuration

```ini
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
DATABASE_PATH=/app/data/devpilotx.sqlite
SITE_ORIGIN=https://devpilotx.me
IP_HASH_SALT=generate-a-long-random-secret
REQUEST_BODY_LIMIT_BYTES=16384
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=12
LOG_LEVEL=info
```

Generate the hash salt outside source control:

```bash
openssl rand -hex 32
```

## Container start

```bash
mkdir -p data backup
export SITE_ORIGIN=https://devpilotx.me
export IP_HASH_SALT="$(openssl rand -hex 32)"
docker compose up -d --build
docker compose ps
curl --fail http://127.0.0.1:3000/healthz
```

The service binds to loopback by default. Put an HTTPS reverse proxy or managed ingress in front of it.

## Reverse proxy requirements

- Terminate TLS with a valid certificate.
- Redirect HTTP to HTTPS.
- Preserve the original `Host` header.
- Forward the original protocol.
- Limit request bodies at the proxy as well as the application.
- Apply reasonable connection and request timeouts.
- Do not cache contact or error responses.
- Monitor `/healthz` without exposing internal logs.

Example nginx location:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Request-ID $request_id;
    client_max_body_size 16k;
    proxy_connect_timeout 5s;
    proxy_read_timeout 30s;
}
```

## Database persistence

The `data` directory must survive container replacement. Verify ownership permits the container `node` user to write the mounted directory.

```bash
mkdir -p data
sudo chown -R 1000:1000 data
```

## Backup

For a simple stopped-service backup:

```bash
docker compose stop web
cp data/devpilotx.sqlite "backup/devpilotx-$(date +%Y%m%d-%H%M%S).sqlite"
docker compose start web
```

For frequent online backups, use the SQLite backup API or a storage snapshot designed for SQLite. Do not copy only the main file while writes are active unless WAL handling is understood and tested.

## Restore drill

```bash
docker compose stop web
cp backup/devpilotx-YYYYMMDD-HHMMSS.sqlite data/devpilotx.sqlite
rm -f data/devpilotx.sqlite-wal data/devpilotx.sqlite-shm
docker compose start web
curl --fail http://127.0.0.1:3000/healthz
```

Test restore procedures before an incident.

## Release verification

```bash
npm ci
npm run check
docker compose build --pull
docker compose up -d
curl --fail http://127.0.0.1:3000/healthz
```

Then verify from the public domain:

- Every primary navigation route
- One project detail page
- Privacy, Terms, Cookies, Accessibility, and Security
- Contact form persistence
- Direct email fallback
- Mobile navigation
- Canonical URL and sitemap output
- TLS and security headers

## Operations

- Collect JSON logs from standard output.
- Alert on repeated 5xx responses and failed health checks.
- Review contact records through a controlled operational process.
- Rotate `IP_HASH_SALT` according to your privacy and abuse-control policy. Rotation changes future hashes.
- Patch the base image and redeploy regularly.
- Keep the database backup outside the host running the application.
