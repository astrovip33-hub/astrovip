(function(){
  'use strict';
  const KEY='astrovip_consent_v2';
  const VERSION=2;
  const gtag=window.gtag||function(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments)};
  window.gtag=gtag;

  const GOOGLE_TAG_ID='G-Y59ZJ7L3WR';

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

    if(analytics||ads)loadGoogleTag();

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
      const footer=document.querySelector('footer .wrap')||document.querySelector('footer')||document.body;
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

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();
