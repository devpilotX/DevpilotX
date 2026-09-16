# Security Policy

## Supported version

The latest commit on `main` is the only supported version. Security fixes are not backported to older commits.

## Report a vulnerability

Send a private report to `devpilotx@gmail.com` before public disclosure.

Include:

- Affected route, component, or commit
- Clear reproduction steps
- Expected and observed behavior
- Practical impact
- A minimal proof of concept that does not expose another person’s data
- Suggested mitigation, if known

Do not include passwords, API keys, session values, database exports, or personal records in the first message.

## Testing boundaries

Good-faith testing must not:

- Access, alter, or delete another person’s data
- Degrade availability or create significant traffic
- Use social engineering, phishing, or physical intrusion
- Upload malware or destructive payloads
- Test third-party services linked from this repository
- Publish an unresolved vulnerability before coordinated disclosure

Stop testing and report immediately if sensitive information is encountered.

## Response process

Reports are triaged according to reproducibility, affected data, required access, and practical impact. Receipt will be acknowledged when possible, but no fixed remediation deadline or bounty is promised. Status updates may be provided during investigation and coordinated disclosure.

## Safe harbor

The maintainer will not pursue action against good-faith research that follows this policy, avoids privacy harm, and gives reasonable time for remediation. This statement does not authorize testing against third-party infrastructure or activity prohibited by applicable law.

## Security design

The application includes:

- Restrictive Content Security Policy
- External scripts without `unsafe-inline`
- Same-origin contact submission checks
- Request-size limits and abuse rate limiting
- Honeypot validation
- Salted network-address hashes instead of raw address storage
- Parameterized SQLite writes and migration tracking
- Structured logs with request identifiers
- Production HSTS and frame protections
- Environment-based secret configuration

These controls reduce risk but do not guarantee that defects are absent.
