// Actual DOM/browser checks with isolated fixtures. Never contacts production APIs.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import snapshot from './marketing-fixture.mjs';
import {MODULES} from '../command-center/v10/intelligence.js';
import {MONEY_EVENTS} from '../command-marketing-api.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=fileURLToPath(new URL('..',import.meta.url));
const output=process.env.QA_OUTPUT||'/tmp/astrovip-marketing-qa';
await fs.mkdir(output,{recursive:true});
const fixture={
  ping:{ok:true},
  overview:{github:{commit:{shortSha:'fixture'},deploy:{status:'completed',conclusion:'success'}}},
  connections:{sources:['gsc','ga4','seranking','googleBusiness'].map(key=>({key,name:key,configured:true,state:'verified'}))},
  intelligence:{ok:true,data:null,importRequired:true},
  gsc:{data:{range:{startDate:'2026-09-17',endDate:'2026-10-14'},summary:{clicks:17,impressions:120,position:7,ctr:.14},queries:[{query:'consultație astrologică',position:7,impressions:120,clicks:17}]}},
  ga4:{data:{period:'28daysAgo..yesterday',metrics:{sessions:75,activeUsers:50,totalRevenue:333,keyEvents:8,transactions:1}}},
  seranking:{project:{title:'AstroVip',keywordCount:6}},
  'site-health':{checkedAt:'2026-10-18',results:[{key:'homepage',ok:true,status:200,ms:34}]},
  'autopilot-status':{enabled:true,run:{conclusion:'success'}},
  'recovery-points':{points:[{shortSha:'fixture',message:'Test restore point',date:'2026-10-18'}]},
  local:{profile:{title:'AstroVip',address:'Bulevardul Unirii 33, București'},checkedAt:'2026-10-18',reviews:{status:'ready',count:25,rating:5}},
  money:{definitions:MONEY_EVENTS,reports:{events:{status:'ready',rows:[{eventName:'whatsapp_click',eventCount:7}],currency:'RON'},channels:{status:'ready',rows:[{sessionSourceMedium:'google / organic',eventName:'whatsapp_click',eventCount:7,totalRevenue:0}],currency:'RON'},services:{status:'ready',rows:[{itemName:'Consultație',itemsPurchased:1,itemRevenue:333}],currency:'RON'}}},
};
let failMoney=false;
const apiCalls=[];
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    if(url.pathname.startsWith('/api/command/')){
      apiCalls.push(url.pathname);
      assert.equal(req.method,'GET');
      if(req.headers.authorization!=='Bearer qa-session') {res.writeHead(401);res.end('{}');return;}
      const key=url.pathname.split('/').at(-1);
      res.setHeader('content-type','application/json');
      if(key==='money'&&failMoney){res.writeHead(503);res.end('{}');return;}
      res.end(JSON.stringify(fixture[key]||{ok:true}));return;
    }
    if(!url.pathname.startsWith('/command-center/v10/')){res.writeHead(404);res.end();return;}
    let relative=decodeURIComponent(url.pathname).replace(/^\//,'');
    if(relative.endsWith('/'))relative+='index.html';
    const file=path.resolve(root,relative);
    if(!file.startsWith(path.join(root,'command-center','v10')+path.sep)){res.writeHead(403);res.end();return;}
    res.setHeader('content-type',file.endsWith('.js')?'text/javascript; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8');
    res.end(await fs.readFile(file));
  }catch{res.writeHead(500);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
const report={modules:MODULES.length,widths:[320,390,768,1024,1440],combinations:0,errors:[],screenshots:[],data:'isolated fixtures; no live private data'};
try{
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  page.on('pageerror',error=>report.errors.push(error.message));
  await page.addInitScript(()=>sessionStorage.setItem('avcc_v3_token','qa-session'));
  const origin='http://127.0.0.1:'+server.address().port;
  for(const width of report.widths){
    await page.setViewportSize({width,height:950});
    await page.goto(origin+'/command-center/v10/#intelligence');
    await page.locator('#intelligence-file').waitFor();
    await page.locator('#intelligence-file').setInputFiles({name:'qa-research.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(snapshot))});
    await page.waitForFunction(()=>document.querySelector('#content table')!==null);
    for(const module of MODULES){
      await page.evaluate(id=>{location.hash='#'+id},module.id);
      await page.waitForFunction(label=>!document.getElementById('app').hidden&&document.getElementById('module-caption').textContent===label&&document.getElementById('content').getAttribute('aria-busy')==='false'&&document.getElementById('content').innerHTML.length>100,module.label);
      assert.equal(await page.locator('#module-caption').textContent(),module.label);
      const overflow=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth}));
      assert(overflow.page<=overflow.viewport+1,`${module.id} at ${width}px overflows: ${JSON.stringify(overflow)}`);
      assert(!/\uFFFD|Ã®|Ã¢|È™|È›/.test(await page.locator('#app').innerText()),`${module.id}: encoding damage`);
      assert(!(await page.locator('#app').innerHTML()).includes('qa-session'));
      report.combinations++;
      if([390,1440].includes(width)&&['intelligence','revenue','operator'].includes(module.id)){
        const name=`${module.id}-${width}.png`;await page.screenshot({path:path.join(output,name),fullPage:true});report.screenshots.push(name);
      }
    }
  }
  await page.goto(origin+'/command-center/v10/#intelligence');
  await page.locator('#intelligence-file').setInputFiles({name:'qa-research.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(snapshot))});
  await page.locator('#research-filters').waitFor();
  await page.locator('[name=query]').fill('numerologie');
  await page.locator('[name=difficulty]').selectOption('40');
  await page.locator('#research-filters button').click();
  assert((await page.locator('#content table tbody tr').count())>0);
  const keywords=await page.locator('#content table').first().locator('tbody td:first-child strong').allTextContents();
  assert(keywords.every(k=>k.toLowerCase().includes('numerologie')));
  await page.locator('[name=query]').fill('no-such-keyword-qa');await page.locator('#research-filters button').click();
  assert((await page.locator('#content').textContent()).includes('Niciun rezultat'));
  await page.evaluate(()=>{location.hash='#competitors'});await page.locator('#serp-query').waitFor();
  await page.locator('#serp-query').selectOption('numerologie');assert((await page.locator('#content').textContent()).includes('SERP exportat — numerologie'));
  failMoney=true;await page.goto(origin+'/command-center/v10/#revenue');await page.waitForFunction(()=>document.querySelector('#content').getAttribute('aria-busy')==='false');
  assert((await page.locator('#content').textContent()).includes('Raportul de evenimente este indisponibil'));
  await page.locator('#logout').click();assert(await page.locator('#lock').isVisible());
  assert.equal(await page.locator('#content').innerHTML(),'');assert.equal(await page.evaluate(()=>sessionStorage.getItem('avcc_v3_token')),null);
  assert.equal(report.errors.length,0,report.errors.join('\n'));
  // Static delivery budget for all first-party V10 assets (uncompressed).
  let bytes=0;for(const file of ['app.js','sources.js','intelligence.js','workflows.js','rooms.js','snapshot.js','os.css'])bytes+=(await fs.stat(path.join(root,'command-center','v10',file))).size;
  report.assetBytes=bytes;assert(bytes<100000,`V10 static assets grew to ${bytes} bytes`);
  report.apiRequests=apiCalls.length;report.status='passed';
  console.log(JSON.stringify(report,null,2));
}catch(error){report.status='failed';report.failure=error.message;throw error;}
finally{await fs.writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2));if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
