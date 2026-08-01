
// Theme Initialization
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', (e) => {
        const button = e.currentTarget;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        const { top, left, width, height } = button.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const maxRadius = Math.hypot(
          Math.max(x, viewportWidth - x),
          Math.max(y, viewportHeight - y)
        );

        const applyTheme = () => {
          const nextTheme = isDark ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', nextTheme);
          localStorage.setItem('theme', nextTheme);
        };

        if (typeof document.startViewTransition !== 'function') {
          applyTheme();
          return;
        }

        const transition = document.startViewTransition(() => {
          applyTheme();
        });

        transition.ready.then(() => {
        .catch(err => console.error(err))