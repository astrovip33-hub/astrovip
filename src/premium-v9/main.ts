import { loadFeatureFlags, track } from './data';
import { initExperiments } from './experiments';
import { initConcierge } from './concierge';
import { initMotion, initViewTransitions, initWebGLHero } from './visual';

function instrumentClicks() {
  document.addEventListener('click', (event) => {
    const element = (event.target as HTMLElement | null)?.closest?.('a,button') as HTMLElement | null;
    if (!element) return;
    const href = element instanceof HTMLAnchorElement ? element.href : '';
    const text = (element.textContent || '').trim().slice(0, 80);
    if (/wa\.me|whatsapp/i.test(href)) track('whatsapp_click', { href });
    else if (/stripe|checkout|plată|plateste|plătește/i.test(`${href} ${text}`)) track('checkout_start', { href, text });
    else if (/program|rezerv|booking/i.test(`${href} ${text}`)) track('booking_start', { href, text });
    else if (element.matches('[data-av-track]')) track(element.getAttribute('data-av-track') || 'ui_click', { text });
  }, { capture: true });
}

function registerPwa() {
  if (!('serviceWorker' in navigator) || location.protocol !== 'https:') return;
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {}), { once: true });
}

function addRuntimeBadge() {
  document.documentElement.classList.add('av-premium-v9');
  document.documentElement.dataset.avRuntime = '9';
}

async function boot() {
  addRuntimeBadge();
  const flags = await loadFeatureFlags();
  instrumentClicks();
  track('page_view_v9', { title: document.title, lang: document.documentElement.lang || 'ro' });

  if (flags.view_transitions !== false) initViewTransitions();
  initMotion();
  if (flags.webgl_hero !== false) initWebGLHero();
  if (flags.ab_testing !== false) initExperiments();
  if (flags.ai_concierge !== false) initConcierge();
  if (flags.pwa !== false) registerPwa();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
