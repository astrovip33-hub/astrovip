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
    if(!window.Astronomy||!window.AstroVipKoch||typeof Astronomy.GeoVector!=='function'||typeof Astronomy.Ecliptic!=='function')return;
    const now=new Date();
    let houses;
    try{houses=AstroVipKoch.calculate(now,BUCHAREST.lat,BUCHAREST.lon)}catch(e){return}
    const html=BODIES.map(([body,label,glyph])=>{
      try{
        const lon=longitude(body,now),p=fmt(lon),house=AstroVipKoch.houseOfLongitude(lon,houses.cusps);
        return '<span class="planet-item"><span class="planet-glyph" aria-hidden="true">'+glyph+'</span><strong>'+label+'</strong> <span>'+p.deg+'°'+String(p.min).padStart(2,'0')+'′ '+p.symbol+' '+p.sign+'</span><span class="planet-house">H'+house+'</span></span>';
      }catch(e){return ''}
    }).join('');
    const asc=fmt(houses.asc),mc=fmt(houses.mc);
    const angles='<span class="planet-item planet-house-angles"><strong>ASC</strong> <span>'+asc.deg+'°'+String(asc.min).padStart(2,'0')+'′ '+asc.symbol+' '+asc.sign+'</span><strong>MC</strong> <span>'+mc.deg+'°'+String(mc.min).padStart(2,'0')+'′ '+mc.symbol+' '+mc.sign+'</span><span class="planet-house-system">Koch · București</span></span>';
    document.querySelectorAll('.av-planet-hero-strip [data-planet-ticker]').forEach(el=>{
      el.innerHTML=html+angles;
      el.setAttribute('title','Poziții tropicale geocentrice + case Koch · București 44.4268°N, 26.1025°E');
    });
    const time=now.toLocaleTimeString('ro-RO',{hour:'2-digit',minute:'2-digit',timeZone:BUCHAREST.timeZone});
    document.querySelectorAll('[data-planet-bucharest-time]').forEach(el=>{el.textContent='București '+time});
  }

  function injectStyles(){
    if(document.getElementById('astrovip-koch-home-style'))return;
    const s=document.createElement('style');s.id='astrovip-koch-home-style';
    s.textContent='.av-planet-hero-strip .planet-house{display:inline-flex;align-items:center;justify-content:center;min-width:30px;padding:2px 7px;border:1px solid rgba(56,245,138,.45);border-radius:999px;color:#9dffc0;font-size:.72em;font-weight:950;line-height:1.2;margin-left:3px}.av-planet-hero-strip .planet-house-angles{border-color:rgba(240,206,104,.45)}.av-planet-hero-strip .planet-house-system{color:#f0ce68;font-size:.72em;font-weight:900;white-space:nowrap}';
    document.head.appendChild(s);
  }

  function loadScript(src,test){
    if(test())return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const existing=[...document.scripts].find(x=>x.src&&x.src.includes(src.split('?')[0]));
      if(existing){existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return}
      const s=document.createElement('script');s.src=src;s.async=true;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
    });
  }

  async function loadEngine(){
    try{
      await loadScript('/assets/vendor/astronomy-engine-2.1.19.min.js',()=>!!window.Astronomy);
      await loadScript('/assets/koch-houses.js?v=20260927-koch1',()=>!!window.AstroVipKoch);
      injectStyles();
      render();
      setInterval(()=>{if(!document.hidden)render()},60000);
      document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
    }catch(e){}
  }

  function boot(){
    if('requestIdleCallback' in window)requestIdleCallback(loadEngine,{timeout:1200});
    else setTimeout(loadEngine,250);
  }

  if(document.readyState==='complete')boot();
  else window.addEventListener('load',boot,{once:true});
})();