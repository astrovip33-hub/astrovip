(()=>{
  if(location.pathname.startsWith('/command-center'))return;

  const path=location.pathname;
  const isHome=path==='/'||path==='';
  const isNatal=path==='/harta-mea'||path==='/harta-mea/';

  const addStyle=(id,css)=>{
    if(document.getElementById(id))return;
    const style=document.createElement('style');
    style.id=id;
    style.textContent=css;
    document.head.appendChild(style);
  };

  const applyOverrides=()=>fetch('/assets/site-page-overrides.json',{cache:'no-store'})
    .then(r=>r.ok?r.json():null)
    .then(c=>{
      const items=c?.pages?.[path]||c?.pages?.[path.replace(/\/$/,'')+'/']||[];
      for(const x of items){
        try{
          const el=document.querySelector(x.selector);
          if(!el)continue;
          if(typeof x.text==='string')el.textContent=x.text;
          if(x.style&&typeof x.style==='object'){
            for(const [k,v] of Object.entries(x.style)){
              if(v&&['color','backgroundColor','borderColor','borderWidth','borderStyle','borderRadius','opacity','fontSize','fontWeight','padding','boxShadow','display'].includes(k))el.style[k]=v;
            }
          }
        }catch{}
      }
    })
    .catch(()=>{});

  const fixBookingCta=()=>{
    document.querySelectorAll('.av-header-booking').forEach(a=>{
      a.setAttribute('href',isHome?'#programari':'/#programari');
      a.removeAttribute('target');
      a.removeAttribute('rel');
      a.setAttribute('aria-label','Programează-te');
    });
  };

  const fixHome=()=>{
    if(!isHome)return;

    addStyle('astrovip-ux-ui-20261005',`
      #av-lang-reviews .av-lang-reviews__track{animation:none!important;transform:none!important;width:100%!important;justify-content:center!important;will-change:auto!important}
      #av-lang-reviews .av-lang-reviews__sequence[aria-hidden="true"]{display:none!important}
      #av-lang-reviews .av-lang-reviews__sequence{width:auto!important;padding-right:0!important;justify-content:center!important}
      .av-services-all-action{display:flex;justify-content:center;margin:26px auto 0;text-align:center}
      #menu>.av-menu-programare{display:inline-flex!important;align-items:center;justify-content:center;min-height:40px;padding:8px 14px;border-radius:999px;background:linear-gradient(180deg,#f5ff91 0,#cbed0c 58%,#a4d100 100%);color:#111900!important;font-weight:950!important}
      @media(max-width:820px){body:not(.guide-page) .hero #av-hero-planets{display:none!important}.av-services-all-action{margin-top:20px}.av-services-all-action .btn2{width:100%;max-width:360px}}
    `);

    const menu=document.getElementById('menu');
    if(menu){
      const direct=[...menu.children];
      const removeNames=new Set(['Acasă','Bibliotecă','Research','Video']);
      direct.forEach(el=>{
        if(el.tagName==='A'&&removeNames.has((el.textContent||'').trim()))el.remove();
      });

      const groups=[...menu.children].filter(el=>el.classList?.contains('av-menu-group'));
      const byLabel=label=>groups.find(g=>(g.querySelector('.av-menu-trigger')?.textContent||'').trim().toLowerCase()===label.toLowerCase());
      const firstKeptLink=[...menu.children].find(el=>el.tagName==='A'&&['Despre mine','Contact'].includes((el.textContent||'').trim()))||null;
      ['Servicii','Astrologie','Instrumente','Studii de caz'].map(byLabel).filter(Boolean).forEach(g=>menu.insertBefore(g,firstKeptLink));

      if(!menu.querySelector(':scope > .av-menu-programare')){
        const booking=document.createElement('a');
        booking.className='av-menu-programare';
        booking.href='#programari';
        booking.textContent='Programare';
        menu.appendChild(booking);
      }
    }

    document.querySelectorAll('#servicii a[href="#contact"]').forEach(a=>{
      a.setAttribute('href','#programari');
      if((a.textContent||'').trim().toLowerCase().includes('solicită'))a.textContent='Programează analiza';
    });

    const serviceGrid=document.querySelector('#servicii .av-services-clean-grid');
    if(serviceGrid&&!document.querySelector('#servicii .av-services-all-action')){
      const wrap=document.createElement('div');
      wrap.className='av-services-all-action';
      wrap.innerHTML='<a class="btn2" href="#oferte">VEZI TOATE SERVICIILE ȘI TARIFELE →</a>';
      serviceGrid.insertAdjacentElement('afterend',wrap);
    }

    const earlyPay=document.querySelector('#programari .av-checkout-panel[data-checkout-panel="1"] a[href*="buy.stripe.com"]');
    if(earlyPay)earlyPay.remove();
    const finalSubmit=document.querySelector('#programari #bookingSubmit');
    if(finalSubmit)finalSubmit.textContent='CONFIRMĂ ȘI CONTINUĂ LA PLATĂ →';
  };

  const fixNatal=()=>{
    if(!isNatal)return;

    const quick=document.querySelector('#calcul-harta-natala-explicat .av-section-title p');
    if(quick)quick.innerHTML='<strong>Calculatorul de hartă natală</strong> transformă data, ora și locul nașterii în poziții planetare, Ascendent, MC, case Koch și aspecte majore pentru zodiacul tropical. Pentru explicații și interpretare, consultă <a href="/harta-natala/"><strong>ghidul de hartă natală</strong></a> și ghidul dedicat <a href="/calculator-ascendent/"><strong>Ascendentului</strong></a>.';

    const interpretation=document.querySelector('#calcul-harta-natala-explicat + section.av-results');
    const interpretationIntro=interpretation?.querySelector('.av-section-title > p');
    if(interpretationIntro)interpretationIntro.textContent='Calculatorul de hartă natală afișează pozițiile planetelor, Ascendentul, MC-ul, casele Koch și aspectele majore pentru datele introduse. Pentru o interpretare completă, rezultatul se citește împreună cu semnele, stăpânii caselor și relațiile dintre planete.';
    const upgrade=interpretation?.querySelector('.av-upgrade p');
    if(upgrade)upgrade.innerHTML='Aprofundează <a href="/calculator-ascendent/"><strong>Ascendentul</strong></a>, compară două hărți cu <a href="/sinastrie-calculator/"><strong>calculatorul de sinastrie</strong></a>, verifică <a href="/pozitii-planete-live/"><strong>poziția planetelor azi</strong></a> sau explorează <a href="/local-space/"><strong>Local Space</strong></a> și relocarea geografică.';

    const astrograma=document.querySelector('#av-astrograma-seo .av-section-title p');
    if(astograma)astograma.innerHTML='<strong>Astrograma natală</strong> este reprezentarea pozițiilor planetelor pentru data, ora și localitatea nașterii. Completează datele de mai sus pentru a genera pozițiile planetare, Ascendentul, MC-ul, casele Koch și aspectele majore. Precizia unghiurilor și caselor depinde de ora nașterii, coordonatele geografice și fusul orar corect. Pentru explicații aprofundate continuă cu <a href="/harta-natala/">ghidul de hartă natală</a>; pentru interpretare individuală vezi <a href="/astrolog-online/">Astrolog Online</a>.';
  };

  const run=()=>{
    applyOverrides();
    fixBookingCta();
    fixHome();
    fixNatal();
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
