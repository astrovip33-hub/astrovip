import { createSwissEph, FetchEphemeris, Body, RiseTransit, ROYAL_STARS, BEHENIAN_STARS, NOTABLE_STARS, byDesignation } from '@kuntay/swisseph';
import { normalizeKochHouses } from './koch-houses.js';

let enginePromise;
async function engine(){
  if(!enginePromise) enginePromise=(async()=>{
    const swe=await createSwissEph();
    const load=await swe.loadEphemeris(new FetchEphemeris(),{fromYear:1800,toYear:2399,fixedStars:true});
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

export async function calculateSwissBody(date,key){
  const swe=await engine();
  const jd=julianFromDate(swe,date);
  const item=BODY_MAP.find(x=>x[0]===key);
  if(!item) throw new RangeError('Unsupported Swiss body: '+key);
  return {engine:'swisseph',ephemerisSource:'swiss-files',jd,date:date.toISOString(),...swissPosition(swe,jd,item)};
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


export async function calculateSwissLots(date,lat,lon){
  const swe=await engine();
  const jd=julianFromDate(swe,date);
  const result=swe.lots(jd,{latitude:Number(lat),longitude:Number(lon),houseSystem:'K'});
  return {
    engine:'swisseph',
    ephemerisSource:'swiss-files',
    jd,
    date:date.toISOString(),
    sect:result.sect,
    points:result.points,
    lots:result.lots
  };
}

export async function calculateSwissFixedStars(date,group='royal'){
  const swe=await engine();
  const jd=julianFromDate(swe,date);
  const groups={royal:ROYAL_STARS,behenian:BEHENIAN_STARS,notable:NOTABLE_STARS};
  const selected=groups[group]||ROYAL_STARS;
  const stars=selected.map(star=>{
    const p=swe.fixedStar(byDesignation(star.designation),jd);
    return {
      name:star.name,
      designation:star.designation,
      magnitude:star.magnitude,
      groups:star.groups,
      longitude:Number(p.longitude),
      latitude:Number(p.latitude),
      longitudeSpeed:Number(p.longitudeSpeed||0),
      resolvedName:p.name||star.name
    };
  });
  return {engine:'swisseph',ephemerisSource:'swiss-files',jd,date:date.toISOString(),group,stars};
}


function jdToIso(jd){
  return new Date((Number(jd)-2440587.5)*86400000).toISOString();
}

export async function calculateSwissSunEvents(localMidnight,lat,lon){
  const swe=await engine();
  const jd=julianFromDate(swe,localMidnight);
  const place={latitude:Number(lat),longitude:Number(lon)};
  const rise=swe.riseTransit(jd,Body.Sun,place,RiseTransit.Rise);
  if(!rise.occurs||rise.jd===null) throw new Error('Răsăritul Soarelui nu are loc la această locație și dată.');
  const set=swe.riseTransit(rise.jd+1e-6,Body.Sun,place,RiseTransit.Set);
  if(!set.occurs||set.jd===null) throw new Error('Apusul Soarelui nu are loc la această locație și dată.');
  const nextRise=swe.riseTransit(set.jd+1e-6,Body.Sun,place,RiseTransit.Rise);
  if(!nextRise.occurs||nextRise.jd===null) throw new Error('Următorul răsărit nu a putut fi calculat.');
  return {
    engine:'swisseph',
    sunriseJd:rise.jd,
    sunsetJd:set.jd,
    nextSunriseJd:nextRise.jd,
    sunrise:jdToIso(rise.jd),
    sunset:jdToIso(set.jd),
    nextSunrise:jdToIso(nextRise.jd)
  };
}
