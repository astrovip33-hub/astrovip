const CLARITY_EXPORT_API = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';
const CLARITY_DIMENSIONS = new Set(['Browser','Device','Country/Region','OS','Source','Medium','Campaign','Channel','URL']);

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
      ...extraHeaders,
    },
  });
}
function safeEqual(a = '', b = '') {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}
function isAuthorized(request, env) {
  const expected = String(env.COMMAND_CENTER_TOKEN || '').trim();
  const h = request.headers.get('authorization') || '';
  const m = /^Bearer\s+(.+)$/i.exec(h);
  const received = m ? m[1].trim() : '';
  return Boolean(expected) && safeEqual(received, expected);
}
function metricBlock(payload, name) {
  return Array.isArray(payload) ? payload.find(x => String(x?.metricName || '').toLowerCase() === name.toLowerCase()) : null;
}
function sum(rows, keys) {
  return (Array.isArray(rows) ? rows : []).reduce((total, row) => {
    for (const key of keys) {
      if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== '') {
        const n = Number(row[key]);
        if (Number.isFinite(n)) return total + n;
      }
    }
    return total;
  }, 0);
}
function summarize(payload) {
  const traffic = metricBlock(payload, 'Traffic')?.information || [];
  const dead = metricBlock(payload, 'Dead Click Count')?.information || [];
  const rage = metricBlock(payload, 'Rage Click Count')?.information || [];
  const errors = metricBlock(payload, 'Script Error Count')?.information || [];
  return {
    sessions: sum(traffic, ['totalSessionCount','sessionCount']),
    botSessions: sum(traffic, ['totalBotSessionCount','botSessionCount']),
    users: sum(traffic, ['distinctUserCount','distantUserCount','totalUserCount','userCount']),
    deadClicks: sum(dead, ['deadClickCount','DeadClickCount','count']),
    rageClicks: sum(rage, ['rageClickCount','RageClickCount','count']),
    scriptErrors: sum(errors, ['scriptErrorCount','ScriptErrorCount','count']),
    metricBlocks: Array.isArray(payload) ? payload.length : 0,
  };
}
export async function handleClarity(request, env) {
  const incoming = new URL(request.url);
  if (incoming.pathname !== '/api/command/clarity') return null;
  if (!String(env.COMMAND_CENTER_TOKEN || '').trim()) return json({ ok: false, error: 'command_center_token_not_configured' }, 503);
  if (!isAuthorized(request, env)) return json({ ok: false, error: 'unauthorized' }, 401, { 'www-authenticate': 'Bearer realm="AstroVip Command Center"' });
  if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'GET' });
  const token = String(env.CLARITY_API_TOKEN || '').trim();
  if (!token) return json({ ok: false, configured: false, error: 'clarity_api_token_not_configured' }, 503);

  const rawDays = Number(incoming.searchParams.get('days') || incoming.searchParams.get('numOfDays') || 1);
  const numOfDays = [1,2,3].includes(rawDays) ? rawDays : 1;
  const dimensions = [1,2,3].map(i => incoming.searchParams.get(`dimension${i}`)).filter(Boolean).filter(x => CLARITY_DIMENSIONS.has(x)).slice(0,3);
  const target = new URL(CLARITY_EXPORT_API);
  target.searchParams.set('numOfDays', String(numOfDays));
  dimensions.forEach((value, i) => target.searchParams.set(`dimension${i + 1}`, value));

  try {
    const response = await fetch(target.toString(), {
      headers: { authorization: `Bearer ${token}`, accept: 'application/json' },
      signal: AbortSignal.timeout(20000),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 429) return json({ ok: false, configured: true, error: 'clarity_daily_quota_exceeded' }, 429);
      if (response.status === 401 || response.status === 403) return json({ ok: false, configured: false, error: 'clarity_api_token_invalid_or_unauthorized' }, 503);
      return json({ ok: false, configured: true, error: `clarity_http_${response.status}` }, 502);
    }
    return json({
      ok: true,
      configured: true,
      data: {
        projectId: String(env.CLARITY_PROJECT_ID || '').trim() || null,
        numOfDays,
        dimensions,
        timezone: 'UTC',
        summary: summarize(payload),
        metrics: payload,
      },
    });
  } catch (e) {
    return json({ ok: false, configured: true, error: String(e?.message || e).slice(0,180) }, 502);
  }
}
