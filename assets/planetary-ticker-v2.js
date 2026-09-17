(function(){
  'use strict';
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

`;
  document.head.appendChild(style);
  const css=document.createElement('link');css.rel='stylesheet';css.href='/assets/planetary-ticker.css?v=20260917-mobile-2';document.head.appendChild(css);
  const script=document.createElement('script');script.src='/assets/planetary-ticker-core.js?v=20260917-mobile-2';script.async=false;document.head.appendChild(script);
})();
