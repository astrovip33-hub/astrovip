(function(){
  'use strict';
  function load(src){
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    document.head.appendChild(s);
  }
  function loadWithCallback(src,cb){
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.onload=cb||null;
    s.onerror=cb||null;
    document.head.appendChild(s);
  }

  // Compact desktop reading rhythm across shared guide pages.
  const style=document.createElement('style');
  style.textContent=`
    @media (min-width:981px){
      body.guide-page .guide-hero{padding:62px 0 42px!important}
      body.guide-page .guide-hero h1{max-width:1040px!important;font-size:clamp(42px,4.8vw,64px)!important;line-height:1.04!important}
      body.guide-page .guide-lead{max-width:980px!important;line-height:1.58!important}
      body.guide-page .guide-breadcrumbs{padding:13px 0!important}
      body.guide-page .guide-main{padding:24px 0 56px!important}
      body.guide-page .guide-layout{grid-template-columns:minmax(0,1fr) 270px!important;gap:30px!important}
      body.guide-page .guide-content section{padding:11px 0 22px!important}
      body.guide-page .guide-content h2{font-size:clamp(28px,3vw,39px)!important;line-height:1.12!important;margin:4px 0 10px!important;max-width:none!important}
      body.guide-page .guide-content h3{margin:18px 0 7px!important}
      body.guide-page .guide-content p{font-size:16px!important;line-height:1.62!important;margin:0 0 12px!important;max-width:none!important}
      body.guide-page .guide-content ul{margin-top:8px!important;margin-bottom:12px!important}
      body.guide-page .guide-content li{margin:5px 0!important}
      body.guide-page .guide-faq{gap:9px!important}
      body.guide-page .guide-faq details{padding:12px 14px!important}
      body.guide-page .guide-related{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:10px!important}
      body.guide-page .guide-related a{padding:13px!important}
      body.guide-page .guide-author{margin-top:18px!important;padding:18px!important}
      body.guide-page .guide-aside{gap:12px!important}
      body.guide-page .guide-side-card{padding:16px!important}
      body.guide-page .guide-footer{padding:24px 0!important}
    }

    /* Mobile ticker: two complete entries per screen, moved in exact steps so text is never cut at the edges. */
    @media (max-width:820px){
      body .planet-strip{overflow:hidden!important}
      body .planet-strip-inner{display:block!important;width:100%!important;min-height:46px!important}
      body .planet-ticker{width:100%!important;max-width:100%!important;overflow:hidden!important;mask-image:none!important;-webkit-mask-image:none!important}
      body .planet-track{display:flex!important;width:max-content!important;gap:0!important;padding:0!important;animation:avTicker 40s steps(10,end) infinite!important;will-change:transform}
      body .planet-item{box-sizing:border-box!important;flex:0 0 50vw!important;width:50vw!important;min-width:50vw!important;max-width:50vw!important;justify-content:center!important;gap:4px!important;padding:10px 4px!important;overflow:hidden!important;font-size:12.5px!important;line-height:1.1!important;text-align:center!important}
      body .planet-glyph{flex:0 0 auto!important;font-size:17px!important}
      body .planet-item strong,body .planet-item>span{flex:0 0 auto!important;white-space:nowrap!important}
      body:not(.guide-page) .planet-strip+main{padding-top:6px!important}
    }
    @media (max-width:390px){
      body .planet-item{font-size:11.5px!important;gap:3px!important;padding-left:2px!important;padding-right:2px!important}
      body .planet-glyph{font-size:16px!important}
    }
  `;
  document.head.appendChild(style);

  load('/assets/planetary-ticker-core.js?v=20260917-mobilefix');
  load('/assets/home-opportunities.js?v=20260916');

  // AstroVip spectacular motion layer — homepage only. Falls back cleanly if CDN is unavailable.
  if(location.pathname==='/' || location.pathname==='/index.html'){
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='/assets/astrovip-motion.css?v=20260916-2339';
    document.head.appendChild(css);
    loadWithCallback('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js',function(){
      loadWithCallback('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js',function(){
        load('/assets/astrovip-motion.js?v=20260917-0649');
      });
    });
  }
})();