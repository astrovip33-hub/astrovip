import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
const samples=[];
for(const width of [390,1440]){
  for(let round=0;round<3;round++){
    for(const [label,port] of [['baseline',8768],['candidate',8769]]){
      const context=await browser.newContext({viewport:{width,height:900}});
      await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
      const page=await context.newPage();
      await page.addInitScript(()=>{
        window.__lcp=[];
        new PerformanceObserver(list=>{for(const e of list.getEntries())window.__lcp.push({time:e.startTime,url:e.url,element:e.element?.tagName});}).observe({type:'largest-contentful-paint',buffered:true});
      });
      const cdp=await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:100,downloadThroughput:200000,uploadThroughput:75000});
      await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'load'});
      await page.waitForTimeout(1200);
      const timing=await page.evaluate(()=>({
        lcp:window.__lcp.at(-1),
        fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        bytes:performance.getEntriesByType('resource').reduce((n,e)=>n+e.encodedBodySize,0)+performance.getEntriesByType('navigation')[0].encodedBodySize
      }));
      assert.ok(timing.lcp?.time>0,'Missing LCP observation');
      samples.push({width,round,label,...timing});
      console.log('PERF '+JSON.stringify(samples.at(-1)));
      await context.close();
    }
  }
}
const median=xs=>xs.slice().sort((a,b)=>a-b)[1];
const summary=[390,1440].map(width=>{
  const before=median(samples.filter(s=>s.width===width&&s.label==='baseline').map(s=>s.lcp.time));
  const after=median(samples.filter(s=>s.width===width&&s.label==='candidate').map(s=>s.lcp.time));
  return {width,before,after,changePercent:(after/before-1)*100};
});
await writeFile('validation-output/performance.json',JSON.stringify({conditions:'Chromium, fresh context, gzip level 6, 100 ms latency, 200000 bytes/s download; local synthetic comparison, not field CWV',samples,summary},null,2));
console.log('PERF_SUMMARY '+JSON.stringify(summary));
await browser.close();
assert.ok(summary.every(s=>s.after<=s.before*1.1+100),'Investigate cold-load LCP regression');
