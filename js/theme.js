// Dark/light theme toggle, persisted to localStorage (defaults to OS preference).
(() => {
  const STORAGE_KEY = 'annualEventsTracker.theme';
  const toggleBtn = document.getElementById('theme-toggle');

  function updateToggleLabel(theme) {
    const next = theme === 'dark' ? 'light' : 'dark';
    toggleBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    toggleBtn.setAttribute('aria-label', `Switch to ${next} theme`);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleLabel(theme);
  }

  toggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  updateToggleLabel(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
})();
