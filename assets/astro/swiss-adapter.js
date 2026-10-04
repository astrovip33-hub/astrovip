/**
 * AstroVip Swiss Ephemeris adapter contract.
 *
 * Precision rule: callers must not label a result "Swiss exact" unless
 * engine === "swisseph" and ephemerisSource === "swiss-files".
 *
 * House system: K = Koch.
 */
export const ASTROVIP_HOUSE_SYSTEM = 'K';

export function assertSwissResult(result) {
  if (!result || result.engine !== 'swisseph' || result.ephemerisSource !== 'swiss-files') {
    throw new Error('AstroVip precision guard: Swiss ephemeris files are required; fallback results are rejected.');
  }
  return result;
}

export function normalizeDegrees(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new TypeError('Longitude must be finite.');
  return ((n % 360) + 360) % 360;
}

export function validateHouseResult(result) {
  assertSwissResult(result);
  if (result.houseSystem !== ASTROVIP_HOUSE_SYSTEM) throw new Error('Expected Koch house system (K).');
  if (!Array.isArray(result.cusps) || result.cusps.length !== 12) throw new Error('Expected 12 Koch cusps.');
  for (const cusp of result.cusps) normalizeDegrees(cusp);
  for (const key of ['asc','mc','dsc','ic']) normalizeDegrees(result.axes?.[key]);
  return result;
}
