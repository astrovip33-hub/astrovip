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
    // Same-origin responsive QA is available only on the existing preview host.
    if(['astrovip-preview.astrovip33.workers.dev','astrovip-preview-ux-compact.astrovip33.workers.dev'].includes(url.hostname)&&url.pathname==='/__ux-responsive-preview'){
      const width=[320,360,390,430,768].includes(Number(url.searchParams.get('width')))?Number(url.searchParams.get('width')):390;
      const lang=['en','es','it','zh','ar','ru'].includes(url.searchParams.get('lang'))?url.searchParams.get('lang'):'';
      return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AstroVip responsive QA</title><style>body{margin:0;background:#242424;color:#fff;font:14px Arial}p{text-align:center;margin:12px}iframe{display:block;width:${width}px;height:844px;margin:0 auto;border:1px solid #555;background:#050706}</style></head><body><p>AstroVip Â· ${width}px Â· ${lang||'ro'}</p><iframe title="AstroVip phone viewport" src="/${lang?lang+'/':''}"></iframe></body></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, nofollow','Cache-Control':'no-store'}});
    }
    const commandResponse=await handleCommandCenter(request,env);
    if(commandResponse)return commandResponse;
    if(url.pathname==='/api/stripe-webhook'||url.pathname==='/api/stripe-webhook/')return stripeWebhook(request,env);
    if(url.pathname==='/api/stripe-webhook-test'||url.pathname==='/api/stripe-webhook-test/')return stripeWebhook(request,env,{secretName:'STRIPE_WÑP’ÓÒ×ÔÑPÔ‘UÕTÕ	Ë\İ[ÙNY_JNÂˆÛÛœİ\ÜÙ]™\ÜÛœÙOX]ØZ][‹TÔÑUË™™]Ú
™\]Y\İ
NÂˆÛÛœİİX\ÜÙ]™\ÜÛœÙKšXY\œË™Ù]
	ØÛÛ[]\IÊ_	ÉÎÂˆYŠ\ÜÙ]™\ÜÛœÙK›ÚÉ‰˜İš[˜ÛY\Ê	İ^Ú[	ÊI‰ˆ]\›œ]˜[YKœİ\ÕÚ]
	ËØÛÛ[X[™XÙ[\‰ÊJ^ÂˆÛÛœİ\ÒÛY\YÙO]\›œ]˜[YOOOIËß\›œ]˜[YOOOIÉÎÂˆÛÛœİ\›Ô™[ØYÏZ\ÒÛY\YÙOØ[šÈ™[Hœ™[ØYˆ\ÏHš[XYÙHˆ™YH‹Ø\ÜÙ]ËØ\İ›İš\Z\›Ë\™[Z][K[[Øš[KLŒŒLKÙXœİLŒŒL]^Hˆ\OHš[XYÙKİÙXœˆYYXOHŠX^]ÚYÍŒ
Hˆ™]Úš[Üš]OHšYÚ[šÈ™[Hœ™[ØYˆ\ÏHš[XYÙHˆ™YH‹Ø\ÜÙ]ËØ\İ›İš\Z\›ËY\ÚİÜYš[˜[LŒŒL‹˜]šYİLŒŒL]^Hˆ\OHš[XYÙKØ]šYˆˆYYXOHŠZ[‹]ÚYÍŒ\
Hˆ™]Úš[Üš]OHšYÚ˜‰ÉÎÂˆÛÛœİÛY\YÙTšX˜›ÛÛX[\Z\ÒÛY\YÙOØİ[HYH˜\İ›İš\ZYK\ÙXÛÛ™\K\[™]\šX˜›Ûˆš[›ÙHÜ[™]\İš\\ÙXÛÛ™\K[›ÙHœ[™]\İš\\ÙXÛÛ™\^Ù\Ü^N››Û™HZ[\Ü[İš\ÚXš[]NšY[ˆZ[\Ü[ÚZYÚŒZ[\Ü[ÛZ[‹ZZYÚŒZ[\Ü[ÛX^ZZYÚŒZ[\Ü[ÛX\™Ú[ŒZ[\Ü[ÜY[™ÎŒZ[\Ü[Ø›Ü™\ŒZ[\Ü[Ûİ™\™›İÎšY[ˆZ[\Ü[OÜİ[OØÜš\YH˜\İ›İš\\™[[İ™K\ÙXÛÛ™\K\[™]\šX˜›ÛˆŠ

OOØÛÛœİÚ[J
OOÙØİ[Y[œ]Y\TÙ[XİÜ[
	ÈÜ[™]\İš\\ÙXÛÛ™\Kœ[™]\İš\\ÙXÛÛ™\IÊK™›Ü‘XXÚ
[O™[œ™[[İ™J
JNØÛÛœİİYY\ÏYØİ[Y[œ]Y\TÙ[XİÜŠ	ÈÜİYZKYKXØ^‹ZÛYIÊNÚYŠİYY\Ê^ØÛÛœİ™]\İYY\Ëœ™]š[İ\Ñ[[Y[ÚX›[™ÎÚYŠ™]‰‰œ™]‹›X]Ú\Ê	Ëœ[™]\İš\ÚY
Hœ[™]\İš\—KØÛ\ÜÊHœ[™]\İš\—IÊJ\™]‹œ™[[İ™J
Nß_NØÛÛœİ[J
OOÚÚ[

NÜÙ][Y[İ]
Ú[ÍL
NÜÙ][Y[İ]
Ú[LŒ
_NÚYŠØİ[Y[œ™XYTİ]OOOIÛØY[™ÉÊYØİ[Y[˜Y]™[\İ[™\Š	ÑÓPÛÛ[ØYY	Ë[‹ÛÛ˜ÙNY_JNÙ[ÙH[Š
_JJ
NÏÜØÜš\˜‰ÉÎÂˆÛÛœİÛY\YÙSY[Qš^Z\ÒÛY\YÙOØİ[HYH˜\İ›İš\\›Ë[Y[K^LŒŒLÈYYXJX^]ÚYN
^Ú[›ÙN››İ
™İZYK\YÙJHÚ[Xˆš[X‹[[™\ŞÜÜÚ][Ûœ™[]]™HZ[\Ü[Ù\Ü^N˜›ØÚÈZ[\Ü[İÚYŒÌZ[\Ü[ÚZYÚŒN\Z[\Ü[Z[›ÙN››İ
™İZYK\YÙJHÚ[Xˆš[X‹[[™^ÜÜÚ][Û˜XœÛÛ]HZ[\Ü[ÛYŒZ[\Ü[İÚYŒÌZ[\Ü[ÚZYÚŒÜZ[\Ü[Ø›Ü™\‹\˜Y]\ÎŒÜZ[\Ü[Ø˜XÚÙÜ›İ[™˜İ\œ™[ÛÛÜˆZ[\Ü[İ˜[œÚ][Û˜[œÙ›Ü›HŒNÈX\ÙKÜXÚ]HŒMÈX\ÙKÜŒNÈX\ÙHZ[\Ü[İ˜[œÙ›Ü›K[ÜšYÚ[˜Ù[\ˆZ[\Ü[Z[›ÙN››İ
™İZYK\YÙJHÚ[Xˆš[X‹[[™N›XÚ[
J^İÜŒZ[\Ü[Z[›ÙN››İ
™İZYK\YÙJHÚ[Xˆš[X‹[[™N›XÚ[
Š^İÜZ[\Ü[Z[›ÙN››İ
™İZYK\YÙJHÚ[Xˆš[X‹[[™N›XÚ[
Ê^İÜŒMœZ[\Ü[Z[›ÙN››İ
™İZYK\YÙJHÚ[X–Ø\šXKY^[™YHYH—^ØÛÛÜˆÙ™ŒYˆZ[\Ü[Z[›ÙN››İ
™İZYK\YÙJHÚ[X–Ø\šXKY^[™YHYH—Hš[X‹[[™N›XÚ[
J^İÜZ[\Ü[İ˜[œÙ›Ü›Nœ›İ]JYYÊHZ[\Ü[Z[›ÙN››İ
™İZYK\YÙJHÚ[X–Ø\šXKY^[™YHYH—Hš[X‹[[™N›XÚ[
Š^ÛÜXÚ]NŒZ[\Ü[İ˜[œÙ›Ü›NœØØ[V
ŒJHZ[\Ü[Z[›ÙN››İ
™İZYK\YÙJHÚ[X–Ø\šXKY^[™YHYH—Hš[X‹[[™N›XÚ[
Ê^İÜZ[\Ü[İ˜[œÙ›Ü›Nœ›İ]JMYYÊHZ[\Ü[_OÜİ[O˜‰ÉÎÂˆÛÛœİÛY\YÙU[˜PÜš]XØ[Z\ÒÛY\YÙOØİ[HYH˜\İ›İš\][˜KXÜš]XØ[LŒŒLLš[›ÙN››İ
™İZYK\YÙJHÚ[™X˜\™KYÜ˜]Z]K[›ÙN››İ
™İZYK\YÙJHØÚ[™KX[˜[^™X^˜KZ\K[›ÙN››İ
™İZYK\YÙJHÜÙ\šXÚZK[›ÙN››İ
™İZYK\YÙJHÜİYZKYKXØ^‹ZÛYK[›ÙN››İ
™İZYK\YÙJHÜ™XÙ[šZKYÛÛÙÛK[›ÙN››İ
™İZYK\YÙJHÛÙ™\K[›ÙN››İ
™İZYK\YÙJHÜ›ÙÜ˜[X\šK[›ÙN››İ
™İZYK\YÙJHÚ[™X˜\šKYœ™Xİ™[K[›ÙN››İ
™İZYK\YÙJHØÛÛXİ[›ÙN››İ
™İZYK\YÙJH\İ\™YœË[›ÙN››İ
™İZYK\YÙJH˜]‹Y\™XİÜ^Ù\Ü^N››Û™HZ[\Ü[OÜİ[O˜‰ÉÎÂˆÛÛœİ[[YOZ\›Ô™[ØYÊÚÛY\YÙTšX˜›ÛÛX[\
ÚÛY\YÙSY[Qš^
ÚÛY\YÙU[˜PÜš]XØ[
ØØÜš\Ü˜ÏH‹Ø\ÜÙ]ËØ›ÛÚÚ[™ËXœšYÙKLŒŒLËšœÏİLŒŒLL][˜MˆY™\ÜØÜš\ØÜš\Ü˜ÏH‹Ø\ÜÙ]ËÜYÙKYY]Ü‹\[[YKšœÏİLŒŒLËLMÌYœ™\ÚˆY™\ÜØÜš\˜Âˆ]™]Üš]\[™]ÈS™]Üš]\Š
K›ÛŠ	ÚXY	ËÙ[[Y[
[
^Ù[˜\[™
[[YKÚ[Y_J__JNÂˆYŠ\ÒÛY\YÙJ^ÂˆÛÛœİ\ÚİÜ\›ÏXXİ\™HÛ\ÜÏHŒÙZ\›Ë\Xİ\™HÛİ\˜ÙHYYXOHŠZ[‹]ÚYŒ\
HˆÜ˜ÜÙ]H‹Ø\ÜÙ]ËØ\İ›İš\Z\›ËY\ÚİÜYš[˜[LŒŒL‹˜]šYİLŒŒLËLMÌYœ™\Úˆ\OHš[XYÙKØ]šYˆ[YÈÜ˜ÏH‰ÕS”ÔT‘S•ÔVSHˆÚYHŒLˆZYÚHÌŒˆ[H\İ›Õš\8 %\İ›ÛÙÚYH™[Z][HˆØY[™ÏH™XYÙ\ˆˆ™]Úš[Üš]OHšYÚˆXÛÙ[™ÏH˜\Ş[˜ÈÜXİ\™O˜ÂˆÛÛœİ[Øš[R\›ÏXXİ\™HÛ\ÜÏHŒËZ\›Ë\Xİ\™Hˆİ[OH™\Ü^N˜›ØÚÎİÚYŒL	HÛİ\˜ÙHYYXOHŠX^]ÚYŒ
HˆÜ˜ÜÙ]H‹Ø\ÜÙ]ËØ\İ›İš\Z\›Ë\™[Z][K[[Øš[KLŒŒLKÙXœİLŒŒLËLMÌYœ™\Úˆ\OHš[XYÙKİÙXœ[YÈÜ˜ÏH‰ÕS”ÔT‘S•ÔVSHˆÚYHMHˆZYÚHŒMÌˆˆØY[™ÏH™XYÙ\ˆˆ™]Úš[Üš]OHšYÚˆXÛÙ[™ÏH˜\Ş[˜Èˆ[Hñ İ1 Û[ˆÛX\˜[™H8 %\İ›Õš\\İ›ÛÙÚYH™[Z][HÜXİ\™O˜Âˆ™]Üš]\\™]Üš]\‚ˆ›ÛŠ	ÈİŒË[[Øš[K\›ÙXÜÜÉËÙ[[Y[
[
^Ù[œ™[[İ™J
__JBˆ›ÛŠ	ÈİŒËY\ÚİÜ\›ÙXÜÜÉËÙ[[Y[
[
^Ù[œ™[[İ™J
__JBˆ›ÛŠ	Û[šÖÜ™[Hœ™[ØY—VØ\ÏHš[XYÙH—IËÙ[[Y[
[
^ØÛÛœİÜ˜ÜÙ]Y[™Ù]]šX]J	Ú[XYÙ\Ü˜ÜÙ]	Ê_	ÉÎØÛÛœİ™YY[™Ù]]šX]J	Ú™Y‰Ê_	ÉÎÚYŠÜ˜ÜÙ]š[˜ÛY\Ê	Ø\İ›İš\Z\›Ë[[Øš[KXÛX[‹XØ\™ËIÊ_Ü˜ÜÙ]š[˜ÛY\Ê	Ø\İ›İš\Z\›Ë[^XÛX[‹LŒŒLŒ‰Ê_™Y‹š[˜ÛY\Ê	Ø\İ›İš\Z\›Ë[[Øš[KXÛX[‹XØ\™ËIÊ_™Y‹š[˜ÛY\Ê	Ø\İ›İš\Z\›Ë[^XÛX[‹LŒŒLŒ‰ÊJY[œ™[[İ™J
Nß_JBˆ›ÛŠ	ÜÙXİ[Û‹š\›Ëš\›Ë\Ü]˜]‹Z\›Ë]Œ‹˜]‹Z\›Ë[[Øš[K\™\İÜ™H˜]‹Z\›Ë]Œ‹]š\İX[Xİ\™HÛİ\˜ÙVÛYYXOHŠX^]ÚYŒ
H—IËÙ[[Y[
[
^Ù[œÙ]]šX]J	ÜÜ˜ÜÙ]	Ë	ËØ\ÜÙ]ËØ\İ›İš\Z\›Ë\™[Z][K[[Øš[KLŒŒLKÙXœİLŒŒLË]ÛÜšÙ\‹Yš[˜[	ÊNÙ[œÙ]]šX]J	İ\IË	Ú[XYÙKİÙXœ	ÊNÙ[œ™[[İ™P]šX]J	ÜÚ^™\ÉÊ__JBˆ›ÛŠ	ÜÙXİ[Û‹š\›Ëš\›Ë\Ü]˜]‹Z\›Ë]Œ‹˜]‹Z\›Ë[[Øš[K\™\İÜ™H˜]‹Z\›Ë]Œ‹]š\İX[Xİ\™H[YÉËÙ[[Y[
[
^Ù[œÙ]]šX]J	ÜÜ˜ÉË	ËØ\ÜÙ]ËØ\İ›İš\Z\›Ë\™[Z][K[[Øš[KLŒŒLKÙXœİLŒŒLË]ÛÜšÙ\‹Yš[˜[	ÊNÙ[œÙ]]šX]J	İÚY	Ë	ÍŒ	ÊNÙ[œÙ]]šX]J	ÚZYÚ	Ë	ÍM‰Ê__JBˆ›ÛŠ	ÈİŒËY\ÚİÜ\›ÙŒÙZ\›Ë]š\İX[ˆ[YÉËÙ[[Y[
[
^Ù[œ™\XÙJ\ÚİÜ\›ËÚ[Y_J__JBˆ›ÛŠ	ÈİŒË[[Øš[K\›ÙŒË]š\İX[ˆ[YÉËÙ[[Y[
[
^Ù[œ™\XÙJ[Øš[R\›ËÚ[Y_J__JBˆ›ÛŠ	ÜØÜš\Ø\İ›İš\\[™]\K\ÜİØY	ËÙ[[Y[
[
^Ù[œ™[[İ™J
__JNÂˆBˆ™]\›ˆ™]Üš]\‹˜[œÙ›Ü›J\ÜÙ]™\ÜÛœÙJNÂˆBˆYŠ\›œ]˜[YKœİ\ÕÚ]
	ËØÛÛ[X[™XÙ[\‰ÊJ^ÂˆÛÛœİXY\œÏ[™]ÈXY\œÊ\ÜÙ]™\ÜÛœÙKšXY\œÊNÂˆXY\œËœÙ]
	ÖT›Ø›İËUYÉË	Û›Ú[™^›Ù›ÛİË›Ø\˜Ú]™IÊNÂˆXY\œËœÙ]
	Ô™Y™\œ™\‹TÛXŞIË	Û›Ë\™Y™\œ™\‰ÊNÂˆXY\œËœÙ]
	ÖPÛÛ[U\KSÜ[ÛœÉË	Û›ÜÛšY™‰ÊNÂˆ™]\›ˆ™]È™\ÜÛœÙJ\ÜÙ]™\ÜÛœÙK˜›ÙKÜİ]\Î˜\ÜÙ]™\ÜÛœÙKœİ]\Ëİ]\Õ^˜\ÜÙ]™\ÜÛœÙKœİ]\Õ^XY\œßJNÂˆBˆ™]\›ˆ\ÜÙ]™\ÜÛœÙNÂˆBŸNÂ