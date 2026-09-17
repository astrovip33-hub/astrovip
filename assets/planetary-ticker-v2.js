(function(){
  'use strict';
  function load(src){
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    document.head.appendChild(s);
  }

  // Preview 2026-09-16 — compact desktop reading rhythm across shared guide pages.
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

    /* Correction: restore Contact AstroVip to its original look. */
    body:not(.guide-page) #contact .contact-grid{
      max-width:none!important;
      margin-left:auto!important;
      margin-right:auto!important;
      align-items:stretch!important;
    }
    body:not(.guide-page) #contact .contact-grid > .box:first-child{
      position:static!important;
      isolation:auto!important;
      width:auto!important;
      max-width:none!important;
      justify-self:stretch!important;
      overflow:visible!important;
      padding:28px!important;
      border:1px solid var(--line)!important;
      border-radius:24px!important;
      background:rgba(5,23,51,.84)!important;
      box-shadow:none!important;
      backdrop-filter:blur(10px)!important;
    }
    body:not(.guide-page) #contact .contact-grid > .box:first-child::before,
    body:not(.guide-page) #contact .contact-grid > .box:first-child::after{display:none!important}
    body:not(.guide-page) #contact .contact-grid > .box:first-child .kicker{
      color:var(--electric)!important;
      letter-spacing:1.3px!important;
      text-shadow:none!important;
    }
    body:not(.guide-page) #contact .contact-grid > .box:first-child h2{
      margin:0 0 15px!important;
      color:var(--gold)!important;
      font-size:38px!important;
      line-height:1.05!important;
      letter-spacing:normal!important;
      text-shadow:none!important;
    }
    body:not(.guide-page) #contact .contact-grid > .box:first-child > p{
      max-width:none!important;
      margin:1em 0!important;
      color:var(--muted)!important;
      font-size:inherit!important;
      line-height:inherit!important;
    }
    body:not(.guide-page) #contact .contact-info{gap:9px!important;margin:22px 0!important}
    body:not(.guide-page) #contact .contact-info a,
    body:not(.guide-page) #contact .contact-info span{
      display:block!important;
      min-height:0!important;
      padding:0!important;
      border:0!important;
      border-radius:0!important;
      background:transparent!important;
      box-shadow:none!important;
      color:#fff!important;
      font-weight:850!important;
      letter-spacing:normal!important;
    }
    @media (min-width:981px){
      body:not(.guide-page) #contact .contact-grid{
        grid-template-columns:.95fr 1.05fr!important;
        gap:24px!important;
      }
    }
    @media (max-width:760px){
      body:not(.guide-page) #contact .contact-grid > .box:first-child{
        padding:20px!important;
        border-radius:20px!important;
      }
      body:not(.guide-page) #contact .contact-grid > .box:first-child h2{font-size:31px!important}
    }

    /* Company data card: emerald green premium background. */
    body:not(.guide-page) .trust-commerce-card{
      border-color:rgba(246,199,95,.96)!important;
      background:
        radial-gradient(circle at 16% 12%,rgba(132,255,181,.32),transparent 32%),
        radial-gradient(circle at 86% 84%,rgba(246,199,95,.20),transparent 36%),
        linear-gradient(145deg,#128051 0%,#08613d 45%,#043823 100%)!important;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.22),
        inset 0 0 42px rgba(0,24,13,.16),
        0 16px 38px rgba(0,0,0,.34),
        0 0 30px rgba(56,245,138,.18),
        0 0 22px rgba(246,199,95,.10)!important;
    }
    body:not(.guide-page) .trust-commerce-card::before{
      border-color:rgba(255,227,151,.42)!important;
    }
    body:not(.guide-page) .trust-commerce-kicker{
      color:#ffe39b!important;
      text-shadow:0 0 12px rgba(246,199,95,.25)!important;
    }
    body:not(.guide-page) .trust-commerce-card strong{
      color:#fff!important;
      text-shadow:0 2px 16px rgba(0,0,0,.22)!important;
    }
    body:not(.guide-page) .trust-commerce-points span{
      color:#fff!important;
      border-color:rgba(255,231,170,.34)!important;
      background:linear-gradient(180deg,rgba(2,55,33,.46),rgba(1,34,21,.38))!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.08)!important;
    }
  `;
  document.head.appendChild(style);

  load('/assets/planetary-ticker-core.js?v=20260916');
  load('/assets/home-opportunities.js?v=20260916');
})();