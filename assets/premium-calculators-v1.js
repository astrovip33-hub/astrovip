import { calculateSwissChart, calculateSwissPositions, calculateSwissBody } from '/assets/vendor/astrovip-swiss-koch.js?v=20261004-calc-suite1';

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
function toolsNav(){
  const host=document.querySelector('main')||document.body;
  const sec=document.createElement('section');sec.className='avc-shell';sec.innerHTML=`<div class="avc-tool"><div class="avc-head"><div class="avc-kicker">Nou în AstroVip Tools</div><h2>Calculatoare avansate</h2><p>Instrumentele folosesc aceeași infrastructură AstroVip pentru poziții planetare și case Koch.</p><div class="avc-tools-nav"><a href="/harta-compozita/">Hartă Compozită</a><a href="/harta-davison/">Hartă Davison</a><a href="/puncte-mijlocii/">66 Puncte Mijlocii</a><a href="/revolutie-lunara/">Revoluție Lunară</a><a href="/tranzitele-mele/">Calendar Tranzite</a><a href="/arce-solare/">Arce Solare</a><a href="/progresii-secundare/">Progresii</a><a href="/revolutie-solara/">Revoluție Solară</a></div></div></div>`;host.append(sec);
}
function boot(){
  const p=location.pathname.replace(/\/+$/,'/')||'/';
  if(p==='/harta-compozita/')relationTool('composite');
  else if(p==='/harta-davison/')relationTool('davison');
  else if(p==='/puncte-mijlocii/')midpointTool();
  else if(p==='/revolutie-lunara/')lunarReturnTool();
  else if(p==='/tranzitele-mele/')transitCalendarTool();
  else if(p==='/instrumente-astrologie/')toolsNav();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
