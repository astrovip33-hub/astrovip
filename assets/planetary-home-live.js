(function(){
  'use strict';

  const SIGNS=[
    ['Berbec','♈'],['Taur','♉'],['Gemeni','♊'],['Rac','♋'],['Leu','♌'],['Fecioară','♍'],
    ['Balanță','♎'],['Scorpion','♏'],['Săgetător','♐'],['Capricorn','♑'],['Vărsător','♒'],['Pești','♓']
  ];
  const BODIES=[
    ['Sun','Soare','☉'],['Moon','Lună','☽'],['Mercury','Mercur','☿'],['Venus','Venus','♀'],
    ['Mars','Marte','♂'],['Jupiter','Jupiter','♃'],['Saturn','Saturn','♄'],['Uranus','Uranus','♅'],
    ['Neptune','Neptun','♆'],['Pluto','Pluto','♇']
  ];
  const BUCHAREST={lat:44.4268,lon:26.1025,timeZone:'Europe/Bucharest'};
  const norm=x=>((x%360)+360)%360;

  function longitude(body,date){
    const v=Astronomy.GeoVector(body,date,true);
    return norm(Astronomy.Ecliptic(v).elon);
  }

  function fmt(lon){
    lon=norm(lon);
    let si=Math.floor(lon/30);
    let within=lon-si*30;
    let d=Math.floor(within);
    let m=Math.round((within-d)*60);
    if(m===60){m=0;d++;if(d===30){d=0;si=(si+1)%12}}
    return {sign:SIGNS[si][0],symbol:SIGNS[si][1],deg:d,min:m};
  }

  function render(){
    if(!window.Astronomy||typeof Astronomy.GeoVector!=='function'||typeof Astronomy.Ecliptic!=='function')return;
    const now=new Date();
    const html=BODIES.map(([body,label,glyph])=>{
      try{
        const p=fmt(longitude(body,now));
        return '<span class="planet-item"><span class="planet-glyph" aria-hidden="true">'+glyph+'</span><strong>'+label+'</strong> <span>'+p.deg+'°'+String(p.min).padStart(2,'0')+'′ '+p.symbol+' '+p.sign+'</span></span>';
      }catch(e){return ''}
    }).join('');
    document.querySelectorAll('.av-planet-hero-strip [data-planet-ticker]').forEach(el=>{
      if(html)el.innerHTML=html;
      el.setAttribute('title','Poziții tropicale geocentrice · referință locală București 44.4268°N, 26.1025°E');
    });
    const time=now.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit',timeZone:BUCHAREST.timeZone});
    document.querySelectorAll('[data-planet-bucharest-time]').forEach(el=>{el.textContent='București '+time});
  }

  function loadEngine(){
    if(window.Astronomy){render();setInterval(render,60000);return}
    const s=document.createElement('script');
    s.src='/assets/vendor/astronomy-engine-2.1.19.min.js';
    s.async=true;
    s.onload=()=>{render();setInterval(render,60000)};
    s.onerror=()=>{};
    document.head.appendChild(s);
  }

  function boot(){
    if('requestIdleCallback' in window)requestIdleCallback(loadEngine,{timeout:1200});
    else setTimeout(loadEngine,250);
  }

  if(document.readyState==='complete')boot();
  else window.addEventListener('load',boot,{once:true});
})();