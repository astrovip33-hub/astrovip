// Pure intelligence layer. A configured connector is never treated as a ranking result.
const MODULE_DEFINITIONS = [
  {id:'studio',label:'Site Studio',eyebrow:'SITE STUDIO V11',title:'Editezi direct.',accent:'Vezi imediat.',description:'Texte, culori, mobil, draft și publicare în același V11.',sources:[]},
  {id:'connections',label:'Conexiuni și acces',eyebrow:'CONEXIUNI V11',title:'Serviciile AstroVip.',accent:'Acces verificabil.',description:'Configurare, autorizare și teste API pentru fiecare serviciu.',sources:[]},
  {id:'google',label:'Acces Google',eyebrow:'GOOGLE V11',title:'Search Console și GA4.',accent:'Autorizare și acces.',description:'Gestionează accesul Google din V11.',sources:[]},
  {id:'cockpit',label:'Executive Cockpit',eyebrow:'PRIVIRE DE ANSAMBLU',title:'Tot ce contează.',accent:'Într-o singură privire.',description:'Vizibilitate, rezultate și următoarea mișcare pentru AstroVip.',sources:['gsc','ga4','health']},
  {id:'intelligence',label:'Intelligence · sinteză',eyebrow:'WORK 02 · INTELLIGENCE',title:'Cererea reală.',accent:'Direcția potrivită.',description:'SEO, competitori, AI/GEO, Local, conținut și autoritate, cu surse și dată.',sources:['intelligence','gsc']},
  {id:'seo',label:'Google & SEO',eyebrow:'WORK 02 · GOOGLE INTELLIGENCE',title:'De la căutări',accent:'la oportunități.',description:'Search Console pentru performanță. SE Ranking pentru research și benchmark datat.',sources:['gsc','seranking','intelligence','mangools']},
  {id:'competitors',label:'Concurență',eyebrow:'COMPETITOR WAR ROOM',title:'Concurența,',accent:'cu dovezi.',description:'Benchmark și rezultate SERP din exporturile SE Ranking, cu contextul fiecărui raport.',sources:['intelligence']},
  {id:'geo',label:'Vizibilitate AI / GEO',eyebrow:'AI INTELLIGENCE',title:'AstroVip în',accent:'răspunsurile AI.',description:'Baseline Peec datat, separat de măsurătorile live.',sources:['intelligence']},
  {id:'local',label:'Maps & Recenzii',eyebrow:'LOCAL INTELLIGENCE',title:'Prezența locală.',accent:'Un singur profil real.',description:'Google Business Profile pentru Bulevardul Unirii 33, București.',sources:['local']},
  {id:'content',label:'Conținut & Editor',eyebrow:'CONTENT STUDIO',title:'Idei susținute de date.',accent:'Control vizual simplu.',description:'Oportunități din căutări și acces direct la editorul AstroVip.',sources:['gsc','intelligence']},
  {id:'authority',label:'Autoritate',eyebrow:'AUTHORITY INTELLIGENCE',title:'Încredere care',accent:'se poate verifica.',description:'Domenii din backlink gap, pentru verificare editorială și selecție.',sources:['intelligence']},
  {id:'revenue',label:'Money · Leaduri & Venituri',eyebrow:'WORK 04 · MONEY',title:'De la vizibilitate',accent:'la rezultate.',description:'Clickuri, solicitări, programări și achiziții, cu atribuirea sursei și servicii vândute în GA4.',sources:['ga4','money']},
  {id:'health',label:'Sănătate & Alerte',eyebrow:'OPERATIONS INTELLIGENCE',title:'Controlul tehnic.',accent:'Cu semnale clare.',description:'Disponibilitatea rutelor, ultimul deploy și ultima verificare Auto-Pilot.',sources:['health','autopilot']},
  {id:'operations',label:'Operations',eyebrow:'WORK 03 · OPERATIONS',title:'Publicare și recuperare.',accent:'Control în fiecare pas.',description:'GitHub, Cloudflare, puncte de recuperare și conexiuni din infrastructura existentă.',sources:['health','autopilot','recovery']},
  {id:'operator',label:'AI Operator',eyebrow:'WORK 05 · AI OPERATOR',title:'Ce facem mai întâi.',accent:'Și pe ce ne bazăm.',description:'Priorități explicabile din motoarele de date. Impact estimat calitativ, fără venituri inventate.',sources:['intelligence','gsc','ga4','money','local','health','autopilot']},
  {id:'qa',label:'QA & Preview',eyebrow:'WORK 06 · QUALITY ASSURANCE',title:'Verificare completă.',accent:'Preview înainte de lansare.',description:'Securitate, performanță, responsive, encoding și regresii: fiecare control cu dovada lui.',sources:['health','autopilot']},
];
export const MODULES=[MODULE_DEFINITIONS.find(m=>m.id==='cockpit'),...MODULE_DEFINITIONS.filter(m=>m.id!=='cockpit')];
export function number(value, digits=0) {
  if(value===null||value===undefined||value===''||typeof value==='boolean'||!Number.isFinite(Number(value)))return '—';
  return new Intl.NumberFormat('ro-RO',{maximumFractionDigits:digits}).format(Number(value));
}
export function connectionState(source) {
  if(!source)return {label:'Neconectat',kind:'warn'};
  if(source.error)return {label:'Necesită verificare',kind:'bad'};
  if(source.state==='verified')return {label:'Verificat',kind:'good'};
  if(source.authorized||source.state==='authorized')return {label:'Autorizat',kind:'warn'};
  if(source.configured||source.state==='configured')return {label:'Configurat',kind:'warn'};
  return {label:'Neconectat',kind:'warn'};
}
export function opportunities(report) {
  return (Array.isArray(report?.queries)?report.queries:[])
    .filter(q=>q&&typeof q.query==='string'&&q.query.trim()&&Number.isFinite(Number(q.position))&&Number(q.position)>=4&&Number(q.position)<=15&&Number(q.impressions)>0)
    .sort((a,b)=>Number(b.impressions)-Number(a.impressions)).slice(0,6);
}
export function priorities(records) {
  const out=[],value=key=>records.get(key)?.data;
  const deploy=value('overview')?.github?.deploy;
  if(deploy?.status==='completed'&&deploy.conclusion==='failure')out.push({kind:'bad',title:'Verifică ultimul deploy',detail:'GitHub raportează o publicare eșuată. Vezi pasul care a oprit fluxul.',href:'/command-center/#operations'});
  const health=value('health');
  if(health?.results?.some(r=>!r.ok))out.push({kind:'bad',title:'Verifică rutele cu eroare',detail:'Cel puțin una dintre rutele testate nu a trecut verificarea HTTP.',module:'health'});
  const pilot=value('autopilot');
  if(pilot?.enabled===false||pilot?.run?.conclusion==='failure')out.push({kind:'bad',title:'Verifică Auto-Pilot',detail:pilot.enabled===false?'Monitorizarea este dezactivată.':'Ultima verificare automată a eșuat.',module:'health'});
  const top=opportunities(value('gsc')?.data)[0];
  if(top)out.push({kind:'warn',title:top.query,detail:`Poziție medie ${number(top.position,1)} · ${number(top.impressions)} impresii în perioada GSC. Verifică intenția și pagina care răspunde căutării.`,module:'seo'});
  const errors=[...records.entries()].filter(([,r])=>r.status==='error');
  if(errors.length)out.push({kind:'warn',title:'Surse de date indisponibile',detail:`${errors.length} surse nu au răspuns. Verifică accesul din Conexiuni.`,href:'/command-center/connections/'});
  const sources=value('connections')?.sources;
  if(Array.isArray(sources)){
    const missing=['gsc','ga4','seranking'].filter(key=>!sources.some(s=>s.key===key&&(s.authorized||s.configured||s.state==='verified')));
    if(missing.length)out.push({kind:'warn',title:'Completează sursele de marketing',detail:'Lipsesc conexiuni pentru '+missing.map(k=>({gsc:'Search Console',ga4:'GA4',seranking:'SE Ranking'}[k])).join(', ')+'.',href:'/command-center/connections/'});
  }
  return out.slice(0,4);
}
export function operatorIntent(raw) {
  const q=String(raw).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  if(/editor|studio|modific.*(text|culo|pagina)|schimb.*(text|culo)/.test(q))return {module:'studio'};
  if(/public|deploy|backup|restaur|recovery/.test(q))return {module:'operations'};
  if(/conex|conect|autoriz/.test(q))return {module:'connections'};
  if(/priorit|recomand|impact|operator|ce facem/.test(q))return {module:'operator'};
  if(/\bqa\b|responsive|regres|secur|preview|performanta/.test(q))return {module:'qa'};
  const mappings=[['competitors',/concur|competit/],['geo',/\bai\b|geo|citari|chatgpt|peec/],['local',/maps|recenzi|review|local|google business/],['authority',/backlink|autoritate|mentiun/],['health',/sanatate|health|alert|pilot|eroare/],['revenue',/venit|lead|trafic|convers|ga4|vanzar/],['content',/continut|articol|content/],['seo',/seo|cuvinte|oportunitat|ranking|google|gsc/],['cockpit',/cockpit|panou|general/]];
  const found=mappings.find(([,re])=>re.test(q));
  return found?{module:found[0]}:null;
}

// A visual preview never unlocks the administrative APIs or copies a session.
export function isVisualPreview(location) {
  return location.protocol==='https:'&&location.hostname==='astrovip-preview-ux-compact.astrovip33.workers.dev'&&new URLSearchParams(location.search).get('preview')==='1';
}
