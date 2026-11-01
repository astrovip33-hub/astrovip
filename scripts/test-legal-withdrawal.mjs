import test from 'node:test';
import assert from 'node:assert/strict';
import {handleLegalWithdrawal} from '../legal-withdrawal-api.js';
import {addLegalFooter} from '../legal-footer-runtime.js';

const body = {name:'Client Test',email:'client@example.org',contract:'Consultație Premium, comandată la 20 octombrie 2026',requestId:'8b07ad0c-e480-4c41-9aac-bc74b19e2bf6'};
const env = {LEGAL_RESEND_API_KEY:'unit-test-only',LEGAL_WITHDRAWAL_FROM:'AstroVip <contact@astrovip.ro>',LEGAL_SUBMISSION_RATE_LIMITER:{limit:async()=>({success:true})}};
function request(data=body, options={}) {return new Request('https://astrovip.ro/api/retragere-din-contract',{method:'POST',headers:{origin:'https://astrovip.ro','content-type':'application/json','cf-connecting-ip':'192.0.2.1',...options.headers},body:JSON.stringify(data)});}
const noMail = {fetch:async()=>{throw new Error('Unexpected outgoing message');},now:()=>new Date('2026-10-28T12:00:00Z')};

test('previews cannot send withdrawal messages even with configured credentials',async()=>{
  const r=await handleLegalWithdrawal(new Request('https://preview.example.org/api/retragere-din-contract',{method:'POST'}),env,noMail);
  assert.equal(r.status,409);
});
test('missing delivery configuration fails without reporting a received declaration',async()=>{
  const r=await handleLegalWithdrawal(request(),{},noMail);
  assert.equal(r.status,503);assert.equal((await r.json()).ok,false);
});
test('cross-origin and simple form requests cannot use the mail endpoint',async()=>{
  assert.equal((await handleLegalWithdrawal(request(body,{headers:{origin:'https://other.example.org'}}),env,noMail)).status,403);
  assert.equal((await handleLegalWithdrawal(request(body,{headers:{'content-type':'application/x-www-form-urlencoded'}}),env,noMail)).status,415);
});
test('rate limiting and limiter failure stop outgoing messages',async()=>{
  assert.equal((await handleLegalWithdrawal(request(),{...env,LEGAL_SUBMISSION_RATE_LIMITER:{limit:async()=>({success:false})}},noMail)).status,429);
  assert.equal((await handleLegalWithdrawal(request(),{...env,LEGAL_SUBMISSION_RATE_LIMITER:{limit:async()=>{throw Error('unavailable');}}},noMail)).status,503);
});
test('recipient injection, oversized content and honeypot submissions are rejected',async()=>{
  for(const data of [{...body,email:'victim@example.org,other@example.org'},{...body,name:'A\r\nBcc: victim@example.org'},{...body,contract:'x'.repeat(1100)},{...body,website:'spam'}]) assert.equal((await handleLegalWithdrawal(request(data),env,noMail)).status,400);
  assert.equal((await handleLegalWithdrawal(request({...body,contract:'x'.repeat(9000)}),env,noMail)).status,413);
});
test('a failed or partial mail batch never returns a false success',async()=>{
  for(const result of [new Response('{}',{status:500}),Response.json({data:[{id:'one'}]}),Response.json({data:[{id:'one'},{id:'two'}],errors:[{message:'rejected'}]})]){
    const r=await handleLegalWithdrawal(request(),env,{...noMail,fetch:async()=>result});
    assert.equal(r.status,502);assert.equal((await r.json()).ok,false);
  }
});
test('successful confirmation delivers separate copies and returns the full dated receipt',async()=>{
  let payload;
  const r=await handleLegalWithdrawal(request(),env,{...noMail,fetch:async(url,options)=>{
    assert.equal(url,'https://api.resend.com/emails/batch');payload=JSON.parse(options.body);
    return Response.json({data:[{id:'operator-id'},{id:'client-id'}]});
  }});
  assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');
  const data=await r.json();assert.equal(data.ok,true);assert.match(data.receipt,/2026-10-28T12:00:00.000Z/);assert.match(data.receipt,/Client Test/);assert.match(data.receipt,/mă retrag/);
  assert.deepEqual(payload.map(x=>x.to),[['contact@astrovip.ro'],['client@example.org']]);
  assert.equal(payload[0].text,payload[1].text);assert.equal(payload[0].reply_to,'client@example.org');assert.equal(payload[1].reply_to,'contact@astrovip.ro');
});
test('footer enhancement does not touch admin, widgets or the standalone legal pages',()=>{
  for(const path of ['/command-center/','/chat-admin/','/widget-planete.html','/preview/example/','/termeni-si-conditii/','/retragere-din-contract/']){
    const rewriter={on(){throw Error(`Unexpected rewrite: ${path}`);}};
    assert.equal(addLegalFooter(rewriter,path),rewriter);
  }
});
test('the footer includes identity and withdrawal access once without adding a second navigation on the Orbit homepage',()=>{
  const handlers={};const rewriter={on(selector,handler){handlers[selector]=handler;return this;}};
  addLegalFooter(rewriter,'/');
  let markup='';const el={getAttribute:name=>name==='class'?'avf-footer':null,append:html=>{markup+=html;}};
  handlers.footer.element(el);handlers.footer.element(el);
  assert.equal((markup.match(/data-legal-operator/g)||[]).length,1);assert.match(markup,/50191527/);assert.doesNotMatch(markup,/<nav/);
  let nav='';handlers['.avf-legal nav'].element({setInnerContent:html=>{nav=html;}});
  assert.match(nav,/termeni-si-conditii/);assert.match(nav,/retragere-din-contract/);assert.match(nav,/reclamatiisal.anpc.ro/);assert.match(nav,/av-consent-manage/);
});
