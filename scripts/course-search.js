/**
 * course-search.js — Course Search & Filter for EduBridge
 *
 * WHAT THIS FILE DOES:
 * - Adds live search/filter to the Featured Courses section on index.html
 * - Filters cards by matching the search query against card title and description
 * - Shows a "no results" message when nothing matches
 * - Works with any .card elements inside a container with id="courseCards"
 *
 * HOW TO USE:
 * 1. Add an input with id="courseSearch" above the course cards
 * 2. Add id="courseCards" to the .course-cards container
 * 3. Include this script: <script src="scripts/course-search.js"></script>
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('courseSearch');
    var courseContainer = document.getElementById('courseCards');
    if (!searchInput || !courseContainer) return;

    // Create a "no results" message element
    var noResults = document.createElement('p');
    noResults.className = 'search-no-results';
    noResults.textContent = 'No courses match your search. Try a different keyword.';
    noResults.style.display = 'none';
    courseContainer.parentNode.insertBefore(noResults, courseContainer.nextSibling);

    // Listen for input events (fires on every keystroke)
    searchInput.addEventListener('input', function () {
      var query = searchInput.value.toLowerCase().trim();
      var cards = courseContainer.querySelectorAll('.card');
      var visibleCount = 0;

      cards.forEach(function (card) {
        // Search against the card's text content (title + description)
        var text = card.textContent.toLowerCase();
        var matches = query === '' || text.indexOf(query) !== -1;

        // Show/hide with a smooth fade
        if (matches) {
          card.style.display = '';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          visibleCount++;
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Delay hiding so the fade-out animation plays
          setTimeout(function () {
            if (searchInput.value.toLowerCase().trim() === query) {
              card.style.display = 'none';
            }
          }, 300);
        }
      });

      // Show/hide "no results" message
      noResults.style.display = visibleCount === 0 && query !== '' ? 'block' : 'none';
    });
  });
})();
