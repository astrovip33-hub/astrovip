import test from 'node:test';
import assert from 'node:assert/strict';
import {planetaryHoursSnapshot,renderPlanetaryHoursHTML} from '../planetary-hours-state.mjs';
test('SSR initial hour stays valid across seasons, DST and hour boundaries',()=>{
 for(const date of ['2026-01-01','2026-03-29','2026-10-25','2026-11-01']){
  for(let hour=0;hour<24;hour++){
   const now=new Date(date+'T'+String(hour).padStart(2,'0')+':30:00Z');
   const s=planetaryHoursSnapshot(now);
   assert.ok(s.start<=now&&now<s.end,date+' '+hour);
   assert.match(s.count,/^\d{2}:\d{2}:\d{2}$/);
   assert.ok(s.next.includes(' · '));
   const next=planetaryHoursSnapshot(new Date(+s.end+1));
   assert.notEqual(s.planet,next.planet);
  }
 }
});
test('both mobile and desktop have meaningful initial HTML without JavaScript',()=>{
 const markup=['avPh','avmPh'].map(p=>'<strong id="'+p+'Planet">Se calculează…</strong><span id="'+p+'Range">—</span><b id="'+p+'Countdown">—</b>').join('');
 const html=renderPlanetaryHoursHTML(markup,new Date('2026-11-01T07:00:00Z'));
 assert.doesNotMatch(html,/Se calculează|>—</);
 assert.equal((html.match(/>Mercur</g)||[]).length,2);
});
