import { handleCommandCenter as handleV3 } from './command-center-api-v3.js';

const REPO = 'astrovip33-hub/astrovip';
const SERANKING_API = 'https://api.seranking.com';
const COMPOSIO_API = 'https://backend.composio.dev/api/v3.1';
const COMPOSIO_USER = 'astrovip-admin';
const GSC_TOOLKIT = 'google_search_console';
const GA4_TOOLKIT = 'google_analytics';

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      ...headers,
    },
  });
}

function has(env, name) {
  return Boolean(String(env?.[name] || '').trim());
}

function googleOauthReady(env) {
  return has(env, 'GOOGLE_OAUTH_CLIENT_ID') &&
    has(env, 'GOOGLE_OAUTH_CLIENT_SECRET') &&
    has(env, 'GOOGLE_OAUTH_REFRESH_TOKEN');
}

function googleServiceReady(env) {
  return has(env, 'GOOGLE_SERVICE_ACCOUNT_JSON');
}

async function authGate(request, env) {
  const u = new URL(request.url);
  u.pathname = '/api/command/ping';
  u.search = '';
  return handleV3(new Request(u.toString(), {
    method: 'GET',
    headers: request.headers,
  }), env);
}

async function composioFetch(env, path, { method = 'GET', body } = {}) {
  if (!has(env, 'COMPOSIO_API_KEY')) {
    return { ok: false, status: 503, data: { error: 'composio_api_key_not_configured' } };
  }
  const res = await fetch(`${COMPOSIO_API}${path}`, {
    method,
    headers: {
      'x-api-key': String(env.COMPOSIO_API_KEY).trim(),
      'accept': 'application/json',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(async () => ({ message: (await res.text().catch(() => '')).slice(0, 500) }));
  return { ok: res.ok, status: res.status, data };
}

function composioUser(env) {
  return String(env.COMPOSIO_USER_ID || COMPOSIO_USER).trim();
}

async function composioConnectedAccounts(env, toolkitSlugs = [GSC_TOOLKIT, GA4_TOOLKIT]) {
  if (!has(env, 'COMPOSIO_API_KEY')) return [];
  const q = new URLSearchParams();
  toolkitSlugs.forEach(x => q.append('toolkit_slugs', x));
  q.append('statuses', 'ACTIVE');
  q.append('user_ids', composioUser(env));
  q.set('limit', '100');
  const r = await composioFetch(env, `/connected_accounts?${q}`);
  if (!r.ok) throw new Error(r.data?.message || r.data?.error || `composio_accounts_http_${r.status}`);
  return Array.isArray(r.data?.items) ? r.data.items : [];
}

function accountToolkitSlug(account) {
  return String(account?.toolkit?.slug || account?.toolkit_slug || '');
}

function accountSummary(account) {
  return account ? {
    id: account.id || null,
    status: account.status || null,
    toolkit: accountToolkitSlug(account),
    alias: account.alias || null,
    updatedAt: account.updated_at || account.updatedAt || null,
  } : null;
}

async function composioGoogleStatus(env) {
  if (!has(env, 'COMPOSIO_API_KEY')) {
    return {
      configured: false,
      gsc: { connected: false, account: null },
      ga4: { connected: false, account: null },
    };
  }
  const accounts = await composioConnectedAccounts(env);
  const gsc = accounts.find(x => accountToolkitSlug(x) === GSC_TOOLKIT) || null;
  const ga4 = accounts.find(x => accountToolkitSlug(x) === GA4_TOOLKIT) || null;
  return {
    configured: true,
    userId: composioUser(env),
    gsc: { connected: Boolean(gsc), account: accountSummary(gsc) },
    ga4: { connected: Boolean(ga4), account: accountSummary(ga4) },
  };
}

async function composioAuthConfig(env, toolkit) {
  const q = new URLSearchParams({ toolkit_slug: toolkit, is_composio_managed: 'true', limit: '100' });
  let r = await composioFetch(env, `/auth_configs?${q}`);
  if (!r.ok) throw new Error(r.data?.message || r.data?.error || `composio_auth_configs_http_${r.status}`);
  let config = (r.data?.items || []).find(x => String(x?.status || 'ENABLED') === 'ENABLED') || r.data?.items?.[0] || null;
  if (config?.id) return config;

  r = await composioFetch(env, '/auth_configs', {
    method: 'POST',
    body: { toolkit: { slug: toolkit } },
  });
  if (!r.ok) throw new Error(r.data?.message || r.data?.error || `composio_auth_config_create_http_${r.status}`);
  return r.data?.auth_config || r.data;
}

async function composioConnectLink(env, toolkit, callbackUrl) {
  const current = await composioConnectedAccounts(env, [toolkit]);
  const active = current.find(x => accountToolkitSlug(x) === toolkit) || null;
  if (active) return { toolkit, connected: true, account: accountSummary(active), redirectUrl: null };

  const cfg = await composioAuthConfig(env, toolkit);
  if (!cfg?.id) throw new Error(`composio_auth_config_missing_${toolkit}`);
  const r = await composioFetch(env, '/connected_accounts/link', {
    method: 'POST',
    body: {
      auth_config_id: cfg.id,
      user_id: composioUser(env),
      callback_url: callbackUrl,
    },
  });
  if (!r.ok) throw new Error(r.data?.message || r.data?.error || `composio_link_http_${r.status}`);
  return {
    toolkit,
    connected: false,
    connectedAccountId: r.data?.connected_account_id || r.data?.id || null,
    redirectUrl: r.data?.redirect_url || r.data?.redirectUrl || null,
    expiresAt: r.data?.expires_at || r.data?.expiresAt || null,
  };
}

async function composioProxy(env, connectedAccountId, endpoint, method, body) {
  const r = await composioFetch(env, '/tools/execute/proxy', {
    method: 'POST',
    body: {
      connected_account_id: connectedAccountId,
      endpoint,
      method,
      ...(body === undefined ? {} : { body }),
    },
  });
  if (!r.ok) throw new Error(r.data?.message || r.data?.error || `composio_proxy_http_${r.status}`);
  if (Number(r.data?.status || 200) >= 400) {
    throw new Error(r.data?.data?.error?.message || r.data?.data?.message || `provider_http_${r.data?.status}`);
  }
  return r.data?.data ?? r.data;
}

function isoDate(d) { return d.toISOString().slice(0, 10); }
function gscRange() {
  const end = new Date(Date.now() - 3 * 86400000);
  const start = new Date(end.getTime() - 27 * 86400000);
  return { startDate: isoDate(start), endDate: isoDate(end) };
}

async function gscViaComposio(env) {
  const status = await composioGoogleStatus(env);
  const ca = status.gsc.account;
  if (!ca?.id) throw new Error('composio_gsc_not_connected');
  const siteUrl = String(env.GSC_SITE_URL || 'sc-domain:astrovip.ro');
  const range = gscRange();
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const [summaryJson, queriesJson] = await Promise.all([
    composioProxy(env, ca.id, endpoint, 'POST', { ...range, rowLimit: 1 }),
    composioProxy(env, ca.id, endpoint, 'POST', { ...range, dimensions: ['query'], rowLimit: 50, dataState: 'final' }),
  ]);
  const s = summaryJson?.rows?.[0] || {};
  return {
    siteUrl,
    range,
    auth: 'composio',
    summary: {
      clicks: s.clicks ?? 0,
      impressions: s.impressions ?? 0,
      ctr: s.ctr ?? 0,
      position: s.position ?? 0,
    },
    queries: (queriesJson?.rows || []).map(r => ({
      query: r.keys?.[0] || '',
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
    })),
  };
}

function metricMap(report) {
  const names = (report?.metricHeaders || []).map(x => x.name);
  const vals = report?.rows?.[0]?.metricValues || [];
  const out = {};
  names.forEach((n, i) => { out[n] = Number(vals[i]?.value || 0); });
  return out;
}

async function discoverGa4Property(env, connectedAccountId) {
  if (has(env, 'GA4_PROPERTY_ID')) return String(env.GA4_PROPERTY_ID).replace(/^properties\//, '');
  const data = await composioProxy(
    env,
    connectedAccountId,
    'https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200',
    'GET',
  );
  const props = [];
  for (const account of data?.accountSummaries || []) {
    for (const p of account?.propertySummaries || []) {
      props.push({
        id: String(p.property || '').replace(/^properties\//, ''),
        displayName: p.displayName || '',
        parent: account.account || null,
      });
    }
  }
  const chosen = props.find(p => /astrovip/i.test(p.displayName)) || props[0];
  if (!chosen?.id) throw new Error('ga4_property_not_found');
  return chosen.id;
}

async function ga4ViaComposio(env) {
  const status = await composioGoogleStatus(env);
  const ca = status.ga4.account;
  if (!ca?.id) throw new Error('composio_ga4_not_connected');
  const propertyId = await discoverGa4Property(env, ca.id);
  const [report, realtime] = await Promise.all([
    composioProxy(env, ca.id, `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`, 'POST', {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'keyEvents' },
        { name: 'transactions' },
        { name: 'totalRevenue' },
      ],
    }),
    composioProxy(env, ca.id, `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runRealtimeReport`, 'POST', {
      metrics: [{ name: 'activeUsers' }],
    }),
  ]);
  return {
    propertyId,
    period: '28daysAgo..yesterday',
    auth: 'composio',
    metrics: metricMap(report),
    realtime: { activeUsers: metricMap(realtime).activeUsers || 0 },
  };
}

function authMissing(env) {
  if (googleServiceReady(env) || googleOauthReady(env) || has(env, 'COMPOSIO_API_KEY')) return [];
  return ['GOOGLE_SERVICE_ACCOUNT_JSON, Google OAuth sau Composio'];
}

function extendedIntegrations(env, base = {}, google = null) {
  const googleAuth = googleOauthReady(env) || googleServiceReady(env);
  return {
    ...base,
    composio: has(env, 'COMPOSIO_API_KEY'),
    seranking: has(env, 'SERANKING_API_KEY'),
    gsc: Boolean(base.gsc || google?.gsc?.connected),
    ga4: Boolean(base.ga4 || google?.ga4?.connected),
    googleAds: Boolean(base.googleAds || (googleAuth && has(env, 'GOOGLE_ADS_CUSTOMER_ID'))),
    driveAutoBackup: Boolean(
      base.driveAutoBackup ||
      (has(env, 'DRIVE_BACKUP_FOLDER_ID') && (googleOauthReady(env) || googleServiceReady(env)))
    ),
    ga4Purchase: has(env, 'GA4_API_SECRET'),
  };
}

function extendedDetails(env, base = {}, google = null) {
  const status = extendedIntegrations(env, base, google);
  const missing = (...names) => names.filter(name => !has(env, name));
  const googleAuthMissing = authMissing(env);
  return {
    ...base,
    composio: {
      connected: status.composio,
      required: ['COMPOSIO_API_KEY'],
      missing: missing('COMPOSIO_API_KEY'),
      note: 'Composio gestionează OAuth fără a expune tokenurile providerului în Command Center.',
    },
    gsc: {
      ...(base.gsc || {}),
      connected: status.gsc,
      required: ['Google Search Console via service account sau Composio OAuth'],
      missing: status.gsc ? [] : ['Conectează Google Search Console din /command-center/google/'],
      note: google?.gsc?.connected ? 'Conectat prin Composio OAuth.' : (base.gsc?.note || 'Poate folosi service account sau Composio OAuth.'),
    },
    ga4: {
      ...(base.ga4 || {}),
      connected: status.ga4,
      required: ['Google Analytics via service account sau Composio OAuth'],
      missing: status.ga4 ? [] : ['Conectează Google Analytics din /command-center/google/'],
      note: google?.ga4?.connected ? 'Conectat prin Composio OAuth; proprietatea poate fi detectată automat.' : (base.ga4?.note || 'Poate folosi service account sau Composio OAuth.'),
    },
    seranking: {
      connected: status.seranking,
      required: ['SERANKING_API_KEY'],
      missing: missing('SERANKING_API_KEY'),
    },
    googleAds: {
      connected: status.googleAds,
      required: ['GOOGLE_ADS_CUSTOMER_ID', 'Google service account/OAuth'],
      missing: [...missing('GOOGLE_ADS_CUSTOMER_ID'), ...googleAuthMissing],
    },
    driveAutoBackup: {
      connected: status.driveAutoBackup,
      required: ['DRIVE_BACKUP_FOLDER_ID', 'Google service account/OAuth'],
      missing: [...missing('DRIVE_BACKUP_FOLDER_ID'), ...(status.driveAutoBackup ? [] : googleAuthMissing)],
    },
    ga4Purchase: {
      connected: status.ga4Purchase,
      required: ['GA4_API_SECRET'],
      missing: missing('GA4_API_SECRET'),
    },
  };
}

async function augmentLegacy(response, env, type) {
  if (!response || !response.ok) return response;
  const data = await response.json();
  let google = null;
  if (has(env, 'COMPOSIO_API_KEY')) {
    try { google = await composioGoogleStatus(env); } catch {}
  }
  if (type === 'overview') {
    data.version = 5;
    data.integrations = extendedIntegrations(env, data.integrations || {}, google);
    data.integrationDetails = extendedDetails(env, data.integrationDetails || {}, google);
    data.capabilities = {
      visualEditor: true,
      deploy: Boolean(data.integrations.githubDeploy),
      gscLive: Boolean(data.integrations.gsc),
      ga4Live: Boolean(data.integrations.ga4),
      seRankingLive: Boolean(data.integrations.seranking),
      driveBackup: Boolean(data.integrations.driveAutoBackup),
      composio: Boolean(data.integrations.composio),
      googleConnect: Boolean(data.integrations.composio),
    };
  } else {
    data.integrations = extendedIntegrations(env, data.integrations || {}, google);
    data.details = extendedDetails(env, data.details || {}, google);
  }
  return json(data, response.status);
}

async function seRankingData(env) {
  if (!has(env, 'SERANKING_API_KEY')) {
    return { ok: false, status: 503, error: 'seranking_api_key_not_configured' };
  }
  const headers = {
    authorization: `Token ${String(env.SERANKING_API_KEY).trim()}`,
    accept: 'application/json',
  };
  const [profileRes, sitesRes] = await Promise.all([
    fetch(`${SERANKING_API}/v1/project-management/users/me`, { headers }),
    fetch(`${SERANKING_API}/v1/project-management/sites`, { headers }),
  ]);
  const profile = await profileRes.json().catch(() => ({}));
  const sitesJson = await sitesRes.json().catch(() => ([]));
  if (!profileRes.ok) return { ok: false, status: profileRes.status, error: profile?.detail || profile?.message || `seranking_profile_http_${profileRes.status}` };
  if (!sitesRes.ok) return { ok: false, status: sitesRes.status, error: sitesJson?.detail || sitesJson?.message || `seranking_sites_http_${sitesRes.status}` };
  const projects = Array.isArray(sitesJson) ? sitesJson : Array.isArray(sitesJson?.results) ? sitesJson.results : Array.isArray(sitesJson?.sites) ? sitesJson.sites : [];
  const project = projects.find(p => /astrovip/i.test(String(p?.title || p?.name || ''))) || projects.find(p => p?.is_active !== false) || projects[0] || null;
  const safeProject = project ? {
    id: project.id ?? null,
    title: project.title || project.name || 'AstroVip',
    name: project.name || project.title || 'AstroVip',
    isActive: project.is_active ?? project.isActive ?? null,
    checkFreq: project.check_freq ?? project.checkFreq ?? null,
    keywordCount: project.keyword_count ?? project.keywordCount ?? null,
    guestLink: project.guest_link ?? project.guestLink ?? null,
  } : null;
  return {
    ok: true,
    configured: true,
    projectsCount: projects.length,
    project: safeProject,
    account: { email: profile?.email || null, id: profile?.id || null },
  };
}

const enc = new TextEncoder();
function pemToArrayBuffer(pem) {
  const b64 = String(pem || '').replace(/-----BEGIN PRIVATE KEY-----/g, '').replace(/-----END PRIVATE KEY-----/g, '').replace(/\s/g, '');
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
async function serviceAccountToken(env, scopes) {
  let sa;
  try { sa = JSON.parse(String(env.GOOGLE_SERVICE_ACCOUNT_JSON || '')); }
  catch { throw new Error('google_service_account_json_invalid'); }
  if (!sa?.client_email || !sa?.private_key) throw new Error('google_service_account_json_incomplete');
  const now = Math.floor(Date.now() / 1000);
  const claims = { iss: sa.client_email, scope: scopes.join(' '), aud: 'https://oauth2.googleapis.com/token', iat: now - 30, exp: now + 3600 };
  if (has(env, 'GOOGLE_IMPERSONATE_USER')) claims.sub = String(env.GOOGLE_IMPERSONATE_USER).trim();
  const unsigned = `${base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64Url(JSON.stringify(claims))}`;
  const key = await crypto.subtle.importKey('pkcs8', pemToArrayBuffer(sa.private_key), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(unsigned));
  const form = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${base64Url(sig)}` });
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(data.error_description || data.error || 'google_token_failed');
  return data.access_token;
}
async function oauthRefreshToken(env) {
  const form = new URLSearchParams({
    client_id: String(env.GOOGLE_OAUTH_CLIENT_ID || ''),
    client_secret: String(env.GOOGLE_OAUTH_CLIENT_SECRET || ''),
    refresh_token: String(env.GOOGLE_OAUTH_REFRESH_TOKEN || ''),
    grant_type: 'refresh_token',
  });
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(data.error_description || data.error || 'google_oauth_refresh_failed');
  return data.access_token;
}
async function googleUserToken(env, scopes) {
  if (googleOauthReady(env)) return oauthRefreshToken(env);
  if (googleServiceReady(env)) return serviceAccountToken(env, scopes);
  throw new Error('google_auth_not_configured');
}

async function driveBackup(env) {
  if (!has(env, 'DRIVE_BACKUP_FOLDER_ID')) return { ok: false, status: 503, error: 'drive_backup_folder_not_configured' };
  if (!googleOauthReady(env) && !googleServiceReady(env)) return { ok: false, status: 503, error: 'google_auth_not_configured' };
  const token = await googleUserToken(env, ['https://www.googleapis.com/auth/drive']);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const name = `astrovip-backup-${stamp}.zip`;
  const initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,webViewLink,size,createdTime', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json; charset=UTF-8', 'x-upload-content-type': 'application/zip' },
    body: JSON.stringify({ name, parents: [String(env.DRIVE_BACKUP_FOLDER_ID).trim()], description: `AstroVip main backup ${new Date().toISOString()}` }),
  });
  if (!initRes.ok) return { ok: false, status: initRes.status, error: 'drive_resumable_init_failed', detail: (await initRes.text()).slice(0, 500) };
  const uploadUrl = initRes.headers.get('location');
  if (!uploadUrl) return { ok: false, status: 502, error: 'drive_upload_location_missing' };
  const ghHeaders = { 'user-agent': 'AstroVip-Command-Center/5.0' };
  if (has(env, 'GITHUB_ADMIN_TOKEN')) ghHeaders.authorization = `Bearer ${String(env.GITHUB_ADMIN_TOKEN).trim()}`;
  const zipRes = await fetch(`https://codeload.github.com/${REPO}/zip/refs/heads/main`, { headers: ghHeaders });
  if (!zipRes.ok || !zipRes.body) return { ok: false, status: 502, error: `github_backup_http_${zipRes.status}` };
  const uploadHeaders = { 'content-type': 'application/zip' };
  const length = zipRes.headers.get('content-length');
  if (length) uploadHeaders['content-length'] = length;
  const uploadRes = await fetch(uploadUrl, { method: 'PUT', headers: uploadHeaders, body: zipRes.body });
  const file = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok) return { ok: false, status: uploadRes.status, error: file?.error?.message || 'drive_upload_failed' };
  return { ok: true, file };
}

async function siteHealth() {
  const targets = [
    ['homepage', 'https://astrovip.ro/'],
    ['robots', 'https://astrovip.ro/robots.txt'],
    ['sitemap', 'https://astrovip.ro/sitemap.xml'],
    ['commandCenter', 'https://astrovip.ro/command-center/'],
  ];
  const results = await Promise.all(targets.map(async ([key, url]) => {
    const started = Date.now();
    try {
      const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}cc_health=${Date.now()}`, { method: 'GET', headers: { 'user-agent': 'AstroVip-Command-Center/5.0' } });
      return { key, url, ok: res.ok, status: res.status, ms: Date.now() - started, release: res.headers.get('x-astrovip-release') || null };
    } catch (e) {
      return { key, url, ok: false, status: 0, ms: Date.now() - started, error: String(e?.message || e) };
    }
  }));
  return { ok: results.every(x => x.ok), checkedAt: new Date().toISOString(), results };
}

export async function handleCommandCenter(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/command/')) return null;

  if (url.pathname === '/api/command/overview') {
    return augmentLegacy(await handleV3(request, env), env, 'overview');
  }
  if (url.pathname === '/api/command/integrations') {
    return augmentLegacy(await handleV3(request, env), env, 'integrations');
  }

  if (url.pathname === '/api/command/google-status') {
    const gate = await authGate(request, env);
    if (!gate?.ok) return gate;
    if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'GET' });
    try { return json({ ok: true, ...(await composioGoogleStatus(env)) }); }
    catch (e) { return json({ ok: false, error: String(e?.message || e) }, 502); }
  }

  if (url.pathname === '/api/command/google-connect') {
    const gate = await authGate(request, env);
    if (!gate?.ok) return gate;
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'POST' });
    if (!has(env, 'COMPOSIO_API_KEY')) return json({ ok: false, error: 'composio_api_key_not_configured' }, 503);
    const body = await request.json().catch(() => ({}));
    const toolkit = body?.toolkit === GA4_TOOLKIT ? GA4_TOOLKIT : body?.toolkit === GSC_TOOLKIT ? GSC_TOOLKIT : null;
    if (!toolkit) return json({ ok: false, error: 'invalid_google_toolkit' }, 400);
    const callbackUrl = `https://astrovip.ro/command-center/google/?connected=${encodeURIComponent(toolkit)}`;
    try {
      const result = await composioConnectLink(env, toolkit, callbackUrl);
      return json({ ok: true, ...result }, result.connected ? 200 : 201);
    } catch (e) {
      return json({ ok: false, error: String(e?.message || e) }, 502);
    }
  }

  if (url.pathname === '/api/command/gsc') {
    const gate = await authGate(request, env);
    if (!gate?.ok) return gate;
    if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'GET' });
    if (googleServiceReady(env)) return handleV3(request, env);
    try { return json({ ok: true, configured: true, data: await gscViaComposio(env) }); }
    catch (e) { return json({ ok: false, configured: false, error: String(e?.message || e) }, 503); }
  }

  if (url.pathname === '/api/command/ga4') {
    const gate = await authGate(request, env);
    if (!gate?.ok) return gate;
    if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'GET' });
    if (googleServiceReady(env) && has(env, 'GA4_PROPERTY_ID')) return handleV3(request, env);
    try { return json({ ok: true, configured: true, data: await ga4ViaComposio(env) }); }
    catch (e) { return json({ ok: false, configured: false, error: String(e?.message || e) }, 503); }
  }

  if (url.pathname === '/api/command/seranking') {
    const gate = await authGate(request, env);
    if (!gate?.ok) return gate;
    if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'GET' });
    const result = await seRankingData(env);
    return json(result, result.ok ? 200 : (result.status || 500));
  }

  if (url.pathname === '/api/command/backup-drive') {
    const gate = await authGate(request, env);
    if (!gate?.ok) return gate;
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'POST' });
    try {
      const result = await driveBackup(env);
      return json(result, result.ok ? 201 : (result.status || 500));
    } catch (e) {
      return json({ ok: false, error: String(e?.message || e) }, 500);
    }
  }

  if (url.pathname === '/api/command/site-health') {
    const gate = await authGate(request, env);
    if (!gate?.ok) return gate;
    if (request.method !== 'GET') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'GET' });
    return json(await siteHealth());
  }

  return handleV3(request, env);
}
