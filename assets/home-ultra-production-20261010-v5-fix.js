(()=>{
  'use strict';
  if(location.pathname!=='/'&&location.pathname!=='')return;
  const apply=()=>{
    document.querySelectorAll('.av-v9-tools').forEach(el=>el.style.setProperty('display','none','important'));
    if(document.getElementById('astrovip-ultra-compact-footer-v5'))return;
    const style=document.createElement('style');
    style.id='astrovip-ultra-compact-footer-v5';
    style.textContent=`
html body:not(.guide-page) .av-v9-tools{display:none!important}
html body:not(.guide-page) footer .av-footer-card--services{display:none!important}
html body:not(.guide-page) footer .av-footer-premium-single{padding:18px 0 14px!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:transparent!important}
html body:not(.guide-page) footer .av-footer-grid--cards{display:grid!important;grid-template-columns:minmax(0,1.08fr) minmax(0,.92fr)!important;gap:clamp(22px,4vw,52px)!important;margin:0!important;padding:0!important;align-items:start!important}
html body:not(.guide-page) footer .av-footer-card{min-height:0!important;height:auto!important;padding:16px 0!important;margin:0!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:transparent!important}
html body:not(.guide-page) footer .av-footer-card p,html body:not(.guide-page) footer .av-footer-card h2{margin-top:0!important;margin-bottom:8px!important}
html body:not(.guide-page) footer .av-footer-logo{font-size:clamp(30px,4vw,42px)!important;line-height:1!important;margin-bottom:8px!important}
html body:not(.guide-page) footer .av-footer-card-title{font-size:18px!important;line-height:1.2!important}
html body:not(.guide-page) footer .av-footer-experience{font-size:13px!important;line-height:1.45!important}
html body:not(.guide-page) footer .av-footer-price{font-size:22px!important;line-height:1.2!important;margin:8px 0!important}
html body:not(.guide-page) footer .av-footer-card-actions{display:flex!important;flex-wrap:wrap!important;gap:8px 14px!important;margin-top:10px!important}
html body:not(.guide-page) footer .av-footer-cta,html body:not(.guide-page) footer .av-footer-mini-link,html body:not(.guide-page) footer .av-footer-whatsapp{min-height:0!important;padding:9px 12px!important;margin:0!important}
html body:not(.guide-page) footer .av-footer-column a,html body:not(.guide-page) footer .av-footer-static{min-height:0!important;padding:6px 0!important;margin:0!important;font-size:13px!important;line-height:1.4!important}
html body:not(.guide-page) footer .av-footer-card--contact h2{font-size:17px!important;line-height:1.2!important;margin-bottom:8px!important}
html body:not(.guide-page) footer .av-footer-bottom{min-height:0!important;margin-top:12px!important;padding:12px 0!important;gap:8px 16px!important;border:0!important;box-shadow:none!important}
html body:not(.guide-page) footer .av-footer-bottom p,html body:not(.guide-page) footer .av-footer-bottom nav{margin:0!important;font-size:11px!important;line-height:1.4!important}
html body:not(.guide-page) footer .av-footer-disclaimer{margin:8px 0 0!important;padding:0!important;font-size:10px!important;line-height:1.4!important}
@media(max-width:820px){
html body:not(.guide-page) footer{padding:16px 0 18px!important}
html body:not(.guide-page) footer .av-footer-premium-single{padding:4px 0 0!important}
html body:not(.guide-page) footer .av-footer-grid--cards{grid-template-columns:1fr!important;gap:0!important}
html body:not(.guide-page) footer .av-footer-card{padding:12px 0!important}
html body:not(.guide-page) footer .av-footer-card--brand{text-align:center!important}
html body:not(.guide-page) footer .av-footer-card-actions{justify-content:center!important}
html body:not(.guide-page) footer .av-footer-card--contact{text-align:center!important;padding-top:8px!important}
html body:not(.guide-page) footer .av-footer-column a,html body:not(.guide-page) footer .av-footer-static{justify-content:center!important;padding:5px 0!important}
html body:not(.guide-page) footer .av-footer-whatsapp{display:inline-flex!important;margin:8px auto 0!important}
html body:not(.guide-page) footer .av-footer-bottom{flex-direction:column!important;text-align:center!important;margin-top:8px!important;padding:10px 0!important}
html body:not(.guide-page) footer .av-footer-bottom nav{justify-content:center!important;flex-wrap:wrap!important}
html body:not(.guide-page) footer .av-footer-disclaimer{text-align:center!important;margin:6px auto 0!important;max-width:340px!important}
}
`;
    document.head.appendChild(style);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.addEventListener('pageshow',apply);
})();
