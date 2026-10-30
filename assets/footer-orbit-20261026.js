/* Keep footer actions independent of the mobile header's legacy footer tools. */
(() => {
  'use strict';

  /* Approved 2026-10-26: load the certification card independently of footer detection. */
  if (!document.getElementById('av-cert-l7x-css')) {
    const certCss = document.createElement('link');
    certCss.id = 'av-cert-l7x-css';
    certCss.rel = 'stylesheet';
    certCss.href = '/assets/certificare-card-20261026.css?v=20261026-live2';
    document.head.appendChild(certCss);
  }
  if (!document.getElementById('av-cert-l7x-js')) {
    const certJs = document.createElement('script');
    certJs.id = 'av-cert-l7x-js';
    certJs.src = '/assets/certificare-card-20261026.js?v=20261026-live2';
    document.head.appendChild(certJs);
  }

  const footer = document.getElementById('astrovip-footer');
  if (!footer?.classList.contains('avf-footer')) return;

  /* Premium PFA/business card — approved 2026-10-30. */
  if (!document.getElementById('av-pfa-premium-card')) {
    const shell = footer.querySelector('.avf-shell');
    if (shell) {
      if (!document.getElementById('av-pfa-premium-card-style')) {
        const style = document.createElement('style');
        style.id = 'av-pfa-premium-card-style';
        style.textContent = `
          #av-pfa-premium-card{width:100%;max-width:1536px;margin:28px auto 20px;padding:0;box-sizing:border-box;line-height:0}
          #av-pfa-premium-card img{display:block;width:100%;height:auto;max-width:100%;margin:0 auto;border:0;border-radius:14px;box-shadow:0 16px 44px rgba(0,0,0,.48),0 0 24px rgba(15,58,106,.28)}
          @media(max-width:820px){#av-pfa-premium-card{margin:20px auto 16px}#av-pfa-premium-card img{border-radius:9px}}
        `;
        document.head.appendChild(style);
      }
      const card = document.createElement('section');
      card.id = 'av-pfa-premium-card';
      card.setAttribute('aria-label', 'Date profesionale și bancare Smaranda Cristian Catalin PFA');
      card.innerHTML = '<img src="/assets/footer-pfa-premium-20261030.webp?v=20261030-live1" alt="Smaranda Cristian Catalin PFA — Astrolog Autorizat — Cont Bancar" width="1536" height="512" loading="lazy" decoding="async">';
      const legal = shell.querySelector('.avf-legal');
      if (legal) shell.insertBefore(card, legal);
      else shell.appendChild(card);
    }
  }

  /* Approved 2026-10-26: activate the scoped L7X Header + Hero layer on the live homepage only. */
  if (!document.getElementById('av-l7x-live-css')) {
    const l7x = document.createElement('link');
    l7x.id = 'av-l7x-live-css';
    l7x.rel = 'stylesheet';
    l7x.href = '/assets/homepage-l7x-preview.css?v=20261026-live1';
    document.head.appendChild(l7x);
  }
  document.body.classList.add('av-l7x-preview');

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
