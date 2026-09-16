# DevPilotX.me

Production source for the DevPilotX.me engineering portfolio, project archive, and secure contact workflow.

## What ships here

- Distinct pages for Home, Work, Portfolio, Method, Profile, Contact, Privacy, Terms, Cookies, Accessibility, and Security
- Fifteen dedicated project case studies
- Native Node.js 24 HTTP server using modern ESM
- SQLite contact storage with migrations and WAL mode
- CSP-safe responsive navigation and contact form behavior
- Custom SVG identity, favicon, social preview, sitemap, robots file, and web manifest
- Docker packaging, automated CI, integration tests, and content guardrails

## Architecture

- **Runtime:** Node.js 24 with no third-party runtime dependencies
- **Server:** Native `node:http` routing with explicit handlers
- **Views:** Server-rendered HTML with a shared accessible layout
- **Client:** Small external JavaScript runtime at `/assets/app.js`
- **Data:** Native `node:sqlite`, WAL mode, parameterized writes, and migration tracking
- **Assets:** CSS and original SVG artwork served from `/public`

## Routes

### Public pages

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

### APIs and operations

- `GET /healthz`
- `GET /api/projects`
- `GET /api/projects/:slug`
- `POST /api/contact`
- `GET /robots.txt`
- `GET /sitemap.xml`

## Selected projects

| Project | Repository | Public destination |
| --- | --- | --- |
| Permission Bureau | [auspice](https://github.com/devpilotX/auspice) | Repository |
| Veydria | [Veydria](https://github.com/devpilotX/Veydria) | Repository |
| Quant | [Quant](https://github.com/devpilotX/Quant) | Repository |
| ProofSmith | [ProofSmith](https://github.com/devpilotX/ProofSmith) | Repository |
| FerroDB | [FerroDB](https://github.com/devpilotX/FerroDB) | Repository |
| AEGIS | [aegis](https://github.com/devpilotX/aegis) | Repository |
| Paisa Reality | [paisarealitymoney](https://github.com/devpilotX/paisarealitymoney) | [paisareality.com](https://paisareality.com) |
| Bank Legacy | [Bank-Legacy](https://github.com/devpilotX/Bank-Legacy) | Repository |
| Verify Bill | [verifybill](https://github.com/devpilotX/verifybill) | Repository |
| Value.Codes | [Value.Codes](https://github.com/devpilotX/Value.Codes) | [value.codes](https://value.codes) |
| TenderEdge | [tenderedge](https://github.com/devpilotX/tenderedge) | Repository |
| Vouch | [Vouch](https://github.com/devpilotX/Vouch) | Repository |
| CreatorBooks | [CreatorBooks](https://github.com/devpilotX/CreatorBooks) | Repository |
| SmartLabel Inspector | [smart-label-gov](https://github.com/devpilotX/smart-label-gov) | Repository |
| Mergenote | [mergenote](https://github.com/devpilotX/mergenote) | Repository |

The separate [devpilotx.com](https://devpilotx.com) destination is preserved on the Profile page. A temporarily unavailable upstream site does not affect repository access.

## Security baseline

- Restrictive Content Security Policy with external scripts only
- Frame, MIME sniffing, referrer, permissions, and production HSTS headers
- Same-origin enforcement for contact submissions
- Honeypot protection and strict server-side validation
- Configurable request body limit and rate limiting
- Hashed network identifiers instead of raw IP storage
- Parameterized SQLite writes
- Structured logs with request IDs
- Graceful SIGTERM and SIGINT shutdown handling
- Automated checks for prohibited placeholders, malformed URL wrappers, inline scripts, and copy constraints

## Database and migrations

Migrations live in `db/migrations`.

`001_create_contacts.sql` creates the contact table and supporting indexes. The application creates a migration ledger and applies pending migrations during startup.

Persistent paths:

- Local: `./data/devpilotx.sqlite`
- Container: `/app/data/devpilotx.sqlite`

Mount `/app/data` on durable storage in production.

## Local setup

```bash
npm ci
cp .env.example .env
npm start
```

Open `http://localhost:3000`.

For production, set a unique secret `IP_HASH_SALT`, set `SITE_ORIGIN` to the public HTTPS origin, and place `DATABASE_PATH` on persistent storage.

## Quality checks

```bash
npm run lint
npm test
npm run check
```

The integration suite starts an isolated server and temporary database. It verifies every public route, every case study, security headers, CSP-compatible assets, APIs, contact rejection and persistence, metadata, sitemap output, content guardrails, and the custom 404.

## Container deployment

```bash
docker build -t devpilotx-site .
docker run --rm -p 3000:3000 \
  -e SITE_ORIGIN=https://devpilotx.me \
  -e IP_HASH_SALT=replace-with-a-long-random-secret \
  -v "$(pwd)/data:/app/data" \
  devpilotx-site
```

## CI

`.github/workflows/ci.yml` runs `npm ci` and `npm run check` on Node.js 24 with read-only repository permissions.

## Legal note

The Privacy, Terms, Cookies, Accessibility, and Security pages describe the behavior implemented in this repository. Have qualified counsel review the legal copy before commercial launch.

## License

MIT. See [LICENSE](LICENSE).