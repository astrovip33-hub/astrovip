import { ASTROVIP_HOUSE_SYSTEM, validateHouseResult } from './swiss-adapter.js';

/**
 * Normalize a raw swe_houses/swe_houses_ex result into AstroVip's contract.
 * Swiss arrays conventionally expose cusps 1..12; ascmc[0]=ASC, ascmc[1]=MC.
 * DSC/IC are exact opposites of ASC/MC.
 */
const norm=x=>((Number(x)%360)+360)%360;

export function normalizeKochHouses(raw,{ephemerisSource='swiss-files'}={}){
  if(!raw) throw new Error('Missing Swiss house result.');
  if(raw.returnCode===0 || raw.ok===false)
    throw new Error('Swiss Ephemeris could not compute Koch houses for this location/time.');

  const sourceCusps=raw.cusps||raw.houseCusps;
  if(!Array.isArray(sourceCusps)) throw new Error('Missing Swiss house cusps.');

  // Accept native C/WASM layout [unused,c1..c12] or compact [c1..c12].
  const cusps=(sourceCusps.length>=13?sourceCusps.slice(1,13):sourceCusps.slice(0,12)).map(norm);
  if(cusps.length!==12) throw new Error('Expected 12 Koch cusps.');

  const ascmc=raw.ascmc||raw.axesRaw;
  const asc=raw.asc ?? (Array.isArray(ascmc)?ascmc[0]:undefined);
  const mc=raw.mc ?? (Array.isArray(ascmc)?ascmc[1]:undefined);
  if(!Number.isFinite(Number(asc))||!Number.isFinite(Number(mc)))
    throw new Error('Missing ASC/MC from Swiss house result.');

  const result={
    engine:'swisseph',
    ephemerisSource,
    houseSystem:ASTROVIP_HOUSE_SYSTEM,
    cusps,
    axes:{
      asc:norm(asc),
      mc:norm(mc),
      dsc:norm(Number(asc)+180),
      ic:norm(Number(mc)+180)
    }
  };
  return validateHouseResult(result);
}
