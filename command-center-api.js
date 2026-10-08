import { handleCommandCenter as handleV3 } from './command-center-api-v3.js';

const REPO = 'astrovip33-hub/astrovip';
const SERANKING_API = 'https://api.seranking.com';

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

function extendedIntegrations(env, base = {}) {
  const googleAuth = googleOauthReady(env) || googleServiceReady(env);
  return {
    ...base,
    composio: has(env, 'COMPOSIO_API_KEY'),
    seranking: has(env, 'SERANKING_API_KEY'),
    googleAds: Boolean(googleAuth && has(env, 'GOOGLE_ADS_CUSTOMER_ID')),
    driveAutoBackup: Boolean(
      has(env, 'DRIVE_BACKUP_FOLDER_ID') &&
      (googleOauthReady(env) || googleServiceReady(env))
    ),
    ga4Purchase: has(env, 'GA4_API_SECRET'),
  };
}

function authMissing(env) {
  if (googleServiceReady(env) || googleOauthReady(env)) return [];
  return ['GOOGLE_SERVICE_ACCOUNT_JSON sau Google OAuth refresh credentials'];
}

function extendedDetails(env, base = {}) {
  const status = extendedIntegrations(env, {});
  const missing = (...names) => names.filter(name => !has(env, name));
  const googleAuthMissing = authMissing(env);
  return {
    ...base,
    composio: {
      connected: status.composio,
      required: ['COMPOSIO_API_KEY'],
      missing: missing('COMPOSIO_API_KEY'),
    },
    seranking: {
      connected: status.seranking,
      required: ['SERANKING_API_KEY'],
      missing: missing('SERANKING_API_KEY'),
    },
    googleAds: {
      connected: status.googleAds,
      required: ['GOOGLE_ADS_CUSTOMER_ID', 'Google service account sau OAuth'],
      missing: [...missing('GOOGLE_ADS_CUSTOMER_ID'), ...googleAuthMissing],
      note: 'Google Ads API 2026: accesul este legat de proiectul Google Cloud; developer token nu mai este cerință de conectare în Command Center.',
    },
    driveAutoBackup: {
      connected: status.driveAutoBackup,
      required: ['DRIVE_BACKUP_FOLDER_ID', 'Google service account sau OAuth'],
      missing: [...missing('DRIVE_BACKUP_FOLDER_ID'), ...googleAuthMissing],
      note: 'Pentru foldere My Drive poate fi necesar OAuth sau impersonare Workspace; folderele Shared Drive funcționează cu supportsAllDrives.',
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
  if (type === 'overview') {
    data.version = 4;
    data.integrations = extendedIntegrations(env, data.integrations || {});
    data.integrationDetails = extendedDetails(env, data.integrationDetails || {});
    data.capabilities = {
      visualEditor: true,
      deploy: Boolean(data.integrations.githubDeploy),
      gscLive: Boolean(data.integrations.gsc),
      ga4Live: Boolean(data.integrations.ga4),
      seRankingLive: Boolean(data.integrations.seranking),
      driveBackup: Boolean(data.integrations.driveAutoBackup),
      composio: Boolean(data.integrations.composio),
    };
  } else {
    data.integrations = extendedIntegrations(env, data.integrations || {});
    data.details = extendedDetails(env, data.details || {});
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
  if (!profileRes.ok) {
    return { ok: false, status: profileRes.status, error: profile?.detail || profile?.message || `seranking_profile_http_${profileRes.status}` };
  }
  if (!sitesRes.ok) {
    return { ok: false, status: sitesRes.status, error: sitesJson?.detail || sitesJson?.message || `seranking_sites_http_${sitesRes.status}` };
  }
  const projects = Array.isArray(sitesJson) ? sitesJson :
    Array.isArray(sitesJson?.results) ? sitesJson.results :
    Array.isArray(sitesJson?.sites) ? sitesJson.sites : [];
  const project = projects.find(p => /astrovip/i.test(String(p?.title || p?.name || ''))) ||
    projects.find(p => p?.is_active !== false) ||
    projects[0] || null;
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
    account: {
      email: profile?.email || null,
      id: profile?.id || null,
    },
  };
}

const enc = new TextEncoder();

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

async function serviceAccountToken(env, scopes) {
  let sa;
  try { sa = JSON.parse(String(env.GOOGLE_SERVICE_ACCOUNT_JSON || '')); }
  catch { throw new Error('google_service_account_json_invalid'); }
  if (!sa?.client_email || !sa?.private_key) throw new Error('google_service_account_json_incomplete');
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: sa.client_email,
    scope: scopes.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    iat: now - 30,
    exp: now + 3600,
  };
  if (has(env, 'GOOGLE_IMPERSONATE_USER')) claims.sub = String(env.GOOGLE_IMPERSONATE_USER).trim();
  const unsigned = `${base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${base64Url(JSON.stringify(claims))}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(unsigned));
  const form = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: `${unsigned}.${base64Url(sig)}`,
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

async function oauthRefreshToken(env, scopes) {
  const form = new URLSearchParams({
    client_id: String(env.GOOGLE_OAUTH_CLIENT_ID || ''),
    client_secret: String(env.GOOGLE_OAUTH_CLIENT_SECRET || ''),
    refresh_token: String(env.GOOGLE_OAUTH_REFRESH_TOKEN || ''),
    grant_type: 'refresh_token',
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(data.error_description || data.error || 'google_oauth_refresh_failed');
  return data.access_token;
}

async function googleUserToken(env, scopes) {
  if (googleOauthReady(env)) return oauthRefreshToken(env, scopes);
  if (googleServiceReady(env)) return serviceAccountToken(env, scopes);
  throw new Error('google_auth_not_configured');
}

async function driveBackup(env) {
  if (!has(env, 'DRIVE_BACKUP_FOLDER_ID')) {
    return { ok: false, status: 503, error: 'drive_backup_folder_not_configured' };
  }
  if (!googleOauthReady(env) && !googleServiceReady(env)) {
    return { ok: false, status: 503, error: 'google_auth_not_configured' };
  }
  const token = await googleUserToken(env, ['https://www.googleapis.com/auth/drive']);
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const name = `astrovip-backup-${stamp}.zip`;
  const initRes = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name,webViewLink,size,createdTime',
    {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json; charset=UTF-8',
        'x-upload-content-type': 'application/zip',
      },
      body: JSON.stringify({
        name,
        parents: [String(env.DRIVE_BACKUP_FOLDER_ID).trim()],
        description: `AstroVip main backup ${new Date().toISOString()}`,
      }),
    },
  );
  if (!initRes.ok) {
    const detail = await initRes.text();
    return { ok: false, status: initRes.status, error: 'drive_resumable_init_failed', detail: detail.slice(0, 500) };
  }
  const uploadUrl = initRes.headers.get('location');
  if (!uploadUrl) return { ok: false, status: 502, error: 'drive_upload_location_missing' };

  const ghHeaders = { 'user-agent': 'AstroVip-Command-Center/4.0' };
  if (has(env, 'GITHUB_ADMIN_TOKEN')) ghHeaders.authorization = `Bearer ${String(env.GITHUB_ADMIN_TOKEN).trim()}`;
  const zipRes = await fetch(`https://codeload.github.com/${REPO}/zip/refs/heads/main`, { headers: ghHeaders });
  if (!zipRes.ok || !zipRes.body) {
    return { ok: false, status: 502, error: `github_backup_http_${zipRes.status}` };
  }
  const uploadHeaders = { 'content-type': 'application/zip' };
  const length = zipRes.headers.get('content-length');
  if (length) uploadHeaders['content-length'] = length;
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: uploadHeaders,
    body: zipRes.body,
  });
  const file = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok) {
    return { ok: false, status: uploadRes.status, error: file?.error?.message || 'drive_upload_failed' };
  }
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
      const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}cc_health=${Date.now()}`, {
        method: 'GET',
        headers: { 'user-agent': 'AstroVip-Command-Center/4.0' },
      });
      return {
        key,
        url,
        ok: res.ok,
        status: res.status,
        ms: Date.now() - started,
        release: res.headers.get('x-astrovip-release') || null,
      };
    } catch (e) {
      return { key, url, ok: false, status: 0, ms: Date.now() - started, error: String(e?.message || e) };
    }
  }));
  return {
    ok: results.every(x => x.ok),
    checkedAt: new Date().toISOString(),
    results,
  };
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
