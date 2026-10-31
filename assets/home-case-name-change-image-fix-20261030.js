(()=>{
  'use strict';
  const TARGET='/studii-de-caz/schimbare-nume-1996/';
  const IMAGE='/assets/schimbare-nume-premium-20261031.webp';
  const STYLE_ID='av-name-change-image-fix-20261030';

  const ensureStyle=()=>{
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #studii-de-caz-home .av-case-name-change .av-case-showcase-visual{position:relative!important;aspect-ratio:16/9!important;height:auto!important;min-height:0!important;overflow:hidden!important;background:#020405!important}
      #studii-de-caz-home .av-case-name-change .av-case-showcase-visual>img.av-name-change-slider-image{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center center!important;opacity:1!important;visibility:visible!important;filter:none!important;background:#020405!important}
    `;
    document.head.appendChild(s);
  };

  const apply=()=>{
    const section=document.getElementById('studii-de-caz-home');
    const card=section?.querySelector(`a[href="${TARGET}"]`);
    if(!card)return false;
    card.classList.add('av-case-name-change');
    const visual=card.querySelector('.av-case-showcase-visual');
    if(!visual)return false;
    visual.querySelector('.av-case-name-change-art')?.remove();
    let img=visual.querySelector('img.av-name-change-slider-image')||visual.querySelector('img');
    if(!img){
      img=document.createElement('img');
      visual.prepend(img);
    }
    img.classList.add('av-name-change-slider-image');
    img.setAttribute('src',IMAGE);
    img.setAttribute('width','640');
    img.setAttribute('height','1138');
    img.setAttribute('alt','Schimbare de nume — 11 august 1996, identitate și numerologie, studiu de caz AstroVip');
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
    img.setAttribute('loading','eager');
    img.setAttribute('fetchpriority','high');
    img.setAttribute('decoding','async');
    return true;
  };

  const boot=()=>{
    ensureStyle();
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(apply()||tries>200)clearInterval(timer);
    },100);
    apply();
    document.addEventListener('astrovip:cases-expanded',()=>{ensureStyle();apply()});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
