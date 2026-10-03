import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { chromium } from 'playwright';

await mkdir('validation-output', {recursive:true});
const browser=await chromium.launch();
const widths=[360,390,430,768,820,821,1024,1280,1440,1920];
const results=[];
const testNow=new Date();
async function prepare(width, port) {
  const context=await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
  await context.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(/planetary-ticker|planetary-hero|astronomy-engine/.test(url.pathname)) return route.abort();
    if(url.hostname==='127.0.0.1') return route.continue();
    if(url.pathname.endsWith('/booking_requests')) return route.fulfill({status:200,contentType:'application/json',body:'[]'});
    return route.abort();
  });
  const page=await context.newPage();
  await page.clock.setFixedTime(testNow);
  const errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'networkidle'});
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}#av-consent{display:none!important}'});
  await page.locator('.av-hero-v2-visual img').evaluate(img=>img.decode());
  await page.evaluate(()=>document.fonts.ready);
  return {context,page,errors};
}
for(const width of widths){
  const before=await prepare(width,8765);
  const after=await prepare(width,8766);
  const b=await before.page.locator('section.hero.av-hero-v2').screenshot({animations:'disabled'});
  const a=await after.page.locator('section.hero.av-hero-v2').screenshot({animations:'disabled'});
  await writeFile('validation-output/hero-before-'+width+'.png',b);
  await writeFile('validation-output/hero-after-'+width+'.png',a);
  const measure=page=>page.evaluate(()=>{
    const hero=document.querySelector('section.hero.av-hero-v2');
    return [hero,...hero.querySelectorAll('*')].map(el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect();
      return {tag:el.tagName,cls:el.className,x:r.x,y:r.y,w:r.width,h:r.height,
        display:s.display,font:s.font,color:s.color,background:s.background,border:s.border,objectFit:s.objectFit};
    });
  });
  const beforeStyles=await measure(before.page),afterStyles=await measure(after.page);
  assert.deepEqual(afterStyles,beforeStyles,'Hero layout/style changed at '+width);
  const ap=PNG.sync.read(a),bp=PNG.sync.read(b);
  let mismatched=0;let bounds=[ap.width,ap.height,0,0];
  for(let i=0;i<ap.data.length;i+=4) if(ap.data.slice(i,i+4).compare(bp.data.slice(i,i+4))!==0){mismatched++;const x=i/4%ap.width,y=Math.floor(i/4/ap.width);bounds=[Math.min(bounds[0],x),Math.min(bounds[1],y),Math.max(bounds[2],x),Math.max(bounds[3],y)];}
  const visualDifference=pixelmatch(ap.data,bp.data,null,ap.width,ap.height,{threshold:0.1,includeAA:false});
  console.log(JSON.stringify({width,mismatched,visualDifference,bounds,pixels:ap.width*ap.height}));
  if(visualDifference>1){
    for(const [label,p] of [['before',before.page],['after',after.page]]){
      const jpg=await p.locator('section.hero.av-hero-v2').screenshot({type:'jpeg',quality:55});
      const base=jpg.toString('base64');for(let i=0;i<base.length;i+=2000)console.log('VISUAL_'+label+'_'+width+':'+base.slice(i,i+2000));
    }
  }
  const img=await after.page.locator('.av-hero-v2-visual img').evaluate(el=>({src:el.currentSrc,w:el.naturalWidth,h:el.naturalHeight}));
  assert.ok(img.src.includes(width<=820?'signature-mobile-clean':'desktop-final'), 'Wrong responsive image');
  const oldOverflow=await before.page.evaluate(()=>document.documentElement.scrollWidth);
  const newOverflow=await after.page.evaluate(()=>document.documentElement.scrollWidth);
  assert.ok(newOverflow<=Math.max(width,oldOverflow),'New horizontal overflow at '+width);
  assert.deepEqual(after.errors.filter(x=>!before.errors.includes(x)),[],'New JS errors');
  results.push({width,mismatched,visualDifference,visualMatch:visualDifference<=1,layoutEqual:true,image:img.src.split('/').pop(),overflowBefore:oldOverflow,overflowAfter:newOverflow,existingErrors:before.errors});
  await before.context.close(); await after.context.close();
  console.log('Responsive checked '+width);
}
const {context,page}=await prepare(390,8766);
assert.equal(await page.locator('.av-checkout-actions--offer a[href*="stripe"]').count(),0);
await page.locator('[data-checkout-next="2"]').click();
assert.ok(await page.locator('[data-checkout-panel="2"]').evaluate(el=>el.classList.contains('is-active')));
let posts=0,stripe=0;
await context.route('**/rest/v1/booking_requests**',async route=>{
  if(route.request().method()==='POST'){posts++;return route.fulfill({status:201,body:''});}
  return route.fulfill({status:200,contentType:'application/json',body:'[]'});
});
await context.route('https://buy.stripe.com/**',route=>{stripe++;return route.abort();});
const date=new Date();date.setDate(date.getDate()+2);
await page.locator('#bookDate').fill(date.toISOString().slice(0,10));
await page.locator('#bookTime').selectOption('10:00');
await page.locator('#bookMode').selectOption({label:'Online'});
await page.locator('[data-checkout-next="3"]').click();
await page.locator('#bookName').fill('Validation Test');
await page.locator('#bookPhone').fill('0700000000');
await page.locator('#bookPrivacy').check();
await page.locator('[data-checkout-next="4"]').click();
assert.ok(await page.locator('a[href*="wa.me/40722128220"]').count()>0);
await page.locator('#bookingSubmit').click();
await page.waitForTimeout(700);
assert.equal(posts,1);assert.equal(stripe,1);
await writeFile('validation-output/responsive.json',JSON.stringify({results,bookingMocked:{posts,stripe}},null,2));
await context.close();await browser.close();
assert.ok(results.every(r=>r.visualMatch),'Hero pixel differences: '+JSON.stringify(results.filter(r=>!r.visualMatch)));
console.log('PASS booking with mocked API and intercepted Stripe; no real booking/payment');
