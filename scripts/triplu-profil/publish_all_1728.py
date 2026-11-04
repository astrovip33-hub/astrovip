from pathlib import Path
import importlib.util, itertools, json, re, tempfile, xml.etree.ElementTree as ET

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
BASE="ascendent-soare-luna"
SITE="https://astrovip.ro"
spec=importlib.util.spec_from_file_location("templates", HERE/"build.py")
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
manifest_path=HERE/"manifest.json"
manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
curated={x["slug"] for x in manifest["profiles"]}
assert len(curated)==24
signs=[s[1] for s in m.SIGNS]
from review_gate import load_promotions, render_reviewed_profile
promotions = load_promotions()  # Fail closed on missing/modified editorial approvals.

with tempfile.TemporaryDirectory(prefix="astrovip-asl-") as tempdir:
    tmp=Path(tempdir)
    m.build(tmp)
    for a,s,l in itertools.product(m.SIGNS,repeat=3):
        slug=m.slug(a,s,l)
        if slug in curated:
            continue
        dest=ROOT/BASE/slug/"index.html"
        if dest.exists() and slug not in promotions:
            existing=dest.read_text(encoding="utf-8")
            if ('name="robots" content="noindex,follow"' not in existing
                or existing.count("<h1>") != 1
                or f'rel="canonical" href="{SITE}/{BASE}/{slug}/"' not in existing):
                raise ValueError("Invalid existing automated profile "+str(dest))
            continue
        src=(tmp/BASE/slug/"index.html").read_text(encoding="utf-8")
        src=src.replace('<p class="draft">PREVIEW EDITORIAL · Colecție în pregătire</p>','<p class="reading">Profil orientativ generat automat, nerevizuit individual</p>')
        src=src.replace('<nav aria-label="Navigare principală">','<nav aria-label="Navigare principală"><a href="/ascendent-soare-luna/">Toate combinațiile</a>',1)
        src=src.replace('src="../../assets/triplu-profil/hero.webp" width="1536" height="864"','src="../../assets/triplu-profil/hero-960.webp" srcset="../../assets/triplu-profil/hero-480.webp 480w, ../../assets/triplu-profil/hero-960.webp 960w, ../../assets/triplu-profil/hero.webp 1536w" sizes="(max-width:680px) calc(100vw - 36px), 1072px" width="1536" height="864"')
        src=src.replace('</article>','<section><h2>Limitele lecturii pe semne</h2><p>Aceste trei poziții oferă repere simbolice generale, nu o analiză personalizată a hărții. Aspectele exacte nu se deduc din semne: sunt necesare longitudinile în grade și minute și orburi stabilite. Interpretările nu determină profesia, destinul sau compatibilitatea. Pentru analiza individuală, verifică data, ora și localitatea nașterii și calculează toate pozițiile, casele, stăpânii și aspectele.</p><p>Acest text a fost compus automat pe baza unor explicații astrologice generale; nu este prezentat ca fiind revizuit individual de un astrolog. Consultă și <a href="/harta-mea/">calculatorul hărții natale</a>.</p></section></article>',1)
        if slug in promotions:
            src=render_reviewed_profile(src,promotions[slug])
            assert 'name="robots" content="index,follow,max-image-preview:large"' in src
        else:
            assert 'name="robots" content="noindex,follow"' in src
        assert src.count("<h1>")==1
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_text(src,encoding="utf-8")
    for sign in m.SIGNS:
        name,key=sign[:2]
        dest=ROOT/BASE/("ascendent-"+key)/"index.html"
        if dest.exists():
            existing=dest.read_text(encoding="utf-8")
            if ('name="robots" content="index,follow' not in existing
                or existing.count("<h1>") != 1
                or f'rel="canonical" href="{SITE}/{BASE}/ascendent-{key}/"' not in existing):
                raise ValueError("Invalid existing Ascendant hub "+str(dest))
            continue
        src=(tmp/BASE/("ascendent-"+key)/"index.html").read_text(encoding="utf-8")
        title="Ascendent "+name+": 144 combinații Soare–Lună | AstroVip"
        desc=("Explorează cele 144 de combinații Soare și Lună cu Ascendent în "+name+
              ". Alege pozițiile și citește interpretările simbolice AstroVip pentru profilul tău.")
        assert 25<=len(title)<=70 and 100<=len(desc)<=180,(title,desc)
        src=src.replace('name="robots" content="noindex,follow"','name="robots" content="index,follow,max-image-preview:large"',1)
        src=src.replace('<p class="draft">PREVIEW EDITORIAL · Colecție în pregătire</p>','',1)
        src=re.sub(r'<title>.*?</title>','<title>'+m.esc(title)+'</title>',src,count=1)
        src=re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="'+m.esc(desc)+'">',src,count=1)
        src=re.sub(r'<meta property="og:description" content="[^"]*">','<meta property="og:description" content="'+m.esc(desc)+'">',src,count=1)
        src=src.replace("<h1>Ascendent în "+name+"</h1>",
           "<h1>Ascendent în "+name+": toate combinațiile</h1>"
           "<p>Ascendentul în "+name+" vorbește simbolic despre felul în care te apropii de experiențe noi și despre stilul exterior. Soarele reprezintă direcția conștientă și identitatea, iar Luna nevoile emoționale și reacțiile familiare. Cele 12 semne solare pot fi combinate cu cele 12 semne lunare, rezultând 144 de variante pentru acest Ascendent.</p>"
           "<p>Folosește lista pentru a găsi exact cele trei semne din harta natală. Profilurile generate automat oferă interpretări orientative, fără analiză personală a gradelor și a caselor. Ora nașterii este esențială pentru stabilirea Ascendentului. Dacă nu o cunoști, nu deduce Ascendentul din zodia solară; poți porni de la <a href='/harta-mea/'>calculatorul hărții natale</a>.</p>",1)
        dest.parent.mkdir(parents=True,exist_ok=True)
        dest.write_text(src,encoding="utf-8")

hubfile=ROOT/BASE/"index.html"
hub=hubfile.read_text(encoding="utf-8")
tiles="".join('<a href="/'+BASE+'/ascendent-'+s[1]+'/">Ascendent în '+s[0]+'<span class="note">144 de combinații</span></a>' for s in m.SIGNS)
full='<section id="av-asl-full-collection"><h2>Explorează toate cele 1.728 de combinații</h2><p>Alege cele trei semne din selector sau pornește de la Ascendentul tău. Cele 24 de interpretări editoriale sunt păstrate, iar celelalte 1.704 profiluri sunt accesibile ca lecturi orientative compuse automat, fără indexare până la revizie.</p><div class="links">'+tiles+'</div><p class="note">Pentru un Ascendent exact este necesară ora nașterii.</p></section>'
assert '<section id="profiluri">' in hub
if 'id="av-asl-full-collection"' not in hub:
    hub=hub.replace('<section id="profiluri">',full+'<section id="profiluri">',1)
hub=hub.replace('<h2>24 de interpretări disponibile</h2>','<h2>24 de interpretări editoriale</h2>')
hub=hub.replace('Selectorul verifică disponibilitatea interpretării. Sunt disponibile 24 de profiluri, în două serii editoriale.','Selectorul deschide toate cele 1.728 de combinații. Cele 24 de interpretări de mai jos au conținut editorial distinct.')
hub=hub.replace('Alege cele trei semne dacă le cunoști deja. Pentru profilurile finalizate, butonul deschide direct pagina combinației. Pentru celelalte, vei primi un mesaj că interpretarea este în pregătire.','Alege cele trei semne dacă le cunoști deja. Selectorul deschide direct orice combinație.')
hubfile.write_text(hub,encoding="utf-8")
(ROOT/"assets/triplu-profil/select.js").write_text(
"const form=document.getElementById('profile-form');if(form){form.addEventListener('submit',function(e){e.preventDefault();const f=form.elements;location.href='/ascendent-soare-luna/ascendent-'+f.asc.value+'-soare-'+f.sun.value+'-luna-'+f.moon.value+'/';});}\n",encoding="utf-8")
ns="http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("",ns)
x=ET.Element("{"+ns+"}urlset")
urls=[SITE+"/"+BASE+"/"]+[SITE+"/"+BASE+"/"+p["slug"]+"/" for p in manifest["profiles"]]+[SITE+"/"+BASE+"/ascendent-"+s+"/" for s in signs]+[SITE+"/"+BASE+"/"+slug+"/" for slug in promotions]
assert len(urls)==37+len(promotions) and len(set(urls))==len(urls)
for url in urls:
    node=ET.SubElement(x,"{"+ns+"}url")
    ET.SubElement(node,"{"+ns+"}loc").text=url
ET.ElementTree(x).write(ROOT/"sitemap-ascendent-soare-luna.xml",encoding="utf-8",xml_declaration=True)
manifest.update({"status":f"1728 public profiles; 24 curated plus {len(promotions)} independently QA-approved profiles indexable; {1704-len(promotions)} remain noindex; 12 indexed Ascendant hubs","public_profiles":1728,"curated_indexable_profiles":24,"approved_indexable_profiles":len(promotions),"automated_noindex_profiles":1704-len(promotions),"indexable_ascendant_hubs":12,"collection_pages":1741,"sitemap_urls":len(urls)})
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
paths=list((ROOT/BASE).glob("ascendent-*-soare-*-luna-*/index.html"))
assert len(paths)==1728,len(paths)
assert len([p for p in (ROOT/BASE).glob("ascendent-*/index.html") if p.parent.name in {"ascendent-"+s for s in signs}])==12
assert all('noindex' in p.read_text(encoding="utf-8") for p in paths if p.parent.name not in curated and p.parent.name not in promotions)
assert all('name="robots" content="index,follow' in p.read_text(encoding="utf-8") for p in paths if p.parent.name in promotions)
assert all('name="robots" content="index' in (ROOT/BASE/("ascendent-"+s)/"index.html").read_text(encoding="utf-8") for s in signs)
print(json.dumps({"profiles":len(paths),"curated":len(curated),"promoted":len(promotions),"auto_noindex":1704-len(promotions),"ascendant_hubs":12,"sitemap_urls":len(urls),"total_html_pages":1741}))