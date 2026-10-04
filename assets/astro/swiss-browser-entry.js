import { createSwissEph, FetchEphemeris, Body } from '@kuntay/swisseph';
import { normalizeKochHouses } from './koch-houses.js';

let enginePromise;
async function engine(){
  if(!enginePromise) enginePromise=(async()=>{
    const swe=await createSwissEph();
    const load=await swe.loadEphemeris(new FetchEphemeris(),{fromYear:1800,toYear:2399});
    if(load.missing?.length) throw new Error('Swiss ephemeris files incomplete.');
    return swe;
  })();
  return enginePromise;
}

const BODY_MAP=Object.freeze([
  ['Sun','Soare','☉',Body.Sun],
  ['Moon','Lună','☽',Body.Moon],
  ['Mercury','Mercur','☿',Body.Mercury],
  ['Venus','Venus','♀',Body.Venus],
  ['Mars','Marte','♂',Body.Mars],
  ['Jupiter','Jupiter','♃',Body.Jupiter],
  ['Saturn','Saturn','♄',Body.Saturn],
  ['Uranus','Uranus','♅',Body.Uranus],
  ['Neptune','Neptun','♆',Body.Neptune],
  ['Pluto','Pluto','♇',Body.Pluto],
]);

function julianFromDate(swe,date){
  if(!(date instanceof Date)||Number.isNaN(date.getTime())) throw new TypeError('A valid Date is required.');
  return swe.julianDay(
    date.getUTCFullYear(),
    date.getUTCMonth()+1,
    date.getUTCDate(),
    date.getUTCHours()+date.getUTCMinutes()/60+date.getUTCSeconds()/3600+date.getUTCMilliseconds()/3600000
  );
}

function swissPosition(swe,jd,[key,label,glyph,body]){
  const p=swe.calc(jd,body);
  if(p.ephemeris!=='swiss') throw new Error('Swiss ephemeris unavailable; calculation refused.');
  return {
    key,label,glyph,
    longitude:Number(p.longitude),
    latitude:Number(p.latitude),
    longitudeSpeed:Number(p.longitudeSpeed),
    retrograde:Number(p.longitudeSpeed)<0,
    ephemeris:p.ephemeris
  };
}

export async function calculateSwissPositions(date){
  const swe=await engine();
  const jd=julianFromDate(swe,date);
  return {
    engine:'swisseph',
    ephemerisSource:'swiss-files',
    jd,
    date:date.toISOString(),
    planets:BODY_MAP.map(item=>swissPosition(swe,jd,item))
  };
}

export async function calculateSwissKoch(date,lat,lon){
  const swe=await engine();
  const jd=julianFromDate(swe,date);
  const sun=swe.calc(jd,Body.Sun);
  if(sun.ephemeris!=='swiss') throw new Error('Swiss ephemeris unavailable; calculation refused.');
  const raw=swe.houses(jd,Number(lat),Number(lon),'K');
  return normalizeKochHouses(raw,{ephemerisSource:'swiss-files'});
}

export async function calculateSwissChart(date,lat,lon){
  const swe=await engine();
  const jd=julianFromDate(swe,date);
  const planets=BODY_MAP.map(item=>swissPosition(swe,jd,item));
  const raw=swe.houses(jd,Number(lat),Number(lon),'K');
  const houses=normalizeKochHouses(raw,{ephemerisSource:'swiss-files'});
  return {
    engine:'swisseph',
    ephemerisSource:'swiss-files',
    zodiac:'tropical',
    houseSystem:'K',
    jd,
    date:date.toISOString(),
    planets,
    cusps:houses.cusps,
    axes:houses.axes
  };
}
