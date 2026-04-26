// cn-about-panel.js — Connect Nest "About" custom panel
// Registered as panel_custom (name: cn-about) in configuration.yaml.
// Displays branding, What's New, System Health, and contact info.

const VERSION = '2025.4.4';

const STYLES = `
  :host {
    display: block;
    font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--primary-background-color, #f0f6f4);
    min-height: 100vh;
    box-sizing: border-box;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .page {
    max-width: 680px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
  }

  /* ── Hero ── */
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2.5rem 0 2rem;
    text-align: center;
  }
  .hero img {
    width: 88px;
    height: 88px;
    border-radius: 22px;
  }
  .hero h1 {
    font-family: 'Baumans', 'Raleway', sans-serif;
    font-size: 2rem;
    font-weight: 400;
    color: #15C7B4;
    letter-spacing: 0.04em;
  }
  .hero .tagline {
    font-size: 0.95rem;
    color: var(--secondary-text-color, #4a6660);
    font-weight: 300;
    letter-spacing: 0.05em;
  }
  .hero .version {
    font-size: 0.78rem;
    color: var(--text-medium-color, #8a9e9a);
    background: var(--secondary-background-color, #e8f0ed);
    padding: 0.25rem 0.75rem;
    border-radius: 99px;
    margin-top: 0.25rem;
  }

  /* ── Section card ── */
  .card {
    background: var(--ha-card-background, #ffffff);
    border-radius: 20px;
    padding: 1.5rem;
    margin-bottom: 1.25rem;
    box-shadow: var(--ha-card-box-shadow, 0px 2px 8px rgba(26,42,40,0.08));
  }
  .card h2 {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #15C7B4;
    margin-bottom: 1rem;
  }

  /* ── Mission ── */
  .mission p {
    font-size: 0.95rem;
    line-height: 1.7;
    color: var(--primary-text-color, #1a2a28);
    font-weight: 300;
  }

  /* ── What's New ── */
  .release-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary-text-color, #1a2a28);
    margin-bottom: 0.6rem;
  }
  .release-date {
    font-size: 0.78rem;
    color: var(--secondary-text-color, #4a6660);
    margin-bottom: 0.9rem;
  }
  .highlights {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .highlights li {
    font-size: 0.9rem;
    color: var(--primary-text-color, #1a2a28);
    padding-left: 1.4rem;
    position: relative;
    line-height: 1.5;
    font-weight: 300;
  }
  .highlights li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #15C7B4;
    font-weight: 700;
  }

  /* ── System Health ── */
  .health-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .health-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .health-label {
    font-size: 0.9rem;
    color: var(--primary-text-color, #1a2a28);
    font-weight: 400;
  }
  .health-badge {
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.25rem 0.7rem;
    border-radius: 99px;
    letter-spacing: 0.04em;
  }
  .badge-ok      { background: rgba(21,199,180,0.15); color: #0d9e8f; }
  .badge-warn    { background: rgba(222,176,107,0.2); color: #9a6c1a; }
  .badge-error   { background: rgba(220,80,80,0.15);  color: #b03030; }
  .badge-loading { background: var(--secondary-background-color, #e8f0ed); color: var(--secondary-text-color, #4a6660); }
  .backup-detail {
    font-size: 0.78rem;
    color: var(--secondary-text-color, #4a6660);
    margin-top: 0.25rem;
    text-align: right;
  }

  /* ── Contact ── */
  .wa-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    padding: 0.9rem 1.5rem;
    border-radius: 14px;
    background: #25D366;
    color: #ffffff;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-decoration: none;
    margin-bottom: 1.1rem;
    cursor: pointer;
    border: none;
    transition: opacity 0.15s;
  }
  .wa-btn:hover { opacity: 0.88; }
  .wa-btn svg { flex-shrink: 0; }

  .contact-list {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .contact-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
    color: var(--primary-text-color, #1a2a28);
    font-weight: 300;
  }
  .contact-row a {
    color: #15C7B4;
    text-decoration: none;
    font-weight: 400;
  }
  .contact-row a:hover { text-decoration: underline; }
  .contact-icon {
    width: 20px;
    text-align: center;
    color: #15C7B4;
    flex-shrink: 0;
  }

  /* ── Footer ── */
  .footer {
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-medium-color, #8a9e9a);
    margin-top: 2rem;
    line-height: 1.8;
  }
  .footer a { color: var(--text-medium-color, #8a9e9a); }
`;

const WA_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
</svg>`;

class CnAboutPanel extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    this.attachShadow({ mode: 'open' });
    this._render();
    this._loadWhatsNew();
    this._checkHealth();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this._render();
      this._loadWhatsNew();
      this._checkHealth();
    }
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600;700&family=Baumans&display=swap">
      <style>${STYLES}</style>
      <div class="page">

        <div class="hero">
          <img src="/static/icons/cn-icon-192.png" alt="Connect Nest">
          <h1>Connect Nest</h1>
          <p class="tagline">Turn On Smart Living</p>
          <span class="version">v${VERSION}</span>
        </div>

        <div class="card mission">
          <h2>About</h2>
          <p>Connect Nest makes smart home technology simple, elegant, and genuinely useful — for every Australian family. We handle the complexity so you can focus on living smarter.</p>
          <p style="margin-top:0.8rem">Your hub runs on Home Assistant, enhanced with the Connect Nest experience. Every update is designed to keep your home running beautifully.</p>
        </div>

        <div class="card" id="whats-new-card">
          <h2>What's New</h2>
          <div id="whats-new-content">
            <p style="font-size:0.85rem;color:var(--secondary-text-color)">Loading…</p>
          </div>
        </div>

        <div class="card" id="health-card">
          <h2>System Health</h2>
          <div class="health-grid">
            <div class="health-row">
              <span class="health-label">Hub</span>
              <span class="health-badge badge-ok" id="hub-badge">Online</span>
            </div>
            <div class="health-row">
              <span class="health-label">Internet</span>
              <span class="health-badge badge-loading" id="net-badge">Checking…</span>
            </div>
            <div>
              <div class="health-row">
                <span class="health-label">Last Backup</span>
                <span class="health-badge badge-loading" id="backup-badge">Checking…</span>
              </div>
              <div class="backup-detail" id="backup-detail"></div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2>Support</h2>
          <a class="wa-btn"
             href="https://wa.me/61492970809?text=Hi%20Connect%20Nest%20support%2C%20I%20need%20help%20with%20my%20hub"
             target="_blank" rel="noopener">
            ${WA_ICON}
            Chat with us on WhatsApp
          </a>
          <div class="contact-list">
            <div class="contact-row">
              <span class="contact-icon">📧</span>
              <span>Email: <a href="mailto:hello@connectnest.com.au">hello@connectnest.com.au</a></span>
            </div>
            <div class="contact-row">
              <span class="contact-icon">📞</span>
              <span>Phone: <a href="tel:+61492970809">0492 970 809</a></span>
            </div>
            <div class="contact-row">
              <span class="contact-icon">🌐</span>
              <span>Web: <a href="https://connectnest.com.au" target="_blank" rel="noopener">connectnest.com.au</a></span>
            </div>
          </div>
        </div>

        <div class="footer">
          Connect Nest Frontend v${VERSION}<br>
          Powered by <a href="https://www.home-assistant.io" target="_blank" rel="noopener">Home Assistant</a> — Apache 2.0 License
        </div>
      </div>
    `;
  }

  async _loadWhatsNew() {
    const el = this.shadowRoot.getElementById('whats-new-content');
    try {
      const res  = await fetch('/local/cn-whats-new.json?_=' + Date.now());
      const data = await res.json();
      const rel  = data.releases?.[0];
      if (!rel) { el.innerHTML = '<p style="font-size:0.85rem">No release data found.</p>'; return; }

      const date = new Date(rel.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
      el.innerHTML = `
        <div class="release-title">${rel.title}</div>
        <div class="release-date">${date}</div>
        <ul class="highlights">
          ${(rel.highlights || []).map(h => `<li>${h}</li>`).join('')}
        </ul>
      `;
    } catch (_) {
      el.innerHTML = '<p style="font-size:0.85rem;color:var(--secondary-text-color)">Could not load release notes.</p>';
    }
  }

  async _checkHealth() {
    // ── Internet ──
    const netBadge = this.shadowRoot.getElementById('net-badge');
    try {
      const ctrl = new AbortController();
      const tid  = setTimeout(() => ctrl.abort(), 5000);
      const res  = await fetch('https://connectnest.com.au/healthz', { signal: ctrl.signal, cache: 'no-store' });
      clearTimeout(tid);
      if (res.ok) {
        netBadge.textContent = 'Online';
        netBadge.className   = 'health-badge badge-ok';
      } else {
        netBadge.textContent = 'Limited';
        netBadge.className   = 'health-badge badge-warn';
      }
    } catch (_) {
      netBadge.textContent = 'Offline';
      netBadge.className   = 'health-badge badge-error';
    }

    // ── Backup ──
    const backupBadge  = this.shadowRoot.getElementById('backup-badge');
    const backupDetail = this.shadowRoot.getElementById('backup-detail');
    try {
      const hass = this._hass;
      if (!hass) throw new Error('no hass');
      const data = await hass.callApi('GET', 'hassio/backups');
      const backups = data?.data?.backups || [];
      if (!backups.length) {
        backupBadge.textContent = 'No backups';
        backupBadge.className   = 'health-badge badge-warn';
        return;
      }
      backups.sort((a, b) => new Date(b.date) - new Date(a.date));
      const latest  = new Date(backups[0].date);
      const ageMs   = Date.now() - latest.getTime();
      const ageDays = Math.floor(ageMs / 86400000);
      const label   = latest.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });

      if (ageDays <= 1) {
        backupBadge.textContent = 'Recent';
        backupBadge.className   = 'health-badge badge-ok';
      } else if (ageDays <= 7) {
        backupBadge.textContent = `${ageDays}d ago`;
        backupBadge.className   = 'health-badge badge-ok';
      } else if (ageDays <= 30) {
        backupBadge.textContent = `${ageDays}d ago`;
        backupBadge.className   = 'health-badge badge-warn';
      } else {
        backupBadge.textContent = 'Overdue';
        backupBadge.className   = 'health-badge badge-error';
      }
      backupDetail.textContent = label;
    } catch (_) {
      backupBadge.textContent = 'Unknown';
      backupBadge.className   = 'health-badge badge-loading';
    }
  }
}

customElements.define('cn-about', CnAboutPanel);
