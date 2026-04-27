// cn-scrubber.js — MutationObserver DOM text scrubber
// Replaces residual "Home Assistant" strings that survive nginx sub_filter.
// Observer watches childList only (NOT characterData/attributes) to avoid
// firing on every HA state update, which caused the browser to freeze.

const CN_REPLACEMENTS = [
  [/Home Assistant/g,  'Connect Nest'],
  [/home-assistant/g,  'connect-nest'],
  [/homeassistant/g,   'connectnest'],
  [/Nabu Casa/g,       'Connect Nest'],
  [/nabu\.casa/gi,     'connectnest.com.au'],
];

// Processed-node guard — prevents re-walking nodes we've already cleaned
const _seen = new WeakSet();

function scrubNode(node) {
  if (!node) return;
  if (node.nodeType === Node.TEXT_NODE) {
    let t = node.textContent;
    let changed = false;
    for (const [from, to] of CN_REPLACEMENTS) {
      const next = t.replace(from, to);
      if (next !== t) { t = next; changed = true; }
    }
    if (changed) node.textContent = t;
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
    if (_seen.has(node)) return;
    _seen.add(node);
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

// Debounce helper — batches rapid-fire mutations into one pass
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export function initScrubber() {
  // Initial full-page pass
  walkTree(document.body);
  scrubTitle();

  const process = debounce((nodes) => {
    for (const node of nodes) scrubNode(node);
    scrubTitle();
  }, 150);

  // Watch for NEW nodes being added only — not character data changes
  const observer = new MutationObserver(mutations => {
    const newNodes = [];
    for (const m of mutations) {
      if (m.type === 'childList') {
        for (const node of m.addedNodes) newNodes.push(node);
      }
    }
    if (newNodes.length) process(newNodes);
    else scrubTitle();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    // characterData and attributes deliberately omitted — too noisy in HA
  });
}
