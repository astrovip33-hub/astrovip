// Shared, deterministic decision model. No API writes, revenue forecasts or AI fees.
export const WORKSTREAMS=Object.freeze([
  {id:'intelligence',number:'02',label:'Intelligence',modules:['seo','competitors','geo','local','content','authority'],sources:['intelligence','gsc']},
  {id:'operations',number:'03',label:'Operations',modules:['health','operations'],sources:['health','autopilot','recovery']},
  {id:'revenue',number:'04',label:'Money',modules:['revenue'],sources:['ga4','money']},
  {id:'operator',number:'05',label:'AI Operator',modules:['operator'],sources:['intelligence','gsc','ga4','money','local','health','autopilot']},
  {id:'qa',number:'06',label:'QA & Preview',modules:['qa'],sources:['health','autopilot']},
]);
export const ready=(records,key)=>records.get(key)?.status==='ready'?records.get(key).data:null;
export const finite=value=>value!==null&&value!==undefined&&value!==''&&typeof value!=='boolean'&&Number.isFinite(Number(value))?Number(value):null;
const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function keywordCandidates(snapshot,{query='',maxDifficulty=100,gapsOnly=false}={}) {
  return (snapshot?.keywords||[]).filter(k=>(!query||fold(k.keyword).includes(fold(query)))&&(!gapsOnly||k.gap)&&(finite(k.difficulty)===null||k.difficulty<=maxDifficulty));
}
export function commercialIntent(keyword) {
  return /consult|astrolog\b|harta natala|astrograma|numerolog|relocare|sinastr|cariera|bani/.test(fold(keyword));
}
export function moneySummary(money) {
  const report=money?.reports?.events;
  const value=name=>report?.status==='ready'&&Array.isArray(report.rows)?report.rows.find(r=>r.eventName===name)?.eventCount??0:null;
  return {whatsapp:value('whatsapp_click'),phone:value('phone_click'),forms:value('generate_lead'),bookings:value('booking_complete'),savedLeads:value('astro_free_question_lead_saved'),purchases:value('purchase')};
}
export function rankedActions(records) {
  const actions=[],get=key=>ready(records,key);
  const add=(id,title,detail,module,severity,confidence,effort,evidence,impact)=>{
    // Transparent ordinal decision score, not probability or estimated revenue.
    const score=Math.round(100*severity*confidence/(5*effort));
    actions.push({id,title,detail,module,score,confidence,effort,evidence,impact});
  };
  const health=get('health');
  const broken=health?.results?.filter(r=>r.ok===false)||[];
  if(broken.length)add('routes','Restabilește rutele cu eroare',`${broken.length} rute nu au trecut verificarea HTTP.`, 'health',5,1,1,'Site Health · '+(health.checkedAt||'data verificării indisponibilă'),'Accesibilitate: remedierea rutelor afectate. Impactul în bani nu este calculat.');
  const deploy=get('overview')?.github?.deploy;
  if(deploy?.conclusion==='failure')add('deploy','Investighează publicarea eșuată','Deschide jurnalul GitHub înaintea următoarei publicări.','operations',5,1,1,'GitHub deploy','Reduce riscul repetării unei publicări eșuate.');
  const pilot=get('autopilot');
  if(pilot?.enabled===false||pilot?.run?.conclusion==='failure')add('monitoring','Repară verificarea automată',pilot.enabled===false?'Auto-Pilot este dezactivat.':'Ultimul run Auto-Pilot a eșuat.','operations',4,1,2,'Auto-Pilot · '+(pilot.checkedAt||'dată indisponibilă'),'Reia detectarea incidentelor; impact comercial necunoscut.');
  const queries=get('gsc')?.data?.queries||[];
  const q=queries.filter(q=>finite(q.position)!==null&&q.position>=4&&q.position<=15&&q.impressions>0).sort((a,b)=>Number(b.impressions)-Number(a.impressions))[0];
  if(q)add('search','Optimizează „'+q.query+'”',`Poziție medie ${Number(q.position).toFixed(1)} · ${q.impressions} impresii în raportul GSC.`,'seo',commercialIntent(q.query)?4:3,.9,2,'GSC · '+(get('gsc')?.data?.range?.endDate||'perioadă indisponibilă'),'Poate crește accesul la pagina relevantă; clickuri și venit suplimentar neestimate.');
  const money=get('money'),totals=moneySummary(money);
  if(money?.reports?.events?.status==='ready'&&((totals.whatsapp||0)+(totals.phone||0)>0)&&totals.bookings===0&&totals.purchases===0)add('attribution','Confirmă rezultatul contactelor','Există clickuri de contact, dar raportul nu conține programări finalizate sau achiziții. Nu rezultă că vânzările sunt zero.','revenue',4,.9,2,'GA4 · ultimele 28 zile până ieri','Face posibilă legarea contactelor de programări și venit confirmat.');
  const snapshot=get('intelligence')?.data;
  const keyword=(snapshot?.keywords||[]).filter(k=>k.gap&&k.volume>0&&finite(k.difficulty)!==null&&k.difficulty<=40&&commercialIntent(k.keyword)).sort((a,b)=>b.volume-a.volume)[0];
  if(keyword)add('content-gap','Pregătește conținut pentru „'+keyword.keyword+'”',`${keyword.volume} căutări/lună estimate · dificultate ${keyword.difficulty}/100 în export. Verifică mai întâi pagina existentă.`,'content',3,.6,3,'SE Ranking · '+snapshot.capturedDate+' · '+keyword.sources[0],'Acoperă cerere observată în export; poziția și venitul viitor nu sunt prognozate.');
  const domain=snapshot?.authority?.find(d=>d.trust>=60);
  if(domain)add('authority','Verifică oportunitățile editoriale de autoritate',`${domain.domain} apare în gap-ul domeniilor concurenților. Verifică manual pagina și relevanța.`,'authority',2,.6,3,'SE Ranking · '+snapshot.capturedDate+' · '+domain.source,'Oportunitate de cercetare; backlinkul, colaborarea și efectul în ranking nu sunt confirmate.');
  const local=get('local');
  if(local?.profile&&local.reviews?.status!=='ready')add('local-reviews','Completează accesul la recenzii','Profilul Unirii 33 a fost verificat; rezumatul recenziilor nu este disponibil.','local',2,1,2,'Google Business · '+local.checkedAt,'Permite măsurarea recenziilor profilului corect. Nu estimează poziția Maps.');
  const unavailable=[...records].filter(([,r])=>r.status==='error').map(([key])=>key);
  if(unavailable.length)add('sources','Restabilește sursele indisponibile',unavailable.join(', '),'operations',3,1,2,'Răspunsuri API din sesiunea curentă','Îmbunătățește acoperirea deciziilor; impactul financiar nu poate fi calculat.');
  return actions.sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
}
export function qaSignals(records) {
  const h=ready(records,'health'),pilot=ready(records,'autopilot');
  return [
    {label:'Rute HTTP',status:h?.results?.length?(h.results.every(r=>r.ok)?'good':'bad'):'unknown',detail:h?.results?.length?`${h.results.filter(r=>r.ok).length}/${h.results.length} accesibile`:'Verificare neîncărcată'},
    {label:'Monitorizare tehnică',status:pilot?.run?(pilot.enabled===false||pilot.run.conclusion==='failure'?'bad':pilot.run.conclusion==='success'?'good':'unknown'):'unknown',detail:pilot?.run?.conclusion||'Run indisponibil'},
    ...['Audit securitate complet','Core Web Vitals / performanță','Mobile & desktop / responsive','Encoding și regresii UI'].map(label=>({label,status:'unknown',detail:'Vezi raportul QA al commitului din GitHub; HTTP 200 nu validează acest control.'})),
  ];
}
