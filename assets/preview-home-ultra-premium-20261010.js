(()=>{
  'use strict';
  if(location.hostname!=='astrovip-preview-ux-compact.astrovip33.workers.dev') return;

  const apply=()=>{
    if(document.getElementById('av-ultra-home-preview-style')) return;
    document.documentElement.classList.add('av-ultra-home-preview');

    const style=document.createElement('style');
    style.id='av-ultra-home-preview-style';
    style.textContent=`
html.av-ultra-home-preview body:not(.guide-page){
  background:radial-gradient(circle at 50% -8%,rgba(229,198,103,.11),transparent 28%),linear-gradient(180deg,#060706 0%,#020302 58%,#010201 100%)!important;
}
html.av-ultra-home-preview body:not(.guide-page) #intrebare-gratuita,
html.av-ultra-home-preview body:not(.guide-page) #cine-analizeaza-harta,
html.av-ultra-home-preview body:not(.guide-page) #servicii,
html.av-ultra-home-preview body:not(.guide-page) #studii-de-caz-home,
html.av-ultra-home-preview body:not(.guide-page) #recenzii-google,
html.av-ultra-home-preview body:not(.guide-page) #oferte,
html.av-ultra-home-preview body:not(.guide-page) #programari,
html.av-ultra-home-preview body:not(.guide-page) #intrebari-frecvente,
html.av-ultra-home-preview body:not(.guide-page) #contact,
html.av-ultra-home-preview body:not(.guide-page) .trust-refs,
html.av-ultra-home-preview body:not(.guide-page) .av-directory{
  display:none!important;
}
html.av-ultra-home-preview body:not(.guide-page) .av-hero-v2-cards,
html.av-ultra-home-preview body:not(.guide-page) .av-hero-image-service-cards,
html.av-ultra-home-preview body:not(.guide-page) .av-premium-trust-ribbon,
html.av-ultra-home-preview body:not(.guide-page) .v63-interests,
html.av-ultra-home-preview body:not(.guide-page) .v63d-trust,
html.av-ultra-home-preview body:not(.guide-page) .v63-trust,
html.av-ultra-home-preview body:not(.guide-page) .av-hero-v2-bottom{
  display:none!important;
}
html.av-ultra-home-preview body:not(.guide-page) section.hero,
html.av-ultra-home-preview body:not(.guide-page) .v63d-hero,
html.av-ultra-home-preview body:not(.guide-page) .v63-mobile-prod{
  border:0!important;
  box-shadow:none!important;
}
html.av-ultra-home-preview body:not(.guide-page) #av-ultra-home{
  position:relative;
  overflow:hidden;
  padding:clamp(64px,8vw,112px) 0 clamp(58px,7vw,92px);
  margin:0;
  border:0;
  background:
    radial-gradient(circle at 50% 0,rgba(229,198,103,.065),transparent 34%),
    linear-gradient(180deg,rgba(255,255,255,.012),transparent 72%);
}
html.av-ultra-home-preview body:not(.guide-page) #av-ultra-home:before{
  content:"";
  position:absolute;
  top:0;
  left:50%;
  width:min(1120px,calc(100% - 40px));
  height:1px;
  transform:translateX(-50%);
  background:linear-gradient(90deg,transparent,rgba(231,201,111,.55),transparent);
}
.av-ultra-shell{
  width:min(980px,calc(100% - 42px));
  margin:0 auto;
  text-align:center;
}
.av-ultra-kicker{
  margin:0 0 18px;
  color:#d8f500;
  font-size:12px;
  font-weight:900;
  letter-spacing:.22em;
  text-transform:uppercase;
}
.av-ultra-title{
  margin:0 auto;
  max-width:12ch;
  font-family:Georgia,"Times New Roman",serif;
  font-size:clamp(44px,7vw,86px);
  font-weight:700;
  line-height:.94;
  letter-spacing:-.045em;
  background:linear-gradient(180deg,#fff9d7 0%,#efd983 40%,#bc8e2d 72%,#f7e69e 100%);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
  text-shadow:0 14px 48px rgba(0,0,0,.30);
}
.av-ultra-lead{
  max-width:660px;
  margin:24px auto 0;
  color:#e7ede8;
  font-size:clamp(17px,2vw,21px);
  line-height:1.65;
  font-weight:500;
}
.av-ultra-services{
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  align-items:center;
  gap:0;
  max-width:900px;
  margin:38px auto 0;
  padding:18px 0;
  border-top:1px solid rgba(231,201,111,.22);
  border-bottom:1px solid rgba(231,201,111,.22);
}
.av-ultra-services span{
  position:relative;
  padding:5px 22px;
  color:#f2df9b;
  font-family:Georgia,"Times New Roman",serif;
  font-size:clamp(16px,1.8vw,20px);
  white-space:nowrap;
}
.av-ultra-services span+span:before{
  content:"";
  position:absolute;
  left:0;
  top:50%;
  width:3px;
  height:3px;
  border-radius:50%;
  background:#d8f500;
  transform:translate(-50%,-50%);
  box-shadow:0 0 10px rgba(216,245,0,.42);
}
.av-ultra-proof{
  display:flex;
  justify-content:center;
  flex-wrap:wrap;
  gap:12px 28px;
  margin:26px auto 0;
  color:#aebbb2;
  font-size:13px;
  font-weight:800;
  letter-spacing:.08em;
  text-transform:uppercase;
}
.av-ultra-proof strong{color:#f5e9bc;font-weight:900}
.av-ultra-actions{
  display:flex;
  justify-content:center;
  align-items:center;
  gap:14px;
  margin:36px auto 0;
}
.av-ultra-primary,
.av-ultra-secondary{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:52px;
  padding:0 28px;
  text-decoration:none!important;
  font-weight:900;
  letter-spacing:.02em;
  transition:transform .18s ease,box-shadow .18s ease,opacity .18s ease;
}
.av-ultra-primary{
  border:1px solid #fff0a6;
  border-radius:999px;
  color:#151006!important;
  background:linear-gradient(180deg,#fff7ca 0%,#e7ca67 48%,#a87922 100%);
  box-shadow:0 15px 42px rgba(217,184,92,.19),inset 0 1px 0 rgba(255,255,255,.78);
}
.av-ultra-secondary{
  color:#e9f8ee!important;
  border:0;
  border-bottom:1px solid rgba(216,245,0,.62);
  padding-left:6px;
  padding-right:6px;
}
.av-ultra-primary:hover,.av-ultra-secondary:hover{transform:translateY(-2px)}
.av-ultra-payment-note{
  margin:12px 0 0;
  color:#9eaaa2;
  font-size:11px;
  font-weight:800;
  letter-spacing:.10em;
  text-transform:uppercase;
}
.av-ultra-payment-note strong{color:#d9c98f}
.av-ultra-signature{
  margin:38px 0 0;
  color:#d9c98f;
  font-family:Georgia,"Times New Roman",serif;
  font-size:15px;
  font-style:italic;
  letter-spacing:.02em;
}
html.av-ultra-home-preview body:not(.guide-page) .foot,
html.av-ultra-home-preview body:not(.guide-page) footer{
  padding-top:30px!important;
  background:#010201!important;
  border-top:1px solid rgba(231,201,111,.15)!important;
}
html.av-ultra-home-preview body:not(.guide-page) .foot [class*="card"],
html.av-ultra-home-preview body:not(.guide-page) footer [class*="card"]{
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
  box-shadow:none!important;
}
@media(min-width:821px){
  html.av-ultra-home-preview body:not(.guide-page) .v63d-hero{min-height:600px!important}
  html.av-ultra-home-preview body:not(.guide-page) .v63d-hero-grid{min-height:600px!important}
  html.av-ultra-home-preview body:not(.guide-page) .v63d-hero-visual{min-height:600px!important}
}
@media(max-width:820px){
  html.av-ultra-home-preview body:not(.guide-page) #av-ultra-home{padding:54px 0 48px}
  .av-ultra-shell{width:calc(100% - 30px)}
  .av-ultra-title{font-size:clamp(42px,12vw,58px);max-width:10ch}
  .av-ultra-lead{margin-top:20px;font-size:16px;line-height:1.58}
  .av-ultra-services{display:grid;grid-template-columns:1fr 1fr;margin-top:30px;padding:10px 0}
  .av-ultra-services span{padding:11px 8px;font-size:16px}
  .av-ultra-services span+span:before{display:none}
  .av-ultra-services span:nth-child(odd){border-right:1px solid rgba(231,201,111,.16)}
  .av-ultra-services span:nth-child(-n+2){border-bottom:1px solid rgba(231,201,111,.16)}
  .av-ultra-proof{gap:9px 18px;font-size:11px;line-height:1.4}
  .av-ultra-actions{flex-direction:column;gap:17px;margin-top:30px}
  .av-ultra-primary{width:min(100%,330px);min-height:54px}
  .av-ultra-payment-note{font-size:10px;line-height:1.4}
  .av-ultra-signature{margin-top:30px;font-size:14px}
  html.av-ultra-home-preview body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-copy{padding-bottom:20px!important}
}
`;
    document.head.appendChild(style);

    const firstOld=document.getElementById('intrebare-gratuita');
    if(firstOld && !document.getElementById('av-ultra-home')){
      const section=document.createElement('section');
      section.id='av-ultra-home';
      section.setAttribute('aria-labelledby','av-ultra-title');
      section.innerHTML=`
        <div class="av-ultra-shell">
          <p class="av-ultra-kicker">ASTROVIP · ASTROLOGIE PREMIUM</p>
          <h2 class="av-ultra-title" id="av-ultra-title">Claritate. Timing. Decizii.</h2>
          <p class="av-ultra-lead">Analiză astrologică personală pentru momentele în care vrei să înțelegi mai bine direcția, relațiile, cariera sau o schimbare importantă.</p>
          <div class="av-ultra-services" aria-label="Servicii esențiale">
            <span>Hartă natală</span><span>Previziuni</span><span>Relocare</span><span>Sinastrie</span>
          </div>
          <div class="av-ultra-proof"><span><strong>33+ ani</strong> experiență</span><span><strong>5★</strong> Google</span><span>Consultații <strong>1-la-1</strong></span></div>
          <div class="av-ultra-actions">
            <a class="av-ultra-primary" href="#programari">Plătește cu cardul · Stripe · 500 lei</a>
            <a class="av-ultra-secondary" href="https://wa.me/40722128220?text=Bun%C4%83%2C%20doresc%20o%20consulta%C8%9Bie%20AstroVip.">Programează pe WhatsApp →</a>
          </div>
          <p class="av-ultra-payment-note">Plată securizată prin <strong>Stripe</strong></p>
          <p class="av-ultra-signature">Viitorul favorizează oamenii pregătiți.</p>
        </div>`;
      firstOld.parentNode.insertBefore(section,firstOld);
    }
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  window.addEventListener('pageshow',apply,{once:true});
})();
