import { handleCommandCenter } from './command-center-api.js';
const enc = new TextEncoder();
const dec = new TextDecoder();
const GA4_MEASUREMENT_ID='G-Y59ZJ7L3WR';
const META_PIXEL_ID='1439608778053981';
const META_GRAPH_VERSION='v23.0';
const TRANSPARENT_PIXEL='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

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
function b64urlDecode(value){
  if(!value)return '';
  try{
    const base=value.replace(/-/g,'+').replace(/_/g,'/');
    const padded=base+'='.repeat((4-base.length%4)%4);
    const raw=atob(padded);
    const bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));
    return dec.decode(bytes);
  }catch{return ''}
}
function parseTrackingRef(value){
  const m=/^av1a([01])d([01])g([A-Za-z0-9_-]*)$/.exec(value||'');
  if(!m)return null;
  return {analytics:m[1]==='1',ads:m[2]==='1',clientId:b64urlDecode(m[3])};
}
async function sha256(value){
  return hex(await crypto.subtle.digest('SHA-256',enc.encode(String(value))));
}
function cleanText(value){return String(value||'').trim().toLowerCase().normalize('NFKC')}
function cleanPhone(value){return String(value||'').replace(/\D/g,'')}
async function metaUserData(session){
  const d=session.customer_details||{};
  const out={external_id:[await sha256(session.id||'astrovip-purchase')]};
  if(d.email)out.em=[await sha256(cleanText(d.email))];
  if(d.phone){const p=cleanPhone(d.phone);if(p)out.ph=[await sha256(p)]}
  if(d.name){
    const parts=cleanText(d.name).split(/\s+/).filter(Boolean);
    if(parts[0])out.fn=[await sha256(parts[0])];
    if(parts.length>1)out.ln=[await sha256(parts[parts.length-1])];
  }
  const a=d.address||{};
  if(a.city)out.ct=[await sha256(cleanText(a.city).replace(/\s/g,''))];
  if(a.postal_code)out.zp=[await sha256(cleanText(a.postal_code).replace(/\s/g,''))];
  if(a.country)out.country=[await sha256(cleanText(a.country))];
  return out;
}
function moneyValue(session){
  return Number.isFinite(Number(session.amount_total))?Number(session.amount_total)/100:0;
}
async function sendGA4Purchase(session,ref,env,eventTime){
  if(!ref?.analytics)return {skipped:'analytics_consent_denied'};
  if(!ref.clientId)return {skipped:'missing_ga_client_id'};
  if(!env.GA4_API_SECRET)return {skipped:'missing_ga4_secret'};
  const currency=String(session.currency||'ron').toUpperCase();
  const value=moneyValue(session);
  const url='https://region1.google-analytics.com/mp/collect?measurement_id='+encodeURIComponent(GA4_MEASUREMENT_ID)+'&api_secret='+encodeURIComponent(env.GA4_API_SECRET);
  const body={
    client_id:ref.clientId,
    timestamp_micros:String(eventTime*1000000),
    events:[{
      name:'purchase',
      params:{
        transaction_id:session.id,
        currency,
        value,
        engagement_time_msec:1,
        items:[{item_id:'astrovip-consultatie-60',item_name:'Consultatie AstroVip - 60 minute',currency,price:value,quantity:1}]
      }
    }]
  };
  const res=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
  return {ok:res.ok,status:res.status};
}
async function sendMetaPurchase(session,ref,env,eventTime){
  if(!ref?.ads)return {skipped:'ads_consent_denied'};
  if(!env.META_CAPI_ACCESS_TOKEN)return {skipped:'missing_meta_token'};
  const currency=String(session.currency||'ron').toUpperCase();
  const value=moneyValue(session);
  const payload={
    data:[{
      event_name:'Purchase',
      event_time:eventTime,
      event_id:session.id,
      action_source:'website',
      event_source_url:'https://astrovip.ro/plata-confirmata/',
      user_data:await metaUserData(session),
      custom_data:{
        currency,
        value,
        content_type:'product',
        content_ids:['astrovip-consultatie-60'],
        content_name:'Consultatie AstroVip - 60 minute'
      }
    }]
  };
  const url='https://graph.facebook.com/'+META_GRAPH_VERSION+'/'+META_PIXEL_ID+'/events?access_token='+encodeURIComponent(env.META_CAPI_ACCESS_TOKEN);
  const res=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const text=await res.text();
  return {ok:res.ok,status:res.status,detail:res.ok?undefined:text.slice(0,240)};
}
async function stripeWebhook(request,env,{secretName='STRIPE_WEBHOOK_SECRET',testMode=false}={}){
  if(request.method==='GET')return new Response(testMode?'AstroVip Stripe sandbox webhook endpoint':'AstroVip Stripe webhook endpoint',{status:200});
  if(request.method!=='POST')return new Response('Method Not Allowed',{status:405});
  const payload=await request.text();
  if(!await validStripe(payload,request.headers.get('stripe-signature'),env[secretName]))
    return new Response('Invalid Stripe signature',{status:400});
  let event;try{event=JSON.parse(payload)}catch{return new Response('Invalid JSON',{status:400})}
  if(!['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type))
    return Response.json({received:true,ignored:true});
  const session=event.data?.object||{};
  if(session.payment_status!=='paid')return Response.json({received:true,ignored:true,reason:'not_paid'});
  const ref=parseTrackingRef(session.client_reference_id);
  const eventTime=Number(event.created)||Math.floor(Date.now()/1000);
  if(testMode)return Response.json({
    received:true,
    verified:true,
    sandbox:true,
    dry_run:true,
    event_id:event.id,
    checkout_session_id:session.id,
    amount_total:session.amount_total,
    currency:session.currency,
    payment_status:session.payment_status,
    tracking_ref_present:Boolean(ref),
    would_send:{ga4:Boolean(ref?.analytics&&ref?.clientId&&env.GA4_API_SECRET),meta:Boolean(ref?.ads&&env.META_CAPI_ACCESS_TOKEN)}
  });
  const [ga4,meta]=await Promise.all([
    sendGA4Purchase(session,ref,env,eventTime).catch(e=>({ok:false,error:String(e?.message||e)})),
    sendMetaPurchase(session,ref,env,eventTime).catch(e=>({ok:false,error:String(e?.message||e)}))
  ]);
  return Response.json({
    received:true,
    verified:true,
    event_id:event.id,
    checkout_session_id:session.id,
    amount_total:session.amount_total,
    currency:session.currency,
    tracking:{ga4,meta}
  });
}
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    const commandResponse=await handleCommandCenter(request,env);
    if(commandResponse)return commandResponse;
    if(url.pathname==='/api/stripe-webhook'||url.pathname==='/api/stripe-webhook/')return stripeWebhook(request,env);
    if(url.pathname==='/api/stripe-webhook-test'||url.pathname==='/api/stripe-webhook-test/')return stripeWebhook(request,env,{secretName:'STRIPE_WEBHOOK_SECRET_TEST',testMode:true});
    const assetResponse=await env.ASSETS.fetch(request);
    const ct=assetResponse.headers.get('content-type')||'';
    if(assetResponse.ok&&ct.includes('text/html')&&!url.pathname.startsWith('/command-center')){
      const isHomepage=url.pathname==='/'||url.pathname==='';
      const heroPreloads=isHomepage?`<link rel="preload" as="image" href="/assets/astrovip-hero-premium-mobile-20261001.webp?v=20261006-v63" type="image/webp" media="(max-width:820px)" fetchpriority="high"><link rel="preload" as="image" href="/assets/astrovip-hero-desktop-final-20261002.avif?v=20261006-v63-desktop" type="image/avif" media="(min-width:821px)" fetchpriority="high">`:'';
      const homepageRibbonCleanup=isHomepage?`<style id="astrovip-hide-secondary-planet-ribbon">html body #planet-strip-secondary,html body .planet-strip-secondary{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;border:0!important;overflow:hidden!important}</style><script id="astrovip-remove-secondary-planet-ribbon">(()=>{const kill=()=>{document.querySelectorAll('#planet-strip-secondary,.planet-strip-secondary').forEach(el=>el.remove());const studies=document.querySelector('#studii-de-caz-home');if(studies){const prev=studies.previousElementSibling;if(prev&&prev.matches('.planet-strip,[id*="planet-strip"],[class*="planet-strip"]'))prev.remove();}};const run=()=>{kill();setTimeout(kill,350);setTimeout(kill,1200)};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run()})();</script>`:'';
      const runtime=heroPreloads+homepageRibbonCleanup+`<script src="/assets/page-editor-runtime.js?v=20261006-premium-wow3" defer></script>`;
      let rewriter=new HTMLRewriter().on('head',{element(el){el.append(runtime,{html:true})}});
      if(isHomepage){
        const desktopHero=`<picture class="v63d-hero-picture"><source media="(min-width:821px)" srcset="/assets/astrovip-hero-desktop-final-20261002.avif?v=20261006-v63-desktop" type="image/avif"><img src="${TRANSPARENT_PIXEL}" width="1280" height="720" alt="AstroVip — astrologie premium" loading="eager" fetchpriority="high" decoding="async"></picture>`;
        const mobileHero=`<picture class="v63-hero-picture" style="display:block;width:100%"><source media="(max-width:820px)" srcset="/assets/astrovip-hero-premium-mobile-20261001.webp?v=20261006-v63" type="image/webp"><img src="${TRANSPARENT_PIXEL}" width="941" height="1672" loading="eager" fetchpriority="high" decoding="async" alt="Cătălin Smaranda — AstroVip, astrologie premium"></picture>`;
        rewriter=rewriter
          .on('link[rel="preload"][as="image"]',{element(el){const srcset=el.getAttribute('imagesrcset')||'';const href=el.getAttribute('href')||'';if(srcset.includes('astrovip-hero-mobile-clean-cards-')||srcset.includes('astrovip-hero-lux-clean-20260922')||href.includes('astrovip-hero-mobile-clean-cards-')||href.includes('astrovip-hero-lux-clean-20260922'))el.remove();}})
          .on('#v63-desktop-prod .v63d-hero-visual > img',{element(el){el.replace(desktopHero,{html:true})}})
          .on('#v63-mobile-prod .v63-visual > img',{element(el){el.replace(mobileHero,{html:true})}})
          .on('section.hero.hero-split.av-hero-v2.av-hero-mobile-restore .av-hero-v2-visual picture',{element(el){el.remove()}})
          .on('script#astrovip-planetary-postload',{element(el){el.remove()}});
      }
      return rewriter.transform(assetResponse);
    }
    if(url.pathname.startsWith('/command-center')){
      const headers=new Headers(assetResponse.headers);
      headers.set('X-Robots-Tag','noindex, nofollow, noarchive');
      headers.set('Referrer-Policy','no-referrer');
      headers.set('X-Content-Type-Options','nosniff');
      return new Response(assetResponse.body,{status:assetResponse.status,statusText:assetResponse.statusText,headers});
    }
    return assetResponse;
  }
};