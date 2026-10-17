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

function repair(text){
  for (const [bad, good] of replacements) text = text.split(bad).join(good);
  if (!text.includes('id="av-mobile-payment-preview"')) text = text.replace('</head>', MOBILE_PAYMENT + '</head>');
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
