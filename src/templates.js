import { selectedProjects } from './projects.js';

const navLinks = [
  ['/', 'Home'],
  ['/work', 'Work'],
  ['/portfolio', 'Portfolio'],
  ['/method', 'Method'],
  ['/profile', 'Profile'],
  ['/contact', 'Contact']
];

const footerLinks = [
  ['/privacy', 'Privacy'],
  ['/terms', 'Terms'],
  ['/cookies', 'Cookies'],
  ['/accessibility', 'Accessibility'],
  ['/security', 'Security']
];

const effectiveDate = '16 September 2026';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildMeta({ title, description, path, image = '/assets/social-preview.svg', type = 'website' }) {
  const canonical = `https://devpilotx.me${path}`;
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(`https://devpilotx.me${image}`);

  return `
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${safeImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
  `;
}

function baseLayout({ title, description, path, content, currentPath, type = 'website', image }) {
  const nav = navLinks
    .map(([href, label]) => `<a href="${href}" ${href === currentPath ? 'aria-current="page"' : ''}>${label}</a>`)
    .join('');
  const footer = footerLinks.map(([href, label]) => `<a href="${href}">${label}</a>`).join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${buildMeta({ title, description, path, type, image })}
    <meta name="theme-color" content="#f7f4ec" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="preload" href="/assets/styles.css" as="style" />
    <link rel="stylesheet" href="/assets/styles.css" />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <header class="site-header">
      <div class="shell header-grid">
        <a href="/" class="brand" aria-label="DevPilotX home">
          <img src="/assets/dpx-mark.svg" alt="" width="40" height="40" />
          <span>DevPilotX.me</span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
        <nav id="site-nav" class="site-nav" aria-label="Main navigation">${nav}</nav>
      </div>
    </header>
    <main id="content" class="shell main-content">${content}</main>
    <footer class="site-footer">
      <div class="shell footer-grid">
        <div><strong>DevPilotX.me</strong><p>Systems, products, and engineering evidence.</p></div>
        <nav aria-label="Legal navigation">${footer}</nav>
      </div>
    </footer>
    <script src="/assets/app.js" defer></script>
  </body>
</html>`;
}

function pageIntro(kicker, title, body) {
  return `<header class="page-intro"><p class="kicker">${escapeHtml(kicker)}</p><h1>${escapeHtml(title)}</h1><p class="lede">${escapeHtml(body)}</p></header>`;
}

function legalPage(title, description, sections) {
  return `${pageIntro('Site policy', title, description)}
    <p class="effective-date">Effective ${effectiveDate}</p>
    <div class="legal-document">
      ${sections.map(({ heading, body }) => `<section><h2>${escapeHtml(heading)}</h2>${body}</section>`).join('')}
    </div>`;
}

function projectCard(project, index) {
  const stack = project.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join('');
  return `<li class="portfolio-card ${index % 3 === 1 ? 'offset-card' : ''}">
    <p class="project-index">${String(index + 1).padStart(2, '0')}</p>
    <a href="/portfolio/${project.slug}">${escapeHtml(project.name)}</a>
    <p>${escapeHtml(project.summary)}</p>
    <div class="stack-list" aria-label="Technology">${stack}</div>
  </li>`;
}

export function renderPage(route, data = {}) {
  const pages = {
    '/': {
      title: 'DevPilotX.me | Systems and product engineering',
      description: 'Public engineering work across infrastructure, security, finance, developer tools, and applied systems.',
      content: `
        <section class="hero">
          <div class="hero-copy">
            <p class="kicker">Independent engineering practice</p>
            <h1>Build the system. Prove the decisions.</h1>
            <p class="lede">DevPilotX turns difficult product and infrastructure problems into explicit, testable, maintainable software.</p>
            <div class="hero-actions">
              <a class="button button-primary" href="/portfolio">View public work</a>
              <a class="button" href="/contact">Start a conversation</a>
            </div>
          </div>
          <div class="signal-field" aria-hidden="true"><span></span><span></span><span></span><i></i></div>
        </section>
        <section class="section-ledger" aria-labelledby="practice-title">
          <div class="section-heading"><p class="kicker">Operating standard</p><h2 id="practice-title">Evidence before adjectives.</h2></div>
          <ol class="ledger">
            <li><strong>Public work</strong><span>Only owner-authored repositories that visitors can inspect.</span></li>
            <li><strong>Explicit boundaries</strong><span>Architecture, data, security, and operational constraints are documented.</span></li>
            <li><strong>Production path</strong><span>Tests, deployment controls, failure handling, and maintenance are part of the build.</span></li>
          </ol>
        </section>
        <section aria-labelledby="selected-title">
          <div class="section-heading"><p class="kicker">Selected systems</p><h2 id="selected-title">Work across product and infrastructure.</h2></div>
          <ul class="portfolio-grid">${selectedProjects.slice(0, 6).map(projectCard).join('')}</ul>
          <p class="section-action"><a class="text-link" href="/portfolio">Open the complete portfolio</a></p>
        </section>
      `
    },
    '/work': {
      title: 'Work | DevPilotX.me',
      description: 'Engineering capabilities, engagement model, and delivery standards.',
      content: `
        ${pageIntro('Work', 'Engineering for consequential systems.', 'Product architecture, secure backend design, data workflows, automation, developer tooling, and operational hardening.')}
        <section class="capability-grid" aria-label="Capabilities">
          <article><p>01</p><h2>Product systems</h2><span>Turn an ambiguous product into bounded flows, durable data, and an implementation plan.</span></article>
          <article><p>02</p><h2>Backend and data</h2><span>Design APIs, persistence, migrations, validation, observability, and failure behavior together.</span></article>
          <article><p>03</p><h2>Security engineering</h2><span>Reduce implicit trust with narrow interfaces, protected secrets, audit evidence, and safe defaults.</span></article>
          <article><p>04</p><h2>Delivery hardening</h2><span>Finish with tests, deployment documentation, health checks, backups, and operational ownership.</span></article>
        </section>
        <section class="work-standards"><h2>Definition of done</h2><ul><li>Critical paths are tested.</li><li>Configuration and secrets stay outside source control.</li><li>Deployment and recovery steps are documented.</li><li>Accessibility and responsive behavior are verified.</li><li>Known limitations are stated plainly.</li></ul></section>
      `
    },
    '/portfolio': {
      title: 'Portfolio | DevPilotX.me',
      description: 'Fifteen public engineering projects with repository-backed case studies.',
      content: `
        ${pageIntro('Portfolio', 'Public work, selected for depth.', 'Each entry links to an inspectable public repository. Descriptions focus on implementation rather than invented outcomes.')}
        <ul class="portfolio-grid full-grid">${selectedProjects.map(projectCard).join('')}</ul>
      `
    },
    '/method': {
      title: 'Method | DevPilotX.me',
      description: 'A four-stage method for reliable product and systems delivery.',
      content: `
        ${pageIntro('Method', 'Clarity compounds.', 'The process is deliberately small enough to use and strict enough to expose weak assumptions early.')}
        <ol class="work-track">
          <li><p>01</p><h2>Frame</h2><span>Define the user, decision, constraints, threat model, data boundaries, and acceptance evidence.</span></li>
          <li><p>02</p><h2>Design</h2><span>Choose the smallest architecture that can meet reliability, security, and operating requirements.</span></li>
          <li><p>03</p><h2>Build</h2><span>Ship bounded increments with reviews, tests, migrations, and observable failure paths.</span></li>
          <li><p>04</p><h2>Verify</h2><span>Exercise real routes and states, document deployment and recovery, then remove unsupported claims.</span></li>
        </ol>
      `
    },
    '/profile': {
      title: 'Profile | DevPilotX.me',
      description: 'The operating principles and public engineering footprint behind DevPilotX.',
      content: `
        ${pageIntro('Profile', 'An engineering practice built around useful proof.', 'The work spans full-stack products, infrastructure, security, quantitative research, formal methods, and developer tools.')}
        <section class="profile-grid">
          <div><h2>Principles</h2><ul><li>Prefer explicit systems to clever shortcuts.</li><li>State uncertainty and limitations.</li><li>Keep public claims inspectable.</li><li>Build operations into the product.</li></ul></div>
          <div><h2>Destinations</h2><p><a href="https://github.com/devpilotX" rel="noopener noreferrer">GitHub profile</a></p><p><a href="https://devpilotx.com" rel="noopener noreferrer">devpilotx.com</a></p><p><a href="mailto:devpilotx@gmail.com">devpilotx@gmail.com</a></p></div>
        </section>
      `
    },
    '/contact': {
      title: 'Contact | DevPilotX.me',
      description: 'A secure contact path for product, architecture, and engineering discussions.',
      content: `
        ${pageIntro('Contact', 'Start with the problem.', 'Share the context, current constraints, and the decision you need to make. Submissions are stored before any optional notification is attempted.')}
        <div class="contact-layout">
          <form id="contact-form" class="contact-form" method="post" action="/api/contact" novalidate>
            <div class="field-pair"><label>Name<input name="name" autocomplete="name" required maxlength="80" /></label><label>Email<input name="email" type="email" autocomplete="email" required maxlength="120" /></label></div>
            <div class="field-pair"><label>Company or project<input name="company" autocomplete="organization" maxlength="120" /></label><label>Area of interest<input name="projectInterest" maxlength="160" /></label></div>
            <label>Message<textarea name="message" required minlength="20" maxlength="2000" rows="8" placeholder="What are you building, what is blocked, and what outcome matters?"></textarea></label>
            <label class="hp-field" aria-hidden="true">Leave this field empty<input name="website" tabindex="-1" autocomplete="off" /></label>
            <button class="button button-primary" type="submit">Send message</button>
            <p id="contact-status" role="status" aria-live="polite"></p>
          </form>
          <aside class="contact-aside"><p class="kicker">Direct channel</p><h2>Email remains available.</h2><p>If the form is unavailable, write to <a href="mailto:devpilotx@gmail.com">devpilotx@gmail.com</a>.</p><p>Do not send passwords, API keys, financial account data, or sensitive personal records.</p></aside>
        </div>
      `
    },
    '/privacy': {
      title: 'Privacy Policy | DevPilotX.me',
      description: 'How DevPilotX.me collects, uses, stores, and protects contact information.',
      content: legalPage('Privacy Policy', 'This policy describes the limited data processed by DevPilotX.me.', [
        { heading: 'Information collected', body: '<p>The contact form collects your name, email address, optional company, optional project interest, message, user agent, submission time, and a salted hash of the network address used for abuse prevention. The raw network address is not intentionally stored in the contact database.</p>' },
        { heading: 'How information is used', body: '<p>Information is used to respond to enquiries, maintain service security, investigate abuse, and operate the contact workflow. It is not sold or used for advertising profiles.</p>' },
        { heading: 'Storage and processors', body: '<p>Submissions are stored in the site database. If email notification is configured, a limited copy may be sent through the configured transactional email provider. Hosting and infrastructure providers may process technical request data under their own terms.</p>' },
        { heading: 'Retention and requests', body: '<p>Enquiries are retained only as long as reasonably needed for correspondence, security, and legitimate record keeping. To request access, correction, or deletion, email <a href="mailto:devpilotx@gmail.com">devpilotx@gmail.com</a>. A request may require identity verification.</p>' },
        { heading: 'Security and changes', body: '<p>Reasonable technical controls are used, but no internet service can promise absolute security. Material policy changes will be published on this page with a revised effective date.</p>' }
      ])
    },
    '/terms': {
      title: 'Terms of Use | DevPilotX.me',
      description: 'Terms governing access to DevPilotX.me and its public materials.',
      content: legalPage('Terms of Use', 'These terms apply when you use this website.', [
        { heading: 'Permitted use', body: '<p>You may browse the site, inspect linked public repositories, and submit a genuine enquiry. You must not disrupt the service, probe it without authorization, submit unlawful material, impersonate another person, or automate abusive requests.</p>' },
        { heading: 'Content and repositories', body: '<p>Website copy is informational. Linked repositories are governed by the license stated in each repository. A link does not create a warranty, service commitment, or professional relationship.</p>' },
        { heading: 'No professional advice', body: '<p>Nothing on this site is legal, financial, investment, medical, or other regulated professional advice. Research and finance-related projects are presented as engineering work and educational material.</p>' },
        { heading: 'Availability and liability', body: '<p>The site is provided as available. Features and external links may change or become unavailable. To the extent permitted by law, DevPilotX is not liable for indirect or consequential loss arising from use of the site.</p>' },
        { heading: 'Contact', body: '<p>Questions about these terms can be sent to <a href="mailto:devpilotx@gmail.com">devpilotx@gmail.com</a>.</p>' }
      ])
    },
    '/cookies': {
      title: 'Cookie Policy | DevPilotX.me',
      description: 'Cookie and local storage information for DevPilotX.me.',
      content: legalPage('Cookie Policy', 'The current site is intentionally light on browser storage.', [
        { heading: 'Current behavior', body: '<p>DevPilotX.me does not currently set advertising or analytics cookies. The contact form does not require an account or a tracking identifier.</p>' },
        { heading: 'Infrastructure behavior', body: '<p>Your browser, network, hosting provider, or security layer may cache files or process standard request metadata. These transport behaviors are not advertising profiles created by this application.</p>' },
        { heading: 'Future changes', body: '<p>If optional analytics or non-essential cookies are introduced, this policy and the relevant consent controls will be updated before those tools are enabled.</p>' },
        { heading: 'Contact', body: '<p>Questions can be sent to <a href="mailto:devpilotx@gmail.com">devpilotx@gmail.com</a>.</p>' }
      ])
    },
    '/accessibility': {
      title: 'Accessibility Statement | DevPilotX.me',
      description: 'Accessibility approach, supported interactions, and feedback channel.',
      content: legalPage('Accessibility Statement', 'DevPilotX.me aims to provide a clear and usable experience across devices and input methods.', [
        { heading: 'Design approach', body: '<p>The interface uses semantic headings, keyboard-accessible controls, visible focus, a skip link, responsive layouts, readable contrast, descriptive link text, and reduced-motion support.</p>' },
        { heading: 'Known limitations', body: '<p>Linked third-party repositories and external websites have their own accessibility behavior. Automated checks cannot identify every barrier, and no formal accessibility certification is claimed.</p>' },
        { heading: 'Report a barrier', body: '<p>Email <a href="mailto:devpilotx@gmail.com">devpilotx@gmail.com</a> with the page, device, browser, assistive technology, and problem encountered. A practical response or alternative format will be considered.</p>' }
      ])
    },
    '/security': {
      title: 'Security Disclosure Policy | DevPilotX.me',
      description: 'How to report a potential security vulnerability responsibly.',
      content: legalPage('Security Disclosure Policy', 'Good-faith reports that protect users are welcome.', [
        { heading: 'Reporting', body: '<p>Email <a href="mailto:devpilotx@gmail.com">devpilotx@gmail.com</a> with the affected route, impact, reproduction steps, and any safe supporting evidence. Do not include secrets in the initial report.</p>' },
        { heading: 'Testing boundaries', body: '<p>Do not access another person\'s data, degrade availability, use destructive payloads, perform social engineering, or publish an unresolved issue. Stop testing if sensitive data is encountered.</p>' },
        { heading: 'Response', body: '<p>Reports will be reviewed in good faith. Acknowledgement and remediation timing depend on severity and available information. This policy does not promise payment or a bug bounty.</p>' },
        { heading: 'Repository policy', body: '<p>Additional scope and reporting guidance is available in the repository SECURITY.md file.</p>' }
      ])
    }
  };

  if (route.startsWith('/portfolio/')) {
    const project = data.project;
    if (!project) return null;
    const liveAction = project.live ? `<a class="button button-primary" href="${escapeHtml(project.live)}" rel="noopener noreferrer">Open live site</a>` : '';
    const disclaimer = project.disclaimer ? `<aside class="project-note"><strong>Important context</strong><p>${escapeHtml(project.disclaimer)}</p></aside>` : '';
    return baseLayout({
      title: `${project.name} | DevPilotX.me`,
      description: project.summary,
      path: route,
      type: 'article',
      currentPath: '/portfolio',
      content: `
        <article class="case-study">
          ${pageIntro(project.domain, project.name, project.summary)}
          <div class="case-actions"><a class="button" href="${escapeHtml(project.repository)}" rel="noopener noreferrer">Inspect repository</a>${liveAction}</div>
          ${disclaimer}
          <div class="case-grid">
            <section><p class="kicker">Challenge</p><h2>What the system addresses</h2><p>${escapeHtml(project.problem)}</p></section>
            <section><p class="kicker">Architecture</p><h2>How it is organized</h2><p>${escapeHtml(project.systemDesign)}</p></section>
            <section><p class="kicker">Implementation signal</p><h2>What visitors can inspect</h2><p>${escapeHtml(project.evidence)}</p></section>
            <section><p class="kicker">Stack</p><h2>Primary technologies</h2><div class="stack-list large">${project.stack.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div></section>
          </div>
          <p class="section-action"><a class="text-link" href="/portfolio">Return to portfolio</a></p>
        </article>
      `
    });
  }

  const page = pages[route];
  if (!page) return null;
  return baseLayout({ title: page.title, description: page.description, path: route, currentPath: route, content: page.content });
}

export function render404() {
  return baseLayout({
    title: 'Page Not Found | DevPilotX.me',
    description: 'The requested page could not be found.',
    path: '/404',
    currentPath: '',
    content: `${pageIntro('404', 'This route does not exist.', 'The address may have changed or the link may be incomplete.')}<p><a class="button button-primary" href="/">Return home</a></p>`
  });
}
