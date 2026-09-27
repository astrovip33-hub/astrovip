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
  const dayDelta=(a,b)=>((b-a+540)%360)-180;

  function longitude(body,date){
    const vector=Astronomy.GeoVector(body,date,true);
    return norm(Astronomy.Ecliptic(vector).elon);
  }

  function formatLongitude(lon){
    lon=norm(lon);
    let signIndex=Math.floor(lon/30);
    let within=lon-signIndex*30;
    let deg=Math.floor(within);
    let min=Math.round((within-deg)*60);
    if(min===60){
      min=0;deg++;
      if(deg===30){deg=0;signIndex=(signIndex+1)%12;}
    }
    return {deg,min,sign:SIGNS[signIndex][0],symbol:SIGNS[signIndex][1]};
  }

  function planetItem(body,label,glyph,now,later,houses,index){
    const lon=longitude(body,now);
    const pos=formatLongitude(lon);
    const retro=index>1 && dayDelta(lon,longitude(body,later))<-0.0005;
    const house=AstroVipKoch.houseOfLongitude(lon,houses.cusps);
    return '<span class="planet-item" role="listitem">'+
      '<span class="planet-glyph" aria-hidden="true">'+glyph+'</span>'+
      '<strong>'+label+'</strong>'+
      '<span>'+pos.deg+'°'+String(pos.min).padStart(2,'0')+'′</span>'+
      '<span class="planet-sign" aria-hidden="true">'+pos.symbol+'</span>'+
      '<span>'+pos.sign+'</span>'+
      (house?'<span class="planet-house">H'+house+'</span>':'')+
      (retro?'<span class="planet-retro" title="Retrograd" aria-hidden="true">℞</span>':'')+
      '</span>';
  }

  function angleItem(label,lon){
    const pos=formatLongitude(lon);
    return '<span class="planet-item planet-angle" role="listitem" aria-label="'+label+', '+pos.deg+' grade '+pos.min+' minute în '+pos.sign+'">'+
      '<strong>'+label+'</strong>'+
      '<span>'+pos.deg+'°'+String(pos.min).padStart(2,'0')+'′</span>'+
      '<span class="planet-sign" aria-hidden="true">'+pos.symbol+'</span>'+
      '<span>'+pos.sign+'</span>'+
      '</span>';
  }

  function render(){
    if(!window.Astronomy||!window.AstroVipKoch||
       typeof Astronomy.GeoVector!=='function'||typeof Astronomy.Ecliptic!=='function') return;

    const now=new Date();
    const later=new Date(now.getTime()+86400000);
    let houses;
    try{houses=AstroVipKoch.calculate(now,BUCHAREST.lat,BUCHAREST.lon);}
    catch(error){console.warn('AstroVip București ASC/MC',error);return;}

    const planets=BODIES.map((body,index)=>{
      try{return planetItem(body[0],body[1],body[2],now,later,houses,index);}
      catch(error){console.warn('AstroVip planetă',body[1],error);return '';}
    }).join('');

    const angles=angleItem('ASC',houses.asc)+angleItem('MC',houses.mc);
    const sequence=planets+angles;

    document.querySelectorAll('.av-planet-hero-strip [data-planet-ticker][data-include-angles]').forEach(el=>{
      el.innerHTML='<div class="planet-track">'+
        '<div class="planet-sequence" role="list">'+sequence+'</div>'+
        '<div class="planet-sequence" aria-hidden="true">'+sequence+'</div>'+
      '</div>';
      el.setAttribute('tabindex','0');
      el.setAttribute('aria-label','Pozițiile planetelor, Ascendentul și Mijlocul Cerului pentru București');
      el.setAttribute('title','ASC și MC live · Koch · București 44.4268° N, 26.1025° E');
      const first=el.querySelector('.planet-sequence');
      if(first){
        const width=first.getBoundingClientRect().width;
        if(width) el.querySelector('.planet-track').style.setProperty('--ticker-duration',Math.max(34,width/68)+'s');
      }
    });
  }

  function boot(){
    let tries=0;
    const ready=()=>{
      if(window.Astronomy&&window.AstroVipKoch){
        render();
        setInterval(()=>{if(!document.hidden)render();},60000);
        document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
      }else if(tries++<80){
        setTimeout(ready,150);
      }
    };
    ready();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();