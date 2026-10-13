import baseWorker from './worker.js';
import { mobileHome, mobileStyles, cardlessStyles } from './homepage-approved-layout.js';

const HOMEPAGE_CRITICAL=`<meta name="astrovip-home-render" content="20261013-hard-mobile-main-only-preview2"><link rel="stylesheet" href="/assets/ux-refresh-20261008.css?v=20261008-header1"><style id="astrovip-cardless-premium-home-20261010">${cardlessStyles}</style><style id="astrovip-ultra-critical-v9-20261012">
html body:not(.guide-page) #intrebare-gratuita,html body:not(.guide-page) #cine-analizeaza-harta,html body:not(.guide-page) #servicii,html body:not(.guide-page) #studii-de-caz-home,html body:not(.guide-page) #recenzii-google,html body:not(.guide-page) #oferte,html body:not(.guide-page) #programari,html body:not(.guide-page) #intrebari-frecvente,html body:not(.guide-page) #contact,html body:not(.guide-page) .trust-refs,html body:not(.guide-page) .av-directory,html body:not(.guide-page) .av-v9-tools{display:none!important}
html body:not(.guide-page) footer .av-footer-card--services{display:none!important}
${mobileStyles}
@media(max-width:820px){
html.av-ultra-home-production body:not(.guide-page) main#top{display:block!important;width:100%!important;max-width:100%!important;min-height:0!important;margin:0!important;padding:0!important;overflow:visible!important}
html.av-ultra-home-production body:not(.guide-page) main#top>*:not(#av-mobile-approved-home):not(style):not(script){display:none!important;margin:0!important;padding:0!important;min-height:0!important;height:0!important;overflow:hidden!important}
html.av-ultra-home-production body:not(.guide-page) main#top>#av-mobile-approved-home{display:block!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important}
}
</style><link rel="stylesheet" href="/assets/home-ultra-production-20261010.css?v=ssr-20261012"><script src="/assets/home-approved-header-20261012.js?v=4" defer></script>`;

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
            el.before(mobileHome,{html:true});
            mobileHomeSeen=true;
          }
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