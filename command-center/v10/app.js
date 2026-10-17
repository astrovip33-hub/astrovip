import {MODULES,number,connectionState,opportunities,priorities,operatorIntent,isVisualPreview} from './intelligence.js';
import {Sources,SESSION_KEY} from './sources.js';
import {renderRoom,workflowNavigation} from './rooms.js';
import {parseSnapshot} from './snapshot.js';

const $=id=>document.getElementById(id);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths=[
  '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6M7 12l2-3 2 1 2-3"/>',
  '<path d="M4 20V10h4v10m4 0V4h4v16m4 0V7h2v13M3 20h20"/>',
  '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
  '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  '<path d="M14 3H5v18h14V8Zm0 0v6h5M8 13h8m-8 4h5"/>',
  '<path d="m12 3 7 3v6c0 5-7 9-7 9s-7-4-7-9V6Zm-4 9 3 3 5-6"/>',
  '<path d="M3 20h18M5 16l5-5 4 2 6-8m-5 0h5v5"/>',
  '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
];
const previewOnly=isVisualPreview(location);
let authenticated=false,active='cockpit',navigationEpoch=0,loginEpoch=0;
const filters={query:'',maxDifficulty:100,gapsOnly:false,serp:''};
const getToken=()=>{try{return sessionStorage.getItem(SESSION_KEY)||'';}catch{return '';}};
const store=new Sources({token:getToken,onUnauthorized:()=>lock('Sesiunea a expirat. Autentifică-te din nou.')});
const data=key=>store.records.get(key)?.status==='ready'?store.records.get(key).data:null;
const report=key=>data(key)?.data;
const source=key=>data('connections')?.sources?.find(s=>s.key===key);
const date=value=>Number.isFinite(new Date(value).getTime())?new Date(value).toLocaleString('ro-RO',{timeZone:'Europe/Bucharest',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'—';
const badge=(text,kind='')=>`<span class="badge ${kind}">${escape(text)}</span>`;
const link=(href,label,gold=false)=>`<a class="button${gold?' gold':''}" href="${escape(href)}">${escape(label)} <span aria-hidden="true">↗</span></a>`;
function lock(message=''){
  authenticated=false;navigationEpoch++;loginEpoch++;store.clear();
  try{sessionStorage.removeItem(SESSION_KEY);}catch{}
  $('app').hidden=true;$('lock').hidden=false;$('content').innerHTML='';$('login-error').textContent=message;$('token').value='';
  if(message)$('token').focus();
}
function stateNote(key){
  if(store.records.get(key)?.local)return 'Import local · '+date(store.records.get(key).at);
  if(previewOnly)return 'Date neîncărcate în preview';
  const record=store.records.get(key);
  if(record?.status==='loading')return 'Se încarcă…';
  if(record?.status==='error')return 'Sursă indisponibilă · verifică accesul';
  if(record?.status==='ready')return 'Preluat '+date(record.at);
  if(['gsc','ga4','seranking'].includes(key)){
    if(!Array.isArray(data('connections')?.sources))return 'Conexiune neverificată';
    return 'Neconectat · configurează sursa';
  }
  return 'Neîncărcat';
}
function period(key){
  if(key==='gsc'){
    const range=report(key)?.range;
    return range?.startDate&&range?.endDate?`${range.startDate} – ${range.endDate}`:'Perioada GSC indisponibilă';
  }
  return report(key)?.period==='28daysAgo..yesterday'?'Ultimele 28 zile, până ieri':'Perioada raportului indisponibilă';
}
function metric(label,value,key,extra=''){
  return `<article class="metric panel"><span class="metric-label">${escape(label)}</span><span class="metric-line" aria-hidden="true"></span><strong>${escape(value)}</strong><small>${escape(extra||period(key))}</small><small>${escape(stateNote(key))}</small></article>`;
}
function empty(title,detail){return `<div class="empty"><strong>${escape(title)}</strong>${escape(detail)}</div>`;}
function card(title,body,tag=''){return `<section class="panel card"><div class="card-heading"><h2>${escape(title)}</h2>${tag}</div>${body}</section>`;}
function opportunityList(){
  const rows=opportunities(report('gsc'));
  if(!rows.length)return empty(report('gsc')?'Nicio căutare eligibilă în setul primit.':'Oportunitățile așteaptă datele GSC.',report('gsc')?'Filtru: poziție medie 4–15 și impresii pozitive. Raportul returnează cel mult 50 de căutări.':stateNote('gsc'));
  return `<div class="list">${rows.map((row,i)=>`<div class="item"><span class="item-number">${String(i+1).padStart(2,'0')}</span><div class="item-body"><strong>${escape(row.query)}</strong><small>${number(row.impressions)} impresii · ${number(row.clicks)} clickuri</small></div><span class="item-value">#${number(row.position,1)} mediu</span></div>`).join('')}</div><p class="small">${escape(period('gsc'))} · Poziții medii GSC, agregate; clasamentul punctual se verifică în SE Ranking.</p>`;
}
function priorityCard(){
  const items=priorities(store.records);
  return card('Următoarea mișcare',items.length?`<div class="list">${items.map((x,i)=>`<a class="item" href="${escape(x.href||'#'+x.module)}"><span class="item-number">${i+1}</span><span class="item-body"><strong>${escape(x.title)}</strong><small>${escape(x.detail)}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div>`:empty('Nicio prioritate derivată din datele primite.','Verifică sursele și perioada rapoartelor înainte de a alege următoarea acțiune.'),badge('OPPORTUNITY ENGINE','warn'));
}
function dominanceCard(){return card('AstroVip Dominance Score',`<div class="score-ring" aria-label="Scor indisponibil">—</div><p class="lead">Benchmark necesar</p><p>Scorul cere poziții pentru aceleași cuvinte cheie și concurenți, alături de date AI și Maps. Nu este calculat din sănătatea site-ului sau numărul conexiunilor.</p>`,badge('NECALCULAT','warn'));}
function connectionCard(keys=null){
  const records=data('connections')?.sources;
  const selected=Array.isArray(records)?records.filter(x=>!keys||keys.includes(x.key)):[];
  return card('Sursele tale',selected.length?`<div class="connection-grid">${selected.map(s=>{const state=connectionState(s);return `<a class="connection" href="/command-center/connections/?focus=${encodeURIComponent(s.key)}"><span><strong>${escape(s.name)}</strong><small>${state.label==='Verificat'?'Test API reușit raportat de hub':'Deschide pentru test API'}</small></span>${badge(state.label,state.kind)}</a>`;}).join('')}</div><div class="card-actions">${link('/command-center/connections/','Gestionează conexiunile')}</div>`:empty('Conexiunile nu sunt disponibile.',stateNote('connections')),badge(stateNote('connections')));
}
function cockpit(){
  const g=report('gsc')?.summary,a=report('ga4')?.metrics;
  const position=g&&Number(g.impressions)>0&&Number(g.position)>0?number(g.position,1):'—';
  return `<div class="metrics">${metric('Clickuri din Google',number(g?.clicks),'gsc')}${metric('Poziție medie Google',position,'gsc')}${metric('Sesiuni pe site',number(a?.sessions),'ga4')}${metric('Venit măsurat în GA4',a?.totalRevenue==null?'—':number(a.totalRevenue,2),'ga4')}</div><div class="columns">${priorityCard()}${dominanceCard()}</div><div class="columns">${card('Căutări cu potențial',opportunityList(),badge('SEARCH CONSOLE','warn'))}${card('Premium Studio',`<p class="lead">Selectezi. Modifici. Verifici.</p><p>Texte, culori, butoane și secțiuni, direct în pagina ta. Desktop, tabletă și mobil din aceeași interfață.</p><div class="card-actions">${link('/command-center/site-builder/?from=v10','Deschide editorul vizual',true)}</div><p class="small">Draftul și publicarea se controlează din Studio.</p>`,badge('EDITOR VIZUAL','good'))}</div>${connectionCard(['gsc','ga4','seranking'])}`;
}
function rankingCard(){
  const d=data('seranking'),p=d?.project;
  return card('Proiect SE Ranking',p?`<p class="lead">${escape(p.title||p.name||'AstroVip')}</p><div class="list"><div class="item"><span class="item-body">Cuvinte cheie urmărite</span><span class="item-value">${number(p.keywordCount)}</span></div><div class="item"><span class="item-body">Frecvența verificării</span><span class="item-value">${escape(p.checkFreq||'—')}</span></div></div><p class="small">${escape(stateNote('seranking'))}. Conectorul actual returnează date despre proiect; pozițiile și concurenții se deschid în SE Ranking.</p><div class="card-actions">${link('https://online.seranking.com/','Deschide SE Ranking')}</div>`:empty('Proiectul nu a fost încărcat.',stateNote('seranking')),badge(d?'DATE PROIECT':'FĂRĂ DATE',d?'good':'warn'));
}
function seo(){
  const g=report('gsc')?.summary;
  return `<div class="metrics">${metric('Clickuri',number(g?.clicks),'gsc')}${metric('Impresii',number(g?.impressions),'gsc')}${metric('CTR',g?.ctr==null?'—':number(g.ctr*100,2)+'%','gsc')}${metric('Poziție medie',g&&g.impressions>0&&g.position>0?number(g.position,2):'—','gsc')}</div><div class="columns">${card('Opportunity Engine',opportunityList(),badge('POZIȚII MEDII 4–15','warn'))}${rankingCard()}</div>${connectionCard(['gsc','seranking'])}`;
}
function health(){
  const h=data('health'),o=data('overview'),pilot=data('autopilot');
  const routes=Array.isArray(h?.results)?h.results:[];
  const deploy=o?.github?.deploy;
  return `<div class="columns">${card('Disponibilitatea rutelor',routes.length?`<div class="list">${routes.map(x=>`<div class="item"><div class="item-body"><strong>${escape(x.key)}</strong><small>HTTP ${escape(x.status)} · ${number(x.ms)} ms</small></div>${badge(x.ok?'Accesibil':'Eroare',x.ok?'good':'bad')}</div>`).join('')}</div><p class="small">Verificare HTTP; nu confirmă funcționarea tuturor acțiunilor sau autentificarea în pagini.</p>`:empty('Verificarea nu este disponibilă.',stateNote('health')),badge(stateNote('health')))}${card('Deploy & Auto-Pilot',`<div class="list"><div class="item"><div class="item-body"><strong>Commit main</strong><small>${escape(o?.github?.commit?.shortSha||'—')}</small></div></div><div class="item"><div class="item-body"><strong>Ultimul deploy</strong><small>${escape(deploy?.conclusion||deploy?.status||'Neverificat')}</small></div></div><div class="item"><div class="item-body"><strong>Auto-Pilot</strong><small>${pilot?escape(pilot.enabled?(pilot.run?.conclusion||pilot.run?.status||'Neverificat'):'Dezactivat'):escape(stateNote('autopilot'))}</small></div></div></div><div class="card-actions">${link('/command-center/','Deschide operațiunile V9')}</div>`,badge('OPERAȚIUNI'))}</div>${priorityCard()}`;
}
function content(){return `<div class="columns">${card('Editor vizual · Premium Studio',`<p class="lead">Site-ul tău, editat direct.</p><div class="list"><div class="item"><span class="item-number">01</span><div class="item-body"><strong>Alege pagina și elementul</strong><small>Texte, titluri, carduri sau butoane din preview.</small></div></div><div class="item"><span class="item-number">02</span><div class="item-body"><strong>Modifică textul și aspectul</strong><small>Culori, font, spațiere și preseturi AstroVip.</small></div></div><div class="item"><span class="item-number">03</span><div class="item-body"><strong>Verifică și salvează</strong><small>Vezi mobilul, salvează draftul și folosește publicarea din Studio.</small></div></div></div><div class="card-actions">${link('/command-center/site-builder/?from=v10','Editează site-ul',true)}</div>`,badge('PREMIUM STUDIO','good'))}${card('Idei din căutările reale',opportunityList(),badge('SEARCH CONSOLE','warn'))}</div>`;}
function renderModule(){
  const room=()=>renderRoom(active,{data,report,number,badge,link,card,empty,escape,records:store.records,filters});
  if(['intelligence','competitors','geo','local','authority','operations','operator','qa'].includes(active))return room();
  switch(active){
    case 'cockpit':return cockpit();
    case 'seo':return seo()+room();
    case 'revenue':return room();
    case 'health':return health();
    case 'content':return content()+room();
    default:return cockpit();
  }
}
function render(){
  if(!authenticated)return;
  const module=MODULES.find(x=>x.id===active);
  $('module-caption').textContent=module.label;$('module-eyebrow').textContent=module.eyebrow;
  $('module-title').innerHTML=escape(module.title)+'<br><span>'+escape(module.accent)+'</span>';
  $('module-description').textContent=module.description;
  document.title=module.label+' · AstroVip Marketing OS V10';
  document.querySelectorAll('#navigation a').forEach(a=>{if(a.hash==='#'+active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  const busy=[...store.records.values()].some(r=>r.status==='loading');
  $('content').setAttribute('aria-busy',String(busy));$('refresh').disabled=busy||previewOnly;
  $('refresh').textContent=previewOnly?'Preview vizual':busy?'Se încarcă…':'↻ Actualizează';
  const times=[...store.records.values()].filter(r=>r.status==='ready').map(r=>r.at);
  $('fetch-time').textContent=times.length?'Ultima preluare '+date(Math.max(...times)):'Date neverificate';
  const bad=[...store.records.values()].filter(r=>r.status==='error').length;
  $('session-status').className='badge '+(bad?'warn':'good');
  $('session-status').textContent=bad?bad+' surse indisponibile':'Autentificat';
  if(previewOnly){$('session-status').className='badge warn';$('session-status').textContent='PREVIEW · FĂRĂ DATE';$('fetch-time').textContent='Datele private nu sunt încărcate';}
  $('content').innerHTML=renderModule();
}
function eligible(key){
  if(key==='money')return eligible('ga4');
  if(key==='local'){
    const s=source('googleBusiness');return Boolean(s&&(s.configured||s.authorized||s.state==='verified'));
  }
  if(!['gsc','ga4','seranking'].includes(key))return true;
  const s=source(key);return Boolean(s&&(s.configured||s.authorized||s.state==='verified'));
}
async function loadActive(force=false){
  if(previewOnly||!authenticated)return;
  const epoch=++navigationEpoch,session=loginEpoch;
  const core=['overview','connections'].map(key=>store.load(key,{force}));render();
  await Promise.allSettled(core);
  if(!authenticated||session!==loginEpoch||epoch!==navigationEpoch)return;
  const module=MODULES.find(x=>x.id===active);
  const calls=module.sources.filter(eligible).map(key=>store.load(key,{force}).finally(render));render();
  await Promise.allSettled(calls);
  if(authenticated&&session===loginEpoch)render();
}
function selectModule(){
  const requested=location.hash.slice(1);active=MODULES.some(x=>x.id===requested)?requested:'cockpit';
  if(authenticated){render();void loadActive();}
}
async function unlock(){
  const epoch=++loginEpoch;
  await store.ping();
  if(epoch!==loginEpoch)return;
  authenticated=true;$('token').value='';$('login-error').textContent='';$('lock').hidden=true;$('app').hidden=false;
  selectModule();$('workspace').focus({preventScroll:true});
}
$('navigation').innerHTML=workflowNavigation(MODULES,m=>`<svg viewBox="0 0 24 24">${paths[MODULES.indexOf(m)%paths.length]}</svg>`,escape);
$('content').addEventListener('submit',event=>{
  if(event.target.id!=='research-filters')return;
  event.preventDefault();const form=new FormData(event.target);
  filters.query=String(form.get('query')||'').trim().slice(0,100);
  filters.maxDifficulty=Number(form.get('difficulty'))||100;filters.gapsOnly=form.has('gaps');render();
});
$('content').addEventListener('change',event=>{
  if(event.target.id==='serp-query'){filters.serp=event.target.value;render();$('serp-query')?.focus();}
});
$('content').addEventListener('change',async event=>{
  if(event.target.id!=='intelligence-file'||!authenticated)return;
  const file=event.target.files?.[0];if(!file)return;
  const epoch=loginEpoch;
  try{
    if(file.size>512000)throw Error('Fișierul depășește limita de 500 KB.');
    const snapshot=parseSnapshot(await file.text());
    if(epoch!==loginEpoch||!authenticated)return;
    store.importSnapshot(snapshot);render();
    $('operator-result').hidden=false;$('operator-result').textContent='Raport importat în memoria sesiunii. Fișierul nu a fost transmis unui server și se elimină la ieșire.';
    if(!previewOnly)void loadActive();
  }catch(error){
    if(epoch!==loginEpoch||!authenticated)return;
    $('operator-result').hidden=false;$('operator-result').textContent=error.message;
  }
});
$('login-form').addEventListener('submit',async event=>{
  event.preventDefault();const value=$('token').value.trim();if(!value)return;
  $('login-button').disabled=true;$('login-error').textContent='';
  try{sessionStorage.setItem(SESSION_KEY,value);await unlock();}
  catch(e){lock(e.message==='Acces respins. Verifică tokenul.'?e.message:'Accesul nu a putut fi verificat. Încearcă din nou.');}
  finally{$('login-button').disabled=false;}
});
$('logout').addEventListener('click',()=>{if(previewOnly)location.assign('/command-center/v10/');else lock();});
$('refresh').addEventListener('click',()=>{if(authenticated)void loadActive(true);});
$('operator-form').addEventListener('submit',event=>{
  event.preventDefault();const intent=operatorIntent($('command').value);
  if(!intent){$('operator-result').hidden=false;$('operator-result').textContent='Încearcă: SEO, concurență, AI, Maps, conținut, venituri, alerte, editor, conexiuni sau backup.';return;}
  $('operator-result').hidden=true;
  if(intent.href)location.assign(intent.href);else if(location.hash==='#'+intent.module)selectModule();else location.hash=intent.module;
});
addEventListener('hashchange',selectModule);
if(previewOnly){authenticated=true;$('lock').hidden=true;$('app').hidden=false;$('preview-notice').hidden=false;$('logout').textContent='Autentificare';selectModule();}
else if(getToken())unlock().catch(()=>lock('Autentifică-te pentru a continua.'));
