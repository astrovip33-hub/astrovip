import baseWorker from './worker.js';

const HOMEPAGE_CRITICAL=`<style id="astrovip-ultra-critical-v6">
html body:not(.guide-page) #intrebare-gratuita,html body:not(.guide-page) #cine-analizeaza-harta,html body:not(.guide-page) #servicii,html body:not(.guide-page) #studii-de-caz-home,html body:not(.guide-page) #recenzii-google,html body:not(.guide-page) #oferte,html body:not(.guide-page) #programari,html body:not(.guide-page) #intrebari-frecvente,html body:not(.guide-page) #contact,html body:not(.guide-page) .trust-refs,html body:not(.guide-page) .av-directory,html body:not(.guide-page) .av-v9-tools{display:none!important}
html body:not(.guide-page) footer .av-footer-card--services,html body:not(.guide-page) footer .av-footer-eyebrow,html body:not(.guide-page) footer .av-footer-card-title,html body:not(.guide-page) footer .av-footer-experience,html body:not(.guide-page) footer .av-footer-price,html body:not(.guide-page) footer .av-footer-card-actions,html body:not(.guide-page) footer .av-footer-card-kicker,html body:not(.guide-page) footer .av-footer-card--contact h2,html body:not(.guide-page) footer .av-footer-static,html body:not(.guide-page) footer .av-footer-whatsapp{display:none!important}
html body:not(.guide-page) footer,html body:not(.guide-page) footer .wrap,html body:not(.guide-page) footer .av-footer-premium-single{padding-top:10px!important;padding-bottom:10px!important;margin-top:0!important;margin-bottom:0!important;border:0!important;box-shadow:none!important;background:#010201!important}
html body:not(.guide-page) footer .av-footer-grid--cards{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px 30px!important;padding:0!important;margin:0!important}
html body:not(.guide-page) footer .av-footer-card--brand{display:block!important;min-height:0!important;height:auto!important;padding:8px 0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
html body:not(.guide-page) footer .av-footer-logo{margin:0!important;font-size:32px!important;line-height:1!important}
html body:not(.guide-page) footer .av-footer-card--contact{display:flex!important;flex-wrap:wrap!important;align-items:center!important;justify-content:flex-end!important;gap:4px 16px!important;min-height:0!important;height:auto!important;padding:6px 0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
html body:not(.guide-page) footer .av-footer-card--contact>a{display:inline-flex!important;min-height:0!important;padding:3px 0!important;margin:0!important;border:0!important;background:transparent!important;box-shadow:none!important;font-size:12px!important;line-height:1.3!important}
html body:not(.guide-page) footer .av-footer-bottom{min-height:0!important;height:auto!important;margin:8px 0 0!important;padding:8px 0!important;border:0!important;box-shadow:none!important;gap:6px 14px!important}
html body:not(.guide-page) footer .av-footer-bottom p,html body:not(.guide-page) footer .av-footer-bottom nav{margin:0!important;font-size:10px!important;line-height:1.35!important}
html body:not(.guide-page) footer .av-footer-disclaimer{margin:5px 0 0!important;padding:0!important;font-size:9px!important;line-height:1.35!important}
@media(max-width:820px){html body:not(.guide-page) footer .av-footer-grid--cards{display:block!important;text-align:center!important}html body:not(.guide-page) footer .av-footer-card--brand{padding:6px 0 8px!important}html body:not(.guide-page) footer .av-footer-logo{font-size:28px!important}html body:not(.guide-page) footer .av-footer-card--contact{justify-content:center!important;padding:5px 0!important;gap:2px 13px!important}html body:not(.guide-page) footer .av-footer-card--contact>a{font-size:11px!important;padding:2px 0!important}html body:not(.guide-page) footer .av-footer-bottom{flex-direction:column!important;text-align:center!important;padding:7px 0!important;margin-top:5px!important}html body:not(.guide-page) footer .av-footer-bottom nav{justify-content:center!important;flex-wrap:wrap!important}html body:not(.guide-page) footer .av-footer-disclaimer{text-align:center!important;max-width:340px!important;margin:4px auto 0!important}}
</style><script src="/assets/home-ultra-production-20261010-v4.js" defer></script><script src="/assets/home-ultra-production-20261010-v5-fix.js" defer></script>`;

export default {
  async fetch(request,env,ctx){
    const response=await baseWorker.fetch(request,env,ctx);
    const url=new URL(request.url);
    const type=response.headers.get('content-type')||'';
    if(response.ok&&type.includes('text/html')&&(url.pathname==='/'||url.pathname==='')){
      return new HTMLRewriter().on('head',{element(el){el.append(HOMEPAGE_CRITICAL,{html:true})}}).transform(response);
    }
    return response;
  }
};
