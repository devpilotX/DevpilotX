import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const MIGRATION_FILE = '001_create_contacts.sql';

export function ensureDbDirectory(dbPath) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

export function createDatabase(dbPath) {
  ensureDbDirectory(dbPath);
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA busy_timeout = 5000;');
  runMigrations(db);
  return db;
}

function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const hasMigration = db
    .prepare('SELECT id FROM migrations WHERE id = ?')
    .get(MIGRATION_FILE);

  if (hasMigration) {
    return;
  }

  const migrationPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'db', 'migrations', MIGRATION_FILE);
  const sql = fs.readFileSync(migrationPath, 'utf8');

  db.exec('BEGIN;');
  try {
    db.exec(sql);
    db.prepare('INSERT INTO migrations (id, applied_at) VALUES (?, ?)').run(MIGRATION_FILE, new Date().toISOString());
    db.exec('COMMIT;');
  } catch (error) {
    db.exec('ROLLBACK;');
    throw error;
  }
}

export function insertContact(db, payload) {
  const statement = db.prepare(`
    INSERT INTO contacts (
      request_id,
      name,
      email,
      company,
      project_interest,
      message,
      hashed_ip,
      user_agent,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  statement.run(
    payload.requestId,
    payload.name,
    payload.email,
    payload.company,
    payload.projectInterest,
    payload.message,
    payload.hashedIp,
    payload.userAgent,
    payload.createdAt
  );
}

export function countContacts(db) {
  const row = db.prepare('SELECT COUNT(*) AS total FROM contacts').get();
  return row?.total ?? 0;
}
