import { track } from './data';

export function initObservability() {
  addEventListener('error', event => {
    const target = event.target as HTMLElement | null;
    if (target && target !== window) {
      const url = (target as HTMLScriptElement).src || (target as HTMLLinkElement).href || (target as HTMLImageElement).src || '';
      track('asset_error', { tag: target.tagName, url: String(url).slice(0, 320) });
      return;
    }
    track('js_error', { message: String((event as ErrorEvent).message || 'error').slice(0, 300), file: String((event as ErrorEvent).filename || '').slice(0, 220) });
  }, true);

  addEventListener('unhandledrejection', event => {
    track('unhandled_rejection', { message: String((event as PromiseRejectionEvent).reason?.message || (event as PromiseRejectionEvent).reason || 'rejection').slice(0, 300) });
  });

  if (!('PerformanceObserver' in window)) return;
  let cls = 0;
  try {
    const po = new PerformanceObserver(list => {
      for (const entry of list.getEntries() as any[]) if (!entry.hadRecentInput) cls += Number(entry.value || 0);
    });
    po.observe({ type: 'layout-shift', buffered: true } as any);
  } catch {}
  try {
    const po = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lcp = entries.at(-1) as any;
      if (lcp) (window as any).__avLcp = Math.round(lcp.startTime);
    });
    po.observe({ type: 'largest-contentful-paint', buffered: true } as any);
  } catch {}
  try {
    const po = new PerformanceObserver(list => {
      const values = list.getEntries().map((entry: any) => Number(entry.duration || 0));
      if (values.length) (window as any).__avInp = Math.max(Number((window as any).__avInp || 0), ...values);
    });
    po.observe({ type: 'event', buffered: true, durationThreshold: 40 } as any);
  } catch {}

  addEventListener('pagehide', () => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    track('web_vitals', {
      lcp: Number((window as any).__avLcp || 0),
      cls: Number(cls.toFixed(4)),
      inp: Math.round(Number((window as any).__avInp || 0)),
      ttfb: nav ? Math.round(nav.responseStart) : 0
    });
  }, { once: true });
}
