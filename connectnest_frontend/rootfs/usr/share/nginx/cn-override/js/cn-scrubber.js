// cn-scrubber.js — MutationObserver DOM text scrubber
// Replaces residual "Home Assistant" strings that survive nginx sub_filter
// (lazy-loaded JS bundles, dynamic titles, shadow DOM text nodes)

const CN_REPLACEMENTS = [
  [/Home Assistant/g,   'Connect Nest'],
  [/home-assistant/g,   'connect-nest'],
  [/homeassistant/g,    'connectnest'],
  [/Nabu Casa/g,        'Connect Nest'],
  [/nabu\.casa/gi,      'connectnest.com.au'],
];

function scrubNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let t = node.textContent;
    let changed = false;
    for (const [from, to] of CN_REPLACEMENTS) {
      const next = t.replace(from, to);
      if (next !== t) { t = next; changed = true; }
    }
    if (changed) node.textContent = t;
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Don't walk into script/style
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
    // Walk shadow root if accessible
    if (node.shadowRoot) walkTree(node.shadowRoot);
    for (const child of node.childNodes) scrubNode(child);
  }
}

function walkTree(root) {
  for (const node of root.childNodes) scrubNode(node);
}

function scrubTitle() {
  if (document.title.includes('Home Assistant')) {
    document.title = document.title.replace(/Home Assistant/g, 'Connect Nest');
  }
}

export function initScrubber() {
  // Initial pass
  walkTree(document.body);
  scrubTitle();

  // Watch for future DOM changes
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'characterData') {
        scrubNode(m.target);
      } else {
        for (const node of m.addedNodes) scrubNode(node);
      }
      if (m.type === 'attributes' && m.attributeName === 'title') {
        scrubTitle();
      }
    }
    scrubTitle();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['title'],
  });
}
