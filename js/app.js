(() => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const statusEl = document.getElementById('status');
  const installBtn = document.getElementById('install-btn');

  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);

  themeBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js', { scope: './' }).catch(() => {});
    });
  }

  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
    statusEl.textContent = 'Ready to install. Tap "Install app".';
  });

  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });

  window.addEventListener('appinstalled', () => {
    statusEl.textContent = 'Installed. Launch it from your home screen.';
    installBtn.hidden = true;
  });

  if (window.matchMedia('(display-mode: standalone)').matches) {
    statusEl.textContent = 'Running as an installed app.';
  }

  window.addEventListener('online', () => (statusEl.textContent = 'Back online.'));
  window.addEventListener('offline', () => (statusEl.textContent = 'Offline — still works.'));

  setupSolarToggle();
  setupWhatsApp();

  function setupSolarToggle() {
    const button = document.getElementById('solar-toggle');
    const body = document.getElementById('solar-body');
    if (!button || !body) return;

    function setOpen(open) {
      button.setAttribute('aria-expanded', String(open));
      body.classList.toggle('collapsed', !open);
    }

    // Start collapsed unless JS already rendered it open
    setOpen(false);

    button.addEventListener('click', () => {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });
  }

  function setupWhatsApp() {
    const input = document.getElementById('wa-number');
    const button = document.getElementById('wa-open');
    const errorEl = document.getElementById('wa-error');
    if (!input || !button) return;

    // Restore last used number
    const savedNumber = localStorage.getItem('wa-number');
    if (savedNumber) input.value = savedNumber;

    function showError(message) {
      errorEl.textContent = message;
      errorEl.hidden = false;
      input.setAttribute('aria-invalid', 'true');
    }

    function clearError() {
      errorEl.hidden = true;
      errorEl.textContent = '';
      input.removeAttribute('aria-invalid');
    }

    function openWhatsApp() {
      clearError();
      const digits = input.value.replace(/\D/g, '');

      if (!digits) {
        showError('Please enter a phone number.');
        input.focus();
        return;
      }
      if (digits.length < 7 || digits.length > 15) {
        showError('Enter a valid number with country code (7-15 digits).');
        input.focus();
        return;
      }

      localStorage.setItem('wa-number', input.value.trim());

      const url = 'https://wa.me/' + digits;
      const win = window.open(url, '_blank', 'noopener');
      if (!win) window.location.href = url; // popup blocked fallback
    }

    button.addEventListener('click', openWhatsApp);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        openWhatsApp();
      }
    });
    input.addEventListener('input', clearError);
  }

  renderQr();

  function renderQr() {
    const img = document.getElementById('qr');
    const urlEl = document.getElementById('qr-url');
    if (!img || typeof qrcode !== 'function') return;

    const url = location.href.split('#')[0];
    urlEl.textContent = url;

    try {
      const qr = qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      img.src = qr.createDataURL(6, 8);
    } catch (err) {
      img.alt = 'QR code could not be generated';
    }
  }
})();
