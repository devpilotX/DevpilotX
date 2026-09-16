# DevPilotX.me

Production-ready multi-page website and contact workflow for DevPilotX.

## Architecture

- **Runtime**: Node.js 24, native ESM JavaScript, no third-party runtime dependencies.
- **Server**: Native `http` server with explicit route handlers.
- **Views**: Server-rendered HTML templates with shared layout, responsive nav, and accessible focus behavior.
- **Data**: SQLite (`node:sqlite`) with WAL mode and migration tracking.
- **Static assets**: CSS, SVG logo mark, favicon, social preview, and web manifest from `/public`.

## Routes

### Public pages

- `/`
- `/work`
- `/portfolio`
- `/portfolio/:slug` for each selected case study
- `/method`
- `/profile`
- `/contact`
- `/privacy`
- `/terms`
- `/cookies`
- `/accessibility`
- `/security`

### APIs and operations

- `GET /healthz`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `POST /api/contact`
- `GET /robots.txt`
- `GET /sitemap.xml`

## Selected projects

| Project | Slug | Domain | Repository | Live |
| --- | --- | --- | --- | --- |
| Permission Bureau | `auspice` | Identity and permission intelligence | https://github.com/devpilotX/auspice | https://devpilotx.com |
| Veydria | `veydria` | Applied autonomy orchestration | https://github.com/devpilotX/veydria | https://devpilotx.com |
| QuantSys | `quant` | Systematic strategy infrastructure | https://github.com/devpilotX/quant | https://devpilotx.com |
| ProofSmith | `proofsmith` | Verification workflow tooling | https://github.com/devpilotX/proofsmith | https://devpilotx.com |
| FerroDB | `ferrodb` | Data infrastructure and storage | https://github.com/devpilotX/ferrodb | https://devpilotx.com |
| AEGIS | `aegis` | Security assurance platform | https://github.com/devpilotX/aegis | https://devpilotx.com |
| Paisa Reality | `paisarealitymoney` | Financial clarity and public trust | https://github.com/devpilotX/paisarealitymoney | https://paisareality.com |
| Bank Legacy | `bank-legacy` | Core modernization execution | https://github.com/devpilotX/bank-legacy | https://devpilotx.com |
| Verify Bill | `verify-bill` | Billing integrity and audit | https://github.com/devpilotX/verify-bill | https://devpilotx.com |
| Value.Codes | `value-codes` | Developer value intelligence | https://github.com/devpilotX/value-codes | https://value.codes |
| TenderEdge | `tenderedge` | Procurement response systems | https://github.com/devpilotX/tenderedge | https://devpilotx.com |
| Vouch | `vouch` | Trust signaling infrastructure | https://github.com/devpilotX/vouch | https://devpilotx.com |
| CreatorBooks | `creatorbooks` | Creator finance operations | https://github.com/devpilotX/creatorbooks | https://devpilotx.com |
| SmartLabel Inspector | `smart-label-gov` | Public labeling compliance | https://github.com/devpilotX/smart-label-gov | https://devpilotx.com |
| Mergenote | `mergenote` | Collaboration knowledge continuity | https://github.com/devpilotX/mergenote | https://devpilotx.com |

## Security controls

- CSP, frame protections, MIME sniffing protection, referrer policy, permissions policy.
- Production HSTS when `NODE_ENV=production`.
- Same-origin enforcement for contact API.
- Honeypot spam field and strict server-side validation.
- Request body size cap (`REQUEST_BODY_LIMIT_BYTES`).
- In-memory rate limiting keyed by hashed client IP.
- Parameterized SQLite writes and migration tracking.
- Structured JSON logs with per-request IDs.
- Graceful shutdown handling for SIGTERM and SIGINT.

## Database and migrations

Schema migrations live in `db/migrations`.

Current migration:

- `001_create_contacts.sql` creates `contacts` and indexes.

The server creates the migration ledger table (`migrations`) and applies pending migration files at startup.

### Persistent operations

- Local default database path: `./data/devpilotx.sqlite`
- Docker default database path: `/app/data/devpilotx.sqlite`
- Keep database files on persistent storage for production workloads.

## Local setup

```bash
npm ci
cp .env.example .env
npm start
```

Open `http://localhost:3000`.

## Environment variables

See `.env.example`.

Important values:

- `SITE_ORIGIN` must match the public origin for same-origin contact protection.
- `IP_HASH_SALT` must be unique and secret in production.
- `DATABASE_PATH` should point to persistent storage.

## Testing and quality checks

```bash
npm run lint
npm test
npm run check
```

The integration tests start an isolated server with a temporary SQLite database and validate routes, headers, APIs, contact behavior, and custom 404 handling.

## Deployment

### Container

```bash
docker build -t devpilotx-site .
docker run -p 3000:3000 -e IP_HASH_SALT=replace-me -v $(pwd)/data:/app/data devpilotx-site
```

### GitHub Actions CI

Workflow: `.github/workflows/ci.yml`

- Uses Node.js 24
- Installs dependencies with `npm ci`
- Runs `npm run check`

## Legal note

Privacy, terms, cookies, accessibility, and security pages match current behavior of this codebase. This legal copy should be reviewed by qualified counsel before any commercial launch.
