const enc = new TextEncoder();

function hex(bytes) {
  return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
async function verifyStripeSignature(payload, header, secret) {
  if (!header || !secret) return false;
  const parts = header.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
  const signatures = parts.filter(p => p.startsWith('v1=')).map(p => p.slice(3));
  if (!timestamp || !signatures.length) return false;
  const age = Math.abs(Math.floor(Date.now()/1000) - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  const digest = hex(await crypto.subtle.sign('HMAC', key, enc.encode(timestamp + '.' + payload)));
  return signatures.some(sig => timingSafeEqual(digest, sig));
}

export async function onRequestPost({ request, env }) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');
  const ok = await verifyStripeSignature(payload, signature, env.STRIPE_WEBHOOK_SECRET);
  if (!ok) return new Response('Invalid Stripe signature', {status:400});

  let event;
  try { event = JSON.parse(payload); } catch { return new Response('Invalid JSON', {status:400}); }
  if (event.type !== 'checkout.session.completed') return Response.json({received:true, ignored:true});

  const session = event.data?.object || {};
  if (session.payment_status !== 'paid') {
    return Response.json({received:true, ignored:true, reason:'not_paid'});
  }

  // Verified paid Checkout Session. Analytics delivery is intentionally kept
  // separate until GA4 Measurement Protocol / Meta CAPI secrets are configured.
  return Response.json({
    received:true,
    verified:true,
    event_id:event.id,
    checkout_session_id:session.id,
    amount_total:session.amount_total,
    currency:session.currency
  });
}

export function onRequestGet() {
  return new Response('AstroVip Stripe webhook endpoint', {status:200});
}
