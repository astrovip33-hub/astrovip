/* Keep footer actions independent of the mobile header's legacy footer tools. */
(() => {
  'use strict';

  /* Approved 2026-10-31: use the hamburger gold→cyan gradient on every yellow card surface down to the footer. */
  if (!document.getElementById('av-yellow-cards-gold-blue-css')) {
    const yellowCardsCss = document.createElement('link');
    yellowCardsCss.id = 'av-yellow-cards-gold-blue-css';
    yellowCardsCss.rel = 'stylesheet';
    yellowCardsCss.href = '/assets/yellow-cards-gold-blue-20261031.css?v=20261031-live2';
    document.head.appendChild(yellowCardsCss);
  }
  if (!document.getElementById('av-all-yellow-card-surfaces-js')) {
    const yellowCardsJs = document.createElement('script');
    yellowCardsJs.id = 'av-all-yellow-card-surfaces-js';
    yellowCardsJs.src = '/assets/all-yellow-card-surfaces-20261031.js?v=20261031-live2';
    yellowCardsJs.defer = true;
    document.head.appendChild(yellowCardsJs);
  }

  const footer = document.getElementById('astrovip-footer');
  if (!footer?.classList.contains('avf-footer')) return;

  /* Approved 2026-10-26: activate the scoped L7X Header + Hero layer on the live homepage only. */
  if (!document.getElementById('av-l7x-live-css')) {
    const l7x = document.createElement('link');
    l7x.id = 'av-l7x-live-css';
    l7x.rel = 'stylesheet';
    l7x.href = '/assets/homepage-l7x-preview.css?v=20261026-live1';
    document.head.appendChild(l7x);
  }
  document.body.classList.add('av-l7x-preview');

  /* 2026-11-01: real Contact destination for the mobile menu. */
  const menuContact = document.querySelector('#menu a[href="#contact"]');
  if (menuContact) {
    menuContact.classList.add('av-menu-contact-link');
    menuContact.setAttribute('aria-label', 'Contact AstroVip — telefon, WhatsApp, email și adresă');
  }

  if (!document.getElementById('av-contact-hub-css')) {
    const style = document.createElement('style');
    style.id = 'av-contact-hub-css';
    style.textContent = `
      .av-contact-hub{scroll-margin-top:76px;padding:28px 16px;background:#03080e;border-top:1px solid rgba(105,196,239,.18);border-bottom:1px solid rgba(232,207,146,.2)}
      .av-contact-hub__inner{width:min(760px,100%);margin:auto;padding:22px;border:1px solid rgba(105,196,239,.42);border-radius:20px;background:radial-gradient(circle at 90% 0,rgba(105,196,239,.13),transparent 42%),linear-gradient(145deg,#0b1b2f,#07101d 72%,#050b13);box-shadow:0 16px 42px rgba(0,0,0,.38),inset 0 0 0 1px rgba(232,207,146,.06)}
      .av-contact-hub__kicker{margin:0 0 6px;color:#e8cf92;font:900 10px/1.2 Inter,system-ui,sans-serif;letter-spacing:.16em}
      .av-contact-hub h2{margin:0;color:#fff3d1;font:700 clamp(25px,5vw,34px)/1.08 Georgia,serif}
      .av-contact-hub__lead{margin:8px 0 16px;color:#c8d5df;font:600 14px/1.5 Inter,system-ui,sans-serif}
      .av-contact-hub__actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
      .av-contact-hub__actions a{display:flex;align-items:center;justify-content:center;min-height:48px;padding:10px 12px;border:1px solid rgba(105,196,239,.34);border-radius:12px;background:rgba(255,255,255,.035);color:#eef8ff;text-decoration:none;text-align:center;font:850 13px/1.25 Inter,system-ui,sans-serif;transition:transform .18s ease,border-color .18s ease,background .18s ease}
      .av-contact-hub__actions a:hover,.av-contact-hub__actions a:focus-visible{transform:translateY(-1px);border-color:#e8cf92;background:rgba(232,207,146,.07)}
      .av-contact-hub__actions a.av-contact-primary{background:linear-gradient(100deg,#f0d996,#d7bc82 52%,#8ec9e9);color:#071522;border-color:transparent}
      .av-contact-hub__meta{margin:14px 0 0;color:#9fb1c0;font:700 11px/1.45 Inter,system-ui,sans-serif;text-align:center}
      #menu .av-menu-contact-link{position:relative;font-weight:900!important;color:#f4df9c!important}
      #menu .av-menu-contact-link::after{content:'  ·  TEL · WA · EMAIL';font-size:.7em;letter-spacing:.04em;color:#7fd2ff}
      @media(max-width:820px){
        .av-contact-hub{padding:20px 12px}
        .av-contact-hub__inner{padding:17px;border-radius:17px}
        .av-contact-hub__actions{grid-template-columns:1fr}
        .av-contact-hub__actions a{min-height:46px;font-size:13px}
        #menu .av-menu-contact-link{border-color:rgba(105,196,239,.36)!important;background:linear-gradient(90deg,rgba(232,207,146,.07),rgba(105,196,239,.07))!important}
      }
      @media(prefers-reduced-motion:reduce){.av-contact-hub__actions a{transition:none}}
    `;
    document.head.appendChild(style);
  }

  if (!document.getElementById('contact')) {
    const contact = document.createElement('section');
    contact.id = 'contact';
    contact.className = 'av-contact-hub';
    contact.setAttribute('aria-labelledby', 'av-contact-title');
    contact.innerHTML = `
      <div class="av-contact-hub__inner">
        <p class="av-contact-hub__kicker">CONTACT ASTROVIP</p>
        <h2 id="av-contact-title">Contact direct</h2>
        <p class="av-contact-hub__lead">Alege metoda cea mai comodă pentru programări, întrebări sau detalii despre serviciile AstroVip.</p>
        <div class="av-contact-hub__actions">
          <a class="av-contact-primary" href="tel:+40722128220" aria-label="Sună AstroVip la 0722 128 220">Telefon · 0722 128 220</a>
          <a href="https://wa.me/40722128220" target="_blank" rel="noopener noreferrer" aria-label="Scrie AstroVip pe WhatsApp">WhatsApp · mesaj direct</a>
          <a href="mailto:contact@astrovip.ro" aria-label="Trimite email către contact@astrovip.ro">contact@astrovip.ro</a>
          <a href="https://www.google.com/maps?cid=15612666586801751925" target="_blank" rel="noopener noreferrer" aria-label="Deschide locația AstroVip în Google Maps">Bulevardul Unirii 33 · București</a>
        </div>
        <p class="av-contact-hub__meta">Luni–Vineri · 10:00–17:00 · consultații online și în București, cu programare</p>
      </div>`;
    footer.parentNode.insertBefore(contact, footer);
  }

  footer.querySelector('[data-avf-chat]')?.addEventListener('click', () => {
    const launcher = document.querySelector('#av-site-header .avchat-launcher, .avchat-launcher');
    if (launcher) launcher.click();
    else window.location.assign('/intrebare-gratuita/');
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      document.body.classList.toggle('av-footer-visible', entries.some(entry => entry.isIntersecting));
    }).observe(footer);
  }
})();
