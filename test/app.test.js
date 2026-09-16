import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { createServer } from '../src/server.js';
import { selectedProjects } from '../src/projects.js';

const requiredRoutes = ['/', '/work', '/portfolio', '/method', '/profile', '/contact', '/privacy', '/terms', '/cookies', '/accessibility', '/security'];

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devpilotx-test-'));
const dbPath = path.join(tempDir, 'test.sqlite');

let server;
let baseUrl;

before(async () => {
  const app = createServer({
    dbPath,
    env: 'production',
    ipHashSalt: 'test-salt',
    siteOrigin: 'http://127.0.0.1:0',
    rateLimitWindowMs: 60_000,
    rateLimitMaxRequests: 20
  });

  server = app.server;

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      app.config.siteOrigin = baseUrl;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('public routes return 200', async () => {
  for (const route of requiredRoutes) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `Expected 200 for ${route}`);
    const html = await response.text();
    assert.match(html, /<h1>/);
  }
});

test('project detail route exists for every selected project', async () => {
  for (const project of selectedProjects) {
    const response = await fetch(`${baseUrl}/portfolio/${project.slug}`);
    assert.equal(response.status, 200, `Expected detail route for ${project.slug}`);
    const html = await response.text();
    assert.match(html, new RegExp(project.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('security headers are present', async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.headers.get('content-security-policy')?.includes("default-src 'self'"), true);
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.equal(response.headers.get('permissions-policy')?.includes('camera=()'), true);
  assert.equal(response.headers.get('strict-transport-security')?.includes('max-age='), true);
  assert.ok(response.headers.get('x-request-id'));
});

test('health and project APIs work', async () => {
  const health = await fetch(`${baseUrl}/healthz`);
  assert.equal(health.status, 200);
  const healthPayload = await health.json();
  assert.equal(healthPayload.status, 'ok');

  const projects = await fetch(`${baseUrl}/api/projects`);
  assert.equal(projects.status, 200);
  const projectPayload = await projects.json();
  assert.equal(projectPayload.projects.length, selectedProjects.length);

  const firstSlug = selectedProjects[0].slug;
  const project = await fetch(`${baseUrl}/api/projects/${firstSlug}`);
  assert.equal(project.status, 200);
  const detail = await project.json();
  assert.equal(detail.project.slug, firstSlug);

  const missing = await fetch(`${baseUrl}/api/projects/unknown`);
  assert.equal(missing.status, 404);
});

test('contact API validates invalid requests and stores valid submissions', async () => {
  const bad = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({})
  });
  assert.equal(bad.status, 403);

  const honeypot = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: baseUrl
    },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      company: 'DevPilotX',
      projectInterest: 'Portfolio',
      message: 'Need architecture review.',
      website: 'bot'
    })
  });
  assert.equal(honeypot.status, 400);

  const good = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: baseUrl,
      'user-agent': 'test-agent'
    },
    body: JSON.stringify({
      name: 'Ava',
      email: 'ava@example.com',
      company: 'Atlas',
      projectInterest: 'Security',
      message: 'Please share availability for next week.',
      website: ''
    })
  });
  assert.equal(good.status, 201);

  const db = new DatabaseSync(dbPath, { open: true });
  const row = db.prepare('SELECT name, email, hashed_ip FROM contacts ORDER BY id DESC LIMIT 1').get();
  db.close();

  assert.equal(row.name, 'Ava');
  assert.equal(row.email, 'ava@example.com');
  assert.equal(row.hashed_ip.length, 64);
  assert.equal(row.hashed_ip.includes('127.0.0.1'), false);
});

test('custom 404 page is returned for unknown routes', async () => {
  const response = await fetch(`${baseUrl}/missing-route`);
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /The page you requested was not found/);
});
