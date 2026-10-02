const REPO = 'astrovip33-hub/astrovip';
const DEPLOY_WORKFLOW = 'deploy-cloudflare-worker.yml';
const GITHUB_API = 'https://api.github.com';

const enc = new TextEncoder();

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

function authToken(request) {
  const h = request.headers.get('authorization') || '';
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1].trim() : '';
}

function isAuthorized(request, env) {
  return Boolean(env.COMMAND_CENTER_TOKEN) && safeEqual(authToken(request), String(env.COMMAND_CENTER_TOKEN));
}

function unauthorized() {
  return json({ ok: false, error: 'unauthorized' }, 401, { 'www-authenticate': 'Bearer realm="AstroVip Command Center"' });
}

function githubHeaders(token) {
  const h = {
    'accept': 'application/vnd.github+json',
    'x-github-api-version': '2022-11-28',
    'user-agent': 'AstroVip-Command-Center/3.0',
  };
  if (token) h.authorization = `Bearer ${token}`;
  return h;
}

async function githubJson(path, { token, method = 'GET', body } = {}) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    method,
    headers: {
      ...githubHeaders(token),
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return { ok: true, status: 204, data: null };
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { message: text.slice(0, 500) }; }
  return { ok: res.ok, status: res.status, data };
}

async function githubStatus(env) {
  const token = env.GITHUB_ADMIN_TOKEN || '';
  const [commitRes, runRes] = await Promise.all([
    githubJson(`/repos/${REPO}/commits/main`, { token }),
    githubJson(`/repos/${REPO}/actions/workflows/${DEPLOY_WORKFLOW}/runs?per_page=1`, { token }),
  ]);
  const c = commitRes.data || {};
  const run = runRes.data?.workflow_runs?.[0] || null;
  return {
    repo: REPO,
    commit: commitRes.ok ? {
      sha: c.sha || null,
      shortSha: c.sha ? c.sha.slice(0, 7) : null,
      message: c.commit?.message?.split('\n')[0] || null,
      date: c.commit?.committer?.date || null,
      url: c.html_url || null,
    } : null,
    deploy: run ? {
      id: run.id,
      status: run.status,
      conclusion: run.conclusion,
      event: run.event,
      branch: run.head_branch,
      sha: run.head_sha,
      createdAt: run.created_at,
      updatedAt: run.updated_at,
      url: run.html_url,
    } : null,
    apiOk: commitRes.ok && runRes.ok,
  };
}

async function dispatchDeploy(env) {
  if (!env.GITHUB_ADMIN_TOKEN) {
    return { ok: false, status: 503, error: 'github_admin_token_not_configured' };
  }
  const r = await githubJson(`/repos/${REPO}/actions/workflows/${DEPLOY_WORKFLOW}/dispatches`, {
    token: env.GITHUB_ADMIN_TOKEN,
    method: 'POST',
    body: { ref: 'main' },
  });
  if (!r.ok) return { ok: false, status: r.status, error: r.data?.message || 'github_dispatch_failed' };
  return { ok: true, status: 204 };
}

function pemToArrayBuffer(pem) {
  const b64 = String(pem || '')
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');
  const raw = atob(b64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes.buffer;
}

function base64Url(input) {
  const bytes = typeof input === 'string' ? enc.encode(input) : new Uint8Array(input);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64Std(input) {
  const bytes = typeof input === 'string' ? enc.encode(input) : new Uint8Array(input);
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function cleanString(value, max = 160) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

function safeEditorUrl(value, { allowEmpty = true } = {}) {
  const v = cleanString(value, 700);
  if (!v && allowEmpty) return '';
  if (v.startsWith('/')) return v;
  try {
    const u = new URL(v);
    if (u.protocol === 'https:' || u.protocol === 'http:') return u.href;
  } catch {}
  return '';
}

function sanitizeEditorConfig(input) {
  const h = input?.hero || {};
  const r = input?.ribbon || {};
  const s = input?.sections || {};
  const labels = Array.from({ length: 4 }, (_, i) => cleanString(h.labels?.[i] ?? '', 40));
  const items = Array.from({ length: 4 }, (_, i) => ({
    title: cleanString(r.items?.[i]?.title ?? '', 48),
    subtitle: cleanString(r.items?.[i]?.subtitle ?? '', 60),
  }));
  const accent = /^#[0-9a-f]{6}$/i.test(String(h.frameAccent || '')) ? String(h.frameAccent) : '#f0cf67';
  return {
    version: 1,
    hero: {
      labels,
      titleMain: cleanString(h.titleMain, 48),
      titlePremium: cleanString(h.titlePremium, 48),
      subtitle: cleanString(h.subtitle, 120),
      buttonText: cleanString(h.buttonText, 60),
      buttonUrl: safeEditorUrl(h.buttonUrl, { allowEmpty: false }),
      sideLeft: cleanString(h.sideLeft, 120),
      sideRight: cleanString(h.sideRight, 120),
      bottomText: cleanString(h.bottomText, 140),
      image: safeEditorUrl(h.image),
      frameAccent: accent,
      frameWidth: Math.max(0, Math.min(6, Number(h.frameWidth) || 1)),
    },
    ribbon: {
      visible: r.visible !== false,
      cap: cleanString(r.cap, 60),
      items,
    },
    sections: {
      planets: s.planets !== false,
      freeQuestion: s.freeQuestion !== false,
      opportunities: s.opportunities !== false,
    },
  };
}

async function readEditorConfig(request, env) {
  const assetUrl = new URL('/assets/site-editor-config.json', request.url);
  const res = await env.ASSETS.fetch(new Request(assetUrl, { method: 'GET' }));
  if (!res.ok) throw new Error('editor_config_not_found');
  return res.json();
}

async function publishEditorConfig(env, input) {
  if (!env.GITHUB_ADMIN_TOKEN) return { ok: false, status: 503, error: 'github_admin_token_not_configured' };
  const config = sanitizeEditorConfig(input);
  if (!config.hero.buttonUrl) return { ok: false, status: 400, error: 'invalid_button_url' };
  const path = 'assets/site-editor-config.json';
  const meta = await githubJson(`/repos/${REPO}/contents/${path}?ref=main`, { token: env.GITHUB_ADMIN_TOKEN });
  if (!meta.ok || !meta.data?.sha) return { ok: false, status: meta.status || 502, error: meta.data?.message || 'editor_config_metadata_failed' };
  const put = await githubJson(`/repos/${REPO}/contents/${path}`, {
    token: env.GITHUB_ADMIN_TOKEN,
    method: 'PUT',
    body: {
      message: 'Update homepage from AstroVip Visual Editor',
      content: base64Std(JSON.stringify(config, null, 2) + '\n'),
      sha: meta.data.sha,
      branch: 'main',
    },
  });
  if (!put.ok) return { ok: false, status: put.status || 502, error: put.data?.message || 'editor_publish_failed' };
  return {
    ok: true,
    config,
    commit: {
      sha: put.data?.commit?.sha || null,
      url: put.data?.commit?.html_url || null,
    },
  };
}

async function googleAccessToken(env, scopes) {
  if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) throw new Error('google_service_account_not_configured');
  let sa;
  try { sa = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON); }
  catch { throw new Error('google_service_account_json_invalid'); }
  if (!sa.client_email || !sa.private_key) throw new Error('google_service_account_json_incomplete');

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64Url(JSON.stringify({
    iss: sa.client_email,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    iat: now - 30,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${claims}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(unsigned));
  const assertion = `${unsigned}.${base64Url(signature)}`;
  const form = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(data.error_description || data.error || 'google_token_failed');
  return data.access_token;
}

function isoDate(d) { return d.toISOString().slice(0, 10); }
function gscRange() {
  const end = new Date(Date.now() - 3 * 86400000);
  const start = new Date(end.getTime() - 27 * 86400000);
  return { startDate: isoDate(start), endDate: isoDate(end) };
}

async function gscData(env) {
  const siteUrl = env.GSC_SITE_URL || 'sc-domain:astrovip.ro';
  const token = await googleAccessToken(env, ['https://www.googleapis.com/auth/webmasters.readonly']);
  const range = gscRange();
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
  const [summaryRes, queriesRes] = await Promise.all([
    fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ ...range, rowLimit: 1 }) }),
    fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ ...range, dimensions: ['query'], rowLimit: 50, dataState: 'final' }) }),
  ]);
  const summaryJson = await summaryRes.json().catch(() => ({}));
  const queriesJson = await queriesRes.json().catch(() => ({}));
  if (!summaryRes.ok) throw new Error(summaryJson.error?.message || `gsc_summary_http_${summaryRes.status}`);
  if (!queriesRes.ok) throw new Error(queriesJson.error?.message || `gsc_queries_http_${queriesRes.status}`);
  const s = summaryJson.rows?.[0] || {};
  return {
    siteUrl,
    range,
    summary: {
      clicks: s.clicks ?? 0,
      impressions: s.impressions ?? 0,
      ctr: s.ctr ?? 0,
      position: s.position ?? 0,
    },
    queries: (queriesJson.rows || []).map(r => ({
      query: r.keys?.[0] || '',
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
    })),
  };
}

function metricMap(report) {
  const names = (report.metricHeaders || []).map(x => x.name);
  const vals = report.rows?.[0]?.metricValues || [];
  const out = {};
  names.forEach((n, i) => { out[n] = Number(vals[i]?.value || 0); });
  return out;
}

async function ga4Data(env) {
  if (!env.GA4_PROPERTY_ID) throw new Error('ga4_property_id_not_configured');
  const propertyId = String(env.GA4_PROPERTY_ID).replace(/^properties\//, '');
  const token = await googleAccessToken(env, ['https://www.googleapis.com/auth/analytics.readonly']);
  const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };
  const [reportRes, realtimeRes] = await Promise.all([
    fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`, {
      method: 'POST', headers,
      body: JSON.stringify({
        dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'keyEvents' },
          { name: 'transactions' },
          { name: 'totalRevenue' },
        ],
      }),
    }),
    fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runRealtimeReport`, {
      method: 'POST', headers,
      body: JSON.stringify({ metrics: [{ name: 'activeUsers' }] }),
    }),
  ]);
  const report = await reportRes.json().catch(() => ({}));
  const realtime = await realtimeRes.json().catch(() => ({}));
  if (!reportRes.ok) throw new Error(report.error?.message || `ga4_report_http_${reportRes.status}`);
  if (!realtimeRes.ok) throw new Error(realtime.error?.message || `ga4_realtime_http_${realtimeRes.status}`);
  return {
    propertyId,
    period: '28daysAgo..yesterday',
    metrics: metricMap(report),
    realtime: { activeUsers: metricMap(realtime).activeUsers || 0 },
  };
}

async function backupRepo(env) {
  const headers = env.GITHUB_ADMIN_TOKEN ? githubHeaders(env.GITHUB_ADMIN_TOKEN) : { 'user-agent': 'AstroVip-Command-Center/3.0' };
  const url = `https://codeload.github.com/${REPO}/zip/refs/heads/main`;
  const res = await fetch(url, { headers });
  if (!res.ok) return json({ ok: false, error: `backup_http_${res.status}` }, 502);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const h = new Headers(res.headers);
  h.set('content-disposition', `attachment; filename="astrovip-backup-${stamp}.zip"`);
  h.set('cache-control', 'no-store');
  h.set('x-content-type-options', 'nosniff');
  return new Response(res.body, { status: 200, headers: h });
}

export async function handleCommandCenter(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/command/')) return null;

  if (!isAuthorized(request, env)) return unauthorized();

  try {
    if (url.pathname === '/api/command/ping') {
      return json({ ok: true, serverTime: new Date().toISOString(), version: 3 });
    }

    if (url.pathname === '/api/command/overview') {
      const github = await githubStatus(env).catch(e => ({ apiOk: false, error: String(e?.message || e) }));
      return json({
        ok: true,
        version: 3,
        serverTime: new Date().toISOString(),
        integrations: {
          githubDeploy: Boolean(env.GITHUB_ADMIN_TOKEN),
          googleServiceAccount: Boolean(env.GOOGLE_SERVICE_ACCOUNT_JSON),
          gsc: Boolean(env.GOOGLE_SERVICE_ACCOUNT_JSON),
          ga4: Boolean(env.GOOGLE_SERVICE_ACCOUNT_JSON && env.GA4_PROPERTY_ID),
          metricool: false,
          googleAds: false,
          driveAutoBackup: false,
        },
        github,
      });
    }

    if (url.pathname === '/api/command/github') {
      return json({ ok: true, ...(await githubStatus(env)) });
    }

    if (url.pathname === '/api/command/editor-config') {
      if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'GET' });
      return json({ ok: true, config: sanitizeEditorConfig(await readEditorConfig(request, env)) });
    }

    if (url.pathname === '/api/command/editor-publish') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'POST' });
      const len = Number(request.headers.get('content-length') || 0);
      if (len > 100000) return json({ ok: false, error: 'payload_too_large' }, 413);
      const body = await request.json().catch(() => null);
      if (!body || typeof body !== 'object') return json({ ok: false, error: 'invalid_json' }, 400);
      const result = await publishEditorConfig(env, body);
      return json(result, result.ok ? 202 : (result.status || 500));
    }

    if (url.pathname === '/api/command/deploy') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'POST' });
      const result = await dispatchDeploy(env);
      if (!result.ok) return json(result, result.status || 500);
      return json({ ok: true, dispatched: true, workflow: DEPLOY_WORKFLOW }, 202);
    }

    if (url.pathname === '/api/command/backup') {
      if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'GET' });
      return backupRepo(env);
    }

    if (url.pathname === '/api/command/gsc') {
      if (!env.GOOGLE_SERVICE_ACCOUNT_JSON) return json({ ok: false, configured: false, error: 'google_service_account_not_configured' }, 503);
      return json({ ok: true, configured: true, data: await gscData(env) });
    }

    if (url.pathname === '/api/command/ga4') {
      if (!env.GOOGLE_SERVICE_ACCOUNT_JSON || !env.GA4_PROPERTY_ID) {
        return json({ ok: false, configured: false, error: !env.GOOGLE_SERVICE_ACCOUNT_JSON ? 'google_service_account_not_configured' : 'ga4_property_id_not_configured' }, 503);
      }
      return json({ ok: true, configured: true, data: await ga4Data(env) });
    }

    return json({ ok: false, error: 'not_found' }, 404);
  } catch (e) {
    return json({ ok: false, error: String(e?.message || e) }, 500);
  }
}
