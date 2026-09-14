(function(){
  'use strict';
  const SIGNS=[['Berbec','♈'],['Taur','♉'],['Gemeni','♊'],['Rac','♋'],['Leu','♌'],['Fecioară','♍'],['Balanță','♎'],['Scorpion','♏'],['Săgetător','♐'],['Capricorn','♑'],['Vărsător','♒'],['Pești','♓']];
  function bodies(){
    if(!window.Astronomy || !Astronomy.Body) return [];
    return [
      [Astronomy.Body.Sun,'Soare','☉'],[Astronomy.Body.Moon,'Lună','☽'],[Astronomy.Body.Mercury,'Mercur','☿'],[Astronomy.Body.Venus,'Venus','♀'],[Astronomy.Body.Mars,'Marte','♂'],[Astronomy.Body.Jupiter,'Jupiter','♃'],[Astronomy.Body.Saturn,'Saturn','♄'],[Astronomy.Body.Uranus,'Uranus','♅'],[Astronomy.Body.Neptune,'Neptun','♆'],[Astronomy.Body.Pluto,'Pluto','♇']
    ];
  }
  function norm(x){return ((x%360)+360)%360}
  function dayDelta(a,b){return ((b-a+540)%360)-180}
  function formatLongitude(lon){
    lon=norm(lon); let si=Math.floor(lon/30); let within=lon-si*30; let d=Math.floor(within); let m=Math.round((within-d)*60);
    if(m===60){m=0;d+=1;if(d===30){d=0;si=(si+1)%12}}
    return {sign:SIGNS[si][0],symbol:SIGNS[si][1],deg:d,min:m,text:`${d}°${String(m).padStart(2,'0')}′ ${SIGNS[si][1]} ${SIGNS[si][0]}`};
  }
  function calc(){
    const now=new Date(), later=new Date(now.getTime()+86400000), out=[];
    bodies().forEach(([body,label,glyph],i)=>{
      try{
        const lon=norm(Astronomy.EclipticLongitude(body,now));
        const f=formatLongitude(lon);
        let retro=false;
        if(i>1){const next=norm(Astronomy.EclipticLongitude(body,later));retro=dayDelta(lon,next)<-0.0005}
        out.push({label,glyph,lon,...f,retro});
      }catch(e){console.warn('AstroVip planet calc',label,e)}
    });
    return {now,out};
  }
  function itemHtml(p){return `<span class="planet-item"><span class="planet-glyph">${p.glyph}</span><strong>${p.label}</strong><span>${p.deg}°${String(p.min).padStart(2,'0')}′ ${p.symbol} ${p.sign}</span>${p.retro?'<span class="planet-retro" title="retrograd">℞</span>':''}</span>`}
  function render(){
    if(!window.Astronomy || typeof Astronomy.EclipticLongitude!=='function') return;
    const {now,out}=calc(); if(!out.length) return;
    document.querySelectorAll('[data-planet-ticker]').forEach(el=>{
      const seq=out.map(itemHtml).join('');
      el.innerHTML=`<div class="planet-track">${seq}${seq}</div>`;
    });
    document.querySelectorAll('[data-planet-updated]').forEach(el=>{el.textContent=`actualizat ${now.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit'})}`});
    document.querySelectorAll('[data-planet-grid]').forEach(el=>{
      el.innerHTML=out.map(p=>`<article class="planet-card"><div class="big">${p.glyph}</div><strong>${p.label}</strong><span>${p.text}</span>${p.retro?'<div class="retro">Mișcare retrogradă ℞</div>':'<div>Mișcare directă</div>'}</article>`).join('');
    });
  }
  function boot(){
    let tries=0; const t=setInterval(()=>{tries++;if(window.Astronomy&&typeof Astronomy.EclipticLongitude==='function'){clearInterval(t);render();setInterval(render,60000)}else if(tries>60){clearInterval(t);document.querySelectorAll('[data-planet-ticker]').forEach(el=>el.textContent='Pozițiile planetare live nu s-au putut încărca.')}} ,150);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
