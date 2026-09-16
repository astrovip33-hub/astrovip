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
    style.textContent=`.planet-track{animation-duration:43s!important}.planet-item{font-size:18px!important;gap:8px!important}.planet-glyph{font-size:23px!important}.planet-strip-secondary{position:relative!important;top:auto!important;z-index:8!important;margin:0!important}
    .brand{display:inline-flex!important;align-items:center!important;gap:10px!important}.brand::before{content:"";display:block;flex:0 0 auto;width:42px;height:42px;background:url('/assets/astrovip-mark.svg') center/contain no-repeat;filter:drop-shadow(0 0 9px rgba(56,245,138,.42))}
    .natal-home-cta{padding:28px 0 16px!important}.natal-home-card{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:24px 28px;border:1px solid rgba(56,245,138,.38);border-radius:24px;background:linear-gradient(135deg,rgba(56,245,138,.10),rgba(8,22,16,.78));box-shadow:0 18px 46px rgba(0,0,0,.24)}.natal-home-card h2{margin:4px 0 7px;color:#38f58a;font-size:clamp(27px,4vw,42px);line-height:1}.natal-home-card p{margin:0;color:var(--muted);max-width:720px}.natal-home-card .cta{flex:0 0 auto;white-space:nowrap}
    #astrovip-legal-identity{margin:22px auto 4px;padding:18px 20px;max-width:720px;border:1px solid rgba(57,191,255,.44);border-radius:18px;background:linear-gradient(135deg,rgba(13,95,184,.18),rgba(56,245,138,.07));box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 14px 36px rgba(0,0,0,.20);text-align:center}.legal-identity-title{display:block;margin-bottom:8px;color:#38f58a;font-size:17px;font-weight:950;letter-spacing:.5px}.legal-identity-name{display:block;color:#f8fbff;font-size:15px;font-weight:900}.legal-identity-meta{display:flex;justify-content:center;gap:9px 18px;flex-wrap:wrap;margin-top:9px;color:#c9d8ef;font-size:13px;font-weight:760}.legal-identity-meta span{white-space:nowrap}.legal-identity-meta b{color:#8ee9ff;font-weight:900}
    body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"],body:not(.guide-page) .trust-icon-only[aria-label^="Codul Etic"]{padding:8px!important}body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"] img,body:not(.guide-page) .trust-icon-only[aria-label^="Codul Etic"] img{max-width:100%!important;max-height:100%!important}
    @media(min-width:821px){body:not(.guide-page) .hero{background-image:linear-gradient(90deg,rgba(3,15,33,.99) 0%,rgba(3,15,33,.94) 34%,rgba(3,15,33,.70) 50%,rgba(3,15,33,.26) 64%,rgba(3,15,33,.04) 78%),url('/assets/1000043152.png')!important;background-position:center,82% center!important;background-size:auto,cover!important;background-repeat:no-repeat!important}body:not(.guide-page) .hero:before{inset:0 54% 0 0!important;background:linear-gradient(90deg,#041126 0%,rgba(4,17,38,.98) 58%,rgba(4,17,38,.56) 82%,rgba(4,17,38,0) 100%)!important}body:not(.guide-page) .hero:after{height:120px!important;background:linear-gradient(180deg,transparent,rgba(4,17,38,.72))!important}}
    @media(max-width:820px){.brand{gap:8px!important}.brand::before{width:36px;height:36px}.planet-item{font-size:17px!important}.planet-glyph{font-size:22px!important}.planet-track{gap:19px!important}.natal-home-cta{padding:18px 0 8px!important}.natal-home-card{padding:18px;flex-direction:column;align-items:stretch;text-align:center;border-radius:20px}.natal-home-card .cta{width:100%}#astrovip-legal-identity{margin-top:18px;padding:16px 13px;border-radius:15px}.legal-identity-meta{display:grid;gap:5px}.legal-identity-meta span{white-space:normal;overflow-wrap:anywhere}body:not(.guide-page) .trust-icon-only,body:not(.guide-page) .trust-commerce-card{height:96px!important;min-height:96px!important}body:not(.guide-page) .trust-icon-only{padding:2px!important;overflow:hidden!important}body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"] img{width:calc(100% - 2px)!important;height:calc(100% - 2px)!important;max-width:none!important;max-height:none!important;object-fit:fill!important;object-position:center!important;margin:auto!important}body:not(.guide-page) .trust-icon-only[aria-label^="Codul Etic"] img{width:calc(100% - 2px)!important;height:calc(100% - 2px)!important;max-width:none!important;max-height:none!important;object-fit:fill!important;object-position:center!important;margin:auto!important}body:not(.guide-page) .trust-commerce-card{padding:7px 4px 6px!important}body:not(.guide-page) .trust-commerce-kicker{margin-bottom:2px!important}body:not(.guide-page) .trust-commerce-points{margin-top:5px!important;gap:2px!important}body:not(.guide-page) .trust-commerce-points span{min-height:18px!important;padding:2px 3px!important}}`;
    document.head.appendChild(style);
  }
  function integrateBrandMark(){
    const icon=document.querySelector('link[rel~="icon"]');
    if(icon){icon.href='/assets/astrovip-mark.svg';icon.type='image/svg+xml'}
    else{const link=document.createElement('link');link.rel='icon';link.type='image/svg+xml';link.href='/assets/astrovip-mark.svg';document.head.appendChild(link)}
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
  function integrateSecondTicker(){
    const services=document.getElementById('servicii');
    if(!services||document.getElementById('planet-strip-secondary'))return;
    const strip=document.createElement('div');
    strip.id='planet-strip-secondary';
    strip.className='planet-strip planet-strip-secondary';
    strip.innerHTML='<div class="planet-strip-inner"><div class="planet-ticker" data-planet-ticker>Se calculează pozițiile planetelor…</div></div>';
    services.insertAdjacentElement('afterend',strip);
  }
  function integrateForumLink(){
    const navLink=document.querySelector('.menu a[href="#comunitate"]');if(navLink){navLink.href='/forum/';navLink.textContent='Forum'}
    const section=document.getElementById('comunitate');if(!section||document.getElementById('forum-live-entry'))return;
    const intro=section.querySelector('.title p');if(intro)intro.textContent='Forum AstroVip are acum conturi, profiluri, reacții, notificări și moderare.';
    const oldGrid=section.querySelector('.community-grid');if(oldGrid)oldGrid.hidden=true;
    const entry=document.createElement('div');entry.id='forum-live-entry';entry.innerHTML='<div style="max-width:720px;margin:0 auto;text-align:center;padding:4px 0 10px"><a class="cta" href="/forum/">Intră în Forumul AstroVip</a><p style="margin:14px 0 0;color:var(--muted);font-size:14px">Discuții despre astrologie natală, previziuni, sinastrie, relocare, Local Space și numerologie.</p></div>';section.querySelector('.wrap')?.appendChild(entry);
  }
  function integrateLegalIdentity(){
    const footer=document.querySelector('.foot');
    if(!footer||document.getElementById('astrovip-legal-identity'))return;
    const host=footer.querySelector('.wrap')||footer;
    const box=document.createElement('div');
    box.id='astrovip-legal-identity';
    box.setAttribute('aria-label','Date profesionale și fiscale AstroVip');
    box.innerHTML='<strong class="legal-identity-title">Astrolog autorizat</strong><span class="legal-identity-name">Smaranda Cristian Cătălin PFA</span><div class="legal-identity-meta"><span><b>CUI</b> 50191527</span><span><b>IBAN</b> RO08BTRLRONCRT0CS6331801</span></div>';
    host.appendChild(box);
  }
  function render(){if(!window.Astronomy||typeof Astronomy.GeoVector!=='function'||typeof Astronomy.Ecliptic!=='function')return;const{now,out}=calc();if(!out.length)return;document.querySelectorAll('[data-planet-ticker]').forEach(el=>{const seq=out.map(itemHtml).join('');el.innerHTML=`<div class="planet-track">${seq}${seq}</div>`});document.querySelectorAll('[data-planet-updated]').forEach(el=>{el.textContent=`actualizat ${now.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})}`});document.querySelectorAll('[data-planet-grid]').forEach(el=>{el.innerHTML=out.map(p=>`<article class="planet-card"><div class="big">${p.glyph}</div><strong>${p.label}</strong><span>${p.text}</span>${p.retro?'<div class="retro">Mișcare retrogradă ℞</div>':'<div>Mișcare directă</div>'}</article>`).join('')})}
  function boot(){applyPageTuning();integrateBrandMark();integrateAstroTools();integrateSecondTicker();integrateForumLink();integrateLegalIdentity();let tries=0;const timer=setInterval(()=>{tries++;if(window.Astronomy&&typeof Astronomy.GeoVector==='function'&&typeof Astronomy.Ecliptic==='function'){clearInterval(timer);render();setInterval(render,60000)}else if(tries>80){clearInterval(timer);document.querySelectorAll('[data-planet-ticker]').forEach(el=>el.textContent='Pozițiile planetare live nu s-au putut încărca.')}},150)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();