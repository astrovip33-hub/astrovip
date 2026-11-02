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
    yellowCardsJs.src = '/assets/all-yellow-card-surfaces-20261031.js?v=20261101-contactmenu1';
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

  /* 2026-11-02: premium midpoint series. Insert immediately before the social networks block. */
  if (!document.getElementById('av-midpoint-slider-css')) {
    const midpointStyle = document.createElement('style');
    midpointStyle.id = 'av-midpoint-slider-css';
    midpointStyle.textContent = `
      #astrovip-puncte-mijlocii{position:relative;isolation:isolate;padding:34px 18px 38px;background:radial-gradient(circle at 50% 0,rgba(29,92,137,.17),transparent 48%),linear-gradient(180deg,#02060d,#030914);border-top:1px solid rgba(232,207,146,.17);border-bottom:1px solid rgba(105,196,239,.17);overflow:hidden}
      #astrovip-puncte-mijlocii:before{content:'';position:absolute;inset:0;z-index:-1;opacity:.32;background-image:radial-gradient(circle at 18% 26%,#fff 0 1px,transparent 1.3px),radial-gradient(circle at 76% 38%,#9bd9ff 0 1px,transparent 1.4px),radial-gradient(circle at 62% 80%,#f4d98d 0 1px,transparent 1.3px);background-size:137px 137px,173px 173px,211px 211px}
      .av-midpoint-shell{width:min(980px,100%);margin:auto}
      .av-midpoint-head{display:flex;align-items:end;justify-content:space-between;gap:18px;margin:0 0 16px;padding:0 3px}
      .av-midpoint-kicker{margin:0 0 5px;color:#e8cf92;font:900 10px/1.2 Inter,system-ui,sans-serif;letter-spacing:.18em}
      .av-midpoint-head h2{margin:0;color:#fff4d1;font:700 clamp(25px,4vw,36px)/1.05 Georgia,serif;letter-spacing:-.02em}
      .av-midpoint-count{flex:0 0 auto;color:#8fc9e8;font:900 10px/1 Inter,system-ui,sans-serif;letter-spacing:.14em}
      .av-midpoint-viewport{overflow:hidden;border-radius:23px;box-shadow:0 20px 62px rgba(0,0,0,.42),0 0 40px rgba(47,131,181,.08)}
      .av-midpoint-track{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.av-midpoint-track::-webkit-scrollbar{display:none}
      .av-midpoint-slide{flex:0 0 100%;scroll-snap-align:start;display:grid;grid-template-columns:238px minmax(0,1fr);min-height:380px;text-decoration:none;color:inherit;border:1px solid rgba(232,207,146,.3);border-radius:23px;overflow:hidden;background:radial-gradient(circle at 92% 6%,rgba(105,196,239,.12),transparent 32%),linear-gradient(135deg,#09182a 0%,#06101d 55%,#030910 100%);transition:transform .2s ease,border-color .2s ease}
      .av-midpoint-slide:hover,.av-midpoint-slide:focus-visible{border-color:rgba(246,222,151,.68);outline:none}
      .av-midpoint-art{position:relative;overflow:hidden;background:#030a13}.av-midpoint-art img{display:block;width:100%;height:100%;min-height:380px;object-fit:cover;object-position:center 48%}.av-midpoint-art:after{content:'';position:absolute;inset:0;box-shadow:inset -24px 0 36px rgba(3,9,16,.36),inset 0 0 0 1px rgba(255,255,255,.04);pointer-events:none}
      .av-midpoint-copy{display:flex;flex-direction:column;justify-content:center;padding:30px 32px}
      .av-midpoint-eyebrow{margin:0 0 7px;color:#79c7ed;font:900 10px/1.2 Inter,system-ui,sans-serif;letter-spacing:.15em}
      .av-midpoint-copy h3{margin:0;color:#fff;font:700 clamp(31px,5vw,52px)/.98 Georgia,serif;letter-spacing:-.03em}.av-midpoint-copy h3 span{display:block;color:#f3d98d;font-size:.56em;line-height:1.3;letter-spacing:.02em;margin-top:5px}
      .av-midpoint-desc{max-width:600px;margin:14px 0 16px;color:#bed0dc;font:600 14px/1.58 Inter,system-ui,sans-serif}
      .av-midpoint-planets{margin:0 0 18px;color:#8fa9bc;font:800 10px/1.5 Inter,system-ui,sans-serif;letter-spacing:.045em}
      .av-midpoint-cta{display:inline-flex;align-items:center;gap:8px;width:max-content;min-height:42px;padding:9px 15px;border-radius:999px;background:linear-gradient(100deg,#f4e09d 0%,#d4ad55 55%,#7bc5e8 100%);color:#06131f;font:950 12px/1 Inter,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.28)}
      .av-midpoint-note{margin:13px 0 0;color:#70889a;font:750 9px/1.4 Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}
      @media(max-width:820px){
        #astrovip-puncte-mijlocii{padding:25px 10px 28px}
        .av-midpoint-shell{width:min(100%,520px)}
        .av-midpoint-head{margin-bottom:12px;padding:0 4px}.av-midpoint-head h2{font-size:27px}.av-midpoint-count{font-size:9px}
        .av-midpoint-viewport,.av-midpoint-slide{border-radius:18px}
        .av-midpoint-slide{grid-template-columns:38% 62%;min-height:286px}
        .av-midpoint-art img{min-height:286px;height:286px;object-position:center 47%}
        .av-midpoint-copy{padding:18px 15px 17px 16px}
        .av-midpoint-copy h3{font-size:clamp(25px,8vw,34px)}
        .av-midpoint-copy h3 span{font-size:.52em}.av-midpoint-desc{margin:10px 0 11px;font-size:12px;line-height:1.48}.av-midpoint-planets{display:none}.av-midpoint-cta{min-height:38px;padding:8px 11px;font-size:10px}.av-midpoint-note{font-size:8px;margin-top:9px}
      }
      @media(max-width:390px){.av-midpoint-head h2{font-size:24px}.av-midpoint-slide{grid-template-columns:39% 61%;min-height:268px}.av-midpoint-art img{height:268px;min-height:268px}.av-midpoint-copy{padding:15px 12px}.av-midpoint-desc{font-size:11px}.av-midpoint-kicker{font-size:9px}}
      @media(max-width:360px){.av-midpoint-head{align-items:start}.av-midpoint-count{padding-top:3px}.av-midpoint-slide{grid-template-columns:40% 60%}.av-midpoint-copy h3{font-size:24px}.av-midpoint-desc{line-height:1.42}.av-midpoint-cta{padding-inline:9px}}
      @media(prefers-reduced-motion:reduce){.av-midpoint-slide{transition:none}}
    `;
    document.head.appendChild(midpointStyle);
  }

  if (!document.getElementById('astrovip-puncte-mijlocii')) {
    const social = footer.querySelector('.avf-social');
    if (social) {
      const midpoint = document.createElement('section');
      midpoint.id = 'astrovip-puncte-mijlocii';
      midpoint.setAttribute('aria-labelledby', 'av-midpoint-title');
      midpoint.innerHTML = `
        <div class="av-midpoint-shell">
          <div class="av-midpoint-head">
            <div><p class="av-midpoint-kicker">SERIA ASTROVIP · PUNCTE MIJLOCII</p><h2 id="av-midpoint-title">Puncte Mijlocii</h2></div>
            <span class="av-midpoint-count">01 · SOARE/LUNĂ</span>
          </div>
          <div class="av-midpoint-viewport" aria-label="Slider Puncte Mijlocii">
            <div class="av-midpoint-track">
              <a class="av-midpoint-slide" href="/puncte-mijlocii/soare-luna/" aria-label="Deschide analiza punctului mijlociu Soare Lună">
                <div class="av-midpoint-art"><img src="/assets/puncte-mijlocii-soare-luna-premium.svg" alt="Soare, Lună și punctul lor mijlociu" width="1080" height="1920" loading="lazy" decoding="async"></div>
                <div class="av-midpoint-copy">
                  <p class="av-midpoint-eyebrow">PUNCT MIJLOCIU · 01</p>
                  <h3>SOARE / LUNĂ <span>centrul dintre voință și nevoie</span></h3>
                  <p class="av-midpoint-desc">Descoperă ce exprimă acest punct de sinteză și cum se schimbă interpretarea când este contactat de o altă planetă.</p>
                  <p class="av-midpoint-planets">MERCUR · VENUS · MARTE · JUPITER · SATURN · URANUS · NEPTUN · PLUTO</p>
                  <span class="av-midpoint-cta">Deschide analiza completă <span aria-hidden="true">↗</span></span>
                  <p class="av-midpoint-note">Soarele și Luna nu sunt relistate ca planete de contact.</p>
                </div>
              </a>
            </div>
          </div>
        </div>`;
      footer.insertBefore(midpoint, social);
    }
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
