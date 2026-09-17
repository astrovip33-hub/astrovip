(function(){
  'use strict';
  const KEY='astrovip_consent_v2';
  const VERSION=2;
  const gtag=window.gtag||function(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments)};
  window.gtag=gtag;

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
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({event:'astrovip_consent_update',analytics_consent:analytics?'granted':'denied',ads_consent:ads?'granted':'denied'});
  }

  function loadChoice(){
    try{const v=JSON.parse(localStorage.getItem(KEY)||'null');return v&&v.v===VERSION?v:null}catch(e){return null}
  }
  function saveChoice(analytics,ads){
    const v={v:VERSION,analytics:!!analytics,ads:!!ads,ts:Date.now()};
    try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}
    updateConsent(v.analytics,v.ads);
    return v;
  }
  function build(){
    if(document.getElementById('av-consent'))return;
    const wrap=document.createElement('div');
    wrap.id='av-consent';wrap.className='av-consent';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-labelledby','av-consent-title');
    wrap.innerHTML='<div class="av-consent__inner"><h2 class="av-consent__title" id="av-consent-title">Confidențialitate și cookie-uri</h2><p class="av-consent__text">Folosim stocarea strict necesară pentru funcționarea site-ului. Cu acordul tău, putem permite măsurarea audienței și servicii Google de publicitate/personalizare. Poți refuza opționalele fără să pierzi accesul la site. <a href="/politica-cookie/">Detalii</a>.</p><div class="av-consent__prefs" id="av-consent-prefs" hidden><label class="av-consent__row"><span><strong>Necesare</strong><small>Securitate și funcționare de bază. Mereu active.</small></span><input class="av-consent__switch" type="checkbox" checked disabled aria-label="Cookie-uri necesare active"></label><label class="av-consent__row"><span><strong>Analiză</strong><small>Măsurarea traficului și performanței.</small></span><input class="av-consent__switch" id="av-consent-analytics" type="checkbox"></label><label class="av-consent__row"><span><strong>Publicitate și personalizare</strong><small>Google Ads, date pentru reclame și personalizare, dacă vor fi activate.</small></span><input class="av-consent__switch" id="av-consent-ads" type="checkbox"></label><button type="button" id="av-consent-save">Salvează selecția</button></div><div class="av-consent__actions"><button class="av-consent__reject" type="button" id="av-consent-reject">Respinge opționale</button><button type="button" id="av-consent-custom">Personalizează</button><button class="av-consent__accept" type="button" id="av-consent-accept">Acceptă toate</button></div></div>';
    document.body.appendChild(wrap);
    const manage=document.createElement('button');manage.type='button';manage.className='av-consent__manage';manage.id='av-consent-manage';manage.textContent='Setări cookie';manage.hidden=true;document.body.appendChild(manage);

    const prefs=wrap.querySelector('#av-consent-prefs'), analytics=wrap.querySelector('#av-consent-analytics'), ads=wrap.querySelector('#av-consent-ads');
    function close(){wrap.hidden=true;manage.hidden=false}
    function open(){const c=loadChoice();analytics.checked=!!(c&&c.analytics);ads.checked=!!(c&&c.ads);prefs.hidden=false;wrap.hidden=false;manage.hidden=true;wrap.querySelector('#av-consent-reject').focus()}
    wrap.querySelector('#av-consent-accept').addEventListener('click',()=>{saveChoice(true,true);close()});
    wrap.querySelector('#av-consent-reject').addEventListener('click',()=>{saveChoice(false,false);close()});
    wrap.querySelector('#av-consent-custom').addEventListener('click',()=>{prefs.hidden=!prefs.hidden;if(!prefs.hidden)analytics.focus()});
    wrap.querySelector('#av-consent-save').addEventListener('click',()=>{saveChoice(analytics.checked,ads.checked);close()});
    manage.addEventListener('click',open);

    const current=loadChoice();
    if(current){updateConsent(current.analytics,current.ads);wrap.hidden=true;manage.hidden=false}else{wrap.hidden=false;manage.hidden=true}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();
