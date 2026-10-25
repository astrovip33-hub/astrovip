import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEFAULT_PLACE,solarDay,planetarySnapshot,localDay,midnight,addDays,answerHTML} from '../assets/planetary-hours-core.mjs';
import {renderPlanetaryHoursHTML,planetaryHoursResponse} from '../planetary-hours-renderer.js';

test('24 contiguous unequal hours start with the weekday ruler, including DST nights',()=>{
  for(const day of ['2026-03-28','2026-03-29','2026-06-21','2026-10-24','2026-10-25','2026-12-21']) {
    const data=solarDay(day);
    assert.equal(data.entries.length,24);
    assert.equal(+data.entries[0].start,+data.sunrise);
    assert.equal(+data.entries[11].end,+data.sunset);
    assert.equal(+data.entries[23].end,+data.nextSunrise);
    for(let i=1;i<24;i++) assert.ok(Math.abs(data.entries[i].start-data.entries[i-1].end)<=1);
    assert.equal(localDay(data.sunrise),'2026-'+day.slice(5));
    assert.ok(data.entries.every(x=>x.end>x.start));
  }
  assert.equal(solarDay('2026-10-25').entries[0].planet,'Soare');
  assert.equal(solarDay('2026-10-26').entries[0].planet,'Lună');
  assert.equal(midnight('2026-10-25','Europe/Bucharest').toISOString(),'2026-10-24T21:00:00.000Z');
  assert.equal(midnight('2026-10-26','Europe/Bucharest').toISOString(),'2026-10-25T22:00:00.000Z');
  assert.equal(addDays('2026-12-31',1),'2027-01-01');
});
test('pre-sunrise hours belong to the previous planetary day; next hour crosses sunrise correctly',()=>{
  const day=solarDay('2026-10-25');
  const before=planetarySnapshot(new Date(+day.sunrise-1000));
  assert.equal(before.civilDay,'2026-10-25');
  assert.equal(before.day,'2026-10-24');
  assert.equal(before.index,23);
  assert.equal(before.next.planet,'Soare');
  assert.equal(+before.next.start,+day.sunrise);
  const after=planetarySnapshot(new Date(+day.sunrise+1000));
  assert.equal(after.day,'2026-10-25');
  assert.equal(after.index,0);
});
test('location time zone is explicit and independent of the host clock',()=>{
  const now=new Date('2026-10-25T10:00:00Z');
  const data=planetarySnapshot(now);
  assert.match(answerHTML(data),/București/);
  assert.match(answerHTML(data),/Europe\/Bucharest/);
  assert.match(answerHTML(data),/12:00 GMT\+2/);
  const cluj=planetarySnapshot(now,{...DEFAULT_PLACE,label:'Cluj-Napoca',lat:46.7712,lon:23.6236});
  assert.notEqual(+data.sunrise,+cluj.sunrise);
  assert.match(answerHTML(cluj),/Cluj-Napoca/);
  assert.equal(solarDay('2026-06-21',{lat:89,lon:0,timeZone:'UTC'}),null);
});
test('HTML contains the dated answer and all intervals without JavaScript and refreshes idempotently',()=>{
  const source=readFileSync('ore-planetare/index.html','utf8');
  const now=new Date('2026-10-25T10:00:00Z');
  const html=renderPlanetaryHoursHTML(source,now);
  assert.equal((html.match(/<h1>/g)||[]).length,1);
  assert.match(html,/Ore planetare azi, 25 octombrie 2026/);
  assert.match(html,/id="planetary-answer">Pe <time datetime="2026-10-25"/);
  assert.equal((html.match(/<th scope="row">/g)||[]).length,24);
  assert.match(html,/href="https:\/\/astrovip.ro\/ore-planetare\/"/);
  assert.doesNotMatch(html,/Se calculează/);
  assert.equal(renderPlanetaryHoursHTML(html,now),html);
  const tomorrow=renderPlanetaryHoursHTML(html,new Date('2026-10-26T10:00:00Z'));
  assert.match(tomorrow,/data-planetary-date="2026-10-26"/);
  assert.equal((tomorrow.match(/<th scope="row">/g)||[]).length,24);
});
test('response cache expires before the next interval and clears stale validators',async()=>{
  const source=readFileSync('ore-planetare/index.html','utf8');
  const current=planetarySnapshot(new Date('2026-10-25T10:00:00Z')).current;
  const now=new Date(+current.end-1500);
  const response=await planetaryHoursResponse(new Response(source,{headers:{'etag':'stale','last-modified':'stale','content-length':'1','content-type':'text/html'}}),now);
  assert.match(response.headers.get('cache-control'),/max-age=1,/);
  assert.equal(response.headers.get('etag'),null);
  assert.equal(response.headers.get('last-modified'),null);
  assert.equal(response.headers.get('content-length'),null);
  assert.equal(response.headers.get('x-astrovip-planetary-date'),'2026-10-25');
});
