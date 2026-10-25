import './vendor/astronomy-engine-2.1.19.min.js';

export const DEFAULT_PLACE = Object.freeze({lat:44.4268, lon:26.1025, label:'București', timeZone:'Europe/Bucharest'});
export const PLANETS = ['Saturn','Jupiter','Marte','Soare','Venus','Mercur','Lună'];
export const GLYPHS = {Saturn:'♄',Jupiter:'♃',Marte:'♂',Soare:'☉',Venus:'♀',Mercur:'☿',Lună:'☽'};
export const MEANINGS = {Saturn:'Structură, disciplină, limite și lucruri care cer răbdare.',Jupiter:'Expansiune, studiu, oportunități și perspectivă.',Marte:'Acțiune, inițiativă, competiție și energie directă.',Soare:'Vizibilitate, afirmare, autoritate și obiective centrale.',Venus:'Relații, armonie, frumusețe, negociere și plăcere.',Mercur:'Comunicare, acte, analiză, comerț și deplasări.',Lună:'Ritm, familie, adaptare, emoții și activități cotidiene.'};
const RULERS = ['Soare','Lună','Marte','Mercur','Jupiter','Venus','Saturn'];
export const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function localDay(now, timeZone='Europe/Bucharest') {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(p=>[p.type,p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function addDays(day, count) {
  return new Date(Date.parse(day+'T12:00:00Z')+count*86400000).toISOString().slice(0,10);
}
export function midnight(day, timeZone) {
  const target=Date.parse(day+'T00:00:00Z');
  let guess=target;
  for(let i=0;i<4;i++) {
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(guess)).map(p=>[p.type,p.value]));
    const shown=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);
    const delta=shown-target;
    if(!delta) return new Date(guess);
    guess-=delta;
  }
  return new Date(guess);
}
export function dateLabel(day) {
  return new Intl.DateTimeFormat('ro-RO',{timeZone:'UTC',day:'numeric',month:'long',year:'numeric'}).format(new Date(day+'T12:00:00Z'));
}
export function timeLabel(date, timeZone='Europe/Bucharest') {
  return new Intl.DateTimeFormat('ro-RO',{timeZone,hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZoneName:'shortOffset'}).format(date);
}

// The calendar day and weekday belong to the selected location, never the
// machine's time zone. Astronomical intervals use UTC instants across DST.
const dayCache=new Map();
export function solarDay(day, place=DEFAULT_PLACE) {
  if(!Number.isFinite(place.lat)||Math.abs(place.lat)>90||!Number.isFinite(place.lon)||Math.abs(place.lon)>180) throw new RangeError('Coordonate invalide');
  const key=[day,place.lat,place.lon,place.timeZone].join('|');
  if(dayCache.has(key)) return dayCache.get(key);
  const start=midnight(day,place.timeZone), tomorrow=midnight(addDays(day,1),place.timeZone);
  const observer=new globalThis.Astronomy.Observer(place.lat,place.lon,0);
  const sunrise=globalThis.Astronomy.SearchRiseSet('Sun',observer,1,start,2)?.date;
  const sunset=globalThis.Astronomy.SearchRiseSet('Sun',observer,-1,start,2)?.date;
  const nextSunrise=globalThis.Astronomy.SearchRiseSet('Sun',observer,1,tomorrow,2)?.date;
  if(!sunrise||!sunset||!nextSunrise||localDay(sunrise,place.timeZone)!==day||localDay(sunset,place.timeZone)!==day||!(sunrise<sunset&&sunset<nextSunrise)) return null;
  const first=PLANETS.indexOf(RULERS[new Date(day+'T12:00:00Z').getUTCDay()]);
  const entries=Array.from({length:24},(_,i)=>{
    const night=i>=12, base=night?sunset:sunrise, length=((night?nextSunrise:sunset)-base)/12, n=i%12;
    return {start:new Date(+base+n*length),end:new Date(+base+(n+1)*length),planet:PLANETS[(first+i)%7],kind:night?'Noapte':'Zi',number:n+1};
  });
  const result={day,sunrise,sunset,nextSunrise,entries};
  if(dayCache.size>=40) dayCache.delete(dayCache.keys().next().value);
  dayCache.set(key,result);
  return result;
}
export function planetarySnapshot(now=new Date(), place=DEFAULT_PLACE) {
  const civilDay=localDay(now,place.timeZone);
  let schedule=solarDay(civilDay,place);
  if(!schedule) return null;
  if(now<schedule.sunrise) schedule=solarDay(addDays(civilDay,-1),place);
  if(!schedule) return null;
  const index=schedule.entries.findIndex(x=>now>=x.start&&now<x.end);
  if(index<0) return null;
  const current=schedule.entries[index];
  const next=index<23?schedule.entries[index+1]:solarDay(addDays(schedule.day,1),place)?.entries[0];
  return {...schedule,civilDay,now,place,current,index,next};
}
export function answerHTML(data) {
  const {now,place,current,civilDay}=data;
  return `Pe <time datetime="${civilDay}">${escapeHTML(dateLabel(civilDay))}</time>, la ${escapeHTML(timeLabel(now,place.timeZone))}, în ${escapeHTML(place.label)}, ora planetară calculată este ${escapeHTML(current.planet)}, în intervalul ${escapeHTML(timeLabel(current.start,place.timeZone))}–${escapeHTML(timeLabel(current.end,place.timeZone))}. Intervalele sunt calculate după răsăritul și apusul local, pentru fusul ${escapeHTML(place.timeZone)}; interpretarea este astrologică și simbolică.`;
}
export function tableHTML(data) {
  const {place}=data;
  return `<caption>Ore planetare pentru ${escapeHTML(place.label)}: de la răsăritul din ${escapeHTML(dateLabel(data.day))} până la răsăritul din ${escapeHTML(dateLabel(addDays(data.day,1)))} · ${escapeHTML(place.timeZone)}</caption><thead><tr><th scope="col">Interval</th><th scope="col">Planetă</th><th scope="col">Început</th><th scope="col">Sfârșit</th></tr></thead><tbody>`+data.entries.map((x,i)=>`<tr${i===data.index?' class="is-now" aria-current="true"':''}><th scope="row">${x.kind} ${x.number}</th><td>${GLYPHS[x.planet]} ${x.planet}</td><td><time datetime="${x.start.toISOString()}">${escapeHTML(timeLabel(x.start,place.timeZone))}</time></td><td><time datetime="${x.end.toISOString()}">${escapeHTML(timeLabel(x.end,place.timeZone))}</time></td></tr>`).join('')+'</tbody>';
}
