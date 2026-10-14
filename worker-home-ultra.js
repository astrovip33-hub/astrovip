import baseWorker from './worker.js';
import { mobileHome, mobileStyles, cardlessStyles } from './homepage-approved-layout.js';

const PAYMENT_URL='https://buy.stripe.com/4gMeVcbz75J207y6fefjG00';
const mobileHomePayment=mobileHome.replace('href="#programari">PROGRAMEAZĂ CONSULTAȚIA →','href="'+PAYMENT_URL+'">PLĂTEȘTE CU CARDUL · 500 LEI →');
const PAYMENT_CTA=`<section id="av-home-payment-cta" class="av-home-paybar" aria-label="Plată consultație AstroVip"><div class="av-home-paybar-inner"><div><span>CONSULTAȚIE PREMIUM · 60 MIN</span><strong>Plată securizată cu cardul</strong><small>500 lei · procesare securizată prin Stripe</small></div><a href="${PAYMENT_URL}" aria-label="Plătește consultația AstroVip cu cardul, 500 lei">PLĂTEȘTE CU CARDUL · 500 LEI →</a></div></section>`;

const HOMEPAGE_CRITICAL=`<meta name="astrovip-home-render" content="20261014-case-studies-v6"><link rel="stylesheet" href="/assets/ux-refresh-20261008.css?v=20261008-header1"><style id="astrovip-cardless-premium-home-20261010">${cardlessStyles}</style><style id="astrovip-ultra-critical-v9-20261012">
html body:not(.guide-page) #intrebare-gratuita,html body:not(.guide-page) #cine-analizeaza-harta,html body:not(.guide-page) #servicii,html body:not(.guide-page) #recenzii-google,html body:not(.guide-page) #oferte,html body:not(.guide-page) #programari,html body:not(.guide-page) #intrebari-frecvente,html body:not(.guide-page) #contact,html body:not(.guide-page) .trust-refs,html body:not(.guide-page) .av-directory,html body:not(.guide-page) .av-v9-tools{display:none!important}
html body:not(.guide-page) footer .av-footer-card--services{display:none!important}
.av-home-paybar{display:block;width:100%;padding:18px 18px 22px;background:#020302;border-top:1px solid rgba(231,198,106,.22);border-bottom:1px solid rgba(231,198,106,.18)}
.av-home-paybar-inner{width:min(1080px,94%);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:18px 22px;border:1px solid rgba(231,198,106,.48);border-radius:18px;background:linear-gradient(145deg,#0b130d,#040605);box-shadow:0 18px 42px rgba(0,0,0,.34),0 0 25px rgba(46,255,119,.05)}
.av-home-paybar-inner>div{display:flex;flex-direction:column;gap:3px}.av-home-paybar-inner span{color:#b8ffd4;font:900 11px/1.2 Inter,system-ui,sans-serif;letter-spacing:.09em}.av-home-paybar-inner strong{color:#f6e5aa;font:900 clamp(21px,2.4vw,30px)/1.12 Georgia,'Times New Roman',serif}.av-home-paybar-inner small{color:#c7cec8;font:700 13px/1.35 Inter,system-ui,sans-serif}.av-home-paybar-inner>a{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:13px 22px;border:1px solid #f7dc80;border-radius:999px;background:linear-gradient(180deg,#fff2ac,#e3c35f 52%,#b5852c);color:#171006!important;text-decoration:none;font:950 13px/1.15 Inter,system-ui,sans-serif;letter-spacing:.02em;white-space:nowrap;box-shadow:0 10px 30px rgba(216,174,72,.18),0 0 16px rgba(57,255,20,.08)}
${mobileStyles}
#av-mobile-approved-header .avm-chat{border:0!important;outline:0!important;box-shadow:none!important}
@media(max-width:820px){
.av-home-paybar{display:none!important}
html.av-ultra-home-production body:not(.guide-page) main#top{display:block!important;width:100%!important;max-width:100%!important;min-height:0!important;margin:0!important;padding:0!important;overflow:visible!important}
html.av-ultra-home-production body:not(.guide-page) main#top>*:not(#av-mobile-approved-home):not(#studii-de-caz-home):not(style):not(script){display:none!important;margin:0!important;padding:0!important;min-height:0!important;height:0!important;overflow:hidden!important}
html.av-ultra-home-production body:not(.guide-page) main#top>#av-mobile-approved-home{display:block!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important}
}
@media(min-width:821px) and (max-width:980px){.av-home-paybar-inner{align-items:flex-start;flex-direction:column}.av-home-paybar-inner>a{width:100%}}
</style><link rel="stylesheet" href="/assets/home-ultra-production-20261010.css?v=ssr-20261012"><link rel="stylesheet" href="/assets/case-studies-slider-lux-v5-20261014.css?v=2"><style id="av-case-force-visible-v6">html.av-ultra-home-production body:not(.guide-page) #studii-de-caz-home{display:block!important;visibility:visible!important;opacity:1!important;height:auto!important;min-height:1px!important}</style><script src="/assets/home-approved-header-20261012.js?v=4" defer></script>`;

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