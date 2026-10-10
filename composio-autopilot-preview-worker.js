const COMPOSIO_BASE = 'https://backend.composio.dev/api/v3.1';
const TOOLKITS = ['github', 'cloudflare', 'google_search_console', 'googlesheets'];
const OAUTH_TOOLKITS = ['github', 'google_search_console', 'googlesheets'];
const USER_ID = 'astrovip-admin';

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'x-robots-tag': 'noindex, nofollow, noarchive',
      'referrer-policy': 'no-referrer',
    },
  });
}

async function composioRequest(env, path, method = 'GET', body = undefined) {
  const key = String(env.COMPOSIO_API_KEY || '').trim();
  if (!key) return { ok: false, status: 503, error: 'composio_api_key_not_configured' };

  const res = await fetch(`${COMPOSIO_BASE}${path}`, {
    method,
    headers: {
      'x-api-key': key,
      'accept': 'application/json',
      'content-type': 'application/json',
      'user-agent': 'AstroVip-Composio-Preview/1.3',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }

  return {
    ok: res.ok,
    status: res.status,
    error: res.ok ? null : (data?.message || data?.error || 'composio_request_failed'),
    data,
  };
}

const composioGet = (env, path) => composioRequest(env, path, 'GET');
const composioPost = (env, path, body) => composioRequest(env, path, 'POST', body);

async function status(env) {
  if (!env.COMPOSIO_API_KEY) {
    return json({ ok: false, configured: false, phase: 'preview-read-only', toolkits: TOOLKITS, error: 'composio_api_key_not_configured' }, 503);
  }

  const checks = await Promise.all(TOOLKITS.map(async slug => {
    const r = await composioGet(env, `/toolkits/${encodeURIComponent(slug)}`);
    return {
      slug,
      available: r.ok,
      status: r.status,
      name: r.ok ? (r.data?.name || r.data?.display_name || slug) : null,
      error: r.ok ? null : r.error,
    };
  }));

  const authenticated = checks.some(x => x.status !== 401 && x.status !== 403);
  const allAvailable = checks.every(x => x.available);
  return json({
    ok: authenticated && allAvailable,
    configured: true,
    authenticated,
    phase: 'preview-read-only',
    policy: { directMainWrites: false, automaticProductionDeploy: false, dnsWrites: false, deletes: false },
    toolkits: checks,
  }, authenticated && allAvailable ? 200 : 502);
}

async function connections(env) {
  if (!env.COMPOSIO_API_KEY) return json({ ok: false, configured: false, error: 'composio_api_key_not_configured' }, 503);

  const params = new URLSearchParams();
  for (const slug of TOOLKITS) params.append('toolkit_slugs', slug);
  params.append('limit', '100');
  const r = await composioGet(env, `/connected_accounts?${params.toString()}`);
  if (!r.ok) return json({ ok: false, configured: true, authenticated: ![401, 403].includes(r.status), error: r.error, status: r.status }, r.status || 502);

  const items = Array.isArray(r.data?.items) ? r.data.items : [];
  const relevant = items.filter(item => TOOLKITS.includes(String(item?.toolkit?.slug || '').toLowerCase()));
  const byToolkit = Object.fromEntries(TOOLKITS.map(slug => {
    const accounts = relevant.filter(item => String(item?.toolkit?.slug || '').toLowerCase() === slug);
    const active = accounts.filter(item => item?.status === 'ACTIVE' && item?.is_disabled !== true);
    return [slug, { connected: active.length > 0, activeCount: active.length, totalCount: accounts.length, statuses: [...new Set(accounts.map(item => item?.status).filter(Boolean))] }];
  }));

  return json({ ok: true, configured: true, authenticated: true, userIdTarget: USER_ID, phase: 'preview-read-only', connections: byToolkit, ready: TOOLKITS.every(slug => byToolkit[slug].connected) });
}

async function sessionState(env) {
  const sessionId = String(env.COMPOSIO_SESSION_ID || '').trim();
  if (!sessionId) return json({ ok: false, configured: false, sessionPresent: false, phase: 'preview-read-only' }, 503);

  const r = await composioGet(env, `/tool_router/session/${encodeURIComponent(sessionId)}`);
  return json({
    ok: r.ok,
    configured: true,
    authenticated: r.status !== 401 && r.status !== 403,
    sessionPresent: r.ok,
    phase: 'preview-read-only',
    userId: USER_ID,
    toolkits: TOOLKITS,
    policy: { readOnlyTagsOnly: true, destructiveToolsDisabled: true, connectionMetaToolsDisabled: true, sandboxDisabled: true, instantUsageDisabled: true, productionTouched: false },
    error: r.ok ? null : r.error,
  }, r.ok ? 200 : (r.status || 502));
}

async function createConnectLinks(env, sessionId) {
  const results = {};
  for (const toolkit of OAUTH_TOOLKITS) {
    const r = await composioPost(env, `/tool_router/session/${encodeURIComponent(sessionId)}/link`, { toolkit });
    results[toolkit] = {
      ok: r.ok,
      status: r.status,
      redirect_url: r.ok ? (r.data?.redirect_url || null) : null,
      connected_account_id: r.ok ? (r.data?.connected_account_id || null) : null,
      error: r.ok ? null : r.error,
    };
  }
  return results;
}

async function bootstrapSession(request, env) {
  const expected = String(env.BOOTSTRAP_TOKEN || '');
  const provided = String(request.headers.get('x-bootstrap-token') || '');
  if (!expected || !provided || expected !== provided) return json({ ok: false, error: 'forbidden' }, 403);

  let sessionId = String(env.COMPOSIO_SESSION_ID || '').trim();
  let created = false;
  if (sessionId) {
    const check = await composioGet(env, `/tool_router/session/${encodeURIComponent(sessionId)}`);
    if (!check.ok) sessionId = '';
  }

  if (!sessionId) {
    const r = await composioPost(env, '/tool_router/session', {
      user_id: USER_ID,
      toolkits: { enable: TOOLKITS },
      tags: { enable: ['readOnlyHint'], disable: ['destructiveHint'] },
      manage_connections: { enable: false, enable_connection_removal: false },
      sandbox: { enable: false },
      premium_usage: false,
    });

    sessionId = r.data?.session_id;
    if (!r.ok || !sessionId) {
      return json({ ok: false, created: false, status: r.status, error: r.error || 'session_id_missing', details: r.data || null }, r.status || 502);
    }
    created = true;
  }

  const links = await createConnectLinks(env, sessionId);
  const linksOk = OAUTH_TOOLKITS.every(toolkit => links[toolkit]?.ok && links[toolkit]?.redirect_url);
  return json({
    ok: linksOk,
    created,
    session_id: sessionId,
    phase: 'preview-read-only',
    userId: USER_ID,
    toolkits: TOOLKITS,
    oauth_toolkits: OAUTH_TOOLKITS,
    links,
  }, linksOk ? (created ? 201 : 200) : 502);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/bootstrap/session') return bootstrapSession(request, env);
    if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405);

    if (url.pathname === '/' || url.pathname === '/health') {
      return json({ ok: true, service: 'AstroVip Composio Auto-Pilot Preview', phase: 'preview-read-only', configured: Boolean(env.COMPOSIO_API_KEY), sessionConfigured: Boolean(env.COMPOSIO_SESSION_ID), productionTouched: false });
    }
    if (url.pathname === '/status') return status(env);
    if (url.pathname === '/connections') return connections(env);
    if (url.pathname === '/session-state') return sessionState(env);
    return json({ ok: false, error: 'not_found' }, 404);
  },
};
