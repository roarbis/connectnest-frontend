// cn-init.js — Connect Nest Frontend global initialiser
import { initScrubber }   from '/local/cn-scrubber.js';
import { initHideLeaks }  from '/local/cn-hide-leaks.js';

(function cnInit() {
  const run = () => {
    initScrubber();
    initHideLeaks();
    injectLoginLogo();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();

// ---------------------------------------------------------------------------
// Login page logo injection
// HA renders the login form inside <home-assistant> → <ha-onboarding> or
// <ha-auth-flow> inside shadow DOM. We watch for these elements and prepend
// the CN logo above the form card.
// ---------------------------------------------------------------------------
function injectLoginLogo() {
  const LOGO_ID = 'cn-login-logo';

  function buildLogo() {
    const wrap = document.createElement('div');
    wrap.id = LOGO_ID;
    wrap.style.cssText = [
      'display:flex',
      'flex-direction:column',
      'align-items:center',
      'margin-bottom:24px',
    ].join(';');
    wrap.innerHTML = `
      <img src="/static/icons/cn-icon-96.png"
           alt="Connect Nest"
           style="width:72px;height:72px;border-radius:16px;margin-bottom:10px;">
      <span style="font-family:baumans,sans-serif;font-size:26px;color:#15C7B4;
                   letter-spacing:0.5px;">Connect Nest</span>
      <span style="font-family:Raleway,sans-serif;font-size:13px;color:#888;
                   margin-top:2px;">Turn On Smart Living</span>
    `;
    return wrap;
  }

  function tryInject(root) {
    if (!root) return;
    // Already injected into this root
    if (root.getElementById ? root.getElementById(LOGO_ID) : root.querySelector('#' + LOGO_ID)) return;

    // ha-auth-flow contains a .card-content or mwc-list; insert before the form's first child
    const authFlow = root.querySelector('ha-auth-flow');
    if (authFlow && authFlow.shadowRoot) {
      const inner = authFlow.shadowRoot;
      if (inner.querySelector('#' + LOGO_ID)) return;
      const formCard = inner.querySelector('.card-content, form, ha-form');
      if (formCard) {
        inner.insertBefore(buildLogo(), formCard);
      }
    }
  }

  // Watch for shadow roots being populated
  const obs = new MutationObserver(() => {
    const ha = document.querySelector('home-assistant');
    if (!ha || !ha.shadowRoot) return;
    const haRoot = ha.shadowRoot;

    // Onboarding path
    const onboard = haRoot.querySelector('ha-onboarding');
    if (onboard && onboard.shadowRoot) tryInject(onboard.shadowRoot);

    // Normal login path
    const panel = haRoot.querySelector('ha-panel-iframe, partial-panel-resolver');
    tryInject(haRoot);
  });

  obs.observe(document.body, { childList: true, subtree: true });

  // Also try immediately in case we're already on the login page
  setTimeout(() => {
    const ha = document.querySelector('home-assistant');
    if (ha && ha.shadowRoot) tryInject(ha.shadowRoot);
  }, 500);
}
