import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {handleCommandCenter} from '../command-center-api.js';
import snapshot from './marketing-fixture.mjs';
import {parseSnapshot} from '../command-center/v11/snapshot.js';
import {Sources} from '../command-center/v11/sources.js';
import {moneyReport,localReport,MONEY_EVENTS} from '../command-marketing-api.js';
import {keywordCandidates,moneySummary,rankedActions,qaSignals} from '../command-center/v11/workflows.js';
import {renderRoom,workflowNavigation} from '../command-center/v11/rooms.js';
import {MODULES} from '../command-center/v11/intelligence.js';

test('new data routes enforce auth and GET before any provider or snapshot access',async()=>{
  for(const path of ['intelligence','money','local','google-ads']){
    const unauth=await handleCommandCenter(new Request('https://astrovip.ro/api/command/'+path),{COMMAND_CENTER_TOKEN:'test-admin'});
    assert.equal(unauth.status,401);
    const post=await handleCommandCenter(new Request('https://astrovip.ro/api/command/'+path,{method:'POST',headers:{authorization:'Bearer test-admin'}}),{COMMAND_CENTER_TOKEN:'test-admin'});
    assert.equal(post.status,405);
  }
  const response=await handleCommandCenter(new Request('https://astrovip.ro/api/command/intelligence',{headers:{authorization:'Bearer test-admin'}}),{COMMAND_CENTER_TOKEN:'test-admin'});
  assert.equal(response.headers.get('cache-control'),'no-store');
  assert.equal((await response.json()).data,null);
  const ignores=fs.readFileSync(new URL('../.assetsignore',import.meta.url),'utf8');
  assert(ignores.includes('command-intelligence-snapshot.js'));assert(ignores.includes('command-marketing-api.js'));
});
test('export research preserves source/date and never interprets monthly history as positions',()=>{
  assert.equal(parseSnapshot(JSON.stringify(snapshot)).capturedDate,'2026-10-17');
  assert(snapshot.manifest.every(m=>/^[a-f0-9]{64}$/.test(m.sha256)));
  assert(snapshot.keywords.every(k=>k.sources.length>0&&!/matrimonial|astrocafe|eastrolog/i.test(k.keyword)));
  assert(snapshot.serps.every(r=>r.position>=1&&r.position<=10));
  assert.equal(new Set(snapshot.keywords.map(k=>k.keyword.toLowerCase())).size,snapshot.keywords.length);
});
test('private research imports survive refresh only in memory and disappear on logout',async()=>{
  let calls=0;
  const store=new Sources({token:()=>'',fetcher:async()=>{calls++;return Response.json({ok:true})}});
  store.importSnapshot(parseSnapshot(JSON.stringify(snapshot)));
  await store.load('intelligence',{force:true});assert.equal(calls,0);
  assert.equal(store.records.get('intelligence').data.data.keywords.length,2);
  store.clear();assert.equal(store.records.size,0);
  assert.throws(()=>parseSnapshot(JSON.stringify({...snapshot,keywords:{}})),/incompat/);
  assert.throws(()=>parseSnapshot(JSON.stringify({...snapshot,capturedDate:'2026-02-31'})),/incompat/);
  assert.throws(()=>parseSnapshot('x'.repeat(512001)),/limite|limita/);
});
test('keyword filters handle diacritics, missing difficulty and gaps independently',()=>{
  const data={keywords:[{keyword:'Hartă natală',difficulty:15,gap:true},{keyword:'Numerologie',difficulty:60,gap:true},{keyword:'harta natală gratis',difficulty:25,gap:false}]};
  assert.equal(keywordCandidates(data,{query:'harta',maxDifficulty:20,gapsOnly:true}).length,1);
  assert.equal(keywordCandidates(data,{query:'inexistent'}).length,0);
});
const ga=(dimensions,metrics,values,extra={})=>({dimensionHeaders:dimensions.map(name=>({name})),metricHeaders:metrics.map(name=>({name})),rows:values.map(([d,m])=>({dimensionValues:d.map(value=>({value})),metricValues:m.map(value=>({value:String(value)}))})),rowCount:values.length,metadata:{currencyCode:'RON'},...extra});
test('every workstream module has exactly one navigation destination',()=>{
  const html=workflowNavigation(MODULES);
  for(const m of MODULES)assert.equal(html.split('href="#'+m.id+'"').length-1,1,m.id);
});
test('Money keeps event, channel and item grains separate and reports sampling/row limits',async()=>{
  const bodies=[];
  const money=await moneyReport(async body=>{
    bodies.push(body);
    const dims=body.dimensions.map(d=>d.name);
    if(dims[0]==='eventName')return ga(dims,['eventCount'],[[['whatsapp_click'],[7]],[['purchase'],[1]]]);
    if(dims[0]==='sessionSourceMedium')return ga(dims,['eventCount','totalRevenue'],[[['google / organic','purchase'],[1,333]]],{rowCount:201,metadata:{currencyCode:'RON',subjectToThresholding:true}});
    return ga(dims,['itemsPurchased','itemRevenue'],[[['Consultație'],[1,333]]]);
  },'555065363');
  assert.equal(moneySummary(money).whatsapp,7);assert.equal(moneySummary(money).phone,0);
  assert.equal(money.reports.channels.truncated,true);assert.equal(money.reports.channels.thresholded,true);
  assert.equal(money.reports.services.rows[0].itemRevenue,333);
  assert.equal(bodies[0].dimensionFilter.filter.inListFilter.values.length,Object.keys(MONEY_EVENTS).length);
  assert.deepEqual(bodies[2].metrics.map(m=>m.name),['itemsPurchased','itemRevenue']);
  assert.equal(moneySummary(null).whatsapp,null);
});
test('partial Money failure keeps remaining reports usable without provider diagnostic leakage',async()=>{
  const money=await moneyReport(async body=>{if(body.dimensions[0].name==='itemName')return ga(['itemName'],['itemRevenue'],[]);throw Error('private provider diagnostic token');},'555065363');
  assert.equal(money.ok,true);assert.equal(moneySummary(money).phone,null);
  assert.equal(money.reports.events.status,'unavailable');assert(!JSON.stringify(money).includes('private provider'));
  const unavailable=await moneyReport(async()=>{throw Error('down')},'555065363');assert.equal(unavailable.ok,false);
});
test('Local accepts only the AstroVip Unirii 33 profile, never guesses a review account',async()=>{
  const profile={name:'locations/33',title:'AstroVip',websiteUri:'https://astrovip.ro/',storefrontAddress:{addressLines:['Bulevardul Unirii 33'],locality:'București'}};
  let calls=[];
  const get=async url=>{calls.push(url);return url.includes('/reviews?')?{totalReviewCount:25,averageRating:5}:profile};
  const result=await localReport('33',{},get);assert.equal(calls.length,1);assert.equal(result.reviews.count,null);assert.equal(result.mapsRank,null);
  calls=[];const reviewed=await localReport('accounts/1/locations/33',{},get);assert.equal(calls.length,2);assert.equal(reviewed.reviews.count,25);
  await assert.rejects(()=>localReport('33',{},async()=>({...profile,storefrontAddress:{addressLines:['Unirii 44'],locality:'București'}})),/verification_required/);
  await assert.rejects(()=>localReport('33',{},async()=>({...profile,websiteUri:'https://astrovip.ro.example.com'})),/verification_required/);
});
test('operator puts outages first, labels history, and does not fabricate financial uplift',()=>{
  const records=new Map([['intelligence',{status:'ready',data:{data:snapshot}}],['health',{status:'ready',data:{checkedAt:'2026-10-18',results:[{ok:false}]}}]]);
  const actions=rankedActions(records);assert.equal(actions[0].id,'routes');assert.equal(actions[0].score,100);
  assert(actions.every(a=>a.evidence&&a.impact&&a.score<=100));
  assert(actions.filter(a=>a.id==='content-gap').every(a=>a.evidence.includes('2026-10-17')));
  assert.deepEqual(rankedActions(new Map()),[]);
  assert.equal(qaSignals(new Map()).filter(s=>s.status==='good').length,0);
});
test('rendered export strings are escaped and no raw HTML from source data becomes executable',()=>{
  const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const malicious={...snapshot,keywords:[{keyword:'<img src=x onerror=alert(1)>',volume:3,difficulty:1,sources:['<script>'],gap:true}]};
  const html=renderRoom('seo',{data:()=>({data:malicious}),number:String,badge:()=>'',link:()=>'',card:(title,body)=>body,empty:()=>'',escape,records:new Map(),filters:{query:'',maxDifficulty:100,gapsOnly:false}});
  assert(!html.includes('<img src=x'));assert(html.includes('&lt;img'));
});

test('Google Ads room exposes only confirmed control actions and hides negative keywords from quick control',()=>{
  const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ads={period:'LAST_30_DAYS',account:{name:'AstroVip',currency:'RON'},totals:{cost:25,clicks:10,averageCpc:2.5,conversions:2},campaigns:[{name:'Search',status:'ENABLED',resourceName:'customers/1112223333/campaigns/1',budgetResourceName:'customers/1112223333/campaignBudgets/2',budget:60,cost:25,clicks:10,conversions:2,sharedBudget:false}],keywords:[{text:'astrolog online',campaignName:'Search',adGroupName:'Consultatii',matchType:'PHRASE',status:'ENABLED',resourceName:'customers/1112223333/adGroupCriteria/3~4',cost:10,clicks:5,conversions:1,negative:false},{text:'gratuit',negative:true}]};
  const html=renderRoom('googleAds',{data:key=>key==='googleAds'?ads:null,number:(v,d=0)=>Number(v).toFixed(d),badge:(text)=>`<span>${escape(text)}</span>`,link:(href,label)=>`<a href="${escape(href)}">${escape(label)}</a>`,card:(title,body)=>`<section>${escape(title)}${body}</section>`,empty:(title,detail)=>escape(title+detail),escape,records:new Map(),filters:{}});
  assert(html.includes('data-ads-action="campaign_status"'));assert(html.includes('data-ads-action="budget"'));assert(html.includes('data-ads-action="keyword_status"'));
  assert(html.includes('astrolog online'));assert(!html.includes('gratuit'));assert(html.includes('25.00 RON'));
});
