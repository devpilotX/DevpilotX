# DevPilotX.me

Production source for the DevPilotX.me engineering portfolio and secure contact workflow.

The site is designed as an inspectable engineering artifact. Public claims point to public repositories. The contact path stores submissions before returning success. Deployment, persistence, recovery, security, and accessibility are documented as part of the product.

## System overview

| Layer | Implementation |
| --- | --- |
| Runtime | Node.js 24, native ESM |
| HTTP | `node:http` with explicit routing |
| Views | Server-rendered semantic HTML |
| Client | Small external JavaScript runtime |
| Data | Native `node:sqlite`, WAL mode, tracked migrations |
| Assets | Original SVG identity and hand-authored CSS |
| Delivery | Docker, persistent volume, GitHub Actions CI |

There are no third-party runtime packages. The application uses Node.js platform APIs and a single local database file.

## Public routes

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

## Service routes

- `GET /healthz`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `POST /api/contact`
- `GET /robots.txt`
- `GET /sitemap.xml`

## Public project selection

Only owner-authored public repositories are included. Private repositories and `smart-label-gov` are intentionally excluded.

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

`devpilotx.com` remains a separate profile destination. It is not presented as a deployment for unrelated projects.

Finance-related repositories are presented as engineering and educational work. They are not investment advice, and past results do not predict future returns.

## Contact delivery model

`POST /api/contact` follows a store-first path:

1. Verify the request origin.
2. Apply the request-size limit.
3. Apply rate limiting keyed by a salted network-address hash.
4. Validate and normalize fields.
5. Reject the hidden honeypot field when populated.
6. Insert the submission with a parameterized SQLite statement.
7. Return a request identifier.

The form also displays `devpilotx@gmail.com` as a direct fallback. Do not send passwords, credentials, financial account data, or sensitive personal records through the form.

## Trust boundaries

- Browser input is untrusted and validated on the server.
- `SITE_ORIGIN` defines the accepted form origin.
- `IP_HASH_SALT` stays in the deployment environment.
- Raw network addresses are not intentionally stored in the contact table.
- SQLite files are runtime data and excluded from Git.
- External project and live-site links leave the application security boundary.
- Legal copy describes the implementation but is not a compliance certification.

## Security controls

- Restrictive Content Security Policy
- External scripts only, without `unsafe-inline`
- Frame denial and MIME sniffing protection
- Strict referrer and permissions policies
- HSTS in production
- Same-origin form enforcement
- Configurable request-size and rate limits
- Honeypot abuse control
- Parameterized database writes
- Hashed network identifiers
- Structured logs and request IDs
- Graceful shutdown handling
- Automated copy and URL guardrails

See [SECURITY.md](SECURITY.md) for responsible disclosure guidance.

## Database and migrations

Migrations live in `db/migrations` and are recorded in the `migrations` table.

`001_create_contacts.sql` creates the contact table and supporting indexes. The server applies pending migrations during startup.

Default paths:

- Local: `./data/devpilotx.sqlite`
- Container: `/app/data/devpilotx.sqlite`

### Backup

Stop writes or create a SQLite-safe snapshot, then retain the database and any `-wal` file together. For a stopped container:

```bash
docker compose stop web
cp data/devpilotx.sqlite "backup/devpilotx-$(date +%Y%m%d-%H%M%S).sqlite"
docker compose start web
```

### Restore

```bash
docker compose stop web
cp backup/devpilotx-YYYYMMDD-HHMMSS.sqlite data/devpilotx.sqlite
rm -f data/devpilotx.sqlite-wal data/devpilotx.sqlite-shm
docker compose start web
curl --fail http://localhost:3000/healthz
```

Test backup and restore procedures before relying on them.

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

## Environment reference

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

The integration suite starts an isolated production-mode server and temporary database. It verifies public routes, every case-study route, security headers, CSP-compatible assets, APIs, contact rejection and persistence, metadata, sitemap output, copy guardrails, and the custom 404.

GitHub Actions runs `npm ci` and `npm run check` with read-only repository permissions.

## Container deployment

```bash
docker build -t devpilotx-site .
docker run --rm \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e SITE_ORIGIN=https://devpilotx.me \
  -e IP_HASH_SALT=replace-with-a-long-random-secret \
  -v "$(pwd)/data:/app/data" \
  devpilotx-site
```

Place an HTTPS reverse proxy or managed platform in front of port 3000. Forward the original host and protocol, persist `/app/data`, monitor `/healthz`, collect structured logs, and back up the database.

## Production checklist

- Set `NODE_ENV=production`.
- Set the exact HTTPS `SITE_ORIGIN`.
- Generate a unique `IP_HASH_SALT`.
- Mount persistent storage at `/app/data`.
- Configure TLS at the reverse proxy or platform.
- Monitor `/healthz`.
- Verify the contact form from the public domain.
- Confirm database backups and a tested restore path.
- Review legal pages with qualified counsel.
- Run `npm run check` against the release commit.

## Accessibility

The interface includes semantic headings, keyboard-operable navigation and forms, visible focus, a skip link, responsive layouts, reduced-motion support, readable contrast, and targets sized for touch. Report barriers through the contact page or email address.

## Known limitations

- SQLite is appropriate for a single application instance with persistent local storage. Multi-region or horizontally scaled deployment requires a shared database design.
- The in-memory rate limiter resets when the process restarts and is not shared across instances.
- The contact database needs an operational review process after deployment.
- Linked repositories and third-party sites have independent availability and accessibility behavior.

## Legal note

The Privacy, Terms, Cookies, Accessibility, and Security pages describe the current implementation. Have qualified counsel review them before commercial launch or collecting sensitive categories of data.

## License

The website source is released under the [MIT License](LICENSE). Linked projects retain their own repository licenses.
