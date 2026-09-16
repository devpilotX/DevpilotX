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

function absoluteSiteUrl(path) {
  return `https://devpilotx.me${path}`;
}

function buildMeta({ title, description, path, image = '/assets/social-preview.svg', type = 'website' }) {
  const canonical = absoluteSiteUrl(path);
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(absoluteSiteUrl(image));

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
        <p>Build systems with clarity, reliability, and measurable outcomes.</p>
        <nav aria-label="Legal navigation">${footer}</nav>
      </div>
    </footer>
    <script type="module" src="/assets/app.js"></script>
  </body>
</html>`;
}

function section(title, body) {
  return `<section><h1>${escapeHtml(title)}</h1><p>${body}</p></section>`;
}

function projectCard(project) {
  return `<article class="portfolio-card" data-reveal>
    <p class="kicker">Case study</p>
    <h2><a href="/portfolio/${project.slug}">${escapeHtml(project.name)}</a></h2>
    <p>${escapeHtml(project.domain)}</p>
    <p class="muted">${escapeHtml(project.evidence)}</p>
  </article>`;
}

export function renderPage(route, data = {}) {
  const pages = {
    '/': {
      title: 'DevPilotX.me | Systems and product engineering',
      description: 'DevPilotX builds high-assurance products with disciplined systems design and measurable delivery.',
      content: `
        <section class="hero hero-compact">
          <p class="kicker">Institutional systems practice</p>
          <h1 class="display-title">Reliable architecture for critical software delivery.</h1>
          <p class="hero-lede">DevPilotX builds security-conscious products with explicit operating models, measured quality gates, and maintainable delivery cadence.</p>
          <div class="hero-actions">
            <a class="button button-primary" href="/work">Explore work</a>
            <a class="button" href="/contact">Start a conversation</a>
          </div>
        </section>
        <section class="evidence-ledger" aria-labelledby="evidence-ledger-title">
          <h2 id="evidence-ledger-title">Evidence ledger</h2>
          <ul>
            <li>Fifteen curated project records are served by a typed portfolio model in this repository.</li>
            <li>Every project publishes a dedicated detail route and matching project API endpoint.</li>
            <li>Contact intake persists validated records through migration-controlled SQLite writes.</li>
            <li>Security controls, legal pages, and route verification are covered by automated tests.</li>
          </ul>
        </section>
        <section>
          <h2>Selected portfolio</h2>
          <div class="portfolio-grid">
            ${selectedProjects.slice(0, 6).map(projectCard).join('')}
          </div>
        </section>
      `,
      type: 'website'
    },
    '/work': {
      title: 'Work | DevPilotX.me',
      description: 'Delivery model and project outcomes for DevPilotX engagements.',
      content: `
        <section>
          <p class="kicker">Operating method</p>
          <h1 class="display-title">Delivery system tuned for clarity and control.</h1>
          <p>Every engagement follows a disciplined cycle: framing, architecture, implementation, and operational verification.</p>
          <div class="cards cards-asymmetric">
            <article data-reveal><h2>Framing</h2><p>Align decision rights, constraints, and acceptance criteria before implementation.</p></article>
            <article data-reveal><h2>Architecture</h2><p>Design boundaries, trust assumptions, and failure behavior with explicit controls.</p></article>
            <article data-reveal><h2>Execution</h2><p>Ship bounded increments with route-level tests and operational telemetry hooks.</p></article>
            <article data-reveal><h2>Hardening</h2><p>Validate security headers, request controls, and persistent data operations before release.</p></article>
          </div>
        </section>
      `
    },
    '/portfolio': {
      title: 'Portfolio | DevPilotX.me',
      description: 'Case studies across the DevPilotX project portfolio.',
      content: `
        <section>
          <p class="kicker">Project index</p>
          <h1 class="display-title">Portfolio case studies</h1>
          <p>Each record captures domain, problem framing, architecture approach, and implementation signal grounded in this repository.</p>
          <div class="portfolio-grid portfolio-grid-full">
            ${selectedProjects.map(projectCard).join('')}
          </div>
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
        <article class="case-study" data-reveal>
          <p class="kicker">Case study</p>
          <h1 class="display-title">${escapeHtml(project.name)}</h1>
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
