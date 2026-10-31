(() => {
  'use strict';

  const selector = '#av-mobile-approved-home .avm-hero-copy h2.avm-hero-title';
  const markup = '<span class="av-lux-line av-lux-kicker">ANALIZA MEA.</span><span class="av-lux-line av-lux-main">DECIZIILE TALE!</span>';

  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim().toUpperCase();

  const decorate = () => {
    if (!window.matchMedia('(max-width:820px)').matches) return;
    const title = document.querySelector(selector);
    if (!title) return;

    const text = normalize(title.textContent);
    const hasDesiredMarkup = !!title.querySelector('.av-lux-kicker') && !!title.querySelector('.av-lux-main');
    const oldCopy = text.includes('CÂND CUNOȘTI') || text.includes('TRĂIEȘTI VIITORUL');

    if (!hasDesiredMarkup || oldCopy) {
      title.innerHTML = markup;
      title.classList.add('av-slogan-lux-ready');
    }

    title.setAttribute('aria-label', 'ANALIZA MEA. DECIZIILE TALE!');

    const kicker = title.querySelector('.av-lux-kicker');
    const main = title.querySelector('.av-lux-main');

    if (kicker) {
      kicker.style.setProperty('font-size', '10px', 'important');
      kicker.style.setProperty('line-height', '1.2', 'important');
      kicker.style.setProperty('letter-spacing', '.18em', 'important');
      kicker.style.setProperty('font-weight', '700', 'important');
      kicker.style.setProperty('transform', 'none', 'important');
    }

    if (main) {
      main.style.setProperty('font-size', 'clamp(31px,8.7vw,40px)', 'important');
    }
  };

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      decorate();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorate, { once: true });
  } else {
    decorate();
  }

  setTimeout(decorate, 100);
  setTimeout(decorate, 350);
  setTimeout(decorate, 1000);

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { subtree: true, childList: true });
})();
