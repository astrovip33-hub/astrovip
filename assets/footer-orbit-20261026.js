/* Keep footer actions independent of the mobile header's legacy footer tools. */
(() => {
  'use strict';
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

  /* Approved 2026-10-26: premium responsive certification card, desktop + mobile. */
  if (!document.getElementById('av-cert-l7x-css')) {
    const certCss = document.createElement('link');
    certCss.id = 'av-cert-l7x-css';
    certCss.rel = 'stylesheet';
    certCss.href = '/assets/certificare-card-20261026.css?v=20261026-live1';
    document.head.appendChild(certCss);
  }
  if (!document.getElementById('av-cert-l7x-js')) {
    const certJs = document.createElement('script');
    certJs.id = 'av-cert-l7x-js';
    certJs.src = '/assets/certificare-card-20261026.js?v=20261026-live1';
    certJs.defer = true;
    document.head.appendChild(certJs);
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
