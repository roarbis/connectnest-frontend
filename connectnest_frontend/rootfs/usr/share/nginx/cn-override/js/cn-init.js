// cn-init.js — Connect Nest Frontend global initialiser
import { initScrubber }   from '/local/cn-scrubber.js';
import { initHideLeaks }  from '/local/cn-hide-leaks.js';

(function cnInit() {
  const run = () => {
    initScrubber();
    initHideLeaks();
    injectLoginLogo();
    initToastBranding();    // item 6 — branded notifications
    initNotFoundGuard();    // item 7 — custom 404 screen
    initSidebarExtras();    // quick-links + user avatar
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();

// ─── Login page logo ───────────────────────────────────────────────────────
function injectLoginLogo() {
  const LOGO_ID = 'cn-login-logo';

  function buildLogo() {
    const wrap = document.createElement('div');
    wrap.id = LOGO_ID;
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;margin-bottom:24px;';
    wrap.innerHTML = `
      <img src="/static/icons/cn-icon-96.png" alt="Connect Nest"
           style="width:72px;height:72px;border-radius:16px;margin-bottom:10px;">
      <span style="font-family:baumans,sans-serif;font-size:26px;color:#15C7B4;letter-spacing:.5px;">Connect Nest</span>
      <span style="font-family:Raleway,sans-serif;font-size:13px;color:#888;margin-top:2px;">Turn On Smart Living</span>
    `;
    return wrap;
  }

  function tryInject(root) {
    if (!root) return;
    if (root.querySelector && root.querySelector('#' + LOGO_ID)) return;
    const authFlow = root.querySelector && root.querySelector('ha-auth-flow');
    if (authFlow && authFlow.shadowRoot) {
      const inner = authFlow.shadowRoot;
      if (inner.querySelector('#' + LOGO_ID)) return;
      const target = inner.querySelector('.card-content, form, ha-form');
      if (target) inner.insertBefore(buildLogo(), target);
    }
  }

  const obs = new MutationObserver(() => {
    const ha = document.querySelector('home-assistant');
    if (ha && ha.shadowRoot) tryInject(ha.shadowRoot);
  });
  obs.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => {
    const ha = document.querySelector('home-assistant');
    if (ha && ha.shadowRoot) tryInject(ha.shadowRoot);
  }, 500);
}

// ─── Item 6 — Branded notification toasts ─────────────────────────────────
// HA's persistent-notification and toast elements live in ha-sidebar and
// home-assistant shadow roots. We inject a stylesheet that overrides the
// colour tokens they read from :host and CSS variables.
function initToastBranding() {
  const CSS = `
    /* Toast / snackbar — mwc-snackbar */
    mwc-snackbar, .mdc-snackbar {
      --mdc-snackbar-fill-color: #1e2822 !important;
      --mdc-snackbar-label-ink-color: #ffffff !important;
      --mdc-button-outline-color: #15C7B4 !important;
      font-family: Raleway, sans-serif !important;
    }
    /* Persistent notification badge on sidebar bell */
    ha-icon-button .notification-badge,
    .notification-badge {
      background-color: #15C7B4 !important;
      color: #000 !important;
      font-family: Raleway, sans-serif !important;
    }
    /* Alert bars */
    ha-alert {
      --alert-success-color: #15C7B4;
      --alert-info-color: #3c8b8c;
    }
  `;

  // Inject into document (catches anything not inside a shadow root)
  const sheet = document.createElement('style');
  sheet.dataset.cn = 'toast';
  sheet.textContent = CSS;
  document.head.appendChild(sheet);

  // Also inject into ha-more-info-dialog and home-assistant shadow roots
  // once they're available, to catch shadow-DOM-hosted toasts
  function injectIntoShadow(el) {
    if (!el || !el.shadowRoot) return;
    if (el.shadowRoot.querySelector('style[data-cn="toast"]')) return;
    const s = document.createElement('style');
    s.dataset.cn = 'toast';
    s.textContent = CSS;
    el.shadowRoot.prepend(s);
  }

  const obs = new MutationObserver(() => {
    injectIntoShadow(document.querySelector('home-assistant'));
  });
  obs.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => injectIntoShadow(document.querySelector('home-assistant')), 1000);
}

// ─── Item 7 — Custom 404 / panel-not-found guard ──────────────────────────
// HA's SPA router shows a blank panel area when a panel URL doesn't exist.
// We detect the default "Page not found" state and replace it with a
// CN-branded message.
function initNotFoundGuard() {
  const NOT_FOUND_HTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                height:100%;padding:40px;text-align:center;font-family:Raleway,sans-serif;">
      <img src="/static/icons/cn-icon-96.png" alt="Connect Nest"
           style="width:64px;height:64px;border-radius:14px;margin-bottom:20px;opacity:.8;">
      <h2 style="color:#15C7B4;font-family:baumans,sans-serif;font-size:28px;margin:0 0 10px;">
        Oops — page not found
      </h2>
      <p style="color:#888;max-width:360px;line-height:1.6;margin:0 0 24px;">
        This section isn't available. Head back to your dashboard or contact Connect Nest support if something looks wrong.
      </p>
      <a href="/" style="background:#15C7B4;color:#000;padding:12px 28px;border-radius:30px;
                         text-decoration:none;font-weight:600;font-size:15px;">
        Go to My Home
      </a>
      <a href="https://wa.me/61492970809" target="_blank"
         style="margin-top:14px;color:#15C7B4;font-size:13px;text-decoration:none;">
        Chat with us on WhatsApp
      </a>
    </div>
  `;

  function checkForNotFound(root) {
    if (!root) return;
    // HA renders "Page not found" inside partial-panel-resolver or as ha-404
    const notFound = root.querySelector('ha-404, [data-panel-error], partial-panel-resolver');
    if (!notFound) return;
    // If it's showing error state (empty content or a known error class)
    if (notFound.tagName === 'HA-404' || (notFound.innerHTML && notFound.innerHTML.includes('404'))) {
      if (!notFound.querySelector('[data-cn-404]')) {
        notFound.innerHTML = `<div data-cn-404 style="height:100%;">${NOT_FOUND_HTML}</div>`;
      }
    }
  }

  const obs = new MutationObserver(() => {
    const ha = document.querySelector('home-assistant');
    if (ha && ha.shadowRoot) checkForNotFound(ha.shadowRoot);
  });
  obs.observe(document.body, { childList: true, subtree: true });
}

// ─── Sidebar quick-links + user avatar ────────────────────────────────────
// Injects shortcut links (Devices, Automations, etc.) into the sidebar
// and replaces the user initial badge with the CN icon.
function initSidebarExtras() {
  // Quick-link definitions: label, mdi icon, internal HA URL
  const QUICK_LINKS = [
    { label: 'Devices',      icon: 'mdi:devices',         url: '/config/devices/dashboard' },
    { label: 'Automations',  icon: 'mdi:robot',           url: '/config/automation' },
    { label: 'Dashboards',   icon: 'mdi:view-dashboard',  url: '/config/lovelace/dashboards' },
    { label: 'Apps',         icon: 'mdi:apps',            url: '/hassio/store' },
  ];

  function buildLink({ label, icon, url }) {
    const a = document.createElement('a');
    a.href = url;
    a.dataset.cnLink = label;
    a.style.cssText = [
      'display:flex',
      'align-items:center',
      'gap:12px',
      'padding:10px 16px',
      'color:var(--sidebar-text-color,#BAC0C6)',
      'text-decoration:none',
      'font-family:Raleway,sans-serif',
      'font-size:14px',
      'font-weight:500',
      'border-radius:8px',
      'margin:1px 8px',
      'transition:background .15s,color .15s',
    ].join(';');
    a.onmouseenter = () => {
      a.style.background = 'rgba(21,199,180,.12)';
      a.style.color = '#15C7B4';
    };
    a.onmouseleave = () => {
      a.style.background = '';
      a.style.color = 'var(--sidebar-text-color,#BAC0C6)';
    };
    a.innerHTML = `
      <ha-icon icon="${icon}" style="width:24px;height:24px;color:inherit;flex-shrink:0;"></ha-icon>
      <span>${label}</span>
    `;
    return a;
  }

  function injectLinks(sidebar) {
    if (!sidebar || !sidebar.shadowRoot) return;
    const sRoot = sidebar.shadowRoot;
    if (sRoot.querySelector('[data-cn-link]')) return; // already injected

    // Insert before the divider / bottom section
    const scrollDiv = sRoot.querySelector('.scroll') || sRoot.querySelector('paper-listbox') || sRoot.querySelector('ul');
    if (!scrollDiv) return;

    const wrapper = document.createElement('div');
    wrapper.dataset.cnQuickLinks = '1';
    wrapper.style.cssText = 'padding:4px 0;border-top:1px solid rgba(255,255,255,.07);margin-top:4px;';
    for (const def of QUICK_LINKS) wrapper.appendChild(buildLink(def));
    scrollDiv.appendChild(wrapper);
  }

  function patchUserBadge(sidebar) {
    if (!sidebar || !sidebar.shadowRoot) return;
    const sRoot = sidebar.shadowRoot;
    // ha-user-badge renders a coloured circle with initials
    const badge = sRoot.querySelector('ha-user-badge');
    if (!badge || badge.dataset.cnPatched) return;
    badge.dataset.cnPatched = '1';

    // Override the inner shadow DOM to show CN icon instead
    const patchBadge = () => {
      if (!badge.shadowRoot) return;
      const circle = badge.shadowRoot.querySelector('.badge, span, div');
      if (!circle) return;
      circle.style.cssText = [
        'background:transparent !important',
        'border:2px solid #15C7B4',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'border-radius:50%',
        'width:36px',
        'height:36px',
        'overflow:hidden',
      ].join(';');
      if (!circle.querySelector('img[data-cn-avatar]')) {
        circle.innerHTML = '';
        const img = document.createElement('img');
        img.src = '/static/icons/cn-icon-96.png';
        img.dataset.cnAvatar = '1';
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
        circle.appendChild(img);
      }
    };

    patchBadge();
    // Re-attempt if shadow root wasn't ready yet
    if (badge.shadowRoot) {
      new MutationObserver(patchBadge).observe(badge.shadowRoot, { childList: true, subtree: true });
    }
  }

  let injected = false;
  const obs = new MutationObserver(() => {
    const ha = document.querySelector('home-assistant');
    if (!ha || !ha.shadowRoot) return;
    const sidebar = ha.shadowRoot.querySelector('ha-sidebar');
    if (!sidebar) return;
    if (!injected) { injectLinks(sidebar); injected = true; }
    patchUserBadge(sidebar);
  });
  obs.observe(document.body, { childList: true, subtree: true });

  // Immediate attempt for already-rendered pages
  setTimeout(() => {
    const ha = document.querySelector('home-assistant');
    if (!ha || !ha.shadowRoot) return;
    const sidebar = ha.shadowRoot.querySelector('ha-sidebar');
    if (sidebar) { injectLinks(sidebar); patchUserBadge(sidebar); injected = true; }
  }, 800);
}
