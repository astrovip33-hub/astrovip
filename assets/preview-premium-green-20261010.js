(()=>{
  'use strict';
  if(location.hostname!=='astrovip-preview-ux-compact.astrovip33.workers.dev')return;
  if(location.pathname!=='/'&&location.pathname!=='')return;
  if(document.getElementById('astrovip-premium-green-20261010'))return;
  const style=document.createElement('style');
  style.id='astrovip-premium-green-20261010';
  style.textContent=`
/* Soft premium emerald-lime family */
html.av-ultra-home-production body:not(.guide-page) .av-ultra-title{
  background:none!important;
  -webkit-background-clip:initial!important;
  background-clip:initial!important;
  color:rgba(143,209,106,.84)!important;
  -webkit-text-fill-color:rgba(143,209,106,.84)!important;
  text-shadow:none!important;
}
html.av-ultra-home-production body:not(.guide-page) .av-ultra-services span{
  color:rgba(143,209,106,.72)!important;
  -webkit-text-fill-color:rgba(143,209,106,.72)!important;
  text-shadow:none!important;
}
html.av-ultra-home-production body:not(.guide-page) .av-ultra-proof strong,
html.av-ultra-home-production body:not(.guide-page) .av-ultra-payment-note strong{
  color:rgba(143,209,106,.76)!important;
  -webkit-text-fill-color:rgba(143,209,106,.76)!important;
  text-shadow:none!important;
}
html.av-ultra-home-production body:not(.guide-page) .av-ultra-signature{
  color:rgba(143,209,106,.62)!important;
  -webkit-text-fill-color:rgba(143,209,106,.62)!important;
  text-shadow:none!important;
}
html.av-ultra-home-production body:not(.guide-page) footer .av-footer-logo span,
html.av-ultra-home-production body:not(.guide-page) footer .av-footer-bottom strong{
  color:rgba(143,209,106,.68)!important;
  -webkit-text-fill-color:rgba(143,209,106,.68)!important;
  text-shadow:none!important;
}
/* Hero accent */
html body:not(.guide-page) .av-pro-hero h1,
html body:not(.guide-page) .av-pro-hero h2,
html body:not(.guide-page) .av-hero-v2 h1,
html body:not(.guide-page) .av-hero-v2 h2,
html body:not(.guide-page) [class*="hero"] .hero-title,
html body:not(.guide-page) [class*="hero"] .av-hero-title{
  background:none!important;
  -webkit-background-clip:initial!important;
  background-clip:initial!important;
  color:rgba(143,209,106,.82)!important;
  -webkit-text-fill-color:rgba(143,209,106,.82)!important;
  text-shadow:none!important;
}
html body:not(.guide-page) .av-pro-hero .eyebrow,
html body:not(.guide-page) .av-pro-hero .kicker,
html body:not(.guide-page) .av-pro-hero [class*="kicker"],
html body:not(.guide-page) .av-hero-v2 [class*="kicker"],
html body:not(.guide-page) [class*="hero"] [class*="eyebrow"]{
  color:rgba(143,209,106,.58)!important;
  -webkit-text-fill-color:rgba(143,209,106,.58)!important;
  text-shadow:none!important;
}
html.av-ultra-home-production body:not(.guide-page) #av-ultra-home:before{
  background:linear-gradient(90deg,transparent,rgba(143,209,106,.28),transparent)!important;
}
html.av-ultra-home-production body:not(.guide-page) .av-ultra-services{
  border-color:rgba(143,209,106,.12)!important;
}
html.av-ultra-home-production body:not(.guide-page) .av-ultra-secondary{
  border-bottom-color:rgba(143,209,106,.44)!important;
}
`;
  document.head.appendChild(style);
})();
