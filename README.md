# DevPilotX.me

Production source for the DevPilotX.me engineering portfolio and secure contact workflow.

This site is an inspectable engineering artifact. Project claims point to public repositories. Contact submissions are validated and stored before success is returned. Deployment, persistence, recovery, security, accessibility, and known limitations are documented as part of the product.

## Architecture

| Layer | Implementation |
| --- | --- |
| Runtime | Node.js 24, native ESM |
| HTTP | `node:http` with explicit routing |
| Views | Server-rendered semantic HTML |
| Client | Small external JavaScript runtime |
| Data | Native `node:sqlite`, WAL mode, tracked migrations |
| Assets | Original SVG identity and hand-authored CSS |
| Delivery | Docker, Compose, persistent volume, GitHub Actions |

There are no third-party runtime packages. The application uses Node.js platform APIs and one local database file.

## Routes

Public pages:

- `/`
- `/work`
- `/portfolio`
- `/portfolio/:slug`
- `/method`
- `/profile`
- `/contact`
- `/privacy`
- `/terms`
- `/cookies`
- `/accessibility`
- `/security`

Service routes:

- `GET /healthz`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `POST /api/contact`
- `GET /robots.txt`
- `GET /sitemap.xml`

## Public portfolio

Only current, owner-authored public repositories are included. Private repositories and work owned by other people are excluded.

| Project | Repository | Public site |
| --- | --- | --- |
| Permission Bureau | [auspice](https://github.com/devpilotX/auspice) | Repository |
| Veydria | [Veydria](https://github.com/devpilotX/Veydria) | Repository |
| Quant | [Quant](https://github.com/devpilotX/Quant) | Repository |
| ProofSmith | [ProofSmith](https://github.com/devpilotX/ProofSmith) | Repository |
| FerroDB | [FerroDB](https://github.com/devpilotX/FerroDB) | Repository |
| AEGIS | [aegis](https://github.com/devpilotX/aegis) | Repository |
| Paisa Reality | [paisarealitymoney](https://github.com/devpilotX/paisarealitymoney) | [paisareality.com](https://paisareality.com) |
| Bank Legacy | [Bank-Legacy](https://github.com/devpilotX/Bank-Legacy) | Repository |
| Notion Agent | [Notion-Agent](https://github.com/devpilotX/Notion-Agent) | Repository |
| Value.Codes | [value.codes](https://github.com/devpilotX/value.codes) | [value.codes](https://value.codes) |
| TenderEdge | [tenderedge](https://github.com/devpilotX/tenderedge) | Repository |
| Vouch Relay | [vouch-backend](https://github.com/devpilotX/vouch-backend) | Repository |
| OU-MRS | [OU-MRS](https://github.com/devpilotX/OU-MRS) | Repository |
| Epicenter Exchange | [epicenter-exchange](https://github.com/devpilotX/epicenter-exchange) | [epicenterexchange.com](https://epicenterexchange.com) |
| Mergenote | [mergenote](https://github.com/devpilotX/mergenote) | Repository |

`devpilotx.com` is a separate profile destination. It is not used as a deployment link for unrelated projects.

Finance-related repositories are presented as engineering and educational work. They are not investment advice, and past results do not predict future returns.

## Contact workflow

`POST /api/contact` follows a store-first path:

1. Verify the request origin.
2. Apply the request-size limit.
3. Apply rate limiting keyed by a salted network-address hash.
4. Validate and normalize each field.
5. Reject the hidden honeypot when populated.
6. Insert the submission with a parameterized SQLite statement.
7. Return a request identifier.

The Contact page also exposes `devpilotx@gmail.com` as a direct fallback. Never send passwords, credentials, financial account data, or sensitive personal records through the form.

## Trust boundaries

- Browser input is untrusted and validated on the server.
- `SITE_ORIGIN` defines the accepted form origin.
- `IP_HASH_SALT` remains in the deployment environment.
- Raw network addresses are not intentionally stored in the contact table.
- SQLite files are runtime data and excluded from Git.
- External project and live-site links leave this application boundary.
- Legal pages describe the implementation but are not compliance certifications.

## Security controls

- Restrictive Content Security Policy
- External scripts without `unsafe-inline`
- HSTS in production
- Frame denial and MIME sniffing protection
- Strict referrer and permissions policies
- Same-origin form enforcement
- Request-size and rate limits
- Honeypot abuse control
- Parameterized database writes
- Salted network-address hashes
- Structured logs and request identifiers
- Graceful shutdown handling
- Automated copy and URL guardrails

See [SECURITY.md](SECURITY.md) for responsible disclosure guidance.

## Database

Migrations live in `db/migrations` and are recorded in the `migrations` table. `001_create_contacts.sql` creates the contact table and supporting indexes.

Default paths:

- Local: `./data/devpilotx.sqlite`
- Container: `/app/data/devpilotx.sqlite`

SQLite is suitable for one application instance with durable local storage. A multi-instance deployment needs a shared database design.

## Local setup

Requirements:

- Node.js 24 or newer
- npm

```bash
npm ci
cp .env.example .env
npm start
```

Open `http://localhost:3000`.

## Environment

| Variable | Purpose | Production guidance |
| --- | --- | --- |
| `NODE_ENV` | Runtime mode | Set to `production` |
| `HOST` | Listen address | Usually `0.0.0.0` in a container |
| `PORT` | Listen port | Default `3000` |
| `DATABASE_PATH` | SQLite database | Place on persistent storage |
| `SITE_ORIGIN` | Accepted public origin | Use `https://devpilotx.me` |
| `IP_HASH_SALT` | Abuse-control hash salt | Use a unique random secret |
| `REQUEST_BODY_LIMIT_BYTES` | Maximum request body | Default `16384` |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window | Default `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | Requests per window | Default `12` |
| `LOG_LEVEL` | Structured logging level | Default `info` |

Never commit `.env`.

## Verification

```bash
npm run lint
npm test
npm run check
```

The integration suite verifies every public route and case-study route, the exact repository allowlist, optional live links, security headers, CSP-safe assets, APIs, contact rejection and persistence, finance disclaimers, metadata, sitemap output, publication guardrails, and the custom 404.

GitHub Actions runs `npm ci` and `npm run check` with read-only repository permissions.

## Container deployment

```bash
mkdir -p data
export SITE_ORIGIN=https://devpilotx.me
export IP_HASH_SALT="$(openssl rand -hex 32)"
docker compose up -d --build
curl --fail http://127.0.0.1:3000/healthz
```

The container runs as a non-root user, exposes a health check, uses a read-only root filesystem in Compose, and mounts `/app/data` for persistence.

Place an HTTPS reverse proxy or managed ingress in front of port 3000. Preserve the original host and protocol, monitor `/healthz`, collect structured logs, and protect backups. See [DEPLOYMENT.md](DEPLOYMENT.md) for the release, proxy, backup, restore, and operations runbook.

## Production checklist

- Set `NODE_ENV=production`.
- Set the exact HTTPS `SITE_ORIGIN`.
- Generate a unique `IP_HASH_SALT`.
- Mount persistent storage at `/app/data`.
- Configure TLS at the proxy or platform.
- Monitor `/healthz` and 5xx responses.
- Verify contact persistence from the public domain.
- Confirm database backups and a tested restore path.
- Review legal pages with qualified counsel.
- Run `npm run check` against the release commit.

## Accessibility

The interface includes semantic headings, keyboard-operable navigation and forms, visible focus, a skip link, responsive layouts, reduced-motion support, readable contrast, and touch-sized targets. Report barriers through the Contact page or email address.

## Known limitations

- The in-memory rate limiter resets when the process restarts and is not shared across instances.
- Contact records require an operational review process after deployment.
- Linked repositories and external websites have independent availability and accessibility behavior.
- Automated tests and documented controls reduce risk but do not prove the absence of defects.

## Legal note

The Privacy, Terms, Cookies, Accessibility, and Security pages describe the current implementation. Have qualified counsel review them before commercial launch or collecting sensitive categories of data.

## License

The website source is released under the [MIT License](LICENSE). Linked projects retain their own repository licenses.
