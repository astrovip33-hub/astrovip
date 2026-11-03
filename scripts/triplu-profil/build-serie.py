#!/usr/bin/env python3
"""Preview-only first editorial batch; no sitemap or production publication."""
from pathlib import Path
import importlib.util, json, html, argparse, re
from urllib.parse import urljoin
import xml.etree.ElementTree as ET

HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser()
parser.add_argument('--publish',action='store_true',help='Prepare authorized production pages and sitemap')
PUBLISH=parser.parse_args().publish
ROOT=HERE.parents[1]
spec=importlib.util.spec_from_file_location('profiles',HERE/'build.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
data=json.loads((HERE/'serie-01.json').read_text())
signs={s[1]:s for s in m.SIGNS}
target=ROOT/m.BASE;target.mkdir(exist_ok=True)
assets=ROOT/'assets/triplu-profil';assets.mkdir(exist_ok=True)
site='https://astrovip.ro'
entries=[]
for item in data:
 a,s,l=[signs[x] for x in item['signs']]
 item['slug']=m.slug(a,s,l)
 entries.append({'slug':item['slug'],'title':m.title(a,s,l),'asc':a[1],'sun':s[1],'moon':l[1]})

css=m.CSS+'''\n.answer{border-left:3px solid #ddbc79;padding-left:22px;font-size:20px;max-width:870px}.toc{display:flex;gap:10px;flex-wrap:wrap;margin:24px 0}.toc a{font-size:14px;padding:8px 13px;border:1px solid #bba36e66;border-radius:9px;text-decoration:none}.reading{color:#becbe0;font-size:14px}.summary-line{color:#e6c784;font-size:21px}.faq details{border-top:1px solid #bba36e44;padding:16px 0}.faq summary{font-weight:700;cursor:pointer;line-height:1.5;min-height:44px}.faq p{margin:12px 0 0}.available{font-size:15px;color:#bfd1e8}.empty-result{background:#163252;border:1px solid #d8bc84;border-radius:12px;padding:16px;grid-column:1/-1}.empty-result[hidden]{display:none}.method{font-size:15px}.links .note{display:block;margin-top:8px}main img{display:block}.collection-card{display:block}.intro-link{display:inline-block;margin:12px 0}.hero{max-height:490px}.answer strong{color:#f4d392}@media(max-width:680px){.answer{font-size:18px;padding-left:15px}.hero{border-radius:14px}.summary-line{font-size:19px}.toc{gap:8px}}'''
(assets/'style.css').write_text(css)
js='''const available=AVAILABLE;
const form=document.getElementById('profile-form');
if(form){
 const message=document.getElementById('profile-status');
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const wanted='ascendent-'+form.elements.asc.value+'-soare-'+form.elements.sun.value+'-luna-'+form.elements.moon.value;
  const entry=available.find(x=>x.slug===wanted);
  if(entry){const parts=location.pathname.split('/');const i=parts.indexOf('ascendent-soare-luna');location.href=parts.slice(0,i+1).join('/')+'/'+entry.slug+'/index.html';return;}
  message.hidden=false;message.textContent='Această combinație este în pregătire. Mai jos găsești cele 12 interpretări disponibile în prima serie.';
 });
 form.addEventListener('change',()=>{message.hidden=true;});
}
'''.replace('AVAILABLE',json.dumps(entries,ensure_ascii=False))
(assets/'select.js').write_text(js)

def selector(a=0,s=0,l=0):
 return m.form(a,s,l).replace('<h2 class="selector-title">','<h2 id="alege-profilul" class="selector-title">').replace('</form>','<div id="profile-status" class="empty-result" role="status" aria-live="polite" hidden></div></form>').replace('Alege Ascendentul din lista de mai jos și navighează către combinația dorită.','Alege una dintre interpretările disponibile din lista de mai jos.').replace('Descoperă interpretarea','Vezi interpretarea')

def links(depth=0):
 prefix='../' if depth else ''
 return '<section id="profiluri"><h2>Primele 12 interpretări</h2><p class="available">Fiecare pagină combină cele trei poziții. Colecția completă are 1.728 de combinații posibile și este dezvoltată în serii.</p><div class="links">'+''.join(f'<a href="{prefix}{e["slug"]}/index.html">{m.esc(e["title"])}<span class="note">Citește interpretarea →</span></a>' for e in entries)+'</div></section>'

def doc(t,d,path,body,depth=0,crumbs=None):
 source=m.document(t,d,path,body,depth)
 graph=[{'@context':'https://schema.org','@type':'WebPage','@id':site+path+'#webpage','name':t,'description':d,'url':site+path,'inLanguage':'ro-RO','isPartOf':{'@id':site+'/#website'},'about':[{'@type':'Thing','name':'Ascendent'},{'@type':'Thing','name':'Soare în semn zodiacal'},{'@type':'Thing','name':'Lună în semn zodiacal'}]}]
 if crumbs:graph.append({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':i+1,'name':name,'item':site+url} for i,(name,url) in enumerate(crumbs)]})
 import re
 source=re.sub(r'<script type="application/ld\+json">.*?</script>','<script type="application/ld+json">'+json.dumps(graph,ensure_ascii=False)+'</script>',source,flags=re.S)
 source=source.replace('<nav aria-label="Navigare principală">','<nav aria-label="Navigare principală"><a href="'+('../index.html' if depth else 'index.html')+'">Ascendent–Soare–Lună</a>')
 source=source.replace('PREVIEW EDITORIAL · Colecție în pregătire','PREVIEW · Prima serie editorială')
 source=source.replace('<meta property="og:type"','<meta name="twitter:card" content="summary_large_image"><meta property="og:locale" content="ro_RO"><meta property="og:type"')
 if PUBLISH:
  source=source.replace('noindex,follow','index,follow,max-image-preview:large')
  source=source.replace('<p class="draft">PREVIEW · Prima serie editorială</p>','')
  source=source.replace('Text de lucru pregătit pentru verificare editorială de către Cătălin Smaranda. Revizuirea de specialitate nu este încă confirmată.','Colecția editorială AstroVip · <a href="https://astrovip.ro/despre-astrovip/">Despre metoda și experiența AstroVip</a>.')
  def normalized(match):
   href=match.group(1)
   if href.startswith(('#','https:','http:','mailto:','tel:')):return match.group(0)
   absolute=urljoin(site+path,href)
   if absolute.endswith('/index.html'):absolute=absolute[:-10]
   return 'href="'+absolute.removeprefix(site)+'"'
  source=re.sub(r'href="([^"]+)"',normalized,source)
  # Keep titles concise while retaining the full, descriptive H1.
  short=t.replace('Ascendent în ','Ascendent ').replace('Soare în ','Soare ').replace('Lună în ','Lună ').replace(' · ', ', ')
  source=re.sub(r'<title>.*?</title>','<title>'+m.esc(short)+' | AstroVip</title>',source)
 return source

def image(depth):
 prefix='../../' if depth else '../'
 return f'<img class="hero" src="{prefix}assets/triplu-profil/hero-960.webp" srcset="{prefix}assets/triplu-profil/hero-480.webp 480w, {prefix}assets/triplu-profil/hero-960.webp 960w, {prefix}assets/triplu-profil/hero.webp 1536w" sizes="(max-width:680px) calc(100vw - 36px), 1072px" width="1536" height="864" fetchpriority="high" decoding="async" alt="Ilustrație AstroVip a celor trei repere: Ascendent, Soare și Lună, în albastru cosmic și auriu">'

for item in data:
 a,s,l=[signs[x] for x in item['signs']]
 t=m.title(a,s,l);path=m.href(a,s,l)
 cards=''.join(f'<div class="card"><strong>{label}</strong><h2>{x[0]}</h2><span class="pill">{x[2].capitalize()}</span><span class="pill">{x[3].capitalize()}</span><p>{desc}</p></div>' for label,x,desc in [('ASCENDENT',a,'Cum abordezi experiența și prima interacțiune.'),('SOARE',s,'Identitatea, voința și direcția de dezvoltare.'),('LUNĂ',l,'Nevoile emoționale și reacțiile familiare.')])
 sections=''
 for id,key,heading in [('portret','portrait','Portretul combinației'),('echilibru','tension','Cum se întâlnesc cele trei nevoi'),('relatii','relationship','Relații și apropiere'),('munca','work','Muncă și resurse personale'),('exercitiu','practice','Un exercițiu de integrare')]:
  sections+=f'<section id="{id}"><h2>{heading}</h2><p>{m.esc(item[key])}</p></section>'
 q1=f'Ce aduce Luna în {l[0]} acestei combinații?'
 ans1=f'Luna în {l[0]} pune accent pe nevoia emoțională: {l[6]}. Aceasta poate fi mai puțin vizibilă în prima impresie dată de Ascendentul în {a[0]}. Pentru integrare, observă dacă direcția Soarelui în {s[0]} lasă loc acestei nevoi în viața de zi cu zi.'
 faqs=[(f'Ce înseamnă {t.lower()}?',item['answer']),(q1,ans1),('Pot deduce aspectele exacte din cele trei semne?','Nu. Semnele arată relații simbolice generale, dar un aspect exact cere longitudinile în grade și minute și un orb definit. Nici apropierea pe semne, nici apartenența la același element nu confirmă singure un aspect exact.'),('Cum aflu Ascendentul, Soarele și Luna?','Folosește data, ora și localitatea nașterii pentru calculul hărții. Ora corectă și fusul istoric contează în special pentru Ascendent și pentru pozițiile aflate aproape de schimbarea semnului. Dacă ora nu este cunoscută, nu prezenta Ascendentul drept cert.')]
 faq='<section class="faq" id="intrebari"><h2>Întrebări frecvente</h2>'+''.join(f'<details><summary>{m.esc(q)}</summary><p>{m.esc(ans)}</p></details>' for q,ans in faqs)+'</section>'
 method='<section class="method" id="metoda"><h2>Cum este construită interpretarea</h2><p>Lectura urmărește trei roluri distincte: Ascendentul pentru abordare și prezență, Soarele pentru identitate și voință, Luna pentru nevoi emoționale. Exemplul și exercițiul sunt propuneri de reflecție, nu evenimente prezise. Nu sunt deduse aspecte exacte, case sau stăpâni din simpla alegere a semnelor.</p><p>Pentru context, citește <a href="https://astrovip.ro/ascendent-in-astrologie/">ghidul Ascendentului</a> și <a href="https://astrovip.ro/harta-natala/">ghidul hărții natale</a>. Ora incertă poate necesita <a href="https://astrovip.ro/rectificarea-orei-de-nastere/">rectificarea orei de naștere</a>.</p><p class="reading">Text de lucru pregătit pentru verificare editorială de către Cătălin Smaranda. Revizuirea de specialitate nu este încă confirmată.</p></section>'
 # Avoid linking to an unverified rectification route.
 method=method.replace('Ora incertă poate necesita <a href="https://astrovip.ro/rectificarea-orei-de-nastere/">rectificarea orei de naștere</a>.','Ora incertă trebuie clarificată înaintea unei interpretări bazate pe Ascendent.')
 body=f'<nav class="crumb" aria-label="Fir de navigare"><a href="https://astrovip.ro/">Acasă</a> / <a href="../index.html">Ascendent–Soare–Lună</a></nav><p class="eyebrow">Profil astrologic · Seria 01</p><h1>{t}</h1><p class="summary-line">{m.esc(item["theme"])}</p><p class="answer"><strong>Pe scurt:</strong> {m.esc(item["answer"])}</p><p class="reading">Material educațional · Lectură simbolică generală</p>'+image(1)+'<nav class="toc" aria-label="Cuprins"><a href="#portret">Portret</a><a href="#echilibru">Echilibru</a><a href="#relatii">Relații</a><a href="#munca">Muncă</a><a href="#intrebari">Întrebări</a></nav><div class="triptych">'+cards+'</div><article>'+sections+faq+method+'<section><h2>Descoperă harta ta completă</h2><p>Cele trei semne sunt un început. Planetele, casele, aspectele și stăpânii adaugă nuanțele individuale ale hărții.</p><a class="cta" href="https://astrovip.ro/harta-mea/">Calculează harta natală</a></section></article>'+selector(m.SIGNS.index(a),m.SIGNS.index(s),m.SIGNS.index(l))+links(1)
 desc=f'Ascendent în {a[0]}, Soare în {s[0]}, Lună în {l[0]}: interpretare combinată despre identitate, emoții, relații și resurse personale.'
 dest=target/item['slug'];dest.mkdir(exist_ok=True)
 (dest/'index.html').write_text(doc(t,desc,path,body,1,[('Acasă','/'),('Ascendent–Soare–Lună','/'+m.BASE+'/'),(t,path)]))

hub='<p class="eyebrow">Colecția AstroVip · Prima serie</p><h1>Ascendent, Soare și Lună: combinații și interpretări</h1><p class="answer"><strong>Ce arată combinația?</strong> Ascendentul descrie felul în care abordezi experiența, Soarele vorbește despre identitate și direcție, iar Luna despre nevoile emoționale. Interpretarea combinată urmărește cum se susțin sau se temperează aceste trei roluri.</p>'+image(0)+selector(0,11,1)+'<p class="note">Selectorul verifică disponibilitatea interpretării. Prima serie include cele 12 profiluri de mai jos.</p><a class="cta intro-link" href="https://astrovip.ro/harta-mea/">Nu îți cunoști combinația? Calculează harta natală</a>'+links()+'<section><h2>Cum folosești colecția</h2><p>Alege cele trei semne dacă le cunoști deja. Pentru profilurile finalizate, butonul deschide direct pagina combinației. Pentru celelalte, vei primi un mesaj că interpretarea este în pregătire. Lista de profiluri rămâne accesibilă și fără JavaScript.</p><p>Dacă nu cunoști pozițiile, folosește calculatorul hărții natale existent în AstroVip, cu data, ora și localitatea nașterii. Nu estima Ascendentul din zodia solară. În apropierea schimbării semnului, un calcul precis este esențial.</p><p>Ora, gradele, casele și aspectele aduc informații care nu sunt incluse în această lectură generală. O combinație de semne nu stabilește singură profesia, compatibilitatea sau un eveniment viitor.</p></section><section><h2>De la trei repere la harta completă</h2><p>Două persoane cu aceeași combinație pot avea hărți foarte diferite. Pozițiile în case, stăpânii, demnitățile și aspectele modifică felul în care se exprimă temele generale. Folosește aceste interpretări ca punct de pornire pentru întrebări și observații personale.</p><p>Citește și <a href="https://astrovip.ro/harta-natala/">ghidul de interpretare a hărții natale</a> sau <a href="https://astrovip.ro/ascendent-in-astrologie/">explicația Ascendentului</a>.</p></section>'
(target/'index.html').write_text(doc('Ascendent, Soare și Lună: combinații și interpretări','Alege Ascendentul, Soarele și Luna și explorează primele 12 interpretări combinate AstroVip despre identitate, emoții și relații.','/'+m.BASE+'/',hub,0,[('Acasă','/'),('Ascendent–Soare–Lună','/'+m.BASE+'/')]))

# Proposed URLs are deliberately outside the live sitemap while pages are noindex.
ns='http://www.sitemaps.org/schemas/sitemap/0.9';ET.register_namespace('',ns)
xml=ET.Element('{'+ns+'}urlset')
for path in ['/'+m.BASE+'/']+['/'+m.BASE+'/'+e['slug']+'/' for e in entries]:
 node=ET.SubElement(xml,'{'+ns+'}url');ET.SubElement(node,'{'+ns+'}loc').text=site+path
ET.ElementTree(xml).write(HERE/'sitemap-proposed.xml',encoding='utf-8',xml_declaration=True)
(HERE/'manifest.json').write_text(json.dumps({'status':'preview, noindex; specialist review pending','profiles':entries,'shared_artwork':True,'live_sitemap_changed':False},ensure_ascii=False,indent=2))
if PUBLISH:
 ET.ElementTree(xml).write(ROOT/'sitemap-ascendent-soare-luna.xml',encoding='utf-8',xml_declaration=True)
 for sitemap_name in ['sitemap.xml','sitemap-index.xml']:
  sitemap=ROOT/sitemap_name;content=sitemap.read_text()
  url=site+'/sitemap-ascendent-soare-luna.xml'
  if url not in content:content=content.replace('</sitemapindex>','  <sitemap><loc>'+url+'</loc></sitemap>\n</sitemapindex>')
  sitemap.write_text(content)
 (HERE/'manifest.json').write_text(json.dumps({'status':'publication authorized; 12 profiles and hub indexable','profiles':entries,'shared_artwork':True,'sitemap':'sitemap-ascendent-soare-luna.xml','specialist_reviewer_claimed':False},ensure_ascii=False,indent=2))
print('Built 12 edited profiles + 1 hub. Mode: '+('authorized publication, indexable with sitemap' if PUBLISH else 'preview, noindex without live sitemap changes'))

# A single scoped entry card; existing service cards and sliders are preserved.
entry_css='''#av-three-profile-entry{max-width:1160px;margin:26px auto;padding:0 20px}#av-three-profile-entry .av3-link{display:grid;grid-template-columns:minmax(230px,.85fr) minmax(0,1.15fr);align-items:center;gap:28px;border:1px solid #ba985b;border-radius:22px;overflow:hidden;background:linear-gradient(120deg,#0b1d35,#174371);color:#edf3ff;text-decoration:none;box-shadow:0 15px 45px #0003}#av-three-profile-entry img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}#av-three-profile-entry .av3-copy{padding:24px 28px 24px 0;min-width:0}#av-three-profile-entry .av3-kicker{font:700 12px/1.5 system-ui;letter-spacing:2px;color:#edd49c;margin:0 0 9px}#av-three-profile-entry h2{font:700 clamp(25px,3vw,36px)/1.22 Georgia,serif;color:#f2d492;margin:0 0 12px}#av-three-profile-entry .av3-description{font:17px/1.6 system-ui;margin:0 0 18px;color:#edf3ff}#av-three-profile-entry .av3-button{display:inline-block;padding:12px 18px;min-height:46px;background:linear-gradient(110deg,#f2d9a1,#c69a52);border-radius:9px;color:#0a1c31;font:800 13px/1.6 system-ui;letter-spacing:.5px}#av-three-profile-entry .av3-link:focus-visible{outline:3px solid #8edaff;outline-offset:5px}@media(max-width:680px){#av-three-profile-entry{padding:0 16px;margin:22px auto}#av-three-profile-entry .av3-link{grid-template-columns:1fr;gap:0}#av-three-profile-entry .av3-copy{padding:22px}#av-three-profile-entry h2{font-size:27px}#av-three-profile-entry .av3-description{font-size:16px}}'''
(assets/'entry.css').write_text(entry_css)
homepage=ROOT/'index.html';source=homepage.read_text()
card='<section id="av-three-profile-entry" aria-labelledby="av-three-profile-title"><a class="av3-link" href="/ascendent-soare-luna/"><img src="/assets/triplu-profil/hero-480.webp" srcset="/assets/triplu-profil/hero-480.webp 480w, /assets/triplu-profil/hero-960.webp 960w" sizes="(max-width:680px) calc(100vw - 32px), 470px" width="480" height="270" loading="lazy" decoding="async" alt="Ascendent, Soare și Lună — colecția AstroVip"><div class="av3-copy"><p class="av3-kicker">TREI REPERE · PROFILUL TĂU ASTROLOGIC</p><h2 id="av-three-profile-title">Ascendent · Soare · Lună</h2><p class="av3-description">Descoperă cum se întâlnesc identitatea, emoțiile și felul tău de a te exprima. Alege combinația și explorează prima serie de interpretări.</p><span class="av3-button">DESCOPERĂ PROFILUL TĂU →</span></div></a></section>'
if 'id="av-three-profile-entry"' not in source:
 marker='<section class="av-offers" id="oferte"'
 assert source.count(marker)==1,'Homepage insertion point changed; inspect before integration.'
 source=source.replace(marker,card+marker,1)
if '/assets/triplu-profil/entry.css' not in source:
 source=source.replace('</head>','<link rel="stylesheet" href="/assets/triplu-profil/entry.css">\n</head>',1)
menu_link='<a href="/ascendent-soare-luna/">Ascendent–Soare–Lună</a>'
menu_marker='<div class="av-menu-more-links">'
assert source.count(menu_marker)==1,'Menu insertion point changed.'
if menu_marker+'\n'+menu_link not in source:source=source.replace(menu_marker,menu_marker+'\n'+menu_link,1)
homepage.write_text(source)
print('Homepage: one entry card and one menu link prepared; no production change.')
