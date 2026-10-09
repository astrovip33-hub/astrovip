import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { handleCommandCenter } from '../command-center-api.js';
const env = { COMMAND_CENTER_TOKEN: 'admin-test', ASSETS: {} };
const originalFetch = globalThis.fetch;
const request = (path, body, auth='admin-test') => new Request('https://astrovip.ro/api/command/'+path, { method: body ? 'POST':'GET', headers: {authorization:'Bearer '+auth,'content-type':'application/json'}, ...(body ? {body:JSON.stringify(body)} : {}) });
const reply = data => Response.json(data);
const account = (toolkit,id='account1') => ({id,toolkit:{slug:toolkit},status:'ACTIVE',state:{val:{access_token:'never-return-this'}}});
async function run(path,body,extra={}) { const response=await handleCommandCenter(request(path,body),{...env,...extra});return {status:response.status,data:await response.json()}; }
test.afterEach(()=>{globalThis.fetch=originalFetch});

test('all connection routes require the existing administrative token',async()=>{
  globalThis.fetch=()=>{throw Error('provider must not be called')};
  for(const [path,body] of [['connections',null],['connect',{key:'gsc'}],['connection-test',{key:'stripe'}]]) {
    const response=await handleCommandCenter(request(path,body,'wrong'),env);
    assert.equal(response.status,401);
  }
});
test('missing secrets remain pending and cannot leak into responses',async()=>{
  const {data}=await run('connections',null,{GITHUB_ADMIN_TOKEN:'private-value'});
  assert.equal(data.sources.length,13);
  assert.equal(data.sources.find(x=>x.key==='gsc').state,'pending');
  assert.equal(data.sources.find(x=>x.key==='githubDeploy').state,'configured');
  assert.equal(data.sources.find(x=>x.key==='githubDeploy').verified,false);
  assert.equal(data.sources.find(x=>x.key==='cloudflareRuntime').state,'verified');
  assert(!JSON.stringify(data).includes('private-value'));
});
test('active OAuth is authorized, and still needs a provider test',async()=>{
  globalThis.fetch=async()=>reply({items:[account('google_search_console'),account('googledrive')]});
  const {data}=await run('connections',null,{COMPOSIO_API_KEY:'secret',DRIVE_BACKUP_FOLDER_ID:'folder'});
  assert.equal(data.sources.find(x=>x.key==='gsc').state,'authorized');
  assert.equal(data.sources.find(x=>x.key==='driveAutoBackup').configured,true);
  assert.equal(data.sources.find(x=>x.key==='gsc').verified,false);
  assert(!JSON.stringify(data).includes('never-return-this'));
});
test('disabled accounts are ignored; multiple active accounts require selection',async()=>{
  globalThis.fetch=async()=>reply({items:[{...account('google_analytics'),is_disabled:true},account('google_search_console','a'),account('google_search_console','b')]});
  const {data}=await run('connections',null,{COMPOSIO_API_KEY:'secret'});
  assert.equal(data.sources.find(x=>x.key==='ga4').state,'pending');
  const gsc=data.sources.find(x=>x.key==='gsc');
  assert.equal(gsc.authorized,false);assert.equal(gsc.canAuthorize,false);assert.match(gsc.error,/multiple_accounts/);
  const selected=await run('connections',null,{COMPOSIO_API_KEY:'secret',COMPOSIO_GOOGLE_SEARCH_CONSOLE_ACCOUNT_ID:'b'});
  assert.equal(selected.data.sources.find(x=>x.key==='gsc').account.id,'b');
});
test('Composio outages are visible and do not claim that OAuth is active',async()=>{
  globalThis.fetch=async()=>Response.json({message:'invalid secret-key-value'}, {status:401});
  const {data}=await run('connections',null,{COMPOSIO_API_KEY:'secret-key-value'});
  assert(data.discoveryError);assert(!data.sources.find(x=>x.key==='gsc').authorized);
  assert(!JSON.stringify(data).includes('secret-key-value'));
});
test('Google Ads direct API requires developer token and target account',async()=>{
  const oauth={GOOGLE_OAUTH_CLIENT_ID:'client',GOOGLE_OAUTH_CLIENT_SECRET:'secret',GOOGLE_OAUTH_REFRESH_TOKEN:'refresh'};
  const {data}=await run('connections',null,{...oauth,GOOGLE_ADS_CUSTOMER_ID:'123'});
  const ads=data.sources.find(x=>x.key==='googleAds');
  assert.equal(ads.configured,false);assert(ads.missing.includes('GOOGLE_ADS_DEVELOPER_TOKEN'));
});
test('Metricool token alone does not claim a complete connection',async()=>{
  const {data}=await run('connections',null,{METRICOOL_API_TOKEN:'private-token'});
  const source=data.sources.find(x=>x.key==='metricool');
  assert.equal(source.configured,false);assert(source.missing.includes('METRICOOL_USER_ID'));assert(source.missing.includes('METRICOOL_BLOG_ID'));
});
test('unknown providers and wrong methods cannot trigger authorization',async()=>{
  globalThis.fetch=()=>{throw Error('provider must not be called')};
  assert.equal((await run('connect',{key:'arbitrary-provider'})).status,400);
  assert.equal((await run('connection-test',{key:'arbitrary-provider'})).status,400);
  const response=await handleCommandCenter(request('connect'),env);assert.equal(response.status,405);
});
test('OAuth connect creates a temporary link with a fixed AstroVip callback',async()=>{
  let linkBody;
  globalThis.fetch=async(url,options={})=>{
    if(url.includes('/connected_accounts?'))return reply({items:[]});
    if(url.includes('/auth_configs?'))return reply({items:[{id:'config1',is_disabled:false}]});
    if(url.endsWith('/connected_accounts/link')){linkBody=JSON.parse(options.body);return reply({redirect_url:'https://connect.composio.dev/session',connected_account_id:'pending1'})}
    throw Error('Unexpected request '+url);
  };
  const {status,data}=await run('connect',{key:'driveAutoBackup'},{COMPOSIO_API_KEY:'secret'});
  assert.equal(status,201);assert.equal(data.redirectUrl,'https://connect.composio.dev/session');
  assert.equal(linkBody.user_id,'astrovip-admin');assert.equal(linkBody.callback_url,'https://astrovip.ro/command-center/connections/');
});
test('report authorization creates a read-only config instead of reusing broad defaults',async()=>{
  for(const [key,toolkit,scope] of [['gsc','google_search_console','webmasters.readonly'],['ga4','google_analytics','analytics.readonly']]) {
    let configBody,linkBody;
    globalThis.fetch=async(url,options={})=>{
      if(url.includes('/connected_accounts?'))return reply({items:[]});
      if(url.includes('/auth_configs?'))return reply({items:[{id:'broad-config',credentials:{scopes:'https://www.googleapis.com/auth/'+scope.replace('.readonly','')}}]});
      if(url.endsWith('/auth_configs')){configBody=JSON.parse(options.body);return reply({auth_config:{id:'read-only-config'}})}
      if(url.endsWith('/connected_accounts/link')){linkBody=JSON.parse(options.body);return reply({redirect_url:'https://connect.composio.dev/session'})}
      throw Error('Unexpected request '+url);
    };
    const result=await run('connect',{key},{COMPOSIO_API_KEY:'secret'});
    assert.equal(result.status,201);
    assert.equal(configBody.toolkit.slug,toolkit);
    assert.equal(configBody.auth_config.type,'use_composio_managed_auth');
    assert.equal(configBody.auth_config.credentials.scopes,'https://www.googleapis.com/auth/'+scope);
    assert.equal(linkBody.auth_config_id,'read-only-config');
  }
});
test('an existing read-only report config is reused; scope setup failure does not fall back',async()=>{
  let createCount=0;
  globalThis.fetch=async(url,options={})=>{
    if(url.includes('/connected_accounts?'))return reply({items:[]});
    if(url.includes('/auth_configs?'))return reply({items:[{id:'readonly',shared_credentials:{scopes:'https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email'}}]});
    if(url.endsWith('/auth_configs')){createCount++;throw Error('must reuse')}
    if(url.endsWith('/connected_accounts/link')){assert.equal(JSON.parse(options.body).auth_config_id,'readonly');return reply({redirect_url:'https://connect.composio.dev/session'})}
    throw Error('Unexpected request '+url);
  };
  assert.equal((await run('connect',{key:'gsc'},{COMPOSIO_API_KEY:'secret'})).status,201);
  assert.equal(createCount,0);
  globalThis.fetch=async(url)=>{
    if(url.includes('/connected_accounts?'))return reply({items:[]});
    if(url.includes('/auth_configs?'))return reply({items:[{id:'broad-config'}]});
    if(url.endsWith('/auth_configs'))return Response.json({message:'scope configuration unavailable'},{status:400});
    throw Error('must not request a broad connection');
  };
  const failed=await run('connect',{key:'gsc'},{COMPOSIO_API_KEY:'secret'});
  assert.equal(failed.status,502);assert.equal(failed.data.ok,false);
});
test('structured Composio errors are readable and still redact credentials',async()=>{
  globalThis.fetch=async(url)=>{
    if(url.includes('/connected_accounts?'))return reply({items:[]});
    if(url.includes('/auth_configs?'))return reply({items:[]});
    return Response.json({error:{message:'Invalid scopes for secret-key-value',status:400,request_id:'request1'}},{status:400});
  };
  const failed=await run('connect',{key:'gsc'},{COMPOSIO_API_KEY:'secret-key-value'});
  assert.equal(failed.status,502);assert.match(failed.data.error,/Invalid scopes/);
  assert(!failed.data.error.includes('secret-key-value'));assert(!failed.data.error.includes('[object Object]'));
});
test('conversion configuration never claims a delivered test event',async()=>{
  globalThis.fetch=()=>{throw Error('no conversion event may be sent')};
  const {data}=await run('connection-test',{key:'meta'},{META_CAPI_ACCESS_TOKEN:'private-token'});
  assert.equal(data.ok,true);assert.equal(data.verified,false);assert.equal(data.configured,true);
});
test('Stripe test reads balance and redacts secrets from provider errors',async()=>{
  globalThis.fetch=async(url,options)=>{
    assert.equal(url,'https://api.stripe.com/v1/balance');assert.equal(options.headers.authorization,'Bearer stripe-private-key');
    return reply({livemode:true,available:[{currency:'ron'},{currency:'eur'}]});
  };
  const success=await run('connection-test',{key:'stripe'},{STRIPE_SECRET_KEY:'stripe-private-key'});
  assert(success.data.verified);assert.deepEqual(success.data.data.currencies,['ron','eur']);
  globalThis.fetch=async()=>Response.json({error:{message:'Invalid stripe-private-key'}},{status:401});
  const fail=await run('connection-test',{key:'stripe'},{STRIPE_SECRET_KEY:'stripe-private-key'});
  assert.equal(fail.data.verified,false);assert(!JSON.stringify(fail).includes('stripe-private-key'));
});
test('Drive verifies folder write permission without uploading a backup',async()=>{
  let count=0;
  globalThis.fetch=async(url,options)=>{
    if(url.includes('/connected_accounts?'))return reply({items:[account('googledrive')]});
    count++;const body=JSON.parse(options.body);assert.equal(body.method,'GET');assert.match(body.endpoint,/\/drive\/v3\/files\/folder/);
    return reply({status:200,data:{name:'AstroVip backups',mimeType:'application/vnd.google-apps.folder',capabilities:{canAddChildren:true}}});
  };
  const {data}=await run('connection-test',{key:'driveAutoBackup'},{COMPOSIO_API_KEY:'secret',DRIVE_BACKUP_FOLDER_ID:'folder'});
  assert(data.verified);assert.equal(count,1);
});
test('GSC and GA4 support existing direct OAuth credentials',async()=>{
  globalThis.fetch=async(url,options)=>{
    if(url==='https://oauth2.googleapis.com/token')return reply({access_token:'google-private-token'});
    assert.equal(options.headers.authorization,'Bearer google-private-token');
    if(url.includes('webmasters'))return reply({rows:[{keys:['astrovip'],clicks:5,impressions:10,ctr:0.5,position:1}]});
    if(url.includes('runRealtimeReport'))return reply({metricHeaders:[{name:'activeUsers'}],rows:[{metricValues:[{value:'2'}]}]});
    return reply({metricHeaders:[{name:'sessions'}],rows:[{metricValues:[{value:'50'}]}]});
  };
  const oauth={GOOGLE_OAUTH_CLIENT_ID:'client',GOOGLE_OAUTH_CLIENT_SECRET:'secret',GOOGLE_OAUTH_REFRESH_TOKEN:'refresh',GA4_PROPERTY_ID:'555065363'};
  const gsc=await run('gsc',null,oauth),ga4=await run('ga4',null,oauth);
  assert.equal(gsc.data.data.auth,'google-oauth');assert.equal(gsc.data.data.summary.clicks,5);
  assert.equal(ga4.data.data.metrics.sessions,50);assert.equal(ga4.data.data.realtime.activeUsers,2);
});
test('new and edited pages have valid scripts and no duplicate element IDs',()=>{
  for(const name of ['command-center/index.html','command-center/connections/index.html','command-center/google/index.html']) {
    const html=fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
    for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(match[1],{filename:name});
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);assert.equal(ids.length,new Set(ids).size,name);
    assert.match(html,/noindex/);
  }
});
