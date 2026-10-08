const COMPOSIO_BASE = 'https://backend.composio.dev/api/v3.1';
const TOOLKITS = ['github', 'cloudflare', 'google_search_console', 'googlesheets'];

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
      'user-agent': 'AstroVip-Composio-Preview/1.0',
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

    return json({ ok: false, error: 'not_found' }, 404);
  },
};
