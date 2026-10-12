import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const candidate = process.argv[2];
assert(candidate?.startsWith('https://'), 'Pass the deployed preview URL');
await mkdir('/tmp/approved-home-checks', { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [390, 820, 1363]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__approvedLayoutShifts = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__approvedLayoutShifts.push({
            value: entry.value,
            sources: entry.sources.map(source => ({
              tag: source.node?.tagName, id: source.node?.id,
              className: String(source.node?.className || '').slice(0, 160),
              before: source.previousRect, after: source.currentRect
            }))
          });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(candidate, { waitUntil: 'load', timeout: 90000 });
    const html = await response.text();
    assert(html.includes('astrovip-ultra-critical-v9-20261012'), 'Wrong Worker served');
    assert.equal((html.match(/id="av-mobile-approved-home"/g) || []).length, 1);
    assert.equal((html.match(/id="av-ultra-home"/g) || []).length, 1);
    assert(!html.includes('src="/assets/home-ultra-production-20261010-v4.js'), 'Old layout runtime remains');
    await page.waitForTimeout(2200);
    const shifts = await page.evaluate(() => window.__approvedLayoutShifts);
    console.log('INITIAL_LAYOUT_SHIFTS', width, JSON.stringify(shifts));
    const reject = page.getByRole('button', { name: 'Respinge opționale', exact: true });
    if (await reject.isVisible()) await reject.click();
    const mobile = width <= 820;
    const hero = page.locator(mobile ? '#av-mobile-approved-home' : 'section.av-pro-hero');
    await hero.waitFor({ state: 'visible' });
    await hero.locator('img').evaluate(image => image.complete ? Promise.resolve() : new Promise(resolve => image.addEventListener('load', resolve, { once: true })));
    assert(await hero.locator('img').evaluate(image => image.naturalWidth > 1), 'Hero image failed');
    assert(await page.locator(mobile ? '#av-ultra-home' : '#av-mobile-approved-home').isHidden(), 'Both layouts visible');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow');
    const shape = await hero.evaluate(element => {
      const r = element.getBoundingClientRect();
      const image = element.querySelector('img');
      return { x: r.x, y: r.y, width: r.width, height: r.height, image: image.currentSrc, imageWidth: image.naturalWidth, imageHeight: image.naturalHeight };
    });
    await page.screenshot({ path: `/tmp/approved-home-checks/preview-${width}.png`, fullPage: false });
    const menuButton = page.locator(mobile ? '#av-mobile-approved-header .avm-hamb' : '#hamb');
    await menuButton.click();
    const menu = page.getByRole('navigation', { name: 'Navigare principală' });
    assert(await menu.isVisible(), 'Menu did not open');
    if (mobile) assert.equal(await menuButton.getAttribute('aria-expanded'), 'true');
    await menu.getByRole('button', { name: 'Închide meniul', exact: true }).click();
    assert(await menu.isHidden(), 'Menu did not close');
    if (mobile) assert.equal(await menuButton.getAttribute('aria-expanded'), 'false');
    await hero.getByRole('link', { name: mobile ? 'PROGRAMEAZĂ CONSULTAȚIA →' : 'Programează consultația', exact: true }).click();
    const booking = page.getByRole('region', { name: 'Programează consultația Premium', exact: true });
    assert(await booking.isVisible(), 'Booking did not open');
    await booking.getByRole('button', { name: 'ALEGE DATA ȘI ORA →', exact: true }).click();
    assert(await booking.locator('input[type="date"]').isVisible(), 'Calendar step failed');
    assert.deepEqual(errors, [], 'Uncaught page errors');
    results.push({ width, shape, menu: 'open/close passed', booking: 'calendar passed', errors });
    await context.close();

    const noJsContext = await browser.newContext({ viewport: { width, height: 900 }, javaScriptEnabled: false });
    const noJsPage = await noJsContext.newPage();
    await noJsPage.goto(candidate, { waitUntil: 'load', timeout: 90000 });
    assert(await noJsPage.locator(mobile ? '#av-mobile-approved-home' : '#av-ultra-home').isVisible(), 'Approved layout still depends on JavaScript');
    await noJsContext.close();
  }
  await writeFile('/tmp/approved-home-checks/result.json', JSON.stringify(results, null, 2));
  console.log('APPROVED_HOME_PASS', JSON.stringify(results));
} finally {
  await browser.close();
}
