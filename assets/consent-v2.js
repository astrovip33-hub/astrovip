(function(){
  'use strict';
  const KEY='astrovip_consent_v2';
  const VERSION=2;
  const gtag=window.gtag||function(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments)};
  window.gtag=gtag;

  const GOOGLE_TAG_ID='G-Y59ZJ7L3WR';
  const GTM_ID='GTM-N2RP7N9Q';
  const META_PIXEL_ID='1439608778053981';

  function loadGoogleTag(){
    if(window.__astrovipGoogleTagLoaded)return;
    if(document.querySelector('script[src*="googletagmanager.com/gtag/js?id='+GOOGLE_TAG_ID+'"]')){
      window.__astrovipGoogleTagLoaded=true;
      return;
    }
    window.__astrovipGoogleTagLoaded=true;
    const s=document.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GOOGLE_TAG_ID);
    s.setAttribute('data-astrovip-google-tag','1');
    document.head.appendChild(s);
    gtag('js',new Date());
    gtag('config',GOOGLE_TAG_ID,{send_page_view:false});
  }

  function loadGTM(){
    if(window.__astrovipGTMLoaded)return;
    window.__astrovipGTMLoaded=true;
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
    const s=document.createElement('script');
    s.async=true;
    s.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(GTM_ID);
    s.setAttribute('data-astrovip-gtm','1');
    document.head.appendChild(s);
  }

  function loadMetaPixel(){
    if(window.__astrovipMetaPixelLoaded)return;
    window.__astrovipMetaPixelLoaded=true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('consent','grant');
    fbq('init',META_PIXEL_ID);
    fbq('track','PageView');
  }

  function updateConsent(analytics,ads){
    gtag('consent','update',{
      analytics_storage:analytics?'granted':'denied',
      ad_storage:ads?'granted':'denied',
      ad_user_data:ads?'granted':'denied',
      ad_personalization:ads?'granted':'denied',
      personalization_storage:ads?'granted':'denied',
      functionality_storage:'granted',
      security_storage:'granted'
    });

    if(analytics||ads){loadGoogleTag();loadGTM();}
    if(ads)loadMetaPixel();
    else if(window.fbq){try{fbq('consent','revoke')}catch(e){}}

    if(analytics && !window.__astrovipAnalyticsPageviewSent){
      window.__astrovipAnalyticsPageviewSent=true;
      gtag('event','page_view',{
        page_title:document.title,
        page_location:location.href,
        page_path:location.pathname
      });
    }

    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({
      event:'astrovip_consent_update',
      analytics_consent:analytics?'granted':'denied',
      ads_consent:ads?'granted':'denied'
    });
  }

  function loadChoice(){
    try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return v&&v.v===VERSION?v:null}catch(e){return null}
  }

  function saveChoice(analytics,ads){
    const v={v:VERSION,analytics:!!analytics,ads:!!ads,ts:Date.now()};
    try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}
    const hadGoogleTag=!!window.__astrovipGoogleTagLoaded;
    updateConsent(v.analytics,v.ads);
    if(hadGoogleTag && !v.analytics && !v.ads){
      location.reload();
    }
    return v;
  }

  function build(){
    const wrap=document.getElementById('av-consent');
    if(!wrap)return;

    let manage=document.getElementById('av-consent-manage');
    if(!manage){
      manage=document.createElement('button');
      manage.type='button';
      manage.className='av-consent__manage';
      manage.id='av-consent-manage';
      manage.textContent='Setări cookie';
      manage.hidden=true;
      const footer=document.querySelector('.av-footer-premium-single')||document.querySelector('footer .wrap')||document.querySelector('footer')||document.body;
      footer.appendChild(manage);
    }

    const prefs=wrap.querySelector('#av-consent-prefs');
    const analytics=wrap.querySelector('#av-consent-analytics');
    const ads=wrap.querySelector('#av-consent-ads');

    function close(){
      wrap.hidden=true;
      manage.hidden=false;
      document.documentElement.classList.add('av-consent-saved');
    }
    function open(){
      const c=loadChoice();
      analytics.checked=!!(c&&c.analytics);
      ads.checked=!!(c&&c.ads);
      prefs.hidden=false;
      document.documentElement.classList.remove('av-consent-saved');
      wrap.hidden=false;
      manage.hidden=true;
      wrap.querySelector('#av-consent-reject').focus();
    }

    wrap.querySelector('#av-consent-accept').addEventListener('click',()=>{saveChoice(true,true);close()});
    wrap.querySelector('#av-consent-reject').addEventListener('click',()=>{saveChoice(false,false);close()});
    wrap.querySelector('#av-consent-custom').addEventListener('click',()=>{prefs.hidden=!prefs.hidden;if(!prefs.hidden)analytics.focus()});
    wrap.querySelector('#av-consent-save').addEventListener('click',()=>{saveChoice(analytics.checked,ads.checked);close()});
    manage.addEventListener('click',open);

    const current=loadChoice();
    if(current){
      updateConsent(current.analytics,current.ads);
      wrap.hidden=true;
      manage.hidden=false;
      document.documentElement.classList.add('av-consent-saved');
    }else{
      wrap.hidden=false;
      manage.hidden=true;
      document.documentElement.classList.remove('av-consent-saved');
    }
  }


  function b64url(value){
    try{
      const bytes=new TextEncoder().encode(String(value||''));
      let raw='';bytes.forEach(b=>raw+=String.fromCharCode(b));
      return btoa(raw).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    }catch(e){return ''}
  }

  function getGoogleClientId(choice){
    return new Promise(resolve=>{
      if(!choice||!choice.analytics)return resolve('');
      loadGoogleTag();
      let done=false;
      const finish=value=>{if(done)return;done=true;resolve(typeof value==='string'?value:'')};
      try{gtag('get',GOOGLE_TAG_ID,'client_id',finish)}catch(e){finish('');return}
      setTimeout(()=>finish(''),500);
    });
  }

  function sendCheckoutIntent(choice){
    const currency='RON',value=500;
    if(choice&&choice.analytics){
      try{gtag('event','begin_checkout',{currency,value,items:[{item_id:'astrovip-consultatie-60',item_name:'Consultatie AstroVip - 60 minute',price:value,quantity:1}]})}catch(e){}
    }
    if(choice&&choice.ads&&window.fbq){
      try{fbq('track','InitiateCheckout',{currency,value,content_type:'product',content_ids:['astrovip-consultatie-60'],content_name:'Consultatie AstroVip - 60 minute'})}catch(e){}
    }
  }

  document.addEventListener('click',async event=>{
    const link=event.target&&event.target.closest?event.target.closest('a[href*="buy.stripe.com"]'):null;
    if(!link)return;
    let url;try{url=new URL(link.href,location.href)}catch(e){return}
    if(url.hostname!=='buy.stripe.com')return;
    const choice=loadChoice();
    if(!choice||(!choice.analytics&&!choice.ads))return;
    event.preventDefault();
    sendCheckoutIntent(choice);
    const clientId=await getGoogleClientId(choice);
    const ref='av1a'+(choice.analytics?'1':'0')+'d'+(choice.ads?'1':'0')+'g'+b64url(clientId);
    url.searchParams.set('client_reference_id',ref);
    location.href=url.toString();
  },true);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();
