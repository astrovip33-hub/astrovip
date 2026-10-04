import assert from 'node:assert/strict';
import { createSwissEph, Body, FetchEphemeris } from '@kuntay/swisseph';
import { normalizeKochHouses } from '../assets/astro/koch-houses.js';

const swe=await createSwissEph();
try {
  const load=await swe.loadEphemeris(new FetchEphemeris(),{fromYear:1978,toYear:1978});
  assert.equal(load.missing.length,0,'Swiss ephemeris files must load');

  // 12 Mar 1978 05:54:28 UT; Bucharest 44.4268 N, 26.1025 E.
  const jd=swe.julianDay(1978,3,12,5+54/60+28/3600);
  const sun=swe.calc(jd,Body.Sun);
  assert.equal(sun.ephemeris,'swiss','Silent Moshier fallback is forbidden');

  const raw=swe.houses(jd,44.4268,26.1025,'K');
  const houses=normalizeKochHouses(raw);
  assert.equal(houses.cusps.length,12);
  assert.ok(houses.axes.asc>=0&&houses.axes.asc<360);
  assert.ok(houses.axes.mc>=0&&houses.axes.mc<360);
  assert.ok(Math.abs((((houses.axes.dsc-houses.axes.asc)+360)%360)-180)<1e-12);
  assert.ok(Math.abs((((houses.axes.ic-houses.axes.mc)+360)%360)-180)<1e-12);

  console.log(JSON.stringify({ok:true,jd,sunEphemeris:sun.ephemeris,asc:houses.axes.asc,mc:houses.axes.mc,cusps:houses.cusps},null,2));
} finally {
  swe.dispose();
}
