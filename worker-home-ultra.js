import baseWorker from './worker.js';
import { mobileHome, mobileStyles, cardlessStyles } from './homepage-approved-layout.js';

const PAYMENT_URL='https://buy.stripe.com/4gMeVcbz75J207y6fefjG00';
const mobileHomePayment=mobileHome.replace('href="#programari">PROGRAMEAZĂ CONSULTAȚIA →','href="'+PAYMENT_URL+'">PLĂTEȘTE CU CARDUL · 500 LEI →');
const PAYMENT_CTA=`<section id="av-home-payment-cta" class="av-home-paybar" aria-label="Plată consultație AstroVip"><div class="av-home-paybar-inner"><div><span>CONSULTAȚIE PREMIUM · 60 MIN</span><strong>Plată securizată cu cardul</strong><small>500 lei · procesare securizată prin Stripe</small></div><a href="${PAYMENT_URL}" aria-label="Plătește consultația AstroVip cu cardul, 500 lei">PLĂTEȘTE CU CARDUL · 500 LEI →</a></div></section>`;
const CASE_NAV_V8=`<nav class="av-case-mobile-nav-v7" aria-label="Navigare studii de caz" data-av-case-nav="v8"><button type="button" class="av-case-arrow-v7" data-case-prev aria-label="Studiul anterior">‹</button><div class="av-case-dots-v7" data-case-dots aria-label="Alege studiul"></div><span class="av-case-count-v7" data-case-count aria-live="polite">1 / …</span><button type="button" class="av-case-arrow-v7" data-case-next aria-label="Studiul următor">›</button></nav>`;
const CASE_SLIDER_V8_JS=`(()=>{'use strict';const init=()=>{const s=document.getElementById('studii-de-caz-home');if(!s||s.dataset.avSliderV8==='1')return;const t=s.querySelector('.av-case-showcase-grid');if(!t)return;const cards=[...t.querySelectorAll('.av-case-showcase-card')];if(cards.length<2)return;const nav=s.querySelector('.av-case-mobile-nav-v7'),prev=nav&&nav.querySelector('[data-case-prev]'),next=nav&&nav.querySelector('[data-case-next]'),dotsWrap=nav&&nav.querySelector('[data-case-dots]'),count=nav&&nav.querySelector('[data-case-count]');if(!nav||!prev||!next||!dotsWrap||!count)return;s.dataset.avSliderV8='1';dotsWrap.textContent='';let current=0,raf=0;const dots=cards.map((card,i)=>{const b=document.createElement('button');b.type='button';b.className='av-case-dot-v7';b.setAttribute('aria-label','Studiul '+(i+1)+' din '+cards.length);dotsWrap.appendChild(b);return b});const update=i=>{current=Math.max(0,Math.min(cards.length-1,i));dots.forEach((d,n)=>{const a=n===current;d.classList.toggle('is-active',a);d.setAttribute('aria-current',a?'true':'false')});count.textContent=(current+1)+' / '+cards.length;prev.disabled=current===0;next.disabled=current===cards.length-1};const leftFor=card=>Math.max(0,card.offsetLeft-(t.clientWidth-card.clientWidth)/2);const go=(i,smooth=true)=>{const target=Math.max(0,Math.min(cards.length-1,i)),card=cards[target];if(!card)return;update(target);t.scrollTo({left:leftFor(card),behavior:smooth?'smooth':'auto'})};dots.forEach((d,i)=>d.addEventListener('click',()=>go(i,true)));prev.addEventListener('click',()=>go(current-1,true));next.addEventListener('click',()=>go(current+1,true));const sync=()=>{raf=0;const center=t.scrollLeft+t.clientWidth/2;let best=0,dist=Infinity;cards.forEach((card,i)=>{const x=Math.abs(card.offsetLeft+card.clientWidth/2-center);if(x<dist){dist=x;best=i}});if(best!==current)update(best)};t.addEventListener('scroll',()=>{if(raf)cancelAnimationFrame(raf);raf=requestAnimationFrame(sync)},{passive:true});window.addEventListener('resize',()=>go(current,false),{passive:true});update(0);requestAnimationFrame(()=>go(0,false))};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();`;

const HOMEPAGE_CRITICAL=`<meta name="astrovip-home-render" content="20261014-case-studies-mobile-v8-refined3"><link rel="stylesheet" href="/assets/ux-refresh-20261008.css?v=20261008-header1"><style id="astrovip-cardless-premium-home-20261010">${cardlessStyles}</style><style id="astrovip-ultra-critical-v9-20261012">
html body:not(.guide-page) #intrebare-gratuita,html body:not(.guide-page) #cine-analizeaza-harta,html body:not(.guide-page) #servicii,html body:not(.guide-page) #recenzii-google,html body:not(.guide-page) #oferte,html body:not(.guide-page) #programari,html body:not(.guide-page) #intrebari-frecvente,html body:not(.guide-page) #contact,html body:not(.guide-page) .trust-refs,html body:not(.guide-page) .av-directory,html body:not(.guide-page) .av-v9-tools{display:none!important}
html body:not(.guide-page) footer .av-footer-card--services{display:none!important}
.av-home-paybar{display:block;width:100%;padding:18px 18px 22px;background:#020302;border-top:1px solid rgba(231,198,106,.22);border-bottom:1px solid rgba(231,198,106,.18)}
.av-home-paybar-inner{width:min(1080px,94%);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:18px 22px;border:1px solid rgba(231,198,106,.48);border-radius:18px;background:linear-gradient(145deg,#0b130d,#040605);box-shadow:0 18px 42px rgba(0,0,0,.34),0 0 25px rgba(46,255,119,.05)}
.av-home-paybar-inner>div{display:flex;flex-direction:column;gap:3px}.av-home-paybar-inner span{color:#b8ffd4;font:900 11px/1.2 Inter,system-ui,sans-serif;letter-spacing:.09em}.av-home-paybar-inner strong{color:#f6e5aa;font:900 clamp(21px,2.4vw,30px)/1.12 Georgia,'Times New Roman',serif}.av-home-paybar-inner small{color:#c7cec8;font:700 13px/1.35 Inter,system-ui,sans-serif}.av-home-paybar-inner>a{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:13px 22px;border:1px solid #f7dc80;border-radius:999px;background:linear-gradient(180deg,#fff2ac,#e3c35f 52%,#b5852c);color:#171006!important;text-decoration:none;font:950 13px/1.15 Inter,system-ui,sans-serif;letter-spacing:.02em;white-space:nowrap;box-shadow:0 10px 30px rgba(216,174,72,.18),0 0 16px rgba(57,255,20,.08)}
${mobileStyles}
#av-mobile-approved-header{grid-template-columns:minmax(128px,1fr) 38px 72px 38px!important;gap:7px!important;padding:5px 10px!important;background:linear-gradient(180deg,rgba(3,8,5,.98),rgba(2,5,3,.96))!important;border-bottom:1px solid rgba(231,198,106,.48)!important;box-shadow:0 8px 26px rgba(0,0,0,.34),0 1px 0 rgba(57,255,20,.06)!important}
#av-mobile-approved-header .avm-logo{width:clamp(128px,39vw,158px)!important;height:50px!important}
#av-mobile-approved-header .avm-logo svg{width:clamp(128px,39vw,158px)!important;max-width:158px!important;filter:drop-shadow(0 0 8px rgba(231,198,106,.10))!important}
#av-mobile-approved-header .avm-flags{position:relative!important;display:flex!important;width:38px!important;height:38px!important;overflow:visible!important}
#av-mobile-approved-header .avm-flags a{display:none!important}
#av-mobile-approved-header .avm-flags a:first-child{display:block!important;flex:0 0 38px!important;width:38px!important;height:38px!important;padding:5px!important;border:1px solid rgba(231,198,106,.48)!important;border-radius:50%!important;background:#070b08!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 0 14px rgba(231,198,106,.06)!important;box-sizing:border-box!important}
#av-mobile-approved-header .avm-flags a:first-child img{width:26px!important;height:26px!important;border-radius:50%!important;object-fit:cover!important}
#av-mobile-approved-header .avm-chat{width:72px!important;height:38px!important;border:1px solid rgba(231,198,106,.56)!important;outline:0!important;border-radius:999px!important;background:linear-gradient(180deg,#11150f,#050806)!important;color:#f8f3e7!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 0 15px rgba(231,198,106,.06)!important;letter-spacing:.08em!important}
#av-mobile-approved-header .avm-chat span{background:#39ff14!important;box-shadow:0 0 9px rgba(57,255,20,.75)!important}
#av-mobile-approved-header .avm-hamb{width:38px!important;height:38px!important;gap:5px!important}
#av-mobile-approved-header .avm-hamb i{width:25px!important;height:2px!important;background:linear-gradient(90deg,#f0cf67,#39ff14)!important;box-shadow:0 0 7px rgba(57,255,20,.10)!important}
@media(max-width:820px){
.av-home-paybar{display:none!important}
html.av-ultra-home-production body:not(.guide-page) main#top{display:block!important;width:100%!important;max-width:100%!important;min-height:0!important;margin:0!important;padding:0!important;overflow:visible!important}
html.av-ultra-home-production body:not(.guide-page) main#top>*:not(#av-mobile-approved-home):not(#studii-de-caz-home):not(style):not(script){display:none!important;margin:0!important;padding:0!important;min-height:0!important;height:0!important;overflow:hidden!important}
html.av-ultra-home-production body:not(.guide-page) main#top>#av-mobile-approved-home{display:block!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important}
}
@media(min-width:821px) and (max-width:980px){.av-home-paybar-inner{align-items:flex-start;flex-direction:column}.av-home-paybar-inner>a{width:100%}}
</style><link rel="stylesheet" href="/assets/home-ultra-production-20261010.css?v=ssr-20261012"><link rel="stylesheet" href="/assets/case-studies-slider-lux-v5-20261014.css?v=2"><link rel="stylesheet" href="/assets/case-studies-mobile-premium-v6-20261014.css?v=20261014-v6-2"><style id="av-case-slider-v8-critical">
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home{display:block!important;visibility:visible!important;opacity:1!important;height:auto!important;min-height:1px!important}
@media(max-width:820px){
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home{overflow:hidden!important}
html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-frame{overflow:hidden!important;padding-top:22px!important}
html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-frame::before{top:8px!important;left:26%!important;right:26%!important;opacity:.72!important}
html.av-ultra-home-production.av-cardless-home body:not(.guide-page) #studii-de-caz-home .av-case-showcase-frame::after{content:none!important;display:none!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid{display:flex!important;grid-template-columns:none!important;align-items:flex-start!important;gap:14px!important;width:100%!important;max-width:none!important;margin:0!important;padding:5px 8% 18px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;scroll-padding-inline:8%!important;scrollbar-width:none!important;-ms-overflow-style:none!important;-webkit-overflow-scrolling:touch!important;overscroll-behavior-inline:contain!important;touch-action:pan-x pan-y!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-grid::-webkit-scrollbar{display:none!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-card{display:block!important;align-self:flex-start!important;flex:0 0 84%!important;width:84%!important;min-width:84%!important;max-width:390px!important;height:auto!important;min-height:0!important;margin:0!important;scroll-snap-align:center!important;scroll-snap-stop:always!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual{height:clamp(132px,38vw,154px)!important;min-height:0!important;max-height:154px!important;aspect-ratio:auto!important;overflow:hidden!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual>a{display:block!important;width:100%!important;height:100%!important;overflow:hidden!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-showcase-visual img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-mobile-nav-v7{display:grid!important;grid-template-columns:46px minmax(0,1fr) auto 46px!important;align-items:center!important;gap:9px!important;width:calc(100% - 32px)!important;max-width:430px!important;margin:2px auto 0!important;padding:9px 10px!important;border:1px solid rgba(235,201,93,.44)!important;border-radius:999px!important;background:linear-gradient(180deg,rgba(10,22,17,.97),rgba(3,8,6,.98))!important;box-shadow:0 12px 34px rgba(0,0,0,.45),0 0 20px rgba(57,255,20,.055)!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-arrow-v7{display:flex!important;align-items:center!important;justify-content:center!important;width:42px!important;height:42px!important;margin:0!important;padding:0!important;border:1px solid rgba(241,207,99,.62)!important;border-radius:50%!important;background:radial-gradient(circle at 35% 25%,#253c24,#07110d 68%)!important;color:#f8e7a4!important;font:900 28px/1 Georgia,serif!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 0 14px rgba(216,245,0,.08)!important;cursor:pointer!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-arrow-v7:disabled{opacity:.34!important;cursor:default!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-dots-v7{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:7px!important;min-width:0!important;overflow-x:auto!important;scrollbar-width:none!important;padding:7px 2px!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-dots-v7::-webkit-scrollbar{display:none!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-dot-v7{flex:0 0 8px!important;width:8px!important;height:8px!important;min-width:8px!important;min-height:8px!important;margin:0!important;padding:0!important;border:0!important;border-radius:999px!important;background:rgba(244,231,178,.30)!important;box-shadow:none!important;transition:width .2s ease,background .2s ease,box-shadow .2s ease!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-dot-v7.is-active{flex-basis:27px!important;width:27px!important;background:linear-gradient(90deg,#e5c458,#39ff14)!important;box-shadow:0 0 12px rgba(57,255,20,.26)!important}
html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home .av-case-count-v7{display:block!important;min-width:38px!important;color:#f5dfa0!important;font:900 11px/1 Inter,system-ui,sans-serif!important;letter-spacing:.08em!important;text-align:center!important;white-space:nowrap!important}
}
@media(min-width:821px){#studii-de-caz-home .av-case-mobile-nav-v7{display:none!important}}
</style><script src="/assets/home-approved-header-20261012.js?v=4" defer></script><script id="av-case-slider-v8-inline">${CASE_SLIDER_V8_JS}</script>`;

export default {
  async fetch(request,env,ctx){
    const response=await baseWorker.fetch(request,env,ctx);
    const url=new URL(request.url);
    const type=response.headers.get('content-type')||'';
    if(response.ok&&type.includes('text/html')&&(url.pathname==='/'||url.pathname==='')){
      let mobileHomeSeen=false;
      let desktopHeroSeen=false;

      return new HTMLRewriter()
        .on('html',{element(el){el.setAttribute('class',`${el.getAttribute('class')||''} av-ultra-home-production av-cardless-home`)}})
        .on('#av-mobile-approved-home',{element(el){
          if(mobileHomeSeen){el.remove();return;}
          mobileHomeSeen=true;
        }})
        .on('section.av-pro-hero',{element(el){
          if(desktopHeroSeen){el.remove();return;}
          desktopHeroSeen=true;
          if(!mobileHomeSeen){
            el.before(mobileHomePayment,{html:true});
            mobileHomeSeen=true;
          }
          el.after(PAYMENT_CTA,{html:true});
        }})
        .on('#studii-de-caz-home',{element(el){
          el.setAttribute('data-av-slider-shell','v8');
          el.append(CASE_NAV_V8,{html:true});
        }})
        .on('head',{element(el){el.append(HOMEPAGE_CRITICAL,{html:true})}})
        .on('link[rel="stylesheet"][href^="/assets/ux-refresh-20261008.css"]',{element(el){el.remove()}})
        .on('section.av-pro-hero .av-pro-visual picture source[media="(max-width:760px)"]',{element(el){el.remove()}})
        .on('section.av-pro-hero .av-pro-visual picture source[media="(min-width:761px)"]',{element(el){el.setAttribute('media','(min-width:821px)')}})
        .on('section.av-pro-hero .av-pro-visual picture img',{element(el){el.setAttribute('src','data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==')}})
        .on('script[src^="/assets/home-ultra-production-20261010-v4.js"]',{element(el){el.remove()}})
        .on('script[src^="/assets/page-editor-runtime.js"]',{element(el){el.remove()}})
        .on('link[rel="preload"][as="image"]',{element(el){const href=el.getAttribute('href')||'';if(href.includes('astrovip-hero-premium-mobile-20261001.webp'))el.setAttribute('media','(max-width:820px)');if(href.includes('astrovip-hero-desktop-final-20261002.avif'))el.setAttribute('media','(min-width:821px)')}})
        .on('script[src^="/assets/home-ultra-production-20261010-v5-fix.js"]',{element(el){el.remove()}})
        .transform(response);
    }
    return response;
  }
};