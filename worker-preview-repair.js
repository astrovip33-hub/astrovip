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

function repair(text){
  for (const [bad, good] of replacements) text = text.split(bad).join(good);
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
