(()=>{
  'use strict';
  if(location.hostname!=='astrovip-preview-ux-compact.astrovip33.workers.dev') return;
  const apply=()=>{
    if(document.getElementById('astrovip-cardless-premium-home-20261010')) return;
    document.documentElement.classList.add('av-cardless-home-preview');
    const s=document.createElement('style');
    s.id='astrovip-cardless-premium-home-20261010';
    s.textContent=`
html.av-cardless-home-preview body:not(.guide-page){
  background:
    radial-gradient(circle at 50% -5%,rgba(217,184,92,.10),transparent 25%),
    linear-gradient(180deg,#050605 0%,#020302 54%,#010201 100%)!important;
}
html.av-cardless-home-preview body:not(.guide-page) #cine-analizeaza-harta,
html.av-cardless-home-preview body:not(.guide-page) #studii-de-caz-home,
html.av-cardless-home-preview body:not(.guide-page) #oferte,
html.av-cardless-home-preview body:not(.guide-page) #intrebari-frecvente,
html.av-cardless-home-preview body:not(.guide-page) #contact{
  display:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) .av-hero-v2-cards,
html.av-cardless-home-preview body:not(.guide-page) .av-hero-image-service-cards,
html.av-cardless-home-preview body:not(.guide-page) .av-premium-trust-ribbon,
html.av-cardless-home-preview body:not(.guide-page) .v63-interests,
html.av-cardless-home-preview body:not(.guide-page) .v63d-trust,
html.av-cardless-home-preview body:not(.guide-page) .v63-trust{
  display:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) #intrebare-gratuita,
html.av-cardless-home-preview body:not(.guide-page) #servicii,
html.av-cardless-home-preview body:not(.guide-page) #recenzii-google,
html.av-cardless-home-preview body:not(.guide-page) #programari{
  position:relative!important;
  padding:clamp(54px,6vw,82px) 0!important;
  margin:0!important;
  background:transparent!important;
  border:0!important;
  box-shadow:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii::before,
html.av-cardless-home-preview body:not(.guide-page) #recenzii-google::before,
html.av-cardless-home-preview body:not(.guide-page) #programari::before{
  content:"";
  position:absolute;
  top:0;
  left:50%;
  width:min(1040px,calc(100% - 48px));
  height:1px;
  transform:translateX(-50%);
  background:linear-gradient(90deg,transparent,rgba(217,184,92,.44),transparent);
}
html.av-cardless-home-preview body:not(.guide-page) #intrebare-gratuita>.wrap,
html.av-cardless-home-preview body:not(.guide-page) #servicii>.wrap,
html.av-cardless-home-preview body:not(.guide-page) #recenzii-google>.wrap,
html.av-cardless-home-preview body:not(.guide-page) #programari>.wrap{
  width:min(1020px,calc(100% - 48px))!important;
  max-width:1020px!important;
  margin-inline:auto!important;
}
html.av-cardless-home-preview body:not(.guide-page) #intrebare-gratuita .freeq-home-card,
html.av-cardless-home-preview body:not(.guide-page) #servicii .card,
html.av-cardless-home-preview body:not(.guide-page) #servicii [class*="card"],
html.av-cardless-home-preview body:not(.guide-page) #recenzii-google [class*="card"],
html.av-cardless-home-preview body:not(.guide-page) #programari [class*="card"],
html.av-cardless-home-preview body:not(.guide-page) #programari .box,
html.av-cardless-home-preview body:not(.guide-page) .foot [class*="card"],
html.av-cardless-home-preview body:not(.guide-page) footer [class*="card"]{
  background:transparent!important;
  background-image:none!important;
  border:0!important;
  outline:0!important;
  border-radius:0!important;
  box-shadow:none!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) #intrebare-gratuita .freeq-home-card{
  max-width:780px!important;
  margin-inline:auto!important;
  padding:0!important;
  text-align:center!important;
}
html.av-cardless-home-preview body:not(.guide-page) #intrebare-gratuita .freeq-home-card>*{
  margin-left:auto!important;
  margin-right:auto!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii .title,
html.av-cardless-home-preview body:not(.guide-page) #recenzii-google .title,
html.av-cardless-home-preview body:not(.guide-page) #programari .title{
  max-width:760px!important;
  margin:0 auto clamp(30px,4vw,46px)!important;
  text-align:center!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii .title h2,
html.av-cardless-home-preview body:not(.guide-page) #recenzii-google .title h2,
html.av-cardless-home-preview body:not(.guide-page) #programari .title h2,
html.av-cardless-home-preview body:not(.guide-page) #intrebare-gratuita h2{
  font-family:Georgia,"Times New Roman",serif!important;
  font-weight:800!important;
  letter-spacing:-.025em!important;
  color:#ead486!important;
  text-shadow:0 0 24px rgba(217,184,92,.10)!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii .grid{
  display:grid!important;
  grid-template-columns:repeat(2,minmax(0,1fr))!important;
  gap:0 clamp(36px,5vw,72px)!important;
  max-width:940px!important;
  margin-inline:auto!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii .grid>*{
  min-width:0!important;
  padding:26px 0!important;
  margin:0!important;
  border:0!important;
  border-bottom:1px solid rgba(217,184,92,.22)!important;
  border-radius:0!important;
  background:transparent!important;
  box-shadow:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii .grid>*:nth-child(n+5){
  display:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii img,
html.av-cardless-home-preview body:not(.guide-page) #servicii picture,
html.av-cardless-home-preview body:not(.guide-page) #servicii .mini,
html.av-cardless-home-preview body:not(.guide-page) #servicii .kicker{
  display:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii .card .pad,
html.av-cardless-home-preview body:not(.guide-page) #servicii [class*="card"] .pad{
  padding:0!important;
  display:block!important;
  height:auto!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii h3{
  margin:0 0 10px!important;
  font-family:Georgia,"Times New Roman",serif!important;
  font-size:clamp(23px,2.2vw,30px)!important;
  line-height:1.12!important;
  color:#f0d987!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii p{
  margin:0 0 13px!important;
  color:#d1dbd4!important;
  font-size:15.5px!important;
  line-height:1.58!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii .btn2{
  min-height:auto!important;
  padding:0!important;
  margin:8px 0 0!important;
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
  box-shadow:none!important;
  color:#d8f500!important;
  text-decoration:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) #servicii .btn2::after{
  content:" →";
}
html.av-cardless-home-preview body:not(.guide-page) #recenzii-google [class*="grid"]{
  gap:0!important;
}
html.av-cardless-home-preview body:not(.guide-page) #recenzii-google [class*="card"],
html.av-cardless-home-preview body:not(.guide-page) #recenzii-google [class*="review"]{
  padding:22px 0!important;
  border-bottom:1px solid rgba(217,184,92,.18)!important;
}
html.av-cardless-home-preview body:not(.guide-page) #programari .box,
html.av-cardless-home-preview body:not(.guide-page) #programari [class*="checkout"],
html.av-cardless-home-preview body:not(.guide-page) #programari [class*="booking"]{
  max-width:820px!important;
  margin-inline:auto!important;
}
html.av-cardless-home-preview body:not(.guide-page) .trust-refs{
  padding:26px 0!important;
  border:0!important;
  background:transparent!important;
  box-shadow:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) .trust-profession-banner{
  display:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) .trust-icons-only{
  gap:18px!important;
}
html.av-cardless-home-preview body:not(.guide-page) .trust-icon-only,
html.av-cardless-home-preview body:not(.guide-page) .trust-commerce-card{
  min-height:0!important;
  height:auto!important;
  aspect-ratio:auto!important;
  padding:12px!important;
  border:0!important;
  border-radius:0!important;
  background:transparent!important;
  box-shadow:none!important;
}
html.av-cardless-home-preview body:not(.guide-page) .foot,
html.av-cardless-home-preview body:not(.guide-page) footer{
  background:#010201!important;
}
html.av-cardless-home-preview body:not(.guide-page) .foot [class*="card"],
html.av-cardless-home-preview body:not(.guide-page) footer [class*="card"]{
  padding-top:12px!important;
  padding-bottom:12px!important;
}
@media(max-width:820px){
  html.av-cardless-home-preview body:not(.guide-page) #intrebare-gratuita,
  html.av-cardless-home-preview body:not(.guide-page) #servicii,
  html.av-cardless-home-preview body:not(.guide-page) #recenzii-google,
  html.av-cardless-home-preview body:not(.guide-page) #programari{
    padding:42px 0!important;
  }
  html.av-cardless-home-preview body:not(.guide-page) #servicii::before,
  html.av-cardless-home-preview body:not(.guide-page) #recenzii-google::before,
  html.av-cardless-home-preview body:not(.guide-page) #programari::before{
    width:calc(100% - 32px)!important;
  }
  html.av-cardless-home-preview body:not(.guide-page) #intrebare-gratuita>.wrap,
  html.av-cardless-home-preview body:not(.guide-page) #servicii>.wrap,
  html.av-cardless-home-preview body:not(.guide-page) #recenzii-google>.wrap,
  html.av-cardless-home-preview body:not(.guide-page) #programari>.wrap{
    width:calc(100% - 32px)!important;
  }
  html.av-cardless-home-preview body:not(.guide-page) #servicii .grid{
    grid-template-columns:1fr!important;
    gap:0!important;
  }
  html.av-cardless-home-preview body:not(.guide-page) #servicii .grid>*{
    padding:22px 0!important;
  }
  html.av-cardless-home-preview body:not(.guide-page) #servicii h3{
    font-size:25px!important;
  }
  html.av-cardless-home-preview body:not(.guide-page) .trust-refs{
    padding:18px 0!important;
  }
}
`;
    document.head.appendChild(s);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();
  window.addEventListener('pageshow',apply,{once:true});
})();
