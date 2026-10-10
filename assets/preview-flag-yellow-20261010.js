(()=>{
  'use strict';
  if(location.hostname!=='astrovip-preview-ux-compact.astrovip33.workers.dev')return;
  if(location.pathname!=='/'&&location.pathname!=='')return;
  if(document.getElementById('astrovip-flag-yellow-20261010'))return;
  const style=document.createElement('style');
  style.id='astrovip-flag-yellow-20261010';
  style.textContent=`
/* Romanian-flag yellow family, intentionally softened for premium contrast */
html.av-ultra-home-production body:not(.guide-page) .av-ultra-title{
  background:none!important;
  -webkit-background-clip:initial!important;
  background-clip:initial!important;
  color:rgba(252,209,22,.82)!important;
  -webkit-text-fill-color:rgba(252,209,22,.82)!important;
  text-shadow:none!important;
}
html.av-ultra-home-production body:not(.guide-page) .av-ultra-services span{
  color:rgba(252,209,22,.72)!important;
  -webkit-text-fill-color:rgba(252,209,22,.72)!important;
  text-shadow:none!important;
}
html.av-ultra-home-production body:not(.guide-page) .av-ultra-proof strong,
html.av-ultra-home-production body:not(.guide-page) .av-ultra-payment-note strong{
  color:rgba(252,209,22,.76)!important;
  -webkit-text-fill-color:rgba(252,209,22,.76)!important;
  text-shadow:none!important;
}
html.av-ultra-home-production body:not(.guide-page) .av-ultra-signature{
  color:rgba(252,209,22,.64)!important;
  -webkit-text-fill-color:rgba(252,209,22,.64)!important;
  text-shadow:none!important;
}
html.av-ultra-home-production body:not(.guide-page) footer .av-footer-logo span,
html.av-ultra-home-production body:not(.guide-page) footer .av-footer-bottom strong{
  color:rgba(252,209,22,.70)!important;
  -webkit-text-fill-color:rgba(252,209,22,.70)!important;
  text-shadow:none!important;
}
/* Hero: use the same yellow family only on headline / premium accent text. */
html body:not(.guide-page) .av-pro-hero h1,
html body:not(.guide-page) .av-pro-hero h2,
html body:not(.guide-page) .av-hero-v2 h1,
html body:not(.guide-page) .av-hero-v2 h2,
html body:not(.guide-page) [class*="hero"] .hero-title,
html body:not(.guide-page) [class*="hero"] .av-hero-title{
  background:none!important;
  -webkit-background-clip:initial!important;
  background-clip:initial!important;
  color:rgba(252,209,22,.80)!important;
  -webkit-text-fill-color:rgba(252,209,22,.80)!important;
  text-shadow:none!important;
}
html body:not(.guide-page) .av-pro-hero .eyebrow,
html body:not(.guide-page) .av-pro-hero .kicker,
html body:not(.guide-page) .av-pro-hero [class*="kicker"],
html body:not(.guide-page) .av-hero-v2 [class*="kicker"],
html body:not(.guide-page) [class*="hero"] [class*="eyebrow"]{
  color:rgba(252,209,22,.62)!important;
  -webkit-text-fill-color:rgba(252,209,22,.62)!important;
  text-shadow:none!important;
}
/* Reduce yellow line/glow intensity globally on this preview. */
html.av-ultra-home-production body:not(.guide-page) #av-ultra-home:before{
  background:linear-gradient(90deg,transparent,rgba(252,209,22,.30),transparent)!important;
}
html.av-ultra-home-production body:not(.guide-page) .av-ultra-services{
  border-color:rgba(252,209,22,.13)!important;
}
`;
  document.head.appendChild(style);
})();
