/* No image replacement, hidden content or continuous render loops. */
(function () {
  'use strict';
  if (document.documentElement.dataset.avMotionLoaded) return;
  document.documentElement.dataset.avMotionLoaded = '1';

  function hideMobileBanners() {
    if (!matchMedia('(max-width: 820px)').matches) return;
    document.querySelectorAll('.planet-strip, .av-lang-planets, .av-planet-hero-strip').forEach(el => {
      el.style.setProperty('display', 'none', 'important');
      el.setAttribute('aria-hidden', 'true');
    });
  }

  function init() {
    document.body.classList.add('av-motion-live');
    hideMobileBanners();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer: fine) and (min-width: 981px)').matches) return;
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const box = card.getBoundingClientRect();
        card.style.setProperty('--av-mx', `${100 * (event.clientX - box.left) / box.width}%`);
        card.style.setProperty('--av-my', `${100 * (event.clientY - box.top) / box.height}%`);
      }, {passive: true});
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true}); else init();
})();
