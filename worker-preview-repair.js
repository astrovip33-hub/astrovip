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

const ENTITY_GRAPH = `<script type="application/ld+json" id="astrovip-entity-graph-preview">${JSON.stringify({
  '@context':'https://schema.org',
  '@graph':[
    {
      '@type':'ProfilePage',
      '@id':'https://astrovip.ro/despre-astrovip/#profile',
      url:'https://astrovip.ro/despre-astrovip/',
      name:'Cătălin Smaranda – astrolog și fondator AstroVip',
      description:'Profil profesional: astrolog, fondator AstroVip, licențiat în Psihologie și autor al metodologiei și studiilor de caz AstroVip.',
      inLanguage:'ro-RO',
      dateCreated:'2026-09-23T20:16:23+03:00',
      dateModified:'2026-10-27T00:00:00+02:00',
      isPartOf:{'@id':'https://astrovip.ro/#website'},
      mainEntity:{'@id':'https://astrovip.ro/despre-astrovip/#catalin-smaranda'},
      about:{'@id':'https://astrovip.ro/despre-astrovip/#catalin-smaranda'},
      primaryImageOfPage:{'@id':'https://astrovip.ro/#logo'}
    },
    {
      '@type':'WebSite',
      '@id':'https://astrovip.ro/#website',
      url:'https://astrovip.ro/',
      name:'AstroVip',
      inLanguage:'ro-RO',
      publisher:{'@id':'https://astrovip.ro/#organization'}
    },
    {
      '@type':'Organization',
      '@id':'https://astrovip.ro/#organization',
      name:'AstroVip',
      alternateName:['AstroVip România','AstroVip.ro'],
      url:'https://astrovip.ro/',
      founder:{'@id':'https://astrovip.ro/despre-astrovip/#catalin-smaranda'},
      logo:{'@type':'ImageObject','@id':'https://astrovip.ro/#logo',url:'https://astrovip.ro/assets/1000043152.png'},
      sameAs:[
        'https://www.google.com/maps?cid=15612666586801751925',
        'https://www.instagram.com/astrovip333/',
        'https://www.tiktok.com/@astrovip333'
      ],
      identifier:{'@type':'PropertyValue',propertyID:'canonical domain',value:'astrovip.ro'},
      disambiguatingDescription:'AstroVip este proiectul românesc de la astrovip.ro, cu activitate în București și online, distinct de alte proiecte internaționale cu denumiri similare.'
    },
    {
      '@type':'Person',
      '@id':'https://astrovip.ro/despre-astrovip/#catalin-smaranda',
      name:'Cătălin Smaranda',
      url:'https://astrovip.ro/despre-astrovip/',
      jobTitle:'Astrolog',
      description:'Astrolog și fondator AstroVip, licențiat în Psihologie, cu peste 33 de ani de experiență declarată în studiul astrologiei și numerologiei.',
      image:{'@id':'https://astrovip.ro/#logo'},
      worksFor:{'@id':'https://astrovip.ro/#organization'},
      mainEntityOfPage:{'@id':'https://astrovip.ro/despre-astrovip/#profile'},
      sameAs:[
        'https://www.instagram.com/astrovip333/',
        'https://www.tiktok.com/@astrovip333',
        'https://ro.linkedin.com/in/catalin-smaranda-825b5929b'
      ],
      knowsAbout:[
        'Astrologie',
        'Astrologie natală',
        'Astrologie predictivă',
        'Numerologie',
        'Astrocartografie',
        'Local Space',
        'Relocare astrologică',
        'Arce Solare',
        'Tranzite astrologice',
        'Progresii secundare',
        'Revoluție Solară',
        'Sinastrie',
        'Puncte mijlocii',
        'Rectificarea orei de naștere'
      ],
      subjectOf:[
        {'@type':'WebPage','@id':'https://astrovip.ro/presa/#webpage',url:'https://astrovip.ro/presa/'},
        {'@type':'WebPage',url:'https://astrovip.ro/research/'}
      ]
    }
  ]
})}</script>`;

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

function repairEntitySchema(text){
  let replaced=false;
  text=text.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, block=>{
    if(!replaced && block.includes('https://astrovip.ro/despre-astrovip/#profile') && block.includes('https://astrovip.ro/despre-astrovip/#catalin-smaranda')){
      replaced=true;
      return ENTITY_GRAPH;
    }
    return block;
  });
  if(!replaced) text=text.replace('</head>', ENTITY_GRAPH+'</head>');
  return text;
}

export default {
  async fetch(request, env, ctx){
    const response = await app.fetch(request, env, ctx);
    const path = new URL(request.url).pathname;
    const type = response.headers.get('content-type') || '';
    if (!type.includes('text/html')) return response;
    if (path !== '/' && path !== '/index.html' && path !== '/despre-astrovip/' && path !== '/despre-astrovip/index.html') return response;
    const headers = new Headers(response.headers);
    headers.delete('content-length');
    const source=await response.text();
    const body=(path === '/despre-astrovip/' || path === '/despre-astrovip/index.html') ? repairEntitySchema(source) : repair(source);
    return new Response(body, {status: response.status, statusText: response.statusText, headers});
  }
};
