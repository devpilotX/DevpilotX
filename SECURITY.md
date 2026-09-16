# Security Policy

## Supported Versions

The main branch is actively maintained for security updates.

## Reporting a Vulnerability

Please report vulnerabilities through private channels before public disclosure.

1. Send a detailed report to the maintainers with reproduction steps.
2. Include impact, affected routes or APIs, and suggested mitigations if known.
3. Allow time for triage and coordinated remediation before publication.

We aim to acknowledge reports within 3 business days.

## Operational Security Controls

- Restrictive HTTP security headers, including CSP and frame protections.
- Same-origin contact submission checks.
- JSON request-size limits.
- Honeypot spam defense and per-IP hash rate limiting.
- SQLite parameterized writes and WAL mode.
- Structured logs with request IDs.
