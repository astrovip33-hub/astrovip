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

export async function calculateSwissKoch(date,lat,lon){
  const swe=await engine();
  const jd=swe.julianDay(date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate(),
    date.getUTCHours()+date.getUTCMinutes()/60+date.getUTCSeconds()/3600);
  const sun=swe.calc(jd,Body.Sun);
  if(sun.ephemeris!=='swiss') throw new Error('Swiss ephemeris unavailable; calculation refused.');
  const raw=swe.houses(jd,lat,lon,'K');
  return normalizeKochHouses(raw,{ephemerisSource:'swiss-files'});
}
