"""Read-only production regression checks; no deploy or site mutation."""
from pathlib import Path
from html.parser import HTMLParser
import urllib.request
ROOT=Path(__file__).resolve().parent.parent
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.styles=0;self.scripts=0;self.images=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag=='style':self.styles+=1
  if tag=='script':self.scripts+=1
  if tag=='img':self.images.append(d)
p=Parser();p.feed((ROOT/'index.html').read_text(encoding='utf8'))
assert p.styles>0 and p.scripts>0
print('LOCAL styles',p.styles,'scripts',p.scripts,'images',len(p.images))
for path in ('/','/recenzii/','/assets/all-yellow-card-surfaces-20261031.js','/assets/home-planetary-strip-live.js'):
 req=urllib.request.Request('https://astrovip.ro'+path,headers={'User-Agent':'AstroVip-release-verification/1.0'})
 with urllib.request.urlopen(req,timeout=25) as r:
  body=r.read().decode('utf8','replace');print('LIVE',path,r.status,'bytes',len(body))
  assert r.status==200
  if path.endswith('all-yellow-card-surfaces-20261031.js'):assert 'lateCardsAdded' in body,'Latest gradient scan not deployed'
  if path.endswith('home-planetary-strip-live.js'):assert 'refreshMeta' in body,'Latest planetary refresh not deployed'
print('PRODUCTION REGRESSION CHECK PASSED')
