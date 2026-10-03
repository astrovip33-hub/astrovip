(function(){
'use strict';
const PROFILE_KEY='astrovip_birth_profile_v1';
const SETTINGS_KEY='astrovip_local_space_v1';
const BODIES=[['Sun','Soare','☉'],['Moon','Lună','☽'],['Mercury','Mercur','☿'],['Venus','Venus','♀'],['Mars','Marte','♂'],['Jupiter','Jupiter','♃'],['Saturn','Saturn','♄'],['Uranus','Uranus','♅'],['Neptune','Neptun','♆'],['Pluto','Pluto','♇']];
const DIRS=['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSV','SV','VSV','V','VNV','NV','NNV'];
const $=id=>document.getElementById(id);
const norm=x=>((x%360)+360)%360;
const rad=d=>d*Math.PI/180;
const xy=(az,r)=>({x:220+r*Math.sin(rad(az)),y:220-r*Math.cos(rad(az))});
const dirName=az=>DIRS[Math.round(norm(az)/22.5)%16];
const fmtDeg=v=>`${v.toFixed(2)}°`;
const MAP_COLORS={Sun:'#ffd52f',Moon:'#f7f7f7',Mercury:'#35f26d',Venus:'#ff4ca8',Mars:'#ff3434',Jupiter:'#ffad2f',Saturn:'#2584ff',Uranus:'#16e7f2',Neptune:'#9a49ff',Pluto:'#f3388c'};
let lsMap=null,lsLayers=new Map();
function destination(lat,lon,bearing,km){const R=6371,d=km/R,b=rad(bearing),p1=rad(lat),l1=rad(lon);const p2=Math.asin(Math.sin(p1)*Math.cos(d)+Math.cos(p1)*Math.sin(d)*Math.cos(b));const l2=l1+Math.atan2(Math.sin(b)*Math.sin(d)*Math.cos(p1),Math.cos(d)-Math.sin(p1)*Math.sin(p2));return[p2*180/Math.PI,((l2*180/Math.PI+540)%360)-180]}
function geodesicRay(lat,lon,bearing,maxKm=4500){const pts=[[lat,lon]];for(let km=100;km<=maxKm;km+=100)pts.push(destination(lat,lon,bearing,km));return pts}
function mapIcon(html,color,origin=false){return L.divIcon({className:'',html:origin?'<div class="ls-origin-marker"></div>':`<div class="ls-map-planet-icon" style="color:${color};border-color:${color}">${html}</div>`,iconSize:origin?[24,24]:[34,34],iconAnchor:origin?[12,12]:[17,17]})}
function ensureMap(data){if(!window.L)return false;const el=$('lsMapSection');el.hidden=false;if(!lsMap){lsMap=L.map('lsMap',{zoomControl:true,preferCanvas:true}).setView([data.lat,data.lon],5);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(lsMap)}else lsMap.setView([data.lat,data.lon],5);setTimeout(()=>lsMap.invalidateSize(),80);return true}
function renderMap(items,data){if(!ensureMap(data))return;lsLayers.forEach(v=>v.remove());lsLayers.clear();L.marker([data.lat,data.lon],{icon:mapIcon('',null,true),zIndexOffset:1000}).addTo(lsMap).bindPopup(`<b>${data.place}</b><br><small>Originea Local Space</small>`);
 const toggles=$('lsPlanetToggles');toggles.innerHTML='';
 items.forEach(p=>{const color=MAP_COLORS[p.body]||'#38f58a',group=L.layerGroup();
   const forward=geodesicRay(data.lat,data.lon,p.az),back=geodesicRay(data.lat,data.lon,norm(p.az+180));
   L.polyline(forward,{color,weight:3,opacity:.92}).addTo(group);L.polyline(back,{color,weight:2,opacity:.55,dashArray:'7 8'}).addTo(group);
   const tip=destination(data.lat,data.lon,p.az,1800);L.marker(tip,{icon:mapIcon(p.glyph,color)}).addTo(group).bindPopup(`<div class="ls-map-popup"><b>${p.glyph} ${p.label}</b><br>Azimut: ${fmtDeg(p.az)} · ${dirName(p.az)}<br>Altitudine: ${p.alt>=0?'+':''}${fmtDeg(p.alt)}<small>Linia continuă = azimut · linia punctată = anti-azimut</small></div>`);
   group.addTo(lsMap);lsLayers.set(p.body,group);
   const lab=document.createElement('label');lab.className='ls-planet-toggle';lab.innerHTML=`<input type="checkbox" checked><span class="glyph" style="color:${color}">${p.glyph}</span><span>${p.label}</span><i class="swatch" style="color:${color};background:${color}"></i>`;lab.querySelector('input').addEventListener('change',e=>e.target.checked?group.addTo(lsMap):group.remove());toggles.appendChild(lab);
 });
 $('lsMapSection').scrollIntoView({behavior:'smooth',block:'start'});
}
function safeLoad(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function fillNatal(p){if(!p)return;const map={lsName:p.name,lsDate:p.date,lsTime:p.time,lsOffset:p.offset,lsBirthPlace:p.place,lsBirthLat:p.lat,lsBirthLon:p.lon};Object.entries(map).forEach(([id,val])=>{const el=$(id);if(el&&val!==undefined&&val!==null&&val!=='')el.value=val})}
function formData(){
  const date=$('lsDate').value,time=$('lsTime').value,offset=$('lsOffset').value,name=$('lsName').value.trim(),birthPlace=$('lsBirthPlace').value.trim();
  const birthLat=Number($('lsBirthLat').value),birthLon=Number($('lsBirthLon').value),useReference=$('useReference').checked;
  if(!date||!time||!birthPlace)throw new Error('Completează data, ora și locul nașterii.');
  if(!Number.isFinite(birthLat)||birthLat<-90||birthLat>90||!Number.isFinite(birthLon)||birthLon<-180||birthLon>180)throw new Error('Coordonatele natale nu sunt valide.');
  const moment=new Date(`${date}T${time}:00${offset}`);if(isNaN(moment))throw new Error('Data sau ora nu este validă.');
  let place=birthPlace,lat=birthLat,lon=birthLon;
  if(useReference){place=$('refPlace').value.trim();lat=Number($('refLat').value);lon=Number($('refLon').value);if(!place)throw new Error('Completează locul de referință pentru relocare.');if(!Number.isFinite(lat)||lat<-90||lat>90||!Number.isFinite(lon)||lon<-180||lon>180)throw new Error('Coordonatele locului de referință nu sunt valide.')}
  const natal={name,date,time,offset,place:birthPlace,lat:birthLat,lon:birthLon};try{localStorage.setItem(PROFILE_KEY,JSON.stringify(natal));localStorage.setItem(SETTINGS_KEY,JSON.stringify({useReference,refPlace:$('refPlace').value.trim(),refLat:$('refLat').value,refLon:$('refLon').value}))}catch{}
  return{moment,name,date,time,offset,birthPlace,birthLat,birthLon,useReference,place,lat,lon};
}
function calculate(data){
  const observer=new Astronomy.Observer(data.lat,data.lon,0);
  return BODIES.map(([body,label,glyph])=>{const eq=Astronomy.Equator(body,data.moment,observer,true,true);const hor=Astronomy.Horizon(data.moment,observer,eq.ra,eq.dec);return{body,label,glyph,az:norm(hor.azimuth),alt:hor.altitude,ra:eq.ra,dec:eq.dec}});
}
function baseCompass(){
  let h='<circle class="ls-ring" cx="220" cy="220" r="194"/><circle class="ls-ring" cx="220" cy="220" r="145"/><circle class="ls-ring" cx="220" cy="220" r="92"/>';
  for(let a=0;a<360;a+=15){const p1=xy(a,92),p2=xy(a,194);h+=`<line class="${a%90===0?'ls-spoke-major':'ls-spoke'}" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"/>`;if(a%30===0){const d=xy(a,207);h+=`<text class="ls-degree" x="${d.x}" y="${d.y}">${a}°</text>`}}
  const cards=[['N',0],['E',90],['S',180],['V',270]];for(const [t,a] of cards){const p=xy(a,175);h+=`<text class="ls-cardinal" x="${p.x}" y="${p.y}">${t}</text>`}return h;
}
function draw(items=[]){let h=baseCompass();for(const p of items){const a=xy(p.az,164),b=xy(p.az+180,164),l=xy(p.az,180);h+=`<line class="ls-ray" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/><circle class="ls-ray-dot" cx="${a.x}" cy="${a.y}" r="4"/><text class="ls-planet" x="${l.x}" y="${l.y}">${p.glyph}</text>`}$('lsCompass').innerHTML=h}
function render(items,data){
  draw(items);renderMap(items,data);$('lsStatus').textContent=data.useReference?'Relocat':'Natal';$('lsResults').hidden=false;
  $('lsMeta').textContent=`${data.name?data.name+' · ':''}${data.date} ${data.time} · ${data.useReference?'referință: ':'loc natal: '}${data.place} · ${data.lat.toFixed(4)}°, ${data.lon.toFixed(4)}° · UTC ${data.offset}`;
  $('lsTable').innerHTML=items.map(p=>`<tr><td><span class="planet-glyph">${p.glyph}</span><span class="planet-name">${p.label}</span></td><td class="azimuth">${fmtDeg(p.az)}</td><td>${dirName(p.az)}</td><td>${p.alt>=0?'+':''}${fmtDeg(p.alt)}</td><td class="${p.alt>=0?'above':'below'}">${p.alt>=0?'deasupra orizontului':'sub orizont'}</td></tr>`).join('');
  $('lsResults').scrollIntoView({behavior:'smooth',block:'start'});
}
function restoreSettings(){const s=safeLoad(SETTINGS_KEY);if(!s)return;if(s.refPlace)$('refPlace').value=s.refPlace;if(s.refLat!==undefined)$('refLat').value=s.refLat;if(s.refLon!==undefined)$('refLon').value=s.refLon;$('useReference').checked=!!s.useReference;$('referenceFields').hidden=!s.useReference}
function demo(){const p={name:'Exemplu',date:'2000-01-01',time:'12:00',offset:'+02:00',place:'București, România',lat:44.4268,lon:26.1025};fillNatal(p);$('useReference').checked=false;$('referenceFields').hidden=true;if(window.Astronomy&&typeof Astronomy.Equator==='function'){const d=formData();render(calculate(d),d)}}
function boot(){draw([]);fillNatal(safeLoad(PROFILE_KEY));restoreSettings();$('useReference').addEventListener('change',e=>{$('referenceFields').hidden=!e.target.checked});$('loadNatal').addEventListener('click',()=>{const p=safeLoad(PROFILE_KEY);if(!p)return alert('Nu există încă date salvate. Completează mai întâi pagina „Harta mea”.');fillNatal(p)});$('demoLS').addEventListener('click',demo);$('lsForm').addEventListener('submit',e=>{e.preventDefault();try{if(!window.Astronomy||typeof Astronomy.Equator!=='function'||typeof Astronomy.Horizon!=='function')throw new Error('Motorul astronomic nu s-a încărcat încă. Reîncearcă în câteva secunde.');const data=formData();render(calculate(data),data)}catch(err){alert(err.message||'Calculul Local Space nu a putut fi realizat.')}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
