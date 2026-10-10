#!/usr/bin/env python3
from pathlib import Path
import re

path = Path('index.html')
html = path.read_text(encoding='utf-8', errors='ignore')

STYLE = r'''
<style id="astrovip-airy-home-preview-20261010">
/* Preview only: keep homepage focused on conversion + trust. */
body:not(.guide-page) #oferte,
body:not(.guide-page) #intrebari-frecvente,
body:not(.guide-page) #contact{
  display:none!important;
}

/* More breathing room between the sections that remain. */
body:not(.guide-page) #intrebare-gratuita,
body:not(.guide-page) #cine-analizeaza-harta,
body:not(.guide-page) #servicii,
body:not(.guide-page) #studii-de-caz-home,
body:not(.guide-page) #recenzii-google,
body:not(.guide-page) #programari{
  padding-top:clamp(72px,7vw,112px)!important;
  padding-bottom:clamp(72px,7vw,112px)!important;
}

body:not(.guide-page) #intrebare-gratuita > .wrap,
body:not(.guide-page) #cine-analizeaza-harta > .wrap,
body:not(.guide-page) #servicii > .wrap,
body:not(.guide-page) #studii-de-caz-home > .wrap,
body:not(.guide-page) #recenzii-google > .wrap,
body:not(.guide-page) #programari > .wrap{
  width:min(1080px,calc(100% - 48px))!important;
}

body:not(.guide-page) #servicii .grid,
body:not(.guide-page) #studii-de-caz-home .grid,
body:not(.guide-page) #studii-de-caz-home [class*="grid"]{
  gap:clamp(22px,3vw,34px)!important;
}

/* Reduce visual noise around section intros without deleting useful content. */
body:not(.guide-page) #servicii .title,
body:not(.guide-page) #studii-de-caz-home .title,
body:not(.guide-page) #recenzii-google .title,
body:not(.guide-page) #programari .title{
  margin-bottom:clamp(30px,4vw,48px)!important;
}

@media (max-width:820px){
  body:not(.guide-page) #intrebare-gratuita,
  body:not(.guide-page) #cine-analizeaza-harta,
  body:not(.guide-page) #servicii,
  body:not(.guide-page) #studii-de-caz-home,
  body:not(.guide-page) #recenzii-google,
  body:not(.guide-page) #programari{
    padding-top:52px!important;
    padding-bottom:52px!important;
  }

  body:not(.guide-page) #intrebare-gratuita > .wrap,
  body:not(.guide-page) #cine-analizeaza-harta > .wrap,
  body:not(.guide-page) #servicii > .wrap,
  body:not(.guide-page) #studii-de-caz-home > .wrap,
  body:not(.guide-page) #recenzii-google > .wrap,
  body:not(.guide-page) #programari > .wrap{
    width:calc(100% - 32px)!important;
  }

  body:not(.guide-page) #servicii .grid,
  body:not(.guide-page) #studii-de-caz-home .grid,
  body:not(.guide-page) #studii-de-caz-home [class*="grid"]{
    gap:20px!important;
  }
}
</style>
'''.strip()

html = re.sub(
    r'\s*<style\s+id=["\']astrovip-airy-home-preview-20261010["\'][\s\S]*?</style>\s*',
    '\n',
    html,
    flags=re.I,
)

low = html.lower()
marker = '</head>'
pos = low.rfind(marker)
if pos == -1:
    html = STYLE + '\n' + html
else:
    html = html[:pos] + STYLE + '\n' + html[pos:]

path.write_text(html, encoding='utf-8')
print('Airy homepage preview injected:', path)
