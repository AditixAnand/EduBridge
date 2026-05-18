/**
 * theme-toggle.js — Unified Dark Mode Toggle for EduBridge
 * 
 * WHAT THIS FILE DOES:
 * - Replaces the old per-page inline theme code with one reusable module
 * - Provides a modern toggle switch (sun/moon) instead of a dropdown
 * - Applies smooth CSS transitions when switching themes
 * - Persists the user's choice in localStorage
 * 
 * HOW TO USE:
 * Include this script on every page AFTER the DOM has the toggle button:
 *   <script src="scripts/theme-toggle.js"></script>
 */

(function () {
  'use strict';

  // --- Apply saved theme IMMEDIATELY to prevent flash of wrong theme ---
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return; // Guard: page doesn't have the toggle yet

    const icon = toggle.querySelector('.toggle-icon');

    // Set initial state
    updateToggle(saved);

    // Handle click
    toggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';

      // Add transition class so colours animate smoothly
      document.body.classList.add('theme-transitioning');

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggle(next);

      // Remove transition class after animation completes
      setTimeout(function () {
        document.body.classList.remove('theme-transitioning');
      }, 500);
    });

    // Keyboard accessibility — Enter and Space trigger toggle
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.click();
      }
    });

    /**
     * Update the toggle button icon and aria-label
     * @param {string} theme - 'light' or 'dark'
     */
    function updateToggle(theme) {
      if (!icon) return;
      if (theme === 'dark') {
        icon.className = 'fas fa-sun toggle-icon';
        toggle.setAttribute('aria-label', 'Switch to light mode');
      } else {
        icon.className = 'fas fa-moon toggle-icon';
        toggle.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  });
})();
