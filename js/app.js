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
      navigator.serviceWorker.register('/my-app/sw.js', { scope: '/my-app/' }).catch(() => {});
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
