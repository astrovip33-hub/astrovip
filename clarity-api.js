const CLARITY_EXPORT_API = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';
const CLARITY_DIMENSIONS = new Set(['Browser','Device','Country/Region','OS','Source','Medium','Campaign','Channel','URL']);
const CLARITY_SNAPSHOT_INGEST_URL = 'https://hhzsecdtqacyroxiywpm.supabase.co/functions/v1/clarity-snapshot-ingest';

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
function metricKey(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
function metricBlock(payload, name) {
  const wanted = metricKey(name);
  return Array.isArray(payload) ? payload.find(x => metricKey(x?.metricName) === wanted) : null;
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
    deadClicks: sum(dead, ['subTotal','deadClickCount','DeadClickCount','count']),
    rageClicks: sum(rage, ['subTotal','rageClickCount','RageClickCount','count']),
    scriptErrors: sum(errors, ['subTotal','scriptErrorCount','ScriptErrorCount','count']),
    metricBlocks: Array.isArray(payload) ? payload.length : 0,
  };
}

async function persistSnapshot(env, { projectId, numOfDays, summary, metrics }) {
  const secret = String(env.CLARITY_SNAPSHOT_INGEST_SECRET || '').trim();
  if (!secret || !projectId) return { stored: false, reason: 'snapshot_ingest_not_configured' };
  const capturedAt = new Date().toISOString();
  const periodHours = numOfDays * 24;
  const snapshotKey = `${projectId}:${periodHours}:${capturedAt.slice(0, 13)}`;
  try {
    const response = await fetch(CLARITY_SNAPSHOT_INGEST_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-astrovip-ingest-secret': secret,
      },
      body: JSON.stringify({
        projectId,
        periodHours,
        capturedAt,
        snapshotKey,
        source: 'microsoft_clarity_data_export_api',
        summary,
        metrics,
      }),
      signal: AbortSignal.timeout(12000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) return { stored: false, reason: result?.error || `snapshot_http_${response.status}` };
    return { stored: true, snapshotKey };
  } catch (e) {
    return { stored: false, reason: String(e?.message || e).slice(0, 120) };
  }
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
    const summary = summarize(payload);
    const projectId = String(env.CLARITY_PROJECT_ID || '').trim() || null;
    const snapshot = await persistSnapshot(env, { projectId, numOfDays, summary, metrics: payload });
    return json({
      ok: true,
      configured: true,
      snapshotStored: snapshot.stored,
      snapshotStatus: snapshot.stored ? 'stored' : snapshot.reason,
      data: {
        projectId,
        numOfDays,
        dimensions,
        timezone: 'UTC',
        summary,
        metrics: payload,
      },
    });
  } catch (e) {
    return json({ ok: false, configured: true, error: String(e?.message || e).slice(0,180) }, 502);
  }
}
