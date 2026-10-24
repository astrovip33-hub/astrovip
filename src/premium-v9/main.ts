function runWhenIdle(task: () => void | Promise<void>, timeout = 2200) {
  const idle = (window as any).requestIdleCallback as ((cb: () => void, options?: { timeout: number }) => number) | undefined;
  if (typeof idle === 'function') idle(() => { void task(); }, { timeout });
  else window.setTimeout(() => { void task(); }, Math.min(timeout, 900));
}

function runAfterLoad(task: () => void | Promise<void>, timeout = 1800) {
  const schedule = () => runWhenIdle(task, timeout);
  if (document.readyState === 'complete') schedule();
  else addEventListener('load', schedule, { once: true });
}

function trackDeferred(eventName: string, properties: Record<string, unknown> = {}) {
  runWhenIdle(async () => {
    try {
      const { track } = await import('./data');
      await track(eventName, properties);
    } catch {
      // Tracking is progressive enhancement and must never delay interaction.
    }
  }, 1200);
}

function instrumentClicks() {
  document.addEventListener('click', (event) => {
    const element = (event.target as HTMLElement | null)?.closest?.('a,button') as HTMLElement | null;
    if (!element) return;
    const href = element instanceof HTMLAnchorElement ? element.href : '';
    const text = (element.textContent || '').trim().slice(0, 80);
    if (/wa\.me|whatsapp/i.test(href)) trackDeferred('whatsapp_click', { href });
    else if (/stripe|checkout|plată|plateste|plătește/i.test(`${href} ${text}`)) trackDeferred('checkout_start', { href, text });
    else if (/program|rezerv|booking/i.test(`${href} ${text}`)) trackDeferred('booking_start', { href, text });
    else if (element.matches('[data-av-track]')) trackDeferred(element.getAttribute('data-av-track') || 'ui_click', { text });
  }, { capture: true, passive: true });
}

function registerPwa() {
  if (!('serviceWorker' in navigator) || location.protocol !== 'https:') return;
  runWhenIdle(() => navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {}), 3000);
}

function addRuntimeBadge() {
  document.documentElement.classList.add('av-premium-v9');
  document.documentElement.dataset.avRuntime = '9';
}

function richVisualsAllowed() {
  const connection = (navigator as any).connection;
  const memory = Number((navigator as any).deviceMemory || 0);
  const cores = Number(navigator.hardwareConcurrency || 0);
  return innerWidth >= 821
    && !matchMedia('(prefers-reduced-motion: reduce)').matches
    && !connection?.saveData
    && (!memory || memory >= 4)
    && (!cores || cores >= 4);
}

async function bootDeferredEnhancements() {
  let flags: Record<string, boolean> = {};

  try {
    const data = await import('./data');
    flags = await data.loadFeatureFlags().catch(() => ({}));
    void data.track('page_view_v9', { title: document.title, lang: document.documentElement.lang || 'ro' });
  } catch {
    // Remote flags and first-party analytics must never block the page.
  }

  if (flags.pwa !== false) registerPwa();

  void import('./observability').then(({ initObservability }) => initObservability()).catch(() => {});

  const allowRichVisuals = richVisualsAllowed();
  const isHomepage = location.pathname === '/';
  if (flags.view_transitions !== false || flags.webgl_hero !== false || allowRichVisuals) {
    void import('./visual').then(({ initMotion, initViewTransitions, initWebGLHero }) => {
      if (flags.view_transitions !== false) initViewTransitions();
      // The homepage is already visually rich and fully painted. Avoid replaying motion
      // or loading the large Three.js/WebGL background there; both are progressive decoration.
      if (allowRichVisuals && !isHomepage) void initMotion().catch(() => {});
      if (flags.webgl_hero !== false && allowRichVisuals && !isHomepage) void initWebGLHero().catch(() => {});
    }).catch(() => {});
  }

  if (flags.ab_testing !== false) {
    void import('./experiments').then(({ initExperiments }) => initExperiments()).catch(() => {});
  }

  if (flags.ai_concierge !== false) {
    void import('./concierge').then(({ initConcierge }) => initConcierge()).catch(() => {});
  }
}

function boot() {
  addRuntimeBadge();
  instrumentClicks();

  // Keep the first paint/LCP path free of Supabase, experiments, AI and visual engines.
  runAfterLoad(bootDeferredEnhancements, 1800);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
