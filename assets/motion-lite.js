!function(){
  "use strict";
  const STRIPE_URL="https://buy.stripe.com/4gMeVcbz75J207y6fefjG00";

  function addPay(container,id,className,label,before){
    if(!container||document.getElementById(id))return;
    const pay=document.createElement("a");
    pay.id=id;
    pay.className=className;
    pay.href=STRIPE_URL;
    pay.target="_self";
    pay.rel="noopener noreferrer";
    pay.setAttribute("aria-label","Plătește 500 lei cu cardul prin Stripe");
    pay.textContent=label;
    before&&before.parentNode===container?container.insertBefore(pay,before):container.appendChild(pay);
  }

  function addStripeButtons(){
    const style=document.createElement("style");
    style.id="av-stripe-home-style";
    style.textContent='.av-stripe-v63d-pay,.av-stripe-v63-pay,.av-stripe-hero-pay{border-color:#39ff14!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 0 10px rgba(57,255,20,.38),0 10px 24px rgba(0,0,0,.34)!important}.av-stripe-v63d-pay:hover,.av-stripe-v63-pay:hover,.av-stripe-hero-pay:hover{box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 0 16px rgba(57,255,20,.52),0 12px 28px rgba(0,0,0,.4)!important}';
    document.getElementById(style.id)||document.head.appendChild(style);

    const d=document.querySelector(".v63-desktop-prod .v63d-hero .v63d-actions");
    const dDiscover=d&&d.querySelector('a[href="#v63d-servicii"]');
    addPay(d,"avStripeDesktopHero","v63d-btn v63d-btn-dark av-stripe-v63d-pay","PLĂTEȘTE 500 LEI CU CARDUL →",dDiscover);

    const m=document.querySelector(".v63-mobile-prod .v63-hero .v63-actions");
    const mDiscover=m&&m.querySelector('a[href="#v63-servicii"]');
    addPay(m,"avStripeMobileHero","v63-btn v63-btn-dark av-stripe-v63-pay","PLĂTEȘTE 500 LEI CU CARDUL →",mDiscover);

    const old=document.querySelector("body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-actions");
    if(old){
      const existing=old.querySelector(".av-hero-v2-secondary");
      addPay(old,"avHeroStripePay","av-stripe-hero-pay","PLĂTEȘTE 500 LEI CU CARDUL",existing&&existing.nextElementSibling);
    }
  }

  function addCaseStyles(){
    if(document.getElementById("av-home-case-feature-style"))return;
    const style=document.createElement("style");
    style.id="av-home-case-feature-style";
    style.textContent='\
.av-case-real-art{overflow:hidden!important;background:#020403!important;position:relative!important}.av-case-real-art:after{content:""!important;display:block!important;position:absolute!important;inset:0!important;background:linear-gradient(180deg,transparent 45%,rgba(2,7,5,.74) 100%)!important;pointer-events:none!important}.av-case-real-art img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;filter:saturate(.92) contrast(1.05) brightness(.92)!important;transition:transform .35s ease,filter .35s ease}.v63d-case:hover .av-case-real-art img{transform:scale(1.035);filter:saturate(1) contrast(1.07) brightness(.98)!important}.av-case-eyebrow{display:block;margin-bottom:7px;color:#e8c96f;font-size:9px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}.av-case-open{display:inline-flex;margin-top:14px;color:#7dffad;font-size:10px;font-weight:950;letter-spacing:.07em}.av-home-lotto-case{border-color:rgba(240,207,104,.72)!important;box-shadow:0 15px 34px rgba(0,0,0,.20),0 0 22px rgba(232,196,107,.06)!important}.av-home-lotto-case:hover{border-color:#f3d783!important}#v63d-studii .v63d-grid4{display:flex!important;flex-wrap:wrap!important;justify-content:center!important;gap:18px!important}#v63d-studii .v63d-case{flex:0 1 calc(33.333% - 12px)!important;max-width:395px!important;min-width:270px!important;display:flex!important;flex-direction:column!important;border:1px solid rgba(232,196,107,.46)!important;background:linear-gradient(180deg,#081611,#050c09)!important;box-shadow:0 18px 42px rgba(0,0,0,.24)!important;transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease!important}#v63d-studii .v63d-case:hover{transform:translateY(-5px)!important;border-color:rgba(255,224,145,.80)!important;box-shadow:0 24px 48px rgba(0,0,0,.30),0 0 25px rgba(232,196,107,.08)!important}#v63d-studii .v63d-case-art{height:210px!important;min-height:210px!important}#v63d-studii .v63d-case-body{display:flex!important;flex:1!important;flex-direction:column!important;padding:22px!important}#v63d-studii .v63d-case h3{font-size:21px!important;line-height:1.12!important;color:#fff7df!important}#v63d-studii .v63d-case p{font-size:12px!important;line-height:1.55!important;color:#cbd5cf!important;margin-top:9px!important}#v63d-studii .av-case-open{margin-top:auto!important;padding-top:14px!important}.v63d-case.av-sports-home-case{border-color:rgba(57,255,20,.55)!important;background:radial-gradient(circle at 80% 16%,rgba(57,255,20,.07),transparent 30%),linear-gradient(180deg,#081711,#050b08)!important}.v63d-case.av-sports-home-case:hover{border-color:rgba(57,255,20,.88)!important}.v63-case.av-sports-home-case{border-color:rgba(57,255,20,.62)!important;background:linear-gradient(180deg,#081812,#05100c)!important;box-shadow:0 16px 34px rgba(0,0,0,.26),inset 0 0 0 1px rgba(232,196,107,.10)!important}.v63-mobile-prod .v63-case-art{height:118px!important}.v63-mobile-prod .v63-case-body{display:flex!important;flex-direction:column!important;min-height:158px!important;padding:13px!important}.v63-mobile-prod .v63-case h3{font-size:15px!important;line-height:1.18!important}.v63-mobile-prod .v63-case p{font-size:9.5px!important;line-height:1.4!important}.v63-mobile-prod .av-case-open{margin-top:auto!important;padding-top:10px!important;font-size:8px!important}.v63-mobile-prod .av-case-eyebrow{font-size:7px!important;letter-spacing:.09em!important}@media(max-width:1050px) and (min-width:821px){#v63d-studii .v63d-case{flex-basis:calc(50% - 10px)!important;max-width:480px!important}}@media(max-width:820px){.v63d-case.av-sports-home-case{display:block!important}}';
    document.head.appendChild(style);
  }

  function tuneCaseCard(card,mobile,data){
    if(!card)return;
    card.setAttribute("aria-label",data.aria);
    if(data.className)card.classList.add(data.className);
    const art=card.querySelector(mobile?".v63-case-art":".v63d-case-art");
    const body=card.querySelector(mobile?".v63-case-body":".v63d-case-body");
    if(art){
      art.classList.add("av-case-real-art");
      art.innerHTML='<img src="'+data.image+'" loading="lazy" decoding="async" alt="'+data.alt+'">';
    }
    if(body){
      body.innerHTML='<span class="av-case-eyebrow">'+data.eyebrow+'</span><h3>'+data.title+'</h3><p>'+data.text+'</p><span class="av-case-open">VEZI STUDIUL DE CAZ →</span>';
    }
  }

  const CASES={
    love:{
      href:'/studii-de-caz/intalnire-dragoste-arce-solare-2001/',
      image:'/images/studii-de-caz/intalnire-dragoste-2001-astrovip.jpg',
      eyebrow:'DRAGOSTE · BUCUREȘTI 2001',
      title:'Întâlnire în dragoste',
      text:'Patru Arce Solare și activări relaționale care marchează un moment biografic important.',
      alt:'AstroVip: studiu de caz despre întâlnirea în dragoste din 2001',
      aria:'Studiu de caz AstroVip: Întâlnire în dragoste, 2001'
    },
    career:{
      href:'/studii-de-caz/incepere-job-1-martie-2000/',
      image:'/images/studii-de-caz/incepere-job-1-martie-2000-astrovip.svg',
      eyebrow:'CARIERĂ · BUCUREȘTI 2000',
      title:'Schimbare în carieră',
      text:'Soare–MC, Arce Solare și tranzite care însoțesc începutul unei etape profesionale.',
      alt:'AstroVip: studiu de caz despre schimbarea profesională din martie 2000',
      aria:'Studiu de caz AstroVip: Schimbare în carieră, martie 2000'
    },
    relocation:{
      href:'/studii-de-caz/relocare-geografica-spania-2003/',
      image:'/images/studii-de-caz/relocare-geografica-spania-2003-astrovip.webp',
      eyebrow:'RELOCARE · SPANIA 2003',
      title:'Relocare geografică',
      text:'Uranus–Ascendent și alte activări care însoțesc schimbarea majoră de direcție și loc.',
      alt:'AstroVip: studiu de caz despre relocarea geografică în Spania din 2003',
      aria:'Studiu de caz AstroVip: Relocare geografică în Spania, 2003'
    },
    lottery:{
      href:'/studii-de-caz/castig-loto-roma-2020/',
      image:'/assets/studiu-caz-castig-loto-roma-2020.svg',
      eyebrow:'LOTERIE · ROMA 2020',
      title:'Câștig la Loto',
      text:'Timing astrologic verificat retrospectiv prin Arce Solare, tranzite și axe. Analiză de caz, nu formulă de câștig.',
      alt:'AstroVip: studiu de caz despre câștigul la Loto din Roma 2020',
      aria:'Studiu de caz AstroVip: Câștig la Loto, Roma 2020',
      className:'av-home-lotto-case'
    }
  };

  function addSportsCard(grid,mobile){
    if(!grid||grid.querySelector('[data-av-sports-case="1"]'))return;
    const card=document.createElement("a");
    card.href="/algoritm-pariuri-sportive/";
    card.dataset.avSportsCase="1";
    card.className=(mobile?"v63-case":"v63d-case")+" av-sports-home-case";
    card.setAttribute("aria-label","Studiu de caz pariuri sportive: Franța Italia");
    const artClass=mobile?"v63-case-art":"v63d-case-art";
    const bodyClass=mobile?"v63-case-body":"v63d-case-body";
    card.innerHTML='<div class="'+artClass+' av-case-real-art"><img src="/assets/studiu-caz-franta-italia-20261002.webp" loading="lazy" decoding="async" alt="AstroVip: studiu de caz pariuri sportive Franța Italia"></div><div class="'+bodyClass+'"><span class="av-case-eyebrow">PARIURI SPORTIVE · FRANȚA–ITALIA</span><h3>Algoritmul AstroVip aplicat unui meci real</h3><p>Favorit–outsider, Pars Fortunae, Antiscia, Luna și axele 1/4/7/10. Metodologie experimentală, fără garanții de câștig.</p><span class="av-case-open">VEZI STUDIUL DE CAZ →</span></div>';
    grid.appendChild(card);
  }

  function enhanceGrid(grid,mobile){
    if(!grid)return;
    [CASES.love,CASES.career,CASES.relocation,CASES.lottery].forEach(data=>{
      tuneCaseCard(grid.querySelector('a[href="'+data.href+'"]'),mobile,data);
    });
    addSportsCard(grid,mobile);
  }

  function enhanceCaseStudies(){
    addCaseStyles();

    const desktopSection=document.getElementById("v63d-studii");
    const desktopGrid=desktopSection&&desktopSection.querySelector(".v63d-grid4");
    if(desktopSection){
      const lead=desktopSection.querySelector(".v63d-title p");
      if(lead)lead.textContent="Cinci studii documentate, fiecare cu imagine proprie: dragoste, carieră, relocare, loterie și astrologie aplicată sportului.";
    }
    enhanceGrid(desktopGrid,false);

    const mobileSection=[...document.querySelectorAll(".v63-mobile-prod .v63-sec")].find(section=>{
      const h=section.querySelector("h2");
      return h&&h.textContent.trim()==="STUDII DE CAZ";
    });
    const mobileGrid=mobileSection&&mobileSection.querySelector(".v63-grid2");
    if(mobileSection){
      const lead=mobileSection.querySelector(".v63-lead");
      if(lead)lead.textContent="Cinci studii de caz, fiecare cu imagine proprie și acces direct la analiza completă.";
    }
    enhanceGrid(mobileGrid,true);
  }

  function init(){
    document.body.classList.add("av-motion-live");
    addStripeButtons();
    enhanceCaseStudies();
    if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&matchMedia("(pointer: fine) and (min-width: 981px)").matches){
      document.querySelectorAll(".card").forEach(card=>{
        card.addEventListener("pointermove",event=>{
          const box=card.getBoundingClientRect();
          card.style.setProperty("--av-mx",100*(event.clientX-box.left)/box.width+"%");
          card.style.setProperty("--av-my",100*(event.clientY-box.top)/box.height+"%");
        },{passive:true});
      });
    }
  }

  if(!document.documentElement.dataset.avMotionLoaded){
    document.documentElement.dataset.avMotionLoaded="1";
    document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init,{once:true}):init();
  }
}();