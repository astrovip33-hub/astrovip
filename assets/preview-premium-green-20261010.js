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

/* Preview menu: light premium green + Ferrari-red controls */
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu.open{
  background:linear-gradient(180deg,#CBEEC0 0%,#B5E0A8 52%,#A7D598 100%)!important;
  color:#09170F!important;
  border-color:rgba(9,23,15,.14)!important;
  box-shadow:0 24px 64px rgba(0,0,0,.28)!important;
}
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu > a,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu summary,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu.open > a,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu.open summary{
  color:#09170F!important;
  -webkit-text-fill-color:#09170F!important;
  text-shadow:none!important;
}
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu .av-menu-group-links,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu .av-menu-more-links{
  background:rgba(255,255,255,.16)!important;
  border-color:rgba(9,23,15,.12)!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.26)!important;
}
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu .av-menu-group-links a,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu .av-menu-more-links a,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu .av-menu-group-links a:first-child{
  color:#102118!important;
  -webkit-text-fill-color:#102118!important;
  text-shadow:none!important;
}
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu .av-menu-group > summary::after,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu .av-menu-more > summary::after,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu .av-menu-group[open] > summary::after,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu .av-menu-more[open] > summary::after{
  background:#FF4B32!important;
  border-color:#FF4B32!important;
  color:#FFFFFF!important;
  -webkit-text-fill-color:#FFFFFF!important;
  text-shadow:none!important;
  box-shadow:0 5px 14px rgba(255,75,50,.24)!important;
}
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu > a::after,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu.open > a::after{
  background:#FF4B32!important;
  border-color:#FF4B32!important;
  color:#FFFFFF!important;
  -webkit-text-fill-color:#FFFFFF!important;
  text-shadow:none!important;
  box-shadow:0 5px 14px rgba(255,75,50,.24)!important;
}
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu > a:hover,
html body.av-ux-refresh.av-ux-refresh.av-ux-refresh.av-ux-refresh:not(.guide-page) header.top nav#menu.menu summary:hover{
  background:rgba(255,255,255,.18)!important;
}
`;
  document.head.appendChild(style);
})();
