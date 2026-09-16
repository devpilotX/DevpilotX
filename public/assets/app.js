function initMobileMenu() {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (!button || !nav) {
    return;
  }

  button.addEventListener('click', () => {
    const next = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(next));
    nav.classList.toggle('open', next);
  });
}

function initContactForm() {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-status');
  if (!form || !status) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = 'Submitting...';

    try {
      const body = Object.fromEntries(new FormData(form).entries());
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      });
      const payload = await response.json();
      if (!response.ok) {
        status.textContent = payload.error || 'Request failed.';
        return;
      }
      form.reset();
      status.textContent = 'Message received. We will reply soon.';
    } catch {
      status.textContent = 'Request failed.';
    }
  });
}

function initRevealCards() {
  const cards = document.querySelectorAll('[data-reveal]');
  cards.forEach((card, index) => {
    card.style.setProperty('--reveal-delay', `${index * 45}ms`);
    card.classList.add('reveal-ready');
  });
}

initMobileMenu();
initContactForm();
initRevealCards();
