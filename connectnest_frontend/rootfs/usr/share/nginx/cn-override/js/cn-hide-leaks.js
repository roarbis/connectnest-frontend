// cn-hide-leaks.js — hides HA-branded elements that can't be text-scrubbed
// Targets: Nabu Casa promo, developer tools (non-admin), HA help/about links

const HIDE_SELECTORS = [
  // Nabu Casa cloud promo banner / nav item
  'a[href*="nabucasa"]',
  'a[href*="nabu.casa"]',
  '[data-panel="cloud"]',
  // HA "Help" link pointing to home-assistant.io
  'a[href*="home-assistant.io"]',
  // Generic "Powered by Home Assistant" footer text nodes
  '.powered-by',
];

const OVERRIDE_LINKS = [
  // Redirect any remaining HA support links to CN support
  { selector: 'a[href*="home-assistant.io/help"]', href: 'https://connectnest.com.au/support' },
  { selector: 'a[href*="home-assistant.io/issues"]', href: 'https://connectnest.com.au/support' },
];

function applyHides(root) {
  for (const sel of HIDE_SELECTORS) {
    try {
      root.querySelectorAll(sel).forEach(el => {
        el.style.setProperty('display', 'none', 'important');
      });
    } catch (_) { /* shadow root query may fail on some elements */ }
  }
  for (const { selector, href } of OVERRIDE_LINKS) {
    try {
      root.querySelectorAll(selector).forEach(el => {
        el.setAttribute('href', href);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      });
    } catch (_) {}
  }
}

function walkShadowRoots(root) {
  applyHides(root);
  const all = root.querySelectorAll('*');
  for (const el of all) {
    if (el.shadowRoot) {
      applyHides(el.shadowRoot);
      walkShadowRoots(el.shadowRoot);
    }
  }
}

export function initHideLeaks() {
  walkShadowRoots(document.documentElement);

  // Process only newly added nodes — re-walking the full tree on every mutation
  // is O(n) per mutation and causes the browser to freeze during HA's load.
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          applyHides(node);
          if (node.shadowRoot) walkShadowRoots(node.shadowRoot);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
