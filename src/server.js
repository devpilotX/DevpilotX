import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { URL } from 'node:url';
import { createDatabase, insertContact } from './db.js';
import { loadConfig } from './config.js';
import { projectsBySlug, selectedProjects } from './projects.js';
import { render404, renderPage } from './templates.js';

const STATIC_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json; charset=utf-8'
};

function jsonLog(level, event, fields = {}) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    ...fields
  };
  console.log(JSON.stringify(payload));
}

function createRateLimiter(config) {
  const buckets = new Map();

  return {
    isAllowed(key) {
      const now = Date.now();
      const cutoff = now - config.rateLimitWindowMs;
      const history = buckets.get(key) ?? [];
      const recent = history.filter((timestamp) => timestamp > cutoff);
      if (recent.length >= config.rateLimitMaxRequests) {
        buckets.set(key, recent);
        return false;
      }
      recent.push(now);
      buckets.set(key, recent);
      return true;
    }
  };
}

function getIpHash(config, request) {
  const direct = request.socket.remoteAddress ?? 'unknown';
  return crypto.createHash('sha256').update(`${config.ipHashSalt}:${direct}`).digest('hex');
}

function sameOrigin(config, request) {
  const origin = request.headers.origin;
  if (!origin) {
    return false;
  }

  try {
    const incoming = new URL(origin);
    const expected = new URL(config.siteOrigin);
    return incoming.protocol === expected.protocol && incoming.host === expected.host;
  } catch {
    return false;
  }
}

async function readJsonBody(request, limitBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > limitBytes) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(Object.assign(new Error('Invalid JSON body'), { statusCode: 400 }));
      }
    });

    request.on('error', () => {
      reject(Object.assign(new Error('Request body error'), { statusCode: 400 }));
    });
  });
}

function validateContactPayload(body) {
  const errors = [];
  const fields = {
    name: typeof body.name === 'string' ? body.name.trim() : '',
    email: typeof body.email === 'string' ? body.email.trim() : '',
    company: typeof body.company === 'string' ? body.company.trim() : '',
    projectInterest: typeof body.projectInterest === 'string' ? body.projectInterest.trim() : '',
    message: typeof body.message === 'string' ? body.message.trim() : '',
    website: typeof body.website === 'string' ? body.website.trim() : ''
  };

  if (!fields.name || fields.name.length > 80) {
    errors.push('Name is required and must be 1 to 80 characters.');
  }

  if (!fields.email || fields.email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.push('Email must be a valid address and at most 120 characters.');
  }

  if (fields.company.length > 120) {
    errors.push('Company must be 120 characters or fewer.');
  }

  if (fields.projectInterest.length > 160) {
    errors.push('Project interest must be 160 characters or fewer.');
  }

  if (!fields.message || fields.message.length > 2000) {
    errors.push('Message is required and must be 1 to 2000 characters.');
  }

  if (fields.website) {
    errors.push('Spam validation failed.');
  }

  return { fields, errors };
}

function securityHeaders(config) {
  const headers = {
    'Content-Security-Policy': "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
  };

  if (config.env === 'production') {
    headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload';
  }

  return headers;
}

function send(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, headers);
  response.end(body);
}

function serveStatic(config, requestPath, response) {
  const normalized = path.normalize(requestPath).replace(/^\/+/, '');
  const resolved = path.resolve(config.publicDir, normalized);

  if (!resolved.startsWith(config.publicDir)) {
    return false;
  }

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return false;
  }

  const ext = path.extname(resolved);
  const type = STATIC_TYPES[ext] ?? 'application/octet-stream';
  send(response, 200, fs.readFileSync(resolved), { 'content-type': type, 'cache-control': 'public, max-age=3600' });
  return true;
}

function sitemapXml() {
  const staticPaths = ['/', '/work', '/portfolio', '/method', '/profile', '/contact', '/privacy', '/terms', '/cookies', '/accessibility', '/security'];
  const allPaths = [...staticPaths, ...selectedProjects.map((project) => `/portfolio/${project.slug}`)];
  const urls = allPaths.map((pathname) => `<url><loc>https://devpilotx.me${pathname}</loc></url>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export function createServer(overrides = {}) {
  const config = loadConfig(overrides);
  const db = createDatabase(config.dbPath);
  const limiter = createRateLimiter(config);
  const commonSecurityHeaders = securityHeaders(config);

  const server = http.createServer(async (request, response) => {
    const requestId = crypto.randomUUID();
    const method = request.method ?? 'GET';
    const parsedUrl = new URL(request.url ?? '/', 'http://localhost');
    const pathname = parsedUrl.pathname;

    Object.entries({
      ...commonSecurityHeaders,
      'x-request-id': requestId
    }).forEach(([key, value]) => response.setHeader(key, value));

    try {
      if (pathname === '/healthz' && method === 'GET') {
        send(response, 200, JSON.stringify({ status: 'ok', service: config.appName }), { 'content-type': 'application/json; charset=utf-8' });
        return;
      }

      if (pathname === '/api/projects' && method === 'GET') {
        send(response, 200, JSON.stringify({ projects: selectedProjects }), { 'content-type': 'application/json; charset=utf-8' });
        return;
      }

      if (pathname.startsWith('/api/projects/') && method === 'GET') {
        const slug = pathname.slice('/api/projects/'.length);
        const project = projectsBySlug.get(slug);
        if (!project) {
          send(response, 404, JSON.stringify({ error: 'Project not found.' }), { 'content-type': 'application/json; charset=utf-8' });
          return;
        }
        send(response, 200, JSON.stringify({ project }), { 'content-type': 'application/json; charset=utf-8' });
        return;
      }

      if (pathname === '/api/contact' && method === 'POST') {
        if (!sameOrigin(config, request)) {
          send(response, 403, JSON.stringify({ error: 'Origin check failed.' }), { 'content-type': 'application/json; charset=utf-8' });
          return;
        }

        const ipHash = getIpHash(config, request);
        if (!limiter.isAllowed(ipHash)) {
          send(response, 429, JSON.stringify({ error: 'Rate limit exceeded.' }), { 'content-type': 'application/json; charset=utf-8' });
          return;
        }

        const body = await readJsonBody(request, config.requestBodyLimitBytes);
        const { fields, errors } = validateContactPayload(body);

        if (errors.length > 0) {
          send(response, 400, JSON.stringify({ error: errors.join(' ') }), { 'content-type': 'application/json; charset=utf-8' });
          return;
        }

        insertContact(db, {
          requestId,
          name: fields.name,
          email: fields.email,
          company: fields.company,
          projectInterest: fields.projectInterest,
          message: fields.message,
          hashedIp: ipHash,
          userAgent: String(request.headers['user-agent'] ?? ''),
          createdAt: new Date().toISOString()
        });

        send(response, 201, JSON.stringify({ ok: true, requestId }), { 'content-type': 'application/json; charset=utf-8' });
        return;
      }

      if (pathname === '/robots.txt' && method === 'GET') {
        send(response, 200, 'User-agent: *\nAllow: /\nSitemap: https://devpilotx.me/sitemap.xml\n', { 'content-type': 'text/plain; charset=utf-8' });
        return;
      }

      if (pathname === '/sitemap.xml' && method === 'GET') {
        send(response, 200, sitemapXml(), { 'content-type': 'application/xml; charset=utf-8' });
        return;
      }

      if (pathname.startsWith('/assets/') || pathname === '/favicon.svg' || pathname === '/site.webmanifest') {
        if (serveStatic(config, pathname, response)) {
          return;
        }
      }

      const html = pathname.startsWith('/portfolio/')
        ? renderPage(pathname, { project: projectsBySlug.get(pathname.split('/').pop()) })
        : renderPage(pathname);

      if (html) {
        send(response, 200, html, { 'content-type': 'text/html; charset=utf-8' });
        return;
      }

      send(response, 404, render404(), { 'content-type': 'text/html; charset=utf-8' });
    } catch (error) {
      send(response, Number.isInteger(error.statusCode) ? error.statusCode : 500, JSON.stringify({ error: 'Unexpected server error.', requestId }), {
        'content-type': 'application/json; charset=utf-8'
      });
      jsonLog('error', 'request_failure', {
        requestId,
        method,
        pathname,
        message: error.message
      });
      return;
    } finally {
      jsonLog('info', 'request', {
        requestId,
        method,
        pathname,
        statusCode: response.statusCode
      });
    }
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    jsonLog('info', 'shutdown_start', { signal });
    server.close(() => {
      db.close();
      jsonLog('info', 'shutdown_complete', { signal });
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  return { server, db, config };
}
