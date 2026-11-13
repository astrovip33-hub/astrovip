from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent.parent
script=(root/'assets/premium-v11/main.js').read_text(encoding='utf8')
with sync_playwright() as p:
 for width in (390,1440):
  b=p.chromium.launch(headless=True,executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe')
  page=b.new_page(viewport={'width':width,'height':900})
  requests=[];errors=[]
  page.on('request',lambda r:requests.append(r.url))
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.route('**/assets/premium-v11/main.js',lambda route:route.fulfill(status=200,content_type='text/javascript',body=script))
  page.goto('https://astrovip.ro/',wait_until='load',timeout=45000)
  page.wait_for_timeout(2300)
  before=len([x for x in requests if 'chunk-5PWPCO7K' in x])
  page.evaluate("window.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))")
  page.wait_for_timeout(2400)
  after=len([x for x in requests if 'chunk-5PWPCO7K' in x])
  print('WIDTH',width,'HEAVY_BEFORE',before,'HEAVY_AFTER',after,'ERRORS',errors[:2],flush=True)
  assert before==0 and after>=1
  b.close()
print('DEFER TEST PASS')
