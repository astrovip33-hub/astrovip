(function(){
  'use strict';
  const SIGNS=[['Berbec','♈'],['Taur','♉'],['Gemeni','♊'],['Rac','♋'],['Leu','♌'],['Fecioară','♍'],['Balanță','♎'],['Scorpion','♏'],['Săgetător','♐'],['Capricorn','♑'],['Vărsător','♒'],['Pești','♓']];
  const BODIES=[['Sun','Soare','☉'],['Moon','Lună','☽'],['Mercury','Mercur','☿'],['Venus','Venus','♀'],['Mars','Marte','♂'],['Jupiter','Jupiter','♃'],['Saturn','Saturn','♄'],['Uranus','Uranus','♅'],['Neptune','Neptun','♆'],['Pluto','Pluto','♇']];
  const norm=x=>((x%360)+360)%360;
  const dayDelta=(a,b)=>((b-a+540)%360)-180;
  function geoLongitude(body,date){const eqj=Astronomy.GeoVector(body,date,true);return norm(Astronomy.Ecliptic(eqj).elon)}
  function formatLongitude(lon){lon=norm(lon);let si=Math.floor(lon/30),within=lon-si*30,d=Math.floor(within),m=Math.round((within-d)*60);if(m===60){m=0;d++;if(d===30){d=0;si=(si+1)%12}}return{sign:SIGNS[si][0],symbol:SIGNS[si][1],deg:d,min:m,text:`${d}°${String(m).padStart(2,'0')}′ ${SIGNS[si][1]} ${SIGNS[si][0]}`}}
  function calc(){const now=new Date(),later=new Date(now.getTime()+86400000),out=[];BODIES.forEach(([body,label,glyph],i)=>{try{const lon=geoLongitude(body,now),f=formatLongitude(lon);let retro=false;if(i>1)retro=dayDelta(lon,geoLongitude(body,later))<-0.0005;out.push({label,glyph,lon,...f,retro})}catch(e){console.warn('AstroVip planet calc',label,e)}});return{now,out}}
  const itemHtml=p=>`<span class="planet-item"><span class="planet-glyph">${p.glyph}</span><strong>${p.label}</strong><span>${p.deg}°${String(p.min).padStart(2,'0')}′ ${p.symbol} ${p.sign}</span>${p.retro?'<span class="planet-retro" title="retrograd">℞</span>':''}</span>`;
  function applyPageTuning(){
    if(document.getElementById('astrovip-runtime-tuning'))return;
    const style=document.createElement('style');style.id='astrovip-runtime-tuning';
    style.textContent=`.planet-track{animation-duration:43s!important}.planet-item{font-size:18px!important;gap:8px!important}.planet-glyph{font-size:23px!important}
    .trust-refs{background:#172b54!important;padding-top:32px!important;padding-bottom:42px!important}
    .trust-icons-only{display:grid!important;grid-template-columns:1fr!important;gap:22px!important;width:min(1120px,94%)!important;max-width:1120px!important;margin:0 auto!important}
    .anpc-legal-card{min-height:150px;display:grid;grid-template-columns:250px 1fr;align-items:center;background:#fff;color:#10156d;border:4px solid rgba(55,65,150,.18);border-radius:34px;padding:17px 28px;box-shadow:0 10px 34px rgba(0,0,0,.2);text-decoration:none!important;overflow:hidden}
    .anpc-legal-card:hover{transform:translateY(-2px);box-shadow:0 15px 40px rgba(0,0,0,.27)}
    .anpc-mark{display:flex;flex-direction:column;align-items:center;justify-content:center;align-self:stretch;border-right:2px solid #d7d9e6;padding-right:24px;color:#141a7c;line-height:1}
    .anpc-mark strong{font-size:54px;letter-spacing:-2px;font-weight:950}.anpc-mark small{font-size:11px;margin-top:8px;font-weight:900;letter-spacing:.6px;text-align:center}.anpc-mark em{font-style:normal;font-size:22px;margin-top:10px;font-weight:900}
    .anpc-copy{text-align:center;padding:4px 10px}.anpc-copy strong{display:block;font-size:clamp(24px,3.2vw,46px);line-height:1.05;font-weight:950;letter-spacing:.2px;color:#131875;text-transform:uppercase}.anpc-detail{display:inline-flex;margin-top:15px;border-radius:999px;background:#1c197f;color:#fff!important;padding:8px 28px;font-size:18px;font-weight:950;box-shadow:inset 0 2px 0 rgba(255,255,255,.25)}
    .anpc-ethics{text-align:center;margin:2px auto 0;color:#dbe6ff;font-size:13px}.anpc-ethics a{color:#fff;text-decoration:underline;font-weight:850}
    @media(max-width:820px){.planet-item{font-size:17px!important}.planet-glyph{font-size:22px!important}.planet-track{gap:19px!important}.trust-icons-only{width:calc(100% - 24px)!important}.anpc-legal-card{grid-template-columns:1fr;min-height:0;padding:20px 16px;border-radius:28px}.anpc-mark{border-right:0;border-bottom:1px solid #d7d9e6;padding:0 0 15px;margin-bottom:14px}.anpc-mark strong{font-size:44px}.anpc-copy strong{font-size:27px}.anpc-detail{font-size:16px;padding:7px 24px}}`;
    document.head.appendChild(style);
  }
  function integrateForumLink(){
    const navLink=document.querySelector('.menu a[href="#comunitate"]');if(navLink){navLink.href='/forum/';navLink.textContent='Forum'}
    const section=document.getElementById('comunitate');if(!section||document.getElementById('forum-live-entry'))return;
    const intro=section.querySelector('.title p');if(intro)intro.textContent='Forum AstroVip are acum conturi, profiluri, reacții, notificări și moderare.';
    const oldGrid=section.querySelector('.community-grid');if(oldGrid)oldGrid.hidden=true;
    const entry=document.createElement('div');entry.id='forum-live-entry';entry.innerHTML='<div style="max-width:720px;margin:0 auto;text-align:center;padding:4px 0 10px"><a class="cta" href="/forum/">Intră în Forumul AstroVip</a><p style="margin:14px 0 0;color:var(--muted);font-size:14px">Discuții despre astrologie natală, previziuni, sinastrie, relocare, Local Space și numerologie.</p></div>';section.querySelector('.wrap')?.appendChild(entry);
  }
  function integrateConsumerLinks(){
    const host=document.querySelector('#repere-incredere .trust-icons-only')||document.querySelector('.trust-icons-only');if(!host||host.dataset.anpcUpdated==='1')return;
    host.dataset.anpcUpdated='1';
    host.innerHTML=`<a class="anpc-legal-card" href="https://anpc.ro/sal/" target="_blank" rel="noopener noreferrer" aria-label="ANPC - Soluționarea Alternativă a Litigiilor"><span class="anpc-mark"><strong>ANPC</strong><small>PROTECȚIA CONSUMATORILOR</small><em>Te respectă</em></span><span class="anpc-copy"><strong>Soluționarea alternativă<br>a litigiilor</strong><span class="anpc-detail">DETALII</span></span></a><a class="anpc-legal-card" href="https://reclamatiisal.anpc.ro/Depune-cerere-SAL" target="_blank" rel="noopener noreferrer" aria-label="Depune online o reclamație SAL"><span class="anpc-mark"><strong>ANPC</strong><small>PLATFORMA ELECTRONICĂ SAL</small><em>Online</em></span><span class="anpc-copy"><strong>Depune online<br>o reclamație SAL</strong><span class="anpc-detail">DETALII</span></span></a><div class="anpc-ethics">Referință profesională suplimentară: <a href="https://www.aar.org.ro/codul-etic/" target="_blank" rel="noopener noreferrer">Codul Etic al Astrologului</a></div>`;
  }
  function render(){if(!window.Astronomy||typeof Astronomy.GeoVector!=='function'||typeof Astronomy.Ecliptic!=='function')return;const{now,out}=calc();if(!out.length)return;document.querySelectorAll('[data-planet-ticker]').forEach(el=>{const seq=out.map(itemHtml).join('');el.innerHTML=`<div class="planet-track">${seq}${seq}</div>`});document.querySelectorAll('[data-planet-updated]').forEach(el=>{el.textContent=`actualizat ${now.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})}`});document.querySelectorAll('[data-planet-grid]').forEach(el=>{el.innerHTML=out.map(p=>`<article class="planet-card"><div class="big">${p.glyph}</div><strong>${p.label}</strong><span>${p.text}</span>${p.retro?'<div class="retro">Mișcare retrogradă ℞</div>':'<div>Mișcare directă</div>'}</article>`).join('')})}
  function boot(){applyPageTuning();integrateForumLink();integrateConsumerLinks();let tries=0;const timer=setInterval(()=>{tries++;if(window.Astronomy&&typeof Astronomy.GeoVector==='function'&&typeof Astronomy.Ecliptic==='function'){clearInterval(timer);render();setInterval(render,60000)}else if(tries>80){clearInterval(timer);document.querySelectorAll('[data-planet-ticker]').forEach(el=>el.textContent='Pozițiile planetare live nu s-au putut încărca.')}},150)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
