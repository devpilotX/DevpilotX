export const selectedProjects = [
  {
    name: 'Permission Bureau',
    slug: 'auspice',
    domain: 'Identity and permission intelligence',
    problem: 'Regulated teams needed permission workflows with policy traceability and lower review latency.',
    systemDesign: 'Policy graph engine with deterministic evaluation, audit trails, and signed approvals across services.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/auspice and /api/projects/auspice.',
    repository: 'https://github.com/devpilotX/auspice',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Veydria',
    slug: 'veydria',
    domain: 'Applied autonomy orchestration',
    problem: 'Operations teams lacked predictable automation governance across mixed cloud fleets.',
    systemDesign: 'Event-driven orchestration plane with policy templates, deterministic job state transitions, and override controls.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/veydria and /api/projects/veydria.',
    repository: 'https://github.com/devpilotX/Veydria',
    live: 'https://devpilotx.com'
  },
  {
    name: 'QuantSys',
    slug: 'quant',
    domain: 'Systematic strategy infrastructure',
    problem: 'Research and execution pipelines were fragmented and hard to reproduce across environments.',
    systemDesign: 'Unified data ingestion, simulation, and execution stack with immutable run manifests and replay tooling.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/quant and /api/projects/quant.',
    repository: 'https://github.com/devpilotX/Quant',
    live: 'https://devpilotx.com'
  },
  {
    name: 'ProofSmith',
    slug: 'proofsmith',
    domain: 'Verification workflow tooling',
    problem: 'Technical writing and verification teams needed grounded evidence capture during review cycles.',
    systemDesign: 'Claim graph editor with source binding, evidence checkpoints, and exportable review packets.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/proofsmith and /api/projects/proofsmith.',
    repository: 'https://github.com/devpilotX/ProofSmith',
    live: 'https://devpilotx.com'
  },
  {
    name: 'FerroDB',
    slug: 'ferrodb',
    domain: 'Data infrastructure and storage',
    problem: 'Teams needed compact local-first storage with deterministic migrations and low operational overhead.',
    systemDesign: 'Embedded storage layer with WAL durability, migration gating, and typed query boundaries.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/ferrodb and /api/projects/ferrodb.',
    repository: 'https://github.com/devpilotX/FerroDB',
    live: 'https://devpilotx.com'
  },
  {
    name: 'AEGIS',
    slug: 'aegis',
    domain: 'Security assurance platform',
    problem: 'Security programs required actionable control validation instead of static checklists.',
    systemDesign: 'Continuous control probes with policy packs, signed findings, and risk-prioritized remediation queues.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/aegis and /api/projects/aegis.',
    repository: 'https://github.com/devpilotX/aegis',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Paisa Reality',
    slug: 'paisarealitymoney',
    domain: 'Financial clarity and public trust',
    problem: 'Users needed clearer framing of pricing, inflation impact, and real purchasing power.',
    systemDesign: 'Scenario engine combining pricing feeds, normalized reference baskets, and explainable change narratives.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/paisarealitymoney and /api/projects/paisarealitymoney.',
    repository: 'https://github.com/devpilotX/paisarealitymoney',
    live: 'https://paisareality.com'
  },
  {
    name: 'Bank Legacy',
    slug: 'bank-legacy',
    domain: 'Core modernization execution',
    problem: 'Legacy banking workflows were difficult to evolve without introducing migration risk.',
    systemDesign: 'Strangler-pattern services around core ledgers with dual-write verification and cutover safeguards.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/bank-legacy and /api/projects/bank-legacy.',
    repository: 'https://github.com/devpilotX/Bank-Legacy',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Verify Bill',
    slug: 'verify-bill',
    domain: 'Billing integrity and audit',
    problem: 'Billing disputes were expensive due to low traceability between pricing logic and invoices.',
    systemDesign: 'Deterministic invoice calculator with rule snapshots, dispute diffs, and signed export trails.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/verify-bill and /api/projects/verify-bill.',
    repository: 'https://github.com/devpilotX/verify-bill',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Value.Codes',
    slug: 'value-codes',
    domain: 'Developer value intelligence',
    problem: 'Teams needed practical benchmarks connecting code quality improvements to business outcomes.',
    systemDesign: 'Repository signal ingestion with weighted scoring, calibration controls, and trend reporting.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/value-codes and /api/projects/value-codes.',
    repository: 'https://github.com/devpilotX/Value.Codes',
    live: 'https://value.codes'
  },
  {
    name: 'TenderEdge',
    slug: 'tenderedge',
    domain: 'Procurement response systems',
    problem: 'Bid teams needed rapid draft generation with strict evidence traceability.',
    systemDesign: 'Structured requirements parser with evidence-linked response modules and approval workflows.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/tenderedge and /api/projects/tenderedge.',
    repository: 'https://github.com/devpilotX/tenderedge',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Vouch',
    slug: 'vouch',
    domain: 'Trust signaling infrastructure',
    problem: 'Communities needed verifiable endorsements resistant to spoofing and replay attacks.',
    systemDesign: 'Cryptographic attestation model with revocation lists, issuer trust ladders, and proof endpoints.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/vouch and /api/projects/vouch.',
    repository: 'https://github.com/devpilotX/Vouch',
    live: 'https://devpilotx.com'
  },
  {
    name: 'CreatorBooks',
    slug: 'creatorbooks',
    domain: 'Creator finance operations',
    problem: 'Small creative businesses lacked lightweight accounting workflows designed for variable revenue cycles.',
    systemDesign: 'Ledger-aware workspace with receivable tracking, reconciliation helpers, and compliance exports.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/creatorbooks and /api/projects/creatorbooks.',
    repository: 'https://github.com/devpilotX/CreatorBooks',
    live: 'https://devpilotx.com'
  },
  {
    name: 'SmartLabel Inspector',
    slug: 'smart-label-gov',
    domain: 'Public labeling compliance',
    problem: 'Inspection teams needed consistent validation of labeling rules across rapidly changing standards.',
    systemDesign: 'Rule engine backed inspection checklist with machine-assisted exception highlighting and report exports.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/smart-label-gov and /api/projects/smart-label-gov.',
    repository: 'https://github.com/devpilotX/smart-label-gov',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Mergenote',
    slug: 'mergenote',
    domain: 'Collaboration knowledge continuity',
    problem: 'Teams lost decision rationale across pull request and release handoffs.',
    systemDesign: 'Merge-aware note graph that binds decisions to commits, reviews, and release checkpoints.',
    evidence: 'Implementation signal: this case study is defined in src/projects.js and served at /portfolio/mergenote and /api/projects/mergenote.',
    repository: 'https://github.com/devpilotX/mergenote',
    live: 'https://devpilotx.com'
  }
];

export const projectsBySlug = new Map(selectedProjects.map((project) => [project.slug, project]));
