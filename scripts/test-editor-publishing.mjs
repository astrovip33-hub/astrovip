import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {handleCommandCenter} from '../command-center-api-v3.js';

const inline=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
function page(path,extra={}){
  const nodes=new Map(),storage=new Map();
  const node=id=>{
    if(!nodes.has(id))nodes.set(id,{value:'',checked:false,disabled:false,type:'text',textContent:'',className:'',style:{},addEventListener(){},classList:{add(){},remove(){}},querySelector:()=>({textContent:''})});
    return nodes.get(id);
  };
  const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
  const ctx=vm.createContext({document:{getElementById:node,querySelector:node,querySelectorAll:()=>[]},localStorage,sessionStorage:localStorage,CSS:{escape:x=>x},URLSearchParams,location:{search:''},console,confirm:()=>true,setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,addEventListener(){},...extra});
  vm.runInContext(inline(path),ctx);
  return {ctx,node,storage,eval:code=>vm.runInContext(code,ctx)};
}
function editor({fetcher,confirm=()=>true}={}){
  const calls=[];
  const p=page('command-center/editor-original/index.html',{confirm,fetch:async(path,opt)=>{
    calls.push({path,body:JSON.parse(opt.body)});
    return fetcher?fetcher(path,opt):Response.json({ok:true,config:JSON.parse(opt.body),commit:{sha:'1234567890abcdef'}});
  }});
  p.eval("ready=true;published={hero:{titleMain:'Original'}};state=clone(published);publishedPageOverrides={version:1,pages:{}};pageOverrides=clone(publishedPageOverrides)");
  return {...p,calls};
}
const dirtyPages="pageOverrides.pages['/']=[{selector:'#title',text:'Editat',editorVersion:2}]";

test('selectors stay valid when the selection highlight is the only class',()=>{
  const e=editor();
  const h={nodeType:1,tagName:'H1',classList:[],parentElement:null,children:[]};
  const span={nodeType:1,tagName:'SPAN',classList:['av-editor-selected'],parentElement:h};h.children=[span];
  e.ctx.target=span;
  assert.equal(e.eval('selectorFor(target)'),'h1 > span');
  h.id='hero-title';assert.equal(e.eval('selectorFor(target)'),'#hero-title > span');
});
test('restored page drafts publish even without the transient changed flag',async()=>{
  const e=editor();e.eval(dirtyPages);
  const result=await e.eval('publish({confirmed:true})');
  assert.equal(result.ok,true);assert.equal(e.calls.length,1);
  assert.equal(e.calls[0].path,'/api/command/page-overrides-publish');
  assert(!e.storage.has('av_visual_editor_draft_v1'));
});
test('cancellation and unchanged content never create a commit',async()=>{
  const e=editor({confirm:()=>false});e.eval(dirtyPages);
  assert.equal((await e.eval('publish()')).cancelled,true);
  assert.equal(e.calls.length,0);
  e.eval('pageOverrides=clone(publishedPageOverrides)');
  assert.equal((await e.eval('publish({confirmed:true})')).unchanged,true);
  assert.equal(e.calls.length,0);
});
test('server failures retain the exact page draft and do not report success',async()=>{
  const e=editor({fetcher:()=>Response.json({ok:false,error:'github_unavailable'},{status:503})});e.eval(dirtyPages);
  const result=await e.eval('publish({confirmed:true})');
  assert.equal(result.ok,false);assert.equal(result.error,'github_unavailable');
  const draft=JSON.parse(e.storage.get('av_visual_editor_draft_v1'));
  assert.equal(draft.pageOverrides.pages['/'][0].text,'Editat');
  assert.match(e.node('state').textContent,/eșuată.*păstrat/);
});
test('partial publication retains pending edits and a retry skips the successful write',async()=>{
  let fail=true;
  const e=editor({fetcher:(path,opt)=>path.endsWith('page-overrides-publish')&&fail?Response.json({error:'conflict'},{status:409}):Response.json({ok:true,config:JSON.parse(opt.body),commit:{sha:'abc123456789'}})});
  e.eval("state.hero.titleMain='Titlu nou';"+dirtyPages);
  const result=await e.eval('publish({confirmed:true})');
  assert.equal(result.partial,true);assert.equal(result.commits.length,1);
  assert(e.storage.has('av_visual_editor_draft_v1'));
  fail=false;const retry=await e.eval('publish({confirmed:true})');
  assert.equal(retry.ok,true);assert.equal(e.calls.length,3);
  assert.equal(e.calls.filter(c=>c.path.endsWith('/editor-publish')).length,1);
});
test('publishing another page keeps an unpublished homepage configuration',async()=>{
  const e=editor();e.eval("currentPage='/sinastrie/';state.hero.titleMain='Draft homepage';"+dirtyPages);
  assert.equal((await e.eval('publish({confirmed:true})')).ok,true);
  assert.equal(JSON.parse(e.storage.get('av_visual_editor_draft_v1')).homepage.hero.titleMain,'Draft homepage');
});
test('a success response without a commit is not treated as publication',async()=>{
  const e=editor({fetcher:()=>Response.json({ok:true})});e.eval(dirtyPages);
  assert.equal((await e.eval('publish({confirmed:true})')).ok,false);
  assert(e.storage.has('av_visual_editor_draft_v1'));
});
test('Studio waits for the result, blocks double clicks and displays the confirmed commit',async()=>{
  let finish,calls=0;
  const gate=new Promise(resolve=>{finish=resolve});
  const b=page('command-center/site-builder/index.html',{publishMock:()=>{calls++;return gate}});
  b.eval('inner={publish:publishMock};runPreflight=()=>({bad:0})');
  const pending=b.eval('confirmPublish()');
  assert.equal(b.node('publishBtn').disabled,true);
  assert.equal(b.node('saveState').textContent,'Publicare în curs…');
  await b.eval('confirmPublish()');assert.equal(calls,1);
  finish({ok:true,commit:{sha:'abcdef123456'}});await pending;
  assert.equal(b.node('publishBtn').disabled,false);
  assert.equal(b.node('saveState').textContent,'Commit abcdef1 · deploy în așteptare');
});
test('Studio preserves failure and cancellation instead of overwriting them with a timer',async()=>{
  for(const result of [{ok:false,error:'GitHub indisponibil'},{ok:false,cancelled:true}]){
    const b=page('command-center/site-builder/index.html',{result});
    b.eval('inner={publish:async()=>result};runPreflight=()=>({bad:0})');await b.eval('confirmPublish()');
    assert.match(b.node('saveState').textContent,result.cancelled?/anulată/:/eșuată/);
    assert.equal(b.node('confirmPublishBtn').disabled,false);
  }
});
test('current homepage edits apply without reviving legacy header or decorative effects',async()=>{
  const title={textContent:'Actual',style:{}},old={textContent:'Header actual',style:{}};
  const config={pages:{'/':[{selector:'#old',text:'Header vechi'},{selector:'#title',text:'Nou',editorVersion:2,style:{color:'#e8c75f',display:'',position:'fixed'}},{selector:'invalid.',editorVersion:2,text:'Invalid'}]}};
  const window={};
  const ctx=vm.createContext({window,location:{pathname:'/'},document:{querySelector:s=>{if(s==='invalid.')throw Error('Invalid selector');return {'#title':title,'#old':old}[s]}},fetch:async()=>Response.json(config)});
  vm.runInContext(fs.readFileSync(new URL('../assets/page-overrides-runtime.js',import.meta.url),'utf8'),ctx);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(title.textContent,'Nou');assert.equal(title.style.color,'#e8c75f');assert.equal(title.style.position,undefined);
  assert.equal(old.textContent,'Header actual');
});
test('the publication API retains the new edit marker and still enforces authentication',async()=>{
  const originalFetch=globalThis.fetch;let saved;
  globalThis.fetch=async(_url,opt)=>opt.method==='PUT'?(saved=JSON.parse(Buffer.from(JSON.parse(opt.body).content,'base64').toString()),Response.json({commit:{sha:'test12345'}})):Response.json({sha:'blob123'});
  try{
    const request=token=>new Request('https://astrovip.ro/api/command/page-overrides-publish',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify({pages:{'/':[{selector:'#title',text:'Nou',editorVersion:2,style:{color:'#e8c75f'}}]}})});
    const env={COMMAND_CENTER_TOKEN:'test-admin',GITHUB_ADMIN_TOKEN:'test-github'};
    assert.equal((await handleCommandCenter(request('wrong'),env)).status,401);
    const response=await handleCommandCenter(request('test-admin'),env);assert.equal(response.status,202);
    assert.equal(saved.pages['/'][0].editorVersion,2);
    assert.equal(saved.pages['/'][0].text,'Nou');
  }finally{globalThis.fetch=originalFetch;}
});
