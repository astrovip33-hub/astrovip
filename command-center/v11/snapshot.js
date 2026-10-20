// Private file import is browser-local: no upload, persistence or provider calls.
export function parseSnapshot(text) {
  if(typeof text!=='string'||new TextEncoder().encode(text).length>512000)throw Error('Fișierul depășește limita de 500 KB.');
  let s;try{s=JSON.parse(text);}catch{throw Error('Fișier JSON nevalid.');}
  const str=(x,max=500)=>typeof x==='string'&&x.length>0&&x.length<=max;
  const arr=(x,max)=>Array.isArray(x)&&x.length<=max;
  const num=x=>x===null||(typeof x==='number'&&Number.isFinite(x)&&x>=0);
  const validDate=typeof s?.capturedDate==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(s.capturedDate)&&Number.isFinite(Date.parse(s.capturedDate))&&new Date(s.capturedDate).toISOString().slice(0,10)===s.capturedDate;
  const shape=s?.version===1&&s.provider==='SE Ranking'&&s.market==='RO'&&validDate&&str(s.rankContext)&&arr(s.limitations,12)&&s.limitations.every(x=>str(x))&&s.counts&&typeof s.counts==='object'&&!Array.isArray(s.counts)&&Object.values(s.counts).every(x=>Number.isSafeInteger(x)&&x>=0)&&arr(s.keywords,500)&&arr(s.serps,1000)&&arr(s.competitors,100)&&arr(s.authority,500)&&arr(s.manifest,1000);
  if(!shape)throw Error('Structură incompatibilă. Folosește exportul JSON pregătit pentru AstroVip.');
  const keywords=s.keywords.every(k=>str(k?.keyword,240)&&num(k.volume)&&num(k.difficulty)&&num(k.cpc)&&arr(k.sources,4)&&k.sources.every(x=>str(x))&&typeof k.gap==='boolean');
  const serps=s.serps.every(r=>str(r?.query,240)&&str(r.url,2000)&&typeof r.title==='string'&&r.title.length<=500&&num(r.position)&&num(r.referringDomains)&&str(r.source));
  const competitors=s.competitors.every(r=>str(r?.domain)&&num(r.trust)&&num(r.keywords)&&num(r.trafficEstimate)&&str(r.source));
  const authority=s.authority.every(r=>str(r?.domain)&&num(r.trust)&&num(r.backlinks)&&arr(r.competitors,20)&&r.competitors.every(x=>str(x))&&str(r.source));
  const manifest=s.manifest.every(r=>str(r?.file)&&Number.isSafeInteger(r.bytes)&&r.bytes>=0&&/^[a-f0-9]{64}$/.test(r.sha256)&&['parsed','archived_not_parsed'].includes(r.status)&&(r.rows===undefined||Number.isSafeInteger(r.rows)&&r.rows>=0));
  if(!keywords||!serps||!competitors||!authority||!manifest)throw Error('Raportul conține câmpuri incompatibile.');
  return {version:s.version,provider:s.provider,capturedDate:s.capturedDate,market:s.market,rankContext:s.rankContext,limitations:s.limitations,counts:s.counts,keywords:s.keywords,serps:s.serps,competitors:s.competitors,authority:s.authority,manifest:s.manifest};
}
