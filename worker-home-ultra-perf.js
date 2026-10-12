import baseWorker from './worker.js';

const HOMEPAGE_CRITICAL=`<style id="astrovip-ultra-critical-v8">
html body:not(.guide-page) #intrebare-gratuita,html body:not(.guide-page) #cine-analizeaza-harta,html body:not(.guide-page) #servicii,html body:not(.guide-page) #studii-de-caz-home,html body:not(.guide-page) #recenzii-google,html body:not(.guide-page) #oferte,html body:not(.guide-page) #programari,html body:not(.guide-page) #intrebari-frecvente,html body:not(.guide-page) #contact,html body:not(.guide-page) .trust-refs,html body:not(.guide-page) .av-directory,html body:not(.guide-page) .av-v9-tools{display:none!important}
html body:not(.guide-page) footer .av-footer-card--services{display:none!important}
</style><link rel="stylesheet" href="/assets/home-ultra-production-20261010.css?v=perf2"><script id="astrovip-home-runtime-loader">(()=>{const m=matchMedia('(max-width:820px)').matches;const s=document.createElement('script');s.src=m?'/assets/home-mobile-header-runtime-20261012.js?v=1':'/assets/home-ultra-production-20261010-v4.js?v=perf2';s.defer=true;document.head.appendChild(s)})();</script>`;

const STATIC_MOBILE_HERO=`<section id="av-mobile-static-home" aria-label="AstroVip astrologie premium"><div class="avm-hero-copy"><div class="avm-kicker">ASTROLOGIE PREMIUM · ASTROVIP</div><h1>CÂND CUNOȘTI <span>MOMENTUL,</span><br>TRĂIEȘTI VIITORUL.</h1><p>Claritate pentru dragoste, carieră, afaceri și destin — într-o experiență astrologică premium 1:1, construită în jurul momentului potrivit.</p><div class="avm-actions"><a class="avm-primary" href="#programari">PROGRAMEAZĂ CONSULTAȚIA →</a><a class="avm-secondary" href="/despre-astrovip/">DESCOPERĂ ASTROVIP</a></div></div><figure class="avm-photo"><img src="/assets/astrovip-hero-premium-mobile-20261001.webp?v=20261008-ux1" width="600" height="496" fetchpriority="high" loading="eager" decoding="async" alt="Cătălin Smaranda — AstroVip, astrologie premium"></figure><div class="avm-trust" aria-label="Repere AstroVip"><div><strong>33+ ANI</strong><span>experiență</span></div><div><strong>PREMIUM 1:1</strong><span>analiză personală</span></div><div><strong>BUCUREȘTI</strong><span>și online</span></div></div><section class="avm-interests" aria-labelledby="avm-interests-title"><h2 id="avm-interests-title">CE TE INTERESEAZĂ?</h2><div class="avm-grid"><a class="avm-card" href="/sinastrie/"><b>Dragoste</b><p>Compatibilitate, relații și momente importante.</p></a><a class="avm-card" href="/astrologie-cariera-vocatie/"><b>Carieră</b><p>Vocație, direcție profesională și timing.</p></a><a class="avm-card" href="/astrologie-afaceri/"><b>Afaceri &amp; Bani</b><p>Priorități, decizii și perioade importante.</p></a><a class="avm-card" href="/harta-natala/"><b>Destin</b><p>Hartă natală, repere și direcții personale.</p></a></div></section></section>`;

export default {
  async fetch(request,env,ctx){
    const response=await baseWorker.fetch(request,env,ctx);
    const url=new URL(request.url);
    const type=response.headers.get('content-type')||'';
    if(response.ok&&type.includes('text/html')&&(url.pathname==='/'||url.pathname==='')){
      let hasStaticMobileHero=false;
      return new HTMLRewriter()
        .on('head',{element(el){el.append(HOMEPAGE_CRITICAL,{html:true})}})
        .on('#av-mobile-static-home',{element(){hasStaticMobileHero=true}})
        .on('section.av-pro-hero',{element(el){if(!hasStaticMobileHero)el.before(STATIC_MOBILE_HERO,{html:true})}})
        .on('link[rel="preload"][as="image"]',{element(el){const href=el.getAttribute('href')||'';const media=el.getAttribute('media')||'';if((href.includes('astrovip-hero-premium-mobile-20261001.webp')&&media.includes('max-width:760px'))||(href.includes('astrovip-hero-desktop-final-20261002.avif')&&media.includes('min-width:761px')))el.remove()}})
        .on('script[src^="/assets/page-editor-runtime.js"]',{element(el){el.remove()}})
        .on('script[src^="/assets/home-ultra-production-20261010-v5-fix.js"]',{element(el){el.remove()}})
        .transform(response);
    }
    return response;
  }
};
