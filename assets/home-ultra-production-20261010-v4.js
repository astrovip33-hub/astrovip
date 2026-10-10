(()=>{
  'use strict';
  if(location.pathname!=='/'&&location.pathname!=='')return;

  const apply=()=>{
    document.documentElement.classList.add('av-ultra-home-production');
    const firstOld=document.getElementById('intrebare-gratuita');
    if(!firstOld||document.getElementById('av-ultra-home'))return;
    const section=document.createElement('section');
    section.id='av-ultra-home';
    section.setAttribute('aria-labelledby','av-ultra-title');
    section.innerHTML=`<div class="av-ultra-shell"><p class="av-ultra-kicker">ASTROVIP · ASTROLOGIE PREMIUM</p><h2 class="av-ultra-title" id="av-ultra-title">Claritate. Timing. Decizii.</h2><p class="av-ultra-lead">Analiză astrologică personală pentru momentele în care vrei să înțelegi mai bine direcția, relațiile, cariera sau o schimbare importantă.</p><div class="av-ultra-actions"><a class="av-ultra-primary" href="#programari" aria-label="Plătește consultația AstroVip cu cardul prin Stripe, 500 lei">Plătește cu cardul · 500 lei</a><a class="av-ultra-secondary" href="https://wa.me/40722128220?text=Bun%C4%83%2C%20doresc%20o%20consulta%C8%9Bie%20AstroVip.">Programează pe WhatsApp →</a></div><p class="av-ultra-payment-note">Plată securizată prin <strong>Stripe</strong></p><div class="av-ultra-services" aria-label="Servicii esențiale"><span>Hartă natală</span><span>Previziuni</span><span>Relocare</span><span>Sinastrie</span></div><div class="av-ultra-proof"><span><strong>33+ ani</strong> experiență</span><span><strong>5★</strong> Google</span><span>Consultații <strong>1-la-1</strong></span></div><p class="av-ultra-signature">Viitorul favorizează oamenii pregătiți.</p></div>`;
    firstOld.parentNode.insertBefore(section,firstOld);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
})();
