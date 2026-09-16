import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, test } from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { createServer } from '../src/server.js';
import { selectedProjects } from '../src/projects.js';

const requiredRoutes = ['/', '/work', '/portfolio', '/method', '/profile', '/contact', '/privacy', '/terms', '/cookies', '/accessibility', '/security'];
const expectedRepositories = [
  'https://github.com/devpilotX/auspice',
  'https://github.com/devpilotX/Veydria',
  'https://github.com/devpilotX/Quant',
  'https://github.com/devpilotX/ProofSmith',
  'https://github.com/devpilotX/FerroDB',
  'https://github.com/devpilotX/aegis',
  'https://github.com/devpilotX/paisarealitymoney',
  'https://github.com/devpilotX/Bank-Legacy',
  'https://github.com/devpilotX/Notion-Agent',
  'https://github.com/devpilotX/value.codes',
  'https://github.com/devpilotX/tenderedge',
  'https://github.com/devpilotX/vouch-backend',
  'https://github.com/devpilotX/OU-MRS',
  'https://github.com/devpilotX/epicenter-exchange',
  'https://github.com/devpilotX/mergenote'
];

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
  if (server) await new Promise((resolve) => server.close(resolve));
  fs.rmSync(tempDir, { recursive: true, force: true });
});

test('public routes return semantic pages', async () => {
  for (const route of requiredRoutes) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `Expected 200 for ${route}`);
    assert.match(response.headers.get('content-type') ?? '', /text\/html/);
    const html = await response.text();
    assert.match(html, /<h1>/);
    assert.match(html, /<nav id="site-nav"/);
    assert.match(html, /<footer class="site-footer">/);
  }
});

test('portfolio contains exactly the approved public repositories', () => {
  assert.equal(selectedProjects.length, 15);
  assert.deepEqual(selectedProjects.map((project) => project.repository), expectedRepositories);
  assert.equal(new Set(selectedProjects.map((project) => project.slug)).size, 15);
  assert.deepEqual(
    selectedProjects.filter((project) => project.live).map((project) => project.live),
    ['https://paisareality.com', 'https://value.codes', 'https://epicenterexchange.com']
  );
  for (const project of selectedProjects) {
    assert.ok(project.summary.length > 40);
    assert.ok(project.problem.length > 40);
    assert.ok(project.systemDesign.length > 40);
    assert.ok(project.evidence.startsWith('Repository signal:'));
    assert.ok(project.stack.length > 0);
  }
});

test('every selected project has a dedicated detail route', async () => {
  for (const project of selectedProjects) {
    const response = await fetch(`${baseUrl}/portfolio/${project.slug}`);
    assert.equal(response.status, 200, `Expected detail route for ${project.slug}`);
    const html = await response.text();
    assert.match(html, new RegExp(project.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(html, new RegExp(project.repository.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    if (project.live) assert.match(html, /Open live site/);
    else assert.doesNotMatch(html, /Open live site/);
  }
});

test('finance research pages include risk context', async () => {
  for (const slug of ['ou-mrs', 'epicenter-exchange']) {
    const response = await fetch(`${baseUrl}/portfolio/${slug}`);
    const html = await response.text();
    assert.match(html, /not investment advice/i);
  }
});

test('security headers are present and inline scripts are blocked', async () => {
  const response = await fetch(`${baseUrl}/`);
  const csp = response.headers.get('content-security-policy') ?? '';
  assert.match(csp, /default-src 'self'/);
  assert.match(csp, /script-src 'self'/);
  assert.doesNotMatch(csp, /'unsafe-inline'/);
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.match(response.headers.get('permissions-policy') ?? '', /camera=\(\)/);
  assert.match(response.headers.get('strict-transport-security') ?? '', /max-age=/);
  assert.ok(response.headers.get('x-request-id'));
});

test('pages load the external client runtime', async () => {
  for (const route of ['/', '/contact']) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    assert.match(html, /<script src="\/assets\/app\.js" defer><\/script>/);
    assert.equal(/<script(?![^>]*\bsrc=)[^>]*>/i.test(html), false);
  }
  const appScript = await fetch(`${baseUrl}/assets/app.js`);
  assert.equal(appScript.status, 200);
  assert.match(appScript.headers.get('content-type') ?? '', /text\/javascript/);
  const source = await appScript.text();
  assert.match(source, /menu-toggle/);
  assert.match(source, /contact-form/);
});

test('health and project APIs return stable data', async () => {
  const health = await fetch(`${baseUrl}/healthz`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, 'ok');

  const projects = await fetch(`${baseUrl}/api/projects`);
  assert.equal(projects.status, 200);
  const payload = await projects.json();
  assert.equal(payload.projects.length, 15);

  const project = await fetch(`${baseUrl}/api/projects/notion-agent`);
  assert.equal(project.status, 200);
  assert.equal((await project.json()).project.repository, 'https://github.com/devpilotX/Notion-Agent');

  const missing = await fetch(`${baseUrl}/api/projects/unknown`);
  assert.equal(missing.status, 404);
});

test('contact API rejects abuse and persists a valid submission', async () => {
  const missingOrigin = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.equal(missingOrigin.status, 403);

  const honeypot = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: baseUrl },
    body: JSON.stringify({ name: 'Test User', email: 'test@example.com', message: 'A valid looking message for testing.', website: 'bot' })
  });
  assert.equal(honeypot.status, 400);

  const invalid = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: baseUrl },
    body: JSON.stringify({ name: '', email: 'invalid', message: '' })
  });
  assert.equal(invalid.status, 400);

  const good = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: baseUrl, 'user-agent': 'test-agent' },
    body: JSON.stringify({
      name: 'Ava',
      email: 'ava@example.com',
      company: 'Atlas',
      projectInterest: 'Security architecture',
      message: 'Please share availability for an architecture review next week.',
      website: ''
    })
  });
  assert.equal(good.status, 201);
  assert.ok((await good.json()).requestId);

  const db = new DatabaseSync(dbPath, { open: true });
  const row = db.prepare('SELECT name, email, hashed_ip FROM contacts ORDER BY id DESC LIMIT 1').get();
  db.close();
  assert.equal(row.name, 'Ava');
  assert.equal(row.email, 'ava@example.com');
  assert.equal(row.hashed_ip.length, 64);
  assert.equal(row.hashed_ip.includes('127.0.0.1'), false);
});

test('metadata and sitemap use valid absolute URLs', async () => {
  const home = await fetch(`${baseUrl}/`);
  const html = await home.text();
  assert.match(html, /<link rel="canonical" href="https:\/\/devpilotx\.me\/"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/devpilotx\.me\/assets\/social-preview\.svg"/);
  assert.equal(html.includes('{{https://'), false);

  const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
  const xml = await sitemap.text();
  assert.match(xml, /<loc>https:\/\/devpilotx\.me\/portfolio\/notion-agent<\/loc>/);
  assert.match(xml, /<loc>https:\/\/devpilotx\.me\/portfolio\/epicenter-exchange<\/loc>/);
  assert.doesNotMatch(xml, /smart-label/i);
  assert.equal(xml.includes('{{https://'), false);
});

test('unknown routes return the custom 404', async () => {
  const response = await fetch(`${baseUrl}/missing-route`);
  assert.equal(response.status, 404);
  assert.match(await response.text(), /This route does not exist/);
});

test('source content passes publication guardrails', () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const extensions = new Set(['.js', '.css', '.html', '.xml']);
  const pending = [path.join(root, 'src'), path.join(root, 'public')];
  let scanned = 0;

  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        pending.push(fullPath);
        continue;
      }
      if (!extensions.has(path.extname(entry.name))) continue;
      scanned += 1;
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.equal(content.includes('—'), false, `Em dash detected in ${fullPath}`);
      assert.equal(/\broadmap\b/i.test(content), false, `Prohibited planning label detected in ${fullPath}`);
      assert.equal(/lorem ipsum/i.test(content), false, `Placeholder copy detected in ${fullPath}`);
      assert.equal(/\bTODO\b/.test(content), false, `Unfinished marker detected in ${fullPath}`);
      assert.equal(/smart-label-gov|SmartLabel Inspector/i.test(content), false, `Excluded repository detected in ${fullPath}`);
      assert.equal(/github\.com\/devpilotX\/(CreatorBooks|verifybill|verify-bill|Vouch)(?:[/'"\s]|$)/i.test(content), false, `Private repository link detected in ${fullPath}`);
      assert.equal(/\{\{\s*https?:\/\/[^}]+\s*\}\}/i.test(content), false, `Malformed URL wrapper detected in ${fullPath}`);
      assert.equal(/<script(?![^>]*\bsrc=)[^>]*>/i.test(content), false, `Inline script detected in ${fullPath}`);
    }
  }
  assert.ok(scanned > 0);
});
