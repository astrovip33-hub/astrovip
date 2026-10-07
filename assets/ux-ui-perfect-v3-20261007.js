(()=>{
  if(location.pathname!=='/'&&location.pathname!=='')return;
  const CSS_ID='astrovip-ux-ui-v3-css';
  const CSS_HREF='/assets/ux-ui-perfect-v3-20261007.css?v=20261007-v3a';
  const imp=(el,k,v)=>{if(el)el.style.setProperty(k,v,'important')};
  const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  function cssLast(){
    let l=document.getElementById(CSS_ID);
    if(!l){l=document.createElement('link');l.id=CSS_ID;l.rel='stylesheet';l.href=CSS_HREF;document.head.appendChild(l)}
    else if(l!==document.head.lastElementChild)document.head.appendChild(l);
  }
  function classifyHero(){
    const hero=document.querySelector('section.hero.hero-split.av-hero-v2.av-hero-mobile-restore');
    if(!hero)return;
    const controls=[...hero.querySelectorAll('a,button')];
    for(const el of controls){
      const t=norm(el.textContent||el.getAttribute('aria-label'));
      const h=norm(el.getAttribute('href'));
      el.removeAttribute('data-avux-role');
      if(t.includes('program')||h.includes('#programari'))el.setAttribute('data-avux-role','primary');
      else if(t.includes('plateste')||t.includes('500 lei')||h.includes('stripe'))el.setAttribute('data-avux-role','payment');
      else if(t.includes('descopera')||t.includes('astrovip'))el.setAttribute('data-avux-role','discover');
    }
  }
  function enforceCritical(){
    cssLast();
    classifyHero();
    const hamb=document.getElementById('hamb');
    if(hamb){for(const [k,v] of [['width','44px'],['min-width','44px'],['max-width','44px'],['height','44px'],['min-height','44px'],['max-height','44px'],['box-sizing','border-box']])imp(hamb,k,v)}
    for(const id of ['studiu-de-caz-dragoste-2001','studiu-de-caz-loto-2020','studiu-de-caz-franta-italia-2006']){
      const el=document.getElementById(id);if(!el)continue;
      imp(el,'content-visibility','visible');imp(el,'contain','none');imp(el,'contain-intrinsic-size','none');imp(el,'min-height','0');imp(el,'height','auto');
    }
  }
  const run=()=>{enforceCritical();[80,250,650,1300,2200].forEach(ms=>setTimeout(enforceCritical,ms));
    const mo=new MutationObserver(()=>enforceCritical());mo.observe(document.documentElement,{subtree:true,childList:true,attributes:false});setTimeout(()=>mo.disconnect(),3200)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
