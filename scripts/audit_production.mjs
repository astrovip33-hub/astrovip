import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const base = 'https://astrovip.ro';
const headers = { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 AstroVipAudit/1.0' };
const output = '/tmp/astrovip-production-audit';
await mkdir(output, { recursive: true });
const stamp = process.env.GITHUB_SHA || Date.now();
const report = { pages: [], browsers: [], errors: [] };
const get = async path => {
  const url = new URL(path, base);
  url.searchParams.set('audit', stamp);
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  return response;
};

// Traverse the submitted sitemap, including all its curated public pages.
const pending = ['/sitemap.xml'];
const seen = new Set();
const pages = new Set();
while (pending.length) {
  const path = pending.pop();
  if (seen.has(path)) continue;
  seen.add(path);
  const xml = await (await get(path)).text();
  for (const match of xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)) {
    const url = new URL(match[1].trim());
    assert.equal(url.origin, base, 'Foreign URL in production sitemap');
    if (url.pathname.endsWith('.xml')) pending.push(url.pathname);
    else pages.add(url.href);
  }
}
const queue = [...pages];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    try {
      const response = await get(url);
      const html = await response.text();
      const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].find(m => /rel=["']canonical["']/i.test(m[0]))?.[0].match(/href=["']([^"']+)/i)?.[1];
      assert.equal(canonical, url, `${url}: incorrect canonical`);
      const robots = [...html.matchAll(/<meta\b[^>]*>/gi)].find(m => /name=["']robots["']/i.test(m[0]))?.[0] || '';
      assert(!/noindex/i.test(robots), `${url}: noindex in submitted sitemap`);
      assert(!/noindex/i.test(response.headers.get('x-robots-tag') || ''), `${url}: HTTP noindex`);
      report.pages.push({ url, status: response.status, canonical });
    } catch (error) { report.errors.push(String(error.message)); }
  }
}));
for (const path of ['/robots.txt', '/llms.txt', '/assets/ux-refresh-20261008.css', '/assets/premium-v9/main.js', '/assets/vendor/swisseph.wasm', '/command-center/editor/', '/command-center/site-builder/']) {
  await get(path);
}
for (const path of ['/api/command/ping', '/api/command/connections']) {
  const response = await fetch(base + path, { headers });
  assert.equal(response.status, 401, `${path}: administrative API must require authentication`);
}
for (const path of ['/package.json', '/worker-home-ultra.js', '/scripts/audit_site_assets.py']) {
  const response = await fetch(base + path, { headers });
  assert.equal(response.status, 404, `${path}: internal source must not be served`);
}

const executablePath = ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
assert(executablePath, 'Chrome executable missing');
const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
try {
  for (const width of [1366, 360, 390, 820]) {
    const page = await browser.newPage();
    await page.setUserAgent(headers['user-agent']);
    await page.setViewport({ width, height: 900 });
    await page.evaluateOnNewDocument(() => {
      window.__auditCLS = 0;
      window.__auditShifts = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) {
          window.__auditCLS += entry.value;
          window.__auditShifts.push({ value: entry.value, time: entry.startTime, nodes: entry.sources.map(s => ({node: s.node?.id || String(s.node?.className || '').slice(0, 80), before: s.previousRect, after: s.currentRect})) });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    const errors = [];
    const failedResources = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.url().startsWith(base + '/assets/') && response.status() >= 400) failedResources.push({ url: response.url(), status: response.status() });
    });
    await page.goto(`${base}/?audit_browser=${stamp}`, { waitUntil: 'networkidle2', timeout: 90000 });
    await new Promise(resolve => setTimeout(resolve, 1500));
    const state = await page.evaluate(() => {
      const mobile = innerWidth <= 820;
      const hero = document.querySelector(mobile ? '#av-mobile-approved-home' : 'section.av-pro-hero');
      const image = hero?.querySelector('img');
      const bar = document.getElementById('av-home-payment-cta');
      const nav = document.querySelector('#studii-de-caz-home .av-case-mobile-nav-v7');
      const cards = document.querySelectorAll('#studii-de-caz-home .av-case-showcase-grid .av-case-showcase-card');
      return {
        width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth + 1,
        heroVisible: !!hero && hero.getBoundingClientRect().height > 100,
        imageLoaded: !!image && image.complete && image.naturalWidth > 1,
        paymentVisible: !!bar && bar.getBoundingClientRect().height > 40,
        paymentLink: bar?.querySelector('a')?.href,
        mobilePaymentLink: document.querySelector('#av-mobile-approved-home .avm-primary')?.href,
        cards: cards.length, dots: nav?.querySelectorAll('[data-case-dots] button').length || 0,
        count: nav?.querySelector('[data-case-count]')?.textContent,
        cls: window.__auditCLS, shifts: window.__auditShifts,
        render: document.querySelector('meta[name="astrovip-home-render"]')?.content
      };
    });
    console.log('BROWSER_STATE', JSON.stringify(state));
    report.browsers.push({ ...state, errors, failedResources });
    assert.match(state.render || '', /^\d{8}-[a-z0-9-]+$/i, 'Production render marker missing or invalid');
    assert(!state.overflow, `${width}: horizontal overflow`);
    assert(state.heroVisible && state.imageLoaded, `${width}: hero missing`);
    assert(state.paymentVisible && state.paymentLink?.startsWith('https://buy.stripe.com/'), `${width}: payment missing`);
    if (width <= 820) {
      assert(state.mobilePaymentLink?.startsWith('https://buy.stripe.com/'), 'Mobile primary payment link missing');
      assert.equal(state.dots, state.cards, 'Slider navigation is out of sync with cards');
      assert(state.cards >= 3, 'Case studies missing');
    }
    assert.deepEqual(errors, [], 'Uncaught browser exceptions');
    assert.deepEqual(failedResources, [], 'Broken first-party resources');
    // Close the consent panel before testing navigation; no optional tracking is enabled.
    await page.evaluate(() => document.getElementById('av-consent-reject')?.click());
    await page.click(width <= 820 ? '#av-mobile-approved-header .avm-hamb' : '#hamb');
    assert(await page.$eval('#menu', menu => menu.getBoundingClientRect().height > 0 && !menu.inert), `${width}: menu did not open`);
    await page.keyboard.press('Escape');
    assert(await page.$eval('#menu', menu => !menu.classList.contains('open') && menu.getBoundingClientRect().height === 0), `${width}: menu did not close visually`);
    if (width <= 820) {
      await page.$eval('[data-case-dots] button:last-child', button => button.click());
      await page.waitForFunction(() => {
        const section = document.querySelector('#studii-de-caz-home');
        const track = section?.querySelector('.av-case-showcase-grid');
        const cards = track?.querySelectorAll('.av-case-showcase-card');
        const last = cards?.[cards.length - 1];
        if (!track || !last) return false;
        const t = track.getBoundingClientRect(), c = last.getBoundingClientRect();
        const centered = Math.abs((c.left + c.right - t.left - t.right) / 2) < 3;
        const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
        return (centered || atEnd) && section.querySelector('[data-case-count]')?.textContent === `${cards.length} / ${cards.length}`;
      }, { timeout: 5000 });
      const count = await page.$eval('[data-case-count]', node => node.textContent);
      assert.equal(count, `${state.cards} / ${state.cards}`, 'Last case study is unreachable');
    }
    await page.screenshot({ path: `${output}/production-${width}.png`, fullPage: false });
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
}
console.log('PRODUCTION_AUDIT', JSON.stringify({ pages: report.pages.length, browserWidths: report.browsers.map(r => r.width), errors: report.errors }));
assert.equal(report.errors.length, 0, 'Production page audit found errors');
