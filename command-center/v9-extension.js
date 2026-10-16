(() => {
  const MARK = 'av-v9-platform';
  const endpoints = [
    ['Premium Runtime', '/assets/premium-v9/main.js'],
    ['Swiss Worker', '/assets/premium-v9/astro-worker.js'],
    ['PWA', '/manifest.webmanifest'],
    ['Calculator', '/calculator/'],
    ['Client Portal', '/client/'],
    ['Service Worker', '/sw.js']
  ];

  function esc(value) {
    return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch] || ch));
  }

  async function check(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}health=${Date.now()}`, { cache: 'no-store', signal: controller.signal });
      return { ok: response.ok, status: response.status };
    } catch (error) {
      return { ok: false, status: 0, error: String(error?.message || error) };
    } finally { clearTimeout(timer); }
  }

  let refreshing = null;
  async function refreshV9() {
    if (!sessionStorage.getItem('avcc_v3_token')) return;
    if (refreshing) return refreshing;
    refreshing = runChecks().finally(() => { refreshing = null; });
    return refreshing;
  }

  async function runChecks() {
    const badge = document.querySelector('#avV9Badge');
    const target = document.querySelector('#avV9Health');
    if (!target) return;
    if (badge) { badge.textContent = 'VERIFICARE'; badge.className = 'badge warn'; }
    target.innerHTML = '<div><b>Verific runtime-ul V9…</b><span>Cloudflare assets + aplicații</span></div>';
    const results = await Promise.all(endpoints.map(async ([name, url]) => ({ name, url, ...(await check(url)) })));
    const good = results.filter(x => x.ok).length;
    target.innerHTML = results.map(item => `<div><b>${esc(item.name)}</b><span class="${item.ok ? 'good' : 'bad'}">${item.ok ? `LIVE · HTTP ${item.status}` : `EROARE · ${item.status || 'network'}`}</span></div>`).join('');
    if (badge) {
      badge.textContent = `${good}/${results.length} LIVE`;
      badge.className = good === results.length ? 'badge' : (good >= results.length - 1 ? 'badge warn' : 'badge red');
    }
  }

  function boot() {
    if (document.getElementById(MARK)) return;
    document.title = document.title.replace(/V8/g, 'V9');
    document.querySelectorAll('.title').forEach(node => {
      if (/OPERATIONS CENTER V8/i.test(node.textContent || '')) node.textContent = 'OPERATIONS CENTER V9';
    });
    document.querySelectorAll('.top .mut').forEach(node => {
      if (/V8/i.test(node.textContent || '')) node.textContent = (node.textContent || '').replace(/V8/g, 'V9').replace('recovery · autopilot · revenue · alerts', 'recovery · autopilot · premium platform · AI · experiments · vitals');
    });

    const grid = document.querySelector('main.grid');
    if (!grid) return;
    const card = document.createElement('section');
    card.id = MARK;
    card.className = 'card full exec gold';
    card.innerHTML = `
      <div class="sec"><b>PREMIUM PLATFORM V9</b><span id="avV9Badge" class="badge warn">VERIFICARE</span></div>
      <div class="kpi four">
        <div><small>Frontend</small><strong>GSAP + WebGL</strong></div>
        <div><small>Data/Auth</small><strong>Supabase</strong></div>
        <div><small>Astrology</small><strong>Swiss + Worker</strong></div>
        <div><small>Experience</small><strong>PWA + AI/RAG</strong></div>
      </div>
      <div id="avV9Health" class="health" style="margin-top:10px"><div><b>Inițializare…</b><span>Verific infrastructura Premium V9</span></div></div>
      <div class="card-actions">
        <button class="btn primary" type="button" id="avV9Refresh">Verifică V9</button>
        <a class="btn" href="/calculator/" target="_blank" rel="noopener">Calculator</a>
        <a class="btn" href="/client/" target="_blank" rel="noopener">Client Portal</a>
        <a class="btn" href="https://astrovip-v9-preview.astrovip33.workers.dev/" target="_blank" rel="noopener">Preview V9</a>
      </div>
      <p class="mut" style="margin:12px 0 0">Aceste verificări confirmă disponibilitatea fișierelor și paginilor. Autentificarea, calculele și API-urile se verifică separat în Conexiuni și în testele funcționale.</p>`;

    const hero = grid.querySelector('.hero');
    if (hero?.nextSibling) grid.insertBefore(card, hero.nextSibling.nextSibling || hero.nextSibling);
    else grid.prepend(card);
    document.querySelector('#avV9Refresh')?.addEventListener('click', refreshV9);
    if (sessionStorage.getItem('avcc_v3_token')) refreshV9();
  }

  window.avV9Refresh = refreshV9;
  addEventListener('avcc:refresh', refreshV9);
  addEventListener('avcc:session-ended', () => {
    const badge = document.getElementById('avV9Badge');
    if (badge) { badge.textContent = 'NEAUTENTIFICAT'; badge.className = 'badge warn'; }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
