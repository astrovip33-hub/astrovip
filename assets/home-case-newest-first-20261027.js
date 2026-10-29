(()=>{
  'use strict';
  const CASE13='/studii-de-caz/vocatie-it-marketing-online-comunicare/';
  const CASE13_IMAGE='/assets/vocatie-it-marketing-comunicare-20261029.svg';
  const TEACHER='/studii-de-caz/vocatie-invatator-17-mai-1972/';
  const ASTROLOG='/astrologie-cariera-vocatie/';
  const IMAGE='/assets/vocatie-invatator-20261029.jpg';
  const ORDER=[
    CASE13,
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
  const ensureStyle=()=>{
    if(document.getElementById('av-case-newest-first-style'))return;
    const s=document.createElement('style');
    s.id='av-case-newest-first-style';
    s.textContent=`
      #studii-de-caz-home .av-case-teacher .av-case-showcase-visual,
      #studii-de-caz-home .av-case-teacher .av-case-local-space-visual{aspect-ratio:2/3!important;height:auto!important;min-height:0!important;background:#fffbea!important;overflow:hidden!important}
      #studii-de-caz-home .av-case-teacher .av-case-showcase-visual img,
      #studii-de-caz-home .av-case-mobile-ticker .av-case-teacher .av-case-showcase-visual img,
      #studii-de-caz-home .av-case-desktop-marquee-v9 .av-case-teacher .av-case-showcase-visual img{display:block!important;width:100%!important;height:auto!important;object-fit:contain!important;object-position:center center!important;opacity:1!important;visibility:visible!important;filter:none!important;background:#fffbea!important}
      #studii-de-caz-home .av-case-teacher .av-case-local-space-symbol{color:#ffe987!important;background:rgba(15,45,68,.86)!important}
      #studii-de-caz-home .av-case-local-space-index{font-size:12px!important;color:#fff2b0!important;text-shadow:0 1px 6px rgba(0,0,0,.8)!important}
      #studii-de-caz-home .av-case-it-marketing .av-case-showcase-visual{background:#020405!important}
      #studii-de-caz-home .av-case-it-marketing .av-case-showcase-visual img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center center!important;background:#020405!important}
      #studii-de-caz-home .av-case-it-marketing::after{content:none!important;display:none!important}
    `;
    document.head.appendChild(s);
  };
  const makeCase13=()=>{
    const a=document.createElement('a');
    a.className='av-case-showcase-card av-case-local-space av-case-it-marketing';
    a.href=CASE13;
    a.setAttribute('aria-label','Vezi studiul de caz Vocație profesională – IT, Marketing Online și Comunicare');
    a.innerHTML=`<div class="av-case-showcase-visual av-case-local-space-visual"><img src="${CASE13_IMAGE}" width="1360" height="600" loading="eager" fetchpriority="high" decoding="async" alt="Vocație profesională – IT, Marketing Online și Comunicare: Ascendent Vărsător, Luna în Gemeni și Uranus la MC"><span class="av-case-local-space-index" aria-hidden="true">01</span></div><div class="av-case-showcase-copy"><p class="av-case-showcase-eyebrow">STUDIU DE CAZ 01 · VOCAȚIE</p><h3>Vocație profesională – IT · Marketing Online · Comunicare</h3><p class="av-case-showcase-meta">Ascendent Vărsător · Luna în Gemeni · Uranus la MC</p><p class="av-case-showcase-lead">Tehnologie, rețele, informație și inovație profesională: o semnătură vocațională construită pentru mediul digital și comunicare.</p><span class="av-case-showcase-cta">VEZI STUDIUL →</span></div>`;
    return a;
  };
  const makeTeacher=()=>{
    const a=document.createElement('a');
    a.className='av-case-showcase-card av-case-local-space av-case-teacher';
    a.href=TEACHER;
    a.setAttribute('aria-label','Vezi studiul de caz Vocație profesională – Învățător');
    a.innerHTML=`<div class="av-case-showcase-visual av-case-local-space-visual"><img src="${IMAGE}" width="1024" height="1536" loading="eager" fetchpriority="high" decoding="async" alt="Vocație profesională – Învățător, studiu de caz AstroVip"><span class="av-case-local-space-symbol" aria-hidden="true">♅</span><span class="av-case-local-space-index" aria-hidden="true">01</span></div><div class="av-case-showcase-copy"><p class="av-case-showcase-eyebrow">STUDIU DE CAZ 01 · VOCAȚIE</p><h3>Vocație profesională – Învățător</h3><p class="av-case-showcase-meta">17 mai 1972 · București · educație</p><p class="av-case-showcase-lead">MC în Balanță, Venus și Luna în Rac, Soare în Casa 5, Uranus sub 5° de MC și orientare vestică: profil simbolic de educator empatic și inovator.</p><span class="av-case-showcase-cta">VEZI STUDIUL →</span></div>`;
    return a;
  };
  const categoryFor=(card)=>{
    if(card.matches('.av-case-teacher,.av-case-it-marketing'))return 'VOCAȚIE';
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
    let case13=track.querySelector(`a[href="${CASE13}"]`);
    if(!case13){case13=makeCase13();track.prepend(case13)}
    case13.classList.add('av-case-it-marketing');
    const case13Img=case13.querySelector('img');
    if(case13Img){case13Img.setAttribute('src',CASE13_IMAGE);case13Img.setAttribute('width','1360');case13Img.setAttribute('height','600');case13Img.removeAttribute('srcset');case13Img.setAttribute('loading','eager');case13Img.setAttribute('fetchpriority','high');case13Img.setAttribute('decoding','async')}
    let teacher=track.querySelector(`a[href="${TEACHER}"]`);
    if(!teacher){teacher=makeTeacher();track.prepend(teacher)}
    teacher.classList.add('av-case-teacher');
    const img=teacher.querySelector('img');
    if(img){img.setAttribute('src',IMAGE);img.setAttribute('width','1024');img.setAttribute('height','1536');img.removeAttribute('srcset');img.setAttribute('loading','eager');img.setAttribute('fetchpriority','high');img.setAttribute('decoding','async')}
    const map=new Map([...track.querySelectorAll(':scope > a[href]')].map(a=>[a.getAttribute('href'),a]));
    ORDER.forEach(href=>{const card=map.get(href);if(card)track.appendChild(card)});
    [...track.querySelectorAll(':scope > .av-case-showcase-card')].filter(card=>!ORDER.includes(card.getAttribute('href'))).forEach(card=>track.appendChild(card));
    renumber(track);
    track.dataset.avNewestFirst='1';
    section.dispatchEvent(new CustomEvent('astrovip:cases-expanded',{bubbles:true,detail:{count:track.querySelectorAll(':scope > .av-case-showcase-card').length,newestFirst:true,case13:true,teacherImage:true}}));
    return true;
  };
  const boot=()=>{
    let tries=0;
    const timer=setInterval(()=>{tries++;if(install()||tries>160)clearInterval(timer)},100);
    install();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
