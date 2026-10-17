import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {Sources,SESSION_KEY} from '../command-center/v10/sources.js';
import {MODULES,connectionState,opportunities,priorities,operatorIntent,number,isVisualPreview} from '../command-center/v10/intelligence.js';
import {renderRoom,workflowNavigation} from '../command-center/v10/rooms.js';
import {parseSnapshot} from '../command-center/v10/snapshot.js';

test('browser fetch retains its global receiver for authentication and module requests',async()=>{
  const original=globalThis.fetch;
  let calls=0;
  globalThis.fetch=function(){
    if(this!==globalThis)throw new TypeError('Illegal invocation');
    calls++;return Promise.resolve(Response.json({ok:true}));
  };
  try{
    const source=new Sources({token:()=> 'test-session'});
    await source.ping();
    await source.load('overview');
    assert.equal(source.records.get('overview').status,'ready');
    assert.equal(calls,2);
  }finally{globalThis.fetch=original;}
});

test('navigation shares requests and reuses data only within the five-minute cache',async()=>{
  let clock=1000,calls=0,release;
  const gate=new Promise(resolve=>{release=resolve});
  const source=new Sources({token:()=> 'test-session',now:()=>clock,fetcher:async(url,options)=>{
    calls++;assert.equal(url,'/api/command/gsc');assert.equal(options.headers.authorization,'Bearer test-session');assert.equal(options.method,undefined);
    await gate;return Response.json({data:{summary:{clicks:5}}});
  }});
  const one=source.load('gsc'),two=source.load('gsc',{force:true});
  assert.equal(one,two);release();await one;assert.equal(calls,1);
  await source.load('gsc');assert.equal(calls,1);
  clock+=300001;await source.load('gsc');assert.equal(calls,2);
});
test('an unavailable source clears its previous success without blocking other modules',async()=>{
  let fail=false;
  const source=new Sources({token:()=>'',fetcher:async url=>fail&&url.endsWith('/gsc')?Response.json({error:'secret diagnostic value'},{status:503}):Response.json({data:{value:4}})});
  await source.load('gsc');fail=true;
  await Promise.all([source.load('gsc',{force:true}),source.load('ga4')]);
  assert.equal(source.records.get('gsc').status,'error');assert.equal(source.records.get('gsc').data,null);
  assert.equal(source.records.get('ga4').status,'ready');assert(!JSON.stringify([...source.records]).includes('secret diagnostic'));
});
test('expired sessions discard every in-flight result, including late successful replies',async()=>{
  let release,expired=0;
  const gate=new Promise(resolve=>{release=resolve});
  const source=new Sources({token:()=>'',onUnauthorized:()=>expired++,fetcher:async url=>{
    if(url.endsWith('/gsc'))return Response.json({error:'unauthorized'},{status:401});
    await gate;return Response.json({data:{private:'old response'}});
  }});
  const pending=source.load('ga4');await source.load('gsc');release();await pending;
  assert.equal(expired,1);assert.equal(source.records.size,0);assert.equal(source.pending.size,0);
});
test('logout invalidates an already parsed old-session response',async()=>{
  let resolveJson;
  const source=new Sources({token:()=>'',fetcher:async()=>({ok:true,status:200,json:()=>new Promise(resolve=>{resolveJson=resolve})})});
  const pending=source.load('ga4');await new Promise(resolve=>setImmediate(resolve));
  source.clear();resolveJson({data:{private:'must disappear'}});await pending;assert.equal(source.records.size,0);
});
test('immediate fetch failures allow a later retry instead of keeping a resolved pending promise',async()=>{
  let fail=true,calls=0;
  const source=new Sources({token:()=>'',fetcher:()=>{calls++;if(fail)throw Error('network');return Response.json({ok:true})}});
  await source.load('overview');fail=false;await source.load('overview');
  assert.equal(calls,2);assert.equal(source.records.get('overview').status,'ready');
});
test('arbitrary endpoints cannot be called through the source layer',async()=>{
  const source=new Sources({fetcher:()=>{throw Error('must not fetch')}});
  await assert.rejects(source.load('deploy'),/Unknown source/);
});
test('configuration, OAuth and verified API results remain different states',()=>{
  assert.equal(connectionState({configured:true}).label,'Configurat');
  assert.equal(connectionState({authorized:true}).label,'Autorizat');
  assert.equal(connectionState({state:'verified'}).label,'Verificat');
  assert.equal(connectionState({configured:true,error:'expired'}).kind,'bad');
  assert.equal(connectionState(null).label,'Neconectat');
});
test('opportunities use valid observed queries and never convert missing data into zero',()=>{
  assert.equal(number(undefined),'—');assert.equal(number('invalid'),'—');assert.equal(number(null),'—');assert.equal(number(0),'0');
  const report={queries:[{query:'primul',position:4,impressions:60},{query:'al doilea',position:15,impressions:100},{query:'deja sus',position:1,impressions:500},{query:'fără date',position:8,impressions:0},null]};
  assert.deepEqual(opportunities(report).map(x=>x.query),['al doilea','primul']);
  assert.deepEqual(opportunities({queries:{}}),[]);
});
test('priorities use failed operations and observed search demand, not invented targets',()=>{
  const records=new Map([['overview',{status:'ready',data:{github:{deploy:{status:'completed',conclusion:'failure'}}}}],['gsc',{status:'ready',data:{data:{queries:[{query:'astrologie',position:7,impressions:50}]}}}]]);
  const result=priorities(records);assert.match(result[0].title,/deploy/);assert.equal(result[1].title,'astrologie');
  assert.deepEqual(priorities(new Map()),[]);
});
test('guided Romanian commands open known destinations without executing an AI call',()=>{
  assert.equal(operatorIntent('deschide editorul').href,'/command-center/site-builder/?from=v10');
  assert.equal(operatorIntent('Arată oportunitățile SEO').module,'seo');
  assert.equal(operatorIntent('Verifică concurența').module,'competitors');
  assert.equal(operatorIntent('vreau vizibilitate AI').module,'geo');
  assert.equal(operatorIntent('publică site-ul').href,'/command-center/');
  assert.equal(operatorIntent('comandă neacceptată'),null);
});

function builder(){
  const nodes=new Map(),listeners={};
  const node=id=>{
    if(!nodes.has(id))nodes.set(id,{value:'',checked:false,disabled:false,type:'text',textContent:'',className:'',style:{},addEventListener:(name,callback)=>{listeners[id+':'+name]=callback},classList:{add(){},remove(){}},querySelector:()=>({textContent:''}),scrollIntoView(){},matches:()=>true});
    return nodes.get(id);
  };
  const fields=new Map(),field=id=>{
    if(!fields.has(id))fields.set(id,{value:'',type:'text',checked:false});
    return fields.get(id);
  };
  let selection='heading-1';
  const inner={document:{getElementById:field},selectionKey:()=>selection,applySelectedText(){},clearSelection(){field('selectedInfo').value='';selection=''}};
  const ctx=vm.createContext({document:{getElementById:node,querySelector:node,querySelectorAll:()=>[],activeElement:null},location:{search:''},URLSearchParams,localStorage:{getItem:()=>null},console,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,confirm:()=>true,innerWindow:inner});
  const html=fs.readFileSync(new URL('../command-center/site-builder/index.html',import.meta.url),'utf8');
  vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],ctx);
  vm.runInContext('inner=innerWindow',ctx);
  return {node,field,eval:code=>vm.runInContext(code,ctx),select:value=>{selection=value;},edit:(id,value)=>{node(id).value=value;listeners['.right:input']({target:node(id)})}};
}
test('editor polling preserves an unfinished text edit across focus changes',()=>{
  const b=builder();b.field('selectedInfo').value='h2.title';b.field('selectedText').value='Original';b.eval('syncInspector()');
  b.edit('selectedText','Text premium în lucru');b.eval('syncInspector();syncInspector()');
  assert.equal(b.node('selectedText').value,'Text premium în lucru');
  b.eval('applyInspector()');assert.equal(b.field('selectedText').value,'Text premium în lucru');assert.equal(b.eval('inspectorDirty'),false);
});
test('switching identical-looking elements syncs the new selection and clears unrelated undo history',()=>{
  const b=builder();b.field('selectedInfo').value='h2.title';b.field('selectedText').value='Prima';b.eval('syncInspector()');
  b.edit('selectedText','Editat');b.eval('applyInspector()');assert.equal(b.eval('history.length'),1);
  b.select('heading-2');b.field('selectedText').value='A doua';b.eval('syncInspector()');
  assert.equal(b.node('selectedText').value,'A doua');assert.equal(b.eval('history.length'),0);
});

function marketingApp(connected=true,visual=false){
  const nodes=new Map(),events=new Map(),storage=new Map(),calls=[];
  const node=id=>{
    if(!nodes.has(id))nodes.set(id,{value:'',hidden:false,textContent:'',innerHTML:'',className:'',disabled:false,setAttribute(){},focus(){},addEventListener:(type,callback)=>events.set(id+':'+type,callback)});
    return nodes.get(id);
  };
  class AppSources extends Sources {
    constructor(options){super({...options,fetcher:async url=>{
      calls.push(url);
      if(url.endsWith('/connections'))return Response.json({sources:['gsc','ga4','seranking'].map(key=>({key,name:key,configured:connected,state:connected?'configured':'pending'}))});
      if(url.endsWith('/overview'))return Response.json({github:{commit:{shortSha:'abc1234'},deploy:{status:'completed',conclusion:'success'}}});
      if(url.endsWith('/gsc'))return Response.json({data:{range:{startDate:'2026-09-17',endDate:'2026-10-14'},summary:{clicks:17,impressions:120,position:7,ctr:.14},queries:[{query:'consultație astrologică',position:7,impressions:120,clicks:17}]}});
      if(url.endsWith('/ga4'))return Response.json({data:{period:'28daysAgo..yesterday',metrics:{sessions:75,activeUsers:50,totalRevenue:333,keyEvents:8,transactions:1}}});
      if(url.endsWith('/site-health'))return Response.json({results:[{key:'homepage',ok:true,status:200,ms:34}]});
      if(url.endsWith('/seranking'))return Response.json({project:{title:'AstroVip',keywordCount:6}});
      if(url.endsWith('/autopilot-status'))return Response.json({enabled:true,run:{conclusion:'success'}});
      return Response.json({ok:true});
    }});}
  }
  const location={hash:'#cockpit',assign(){},protocol:'https:',hostname:visual?'astrovip-preview-ux-compact.astrovip33.workers.dev':'astrovip.ro',search:visual?'?preview=1':''};
  const ctx=vm.createContext({MODULES,number,connectionState,opportunities,priorities,operatorIntent,Sources:AppSources,SESSION_KEY,Date,URLSearchParams,isVisualPreview,renderRoom,workflowNavigation,parseSnapshot,document:{getElementById:node,querySelectorAll:()=>[]},location,sessionStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},addEventListener:(type,callback)=>events.set(type,callback)});
  const js=fs.readFileSync(new URL('../command-center/v10/app.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'');
  vm.runInContext(js,ctx);
  return {node,calls,location,events,eval:code=>vm.runInContext(code,ctx),login:async()=>{node('token').value='session-test';await events.get('login-form:submit')({preventDefault(){}});await new Promise(resolve=>setImmediate(resolve));}};
}
test('the actual app renders every module through the existing authenticated read endpoints',async()=>{
  const app=marketingApp();await app.login();
  assert.equal(app.node('app').hidden,false);assert.equal(app.node('lock').hidden,true);assert.equal(app.node('token').value,'');
  assert.match(app.node('content').innerHTML,/333/);assert.match(app.node('content').innerHTML,/Benchmark necesar/);
  for(const module of MODULES){app.location.hash='#'+module.id;app.events.get('hashchange')();await new Promise(resolve=>setImmediate(resolve));assert.equal(app.node('module-caption').textContent,module.label);assert(app.node('content').innerHTML.length>100,module.id);}
  assert.equal(app.calls.filter(x=>x.endsWith('/gsc')).length,1);
  app.events.get('logout:click')();assert.equal(app.node('app').hidden,true);assert.equal(app.node('content').innerHTML,'');
});
test('the app does not request provider reports until their connections are configured',async()=>{
  const app=marketingApp(false);await app.login();
  assert(!app.calls.some(x=>/\/(gsc|ga4|seranking)$/.test(x)));
  assert.match(app.node('content').innerHTML,/Neconectat/);assert(!app.node('content').innerHTML.includes('100%'));
});

test('visual preview is limited to the explicit preview host and query flag',()=>{
  const base={protocol:'https:',hostname:'astrovip-preview-ux-compact.astrovip33.workers.dev',search:'?preview=1'};
  assert(isVisualPreview(base));
  assert(!isVisualPreview({...base,hostname:'astrovip.ro'}));
  assert(!isVisualPreview({...base,hostname:'astrovip-preview-ux-compact.astrovip33.workers.dev.example.com'}));
  assert(!isVisualPreview({...base,protocol:'http:'}));
  assert(!isVisualPreview({...base,search:''}));
});
test('visual preview renders every module without login, provider calls or refresh requests',async()=>{
  const app=marketingApp(true,true);
  assert.equal(app.node('app').hidden,false);assert.equal(app.node('lock').hidden,true);
  assert.match(app.node('session-status').textContent,/PREVIEW/);
  assert.equal(app.node('preview-notice').hidden,false);
  for(const module of MODULES){app.location.hash='#'+module.id;app.events.get('hashchange')();await new Promise(resolve=>setImmediate(resolve));assert.equal(app.node('module-caption').textContent,module.label);}
  app.events.get('refresh:click')();await new Promise(resolve=>setImmediate(resolve));
  assert.deepEqual(app.calls,[]);
  assert.equal(app.node('refresh').disabled,true);
  assert(!app.node('content').innerHTML.includes('Autentificat'));
});
