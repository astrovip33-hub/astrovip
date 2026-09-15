(function(){
  'use strict';
  const SIGNS=[['Berbec','♈'],['Taur','♉'],['Gemeni','♊'],['Rac','♋'],['Leu','♌'],['Fecioară','♍'],['Balanță','♎'],['Scorpion','♏'],['Săgetător','♐'],['Capricorn','♑'],['Vărsător','♒'],['Pești','♓']];
  const BODIES=[['Sun','Soare','☉'],['Moon','Lună','☽'],['Mercury','Mercur','☿'],['Venus','Venus','♀'],['Mars','Marte','♂'],['Jupiter','Jupiter','♃'],['Saturn','Saturn','♄'],['Uranus','Uranus','♅'],['Neptune','Neptun','♆'],['Pluto','Pluto','♇']];
  const norm=x=>((x%360)+360)%360;
  const dayDelta=(a,b)=>((b-a+540)%360)-180;
  function geoLongitude(body,date){
    const eqj=Astronomy.GeoVector(body,date,true);
    return norm(Astronomy.Ecliptic(eqj).elon);
  }
  function formatLongitude(lon){
    lon=norm(lon);let si=Math.floor(lon/30),within=lon-si*30,d=Math.floor(within),m=Math.round((within-d)*60);
    if(m===60){m=0;d++;if(d===30){d=0;si=(si+1)%12}}
    return {sign:SIGNS[si][0],symbol:SIGNS[si][1],deg:d,min:m,text:`${d}°${String(m).padStart(2,'0')}′ ${SIGNS[si][1]} ${SIGNS[si][0]}`};
  }
  function calc(){
    const now=new Date(),later=new Date(now.getTime()+86400000),out=[];
    BODIES.forEach(([body,label,glyph],i)=>{
      try{
        const lon=geoLongitude(body,now),f=formatLongitude(lon);let retro=false;
        if(i>1){retro=dayDelta(lon,geoLongitude(body,later))<-0.0005}
        out.push({label,glyph,lon,...f,retro});
      }catch(e){console.warn('AstroVip planet calc',label,e)}
    });
    return {now,out};
  }
  const itemHtml=p=>`<span class="planet-item"><span class="planet-glyph">${p.glyph}</span><strong>${p.label}</strong><span>${p.deg}°${String(p.min).padStart(2,'0')}′ ${p.symbol} ${p.sign}</span>${p.retro?'<span class="planet-retro" title="retrograd">℞</span>':''}</span>`;
  function applyTickerTuning(){
    if(document.getElementById('astrovip-ticker-tuning'))return;
    const style=document.createElement('style');
    style.id='astrovip-ticker-tuning';
    style.textContent='.planet-track{animation-duration:46s!important}.planet-item{font-size:17px!important;gap:8px!important}.planet-glyph{font-size:22px!important}@media(max-width:820px){.planet-item{font-size:16px!important}.planet-glyph{font-size:21px!important}.planet-track{gap:19px!important}}';
    document.head.appendChild(style);
  }
  function render(){
    if(!window.Astronomy||typeof Astronomy.GeoVector!=='function'||typeof Astronomy.Ecliptic!=='function')return;
    const {now,out}=calc();if(!out.length)return;
    document.querySelectorAll('[data-planet-ticker]').forEach(el=>{const seq=out.map(itemHtml).join('');el.innerHTML=`<div class="planet-track">${seq}${seq}</div>`});
    document.querySelectorAll('[data-planet-updated]').forEach(el=>{el.textContent=`actualizat ${now.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})}`});
    document.querySelectorAll('[data-planet-grid]').forEach(el=>{el.innerHTML=out.map(p=>`<article class="planet-card"><div class="big">${p.glyph}</div><strong>${p.label}</strong><span>${p.text}</span>${p.retro?'<div class="retro">Mișcare retrogradă ℞</div>':'<div>Mișcare directă</div>'}</article>`).join('')});
  }
  function boot(){
    applyTickerTuning();
    let tries=0;const timer=setInterval(()=>{tries++;if(window.Astronomy&&typeof Astronomy.GeoVector==='function'&&typeof Astronomy.Ecliptic==='function'){clearInterval(timer);render();setInterval(render,60000)}else if(tries>80){clearInterval(timer);document.querySelectorAll('[data-planet-ticker]').forEach(el=>el.textContent='Pozițiile planetare live nu s-au putut încărca.')}},150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
