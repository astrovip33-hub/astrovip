(()=>{
  'use strict';
  if(location.hostname!=='astrovip-preview-ux-compact.astrovip33.workers.dev')return;
  if(location.pathname!=='/'&&location.pathname!=='')return;
  if(document.getElementById('astrovip-flag-yellow-20261010'))return;
  const style=document.createElement('style');
  style.id='astrovip-flag-yellow-20261010';
  style.textContent=`
html.av-ultra-home-production body:not(.guide-page) .av-ultra-title{
  background:none!important;
  -webkit-background-clip:initial!important;
  background-clip:initial!important;
  color:#FCD116!important;
  -webkit-text-fill-color:#FCD116!important;
}
html.av-ultra-home-production body:not(.guide-page) .av-ultra-services span,
html.av-ultra-home-production body:not(.guide-page) .av-ultra-proof strong,
html.av-ultra-home-production body:not(.guide-page) .av-ultra-signature,
html.av-ultra-home-production body:not(.guide-page) .av-ultra-payment-note strong,
html.av-ultra-home-production body:not(.guide-page) footer .av-footer-logo span,
html.av-ultra-home-production body:not(.guide-page) footer .av-footer-bottom strong{
  color:#FCD116!important;
  -webkit-text-fill-color:#FCD116!important;
}
`;
  document.head.appendChild(style);
})();
