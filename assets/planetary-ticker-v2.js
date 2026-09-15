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
    .natal-home-cta{padding:28px 0 16px!important}.natal-home-card{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:24px 28px;border:1px solid rgba(56,245,138,.38);border-radius:24px;background:linear-gradient(135deg,rgba(56,245,138,.10),rgba(8,22,16,.78));box-shadow:0 18px 46px rgba(0,0,0,.24)}.natal-home-card h2{margin:4px 0 7px;color:#38f58a;font-size:clamp(27px,4vw,42px);line-height:1}.natal-home-card p{margin:0;color:var(--muted);max-width:720px}.natal-home-card .cta{flex:0 0 auto;white-space:nowrap}
    @media(max-width:820px){.planet-item{font-size:17px!important}.planet-glyph{font-size:22px!important}.planet-track{gap:19px!important}.natal-home-cta{padding:18px 0 8px!important}.natal-home-card{padding:18px;flex-direction:column;align-items:stretch;text-align:center;border-radius:20px}.natal-home-card .cta{width:100%}}`;
    document.head.appendChild(style);
  }
  function integrateAstroTools(){
    const menu=document.querySelector('.menu');
    if(menu){
      const servicesLink=menu.querySelector('a[href="#servicii"]');
      let natal=menu.querySelector('a[href="/harta-mea/"]');
      if(!natal){natal=document.createElement('a');natal.href='/harta-mea/';natal.textContent='Harta mea';if(servicesLink)servicesLink.insertAdjacentElement('afterend',natal);else menu.prepend(natal)}
      if(!menu.querySelector('a[href="/local-space/"]')){const ls=document.createElement('a');ls.href='/local-space/';ls.textContent='Local Space';natal.insertAdjacentElement('afterend',ls)}
    }
    const services=document.getElementById('servicii');if(!services||document.getElementById('harta-mea-cta'))return;
    const section=document.createElement('section');section.id='harta-mea-cta';section.className='natal-home-cta';section.innerHTML=`<div class="wrap"><div class="natal-home-card"><div><div class="kicker">Instrumente gratuite AstroVip</div><h2>Harta natală & Local Space</h2><p>Calculează pozițiile planetelor, apoi transformă locul nașterii într-o busolă planetară cu azimuturi și variantă relocată.</p></div><a class="cta" href="/harta-mea/">Deschide Harta mea</a></div></div>`;services.parentNode.insertBefore(section,services);
  }
  function integrateForumLink(){
    const navLink=document.querySelector('.menu a[href="#comunitate"]');if(navLink){navLink.href='/forum/';navLink.textContent='Forum'}
    const section=document.getElementById('comunitate');if(!section||document.getElementById('forum-live-entry'))return;
    const intro=section.querySelector('.title p');if(intro)intro.textContent='Forum AstroVip are acum conturi, profiluri, reacții, notificări și moderare.';
    const oldGrid=section.querySelector('.community-grid');if(oldGrid)oldGrid.hidden=true;
    const entry=document.createElement('div');entry.id='forum-live-entry';entry.innerHTML='<div style="max-width:720px;margin:0 auto;text-align:center;padding:4px 0 10px"><a class="cta" href="/forum/">Intră în Forumul AstroVip</a><p style="margin:14px 0 0;color:var(--muted);font-size:14px">Discuții despre astrologie natală, previziuni, sinastrie, relocare, Local Space și numerologie.</p></div>';section.querySelector('.wrap')?.appendChild(entry);
  }
  function render(){if(!window.Astronomy||typeof Astronomy.GeoVector!=='function'||typeof Astronomy.Ecliptic!=='function')return;const{now,out}=calc();if(!out.length)return;document.querySelectorAll('[data-planet-ticker]').forEach(el=>{const seq=out.map(itemHtml).join('');el.innerHTML=`<div class="planet-track">${seq}${seq}</div>`});document.querySelectorAll('[data-planet-updated]').forEach(el=>{el.textContent=`actualizat ${now.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})}`});document.querySelectorAll('[data-planet-grid]').forEach(el=>{el.innerHTML=out.map(p=>`<article class="planet-card"><div class="big">${p.glyph}</div><strong>${p.label}</strong><span>${p.text}</span>${p.retro?'<div class="retro">Mișcare retrogradă ℞</div>':'<div>Mișcare directă</div>'}</article>`).join('')})}
  function boot(){applyPageTuning();integrateAstroTools();integrateForumLink();let tries=0;const timer=setInterval(()=>{tries++;if(window.Astronomy&&typeof Astronomy.GeoVector==='function'&&typeof Astronomy.Ecliptic==='function'){clearInterval(timer);render();setInterval(render,60000)}else if(tries>80){clearInterval(timer);document.querySelectorAll('[data-planet-ticker]').forEach(el=>el.textContent='Pozițiile planetare live nu s-au putut încărca.')}},150)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
