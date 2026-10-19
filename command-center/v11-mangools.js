(() => {
  'use strict';
  const CARD_ID = 'av-v11-mangools';
  const SNAPSHOT_URL = '/assets/v11-mangools.json';
  let lastData = null;

  const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch] || ch));
  const pair = x => x ? `${Number(x.remaining || 0)}/${Number(x.limit || 0)}` : '-';
  const pct = x => x && Number(x.limit) ? Math.round((Number(x.remaining || 0) / Number(x.limit)) * 100) : 0;

  function setV11Branding() {
    document.title = 'AstroVip Commander Center V11';
    document.querySelectorAll('.title').forEach(node => {
      if (/OPERATIONS CENTER/i.test(node.textContent || '')) node.textContent = 'COMMANDER CENTER V11';
    });
    document.querySelectorAll('.top .mut').forEach(node => {
      if (/V9|control|SEO/i.test(node.textContent || '')) node.textContent = 'V11 · Intelligence · SEO · AI/GEO · Operations · Revenue · QA';
    });
    const loginTitle = document.querySelector('#lock .title');
    if (loginTitle) loginTitle.textContent = 'COMMANDER CENTER V11';
  }

  function ensureCommandChip() {
    const chips = document.querySelector('.chips');
    if (!chips || document.getElementById('mgCommandChip')) return;
    const button = document.createElement('button');
    button.id = 'mgCommandChip';
    button.className = 'chip';
    button.type = 'button';
    button.textContent = 'Mangools V11';
    button.addEventListener('click', () => {
      const command = document.getElementById('command');
      if (command) command.value = 'verifica Mangools';
      refreshMangools(true);
    });
    chips.appendChild(button);
  }

  function ensureCard() {
    if (document.getElementById(CARD_ID)) return;
    const grid = document.querySelector('main.grid');
    if (!grid) return;
    const card = document.createElement('section');
    card.id = CARD_ID;
    card.className = 'card exec gold s6';
    card.innerHTML = `
      <div class="sec"><b>MANGOOLS MCP · V11 INTELLIGENCE</b><span id="mgBadge" class="badge warn">SYNC</span></div>
      <div class="kpi four">
        <div><small>Plan</small><strong id="mgPlan">-</strong></div>
        <div><small>KW lookups</small><strong id="mgKw">-</strong></div>
        <div><small>SERP lookups</small><strong id="mgSerp">-</strong></div>
        <div><small>Bonus MCP</small><strong id="mgBonus">-</strong></div>
      </div>
      <div class="list" id="mgDetails"><div class="mut">Se incarca feed-ul Mangools...</div></div>
      <div class="card-actions">
        <button class="btn primary" type="button" id="mgRefresh">Reincarca feed V11</button>
        <a class="btn" href="https://mangools.com/" target="_blank" rel="noopener">Mangools</a>
      </div>
      <p class="mut" id="mgMeta" style="margin:10px 0 0">Snapshot MCP local pentru Commander Center; citirea lui nu consuma lookup-uri.</p>`;
    const seo = [...grid.querySelectorAll('section.card')].find(x => /SEO WAR ROOM/i.test(x.querySelector('.sec b')?.textContent || ''));
    if (seo?.nextSibling) grid.insertBefore(card, seo.nextSibling);
    else grid.appendChild(card);
    document.getElementById('mgRefresh')?.addEventListener('click', () => refreshMangools(true));
  }

  function render(data) {
    lastData = data;
    const q = data?.quota || {};
    const kw = q.keywordLookups;
    const serp = q.serpLookups;
    const bkw = q.permanentKeywordCredits;
    const bserp = q.permanentSerpCredits;
    const links = q.linkRows;
    const rank = q.onDemandRankScans;
    const ai = q.aiPresence;
    const totalBonus = Number(bkw?.remaining || 0) + Number(bserp?.remaining || 0);
    const totalBonusLimit = Number(bkw?.limit || 0) + Number(bserp?.limit || 0);
    const plan = String(data?.plan || 'unknown').toUpperCase();

    const planEl = document.getElementById('mgPlan');
    const kwEl = document.getElementById('mgKw');
    const serpEl = document.getElementById('mgSerp');
    const bonusEl = document.getElementById('mgBonus');
    if (planEl) planEl.textContent = plan;
    if (kwEl) kwEl.textContent = pair(kw);
    if (serpEl) serpEl.textContent = pair(serp);
    if (bonusEl) bonusEl.textContent = `${totalBonus}/${totalBonusLimit}`;

    const details = document.getElementById('mgDetails');
    if (details) details.innerHTML = `
      <div class="row"><span>KWFinder / Related Keywords</span><span class="v">${pair(kw)} · ${pct(kw)}%</span></div>
      <div class="row"><span>SERP lookups</span><span class="v">${pair(serp)} · ${pct(serp)}%</span></div>
      <div class="row"><span>Permanent MCP credits</span><span class="v">KW ${pair(bkw)} · SERP ${pair(bserp)}</span></div>
      <div class="row"><span>LinkMiner rows</span><span class="v">${pair(links)}</span></div>
      <div class="row"><span>On-demand rank scans</span><span class="v">${pair(rank)}</span></div>
      <div class="row"><span>AI Presence</span><span class="v">${pair(ai)}</span></div>`;

    const badge = document.getElementById('mgBadge');
    if (badge) {
      badge.className = 'badge';
      badge.textContent = 'MCP READY';
    }
    const meta = document.getElementById('mgMeta');
    if (meta) meta.textContent = `Sincronizat: ${data?.syncedAt ? new Date(data.syncedAt).toLocaleString('ro-RO') : '-'} · ${Array.isArray(data?.capabilities) ? data.capabilities.join(' + ') : 'Mangools'}`;
    window.dispatchEvent(new CustomEvent('avcc:mangools-ready', { detail: data }));
  }

  async function refreshMangools(loud = false) {
    ensureCard();
    const badge = document.getElementById('mgBadge');
    if (badge) { badge.className = 'badge warn'; badge.textContent = 'SYNC'; }
    try {
      const response = await fetch(`${SNAPSHOT_URL}?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Mangools feed HTTP ${response.status}`);
      const data = await response.json();
      if (!data || data.provider !== 'Mangools MCP' || !data.quota) throw new Error('Mangools feed invalid');
      render(data);
      if (loud && typeof window.toast === 'function') window.toast('Mangools V11 actualizat');
      if (loud && typeof window.logAction === 'function') window.logAction('seo', 'Mangools V11 actualizat');
      return data;
    } catch (error) {
      if (badge) { badge.className = 'badge red'; badge.textContent = 'EROARE'; }
      const details = document.getElementById('mgDetails');
      if (details) details.innerHTML = `<div class="alert bad">${esc(error?.message || error)}</div>`;
      if (loud && typeof window.toast === 'function') window.toast(String(error?.message || error));
      throw error;
    }
  }

  function hookOperator() {
    const original = window.runOperator;
    if (typeof original !== 'function' || original.__v11MangoolsWrapped) return;
    const wrapped = async function() {
      const raw = document.getElementById('command')?.value?.trim() || '';
      const q = raw.toLowerCase();
      if (q.includes('mangools') || q.includes('kwfinder') || q.includes('linkminer') || q.includes('serpwatcher')) {
        if (typeof window.logAction === 'function') window.logAction('operator', raw);
        return refreshMangools(true);
      }
      return original.apply(this, arguments);
    };
    wrapped.__v11MangoolsWrapped = true;
    window.runOperator = wrapped;
  }

  function exposeState() {
    window.avV11 = window.avV11 || {};
    window.avV11.mangools = {
      refresh: refreshMangools,
      get data() { return lastData; },
      snapshotUrl: SNAPSHOT_URL
    };
  }

  function boot() {
    setV11Branding();
    ensureCommandChip();
    ensureCard();
    hookOperator();
    exposeState();
    refreshMangools(false).catch(() => {});
  }

  addEventListener('avcc:authenticated', () => refreshMangools(false).catch(() => {}));
  addEventListener('avcc:refresh', () => refreshMangools(false).catch(() => {}));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
