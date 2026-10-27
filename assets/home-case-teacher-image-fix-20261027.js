(()=>{
  'use strict';
  const ASSET='/assets/vocatie-invatator-original-20261027.jpg';
  const apply=()=>{
    document.querySelectorAll('#studii-de-caz-home .av-case-teacher img').forEach(img=>{
      const set=(name,value)=>{if(img.getAttribute(name)!==value)img.setAttribute(name,value)};
      set('src',ASSET);
      set('width','1335');
      set('height','1536');
      img.removeAttribute('srcset');
      img.setAttribute('loading','eager');
      img.setAttribute('fetchpriority','high');
      img.decoding='async';
    });
  };
  const watch=()=>{
    const root=document.getElementById('studii-de-caz-home')||document.documentElement;
    new MutationObserver(apply).observe(root,{childList:true,subtree:true});
    document.addEventListener('astrovip:cases-expanded',apply);
    apply();
  };
  let style=document.getElementById('av-teacher-image-fix-style');
  if(!style){style=document.createElement('style');style.id='av-teacher-image-fix-style';document.head.appendChild(style)}
  style.textContent=`
    #studii-de-caz-home .av-case-teacher .av-case-showcase-visual,
    #studii-de-caz-home .av-case-teacher .av-case-local-space-visual{position:relative!important;aspect-ratio:16/9!important;height:auto!important;min-height:0!important;overflow:hidden!important;background:#fffbea!important;isolation:isolate!important}
    #studii-de-caz-home .av-case-teacher .av-case-showcase-visual::before,
    #studii-de-caz-home .av-case-teacher .av-case-showcase-visual::after,
    #studii-de-caz-home .av-case-teacher .av-case-local-space-visual::before,
    #studii-de-caz-home .av-case-teacher .av-case-local-space-visual::after{content:none!important;display:none!important;opacity:0!important;background:none!important;filter:none!important}
    #studii-de-caz-home .av-case-teacher .av-case-showcase-visual img,
    #studii-de-caz-home .av-case-teacher .av-case-local-space-visual img,
    #studii-de-caz-home .av-case-mobile-ticker .av-case-teacher img,
    #studii-de-caz-home .av-case-desktop-marquee-v9 .av-case-teacher img{position:relative!important;z-index:2!important;display:block!important;width:100%!important;height:100%!important;max-width:none!important;object-fit:contain!important;object-position:center center!important;opacity:1!important;visibility:visible!important;filter:none!important;mix-blend-mode:normal!important;transform:none!important;background:#fffbea!important}
    html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card.av-case-teacher .av-case-showcase-visual img{object-fit:contain!important;object-position:center!important;background:#fffbea!important}
    #studii-de-caz-home .av-case-teacher .av-case-local-space-symbol,
    #studii-de-caz-home .av-case-teacher .av-case-local-space-index{z-index:6!important}
  `;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
})();
