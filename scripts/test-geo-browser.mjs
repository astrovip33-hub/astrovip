// Render the acquisition content with JavaScript disabled, as a basic crawler
// would see it. Keep the HTTP server and browser in the same test process.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('.');
const routes = ['consultatie-astrologica', 'sinastrie', 'harta-natala',
  'astrocartografie', 'relocare-geografica', 'numerologie'];
const types = { '.css': 'text/css', '.html': 'text/html', '.js': 'application/javascript', '.png': 'image/png' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const path = resolve(root, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
    if (!path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const body = await readFile(path);
    response.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' }).end(body);
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.route('**/*', route => route.request().url().startsWith(origin)
    ? route.continue() : route.abort());
  await mkdir('test-results/geo', { recursive: true });
  let checked = 0;
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      const response = await page.goto(`${origin}/${route}/`, { waitUntil: 'load' });
      assert.equal(response.status(), 200);
      const result = await page.evaluate(() => {
        const table = document.querySelector('.av-answer-table');
        const rect = table.getBoundingClientRect();
        const wrap = table.parentElement.getBoundingClientRect();
        return { h1: document.querySelectorAll('h1').length,
          visible: rect.width > 0 && rect.height > 0,
          fits: rect.left >= 0 && rect.right <= innerWidth + 1 && rect.width <= wrap.width + 1,
          cells: [...table.querySelectorAll('th,td')].every(cell => cell.scrollWidth <= cell.clientWidth + 1) };
      });
      assert.deepEqual(result, { h1: 1, visible: true, fits: true, cells: true }, `${route} at ${width}px`);
      await page.locator('.av-answer-table').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/geo/${route}-${width}.png` });
      checked++;
    }
  }
  console.log(`GEO browser checks: ${checked} page/viewport combinations passed; JavaScript disabled.`);
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
