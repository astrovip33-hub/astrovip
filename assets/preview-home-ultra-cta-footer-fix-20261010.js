(()=>{
  'use strict';
  if(location.hostname!=='astrovip-preview-ux-compact.astrovip33.workers.dev') return;

  const apply=()=>{
    const home=document.getElementById('av-ultra-home');
    if(!home) return;

    if(!document.getElementById('av-ultra-cta-footer-fix-style')){
      const style=document.createElement('style');
      style.id='av-ultra-cta-footer-fix-style';
      style.textContent=`
html.av-ultra-home-preview body:not(.guide-page) #av-ultra-home .av-ultra-actions{
  display:flex!important;
  visibility:visible!important;
  opacity:1!important;
  position:relative!important;
  z-index:12!important;
  margin:28px auto 0!important;
  gap:12px!important;
}
html.av-ultra-home-preview body:not(.guide-page) #av-ultra-home .av-ultra-primary{
  display:inline-flex!important;
  visibility:visible!important;
  opacity:1!important;
  min-width:min(390px,100%)!important;
  min-height:58px!important;
  padding:0 30px!important;
  border:1px solid rgba(255,240,166,.96)!important;
  border-radius:999px!important;
  color:#151006!important;
  background:linear-gradient(180deg,#fff9cf 0%,#f0d36f 44%,#b78325 100%)!important;
  box-shadow:0 16px 38px rgba(214,179,76,.22),0 0 0 1px rgba(255,255,255,.05) inset!important;
  font-size:14px!important;
  font-weight:950!important;
  letter-spacing:.035em!important;
  text-transform:uppercase!important;
  text-align:center!important;
}
html.av-ultra-home-preview body:not(.guide-page) #av-ultra-home .av-ultra-primary::before{
  content:'STRIPE';
  display:inline-flex;
  align-items:center;
  justify-content:center;
  margin-right:10px;
  padding:4px 7px;
  border-radius:999px;
  background:#635bff;
  color:#fff;
  font:900 10px/1 Arial,sans-serif;
  letter-spacing:.05em;
}
html.av-ultra-home-preview body:not(.guide-page) #av-ultra-home .av-ultra-secondary{
  display:inline-flex!important;
  visibility:visible!important;
  opacity:1!important;
}
html.av-ultra-home-preview body:not(.guide-page) #av-ultra-home .av-ultra-payment-note{
  margin-top:10px!important;
  color:#c4cec7!important;
}
html.av-ultra-home-preview body:not(.guide-page) footer,
html.av-ultra-home-preview body:not(.guide-page) .foot{
  border:0!important;
  outline:0!important;
  box-shadow:none!important;
  background:#010201!important;
}
html.av-ultra-home-preview body:not(.guide-page) footer div,
html.av-ultra-home-preview body:not(.guide-page) footer section,
html.av-ultra-home-preview body:not(.guide-page) footer article,
html.av-ultra-home-preview body:not(.guide-page) footer nav,
html.av-ultra-home-preview body:not(.guide-page) footer ul,
html.av-ultra-home-preview body:not(.guide-page) footer li,
html.av-ultra-home-preview body:not(.guide-page) footer a,
html.av-ultra-home-preview body:not(.guide-page) .foot div,
html.av-ultra-home-preview body:not(.guide-page) .foot section,
html.av-ultra-home-preview body:not(.guide-page) .foot article,
html.av-ultra-home-preview body:not(.guide-page) .foot nav,
html.av-ultra-home-preview body:not(.guide-page) .foot ul,
html.av-ultra-home-preview body:not(.guide-page) .foot li,
html.av-ultra-home-preview body:not(.guide-page) .foot a{
  border:0!important;
  outline:0!important;
  border-radius:0!important;
  box-shadow:none!important;
  background-color:transparent!important;
  background-image:none!important;
}
html.av-ultra-home-preview body:not(.guide-page) footer *::before,
html.av-ultra-home-preview body:not(.guide-page) footer *::after,
html.av-ultra-home-preview body:not(.guide-page) .foot *::before,
html.av-ultra-home-preview body:not(.guide-page) .foot *::after{
  border:0!important;
  box-shadow:none!important;
}
@media(max-width:820px){
  html.av-ultra-home-preview body:not(.guide-page) #av-ultra-home .av-ultra-actions{
    flex-direction:column!important;
    margin-top:24px!important;
  }
  html.av-ultra-home-preview body:not(.guide-page) #av-ultra-home .av-ultra-primary{
    width:100%!important;
    min-width:0!important;
    min-height:60px!important;
    font-size:13px!important;
  }
}
`;
      document.head.appendChild(style);
    }

    const lead=home.querySelector('.av-ultra-lead');
    const actions=home.querySelector('.av-ultra-actions');
    const note=home.querySelector('.av-ultra-payment-note');
    if(lead && actions && lead.nextElementSibling!==actions){
      lead.insertAdjacentElement('afterend',actions);
      if(note) actions.insertAdjacentElement('afterend',note);
    }

    const pay=home.querySelector('.av-ultra-primary');
    if(pay){
      pay.textContent='Plătește cu cardul · 500 lei';
      pay.setAttribute('aria-label','Plătește consultația AstroVip cu cardul prin Stripe, 500 lei');
      pay.style.setProperty('display','inline-flex','important');
    }
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  window.addEventListener('pageshow',apply);
  setTimeout(apply,700);
})();
