(()=>{
  'use strict';
  const ASSET='/assets/vocatie-invatator-20261029.jpg';
  const apply=()=>{
    document.querySelectorAll('#studii-de-caz-home .av-case-teacher img').forEach(img=>{
      const set=(name,value)=>{if(img.getAttribute(name)!==value)img.setAttribute(name,value)};
      set('src',ASSET);
      set('width','1024');
      set('height','1536');
      img.removeAttribute('srcset');
      img.setAttribute('loading','eager');
      img.setAttribute('fetchpriority','high');
      img.setAttribute('decoding','async');
    });
  };
  const watch=()=>{
    const root=document.getElementById('studii-de-caz-home')||document.documentElement;
    new MutationObserver(apply).observe(root,{childList:true,subtree:true});
    document.addEventListener('astrovip:cases-expanded',apply);
    apply();
    setTimeout(apply,250);
    setTimeout(apply,900);
  };
  let style=document.getElementById('av-teacher-image-fix-style');
  if(!style){style=document.createElement('style');style.id='av-teacher-image-fix-style';document.head.appendChild(style)}
  const scope='html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home';
  style.textContent=`
    ${scope} .av-case-showcase-card.av-case-teacher::before,
    ${scope} .av-case-showcase-card.av-case-teacher::after{content:none!important;display:none!important}
    ${scope} .av-case-showcase-card.av-case-teacher .av-case-showcase-visual{position:relative!important;width:100%!important;min-height:0!important;padding:0!important;overflow:hidden!important;background:#030705!important;isolation:isolate!important;aspect-ratio:16/9!important}
    ${scope} .av-case-showcase-card.av-case-teacher .av-case-showcase-visual::before,
    ${scope} .av-case-showcase-card.av-case-teacher .av-case-showcase-visual::after{content:none!important;display:none!important;opacity:0!important;background:none!important;filter:none!important}
    ${scope} .av-case-showcase-card.av-case-teacher .av-case-showcase-visual img{position:relative!important;z-index:2!important;display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;aspect-ratio:auto!important;object-fit:contain!important;object-position:center center!important;opacity:1!important;visibility:visible!important;filter:none!important;mix-blend-mode:normal!important;transform:none!important;background:#030705!important}
    ${scope} .av-case-showcase-card.av-case-teacher .av-case-local-space-symbol,
    ${scope} .av-case-showcase-card.av-case-teacher .av-case-local-space-index{display:none!important}
    @media(max-width:820px){
      ${scope} .av-case-mobile-ticker .av-case-showcase-card.av-case-teacher .av-case-showcase-visual{flex:0 0 auto!important;height:calc(var(--av-mobile-case-width,320px) * .5625)!important;min-height:0!important;max-height:none!important;aspect-ratio:16/9!important}
    }
    @media(min-width:821px){
      ${scope} .av-case-desktop-marquee-v9 .av-case-showcase-card.av-case-teacher .av-case-showcase-visual{flex:0 0 300px!important;height:300px!important;min-height:0!important;max-height:300px!important;aspect-ratio:auto!important}
    }
  `;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
})();
