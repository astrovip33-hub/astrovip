(() => {
  'use strict';

  const markup = '<span class="av-lux-eyebrow">ANALIZA MEA</span><span class="av-lux-main">— DECIZIILE TALE!</span>';
  const directSelectors = [
    '#av-mobile-approved-home .avm-hero-copy h2.avm-hero-title',
    '.hero.av-hero-v2 .av-hero-v2-sidecopy:not(.right)'
  ];
  const candidateSelector = [
    '.hero h1', '.hero h2',
    '.av-pro-hero h1', '.av-pro-hero h2',
    '[class*="hero"] h1', '[class*="hero"] h2',
    '[class*="sidecopy"]'
  ].join(',');

  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();
  const isOldVisibleSlogan = (node) => {
    const text = normalize(node.textContent);
    return text.includes('CÂND CUNOȘTI') && text.includes('TRĂIEȘTI VIITORUL');
  };
  const isDesiredSlogan = (node) => {
    const text = normalize(node.textContent);
    return text.includes('ANALIZA MEA') && text.includes('DECIZIILE TALE');
  };

  const decorate = (title) => {
    if (!title || title.closest('footer')) return;
    if (!title.classList.contains('av-slogan-lux-ready') || isOldVisibleSlogan(title)) {
      title.innerHTML = markup;
      title.classList.add('av-slogan-lux-ready');
    }
    title.setAttribute('aria-label', 'ANALIZA MEA – DECIZIILE TALE!');
  };

  const apply = () => {
    const targets = new Set();
    directSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => targets.add(node));
    });
    document.querySelectorAll(candidateSelector).forEach((node) => {
      if (isOldVisibleSlogan(node) || isDesiredSlogan(node)) targets.add(node);
    });
    targets.forEach(decorate);
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

  setTimeout(apply, 100);
  setTimeout(apply, 350);
  setTimeout(apply, 1000);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { subtree: true, childList: true });
})();
