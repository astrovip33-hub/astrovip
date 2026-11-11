import { track } from './data';

type Payload = { chart?: any; input?: Record<string, unknown>; createdAt?: string };
const signs = ['Berbec','Taur','Gemeni','Rac','Leu','Fecioară','Balanță','Scorpion','Săgetător','Capricorn','Vărsător','Pești'];

function esc(value: unknown) {
  return String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch] || ch));
}
function deg(value: unknown) {
  const n=((Number(value)%360)+360)%360; const sign=Math.floor(n/30); const d=Math.floor(n%30); const m=Math.floor(((n%30)-d)*60);
  return `${d}°${String(m).padStart(2,'0')}′ ${signs[sign]}`;
}
function load(): Payload | null {
  try { return JSON.parse(sessionStorage.getItem('av_report_payload') || 'null'); } catch { return null; }
}
function render(payload: Payload) {
  const chart = payload.chart;
  const input = payload.input || {};
  const target = document.querySelector<HTMLElement>('#report-content');
  if (!target || !chart) return;
  target.innerHTML = `
    <section class="r-head">
      <div><div class="r-kicker">ASTROVIP · RAPORT PERSONAL</div><h1>Hartă natală · Swiss Ephemeris</h1><p>Document generat din motorul interactiv AstroVip. Zodiac tropical · case Koch.</p></div>
      <div class="r-mark">AV</div>
    </section>
    <section class="r-meta">
      <div><span>Data</span><strong>${esc(input.date)}</strong></div>
      <div><span>Ora locală</span><strong>${esc(input.time)} ${esc(input.utcOffset)}</strong></div>
      <div><span>Loc</span><strong>${esc(input.place || '—')}</strong></div>
      <div><span>Coordonate</span><strong>${esc(input.lat)}, ${esc(input.lon)}</strong></div>
    </section>
    <section class="r-grid">
      <article><h2>Poziții planetare</h2>${(chart.planets || []).map((p:any)=>`<div class="r-row"><b>${esc(p.glyph || '')} ${esc(p.label)}</b><span>${esc(deg(p.longitude))}${p.retrograde?' ℞':''}</span></div>`).join('')}</article>
      <article><h2>Cuspide Koch</h2>${(chart.cusps || []).map((v:any,i:number)=>`<div class="r-row"><b>Casa ${i+1}</b><span>${esc(deg(v))}</span></div>`).join('')}</article>
    </section>
    <section class="r-note"><strong>Notă metodologică</strong><p>Acest document conține rezultate de calcul astrologic. Interpretarea profesională presupune corelarea pozițiilor, caselor, axelor și aspectelor într-o analiză coerentă.</p></section>
    <footer>AstroVip · astrovip.ro · Premium Astrology Platform V9</footer>`;
}

function boot() {
  const payload = load();
  const empty = document.querySelector<HTMLElement>('#report-empty');
  const actions = document.querySelector<HTMLElement>('#report-actions');
  if (!payload?.chart) {
    empty?.removeAttribute('hidden');
    actions?.setAttribute('hidden','');
    return;
  }
  render(payload);
  empty?.setAttribute('hidden','');
  actions?.removeAttribute('hidden');
  document.querySelector('#print-report')?.addEventListener('click', () => {
    track('report_print_pdf');
    window.print();
  });
  track('report_view');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true}); else boot();
