export const selectedProjects = [
  {
    name: 'Permission Bureau',
    slug: 'auspice',
    domain: 'Identity and permission intelligence',
    problem: 'Regulated teams needed permission workflows with policy traceability and lower review latency.',
    systemDesign: 'Policy graph engine with deterministic evaluation, audit trails, and signed approvals across services.',
    evidence: 'Strongest signal: deterministic policy evaluation with signed approvals and auditable trace logs.',
    repository: 'https://github.com/devpilotX/auspice',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Veydria',
    slug: 'veydria',
    domain: 'Applied autonomy orchestration',
    problem: 'Operations teams lacked predictable automation governance across mixed cloud fleets.',
    systemDesign: 'Event-driven orchestration plane with policy templates, deterministic job state transitions, and override controls.',
    evidence: 'Strongest signal: deterministic orchestration state transitions with explicit operator override paths.',
    repository: 'https://github.com/devpilotX/Veydria',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Quant',
    slug: 'quant',
    domain: 'Systematic strategy infrastructure',
    problem: 'Research and execution pipelines were fragmented and hard to reproduce across environments.',
    systemDesign: 'Unified data ingestion, simulation, and execution stack with immutable run manifests and replay tooling.',
    evidence: 'Strongest signal: immutable run manifests and replay tooling across ingestion, simulation, and execution flows.',
    repository: 'https://github.com/devpilotX/Quant',
    live: 'https://devpilotx.com'
  },
  {
    name: 'ProofSmith',
    slug: 'proofsmith',
    domain: 'Verification workflow tooling',
    problem: 'Technical writing and verification teams needed grounded evidence capture during review cycles.',
    systemDesign: 'Claim graph editor with source binding, evidence checkpoints, and exportable review packets.',
    evidence: 'Strongest signal: claim graph evidence binding with review checkpoints and exportable verification packets.',
    repository: 'https://github.com/devpilotX/ProofSmith',
    live: 'https://devpilotx.com'
  },
  {
    name: 'FerroDB',
    slug: 'ferrodb',
    domain: 'Data infrastructure and storage',
    problem: 'Teams needed compact local-first storage with deterministic migrations and low operational overhead.',
    systemDesign: 'Embedded storage layer with WAL durability, migration gating, and typed query boundaries.',
    evidence: 'Strongest signal: WAL durability, deterministic migration gating, and typed query boundary enforcement.',
    repository: 'https://github.com/devpilotX/FerroDB',
    live: 'https://devpilotx.com'
  },
  {
    name: 'AEGIS',
    slug: 'aegis',
    domain: 'Security assurance platform',
    problem: 'Security programs required actionable control validation instead of static checklists.',
    systemDesign: 'Continuous control probes with policy packs, signed findings, and risk-prioritized remediation queues.',
    evidence: 'Strongest signal: continuous control probes with signed findings and risk-prioritized remediation queues.',
    repository: 'https://github.com/devpilotX/aegis',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Paisa Reality',
    slug: 'paisarealitymoney',
    domain: 'Financial clarity and public trust',
    problem: 'Users needed clearer framing of pricing, inflation impact, and real purchasing power.',
    systemDesign: 'Scenario engine combining pricing feeds, normalized reference baskets, and explainable change narratives.',
    evidence: 'Strongest signal: scenario engine output with normalized basket comparisons and explainable change narratives.',
    repository: 'https://github.com/devpilotX/paisarealitymoney',
    live: 'https://paisareality.com'
  },
  {
    name: 'Bank Legacy',
    slug: 'bank-legacy',
    domain: 'Core modernization execution',
    problem: 'Legacy banking workflows were difficult to evolve without introducing migration risk.',
    systemDesign: 'Strangler-pattern services around core ledgers with dual-write verification and cutover safeguards.',
    evidence: 'Strongest signal: dual-write verification with staged cutover safeguards around ledger modernization.',
    repository: 'https://github.com/devpilotX/Bank-Legacy',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Verify Bill',
    slug: 'verify-bill',
    domain: 'Billing integrity and audit',
    problem: 'Billing disputes were expensive due to low traceability between pricing logic and invoices.',
    systemDesign: 'Deterministic invoice calculator with rule snapshots, dispute diffs, and signed export trails.',
    evidence: 'Strongest signal: deterministic invoice rule snapshots with signed dispute diff exports.',
    repository: 'https://github.com/devpilotX/verifybill',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Value.Codes',
    slug: 'value-codes',
    domain: 'Developer value intelligence',
    problem: 'Teams needed practical benchmarks connecting code quality improvements to business outcomes.',
    systemDesign: 'Repository signal ingestion with weighted scoring, calibration controls, and trend reporting.',
    evidence: 'Strongest signal: repository signal ingestion with weighted scoring, calibration controls, and trend reporting.',
    repository: 'https://github.com/devpilotX/Value.Codes',
    live: 'https://value.codes'
  },
  {
    name: 'TenderEdge',
    slug: 'tenderedge',
    domain: 'Procurement response systems',
    problem: 'Bid teams needed rapid draft generation with strict evidence traceability.',
    systemDesign: 'Structured requirements parser with evidence-linked response modules and approval workflows.',
    evidence: 'Strongest signal: requirements parsing linked to evidence-backed response modules and approval workflows.',
    repository: 'https://github.com/devpilotX/tenderedge',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Vouch',
    slug: 'vouch',
    domain: 'Trust signaling infrastructure',
    problem: 'Communities needed verifiable endorsements resistant to spoofing and replay attacks.',
    systemDesign: 'Cryptographic attestation model with revocation lists, issuer trust ladders, and proof endpoints.',
    evidence: 'Strongest signal: cryptographic attestations with revocation lists, issuer trust ladders, and proof endpoints.',
    repository: 'https://github.com/devpilotX/Vouch',
    live: 'https://devpilotx.com'
  },
  {
    name: 'CreatorBooks',
    slug: 'creatorbooks',
    domain: 'Creator finance operations',
    problem: 'Small creative businesses lacked lightweight accounting workflows designed for variable revenue cycles.',
    systemDesign: 'Ledger-aware workspace with receivable tracking, reconciliation helpers, and compliance exports.',
    evidence: 'Strongest signal: ledger-aware receivable tracking with reconciliation helpers and compliance export paths.',
    repository: 'https://github.com/devpilotX/CreatorBooks',
    live: 'https://devpilotx.com'
  },
  {
    name: 'SmartLabel Inspector',
    slug: 'smart-label-gov',
    domain: 'Public labeling compliance',
    problem: 'Inspection teams needed consistent validation of labeling rules across rapidly changing standards.',
    systemDesign: 'Rule engine backed inspection checklist with machine-assisted exception highlighting and report exports.',
    evidence: 'Strongest signal: rule-backed inspection checklists with exception highlighting and structured report exports.',
    repository: 'https://github.com/devpilotX/smart-label-gov',
    live: 'https://devpilotx.com'
  },
  {
    name: 'Mergenote',
    slug: 'mergenote',
    domain: 'Collaboration knowledge continuity',
    problem: 'Teams lost decision rationale across pull request and release handoffs.',
    systemDesign: 'Merge-aware note graph that binds decisions to commits, reviews, and release checkpoints.',
    evidence: 'Strongest signal: merge-aware note graphs binding decisions to commits, reviews, and release checkpoints.',
    repository: 'https://github.com/devpilotX/mergenote',
    live: 'https://devpilotx.com'
  }
];

export const projectsBySlug = new Map(selectedProjects.map((project) => [project.slug, project]));
