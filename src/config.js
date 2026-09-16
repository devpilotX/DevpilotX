import path from 'node:path';

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function loadConfig(overrides = {}) {
  const env = process.env;
  const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const dbPath = overrides.dbPath ?? env.DATABASE_PATH ?? path.join(rootDir, 'data', 'devpilotx.sqlite');

  return {
    appName: 'DevPilotX.me',
    rootDir,
    env: overrides.env ?? env.NODE_ENV ?? 'development',
    host: overrides.host ?? env.HOST ?? '0.0.0.0',
    port: overrides.port ?? toPositiveInt(env.PORT, 3000),
    dbPath,
    publicDir: path.join(rootDir, 'public'),
    requestBodyLimitBytes: overrides.requestBodyLimitBytes ?? toPositiveInt(env.REQUEST_BODY_LIMIT_BYTES, 16_384),
    rateLimitWindowMs: overrides.rateLimitWindowMs ?? toPositiveInt(env.RATE_LIMIT_WINDOW_MS, 60_000),
    rateLimitMaxRequests: overrides.rateLimitMaxRequests ?? toPositiveInt(env.RATE_LIMIT_MAX_REQUESTS, 12),
    siteOrigin: overrides.siteOrigin ?? env.SITE_ORIGIN ?? 'http://localhost:3000',
    ipHashSalt: overrides.ipHashSalt ?? env.IP_HASH_SALT ?? 'devpilotx-local-salt',
    logLevel: overrides.logLevel ?? env.LOG_LEVEL ?? 'info'
  };
}
