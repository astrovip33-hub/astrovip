// Daily solar-sign interpretations. Same data is used in HTML and in the browser.
export const SIGNS = ['Berbec','Taur','Gemeni','Rac','Leu','Fecioară','Balanță','Scorpion','Săgetător','Capricorn','Vărsător','Pești'];
export const SLUGS = ['berbec','taur','gemeni','rac','leu','fecioara','balanta','scorpion','sagetator','capricorn','varsator','pesti'];
export const BODIES = [['Sun','Soare','☉'],['Moon','Lună','☽'],['Mercury','Mercur','☿'],['Venus','Venus','♀'],['Mars','Marte','♂'],['Jupiter','Jupiter','♃'],['Saturn','Saturn','♄'],['Uranus','Uranus','♅'],['Neptune','Neptun','♆'],['Pluto','Pluto','♇']];
const THEMES = ['identitate, inițiativă și energie personală','bani, resurse și siguranță','comunicare, drumuri și decizii rapide','casă, familie și echilibru emoțional','iubire, creativitate și bucurie','muncă și organizarea rutinei','relații, acorduri și parteneriate','transformare, intimitate și resurse comune','studii, călătorii și perspectivă','carieră, statut și obiective','prieteni, proiecte și viitor','odihnă, încheieri și viață interioară'];
const LEADS = ['Ai nevoie de inițiativă, dar fără grabă.','Ziua favorizează stabilitatea și alegerile concrete.','Informațiile circulă repede; selectează ce merită atenția ta.','Emoțiile cer spațiu și claritate înainte de decizii.','Poți ieși în față prin creativitate și încredere.','Ordinea și detaliile fac diferența astăzi.','Negocierea și diplomația ajută mai mult decât forțarea.','Intensitatea zilei te invită să vezi ce trebuie schimbat.','Privește lucrurile mai larg și evită concluziile grăbite.','Prioritățile clare te ajută să-ți organizezi ziua.','Ideile noi și dialogul cu ceilalți merită explorate.','Ritmul interior contează; păstrează energie pentru ce este esențial.'];
export const normalise = value => ((value % 360) + 360) % 360;
export function bucharestDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Bucharest', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(now);
  const value = type => parts.find(p => p.type === type).value;
  return value('year')+'-'+value('month')+'-'+value('day');
}
export function localNoon(day) {
  const guess = new Date(day+'T12:00:00Z');
  const localHour = Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Bucharest',hour:'2-digit',hourCycle:'h23'}).format(guess));
  return new Date(guess.getTime() - (localHour - 12) * 3600000);
}
export function positionsAt(astronomy, date) {
  return Object.fromEntries(BODIES.map(([body])=>[body,normalise(astronomy.Ecliptic(astronomy.GeoVector(body,date,true)).elon)]));
}
export function positionLabel(longitude) {
  const minutes = Math.round(normalise(longitude)*60) % 21600;
  const index = Math.floor(minutes/1800);
  return Math.floor((minutes%1800)/60)+'° '+String(minutes%60).padStart(2,'0')+'′ '+SIGNS[index];
}
const house = (index, longitude) => (Math.floor(normalise(longitude)/30)-index+12)%12;
function planetSentence(name, h) {
  const prefixes={Moon:'Luna pune accent pe ',Mercury:'Mercur invită la claritate în ',Venus:'Venus aduce în atenție ',Mars:'Marte accentuează inițiativa în ',Jupiter:'Jupiter invită la explorarea zonei de ',Saturn:'Saturn cere răbdare și structură în '};
  return prefixes[name]+THEMES[h]+'.';
}
function aspect(point, longitude) {
  const d=Math.abs(normalise(point)-normalise(longitude));
  const angle=Math.min(d,360-d);
  const options=[{a:0,t:'intensă'},{a:60,t:'armonioasă'},{a:90,t:'provocatoare'},{a:120,t:'armonioasă'},{a:180,t:'provocatoare'}];
  const best=options.map(a=>({...a,orb:Math.abs(angle-a.a)})).sort((a,b)=>a.orb-b.orb)[0];
  return best.orb<=7?best:null;
}
function influence(index, point, pos) {
  const candidates=['Moon','Mercury','Venus','Mars','Jupiter','Saturn'].map(name=>({name,a:aspect(point,pos[name])})).filter(x=>x.a).sort((a,b)=>a.a.orb-b.a.orb);
  if(!candidates.length) return 'Urmărește tema generală a zodiei și ritmul tranzitelor prin casele solare.';
  const best=candidates[0];
  return planetSentence(best.name,house(index,pos[best.name]))+' Influența simbolică asupra acestui reper zodiacal este '+best.a.t+'.';
}
export function dailySnapshot(astronomy, now = new Date()) {
  const day=bucharestDay(now), reference=localNoon(day), positions=positionsAt(astronomy,reference);
  const moonSign=SIGNS[Math.floor(positions.Moon/30)], sunSign=SIGNS[Math.floor(positions.Sun/30)];
  const readings=SIGNS.map((sign,index)=>{
    const h=Object.fromEntries(['Moon','Mercury','Venus','Mars','Jupiter','Saturn'].map(p=>[p,house(index,positions[p])]));
    return {sign,index,slug:SLUGS[index],
      lead:LEADS[h.Moon]+' Luna este în '+moonSign+', iar Soarele în '+sunSign+'. Tema zilei: '+THEMES[h.Moon]+'.',
      love:planetSentence('Venus',h.Venus)+' '+([4,6].includes(h.Moon)?'Fă loc exprimării afective și ascultă ce spune persoana apropiată.':'Păstrează dialogul simplu și verifică presupunerile înainte de a reacționa.'),
      money:planetSentence('Jupiter',h.Jupiter)+' '+([1,7].includes(h.Saturn)?'Verifică atent cheltuielile, datoriile și angajamentele.':'Stabilește prioritățile și verifică informațiile înaintea unei cheltuieli.'),
      career:planetSentence('Mercury',h.Mercury)+' '+planetSentence('Mars',h.Mars),
      energy:planetSentence('Mars',h.Mars)+' Alternează efortul cu pauze și adaptează ritmul la resursele tale.',
      opportunity:'Oportunitatea zilei: '+THEMES[h.Jupiter]+'.',
      warning:'Atenție la: '+THEMES[h.Saturn]+'. Nu forța ceea ce cere timp sau structură.',
      influence:influence(index,index*30+15,positions),
      why:'Interpretare generală pentru zodia solară '+sign+', calculată automat din pozițiile planetare și casele solare, la reperul de la ora 12:00 în România. Pentru o analiză personală sunt necesare data, ora și localitatea nașterii.',
      decans:[5,15,25].map(degree=>influence(index,index*30+degree,positions))
    };
  });
  return {day,reference,positions,readings,
    label:new Intl.DateTimeFormat('ro-RO',{timeZone:'Europe/Bucharest',day:'numeric',month:'long',year:'numeric'}).format(reference),
    fullLabel:new Intl.DateTimeFormat('ro-RO',{timeZone:'Europe/Bucharest',dateStyle:'full'}).format(reference)};
}

export function dailyCacheSeconds(now=new Date()) {
  const day=bucharestDay(now), timestamp=now.getTime();
  if(bucharestDay(new Date(timestamp+300000))===day) return 300;
  let low=0, high=300;
  while(high-low>1){const mid=Math.floor((low+high)/2);if(bucharestDay(new Date(timestamp+mid*1000))===day)low=mid;else high=mid;}
  return low;
}
