// Pure intelligence layer. A configured connector is never treated as a ranking result.
export const MODULES = [
  {id:'cockpit',label:'Executive Cockpit',eyebrow:'PRIVIRE DE ANSAMBLU',title:'Tot ce contează.',accent:'Într-o singură privire.',description:'Vizibilitate, rezultate și următoarea mișcare pentru AstroVip.',sources:['gsc','ga4','health']},
  {id:'seo',label:'Google & SEO',eyebrow:'GOOGLE INTELLIGENCE',title:'De la căutări',accent:'la oportunități.',description:'Search Console pentru performanță. SE Ranking pentru proiectul urmărit.',sources:['gsc','seranking']},
  {id:'competitors',label:'Concurență',eyebrow:'COMPETITOR WAR ROOM',title:'Concurența,',accent:'cu dovezi.',description:'Punctul de acces către proiectul SE Ranking. Comparațiile cer date SERP și exporturi de clasamente.',sources:['seranking']},
  {id:'geo',label:'Vizibilitate AI / GEO',eyebrow:'AI INTELLIGENCE',title:'AstroVip în',accent:'răspunsurile AI.',description:'Modul pregătit pentru rapoarte de vizibilitate, citări și surse AI.',sources:[]},
  {id:'local',label:'Maps & Recenzii',eyebrow:'LOCAL INTELLIGENCE',title:'Prezența locală.',accent:'Un singur profil real.',description:'Google Business Profile pentru Bulevardul Unirii 33, București.',sources:[]},
  {id:'content',label:'Conținut & Editor',eyebrow:'CONTENT STUDIO',title:'Idei susținute de date.',accent:'Control vizual simplu.',description:'Oportunități din căutări și acces direct la editorul AstroVip.',sources:['gsc']},
  {id:'authority',label:'Autoritate',eyebrow:'AUTHORITY INTELLIGENCE',title:'Încredere care',accent:'se poate verifica.',description:'Modul pregătit pentru domenii de referință, linkuri și mențiuni.',sources:[]},
  {id:'revenue',label:'Leaduri & Venituri',eyebrow:'BUSINESS INTELLIGENCE',title:'De la vizibilitate',accent:'la rezultate.',description:'Date GA4 pentru trafic, evenimente cheie, tranzacții și venit măsurat.',sources:['ga4']},
  {id:'health',label:'Sănătate & Alerte',eyebrow:'OPERATIONS INTELLIGENCE',title:'Controlul tehnic.',accent:'Cu semnale clare.',description:'Disponibilitatea rutelor, ultimul deploy și ultima verificare Auto-Pilot.',sources:['health','autopilot']},
];
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
  if(deploy?.status==='completed'&&deploy.conclusion==='failure')out.push({kind:'bad',title:'Verifică ultimul deploy',detail:'GitHub raportează o publicare eșuată. Vezi pasul care a oprit fluxul.',href:'/command-center/'});
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
  if(/editor|studio|modific.*(text|culo|pagina)|schimb.*(text|culo)/.test(q))return {href:'/command-center/site-builder/?from=v10'};
  if(/public|deploy|backup|restaur|recovery/.test(q))return {href:'/command-center/'};
  if(/conex|conect|autoriz/.test(q))return {href:'/command-center/connections/'};
  const mappings=[['competitors',/concur|competit/],['geo',/\bai\b|geo|citari|chatgpt|peec/],['local',/maps|recenzi|review|local|google business/],['authority',/backlink|autoritate|mentiun/],['health',/sanatate|health|alert|pilot|eroare/],['revenue',/venit|lead|trafic|convers|ga4|vanzar/],['content',/continut|articol|content/],['seo',/seo|cuvinte|oportunitat|ranking|google|gsc/],['cockpit',/cockpit|panou|general/]];
  const found=mappings.find(([,re])=>re.test(q));
  return found?{module:found[0]}:null;
}

// A visual preview never unlocks the administrative APIs or copies a session.
export function isVisualPreview(location) {
  return location.protocol==='https:'&&location.hostname==='astrovip-preview-ux-compact.astrovip33.workers.dev'&&new URLSearchParams(location.search).get('preview')==='1';
}
