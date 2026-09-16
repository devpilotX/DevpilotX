(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('#site-nav');

  if (menuButton && siteNav) {
    const toggleMenu = (next) => {
      menuButton.setAttribute('aria-expanded', String(next));
      siteNav.classList.toggle('open', next);
    };

    menuButton.addEventListener('click', () => {
      toggleMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    siteNav.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement && event.target.tagName === 'A') {
        toggleMenu(false);
      }
    });
  }

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#contact-status');

  if (form instanceof HTMLFormElement && status) {
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
})();
