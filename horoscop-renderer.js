import './assets/vendor/astronomy-engine-2.1.19.min.js';
import {dailySnapshot, BODIES, SLUGS, positionLabel, bucharestDay, dailyCacheSeconds} from './assets/horoscop-core-20261021.mjs';

const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function horoscopeRoute(path) {
  return path==='/horoscop-azi/' || SLUGS.some(slug=>path==='/horoscop-azi/'+slug+'/');
}
let cached;
export function snapshotFor(now=new Date()) {
  const day=bucharestDay(now);
  if(!cached || cached.day!==day) cached=dailySnapshot(globalThis.Astronomy,now);
  return cached;
}
export function renderHoroscopeHTML(html,path,now=new Date()) {
  const data=snapshotFor(now), index=SLUGS.findIndex(slug=>path==='/horoscop-azi/'+slug+'/');
  const isHub=index<0, reading=data.readings[index];
  const title=isHub?'Horoscop azi, '+data.label+' – toate zodiile | AstroVip':'Horoscop '+reading.sign+' azi, '+data.label+' | AstroVip';
  const description=isHub?'Horoscop azi, '+data.label+', pentru toate cele 12 zodii. Dragoste, bani, carieră, sănătate și energie, cu context planetar actualizat zilnic.':'Horoscop '+reading.sign+' azi, '+data.label+': dragoste, bani, carieră, sănătate și energie. Interpretare zilnică AstroVip, decani și context planetar.';
  html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+escapeHTML(title)+'</title>')
    .replace(/(<meta name="description" content=")[^"]*(")/,'$1'+escapeHTML(description)+'$2')
    .replace(/(<meta property="og:title" content=")[^"]*(")/,'$1'+escapeHTML(title)+'$2')
    .replace(/(<meta property="og:description" content=")[^"]*(")/,'$1'+escapeHTML(description)+'$2')
    .replace(/<h1>[\s\S]*?<\/h1>/,'<h1>'+escapeHTML(isHub?'Horoscop azi, '+data.label:'Horoscop '+reading.sign+' azi')+'</h1>')
    .replace(/<(?:div|time) class="date" data-today(?: datetime="[^"]*")?>[\s\S]*?<\/(?:div|time)>/,'<time class="date" data-today datetime="'+data.day+'">'+escapeHTML(data.fullLabel)+'</time>')
    .replace('<html lang="ro">','<html lang="ro" data-horoscop-render="daily-20261021">');
  const sky=BODIES.map(([body,label,symbol])=>'<div class="planet"><b>'+escapeHTML(symbol+' '+label)+'</b>'+escapeHTML(positionLabel(data.positions[body]))+'</div>').join('');
  html=html.replace(/<div class="sky-grid" data-live-sky><div class="planet">[\s\S]*?<\/div><\/div>/,'<div class="sky-grid" data-live-sky>'+sky+'</div>');
  if(isHub) {
    const overview='<section class="wrap daily-overview" aria-labelledby="horoscop-zodii"><h2 id="horoscop-zodii">Horoscop azi pentru toate cele 12 zodii</h2><p class="fine">Alege zodia și citește horoscopul de azi pentru dragoste, bani, carieră, sănătate și energie. Interpretările sunt calculate automat pentru '+escapeHTML(data.label)+', la reperul de la ora 12:00 în România, folosind zodiacul tropical și casele solare.</p><div class="daily-overview__grid">'+data.readings.map(r=>'<article class="card"><h3><a href="/horoscop-azi/'+r.slug+'/">Horoscop '+escapeHTML(r.sign)+' azi</a></h3><p>'+escapeHTML(r.lead)+'</p><p><strong>Dragoste:</strong> '+escapeHTML(r.love)+'</p><p><strong>Bani:</strong> '+escapeHTML(r.money)+'</p><p><strong>Carieră:</strong> '+escapeHTML(r.career)+'</p><p><strong>Sănătate &amp; energie:</strong> '+escapeHTML(r.energy)+'</p><a class="daily-overview__link" href="/horoscop-azi/'+r.slug+'/">Citește horoscopul complet '+escapeHTML(r.sign)+' →</a></article>').join('')+'</div></section>';
    html=html.replace(/<!--ASTROVIP_DAILY_OVERVIEW_START-->[\s\S]*?<!--ASTROVIP_DAILY_OVERVIEW_END-->/,'<!--ASTROVIP_DAILY_OVERVIEW_START-->'+overview+'<!--ASTROVIP_DAILY_OVERVIEW_END-->');
  } else {
    for(const key of ['lead','love','money','career','energy','opportunity','warning','influence','why']){
      const pattern=new RegExp('(<(?:p|span|strong)\\b[^>]*\\bdata-daily-'+key+'(?:="[^"]*")?[^>]*>)[\\s\\S]*?(</(?:p|span|strong)>)','g');
      html=html.replace(pattern,(_,open,close)=>open+escapeHTML(reading[key])+close);
    }
    let decan=0;
    html=html.replace(/(<p class="decan-note" data-decan-note>)[\s\S]*?(<\/p>)/g,(_,open,close)=>open+escapeHTML(reading.decans[decan++])+close);
  }
  const url='https://astrovip.ro'+path;
  const offset=(12-data.reference.getUTCHours());
  const schema={'@context':'https://schema.org','@graph':[
    {'@type':isHub?'CollectionPage':'WebPage','@id':url+'#page',url,name:title,description,inLanguage:'ro-RO',datePublished:'2026-10-20',dateModified:data.day+'T00:00:00+0'+offset+':00',
      publisher:{'@type':'Organization',name:'AstroVip',url:'https://astrovip.ro/'},
      breadcrumb:{'@id':url+'#breadcrumb'},...(isHub?{mainEntity:{'@type':'ItemList',itemListElement:data.readings.map((r,i)=>({'@type':'ListItem',position:i+1,name:'Horoscop '+r.sign+' azi',url:'https://astrovip.ro/horoscop-azi/'+r.slug+'/'}))}}:{isPartOf:{'@id':'https://astrovip.ro/horoscop-azi/#page'},about:reading.sign})},
    {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[
      {'@type':'ListItem',position:1,name:'AstroVip',item:'https://astrovip.ro/'},
      {'@type':'ListItem',position:2,name:'Horoscop azi',item:'https://astrovip.ro/horoscop-azi/'},
      ...(isHub?[]:[{'@type':'ListItem',position:3,name:'Horoscop '+reading.sign+' azi',item:url}])
    ]}
  ]};
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,'<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>');
}
export function renderHoroscopeSitemap(xml,now=new Date()) {
  return xml.replace(/(<loc>https:\/\/astrovip\.ro\/horoscop-azi\/[^<]*<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/g,'$1'+bucharestDay(now)+'$2');
}
export async function horoscopeResponse(response,path,now=new Date()) {
  if(!response.ok) return response;
  const html=path==='/sitemap-core.xml'?renderHoroscopeSitemap(await response.text(),now):renderHoroscopeHTML(await response.text(),path,now);
  const headers=new Headers(response.headers);
  for(const key of ['etag','last-modified','content-length','content-encoding']) headers.delete(key);
  const day=bucharestDay(now);
  const ttl=dailyCacheSeconds(now);
  headers.set('cache-control','public, max-age='+ttl+', s-maxage='+ttl+', must-revalidate');
  headers.set('x-astrovip-horoscop-date',day);
  return new Response(html,{status:response.status,statusText:response.statusText,headers});
}
