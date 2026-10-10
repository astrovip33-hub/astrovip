import baseWorker from './worker.js';

const HOMEPAGE_CRITICAL=`<style id="astrovip-ultra-critical-v7">
html body:not(.guide-page) #intrebare-gratuita,html body:not(.guide-page) #cine-analizeaza-harta,html body:not(.guide-page) #servicii,html body:not(.guide-page) #studii-de-caz-home,html body:not(.guide-page) #recenzii-google,html body:not(.guide-page) #oferte,html body:not(.guide-page) #programari,html body:not(.guide-page) #intrebari-frecvente,html body:not(.guide-page) #contact,html body:not(.guide-page) .trust-refs,html body:not(.guide-page) .av-directory,html body:not(.guide-page) .av-v9-tools{display:none!important}
html body:not(.guide-page) footer .av-footer-card--services{display:none!important}
</style><link rel="stylesheet" href="/assets/home-ultra-production-20261010.css?v=perf1"><script src="/assets/home-ultra-production-20261010-v4.js?v=perf1" defer></script>`;

export default {
  async fetch(request,env,ctx){
    const response=await baseWorker.fetch(request,env,ctx);
    const url=new URL(request.url);
    const type=response.headers.get('content-type')||'';
    if(response.ok&&type.includes('text/html')&&(url.pathname==='/'||url.pathname==='')){
      return new HTMLRewriter()
        .on('head',{element(el){el.append(HOMEPAGE_CRITICAL,{html:true})}})
        .on('script[src^="/assets/page-editor-runtime.js"]',{element(el){el.remove()}})
        .on('script[src^="/assets/home-ultra-production-20261010-v5-fix.js"]',{element(el){el.remove()}})
        .transform(response);
    }
    return response;
  }
};
