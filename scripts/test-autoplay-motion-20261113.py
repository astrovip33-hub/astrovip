from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
script=(root/'assets/services-slider-autoplay-20261112.js').read_text(encoding='utf8')
with sync_playwright() as p:
 for width,height in [(390,844),(1440,900)]:
  browser=p.chromium.launch(headless=True,executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe')
  page=browser.new_page(viewport={'width':width,'height':height},reduced_motion='no-preference')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/assets/services-slider-autoplay-20261112.js',lambda route:route.fulfill(status=200,content_type='text/javascript',body=script))
  page.goto('https://astrovip.ro/',wait_until='domcontentloaded',timeout=45000)
  page.wait_for_timeout(2200)
  track=page.locator('#av-services-slider .sv-track')
  before=track.evaluate('(e)=>({x:e.scrollLeft,ready:e.dataset.autoplayReady,cards:e.querySelectorAll(":scope > .sv-card").length})')
  page.wait_for_timeout(1700)
  after=track.evaluate('(e)=>({x:e.scrollLeft,ready:e.dataset.autoplayReady,cards:e.querySelectorAll(":scope > .sv-card").length})')
  print('WIDTH',width,'BEFORE',before,'AFTER',after,'ERRORS',errors[:3],flush=True)
  assert before['ready']=='true' and after['cards']==24 and after['x']>before['x']+15,(before,after)
  browser.close()
print('AUTOPLAY MOVEMENT VERIFIED')
