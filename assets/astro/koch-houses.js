import { ASTROVIP_HOUSE_SYSTEM, validateHouseResult } from './swiss-adapter.js';

const norm=x=>((Number(x)%360)+360)%360;

/**
 * Normalize @kuntay/swisseph houses() output into AstroVip's strict contract.
 * The wrapper returns zero-based cusps[0..11], plus ascendant/midheaven.
 * Polar substitution is rejected for AstroVip Koch rather than silently
 * presenting Porphyry as Koch.
 */
export function normalizeKochHouses(raw,{ephemerisSource='swiss-files'}={}){
  if(!raw) throw new Error('Missing Swiss house result.');
  if(raw.substituted===true)
    throw new Error('Koch is undefined at this latitude; Swiss substituted another house system.');
  const sourceCusps=raw.cusps||raw.houseCusps;
  if(!Array.isArray(sourceCusps)||sourceCusps.length!==12)
    throw new Error('Expected exactly 12 zero-based Koch cusps.');

  const asc=raw.ascendant ?? raw.asc;
  const mc=raw.midheaven ?? raw.mc;
  if(!Number.isFinite(Number(asc))||!Number.isFinite(Number(mc)))
    throw new Error('Missing ASC/MC from Swiss house result.');

  return validateHouseResult({
    engine:'swisseph',
    ephemerisSource,
    houseSystem:ASTROVIP_HOUSE_SYSTEM,
    cusps:sourceCusps.map(norm),
    axes:{asc:norm(asc),mc:norm(mc),dsc:norm(Number(asc)+180),ic:norm(Number(mc)+180)}
  });
}
