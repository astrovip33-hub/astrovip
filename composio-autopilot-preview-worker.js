const COMPOSIO_BASE = 'https://backend.composio.dev/api/v3.1';
const TOOLKITS = ['github', 'cloudflare', 'google_search_console', 'googlesheets'];
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

async function composioGet(env, path) {
  const key = String(env.COMPOSIO_API_KEY || '').trim();
  if (!key) return { ok: false, status: 503, error: 'composio_api_key_not_configured' };

  const res = await fetch(`${COMPOSIO_BASE}${path}`, {
    headers: {
      'x-api-key': key,
      'accept': 'application/json',
      'user-agent': 'AstroVip-Composio-Preview/1.1',
    },
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

async function status(env) {
  if (!env.COMPOSIO_API_KEY) {
    return json({
      ok: false,
      configured: false,
      phase: 'preview-read-only',
      toolkits: TOOLKITS,
      error: 'composio_api_key_not_configured',
    }, 503);
  }

  const checks = await Promise.all(
    TOOLKITS.map(async slug => {
      const r = await composioGet(env, `/toolkits/${encodeURIComponent(slug)}`);
      return {
        slug,
        available: r.ok,
        status: r.status,
        name: r.ok ? (r.data?.name || r.data?.display_name || slug) : null,
        error: r.ok ? null : r.error,
      };
    })
  );

  const authenticated = checks.some(x => x.status !== 401 && x.status !== 403);
  const allAvailable = checks.every(x => x.available);

  return json({
    ok: authenticated && allAvailable,
    configured: true,
    authenticated,
    phase: 'preview-read-only',
    policy: {
      directMainWrites: false,
      automaticProductionDeploy: false,
      dnsWrites: false,
      deletes: false,
    },
    toolkits: checks,
  }, authenticated && allAvailable ? 200 : 502);
}

async function connections(env) {
  if (!env.COMPOSIO_API_KEY) {
    return json({ ok: false, configured: false, error: 'composio_api_key_not_configured' }, 503);
  }

  const params = new URLSearchParams();
  for (const slug of TOOLKITS) params.append('toolkit_slugs', slug);
  params.append('limit', '100');
  const r = await composioGet(env, `/connected_accounts?${params.toString()}`);
  if (!r.ok) {
    return json({ ok: false, configured: true, authenticated: ![401, 403].includes(r.status), error: r.error, status: r.status }, r.status || 502);
  }

  const items = Array.isArray(r.data?.items) ? r.data.items : [];
  const relevant = items.filter(item => TOOLKITS.includes(String(item?.toolkit?.slug || '').toLowerCase()));
  const byToolkit = Object.fromEntries(TOOLKITS.map(slug => {
    const accounts = relevant.filter(item => String(item?.toolkit?.slug || '').toLowerCase() === slug);
    const active = accounts.filter(item => item?.status === 'ACTIVE' && item?.is_disabled !== true);
    return [slug, {
      connected: active.length > 0,
      activeCount: active.length,
      totalCount: accounts.length,
      statuses: [...new Set(accounts.map(item => item?.status).filter(Boolean))],
    }];
  }));

  return json({
    ok: true,
    configured: true,
    authenticated: true,
    userIdTarget: USER_ID,
    phase: 'preview-read-only',
    connections: byToolkit,
    ready: TOOLKITS.every(slug => byToolkit[slug].connected),
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405);

    if (url.pathname === '/' || url.pathname === '/health') {
      return json({
        ok: true,
        service: 'AstroVip Composio Auto-Pilot Preview',
        phase: 'preview-read-only',
        configured: Boolean(env.COMPOSIO_API_KEY),
        productionTouched: false,
      });
    }

    if (url.pathname === '/status') return status(env);
    if (url.pathname === '/connections') return connections(env);

    return json({ ok: false, error: 'not_found' }, 404);
  },
};
