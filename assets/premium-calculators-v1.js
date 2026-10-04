import { calculateSwissChart, calculateSwissPositions, calculateSwissBody, calculateSwissLots, calculateSwissFixedStars, calculateSwissSunEvents } from '/assets/vendor/astrovip-swiss-koch.js?v=20261004-calc-suite3';

const PROFILE_KEY='astrovip_birth_profile_v1';
const SIGNS=[['Berbec','♈'],['Taur','♉'],['Gemeni','♊'],['Rac','♋'],['Leu','♌'],['Fecioară','♍'],['Balanță','♎'],['Scorpion','♏'],['Săgetător','♐'],['Capricorn','♑'],['Vărsător','♒'],['Pești','♓']];
const MID_ASPECTS=[0,45,90,135,165,180];
const TRANSIT_ASPECTS=[0,45,90,135,165,180];
const ASPECT_NAME={0:'Conjuncție',45:'Semicareu',90:'Careu',135:'Sesquicareu',165:'Quindecile',180:'Opoziție'};
const KEY_HIGHLIGHTS=new Set(['Jupiter|Pluto','Neptune|Pluto','Sun|Moon','Uranus|Pluto','ASC|MC']);
const norm=x=>((Number(x)%360)+360)%360;
const delta=(a,b)=>((Number(b)-Number(a)+540)%360)-180;
const midpoint=(a,b)=>norm(Number(a)+delta(a,b)/2);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fmt(lon){
  lon=norm(lon);let si=Math.floor(lon/30),w=lon-si*30,d=Math.floor(w),m=Math.round((w-d)*60);
  if(m===60){m=0;d++;if(d===30){d=0;si=(si+1)%12}}
  return {sign:SIGNS[si][0],sym:SIGNS[si][1],deg:d,min:m,text:`${d}°${String(m).padStart(2,'0')}′ ${SIGNS[si][1]} ${SIGNS[si][0]}`};
}
function savedProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'null')}catch{return null}}
function offsets(selected='+02:00'){
  const vals=['-12:00','-11:00','-10:00','-09:00','-08:00','-07:00','-06:00','-05:00','-04:00','-03:00','-02:00','-01:00','+00:00','+01:00','+02:00','+03:00','+04:00','+05:00','+05:30','+06:00','+07:00','+08:00','+09:00','+10:00','+11:00','+12:00','+13:00','+14:00'];
  return vals.map(v=>`<option value="${v}"${v===selected?' selected':''}>UTC ${v}</option>`).join('');
}
function profileFields(prefix,title){
  return `<div class="avc-card"><h3>${title}</h3><div class="avc-form-grid">
    <div class="avc-field"><label for="${prefix}-date">Data nașterii</label><input id="${prefix}-date" type="date" required></div>
    <div class="avc-field"><label for="${prefix}-time">Ora nașterii</label><input id="${prefix}-time" type="time" step="60" required></div>
    <div class="avc-field"><label for="${prefix}-offset">Fus orar</label><select id="${prefix}-offset">${offsets()}</select></div>
    <div class="avc-field"><label for="${prefix}-place">Localitate</label><input id="${prefix}-place" placeholder="București, România"></div>
    <div class="avc-field"><label for="${prefix}-lat">Latitudine</label><input id="${prefix}-lat" type="number" min="-90" max="90" step="0.000001" placeholder="44.4268" required></div>
    <div class="avc-field"><label for="${prefix}-lon">Longitudine</label><input id="${prefix}-lon" type="number" min="-180" max="180" step="0.000001" placeholder="26.1025" required></div>
  </div></div>`;
}
function fill(prefix,p){
  if(!p)return;
  const vals={date:p.date,time:p.time,offset:p.offset,place:p.place,lat:p.lat,lon:p.lon};
  for(const [k,v] of Object.entries(vals)){const el=document.getElementById(`${prefix}-${k}`);if(el&&v!==undefined&&v!==null&&v!=='')el.value=v}
}
function profile(prefix){
  const date=document.getElementById(`${prefix}-date`)?.value;
  const time=document.getElementById(`${prefix}-time`)?.value;
  const offset=document.getElementById(`${prefix}-offset`)?.value||'+02:00';
  const place=document.getElementById(`${prefix}-place`)?.value.trim()||'Locație';
  const lat=Number(document.getElementById(`${prefix}-lat`)?.value);
  const lon=Number(document.getElementById(`${prefix}-lon`)?.value);
  if(!date||!time)throw new Error('Completează data și ora.');
  if(!Number.isFinite(lat)||lat<-90||lat>90||!Number.isFinite(lon)||lon<-180||lon>180)throw new Error('Coordonatele geografice nu sunt valide.');
  const instant=new Date(`${date}T${time}:00${offset}`);
  if(Number.isNaN(instant.getTime()))throw new Error('Data introdusă nu este validă.');
  return {date,time,offset,place,lat,lon,instant};
}
function factors(chart){
  return [
    ...chart.planets.map(p=>({key:p.key,label:p.label,glyph:p.glyph,lon:p.longitude,retrograde:p.retrograde})),
    {key:'ASC',label:'Ascendent',glyph:'ASC',lon:chart.axes.asc},
    {key:'MC',label:'Medium Coeli',glyph:'MC',lon:chart.axes.mc}
  ];
}
function cards(items){
  return `<div class="avc-cards">${items.map(p=>`<div class="avc-pos"><b>${esc(p.label)}</b><strong>${esc(p.glyph||'')}</strong><span>${fmt(p.lon).text}</span>${p.retrograde?'<span>Retrograd ℞</span>':''}</div>`).join('')}</div>`;
}
function houseTable(cusps){
  return `<div class="avc-table-wrap" style="margin-top:14px"><table class="avc-table"><thead><tr><th>Casă Koch</th><th>Cuspida</th></tr></thead><tbody>${cusps.map((x,i)=>`<tr><td>Casa ${i+1}</td><td>${fmt(x).text}</td></tr>`).join('')}</tbody></table></div>`;
}
function placeSection(el){
  const main=document.querySelector('main')||document.body;
  const hero=main.querySelector('section');
  if(hero&&hero.parentNode===main)hero.insertAdjacentElement('afterend',el); else main.prepend(el);
}
function shell(id,kicker,title,lead,body){
  const s=document.createElement('section');s.className='avc-shell';s.id=id;
  s.innerHTML=`<div class="avc-tool"><div class="avc-head"><div class="avc-kicker">${kicker}</div><h2>${title}</h2><p>${lead}</p></div><div class="avc-body">${body}</div></div>`;
  return s;
}
function setStatus(id,msg,strong=false){const el=document.getElementById(id);if(el)el.innerHTML=strong?`<strong>${esc(msg)}</strong>`:esc(msg)}
function midpointGeo(a,b){
  const r=Math.PI/180,lat1=a.lat*r,lat2=b.lat*r,lon1=a.lon*r,dl=(b.lon-a.lon)*r;
  const bx=Math.cos(lat2)*Math.cos(dl),by=Math.cos(lat2)*Math.sin(dl);
  const lat=Math.atan2(Math.sin(lat1)+Math.sin(lat2),Math.sqrt((Math.cos(lat1)+bx)**2+by**2));
  let lon=lon1+Math.atan2(by,Math.cos(lat1)+bx);lon=((lon+3*Math.PI)%(2*Math.PI))-Math.PI;
  return {lat:lat/r,lon:lon/r};
}
function relationTool(mode){
  const isComposite=mode==='composite';
  const title=isComposite?'Calculator Hartă Compozită':'Calculator Hartă Davison';
  const lead=isComposite?'Calculează mijloacele planetare, ASC, MC și cuspidele Koch dintre două hărți natale. Persoana A poate fi preluată automat din Harta mea.':'Calculează momentul și punctul geografic mijlociu dintre două nașteri, apoi generează harta Davison reală cu poziții Swiss Ephemeris și case Koch.';
  const el=shell('calculator-relatie','AstroVip · relații · Swiss Ephemeris',title,lead,`<form id="avc-rel-form"><div class="avc-grid">${profileFields('avc-a','Persoana A')}${profileFields('avc-b','Persoana B')}</div><div class="avc-actions"><button class="avc-btn" type="submit">CALCULEAZĂ ${isComposite?'COMPOZITA':'DAVISON'}</button><button class="avc-btn secondary" type="button" id="avc-fill-a">Folosește profilul meu</button></div><p class="avc-status" id="avc-rel-status">Calculul rulează local în browser; datele nu sunt trimise în formularul de contact.</p></form><div class="avc-result" id="avc-rel-result" hidden></div>`);
  placeSection(el);fill('avc-a',savedProfile());
  document.getElementById('avc-fill-a').onclick=()=>fill('avc-a',savedProfile());
  document.getElementById('avc-rel-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-rel-result');
    try{
      setStatus('avc-rel-status','Se calculează cu Swiss Ephemeris…',true);
      const a=profile('avc-a'),b=profile('avc-b');
      if(isComposite){
        const [ca,cb]=await Promise.all([calculateSwissChart(a.instant,a.lat,a.lon),calculateSwissChart(b.instant,b.lat,b.lon)]);
        const fa=factors(ca),fb=factors(cb);
        const comp=fa.map((x,i)=>({...x,lon:midpoint(x.lon,fb[i].lon),retrograde:false}));
        const cusps=ca.cusps.map((x,i)=>midpoint(x,cb.cusps[i]));
        out.innerHTML=`<p class="avc-meta"><strong>Compozită:</strong> mijlocul pe arcul scurt pentru fiecare factor. Case: midpoint cuspă-la-cuspă Koch.</p>${cards(comp)}${houseTable(cusps)}<p class="avc-note">Harta compozită descrie relația ca entitate simbolică; nu înlocuiește sinastria celor două hărți natale.</p>`;
      }else{
        const when=new Date((a.instant.getTime()+b.instant.getTime())/2),geo=midpointGeo(a,b);
        const c=await calculateSwissChart(when,geo.lat,geo.lon);
        out.innerHTML=`<p class="avc-meta"><strong>Moment Davison:</strong> ${when.toISOString().replace('T',' ').slice(0,19)} UTC · <strong>punct geografic:</strong> ${geo.lat.toFixed(4)}°, ${geo.lon.toFixed(4)}°.</p>${cards(factors(c))}${houseTable(c.cusps)}<p class="avc-note">Davison folosește un moment și un loc real, obținute ca mijloc temporal și geografic al celor două nașteri.</p>`;
      }
      out.hidden=false;setStatus('avc-rel-status','Calcul finalizat · Swiss Ephemeris · Koch',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-rel-status',err.message||'Calculul nu a putut fi realizat.')}
  });
}
function midpointTool(){
  const el=shell('calculator-puncte-mijlocii','AstroVip · 66 midpoint-uri · 792 verificări','Calculator Puncte Mijlocii','Calculează automat cele 66 de puncte mijlocii formate din 10 planete + ASC + MC și verifică 792 de contacte midpoint–factor pe aspectele AstroVip 0° / 45° / 90° / 135° / 165° / 180°.',`<form id="avc-mid-form">${profileFields('avc-m','Harta natală')}<div class="avc-filter" style="margin-top:16px"><div class="avc-field"><label for="avc-mid-orb">Orb contacte</label><select id="avc-mid-orb"><option value="0.5">0°30′</option><option value="1" selected>1°00′</option><option value="2">2°00′</option></select></div></div><div class="avc-actions"><button class="avc-btn" type="submit">CALCULEAZĂ 66 MIDPOINT-URI</button><button class="avc-btn secondary" type="button" id="avc-fill-m">Folosește profilul meu</button></div><p class="avc-status" id="avc-mid-status">Include automat combinațiile UR/PL, JU/PL, NE/PL, SO/LU și ASC/MC.</p></form><div class="avc-result" id="avc-mid-result" hidden></div>`);
  placeSection(el);fill('avc-m',savedProfile());document.getElementById('avc-fill-m').onclick=()=>fill('avc-m',savedProfile());
  document.getElementById('avc-mid-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-mid-result');
    try{
      setStatus('avc-mid-status','Se calculează midpoint-urile…',true);
      const p=profile('avc-m'),c=await calculateSwissChart(p.instant,p.lat,p.lon),fs=factors(c),mids=[];
      for(let i=0;i<fs.length;i++)for(let j=i+1;j<fs.length;j++){const a=fs[i],b=fs[j],key=[a.key,b.key].sort().join('|');mids.push({a,b,key,lon:midpoint(a.lon,b.lon),priority:KEY_HIGHLIGHTS.has(key)})}
      mids.sort((x,y)=>Number(y.priority)-Number(x.priority)||x.lon-y.lon);
      const orbMax=Number(document.getElementById('avc-mid-orb').value),contacts=[];
      for(const m of mids)for(const f of fs){const sep=Math.abs(delta(m.lon,f.lon));let best=null;for(const a of MID_ASPECTS){const orb=Math.abs(sep-a);if(!best||orb<best.orb)best={a,orb}}if(best.orb<=orbMax)contacts.push({m,f,...best})}
      contacts.sort((x,y)=>x.orb-y.orb);
      const midRows=mids.map(m=>`<tr><td>${m.priority?'<span class="avc-badge">PRIORITAR</span> ':''}${esc(m.a.glyph)} ${esc(m.a.label)} / ${esc(m.b.glyph)} ${esc(m.b.label)}</td><td>${fmt(m.lon).text}</td></tr>`).join('');
      const conRows=contacts.map(x=>`<tr><td>${esc(x.m.a.glyph)}${esc(x.m.b.glyph)} midpoint</td><td>${ASPECT_NAME[x.a]||x.a+'°'}</td><td>${esc(x.f.glyph)} ${esc(x.f.label)}</td><td>${x.orb.toFixed(3)}°</td></tr>`).join('');
      out.innerHTML=`<p class="avc-meta"><strong>66 midpoint-uri</strong> calculate · <strong>792 verificări</strong> efectuate · ${contacts.length} contacte în orb ≤ ${orbMax.toFixed(1)}°.</p><h3 style="color:#f0cf68">Cele 66 de puncte mijlocii</h3><div class="avc-table-wrap"><table class="avc-table"><thead><tr><th>Midpoint</th><th>Poziție</th></tr></thead><tbody>${midRows}</tbody></table></div><h3 style="color:#f0cf68;margin-top:22px">Contacte midpoint–factor</h3><div class="avc-table-wrap"><table class="avc-table"><thead><tr><th>Midpoint</th><th>Aspect</th><th>Factor natal</th><th>Orb</th></tr></thead><tbody>${conRows||'<tr><td colspan="4">Niciun contact în orbul ales.</td></tr>'}</tbody></table></div>`;
      out.hidden=false;setStatus('avc-mid-status','Calcul finalizat · 66 midpoint-uri · 792 verificări',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-mid-status',err.message||'Calculul nu a putut fi realizat.')}
  });
}
async function moonAt(date){return calculateSwissBody(date,'Moon')}
async function nextLunarReturn(natalLon,start,onProgress){
  const step=6*3600000,end=start.getTime()+33*86400000;let t0=start.getTime(),p0=await moonAt(new Date(t0)),d0=delta(natalLon,p0.longitude);
  if(Math.abs(d0)<.02)return new Date(t0);
  for(let t=t0+step;t<=end;t+=step){
    const p=await moonAt(new Date(t)),d=delta(natalLon,p.longitude);
    if(onProgress)onProgress(Math.min(1,(t-t0)/(end-t0)));
    if(d0<0&&d>=0&&Math.abs(d-d0)<90){
      let lo=t-step,hi=t;
      for(let i=0;i<22;i++){const mid=(lo+hi)/2,pm=await moonAt(new Date(mid)),dm=delta(natalLon,pm.longitude);if(dm>=0)hi=mid;else lo=mid}
      return new Date((lo+hi)/2);
    }
    t0=t;d0=d;
  }
  throw new Error('Nu am găsit următoarea revenire lunară în fereastra de 33 de zile.');
}
function lunarReturnTool(){
  const today=new Date().toISOString().slice(0,10);
  const el=shell('calculator-revolutie-lunara','AstroVip · Lunar Return · Swiss Ephemeris','Calculator Revoluție Lunară','Alege data de la care vrei să cauți următoarea revenire exactă a Lunii la longitudinea natală. Calculatorul găsește momentul prin rafinare iterativă și generează harta cu case Koch pentru locația introdusă.',`<form id="avc-lr-form">${profileFields('avc-lr','Date natale + locația revoluției')}<div class="avc-form-grid" style="margin-top:14px"><div class="avc-field"><label for="avc-lr-start">Caută următoarea revenire după</label><input id="avc-lr-start" type="date" value="${today}" required></div></div><div class="avc-actions"><button class="avc-btn" type="submit">CALCULEAZĂ REVOLUȚIA LUNARĂ</button><button class="avc-btn secondary" type="button" id="avc-fill-lr">Folosește profilul meu</button></div><p class="avc-status" id="avc-lr-status">Căutare pe maximum 33 de zile, apoi rafinare a momentului exact.</p><div class="avc-progress"><i id="avc-lr-progress"></i></div></form><div class="avc-result" id="avc-lr-result" hidden></div>`);
  placeSection(el);fill('avc-lr',savedProfile());document.getElementById('avc-fill-lr').onclick=()=>fill('avc-lr',savedProfile());
  document.getElementById('avc-lr-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-lr-result'),bar=document.getElementById('avc-lr-progress');
    try{
      setStatus('avc-lr-status','Caut momentul exact al revenirii Lunii…',true);bar.style.width='2%';
      const p=profile('avc-lr'),natal=await moonAt(p.instant),start=new Date(document.getElementById('avc-lr-start').value+'T00:00:00Z');
      const when=await nextLunarReturn(natal.longitude,start,x=>bar.style.width=(5+x*85).toFixed(0)+'%');
      const c=await calculateSwissChart(when,p.lat,p.lon);bar.style.width='100%';
      const moon=c.planets.find(x=>x.key==='Moon');
      out.innerHTML=`<p class="avc-meta"><strong>Revoluție Lunară:</strong> ${when.toISOString().replace('T',' ').slice(0,19)} UTC · Lună ${fmt(moon.longitude).text} · longitudine natală ${fmt(natal.longitude).text}.</p>${cards(factors(c))}${houseTable(c.cusps)}<p class="avc-note">Ora afișată este UTC; casele Koch sunt calculate pentru coordonatele introduse la locația revoluției.</p>`;
      out.hidden=false;setStatus('avc-lr-status','Revoluția lunară a fost calculată',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-lr-status',err.message||'Calculul nu a putut fi realizat.')}
  });
}
function groupTransitHits(rows){
  const groups=[];for(const arr of rows.values()){arr.sort((a,b)=>a.date-b.date);let g=[];for(const x of arr){if(!g.length||x.date-g[g.length-1].date<=36*3600000)g.push(x);else{groups.push(g);g=[x]}}if(g.length)groups.push(g)}
  return groups.map(g=>g.reduce((a,b)=>a.orb<=b.orb?a:b)).sort((a,b)=>a.date-b.date);
}
function transitCalendarTool(){
  const today=new Date().toISOString().slice(0,10);
  const el=shell('calendar-tranzite','AstroVip · calendar personal · 12 luni','Calendar personal de tranzite','Scanează până la 12 luni și identifică ferestrele în care planetele în tranzit ating planetele natale, ASC sau MC pe aspectele AstroVip. Evenimentele consecutive sunt grupate și este păstrată ziua cu orbul minim.',`<form id="avc-tr-form">${profileFields('avc-tr','Harta natală')}<div class="avc-form-grid" style="margin-top:14px"><div class="avc-field"><label for="avc-tr-start">Începe de la</label><input id="avc-tr-start" type="date" value="${today}" required></div><div class="avc-field"><label for="avc-tr-months">Perioadă</label><select id="avc-tr-months"><option value="3">3 luni</option><option value="6">6 luni</option><option value="12" selected>12 luni</option></select></div><div class="avc-field"><label for="avc-tr-orb">Orb maxim</label><select id="avc-tr-orb"><option value="0.5">0°30′</option><option value="1">1°</option><option value="2">2°</option><option value="3" selected>3°</option></select></div></div><div class="avc-actions"><button class="avc-btn" type="submit">GENEREAZĂ CALENDARUL</button><button class="avc-btn secondary" type="button" id="avc-fill-tr">Folosește profilul meu</button></div><p class="avc-status" id="avc-tr-status">Tranzite implicite: Soare, Mercur, Venus, Marte, Jupiter, Saturn, Uranus, Neptun, Pluto. Luna este exclusă din scanarea zilnică.</p><div class="avc-progress"><i id="avc-tr-progress"></i></div></form><div class="avc-result" id="avc-tr-result" hidden></div>`);
  placeSection(el);fill('avc-tr',savedProfile());document.getElementById('avc-fill-tr').onclick=()=>fill('avc-tr',savedProfile());
  document.getElementById('avc-tr-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-tr-result'),bar=document.getElementById('avc-tr-progress');
    try{
      const p=profile('avc-tr'),natal=await calculateSwissChart(p.instant,p.lat,p.lon),nf=factors(natal);
      const start=new Date(document.getElementById('avc-tr-start').value+'T12:00:00Z'),months=Number(document.getElementById('avc-tr-months').value),orbMax=Number(document.getElementById('avc-tr-orb').value),end=new Date(start);end.setUTCMonth(end.getUTCMonth()+months);
      const days=Math.max(1,Math.ceil((end-start)/86400000)),hits=new Map(),skip=new Set(['Moon']);
      setStatus('avc-tr-status',`Scanez ${days} zile cu Swiss Ephemeris…`,true);bar.style.width='1%';
      for(let i=0;i<=days;i++){
        const date=new Date(start.getTime()+i*86400000),tp=await calculateSwissPositions(date);
        for(const t of tp.planets){if(skip.has(t.key))continue;for(const n of nf){const sep=Math.abs(delta(t.longitude,n.lon));for(const a of TRANSIT_ASPECTS){const orb=Math.abs(sep-a);if(orb<=orbMax){const key=`${t.key}|${n.key}|${a}`;if(!hits.has(key))hits.set(key,[]);hits.get(key).push({date,t,n,a,orb});break}}}}
        if(i%7===0){bar.style.width=Math.min(98,Math.round(i/days*98))+'%';setStatus('avc-tr-status',`Scanare: ${Math.min(i,days)} / ${days} zile…`,true);await new Promise(r=>setTimeout(r,0))}
      }
      const events=groupTransitHits(hits);bar.style.width='100%';
      const rows=events.map(x=>`<tr><td>${x.date.toISOString().slice(0,10)}</td><td>${esc(x.t.glyph)} ${esc(x.t.label)}</td><td>${ASPECT_NAME[x.a]||x.a+'°'}</td><td>${esc(x.n.glyph)} ${esc(x.n.label)}</td><td>${x.orb.toFixed(3)}°</td></tr>`).join('');
      out.innerHTML=`<p class="avc-meta"><strong>${events.length} ferestre de tranzit</strong> în următoarele ${months} luni · orb maxim ${orbMax.toFixed(1)}° · aspecte 0°/45°/90°/135°/165°/180°.</p><div class="avc-table-wrap"><table class="avc-table"><thead><tr><th>Data minimului</th><th>Tranzit</th><th>Aspect</th><th>Natal</th><th>Orb</th></tr></thead><tbody>${rows||'<tr><td colspan="5">Niciun contact în criteriile selectate.</td></tr>'}</tbody></table></div><p class="avc-note">Calendarul păstrează ziua cu orbul minim din fiecare fereastră. Pentru timing intraday, verifică separat tranzitul selectat.</p>`;
      out.hidden=false;setStatus('avc-tr-status','Calendar generat',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-tr-status',err.message||'Calendarul nu a putut fi generat.')}
  });
}

function lotsTool(){
  const el=shell('calculator-lots','AstroVip · Lots arabe · sectă diurnă/nocturnă','Calculator Pars Fortunae & 16 Lots Arabe','Calculează automat secta hărții și cele 16 Lots arabe, inclusiv Fortune, Spirit, Eros, Necessity, Courage, Victory, Nemesis și loturile tradiționale suplimentare. Formulele sunt aplicate în funcție de hartă diurnă sau nocturnă.',`<form id="avc-lots-form">${profileFields('avc-lots','Harta natală')}<div class="avc-actions"><button class="avc-btn" type="submit">CALCULEAZĂ LOTURILE</button><button class="avc-btn secondary" type="button" id="avc-fill-lots">Folosește profilul meu</button></div><p class="avc-status" id="avc-lots-status">Sectă determinată astronomic după poziția Soarelui față de orizont.</p></form><div class="avc-result" id="avc-lots-result" hidden></div>`);
  placeSection(el);fill('avc-lots',savedProfile());document.getElementById('avc-fill-lots').onclick=()=>fill('avc-lots',savedProfile());
  document.getElementById('avc-lots-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-lots-result');
    try{
      setStatus('avc-lots-status','Calculez secta și Lots arabe…',true);
      const p=profile('avc-lots'),r=await calculateSwissLots(p.instant,p.lat,p.lon);
      const vals=Object.values(r.lots);
      const rows=vals.map(x=>`<tr><td><strong>${esc(x.name)}</strong></td><td>${fmt(x.longitude).text}</td><td>${esc(x.sectUsed)}</td><td>${esc(x.source||'')}</td></tr>`).join('');
      out.innerHTML=`<p class="avc-meta"><strong>Sectă:</strong> ${r.sect.sect==='day'?'diurnă':'nocturnă'} · Soare la ${Number(r.sect.sunElevation).toFixed(2)}° față de orizont · ${vals.length} Lots calculate.</p><div class="avc-table-wrap"><table class="avc-table"><thead><tr><th>Lot</th><th>Poziție</th><th>Sectă</th><th>Sursă tradițională</th></tr></thead><tbody>${rows}</tbody></table></div><p class="avc-note">Fortune și Spirit își inversează formula în hărțile nocturne. Calculatorul nu presupune automat că toate hărțile sunt diurne.</p>`;
      out.hidden=false;setStatus('avc-lots-status','Calcul finalizat · sectă + 16 Lots',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-lots-status',err.message||'Calculul nu a putut fi realizat.')}
  });
}
function fixedStarsTool(){
  const el=shell('calculator-stele-fixe','AstroVip · sefstars.txt · precesie reală','Calculator Stele Fixe','Compară planetele natale, ASC și MC cu stelele fixe calculate pentru data nașterii din catalogul Swiss Ephemeris. Poți selecta Stelele Regale, cele 15 Beheniene sau setul de stele notabile.',`<form id="avc-stars-form">${profileFields('avc-stars','Harta natală')}<div class="avc-form-grid" style="margin-top:14px"><div class="avc-field"><label for="avc-stars-group">Catalog</label><select id="avc-stars-group"><option value="royal">4 Stele Regale</option><option value="behenian">15 Stele Beheniene</option><option value="notable">Stele notabile</option></select></div><div class="avc-field"><label for="avc-stars-orb">Orb conjuncție</label><select id="avc-stars-orb"><option value="0.5">0°30′</option><option value="1" selected>1°00′</option><option value="2">2°00′</option><option value="3">3°00′</option></select></div></div><div class="avc-actions"><button class="avc-btn" type="submit">CALCULEAZĂ STELELE FIXE</button><button class="avc-btn secondary" type="button" id="avc-fill-stars">Folosește profilul meu</button></div><p class="avc-status" id="avc-stars-status">Pozițiile stelelor sunt calculate pentru data nașterii; nu folosim grade fixe memorate.</p></form><div class="avc-result" id="avc-stars-result" hidden></div>`);
  placeSection(el);fill('avc-stars',savedProfile());document.getElementById('avc-fill-stars').onclick=()=>fill('avc-stars',savedProfile());
  document.getElementById('avc-stars-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-stars-result');
    try{
      setStatus('avc-stars-status','Încarc catalogul Swiss și calculez precesia…',true);
      const p=profile('avc-stars'),group=document.getElementById('avc-stars-group').value,orbMax=Number(document.getElementById('avc-stars-orb').value);
      const [chart,starData]=await Promise.all([calculateSwissChart(p.instant,p.lat,p.lon),calculateSwissFixedStars(p.instant,group)]);
      const fs=factors(chart),hits=[];
      for(const star of starData.stars)for(const f of fs){const orb=Math.abs(delta(star.longitude,f.lon));if(orb<=orbMax)hits.push({star,f,orb})}
      hits.sort((a,b)=>a.orb-b.orb);
      const starRows=starData.stars.map(x=>`<tr><td><strong>${esc(x.name)}</strong></td><td>${esc(x.designation)}</td><td>${fmt(x.longitude).text}</td><td>${Number(x.magnitude).toFixed(2)}</td></tr>`).join('');
      const hitRows=hits.map(x=>`<tr><td>${esc(x.star.name)}</td><td>☌</td><td>${esc(x.f.glyph)} ${esc(x.f.label)}</td><td>${x.orb.toFixed(3)}°</td></tr>`).join('');
      out.innerHTML=`<p class="avc-meta"><strong>${starData.stars.length} stele</strong> calculate la data natală · ${hits.length} conjuncții în orb ≤ ${orbMax.toFixed(1)}°.</p><h3 style="color:#f0cf68">Pozițiile stelelor</h3><div class="avc-table-wrap"><table class="avc-table"><thead><tr><th>Stea</th><th>Designație</th><th>Poziție tropicală</th><th>Magnitudine</th></tr></thead><tbody>${starRows}</tbody></table></div><h3 style="color:#f0cf68;margin-top:22px">Conjuncții cu harta natală</h3><div class="avc-table-wrap"><table class="avc-table"><thead><tr><th>Stea</th><th>Aspect</th><th>Factor natal</th><th>Orb</th></tr></thead><tbody>${hitRows||'<tr><td colspan="4">Nicio conjuncție în orbul ales.</td></tr>'}</tbody></table></div>`;
      out.hidden=false;setStatus('avc-stars-status','Calcul finalizat · catalog Swiss',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-stars-status',err.message||'Calculul stelelor fixe nu a putut fi realizat.')}
  });
}
async function saturnExact(natalLon,lo,hi){
  let dlo=delta(natalLon,(await calculateSwissBody(new Date(lo),'Saturn')).longitude);
  for(let i=0;i<34;i++){
    const mid=(lo+hi)/2,dm=delta(natalLon,(await calculateSwissBody(new Date(mid),'Saturn')).longitude);
    if(Math.abs(dm)<1e-7)return new Date(mid);
    if((dlo<=0&&dm>=0)||(dlo>=0&&dm<=0)){hi=mid}else{lo=mid;dlo=dm}
  }
  return new Date((lo+hi)/2);
}
async function saturnReturns(natalDate,natalLon,minAge,maxAge,onProgress){
  const start=natalDate.getTime()+minAge*365.2425*86400000,end=natalDate.getTime()+maxAge*365.2425*86400000,step=3*86400000,roots=[];
  let t0=start,p0=await calculateSwissBody(new Date(t0),'Saturn'),d0=delta(natalLon,p0.longitude),n=0,total=Math.ceil((end-start)/step);
  for(let t=t0+step;t<=end;t+=step){
    const p=await calculateSwissBody(new Date(t),'Saturn'),d=delta(natalLon,p.longitude);
    if(d0*d<=0&&Math.abs(d-d0)<15){
      const root=await saturnExact(natalLon,t-step,t);
      if(!roots.some(x=>Math.abs(x-root)<5*86400000))roots.push(root);
    }
    t0=t;d0=d;n++;if(onProgress&&n%20===0)onProgress(n/total);
  }
  return roots;
}
function saturnReturnTool(){
  const el=shell('calculator-saturn-return','AstroVip · Saturn Return · exactitate','Calculator Revenirea lui Saturn','Găsește toate trecerile exacte ale lui Saturn peste poziția natală, inclusiv repetările produse de retrogradare. Sunt analizate prima, a doua și a treia revenire, acolo unde intervalul cronologic este disponibil.',`<form id="avc-sat-form">${profileFields('avc-sat','Harta natală')}<div class="avc-actions"><button class="avc-btn" type="submit">CALCULEAZĂ SATURN RETURN</button><button class="avc-btn secondary" type="button" id="avc-fill-sat">Folosește profilul meu</button></div><p class="avc-status" id="avc-sat-status">Fiecare fereastră este scanată și apoi momentul exact este rafinat iterativ.</p><div class="avc-progress"><i id="avc-sat-progress"></i></div></form><div class="avc-result" id="avc-sat-result" hidden></div>`);
  placeSection(el);fill('avc-sat',savedProfile());document.getElementById('avc-fill-sat').onclick=()=>fill('avc-sat',savedProfile());
  document.getElementById('avc-sat-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-sat-result'),bar=document.getElementById('avc-sat-progress');
    try{
      const p=profile('avc-sat'),natal=await calculateSwissBody(p.instant,'Saturn'),sets=[[27,32,'Prima revenire'],[56,61,'A doua revenire'],[85,91,'A treia revenire']],all=[];
      setStatus('avc-sat-status','Caut trecerile exacte ale lui Saturn…',true);bar.style.width='2%';
      for(let i=0;i<sets.length;i++){const [a,b,label]=sets[i],roots=await saturnReturns(p.instant,natal.longitude,a,b,x=>bar.style.width=Math.round((i+x)/sets.length*95)+'%');for(const r of roots){const sat=await calculateSwissBody(r,'Saturn');all.push({label,date:r,retro:sat.retrograde,lon:sat.longitude})}}
      bar.style.width='100%';
      const rows=all.map(x=>`<tr><td>${esc(x.label)}</td><td>${x.date.toISOString().replace('T',' ').slice(0,19)} UTC</td><td>${fmt(x.lon).text}</td><td>${x.retro?'Retrograd ℞':'Direct'}</td></tr>`).join('');
      out.innerHTML=`<p class="avc-meta"><strong>Saturn natal:</strong> ${fmt(natal.longitude).text} · ${all.length} contacte exacte identificate în ferestrele de revenire.</p><div class="avc-table-wrap"><table class="avc-table"><thead><tr><th>Ciclu</th><th>Moment exact</th><th>Saturn</th><th>Mișcare</th></tr></thead><tbody>${rows||'<tr><td colspan="4">Nu au fost găsite reveniri în intervalele standard.</td></tr>'}</tbody></table></div><p class="avc-note">O revenire poate avea una sau trei treceri exacte, în funcție de ciclul de retrogradare al lui Saturn.</p>`;
      out.hidden=false;setStatus('avc-sat-status','Calcul finalizat · Saturn Return',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-sat-status',err.message||'Calculul revenirii lui Saturn nu a putut fi realizat.')}
  });
}
async function stationaryMoment(key,lo,hi){
  let slo=(await calculateSwissBody(new Date(lo),key)).longitudeSpeed;
  for(let i=0;i<30;i++){
    const mid=(lo+hi)/2,sm=(await calculateSwissBody(new Date(mid),key)).longitudeSpeed;
    if(Math.abs(sm)<1e-8)return new Date(mid);
    if(slo*sm<=0)hi=mid;else{lo=mid;slo=sm}
  }
  return new Date((lo+hi)/2);
}
function retrogradeCalendarTool(){
  const year=new Date().getFullYear();
  const el=shell('calculator-retrogradari','AstroVip · stații planetare · Swiss Ephemeris','Calendar Retrogradări Planetare','Generează pentru un an momentele în care Mercur, Venus, Marte, Jupiter, Saturn, Uranus, Neptun și Pluto intră în retrogradare sau revin în mers direct. Stațiile sunt rafinate până la schimbarea semnului vitezei longitudinale.',`<form id="avc-ret-form"><div class="avc-card"><h3>Anul analizat</h3><div class="avc-form-grid"><div class="avc-field"><label for="avc-ret-year">An</label><input id="avc-ret-year" type="number" min="1801" max="2398" value="${year}" required></div></div></div><div class="avc-actions"><button class="avc-btn" type="submit">GENEREAZĂ RETROGRADĂRILE</button></div><p class="avc-status" id="avc-ret-status">Se caută schimbarea vitezei longitudinale de la + la − și de la − la +.</p><div class="avc-progress"><i id="avc-ret-progress"></i></div></form><div class="avc-result" id="avc-ret-result" hidden></div>`);
  placeSection(el);
  document.getElementById('avc-ret-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-ret-result'),bar=document.getElementById('avc-ret-progress');
    try{
      const y=Number(document.getElementById('avc-ret-year').value);if(y<1801||y>2398)throw new Error('Alege un an între 1801 și 2398.');
      const start=Date.UTC(y,0,1,12),end=Date.UTC(y+1,0,1,12),days=Math.round((end-start)/86400000),keys=new Set(['Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto']),events=[],prev=new Map();
      setStatus('avc-ret-status',`Scanez anul ${y}…`,true);bar.style.width='1%';
      for(let i=0;i<=days;i++){
        const t=start+i*86400000,ps=await calculateSwissPositions(new Date(t));
        for(const p of ps.planets){if(!keys.has(p.key))continue;const old=prev.get(p.key);if(old&&old.speed*p.longitudeSpeed<0){const when=await stationaryMoment(p.key,old.t,t),exact=await calculateSwissBody(when,p.key);events.push({key:p.key,label:p.label,glyph:p.glyph,date:when,type:old.speed>0?'Retrograd':'Direct',lon:exact.longitude})}prev.set(p.key,{t,speed:p.longitudeSpeed})}
        if(i%10===0){bar.style.width=Math.round(i/days*98)+'%';await new Promise(r=>setTimeout(r,0))}
      }
      events.sort((a,b)=>a.date-b.date);bar.style.width='100%';
      const rows=events.map(x=>`<tr><td>${x.date.toISOString().replace('T',' ').slice(0,19)} UTC</td><td>${esc(x.glyph)} ${esc(x.label)}</td><td><span class="avc-badge">${esc(x.type)}</span></td><td>${fmt(x.lon).text}</td></tr>`).join('');
      out.innerHTML=`<p class="avc-meta"><strong>${events.length} stații planetare</strong> identificate pentru ${y}.</p><div class="avc-table-wrap"><table class="avc-table"><thead><tr><th>Moment</th><th>Planetă</th><th>Stație</th><th>Poziție</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      out.hidden=false;setStatus('avc-ret-status','Calendarul retrogradărilor este gata',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-ret-status',err.message||'Calendarul nu a putut fi generat.')}
  });
}


function birthMoment(prefix){
  const date=document.getElementById(`${prefix}-date`)?.value;
  const time=document.getElementById(`${prefix}-time`)?.value;
  const offset=document.getElementById(`${prefix}-offset`)?.value||'+02:00';
  if(!date||!time)throw new Error('Completează data și ora.');
  const instant=new Date(`${date}T${time}:00${offset}`);
  if(Number.isNaN(instant.getTime()))throw new Error('Data introdusă nu este validă.');
  return {date,time,offset,instant};
}
function momentFields(prefix,title){
  return `<div class="avc-card"><h3>${title}</h3><div class="avc-form-grid">
    <div class="avc-field"><label for="${prefix}-date">Data nașterii</label><input id="${prefix}-date" type="date" required></div>
    <div class="avc-field"><label for="${prefix}-time">Ora nașterii</label><input id="${prefix}-time" type="time" step="60" required></div>
    <div class="avc-field"><label for="${prefix}-offset">Fus orar</label><select id="${prefix}-offset">${offsets()}</select></div>
  </div></div>`;
}
function houseForLon(lon,cusps){
  for(let i=0;i<12;i++){
    const start=norm(cusps[i]),end=norm(cusps[(i+1)%12]),span=norm(end-start),off=norm(lon-start);
    if(off<span||Math.abs(off-span)<1e-9)return i+1;
  }
  return null;
}
function offsetMinutes(v){
  const m=String(v||'+00:00').match(/^([+-])(\d{2}):(\d{2})$/);
  if(!m)return 0;
  return (m[1]==='-'?-1:1)*(Number(m[2])*60+Number(m[3]));
}
function localDateTime(date,offset){
  const d=new Date(date.getTime()+offsetMinutes(offset)*60000);
  return `${String(d.getUTCDate()).padStart(2,'0')}.${String(d.getUTCMonth()+1).padStart(2,'0')}.${d.getUTCFullYear()} ${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`;
}
function planetaryHoursTool(){
  const el=shell('calculator-ore-planetare','AstroVip · răsărit/apus Swiss Ephemeris','Calculator Ore Planetare','Calculează cele 24 de ore planetare pentru o dată și o locație. Ziua este împărțită în 12 intervale egale între răsărit și apus, iar noaptea în 12 intervale între apus și următorul răsărit.',`<form id="avc-ph-form"><div class="avc-card"><h3>Data și locația</h3><div class="avc-form-grid">
    <div class="avc-field"><label for="avc-ph-date">Data</label><input id="avc-ph-date" type="date" required></div>
    <div class="avc-field"><label for="avc-ph-offset">Fus orar</label><select id="avc-ph-offset">${offsets()}</select></div>
    <div class="avc-field"><label for="avc-ph-place">Localitate</label><input id="avc-ph-place" placeholder="București, România"></div>
    <div class="avc-field"><label for="avc-ph-lat">Latitudine</label><input id="avc-ph-lat" type="number" min="-90" max="90" step="0.000001" placeholder="44.4268" required></div>
    <div class="avc-field"><label for="avc-ph-lon">Longitudine</label><input id="avc-ph-lon" type="number" min="-180" max="180" step="0.000001" placeholder="26.1025" required></div>
  </div></div><div class="avc-actions"><button class="avc-btn" type="submit">CALCULEAZĂ ORELE PLANETARE</button><button class="avc-btn secondary" type="button" id="avc-fill-ph">Folosește profilul meu</button></div><p class="avc-status" id="avc-ph-status">Răsăritul și apusul sunt calculate astronomic pentru coordonatele introduse.</p></form><div class="avc-result" id="avc-ph-result" hidden></div>`);
  placeSection(el);fill('avc-ph',savedProfile());document.getElementById('avc-fill-ph').onclick=()=>fill('avc-ph',savedProfile());
  const today=new Date();const d=document.getElementById('avc-ph-date');if(d&&!d.value)d.value=today.toISOString().slice(0,10);
  document.getElementById('avc-ph-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-ph-result');
    try{
      const date=document.getElementById('avc-ph-date').value,offset=document.getElementById('avc-ph-offset').value,lat=Number(document.getElementById('avc-ph-lat').value),lon=Number(document.getElementById('avc-ph-lon').value);
      if(!date||!Number.isFinite(lat)||!Number.isFinite(lon))throw new Error('Completează data și coordonatele.');
      const midnight=new Date(`${date}T00:00:00${offset}`);
      setStatus('avc-ph-status','Calculez răsăritul, apusul și cele 24 de ore…',true);
      const ev=await calculateSwissSunEvents(midnight,lat,lon),rise=new Date(ev.sunrise),set=new Date(ev.sunset),nextRise=new Date(ev.nextSunrise);
      const dayLen=(set-rise)/12,nightLen=(nextRise-set)/12;
      const weekday=new Date(date+'T12:00:00Z').getUTCDay();
      const weekdayRulers=['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn'];
      const names={Sun:['Soare','☉'],Moon:['Lună','☽'],Mars:['Marte','♂'],Mercury:['Mercur','☿'],Jupiter:['Jupiter','♃'],Venus:['Venus','♀'],Saturn:['Saturn','♄']};
      const chaldean=['Saturn','Jupiter','Mars','Sun','Venus','Mercury','Moon'];
      const first=chaldean.indexOf(weekdayRulers[weekday]),rows=[];
      for(let i=0;i<24;i++){
        const start=i<12?new Date(rise.getTime()+i*dayLen):new Date(set.getTime()+(i-12)*nightLen);
        const end=i<12?new Date(rise.getTime()+(i+1)*dayLen):new Date(set.getTime()+(i-11)*nightLen);
        const key=chaldean[(first+i)%7],n=names[key];
        rows.push(`<tr><td>${i+1}</td><td>${i<12?'Zi':'Noapte'}</td><td><strong>${n[1]} ${n[0]}</strong></td><td>${localDateTime(start,offset)}</td><td>${localDateTime(end,offset)}</td></tr>`);
      }
      const dayR=names[weekdayRulers[weekday]];
      out.innerHTML=`<p class="avc-meta"><strong>Guvernatorul zilei:</strong> ${dayR[1]} ${dayR[0]} · <strong>Răsărit:</strong> ${localDateTime(rise,offset)} · <strong>Apus:</strong> ${localDateTime(set,offset)}.</p><div class="avc-table-wrap"><table class="avc-table"><thead><tr><th>#</th><th>Perioadă</th><th>Planetă</th><th>Început</th><th>Sfârșit</th></tr></thead><tbody>${rows.join('')}</tbody></table></div><p class="avc-note">Orele planetare sunt ore inegale: durata lor se schimbă odată cu lungimea zilei și a nopții.</p>`;
      out.hidden=false;setStatus('avc-ph-status','Ore planetare calculate',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-ph-status',err.message||'Calculul nu a putut fi realizat.')}
  });
}
function bigThreeTool(){
  const el=shell('calculator-big-three','AstroVip · Soare · Lună · Ascendent','Calculator Big Three','Află cele trei repere de bază ale hărții natale: semnul Soarelui, semnul Lunii și Ascendentul, cu gradele exacte și case Koch pentru momentul și locul nașterii.',`<form id="avc-big-form">${profileFields('avc-big','Date natale')}<div class="avc-actions"><button class="avc-btn" type="submit">CALCULEAZĂ BIG THREE</button><button class="avc-btn secondary" type="button" id="avc-fill-big">Folosește profilul meu</button></div><p class="avc-status" id="avc-big-status">Soare și Lună: Swiss Ephemeris · Ascendent: case Koch.</p></form><div class="avc-result" id="avc-big-result" hidden></div>`);
  placeSection(el);fill('avc-big',savedProfile());document.getElementById('avc-fill-big').onclick=()=>fill('avc-big',savedProfile());
  document.getElementById('avc-big-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-big-result');
    try{
      const p=profile('avc-big');setStatus('avc-big-status','Calculez Big Three…',true);
      const c=await calculateSwissChart(p.instant,p.lat,p.lon),sun=c.planets.find(x=>x.key==='Sun'),moon=c.planets.find(x=>x.key==='Moon'),asc={label:'Ascendent',glyph:'ASC',lon:c.axes.asc};
      const items=[{label:'Soare',glyph:'☉',lon:sun.longitude},{label:'Lună',glyph:'☽',lon:moon.longitude},asc];
      out.innerHTML=`${cards(items)}<p class="avc-meta"><strong>Luna în casa ${houseForLon(moon.longitude,c.cusps)}</strong> · Soarele în casa ${houseForLon(sun.longitude,c.cusps)} · sistem de case Koch.</p><div class="avc-tools-nav"><a href="/semnul-lunii/">Analizează Semnul Lunii</a><a href="/faza-lunii-la-nastere/">Vezi Faza Lunii</a><a href="/calculator-ascendent/">Calculator Ascendent</a></div>`;
      out.hidden=false;setStatus('avc-big-status','Big Three calculat',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-big-status',err.message||'Calculul nu a putut fi realizat.')}
  });
}
function moonSignTool(){
  const el=shell('calculator-semn-lunar','AstroVip · Lună natală · Swiss Ephemeris','Calculator Semnul Lunii','Calculează semnul și gradul exact al Lunii la naștere și casa Koch în care se află. Ora este importantă deoarece Luna se deplasează rapid și poate schimba semnul în cursul aceleiași zile.',`<form id="avc-moon-form">${profileFields('avc-moon','Date natale')}<div class="avc-actions"><button class="avc-btn" type="submit">CALCULEAZĂ SEMNUL LUNII</button><button class="avc-btn secondary" type="button" id="avc-fill-moon">Folosește profilul meu</button></div><p class="avc-status" id="avc-moon-status">Poziție tropicală Swiss Ephemeris și casă Koch.</p></form><div class="avc-result" id="avc-moon-result" hidden></div>`);
  placeSection(el);fill('avc-moon',savedProfile());document.getElementById('avc-fill-moon').onclick=()=>fill('avc-moon',savedProfile());
  document.getElementById('avc-moon-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-moon-result');
    try{
      const p=profile('avc-moon');setStatus('avc-moon-status','Calculez Luna natală…',true);
      const c=await calculateSwissChart(p.instant,p.lat,p.lon),moon=c.planets.find(x=>x.key==='Moon'),m=fmt(moon.longitude),h=houseForLon(moon.longitude,c.cusps);
      out.innerHTML=`<div class="avc-cards"><div class="avc-pos"><b>Semnul Lunii</b><strong>☽ ${m.sym}</strong><span>${m.text}</span><span>Casa Koch ${h}</span></div></div><p class="avc-meta">Luna natală se află la <strong>${m.text}</strong>, în <strong>casa ${h}</strong>. Gradul exact este mai util decât o interpretare bazată doar pe ziua nașterii.</p><div class="avc-tools-nav"><a href="/faza-lunii-la-nastere/">Faza Lunii la naștere</a><a href="/big-three/">Big Three</a><a href="/revolutie-lunara/">Revoluție Lunară</a></div>`;
      out.hidden=false;setStatus('avc-moon-status','Semnul Lunii calculat',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-moon-status',err.message||'Calculul nu a putut fi realizat.')}
  });
}
function moonPhaseTool(){
  const phases=[
    ['Lună Nouă','🌑'],['Semilună în creștere','🌒'],['Primul Pătrar','🌓'],['Gibboasă în creștere','🌔'],
    ['Lună Plină','🌕'],['Gibboasă în descreștere','🌖'],['Ultimul Pătrar','🌗'],['Semilună în descreștere','🌘']
  ];
  const el=shell('calculator-faza-lunii','AstroVip · fază natală · Swiss Ephemeris','Calculator Faza Lunii la Naștere','Determină faza Lunii din unghiul exact dintre Soare și Lună la momentul nașterii și estimează procentul de iluminare și vârsta fazei în ciclul sinodic.',`<form id="avc-phase-form">${momentFields('avc-phase','Momentul nașterii')}<div class="avc-actions"><button class="avc-btn" type="submit">CALCULEAZĂ FAZA LUNII</button><button class="avc-btn secondary" type="button" id="avc-fill-phase">Folosește profilul meu</button></div><p class="avc-status" id="avc-phase-status">Calcul bazat pe elongarea ecliptică Soare–Lună.</p></form><div class="avc-result" id="avc-phase-result" hidden></div>`);
  placeSection(el);fill('avc-phase',savedProfile());document.getElementById('avc-fill-phase').onclick=()=>fill('avc-phase',savedProfile());
  document.getElementById('avc-phase-form').addEventListener('submit',async e=>{
    e.preventDefault();const out=document.getElementById('avc-phase-result');
    try{
      const p=birthMoment('avc-phase');setStatus('avc-phase-status','Calculez faza Lunii…',true);
      const ps=await calculateSwissPositions(p.instant),sun=ps.planets.find(x=>x.key==='Sun'),moon=ps.planets.find(x=>x.key==='Moon'),elong=norm(moon.longitude-sun.longitude);
      const idx=Math.floor((elong+22.5)/45)%8,phase=phases[idx],illum=(1-Math.cos(elong*Math.PI/180))/2*100,age=elong/360*29.530588853,trend=elong<180?'în creștere':'în descreștere';
      out.innerHTML=`<div class="avc-cards"><div class="avc-pos"><b>Faza natală</b><strong>${phase[1]}</strong><span>${phase[0]}</span><span>Luna este ${trend}</span></div><div class="avc-pos"><b>Elongare</b><strong>${elong.toFixed(2)}°</strong><span>Soare → Lună</span></div><div class="avc-pos"><b>Iluminare estimată</b><strong>${illum.toFixed(1)}%</strong><span>din geometria fazei</span></div><div class="avc-pos"><b>Vârsta fazei</b><strong>${age.toFixed(2)} zile</strong><span>din ciclul sinodic</span></div></div><p class="avc-note">Procentul de iluminare și vârsta sunt derivate din elongarea geocentrică tropicală; denumirea fazei folosește împărțirea clasică în opt faze.</p><div class="avc-tools-nav"><a href="/semnul-lunii/">Semnul Lunii</a><a href="/big-three/">Big Three</a><a href="/revolutie-lunara/">Revoluție Lunară</a></div>`;
      out.hidden=false;setStatus('avc-phase-status','Faza Lunii calculată',true);out.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){setStatus('avc-phase-status',err.message||'Calculul nu a putut fi realizat.')}
  });
}

function toolsNav(){
  const host=document.querySelector('main')||document.body;
  const sec=document.createElement('section');sec.className='avc-shell';sec.innerHTML=`<div class="avc-tool"><div class="avc-head"><div class="avc-kicker">Nou în AstroVip Tools</div><h2>Calculatoare avansate</h2><p>Instrumentele folosesc aceeași infrastructură AstroVip pentru poziții planetare și case Koch.</p><div class="avc-tools-nav"><a href="/harta-compozita/">Hartă Compozită</a><a href="/harta-davison/">Hartă Davison</a><a href="/puncte-mijlocii/">66 Puncte Mijlocii</a><a href="/revolutie-lunara/">Revoluție Lunară</a><a href="/tranzitele-mele/">Calendar Tranzite</a><a href="/arce-solare/">Arce Solare</a><a href="/progresii-secundare/">Progresii</a><a href="/revolutie-solara/">Revoluție Solară</a><a href="/pars-fortunae-partea-norocului/">16 Lots Arabe</a><a href="/stele-fixe-in-astrologie/">Stele Fixe</a><a href="/revenirea-lui-saturn/">Saturn Return</a><a href="/retrogradare-astrologie/">Retrogradări</a><a href="/ore-planetare/">Ore Planetare</a><a href="/big-three/">Big Three</a><a href="/semnul-lunii/">Semnul Lunii</a><a href="/faza-lunii-la-nastere/">Faza Lunii</a></div></div></div>`;host.append(sec);
}
function boot(){
  const p=location.pathname.replace(/\/+$/,'/')||'/';
  if(p==='/harta-compozita/')relationTool('composite');
  else if(p==='/harta-davison/')relationTool('davison');
  else if(p==='/puncte-mijlocii/')midpointTool();
  else if(p==='/revolutie-lunara/')lunarReturnTool();
  else if(p==='/tranzitele-mele/')transitCalendarTool();
  else if(p==='/pars-fortunae-partea-norocului/')lotsTool();
  else if(p==='/stele-fixe-in-astrologie/')fixedStarsTool();
  else if(p==='/revenirea-lui-saturn/')saturnReturnTool();
  else if(p==='/retrogradare-astrologie/')retrogradeCalendarTool();
  else if(p==='/ore-planetare/')planetaryHoursTool();
  else if(p==='/big-three/')bigThreeTool();
  else if(p==='/semnul-lunii/')moonSignTool();
  else if(p==='/faza-lunii-la-nastere/')moonPhaseTool();
  else if(p==='/instrumente-astrologie/')toolsNav();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
