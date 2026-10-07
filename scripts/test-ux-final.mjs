import { chromium } from 'playwright';
import fs from 'node:fs';
const base=process.env.ASTROVIP_QA_URL||'https://astrovip-preview.astrovip33.workers.dev';
const browser=await chromium.launch({headless:true});
const results=[],failures=[];
function check(value,label){if(!value)failures.push(label)}
for(const [name,path,width,height] of [
 ['ro-360','/',360,800],['ro-390','/',390,844],['ro-tablet','/',820,1180],['ro-980','/',980,900],['ro-desktop','/',1440,900],
 ...['en','es','it','zh','ar','ru'].map(lang=>[lang+'-mobile','/'+lang+'/',390,844]),['ar-desktop','/ar/',1440,900]
]){
 const context=await browser.newContext({viewport:{width,height},timezoneId:'America/New_York'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(base+path+'?ux_final=20261007-ux5',{waitUntil:'networkidle',timeout:90000});
  await page.locator('#astrovip-ux-final-css').waitFor();
  await page.waitForTimeout(600);
  const reject=page.locator('#av-consent-reject');if(await reject.isVisible().catch(()=>false))await reject.click();
  const layout=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,title:document.title,lang:document.documentElement.lang}));
  check(layout.scroll<=width+2,name+' horizontal overflow '+layout.scroll);
  const flags=page.locator('.av-lang-switch a');check(await flags.count()===7,name+' flags incomplete');
  check((await flags.all()).length===7,name+' flag routes');
  const hamb=page.locator('#hamb'),menu=page.locator('#menu');
  check(await hamb.isVisible(),name+' menu button missing');
  await hamb.click();await page.waitForTimeout(80);
  check(await hamb.getAttribute('aria-expanded')==='true',name+' menu did not open');
  check(await menu.isVisible(),name+' menu invisible');
  const geom=await menu.boundingBox();check(geom&&geom.x>=-2&&geom.x+geom.width<=width+2&&geom.y+geom.height<=height+2,name+' menu outside viewport '+JSON.stringify(geom));
  check(await page.locator('main').evaluate(el=>el.inert),name+' background is interactive during menu');
  await page.keyboard.press('Escape');
  check(await hamb.getAttribute('aria-expanded')==='false',name+' Escape did not close menu');
  check(!await page.locator('main').evaluate(el=>el.inert),name+' background remains inert');
  await hamb.click();const home=menu.locator('a').first();await home.click();
  check(await hamb.getAttribute('aria-expanded')==='false',name+' navigation does not close menu');
  await page.waitForTimeout(300);
  if(path==='/'){await hamb.click();await menu.locator('a[href="#programari"]').click();check(await hamb.getAttribute('aria-expanded')==='false',name+' booking menu stays open');check(!await page.locator('main').evaluate(el=>el.inert),name+' booking remains inert');await page.locator('header.top .brand').click();await page.waitForTimeout(300)}
  const chat=page.locator('header.top .avchat-launcher').first();await chat.click();
  const panel=page.locator('.avchat-panel');await panel.waitFor({state:'visible',timeout:15000});
  const cg=await panel.boundingBox();check(cg&&cg.x>=-2&&cg.x+cg.width<=width+2&&cg.y>=-2&&cg.y+cg.height<=height+2,name+' chat outside viewport '+JSON.stringify(cg));
  await page.locator('.avchat-close').click();
  if(path==='/'){
   const cta=page.locator('.hero [data-avux-role="primary"]');check(await cta.count()===1,name+' Hero CTA count');
   const cbox=await cta.boundingBox();check(cbox&&cbox.height>=44&&cbox.y+cbox.height<=height,name+' Hero action below fold '+JSON.stringify(cbox));
   const hero=page.locator('.hero .av-hero-v2-visual img');check(await hero.evaluate(el=>el.complete&&el.naturalWidth>0),name+' Hero did not load');
   check(await page.locator('.avux-interest-card').count()===4,name+' interest cards incomplete');
   check(await page.locator('.hero a[href*="stripe"]').count()===0,name+' premature Hero payment');
   const review=page.locator('.av-gr-actions a[href*="maps/search"]');check(await review.count()===1,name+' reviews link missing');
   for(const offer of await page.locator('.av-offer:not(.av-offer--featured)').all()){
    const anchor=offer.locator('a');check((await anchor.getAttribute('href'))?.includes('wa.me'),name+' specialized offer points to Premium checkout');
   }
   await cta.click();await page.waitForTimeout(250);
   check(await page.locator('#programari').isVisible(),name+' booking section not revealed');
   await page.locator('[data-checkout-next="2"]').click();
   check(await page.locator('[data-checkout-panel="2"]').isVisible(),name+' booking step 2 failed');
   const date=page.locator('#bookDate');const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const part=type=>parts.find(x=>x.type===type).value;
   check(await date.getAttribute('min')===`${part('year')}-${part('month')}-${part('day')}`,name+' booking day ignores Bucharest timezone');
   await page.route('**/rest/v1/booking_requests?**',route=>route.request().method()==='GET'?route.fulfill({status:200,contentType:'application/json',body:'[]'}):route.abort());
   const next=new Date(Date.now()+2*86400000).toISOString().slice(0,10);await date.fill(next);
   await page.waitForFunction(()=>!document.getElementById('bookTime').disabled);
   await page.locator('#bookTime').selectOption('12:00');await page.locator('#bookMode').selectOption({label:'Online'});
   await page.locator('[data-checkout-next="3"]').click();check(await page.locator('[data-checkout-panel="3"]').isVisible(),name+' booking step 3 failed');
   await page.locator('[data-checkout-prev="2"]').click();check(await date.inputValue()===next,name+' Back lost date');
   await page.locator('[data-checkout-prev="1"]').click();
   await page.locator('header.top .brand').click();await page.waitForTimeout(350);
  }
  await page.screenshot({path:`ux-final-${name}.png`,fullPage:false});
  results.push({name,layout,menu:geom,chat:cg,errors});check(errors.length===0,name+' JavaScript errors '+errors.join('|'));
 }catch(e){failures.push(name+' '+e.message);await page.screenshot({path:`ux-final-${name}-failure.png`}).catch(()=>{})}
 await context.close();
}
await browser.close();fs.writeFileSync('ux-final-results.json',JSON.stringify({base,results,failures},null,2));
console.log('UX_FINAL_RESULTS '+JSON.stringify({base,results,failures}));if(failures.length)process.exit(1);
