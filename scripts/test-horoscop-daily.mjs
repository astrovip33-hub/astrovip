import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dailySnapshot,bucharestDay,localNoon,dailyCacheSeconds,SLUGS,positionLabel} from '../assets/horoscop-core-20261021.mjs';
import {renderHoroscopeHTML,renderHoroscopeSitemap,horoscopeRoute,horoscopeResponse} from '../horoscop-renderer.js';
const now=new Date('2026-10-21T08:30:00Z');
test('Bucharest date and local noon handle summer, winter and DST transition days',()=>{
 assert.equal(bucharestDay(new Date('2026-10-20T21:30:00Z')),'2026-10-21');
 assert.equal(localNoon('2026-10-21').toISOString(),'2026-10-21T09:00:00.000Z');
 assert.equal(localNoon('2026-10-25').toISOString(),'2026-10-25T10:00:00.000Z');
 assert.equal(localNoon('2026-03-29').toISOString(),'2026-03-29T09:00:00.000Z');
 assert.ok(dailyCacheSeconds(new Date('2026-10-24T20:59:30Z'))<=30);
 assert.ok(dailyCacheSeconds(new Date('2026-10-25T21:59:30Z'))<=30);
 assert.equal(dailyCacheSeconds(now),300);
 assert.match(positionLabel(29.9999),/^0° 00′ Taur$/);
});
test('all 12 signs have daily readings and the daily reference is stable throughout the day',()=>{
 const data=dailySnapshot(globalThis.Astronomy,now);
 assert.equal(data.readings.length,12);
 assert.equal(new Set(data.readings.map(r=>r.lead)).size,12);
 assert.deepEqual(data,dailySnapshot(globalThis.Astronomy,new Date('2026-10-21T20:59:00Z')));
 assert.notDeepEqual(data,dailySnapshot(globalThis.Astronomy,new Date('2026-10-21T21:01:00Z')));
 for(const r of data.readings) for(const key of ['lead','love','money','career','energy']) assert.ok(r[key].length>50);
 for(const value of Object.values(data.positions))assert.ok(value>=0&&value<360);
});
test('hub contains 12 visible readings and keeps links, canonical and schema aligned',()=>{
 const source=readFileSync('horoscop-azi/index.html','utf8');
 const html=renderHoroscopeHTML(source,'/horoscop-azi/',now);
 assert.equal((html.match(/Citește horoscopul complet/g)||[]).length,12);
 for(const slug of SLUGS)assert.ok(html.includes('href="/horoscop-azi/'+slug+'/"'));
 assert.match(html,/<h1>Horoscop azi, 21 octombrie 2026<\/h1>/);
 assert.match(html,/datetime="2026-10-21"/);
 assert.match(html,/data-horoscop-render="daily-20261021"/);
 assert.match(html,/<link rel="canonical" href="https:\/\/astrovip.ro\/horoscop-azi\/">/);
 assert.doesNotMatch(html,/Se calculeaz|Se actualizeaz/);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema['@graph'][0].mainEntity.itemListElement.length,12);
 assert.equal(schema['@graph'][0].dateModified,'2026-10-21T00:00:00+03:00');
 const tomorrow=renderHoroscopeHTML(html,'/horoscop-azi/',new Date('2026-10-22T10:00:00Z'));
 assert.match(tomorrow,/<h1>Horoscop azi, 22 octombrie 2026<\/h1>/);
 assert.equal((tomorrow.match(/Citește horoscopul complet/g)||[]).length,12);
 assert.match(tomorrow,/datetime="2026-10-22"/);
 assert.match(tomorrow,/data-horoscop-render="daily-20261022"/);
});
test('every sign page has visible content before JavaScript and correct next-day refresh',()=>{
 for(const slug of SLUGS){
  const path='/horoscop-azi/'+slug+'/', source=readFileSync('.'+path+'index.html','utf8');
  const html=renderHoroscopeHTML(source,path,now);
  assert.ok(horoscopeRoute(path));
  assert.doesNotMatch(html,/Se calculeaz|Se actualizeaz/);
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.equal((html.match(/<p class="decan-note" data-decan-note>/g)||[]).length,3);
  assert.match(html,/href="\/horoscop-azi\/"/);
  assert.ok(html.includes('href="https://astrovip.ro'+path+'"'));
  const next=renderHoroscopeHTML(html,path,new Date('2026-10-22T10:00:00Z'));
  assert.match(next,/datetime="2026-10-22"/);
  assert.doesNotMatch(next,/Se calculeaz/);
 }
 assert.equal(horoscopeRoute('/'),false);
 assert.equal(horoscopeRoute('/horoscop-chinezesc/'),false);
});
test('responses remove stale validators and cap caching before Bucharest midnight',async()=>{
 const source=readFileSync('horoscop-azi/index.html','utf8');
 const response=await horoscopeResponse(new Response(source,{headers:{'content-type':'text/html','etag':'old','last-modified':'old','content-length':'123'}}),'/horoscop-azi/',new Date('2026-10-21T20:59:30Z'));
 assert.equal(response.headers.get('etag'),null);
 assert.equal(response.headers.get('content-length'),null);
 assert.equal(response.headers.get('x-astrovip-horoscop-date'),'2026-10-21');
 assert.match(response.headers.get('cache-control'),/max-age=29/);
 const xml='<url><loc>https://astrovip.ro/horoscop-azi/</loc><lastmod>2026-10-20</lastmod></url><url><loc>https://astrovip.ro/harta-natala/</loc><lastmod>2026-10-10</lastmod></url>';
 assert.equal(renderHoroscopeSitemap(xml,now),xml.replace('2026-10-20','2026-10-21'));
});
