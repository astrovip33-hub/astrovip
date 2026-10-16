import app from './worker-home-ultra.js';

const replacements = [
  ['PROGRAMEAZ─é CONSULTA╚ÜIA Ôćĺ','PROGRAMEAZĂ CONSULTAȚIA →'],
  ['CONSULTA╚ÜIE PREMIUM ┬Ě 60 MIN','CONSULTAȚIE PREMIUM · 60 MIN'],
  ['Plat─â securizat─â cu cardul','Plată securizată cu cardul'],
  ['500 lei ┬Ě procesare securizat─â prin Stripe','500 lei · procesare securizată prin Stripe'],
  ['PL─éTE╚śTE CU CARDUL ┬Ě 500 LEI Ôćĺ','PLĂTEȘTE CU CARDUL · 500 LEI →'],
  ['Pl─âte╚Öte consulta╚Ťia AstroVip cu cardul, 500 lei','Plătește consultația AstroVip cu cardul, 500 lei'],
  ['Plat─â consulta╚Ťie AstroVip','Plată consultație AstroVip'],
  ['ÔÇ╣','‹'],
  ['ÔÇŽ','…'],
  ['ÔÇ║','›'],
  ['urm─âtor','următor']
];

const MOBILE_PAYMENT = `<style id="av-mobile-payment-preview">@media(max-width:820px){#av-home-payment-cta{display:block!important;padding:12px 12px 16px!important}.av-home-paybar-inner{width:100%!important;display:grid!important;grid-template-columns:1fr!important;gap:12px!important;padding:16px!important;text-align:center!important}.av-home-paybar-inner>a{display:flex!important;width:100%!important;min-height:54px!important;padding:13px 14px!important;white-space:normal!important;text-align:center!important;font-size:13px!important}.av-home-paybar-inner>div{align-items:center!important}}</style>`;

function repair(text){
  for (const [bad, good] of replacements) text = text.split(bad).join(good);
  if (!text.includes('id="av-mobile-payment-preview"')) text = text.replace('</head>', MOBILE_PAYMENT + '</head>');
  return text;
}

export default {
  async fetch(request, env, ctx){
    const response = await app.fetch(request, env, ctx);
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(repair(await response.text()), {status: response.status, statusText: response.statusText, headers});
  }
};
