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

function escapeHtml(value) {
  return String(value)
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

function baseLayout({ title, description, path, content, currentPath, type, image }) {
  const nav = navLinks
    .map(([href, label]) => `<a href="${href}" ${href === currentPath ? 'aria-current="page"' : ''}>${label}</a>`)
    .join('');
  const footer = footerLinks
    .map(([href, label]) => `<a href="${href}">${label}</a>`)
    .join('');

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
          <img src="/assets/dpx-mark.svg" alt="DevPilotX geometric mark" width="40" height="40" />
          <span>DevPilotX.me</span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
        <nav id="site-nav" class="site-nav" aria-label="Main navigation">
          ${nav}
        </nav>
      </div>
    </header>
    <main id="content" class="shell main-content">${content}</main>
    <footer class="site-footer">
      <div class="shell footer-grid">
        <p>Build systems with clarity, reliability, and verifiable evidence.</p>
        <nav aria-label="Legal navigation">${footer}</nav>
      </div>
    </footer>
    <script src="/assets/app.js" defer></script>
  </body>
</html>`;
}

function section(title, body) {
  return `<section><h1>${escapeHtml(title)}</h1><p>${body}</p></section>`;
}

export function renderPage(route, data = {}) {
  const pages = {
    '/': {
      title: 'DevPilotX.me | Systems and product engineering',
      description: 'DevPilotX builds high-assurance products with disciplined systems design and measurable delivery.',
      content: `
        <section class="hero">
          <p class="kicker">Systems engineering practice</p>
          <h1>Institutional software engineering with high-assurance execution.</h1>
          <p>DevPilotX designs resilient software across fintech, infrastructure, and compliance-heavy domains with strict system boundaries and delivery discipline.</p>
          <div class="hero-actions">
            <a class="button button-primary" href="/work">Explore work</a>
            <a class="button" href="/contact">Start a conversation</a>
          </div>
        </section>
        <section class="section-ledger">
          <h2>Evidence ledger</h2>
          <ul class="ledger">
            ${selectedProjects.slice(0, 4).map((project) => `<li><strong>${escapeHtml(project.name)}</strong><span>${escapeHtml(project.evidence)}</span></li>`).join('')}
          </ul>
        </section>
        <section>
          <h2>Selected projects</h2>
          <ul class="portfolio-grid">
            ${selectedProjects.slice(0, 6).map((project, index) => `<li class="portfolio-card ${index % 3 === 0 ? 'offset-card' : ''}"><a href="/portfolio/${project.slug}">${escapeHtml(project.name)}</a><span>${escapeHtml(project.domain)}</span></li>`).join('')}
          </ul>
        </section>
      `,
      type: 'website'
    },
    '/work': {
      title: 'Work | DevPilotX.me',
      description: 'Delivery model and project outcomes for DevPilotX engagements.',
      content: `
        <section>
          <h1>Work</h1>
          <p>Every engagement follows a bounded execution path: discovery, architecture, delivery, and operational hardening.</p>
          <ol class="work-track">
            <li><h2>Discovery</h2><p>Model risks, constraints, and acceptance criteria with stakeholder alignment.</p></li>
            <li><h2>Architecture</h2><p>Design explicit boundaries, security controls, and performance budgets before implementation.</p></li>
            <li><h2>Delivery</h2><p>Ship incremental releases with repeatable verification and operational telemetry.</p></li>
            <li><h2>Hardening</h2><p>Run post-release checks, operational drills, and maintenance planning for sustained reliability.</p></li>
          </ol>
        </section>
      `
    },
    '/portfolio': {
      title: 'Portfolio | DevPilotX.me',
      description: 'Case studies across the DevPilotX project portfolio.',
      content: `
        <section>
          <h1>Portfolio</h1>
          <p>Each case study captures the domain problem, system architecture, and strongest evidence signal.</p>
          <ul class="portfolio-grid full-grid">
            ${selectedProjects.map((project, index) => `<li class="portfolio-card ${index % 2 === 1 ? 'offset-card' : ''}"><a href="/portfolio/${project.slug}">${escapeHtml(project.name)}</a><span>${escapeHtml(project.problem)}</span></li>`).join('')}
          </ul>
        </section>
      `
    },
    '/method': {
      title: 'Method | DevPilotX.me',
      description: 'The DevPilotX methodology for resilient product delivery.',
      content: `
        <section>
          <h1>Method</h1>
          <p>DevPilotX uses a four-stage method: define constraints, design explicit systems, execute in bounded increments, and verify operations continuously.</p>
        </section>
      `
    },
    '/profile': {
      title: 'Profile | DevPilotX.me',
      description: 'Background and operating principles for DevPilotX.',
      content: `
        <section>
          <h1>Profile</h1>
          <p>DevPilotX focuses on trusted software systems, security-first architecture, and long-horizon maintainability.</p>
          <p>Primary site: <a href="https://devpilotx.com" rel="noopener noreferrer">https://devpilotx.com</a></p>
        </section>
      `
    },
    '/contact': {
      title: 'Contact | DevPilotX.me',
      description: 'Secure contact form for project discussions with DevPilotX.',
      content: `
        <section>
          <h1>Contact</h1>
          <p>Use this form to discuss product strategy, architecture, and implementation support.</p>
          <form id="contact-form" class="contact-form" method="post" action="/api/contact" novalidate>
            <label>Name<input name="name" required maxlength="80" /></label>
            <label>Email<input name="email" type="email" required maxlength="120" /></label>
            <label>Company<input name="company" maxlength="120" /></label>
            <label>Project interest<input name="projectInterest" maxlength="160" /></label>
            <label>Message<textarea name="message" required maxlength="2000" rows="7"></textarea></label>
            <label class="hp-field" aria-hidden="true">Leave this field empty<input name="website" tabindex="-1" autocomplete="off" /></label>
            <button class="button button-primary" type="submit">Send message</button>
            <p id="contact-status" role="status" aria-live="polite"></p>
          </form>
        </section>
      `
    },
    '/privacy': {
      title: 'Privacy Policy | DevPilotX.me',
      description: 'Privacy policy for DevPilotX.me website operations.',
      content: section('Privacy Policy', 'DevPilotX.me stores contact form submissions with hashed network identifiers for abuse prevention and operational security. No advertising analytics or tracking cookies are deployed. Data is retained for business response workflows and security auditing.')
    },
    '/terms': {
      title: 'Terms of Use | DevPilotX.me',
      description: 'Terms of use for the DevPilotX.me website.',
      content: section('Terms of Use', 'Site content is provided for informational purposes without warranty. By using this site, you agree not to abuse forms, attempt unauthorized access, or disrupt service availability.')
    },
    '/cookies': {
      title: 'Cookie Policy | DevPilotX.me',
      description: 'Cookie policy for DevPilotX.me.',
      content: section('Cookie Policy', 'DevPilotX.me does not set analytics or advertising cookies. Standard browser and transport behaviors may still cache static assets for performance.')
    },
    '/accessibility': {
      title: 'Accessibility Statement | DevPilotX.me',
      description: 'Accessibility statement for DevPilotX.me.',
      content: section('Accessibility Statement', 'DevPilotX.me targets keyboard accessibility, responsive layout behavior, visible focus states, and reduced-motion support. Accessibility issues can be reported through the contact page.')
    },
    '/security': {
      title: 'Security Disclosure Policy | DevPilotX.me',
      description: 'Security disclosure policy for DevPilotX.me.',
      content: section('Security Disclosure Policy', 'Please report suspected vulnerabilities using the responsible disclosure guidance in this repository SECURITY.md file. Include clear reproduction details and impact analysis where possible.')
    }
  };

  if (route.startsWith('/portfolio/')) {
    const project = data.project;
    if (!project) {
      return null;
    }

    return baseLayout({
      title: `${project.name} Case Study | DevPilotX.me`,
      description: `${project.name} case study detailing domain, problem, architecture, and evidence signal.`,
      path: route,
      type: 'article',
      currentPath: '/portfolio',
      content: `
        <article class="case-study">
          <p class="kicker">Case study</p>
          <h1>${escapeHtml(project.name)}</h1>
          <dl>
            <div><dt>Domain</dt><dd>${escapeHtml(project.domain)}</dd></div>
            <div><dt>Problem</dt><dd>${escapeHtml(project.problem)}</dd></div>
            <div><dt>System design</dt><dd>${escapeHtml(project.systemDesign)}</dd></div>
            <div><dt>Evidence</dt><dd>${escapeHtml(project.evidence)}</dd></div>
            <div><dt>Repository</dt><dd><a href="${escapeHtml(project.repository)}" rel="noopener noreferrer">${escapeHtml(project.repository)}</a></dd></div>
            <div><dt>Live</dt><dd><a href="${escapeHtml(project.live)}" rel="noopener noreferrer">${escapeHtml(project.live)}</a></dd></div>
          </dl>
          <p><a href="/portfolio">Back to portfolio</a></p>
        </article>
      `
    });
  }

  const page = pages[route];
  if (!page) {
    return null;
  }

  return baseLayout({
    title: page.title,
    description: page.description,
    path: route,
    currentPath: route,
    content: page.content,
    type: page.type,
    image: page.image
  });
}

export function render404() {
  return baseLayout({
    title: 'Page Not Found | DevPilotX.me',
    description: 'The requested DevPilotX.me page could not be found.',
    path: '/404',
    currentPath: '',
    content: '<section><h1>404</h1><p>The page you requested was not found. Return to the <a href="/">homepage</a>.</p></section>'
  });
}
