import { assertSwissResult } from './swiss-adapter.js';

/**
 * AstroVip Swiss Ephemeris loader.
 * Fail-closed by design: no silent Moshier fallback is accepted.
 *
 * The concrete WASM factory is injected so this module stays decoupled from
 * a vendor bundle and can be tested independently.
 */
export async function createAstroVipSwissEngine({
  createSwissEph,
  ephemerisFiles,
  ephemerisPath='/assets/ephe/'
}={}){
  if(typeof createSwissEph!=='function') throw new TypeError('Swiss WASM factory is required.');
  if(!Array.isArray(ephemerisFiles)||ephemerisFiles.length===0)
    throw new Error('Swiss .se1 ephemeris files are required.');

  const engine=await createSwissEph();
  if(!engine) throw new Error('Swiss WASM initialization failed.');

  if(typeof engine.setEphemerisPath==='function') engine.setEphemerisPath(ephemerisPath);
  if(typeof engine.loadEphemerisFile!=='function')
    throw new Error('Swiss WASM build does not expose ephemeris file loading.');

  for(const file of ephemerisFiles){
    if(!/\.se1$/i.test(String(file))) throw new Error('Only Swiss .se1 ephemeris files are accepted.');
    await engine.loadEphemerisFile(file);
  }

  return {
    raw:engine,
    verify(result){
      const source=String(result?.ephemerisSource||result?.ephemeris||result?.source||'').toLowerCase();
      return assertSwissResult({
        ...result,
        engine:'swisseph',
        ephemerisSource:source.includes('swiss')?'swiss-files':source
      });
    }
  };
}
