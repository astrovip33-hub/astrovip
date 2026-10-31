(() => {
  'use strict';

  const markup = '<span class="av-lux-eyebrow">ANALIZA MEA.</span><span class="av-lux-main">DECIZIILE TALE!</span>';
  const selectors = [
    '#av-mobile-approved-home .avm-hero-copy h2.avm-hero-title',
    '.hero.av-hero-v2 .av-hero-v2-sidecopy:not(.right)'
  ];

  const apply = () => {
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((title) => {
        const oldCopy = /CÂND\s+CUNOȘTI|TRĂIEȘTI\s+VIITORUL/i.test(title.textContent || '');
        if (!title.classList.contains('av-slogan-lux-ready') || oldCopy) {
          title.innerHTML = markup;
          title.classList.add('av-slogan-lux-ready');
        }
        title.setAttribute('aria-label', 'ANALIZA MEA. DECIZIILE TALE!');
      });
    });
  };

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      apply();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }

  setTimeout(apply, 250);
  setTimeout(apply, 1000);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { subtree: true, childList: true });
})();
