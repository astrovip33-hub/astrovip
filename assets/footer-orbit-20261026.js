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

  /* Preview 2026-10-31: luxury treatment on the hero variant actually rendered on mobile. */
  if (!document.getElementById('av-hero-slogan-lux-css')) {
    const sloganLuxCss = document.createElement('link');
    sloganLuxCss.id = 'av-hero-slogan-lux-css';
    sloganLuxCss.rel = 'stylesheet';
    sloganLuxCss.href = '/assets/hero-slogan-lux-20261031.css?v=20261031-preview4';
    document.head.appendChild(sloganLuxCss);
  }
  if (!document.getElementById('av-hero-slogan-lux-text-js')) {
    const sloganLuxText = document.createElement('script');
    sloganLuxText.id = 'av-hero-slogan-lux-text-js';
    sloganLuxText.src = '/assets/hero-slogan-lux-text-20261031.js?v=20261031-preview4';
    sloganLuxText.defer = true;
    document.head.appendChild(sloganLuxText);
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
