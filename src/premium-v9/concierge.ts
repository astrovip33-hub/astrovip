import { searchKnowledge, track } from './data';

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, ch => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[ch] || ch));
}

export function initConcierge() {
  if (document.getElementById('av-concierge')) return;
  const root = document.createElement('aside');
  root.id = 'av-concierge';
  root.className = 'av-concierge';
  root.innerHTML = `
    <button class="av-concierge-toggle" type="button" aria-expanded="false" aria-controls="av-concierge-panel">✦ <span>AstroVip AI</span></button>
    <section id="av-concierge-panel" class="av-concierge-panel" hidden aria-label="AstroVip AI Concierge">
      <header><strong>AstroVip Concierge</strong><button type="button" class="av-concierge-close" aria-label="Închide">×</button></header>
      <p class="av-concierge-lead">Caută instant în baza AstroVip: servicii, tehnici, relocare, hartă natală, Solar Arcs și studii de caz.</p>
      <form class="av-concierge-form">
        <input name="q" autocomplete="off" maxlength="180" placeholder="Ex: Cum mă ajută astrologia relocării?" required>
        <button type="submit">Caută</button>
      </form>
      <div class="av-concierge-results" aria-live="polite"></div>
      <small>Răspunsurile afișate sunt extrase din conținutul public AstroVip.</small>
    </section>`;
  document.body.append(root);

  const toggle = root.querySelector<HTMLButtonElement>('.av-concierge-toggle')!;
  const panel = root.querySelector<HTMLElement>('.av-concierge-panel')!;
  const close = root.querySelector<HTMLButtonElement>('.av-concierge-close')!;
  const form = root.querySelector<HTMLFormElement>('.av-concierge-form')!;
  const results = root.querySelector<HTMLElement>('.av-concierge-results')!;

  const setOpen = (open: boolean) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) (form.elements.namedItem('q') as HTMLInputElement)?.focus();
  };
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const q = String(new FormData(form).get('q') || '').trim();
    if (q.length < 2) return;
    results.innerHTML = '<div class="av-loading">Caut în baza AstroVip…</div>';
    track('concierge_search', { qLength: q.length });
    try {
      const rows = await searchKnowledge(q);
      if (!rows.length) {
        results.innerHTML = '<div class="av-empty">Nu am găsit încă un fragment suficient de relevant. Încearcă o formulare mai scurtă.</div>';
        return;
      }
      results.innerHTML = rows.map((row: any) => `
        <article class="av-ai-result">
          <strong>${escapeHtml(String(row.title || 'AstroVip'))}</strong>
          <p>${escapeHtml(String(row.content || '').slice(0, 430))}</p>
          ${row.url ? `<a href="${escapeHtml(String(row.url))}">Deschide sursa →</a>` : ''}
        </article>`).join('');
    } catch {
      results.innerHTML = '<div class="av-empty">Serviciul de căutare este momentan indisponibil.</div>';
    }
  });
}
