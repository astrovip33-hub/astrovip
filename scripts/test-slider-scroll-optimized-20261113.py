from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
script=(root/'assets/services-slider-20261101.js').read_text(encoding='utf8')
with sync_playwright() as p:
 for width in (390,1440):
  b=p.chromium.launch(headless=True,executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe')
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='no-preference')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/assets/services-slider-20261101.js',lambda route:route.fulfill(status=200,content_type='text/javascript',body=script))
  page.goto('https://astrovip.ro/',wait_until='domcontentloaded',timeout=45000)
  page.wait_for_timeout(1800)
  root_slider=page.locator('#av-services-slider')
  root_slider.hover()
  track=root_slider.locator('.sv-track')
  initial=track.evaluate('(e)=>e.scrollLeft')
  btn=root_slider.locator('[data-sv-next]')
  btn.click(force=True)
  page.wait_for_timeout(1100)
  after=track.evaluate('(e)=>e.scrollLeft')
  print('VIEWPORT',width,'NEXT',initial,after,'ERRORS',errors[:3],flush=True)
  assert after>initial+20 and not errors[:1]
  b.close()
print('SLIDER BUTTONS PASS')
