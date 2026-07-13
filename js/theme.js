// Dark/light theme toggle, persisted to localStorage (defaults to OS preference).
(() => {
  const STORAGE_KEY = 'annualEventsTracker.theme';
  const toggleBtn = document.getElementById('theme-toggle');

  function updateToggleState(theme) {
    const isDark = theme === 'dark';
    toggleBtn.setAttribute('aria-checked', String(isDark));
    toggleBtn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleState(theme);
  }

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  updateToggleState(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
})();
