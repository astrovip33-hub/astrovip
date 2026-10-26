(() => {
  'use strict';
  const mobile = matchMedia('(max-width:820px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const prefix = 'html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home';
  const install = () => {
    const section = document.getElementById('studii-de-caz-home');
    const source = section?.querySelector('.av-case-showcase-grid');
    if (!source) return false;
    if (section.dataset.avMobileFullcardV2) return true;
    section.dataset.avMobileFullcardV2 = '1';
    const style = document.createElement('style');
    style.id = 'av-case-mobile-fullcard-style-20261026';
    style.textContent = `
      ${prefix} .av-case-mobile-ticker{display:none}
      @media(max-width:820px){
        ${prefix} .av-case-showcase-frame{padding-inline:10px!important;box-sizing:border-box!important}
        ${prefix} .av-case-showcase-grid{width:100%!important;max-width:100%!important;margin:0!important;padding:4px 0 12px!important;box-sizing:border-box!important;transform:none!important;animation:none!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important;scroll-padding-inline:0!important;mask-image:none!important;-webkit-mask-image:none!important}
        ${prefix} .av-case-showcase-grid>.av-case-showcase-card{flex:0 0 100%!important;width:100%!important;min-width:0!important;max-width:100%!important;box-sizing:border-box!important;scroll-snap-align:start!important}
        ${prefix}[data-av-mobile-ticker="1"] .av-case-showcase-grid,${prefix}[data-av-mobile-ticker="1"] .av-case-mobile-nav-v7,${prefix}[data-av-mobile-ticker="1"] .av-case-slider-nav{display:none!important}
        ${prefix}[data-av-mobile-ticker="1"] .av-case-mobile-ticker{display:block!important;width:100%!important;max-width:100%!important;box-sizing:border-box!important;padding:4px 0 14px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-behavior:auto!important;scroll-snap-type:none!important;scrollbar-width:none!important;overscroll-behavior-inline:contain!important;touch-action:pan-x pan-y!important;mask-image:none!important;-webkit-mask-image:none!important}
        ${prefix} .av-case-mobile-ticker::-webkit-scrollbar{display:none!important}
        ${prefix} .av-case-mobile-ticker-track{display:flex!important;align-items:stretch!important;width:max-content!important;max-width:none!important;gap:0!important;transform:none!important;animation:none!important}
        ${prefix} .av-case-mobile-ticker-group{display:flex!important;align-items:stretch!important;flex:0 0 auto!important;gap:12px!important;padding-right:12px!important}
        ${prefix} .av-case-mobile-ticker .av-case-showcase-card{display:flex!important;flex-direction:column!important;align-self:stretch!important;flex:0 0 var(--av-mobile-case-width)!important;width:var(--av-mobile-case-width)!important;min-width:0!important;max-width:none!important;margin:0!important;box-sizing:border-box!important;transform:none!important;scroll-snap-align:none!important}
        ${prefix} .av-case-mobile-ticker .av-case-showcase-copy{display:flex!important;flex-direction:column!important;flex:1!important;min-width:0!important}
        ${prefix} .av-case-mobile-ticker .av-case-showcase-cta{margin-top:auto!important;max-width:100%!important;white-space:normal!important;box-sizing:border-box!important}
        ${prefix} .av-case-mobile-ticker .av-case-showcase-card h3{overflow-wrap:anywhere!important}
      }`;
    document.head.appendChild(style);
    const viewport = document.createElement('div');
    viewport.className = 'av-case-mobile-ticker';
    viewport.setAttribute('role', 'region');
    viewport.setAttribute('aria-label', 'Studii de caz — derulare lentă, pauză la atingere');
    const track = document.createElement('div');
    track.className = 'av-case-mobile-ticker-track';
    viewport.appendChild(track);
    source.after(viewport);
    let raf = 0, lastTime = 0, resumeAt = 0, held = false, hovered = false, loopWidth = 0, offset = 0;
    const active = () => mobile.matches && !reduced.matches;
    const measure = () => {
      if (!active() || !viewport.clientWidth) return;
      // Fixed pixel card widths avoid percentages resolving against the entire strip.
      viewport.style.setProperty('--av-mobile-case-width', `${viewport.clientWidth}px`);
      loopWidth = track.firstElementChild?.getBoundingClientRect().width || 0;
      offset = loopWidth ? viewport.scrollLeft % loopWidth : 0;
      viewport.scrollLeft = offset;
    };
    const rebuild = () => {
      const cards = [...source.querySelectorAll(':scope > .av-case-showcase-card')];
      track.replaceChildren();
      for (let copy = 0; copy < 2; copy++) {
        const group = document.createElement('div');
        group.className = 'av-case-mobile-ticker-group';
        if (copy) group.setAttribute('aria-hidden', 'true');
        cards.forEach(card => {
          const clone = card.cloneNode(true);
          [clone, ...clone.querySelectorAll('[id],[aria-labelledby]')].forEach(el => {
            el.removeAttribute('id'); el.removeAttribute('aria-labelledby');
          });
          if (copy) [clone, ...clone.querySelectorAll('a,button,[tabindex]')].forEach(el => el.setAttribute('tabindex', '-1'));
          group.appendChild(clone);
        });
        track.appendChild(group);
      }
      measure();
    };
    const tick = now => {
      raf = 0;
      if (!active()) return;
      const elapsed = lastTime ? Math.min(now - lastTime, 64) : 0;
      lastTime = now;
      if (loopWidth && !document.hidden && !held && !hovered && now >= resumeAt && !viewport.contains(document.activeElement)) {
        offset = (offset + 16 * elapsed / 1000) % loopWidth;
        viewport.scrollLeft = offset;
      }
      raf = requestAnimationFrame(tick);
    };
    const syncMode = () => {
      cancelAnimationFrame(raf); raf = 0; lastTime = 0;
      section.dataset.avMobileTicker = active() ? '1' : '0';
      if (active()) { measure(); raf = requestAnimationFrame(tick); }
    };
    const pause = () => { resumeAt = performance.now() + 5000; };
    viewport.addEventListener('pointerdown', () => { held = true; pause(); }, { passive: true });
    const release = () => { if (held) { held = false; pause(); } };
    window.addEventListener('pointerup', release, { passive: true });
    window.addEventListener('pointercancel', release, { passive: true });
    viewport.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') hovered = true; });
    viewport.addEventListener('pointerleave', () => { hovered = false; });
    viewport.addEventListener('wheel', pause, { passive: true });
    viewport.addEventListener('focusin', pause);
    viewport.addEventListener('focusout', pause);
    viewport.addEventListener('scroll', () => {
      if (held || performance.now() < resumeAt) offset = viewport.scrollLeft;
      if (loopWidth && viewport.scrollLeft >= loopWidth) {
        offset = viewport.scrollLeft % loopWidth;
        viewport.scrollLeft = offset;
      }
    }, { passive: true });
    new MutationObserver(rebuild).observe(source, { childList: true });
    section.addEventListener('astrovip:cases-expanded', rebuild);
    new ResizeObserver(measure).observe(viewport);
    mobile.addEventListener('change', syncMode);
    reduced.addEventListener('change', syncMode);
    rebuild(); syncMode();
    return true;
  };
  const boot = () => {
    if (install()) return;
    const observer = new MutationObserver(() => { if (install()) observer.disconnect(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 15000);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
