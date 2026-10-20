import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function dashboard(fetcher) {
  const nodes=new Map();
  const node=id=>{
    if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:'',value:'',className:'',style:{},disabled:false,classList:{add(){},remove(){}},focus(){}});
    return nodes.get(id);
  };
  const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)}};
  const ctx=vm.createContext({document:{getElementById:node},sessionStorage:storage(),localStorage:storage(),location:{reload(){}},fetch:fetcher,AbortSignal,Event,Date,Intl,console,setTimeout:()=>0,addEventListener(){},dispatchEvent(){}});
  const html=fs.readFileSync(new URL('../command-center/operations/index.html',import.meta.url),'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInContext(script,ctx);
  return {ctx,node,eval:code=>vm.runInContext(code,ctx)};
}
const ok=data=>Response.json(data);
function response(path) {
  if(path.endsWith('/overview'))return ok({serverTime:new Date().toISOString(),github:{apiOk:true,commit:{shortSha:'abc1234'},deploy:{conclusion:'success'}}});
  if(path.endsWith('/connections'))return ok({sources:[]});
  if(path.endsWith('/gsc'))return ok({data:{summary:{clicks:5,impressions:20,ctr:.25,position:4},queries:[]}});
  if(path.endsWith('/ga4'))return ok({data:{metrics:{sessions:4,activeUsers:2},realtime:{activeUsers:1}}});
  if(path.endsWith('/seranking'))return ok({project:{title:'AstroVip',keywordCount:7}});
  if(path.endsWith('/site-health'))return ok({ok:true,results:[{key:'homepage',ok:true,status:200}]});
  if(path.endsWith('/autopilot-status'))return ok({enabled:true,run:{id:1,conclusion:'success'}});
  if(path.endsWith('/recovery-points'))return ok({points:[]});
  return ok({ok:true});
}
test('an overview failure does not block any other dashboard module',async()=>{
  const calls=[];
  const d=dashboard(async path=>{calls.push(path);if(path.endsWith('/overview'))throw Error('GitHub unavailable');return response(path)});
  await d.eval('refreshAll()');
  assert.equal(calls.length,8);
  assert.equal(d.eval('S.overview'),null);
  assert.equal(d.eval('S.gsc.summary.clicks'),5);
  assert.equal(d.node('btxt').textContent,'Backend EROARE');
  assert.notEqual(d.node('healthScore').textContent,'100%');
});
test('repeated refresh clicks share the same set of requests',async()=>{
  let release;
  const gate=new Promise(resolve=>{release=resolve}),calls=[];
  const d=dashboard(async path=>{calls.push(path);await gate;return response(path)});
  const first=d.eval('refreshAll()'),second=d.eval('refreshAll()');
  assert.equal(first,second);assert.equal(calls.length,8);release();await first;
  assert.equal(d.node('healthScore').textContent,'100%');
});
test('failed refreshes clear old success values and health results',async()=>{
  let fail=false;
  const d=dashboard(async path=>fail?Response.json({error:'provider_down'},{status:503}):response(path));
  await d.eval('refreshAll()');
  assert.equal(d.node('gc').textContent,'5');
  fail=true;await d.eval('refreshAll()');
  for(const key of ['overview','connections','gsc','ga4','seranking','health','autopilot','recovery'])assert.equal(d.eval(`S.${key}`),null,key);
  for(const id of ['gc','gi','au','as','sp','commit','autoResult'])assert.equal(d.node(id).textContent,'—',id);
  assert.equal(d.node('healthScore').textContent,'—');
  assert.equal(d.node('ib').textContent,'NEVERIFICAT');
});
test('invalid stored audit data does not break dashboard initialization',()=>{
  const d=dashboard(async path=>response(path));
  d.ctx.localStorage.setItem('avcc_audit_v1','{"invalid":true}');
  d.eval('renderAudit();logAction("system","Verificare")');
  assert.equal(d.eval('getAudit().length'),1);
});
test('successful login clears the password field and starts a full refresh',async()=>{
  const d=dashboard(async path=>response(path));
  d.node('tok').value='private-admin-token';await d.eval('login()');
  assert.equal(d.node('tok').value,'');
  assert.equal(d.ctx.sessionStorage.getItem('avcc_v3_token'),'private-admin-token');
});
