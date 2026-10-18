// Full Studio -> embedded editor -> page -> API flow, with isolated local data.
// No production API or real GitHub write is contacted.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=fileURLToPath(new URL('..',import.meta.url));
const output=path.join(process.env.QA_OUTPUT||'/tmp/astrovip-marketing-qa','editor');
await fs.mkdir(output,{recursive:true});
let published={version:1,pages:{}},writes=[],fail=false;
const home={version:1,hero:{labels:['A','B','C','D'],titleMain:'AstroVip',titlePremium:'Premium',buttonUrl:'/consultatie-astrologica/'},ribbon:{items:[]},sections:{}};
const routes=new Set(['/command-center/site-builder/','/command-center/editor-original/','/assets/page-overrides-runtime.js']);
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    res.setHeader('cache-control','no-store');
    if(url.pathname.startsWith('/api/command/')){
      res.setHeader('content-type','application/json');
      if(req.headers.authorization!=='Bearer qa-session'){res.writeHead(401);res.end('{}');return;}
      const endpoint=url.pathname.split('/').at(-1);
      if(req.method==='POST'){
        let body='';for await(const chunk of req)body+=chunk;
        const data=JSON.parse(body);writes.push({endpoint,data});
        if(fail){res.writeHead(503);res.end(JSON.stringify({ok:false,error:'GitHub temporar indisponibil'}));return;}
        assert.equal(endpoint,'page-overrides-publish');published=data;
        res.writeHead(202);res.end(JSON.stringify({ok:true,config:data,commit:{sha:'abcdef123456789'}}));return;
      }
      res.end(JSON.stringify(endpoint==='editor-config'?{ok:true,config:home}:endpoint==='page-overrides'?{ok:true,config:published}:{ok:true}));return;
    }
    if(url.pathname==='/sitemap.xml'){res.setHeader('content-type','application/xml');res.end('<urlset><url><loc>http://'+req.headers.host+'/</loc></url></urlset>');return;}
    if(url.pathname==='/assets/site-page-overrides.json'){res.setHeader('content-type','application/json');res.end(JSON.stringify(published));return;}
    if(url.pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
    if(url.pathname==='/'){
      res.setHeader('content-type','text/html; charset=utf-8');
      res.end('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:24px;background:#071009;color:#fff;font:18px system-ui}h1{color:#e8c75f}a{color:inherit}</style><script>window.AstroVipVisualEditor={apply(){}}</script><script src="/assets/page-overrides-runtime.js" defer></script></head><body><main><section id="hero"><h1><span>AstroVip Premium</span></h1><p>Preview izolat pentru verificarea editorului.</p></section></main><footer><a href="#hero">Înapoi sus</a></footer></body></html>');return;
    }
    if(!routes.has(url.pathname)){res.writeHead(404);res.end();return;}
    const file=path.join(root,url.pathname.slice(1),url.pathname.endsWith('/')?'index.html':'');
    res.setHeader('content-type',file.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8');
    res.end(await fs.readFile(file));
  }catch(error){res.writeHead(500);res.end(String(error));}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true});
const checks=[];
try{
  for(const width of [390,1440]){
    published={version:1,pages:{}};writes=[];fail=false;
    const context=await browser.newContext({viewport:{width,height:900}});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('dialog',dialog=>{errors.push('Unexpected duplicate confirmation');dialog.dismiss()});
    await page.goto(origin+'/command-center/site-builder/');
    const editor=page.frameLocator('#studio'),preview=editor.frameLocator('#siteframe');
    await editor.locator('#loginToken').fill('qa-session');
    await editor.getByRole('button',{name:'Intră în editor',exact:true}).click();
    await page.locator('#bridgeState').getByText('Editor vizual conectat').waitFor();
    await editor.getByText('Preview local · nepublicat',{exact:true}).waitFor({state:'attached'});
    await preview.locator('h1 span').click();
    await page.locator('#selectedText').fill('Text premium verificat');
    await page.getByRole('button',{name:'Aplică',exact:true}).click();
    await page.locator('#publishBtn').click();
    await page.locator('#confirmPublishBtn').click();
    await page.getByText('Commit abcdef1 · deploy în așteptare',{exact:true}).waitFor();
    assert.equal(writes.length,1);assert.equal(writes[0].endpoint,'page-overrides-publish');
    assert.equal(writes[0].data.pages['/'][0].selector,'#hero > h1 > span');
    assert.equal(writes[0].data.pages['/'][0].editorVersion,2);
    await page.screenshot({path:path.join(output,'studio-'+width+'.png'),fullPage:true});
    await page.reload();
    await page.locator('#bridgeState').getByText('Editor vizual conectat').waitFor();
    await editor.getByText('Preview local · nepublicat',{exact:true}).waitFor({state:'attached'});
    await preview.getByText('Text premium verificat',{exact:true}).waitFor();
    fail=true;
    await preview.locator('h1 span').click();
    await page.locator('#selectedText').fill('Draft păstrat după eroare');
    await page.getByRole('button',{name:'Aplică',exact:true}).click();
    await page.locator('#publishBtn').click();await page.locator('#confirmPublishBtn').click();
    await page.getByText('Publicare eșuată · draft păstrat',{exact:true}).waitFor();
    const saved=await editor.locator('body').evaluate(()=>JSON.parse(localStorage.getItem('av_visual_editor_draft_v1')));
    assert.equal(saved.pageOverrides.pages['/'][0].text,'Draft păstrat după eroare');
    assert.equal(await page.locator('#publishBtn').isEnabled(),true);
    assert.deepEqual(errors,[]);checks.push({width,publish:true,reload:true,failureRetainsDraft:true,errors});
    await context.close();
  }
}finally{
  await browser.close();server.close();
  await fs.writeFile(path.join(output,'report.json'),JSON.stringify(checks,null,2));
}
console.log('Editor browser QA:',JSON.stringify(checks));
