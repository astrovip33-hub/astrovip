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
    style.textContent=`
      .planet-track{animation-duration:30s!important}
      .planet-item{font-size:21px!important;gap:8px!important}
      .planet-glyph{font-size:25px!important}

      body:not(.guide-page) #repere-incredere{
        padding:18px 0 20px!important;
        background:linear-gradient(180deg,#07152f 0%,#031026 100%)!important;
      }
      body:not(.guide-page) #repere-incredere:before,
      body:not(.guide-page) #repere-incredere:after,
      body:not(.guide-page) #repere-incredere .trust-minibox:before,
      body:not(.guide-page) #repere-incredere .trust-minibox:after{
        display:none!important;
        content:none!important;
      }
      body:not(.guide-page) #repere-incredere .trust-minibox{
        width:100%!important;
        max-width:1180px!important;
        margin:0 auto!important;
      }
      body:not(.guide-page) #repere-incredere .trust-icons-only{
        display:flex!important;
        grid-template-columns:none!important;
        justify-content:center!important;
        align-items:center!important;
        gap:14px!important;
        width:100%!important;
        margin:0 auto!important;
      }
      body:not(.guide-page) #repere-incredere .trust-icon-only{
        display:flex!important;
        flex-direction:row!important;
        align-items:center!important;
        justify-content:center!important;
        flex:0 1 300px!important;
        width:300px!important;
        max-width:calc((100% - 14px)/2)!important;
        height:108px!important;
        min-height:108px!important;
        padding:12px 18px!important;
        border:1px solid #e6e9ee!important;
        border-radius:10px!important;
        background:#fff!important;
        box-shadow:0 10px 26px rgba(0,0,0,.18)!important;
        overflow:hidden!important;
        transform:none!important;
      }
      body:not(.guide-page) #repere-incredere .trust-icon-only:before,
      body:not(.guide-page) #repere-incredere .trust-icon-only:after{
        display:none!important;
        content:none!important;
      }
      body:not(.guide-page) #repere-incredere .trust-icon-only img,
      body:not(.guide-page) #repere-incredere .trust-icon-only:first-child img,
      body:not(.guide-page) #repere-incredere .trust-icon-only:last-child img{
        display:block!important;
        order:initial!important;
        width:auto!important;
        height:auto!important;
        max-width:96%!important;
        max-height:82%!important;
        margin:0 auto!important;
        object-fit:contain!important;
      }

      @media(max-width:820px){
        .planet-track{animation-duration:29s!important;gap:18px!important}
        .planet-item{font-size:20px!important}
        .planet-glyph{font-size:24px!important}

        body:not(.guide-page){
          width:100%!important;
          min-width:0!important;
          max-width:100%!important;
          margin-left:0!important;
          margin-right:0!important;
          overflow-x:hidden!important;
        }
        body:not(.guide-page) .wrap{
          width:calc(100% - 28px)!important;
          max-width:1180px!important;
          margin-left:auto!important;
          margin-right:auto!important;
        }
        body:not(.guide-page) .grid,
        body:not(.guide-page) .steps,
        body:not(.guide-page) .split,
        body:not(.guide-page) .contact-grid,
        body:not(.guide-page) .community-grid,
        body:not(.guide-page) .booking-wrap,
        body:not(.guide-page) .price-grid,
        body:not(.guide-page) .box{
          min-width:0!important;
          max-width:100%!important;
        }
        body:not(.guide-page) #repere-incredere{padding:12px 0 14px!important}
        body:not(.guide-page) #repere-incredere .trust-icons-only{gap:9px!important}
        body:not(.guide-page) #repere-incredere .trust-icon-only{
          flex:0 1 142px!important;
          width:142px!important;
          max-width:calc((100% - 9px)/2)!important;
          height:64px!important;
          min-height:64px!important;
          padding:7px 9px!important;
          border-radius:7px!important;
          box-shadow:0 7px 18px rgba(0,0,0,.20)!important;
        }
        body:not(.guide-page) #repere-incredere .trust-icon-only:first-child img{max-width:91%!important;max-height:88%!important}
        body:not(.guide-page) #repere-incredere .trust-icon-only:last-child img{max-width:96%!important;max-height:76%!important}
      }
    `;
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
    const host=document.querySelector('#repere-incredere .trust-icons-only')||document.querySelector('.trust-icons-only');
    if(host)host.dataset.anpcUpdated='1';
  }
  function render(){if(!window.Astronomy||typeof Astronomy.GeoVector!=='function'||typeof Astronomy.Ecliptic!=='function')return;const{now,out}=calc();if(!out.length)return;document.querySelectorAll('[data-planet-ticker]').forEach(el=>{const seq=out.map(itemHtml).join('');el.innerHTML=`<div class="planet-track">${seq}${seq}</div>`});document.querySelectorAll('[data-planet-updated]').forEach(el=>{el.textContent=`actualizat ${now.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})}`});document.querySelectorAll('[data-planet-grid]').forEach(el=>{el.innerHTML=out.map(p=>`<article class="planet-card"><div class="big">${p.glyph}</div><strong>${p.label}</strong><span>${p.text}</span>${p.retro?'<div class="retro">Mișcare retrogradă ℞</div>':'<div>Mișcare directă</div>'}</article>`).join('')})}
  function boot(){applyPageTuning();integrateForumLink();integrateConsumerLinks();let tries=0;const timer=setInterval(()=>{tries++;if(window.Astronomy&&typeof Astronomy.GeoVector==='function'&&typeof Astronomy.Ecliptic==='function'){clearInterval(timer);render();setInterval(render,60000)}else if(tries>80){clearInterval(timer);document.querySelectorAll('[data-planet-ticker]').forEach(el=>el.textContent='Pozițiile planetare live nu s-au putut încărca.')}},150)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
