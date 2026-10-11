/* Real links provide a no-JavaScript fallback; keep the section when switching. */
(() => {
  const language = document.documentElement.lang === 'fr' ? 'fr' : 'en';
  const key = 'portfolio.language';
  const explicit = new URLSearchParams(window.location.search).get('lang');
  try {
    // Only the bare home URL honours a previous selection. Direct page URLs stay explicit.
    if (window.location.pathname === '/' && !explicit && localStorage.getItem(key) === 'fr') {
      window.location.replace('fr.html?lang=fr' + window.location.hash);
      return;
    }
    localStorage.setItem(key, language);
  } catch (_) { /* Private mode/storage restrictions must not prevent switching. */ }
  document.querySelectorAll('[data-language]').forEach((link) => {
    const base = link.getAttribute('href');
    const syncHash = () => { link.href = base + window.location.hash; };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    link.addEventListener('click', () => {
      syncHash(); // replaceState-based in-page navigation does not fire hashchange.
      try { localStorage.setItem(key, link.dataset.language); } catch (_) {}
    });
  });
})();
