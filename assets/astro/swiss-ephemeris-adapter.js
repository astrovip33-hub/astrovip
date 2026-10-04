/**
 * AstroVip Swiss Ephemeris adapter contract.
 *
 * This module intentionally contains NO approximate fallback.
 * Production callers must receive a verified Swiss Ephemeris result or an error.
 *
 * Target engine: Swiss Ephemeris (AGPL route selected for this project).
 * Zodiac: tropical. House system: Koch ('K').
 */

export const ASTROVIP_EPHEMERIS_CONTRACT = Object.freeze({
  zodiac: 'tropical',
  houseSystem: 'K',
  houseSystemName: 'Koch',
  allowApproximateFallback: false,
  requiredAngles: ['ASC', 'MC', 'DSC', 'IC'],
  requiredCusps: 12,
});

function finite(value, name) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new TypeError(name + ' must be finite');
  return n;
}

export function normalizeBirthInput(input = {}) {
  const utc = new Date(input.utc);
  if (Number.isNaN(utc.getTime())) throw new TypeError('utc must be a valid UTC instant');
  const latitude = finite(input.latitude, 'latitude');
  const longitude = finite(input.longitude, 'longitude');
  if (latitude < -90 || latitude > 90) throw new RangeError('latitude out of range');
  if (longitude < -180 || longitude > 180) throw new RangeError('longitude out of range');
  return Object.freeze({ utc: utc.toISOString(), latitude, longitude });
}

export function validateKochResult(result = {}) {
  if (result.engine !== 'swiss-ephemeris') throw new Error('Unverified ephemeris engine');
  if (result.houseSystem !== 'K') throw new Error('House system is not Koch');
  if (!Array.isArray(result.cusps) || result.cusps.length !== 12) throw new Error('Expected 12 Koch cusps');
  for (const [i, cusp] of result.cusps.entries()) {
    const n = finite(cusp, 'cusp ' + (i + 1));
    if (n < 0 || n >= 360) throw new RangeError('cusp longitude out of range');
  }
  for (const key of ASTROVIP_EPHEMERIS_CONTRACT.requiredAngles) {
    const n = finite(result.angles?.[key], key);
    if (n < 0 || n >= 360) throw new RangeError(key + ' longitude out of range');
  }
  if (!result.engineVersion) throw new Error('Swiss Ephemeris version must be reported');
  return true;
}

export function assertBenchmark(actual, expected, toleranceArcsec = 1) {
  const circularDelta = (a, b) => Math.abs((((a - b) + 540) % 360) - 180);
  const tolerance = toleranceArcsec / 3600;
  const failures = [];
  expected.cusps.forEach((value, i) => {
    const delta = circularDelta(actual.cusps[i], value);
    if (delta > tolerance) failures.push({ field: 'cusp' + (i + 1), deltaDeg: delta });
  });
  for (const key of ['ASC', 'MC', 'DSC', 'IC']) {
    const delta = circularDelta(actual.angles[key], expected.angles[key]);
    if (delta > tolerance) failures.push({ field: key, deltaDeg: delta });
  }
  if (failures.length) {
    const err = new Error('Swiss/Koch benchmark failed');
    err.failures = failures;
    throw err;
  }
  return true;
}
