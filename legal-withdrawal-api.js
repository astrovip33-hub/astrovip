const ROUTE = '/api/retragere-din-contract';
const PRODUCTION_HOSTS = new Set(['astrovip.ro', 'www.astrovip.ro']);
const MAILBOX = 'contact@astrovip.ro';
const MAX_BYTES = 8192;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {status, headers: {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow', 'Referrer-Policy': 'no-referrer'}});
}

async function limitedJson(request) {
  if (Number(request.headers.get('content-length')) > MAX_BYTES) throw new Error('too_large');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('empty');
  const chunks = [];
  let size = 0;
  while (true) {
    const {value, done} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BYTES) {await reader.cancel(); throw new Error('too_large');}
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {bytes.set(chunk, offset); offset += chunk.length;}
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function handleLegalWithdrawal(request, env, io = {fetch: globalThis.fetch, now: () => new Date()}) {
  const url = new URL(request.url);
  if (url.pathname.replace(/\/$/, '') !== ROUTE) return null;
  // A preview must never use production customer data or send real messages.
  if (!PRODUCTION_HOSTS.has(url.hostname)) return json({ok: false, error: 'preview_only'}, 409);
  if (request.method !== 'POST') return json({ok: false, error: 'method_not_allowed'}, 405);
  if (request.headers.get('origin') !== url.origin) return json({ok: false, error: 'origin_not_allowed'}, 403);
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return json({ok: false, error: 'json_required'}, 415);
  // Fail closed until sending and abuse protection have both been configured.
  if (!env.LEGAL_RESEND_API_KEY || !env.LEGAL_WITHDRAWAL_FROM || !env.LEGAL_SUBMISSION_RATE_LIMITER) return json({ok: false, error: 'withdrawal_unavailable', contact: MAILBOX}, 503);
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip) return json({ok: false, error: 'withdrawal_unavailable', contact: MAILBOX}, 503);
  try {
    const {success} = await env.LEGAL_SUBMISSION_RATE_LIMITER.limit({key: `withdrawal:${ip}`});
    if (!success) return json({ok: false, error: 'rate_limited', contact: MAILBOX}, 429);
  } catch {return json({ok: false, error: 'withdrawal_unavailable', contact: MAILBOX}, 503);}
  let data;
  try {data = await limitedJson(request);} catch (error) {return json({ok: false, error: 'invalid_request'}, error.message === 'too_large' ? 413 : 400);}
  if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ok: false, error: 'invalid_request'}, 400);
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const contract = typeof data.contract === 'string' ? data.contract.trim() : '';
  if (data.website || name.length < 2 || name.length > 120 || /[\r\n\x00-\x1f]/.test(name) || email.length > 180 || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email) || contract.length < 5 || contract.length > 1000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(contract)) return json({ok: false, error: 'invalid_request'}, 400);
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(data.requestId || '')) return json({ok: false, error: 'invalid_request'}, 400);
  const receivedAt = io.now().toISOString();
  const receipt = `ASTROVIP — CONFIRMARE DE PRIMIRE A DECLARAȚIEI DE RETRAGERE\n\nReferință: ${data.requestId}\nData și ora primirii (UTC): ${receivedAt}\nFus orar de referință: Europe/Bucharest\nOperator: SMARANDA CRISTIAN-CĂTĂLIN PFA · CUI 50191527\nContact: ${MAILBOX}\n\nNume: ${name}\nEmail: ${email}\nContract / serviciu: ${contract}\n\nDeclarație: Vă informez prin prezenta că mă retrag din contractul de servicii identificat mai sus.\n\nAceasta confirmă primirea declarației pentru procesare, nu efectuarea rambursării. Condițiile și sumele se analizează potrivit contractului și legii.\nTermeni: https://astrovip.ro/termeni-si-conditii/#retragere\n`;
  const subject = `AstroVip — retragere din contract — ${data.requestId}`;
  const messages = [
    {from: env.LEGAL_WITHDRAWAL_FROM, to: [MAILBOX], reply_to: email, subject, text: receipt},
    {from: env.LEGAL_WITHDRAWAL_FROM, to: [email], reply_to: MAILBOX, subject, text: receipt}
  ];
  try {
    const response = await io.fetch('https://api.resend.com/emails/batch', {method: 'POST', headers: {'Authorization': `Bearer ${env.LEGAL_RESEND_API_KEY}`, 'Content-Type': 'application/json'}, body: JSON.stringify(messages), signal: AbortSignal.timeout(12000)});
    const result = await response.json();
    if (!response.ok || result.errors?.length || !Array.isArray(result.data) || result.data.length !== 2 || result.data.some(item => !item?.id)) return json({ok: false, error: 'confirmation_unavailable', contact: MAILBOX}, 502);
    return json({ok: true, receivedAt, receipt});
  } catch {return json({ok: false, error: 'confirmation_unavailable', contact: MAILBOX}, 502);}
}
