import {DEFAULT_PLACE,planetarySnapshot,answerHTML,tableHTML,dateLabel,timeLabel,GLYPHS,MEANINGS} from './planetary-hours-core.mjs';

let place={...DEFAULT_PLACE};
let renderedKey='';
const element=id=>document.getElementById(id);
function render() {
  const now=new Date(), data=planetarySnapshot(now,place);
  if(!data) {
    element('nowPlanet').textContent='Calcul indisponibil pentru această localitate';
    element('planetary-answer').textContent='Nu există răsărit și apus în succesiunea necesară pentru această dată și localitate. Alege un oraș din listă.';
    for(const id of ['sunrise','sunset','nowRange','nextHour','duration']) element(id).textContent='—';
    element('hours').replaceChildren();
    element('nowMeaning').textContent='Orele planetare necesită alternanța răsărit–apus–răsărit.';
    return;
  }
  const {current,next}=data;
  const key=[place.lat,place.lon,place.timeZone,Math.floor(+now/60000),+current.start].join('|');
  if(key===renderedKey) return;
  renderedKey=key;
  document.querySelector('h1').textContent='Ore planetare azi, '+dateLabel(data.civilDay);
  element('planetary-answer').innerHTML=answerHTML(data);
  element('sunrise').textContent=timeLabel(data.sunrise,place.timeZone);
  element('sunset').textContent=timeLabel(data.sunset,place.timeZone);
  element('nowPlanet').textContent=GLYPHS[current.planet]+' '+current.planet;
  element('nowRange').textContent=timeLabel(current.start,place.timeZone)+' – '+timeLabel(current.end,place.timeZone)+' · '+current.kind;
  element('nowMeaning').textContent=MEANINGS[current.planet];
  element('nextHour').textContent=next?GLYPHS[next.planet]+' '+next.planet+' · '+timeLabel(next.start,place.timeZone):'—';
  element('duration').textContent=Math.round((current.end-current.start)/60000)+' min';
  element('hours').innerHTML=tableHTML(data);
  element('place').textContent='Calcul pentru '+place.label+' · '+place.timeZone+'. Ziua planetară începe la răsăritul din '+dateLabel(data.day)+'.';
}
element('city').addEventListener('change',event=>{
  const [lat,lon,label]=event.target.value.split(',');
  place={lat:Number(lat),lon:Number(lon),label,timeZone:'Europe/Bucharest'};
  render();
});
element('refresh').addEventListener('click',render);
element('geo').addEventListener('click',()=>{
  if(!navigator.geolocation) {element('place').textContent='Localizarea nu este disponibilă. Alege un oraș din listă.';return;}
  navigator.geolocation.getCurrentPosition(position=>{
    place={lat:position.coords.latitude,lon:position.coords.longitude,label:'locația ta',timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone};
    // Geolocation supplies coordinates, not a time zone. Make the displayed
    // device time zone explicit instead of inferring one from longitude.
    element('city').selectedIndex=-1;
    render();
  },()=>{element('place').textContent='Locația nu a fost permisă. Rămâne calculul pentru '+place.label+'.';},{enableHighAccuracy:false,timeout:8000,maximumAge:600000});
});
render();
setInterval(render,1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
