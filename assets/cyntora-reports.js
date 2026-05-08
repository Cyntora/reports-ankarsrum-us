/* Cyntora Reports - period switcher + small interactions
 *
 * Loads `reports/index.json` from the same repo and populates the dropdown.
 * The user picks a different month and the page navigates to that file.
 */

(function () {
  'use strict';

  function init() {
    var sel = document.querySelector('[data-period-switcher]');
    if (!sel) return;

    var current = sel.getAttribute('data-current'); // e.g. "2026-04"
    var indexUrl = sel.getAttribute('data-index-url') || 'reports/index.json';

    fetch(indexUrl, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('index.json status ' + r.status);
        return r.json();
      })
      .then(function (idx) {
        // idx.reports is sorted newest -> oldest; entry: { month: 'YYYY-MM', label: 'April 2026', file: '2026-04.html' }
        var reports = (idx && idx.reports) || [];
        sel.innerHTML = '';
        reports.forEach(function (r) {
          var opt = document.createElement('option');
          opt.value = r.file;
          opt.textContent = r.label || r.month;
          if (r.month === current) opt.selected = true;
          sel.appendChild(opt);
        });
        sel.disabled = false;
        sel.addEventListener('change', function () {
          if (sel.value) window.location.href = 'reports/' + sel.value;
        });
      })
      .catch(function (err) {
        // Fail quiet - the report still works, just without the switcher
        console.warn('[cyntora] period switcher disabled:', err.message);
        sel.disabled = true;
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
