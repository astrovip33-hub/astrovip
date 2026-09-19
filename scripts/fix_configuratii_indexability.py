from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
p=root/'academia-astrologie'/'atlas-1500'/'configuratii-aspecte'/'index.html'
s=p.read_text(encoding='utf-8')
repls={
'/atlas/configuratii-aspecte/t-square/':'/atlas/configuratii-aspecte/careu-t/',
'/atlas/configuratii-aspecte/cruce-mare/':'/atlas/configuratii-aspecte/marea-cruce/',
'/atlas/configuratii-aspecte/kite/':'/atlas/configuratii-aspecte/zmeu-kite/',
'/atlas/configuratii-aspecte/thors-hammer/':'/atlas/configuratii-aspecte/ciocanul-lui-thor/',
'/atlas/configuratii-aspecte/minor-grand-trine/':'/atlas/configuratii-aspecte/leagan-cradle/',
'Minor Grand Trine / Triunghiul minor în astrologie: configurație de aspecte':'Leagăn / Cradle în astrologie: configurație de aspecte'
}
for a,b in repls.items(): s=s.replace(a,b)
p.write_text(s,encoding='utf-8')
sp=root/'sitemap.xml'; x=sp.read_text(encoding='utf-8')
for slug in ['t-square','cruce-mare','kite','thors-hammer','minor-grand-trine']:
    url=f'https://astrovip.ro/atlas/configuratii-aspecte/{slug}/'
    pat=re.compile(r'<url>\s*<loc>'+re.escape(url)+r'</loc>.*?</url>\s*',re.S)
    x,_=pat.subn('',x,count=1)
sp.write_text(x,encoding='utf-8')
print('SITEMAP_URLS',len(re.findall(r'<loc>',x)))
