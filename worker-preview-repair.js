import app from './worker-home-ultra.js';

const replacements = [
  ['PROGRAMEAZ─é CONSULTA╚ÜIA Ôćĺ','PROGRAMEAZĂ CONSULTAȚIA →'],
  ['CONSULTA╚ÜIE PREMIUM ┬Ě 60 MIN','CONSULTAȚIE PREMIUM · 60 MIN'],
  ['Plat─â securizat─â cu cardul','Plată securizată cu cardul'],
  ['500 lei ┬Ě procesare securizat─â prin Stripe','500 lei · procesare securizată prin Stripe'],
  ['PL─éTE╚śTE CU CARDUL ┬Ě 500 LEI Ôćĺ','PLĂTEȘTE CU CARDUL · 500 LEI →'],
  ['Pl─âte╚Öte consulta╚Ťia AstroVip cu cardul, 500 lei','Plătește consultația AstroVip cu cardul, 500 lei'],
  ['Plat─â consulta╚Ťie AstroVip','Plată consultație AstroVip'],
  ['ÔÇ╣','‹'],['ÔÇŽ','…'],['ÔÇ║','›'],['urm─âtor','următor']
];

const MOBILE_PAYMENT = `<style id="av-mobile-payment-preview">#av-mobile-pay-direct{display:none}@media(max-width:820px){#av-mobile-pay-direct{display:block!important;margin:12px 12px 20px;padding:14px;border:1px solid rgba(231,198,106,.52);border-radius:18px;background:linear-gradient(145deg,#0b130d,#040605);box-shadow:0 16px 38px rgba(0,0,0,.34);text-align:center}#av-mobile-pay-direct span{display:block;margin-bottom:9px;color:#f6e5aa;font:800 13px/1.25 Inter,system-ui,sans-serif}#av-mobile-pay-direct a{display:flex!important;align-items:center;justify-content:center;width:100%;min-height:56px;padding:13px 12px;box-sizing:border-box;border:1px solid #f7dc80;border-radius:999px;background:linear-gradient(180deg,#fff2ac,#e3c35f 52%,#b5852c);color:#171006!important;text-decoration:none!important;font:950 13px/1.15 Inter,system-ui,sans-serif;box-shadow:0 10px 30px rgba(216,174,72,.20)}}</style>`;
const DIRECT_CTA = `<div id="av-mobile-pay-direct" aria-label="Plată consultație AstroVip"><span>CONSULTAȚIE PREMIUM · 60 MIN · 500 LEI</span><a href="https://buy.stripe.com/4gMeVcbz75J207y6fefjG00" aria-label="Plătește consultația AstroVip cu cardul, 500 lei">PLĂTEȘTE CU CARDUL · 500 LEI →</a></div>`;

const CASE_MIDPOINT_SYNC = `<style id="av-case-midpoint-measured-preview">
@media(max-width:820px){
  #studii-de-caz-home{overflow:visible!important}
  #studii-de-caz-home .av-case-showcase-frame{box-sizing:border-box!important;padding:0!important;border:0!important;overflow:visible!important}
  #studii-de-caz-home .av-case-showcase-grid{box-sizing:border-box!important;display:flex!important;gap:0!important;padding:0!important;margin:0!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-padding-inline:0!important;scroll-snap-type:x mandatory!important}
  #studii-de-caz-home .av-case-showcase-card{box-sizing:border-box!important;display:grid!important;flex:none!important;margin:0!important;border-radius:18px!important;overflow:hidden!important;scroll-snap-align:start!important}
  #studii-de-caz-home .av-case-showcase-visual{box-sizing:border-box!important;grid-column:1!important;grid-row:1!important;position:relative!important;inset:auto!important;min-width:0!important;max-width:none!important;margin:0!important;aspect-ratio:auto!important;overflow:hidden!important}
  #studii-de-caz-home .av-case-showcase-copy{box-sizing:border-box!important;grid-column:2!important;grid-row:1!important;position:relative!important;inset:auto!important;min-width:0!important;max-width:none!important;margin:0!important;overflow:hidden!important}
  #studii-de-caz-home .av-case-showcase-visual>a,#studii-de-caz-home .av-case-showcase-visual img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
}
</style><script id="av-case-midpoint-measured-preview-js">(()=>{const imp=(el,p,v)=>{if(el)el.style.setProperty(p,v,'important')};let raf=0;const sync=()=>{raf=0;if(innerWidth>820)return;const s=document.getElementById('studii-de-caz-home');const frame=s?.querySelector('.av-case-showcase-frame');const track=s?.querySelector('.av-case-showcase-grid');const cards=track?[...track.querySelectorAll('.av-case-showcase-card')]:[];const mid=document.querySelector('#astrovip-puncte-mijlocii .av-midpoint-slide');const art=mid?.querySelector('.av-midpoint-art');const copy=mid?.querySelector('.av-midpoint-copy');if(!s||!frame||!track||!cards.length||!mid||!art||!copy)return;const mr=mid.getBoundingClientRect(),ar=art.getBoundingClientRect(),pr=copy.getBoundingClientRect();if(mr.width<100||mr.height<100||ar.width<40||pr.width<80)return;const w=mr.width,h=mr.height,innerH=Math.max(ar.height,pr.height),artW=ar.width;imp(frame,'width',w+'px');imp(frame,'max-width','none');imp(frame,'position','relative');imp(frame,'left','50%');imp(frame,'transform','translateX(-50%)');imp(frame,'margin-left','0');imp(frame,'margin-right','0');imp(frame,'padding','0');imp(frame,'border','0');imp(track,'width',w+'px');imp(track,'height',h+'px');imp(track,'min-height',h+'px');imp(track,'max-height',h+'px');imp(track,'gap','0px');imp(track,'padding','0px');imp(track,'scroll-padding-inline','0px');imp(track,'align-items','stretch');cards.forEach(card=>{imp(card,'display','grid');imp(card,'grid-template-columns',artW+'px minmax(0,1fr)');imp(card,'grid-template-rows',innerH+'px');imp(card,'flex','0 0 '+w+'px');imp(card,'width',w+'px');imp(card,'min-width',w+'px');imp(card,'max-width',w+'px');imp(card,'height',h+'px');imp(card,'min-height',h+'px');imp(card,'max-height',h+'px');imp(card,'scroll-snap-align','start');const v=card.querySelector('.av-case-showcase-visual');const c=card.querySelector('.av-case-showcase-copy');imp(v,'grid-column','1');imp(v,'grid-row','1');imp(v,'width','auto');imp(v,'min-width','0');imp(v,'max-width','none');imp(v,'height',innerH+'px');imp(v,'min-height',innerH+'px');imp(v,'max-height',innerH+'px');imp(c,'grid-column','2');imp(c,'grid-row','1');imp(c,'width','auto');imp(c,'min-width','0');imp(c,'max-width','none');imp(c,'height',innerH+'px');imp(c,'min-height',innerH+'px');imp(c,'max-height',innerH+'px');const mcs=getComputedStyle(copy);imp(c,'padding-top',mcs.paddingTop);imp(c,'padding-right',mcs.paddingRight);imp(c,'padding-bottom',mcs.paddingBottom);imp(c,'padding-left',mcs.paddingLeft);imp(c,'justify-content',mcs.justifyContent||'center')});};const queue=()=>{if(raf)return;raf=requestAnimationFrame(sync)};const boot=()=>{sync();[80,220,600,1200,2000].forEach(d=>setTimeout(sync,d));new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('resize',queue,{passive:true})};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot()})();</script>`;

function repair(text){
  for (const [bad, good] of replacements) text = text.split(bad).join(good);
  if (!text.includes('id="av-mobile-payment-preview"')) text = text.replace('</head>', MOBILE_PAYMENT + '</head>');
  if (!text.includes('id="av-case-midpoint-measured-preview"')) text = text.replace('</body>', CASE_MIDPOINT_SYNC + '</body>');
  if (!text.includes('id="av-mobile-pay-direct"')) {
    const heroEnd = /<\/section>/i;
    if (heroEnd.test(text)) text = text.replace(heroEnd, m => m + DIRECT_CTA);
    else text = text.replace(/<body([^>]*)>/i, '<body$1>' + DIRECT_CTA);
  }
  return text;
}

export default {
  async fetch(request, env, ctx){
    const response = await app.fetch(request, env, ctx);
    const path = new URL(request.url).pathname;
    if (path !== '/' && path !== '/index.html') return response;
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(repair(await response.text()), {status: response.status, statusText: response.statusText, headers});
  }
};