(()=>{
  'use strict';
  const TEACHER='/studii-de-caz/vocatie-invatator-17-mai-1972/';
  const ASTROLOG='/astrologie-cariera-vocatie/';
  const IMAGE='/assets/case-invatator-img-20261027.txt?v=20261027-teacher-preview1';
  const ORDER=[
    TEACHER,
    ASTROLOG,
    '/studii-de-caz/acte-casa-septembrie-2004/',
    '/studii-de-caz/george-becali-jupiter-pluto/',
    '/local-space/studii-de-caz/jupiter-iasi-17/',
    '/local-space/studii-de-caz/venus-constanta-98/',
    '/local-space/studii-de-caz/luna-sulina-73/',
    '/local-space/studii-de-caz/soare-calarasi-108/',
    '/studii-de-caz/interventie-chirurgicala-pitesti-1998/',
    '/studii-de-caz/castig-loto-roma-2020/',
    '/studii-de-caz/incepere-job-1-martie-2000/',
    '/studii-de-caz/relocare-geografica-spania-2003/',
    '/studii-de-caz/intalnire-dragoste-arce-solare-2001/'
  ];
  let imagePromise;
  const imageSrc=()=>imagePromise||(imagePromise=fetch(IMAGE,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error('teacher image '+r.status);return r.text()}).then(b=>'data:image/webp;base64,'+b.trim()));
  const ensureStyle=()=>{
    if(document.getElementById('av-case-newest-first-style'))return;
    const s=document.createElement('style');
    s.id='av-case-newest-first-style';
    s.textContent=`
      #studii-de-caz-home .av-case-teacher .av-case-showcase-visual{background:linear-gradient(145deg,#f5fbff,#fff3ca)!important}
      #studii-de-caz-home .av-case-teacher .av-case-showcase-visual img,
      #studii-de-caz-home .av-case-mobile-ticker .av-case-teacher .av-case-showcase-visual img,
      #studii-de-caz-home .av-case-desktop-marquee-v9 .av-case-teacher .av-case-showcase-visual img{object-fit:contain!important;object-position:center top!important;background:linear-gradient(145deg,#f5fbff,#fff3ca)!important}
      #studii-de-caz-home .av-case-teacher .av-case-local-space-symbol{color:#ffe987!important;background:rgba(15,45,68,.86)!important}
      #studii-de-caz-home .av-case-local-space-index{font-size:12px!important;color:#fff2b0!important;text-shadow:0 1px 6px rgba(0,0,0,.8)!important}
    `;
    document.head.appendChild(s);
  };
  const makeTeacher=()=>{
    const a=document.createElement('a');
    a.className='av-case-showcase-card av-case-local-space av-case-teacher';
    a.href=TEACHER;
    a.setAttribute('aria-label','Vezi studiul de caz Vocație profesională – Învățător');
    a.innerHTML=`<div class="av-case-showcase-visual av-case-local-space-visual"><img width="400" height="600" loading="lazy" decoding="async" alt="Vocație profesională – Învățător, studiu de caz AstroVip"><span class="av-case-local-space-symbol" aria-hidden="true">♅</span><span class="av-case-local-space-index" aria-hidden="true">01</span></div><div class="av-case-showcase-copy"><p class="av-case-showcase-eyebrow">STUDIU DE CAZ 01 · VOCAȚIE</p><h3>Vocație profesională – Învățător</h3><p class="av-case-showcase-meta">17 mai 1972 · București · educație</p><p class="av-case-showcase-lead">MC în Balanță, Venus și Luna în Rac, Soare în Casa 5, Uranus sub 5° de MC și orientare vestică: profil simbolic de educator empatic și inovator.</p><span class="av-case-showcase-cta">VEZI STUDIUL →</span></div>`;
    imageSrc().then(src=>{
      const img=a.querySelector('img');
      if(img)img.src=src;
      const section=document.getElementById('studii-de-caz-home');
      section?.dispatchEvent(new CustomEvent('astrovip:cases-expanded',{bubbles:true,detail:{teacherImage:true}}));
    }).catch(()=>{});
    return a;
  };
  const categoryFor=(card)=>{
    if(card.matches('.av-case-teacher'))return 'VOCAȚIE';
    const href=card.getAttribute('href')||'';
    if(href===ASTROLOG)return 'VOCAȚIE';
    const old=(card.querySelector('.av-case-showcase-eyebrow')?.textContent||'').trim();
    if(/LOCAL SPACE/i.test(old))return old.replace(/^.*?LOCAL SPACE/i,'LOCAL SPACE').replace(/^LOCAL SPACE\s*·?\s*/i,'LOCAL SPACE · ');
    const parts=old.split('·').map(x=>x.trim()).filter(Boolean);
    if(parts.length>1)return parts.slice(1).join(' · ').replace(/^NOU\s*·?\s*/i,'');
    if(/dragoste|sentimental/i.test(card.textContent))return 'DRAGOSTE';
    if(/relocare/i.test(card.textContent))return 'RELOCARE';
    if(/job|carier/i.test(card.textContent))return 'CARIERĂ';
    return '';
  };
  const renumber=(track)=>{
    const cards=[...track.querySelectorAll(':scope > .av-case-showcase-card')];
    cards.forEach((card,i)=>{
      const n=String(i+1).padStart(2,'0');
      let index=card.querySelector('.av-case-local-space-index');
      if(!index){
        index=document.createElement('span');
        index.className='av-case-local-space-index';
        index.setAttribute('aria-hidden','true');
        card.querySelector('.av-case-showcase-visual')?.appendChild(index);
      }
      index.textContent=n;
      const eye=card.querySelector('.av-case-showcase-eyebrow');
      if(eye){
        const cat=categoryFor(card).replace(/\s*·\s*$/,'');
        eye.textContent=`STUDIU DE CAZ ${n}${cat?' · '+cat:''}`;
      }
    });
  };
  const install=()=>{
    const section=document.getElementById('studii-de-caz-home');
    const track=section&&section.querySelector('.av-case-showcase-grid');
    if(!section||!track)return false;
    if(!track.querySelector(`a[href="${ASTROLOG}"]`))return false;
    ensureStyle();
    let teacher=track.querySelector(`a[href="${TEACHER}"]`);
    if(!teacher){teacher=makeTeacher();track.prepend(teacher)}
    const map=new Map([...track.querySelectorAll(':scope > a[href]')].map(a=>[a.getAttribute('href'),a]));
    ORDER.forEach(href=>{const card=map.get(href);if(card)track.appendChild(card)});
    [...track.querySelectorAll(':scope > .av-case-showcase-card')].filter(card=>!ORDER.includes(card.getAttribute('href'))).forEach(card=>track.appendChild(card));
    renumber(track);
    track.dataset.avNewestFirst='1';
    section.dispatchEvent(new CustomEvent('astrovip:cases-expanded',{bubbles:true,detail:{count:track.querySelectorAll(':scope > .av-case-showcase-card').length,newestFirst:true}}));
    return true;
  };
  const boot=()=>{
    let tries=0;
    const timer=setInterval(()=>{tries++;if(install()||tries>160)clearInterval(timer)},100);
    install();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();