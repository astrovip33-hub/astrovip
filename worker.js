const enc = new TextEncoder();

function hex(bytes){return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('')}
function safeEqual(a,b){if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
async function validStripe(payload,header,secret){
  if(!header||!secret)return false;
  const p=header.split(','),t=p.find(v=>v.startsWith('t='))?.slice(2),s=p.filter(v=>v.startsWith('v1=')).map(v=>v.slice(3));
  if(!t||!s.length||Math.abs(Math.floor(Date.now()/1000)-Number(t))>300)return false;
  const k=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const d=hex(await crypto.subtle.sign('HMAC',k,enc.encode(t+'.'+payload)));
  return s.some(v=>safeEqual(d,v));
}
async function stripeWebhook(request,env){
  if(request.method==='GET')return new Response('AstroVip Stripe webhook endpoint',{status:200});
  if(request.method!=='POST')return new Response('Method Not Allowed',{status:405});
  const payload=await request.text();
  if(!await validStripe(payload,request.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET))
    return new Response('Invalid Stripe signature',{status:400});
  let event;try{event=JSON.parse(payload)}catch{return new Response('Invalid JSON',{status:400})}
  if(event.type!=='checkout.session.completed')return Response.json({received:true,ignored:true});
  const session=event.data?.object||{};
  if(session.payment_status!=='paid')return Response.json({received:true,ignored:true,reason:'not_paid'});
  return Response.json({received:true,verified:true,event_id:event.id,checkout_session_id:session.id,amount_total:session.amount_total,currency:session.currency});
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==='/api/stripe-webhook'||url.pathname==='/api/stripe-webhook/')return stripeWebhook(request,env);
    return env.ASSETS.fetch(request);
  }
};
