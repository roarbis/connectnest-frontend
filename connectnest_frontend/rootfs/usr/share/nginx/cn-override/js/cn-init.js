// cn-init.js — Connect Nest Frontend global initialiser
// Loaded as extra_module_url by HA frontend on every page load.
// Imports the DOM scrubber and hide-leaks modules.

import { initScrubber }   from '/local/cn-scrubber.js';
import { initHideLeaks }  from '/local/cn-hide-leaks.js';

(function cnInit() {
  // Run after DOM is ready
  const run = () => {
    initScrubber();
    initHideLeaks();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
