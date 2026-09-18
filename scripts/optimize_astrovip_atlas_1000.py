#!/usr/bin/env python3
from pathlib import Path
import re, html, json

ROOT=Path(__file__).resolve().parents[1]
BASE="https://astrovip.ro"
DATE="2026-09-18"

CLUSTERS={
"planete-in-semne":("Planete în semne","120 interpretări natale care combină funcția fiecărei planete cu stilul celor 12 semne."),
"planete-in-case":("Planete în case","120 interpretări despre modul în care planetele se exprimă în cele 12 domenii ale hărții."),
"aspecte-natale":("Aspecte natale","90 de combinații planetare explicate prin mecanismul conjuncției, opoziției, cuadraturii, trigonului și sextilului."),
"tranzite":("Tranzite prin case","60 de ghiduri despre planetele lente traversând casele natale."),
"arce-solare":("Arce Solare","60 de contacte de Arc Solar explicate prin funcția planetei direcționate și punctul natal activat."),
"sinastrie":("Sinastrie – aspecte","50 de aspecte între planetele a două persoane, analizate relațional."),
"guvernatori-case":("Guvernatori de case","120 de ghiduri despre o planetă ca stăpână a fiecăreia dintre cele 12 case."),
"revolutie-solara-case":("Revoluție Solară – planete în case","120 de ghiduri pentru planetele din casele Revoluției Solare."),
"tranzite-in-semne":("Tranzite prin semne","120 de ghiduri despre tranzitul planetelor prin cele 12 semne zodiacale."),
"sinastrie-case":("Sinastrie – planete în case","80 de ghiduri despre suprapunerea planetelor în casele partenerului."),
"planete-axe":("Planete și axe ASC/MC","60 de aspecte dintre planete și Ascendent/MC, cu accent pe oră și orb."),
}

def get_title(text,path):
    m=re.search(r"<h1>(.*?)</h1>",text,re.S|re.I)
    if m:
        return re.sub(r"<[^>]+>","",m.group(1)).strip()
    return path.parent.name.replace("-"," ").title()

def ensure_old_page_optimization(path, cluster_slug, siblings):
    text=path.read_text(encoding="utf-8")
    title=get_title(text,path)
    url=f"{BASE}/"+str(path.parent.relative_to(ROOT)).replace("\\","/")+"/"
    if '<meta name="author"' not in text:
        text=text.replace('<meta name="robots"', '<meta name="author" content="Cătălin Smaranda"><meta name="robots"',1)
    if '"@type":"BreadcrumbList"' not in text:
        schema={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
          {"@type":"ListItem","position":1,"name":"AstroVip","item":f"{BASE}/"},
          {"@type":"ListItem","position":2,"name":"Academia AstroVip","item":f"{BASE}/academia-astrologie/"},
          {"@type":"ListItem","position":3,"name":"Atlas AstroVip 1000","item":f"{BASE}/academia-astrologie/atlas-1000/"},
          {"@type":"ListItem","position":4,"name":CLUSTERS[cluster_slug][0],"item":f"{BASE}/academia-astrologie/atlas-1000/{cluster_slug}/"},
          {"@type":"ListItem","position":5,"name":title,"item":url}]}
        text=text.replace("</head>",f'<script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script></head>',1)
    text=text.replace('/academia-astrologie/atlas-500/','/academia-astrologie/atlas-1000/')
    marker='data-atlas-cluster-nav="1"'
    if marker not in text:
        idx=siblings.index(path)
        picks=[]
        for off in (-2,-1,1,2):
            j=idx+off
            if 0<=j<len(siblings):
                sp=siblings[j]
                st=get_title(sp,sp)
                href="/"+str(sp.parent.relative_to(ROOT)).replace("\\","/")+"/"
                picks.append((href,st))
        links=''.join(f'<a href="{u}">{html.escape(t)}</a>' for u,t in picks)
        nav=f'<section {marker}><h2>Explorează același cluster</h2><p>Continuă cu interpretări apropiate din clusterul {html.escape(CLUSTERS[cluster_slug][0])}.</p><div class="kb-links"><a href="/academia-astrologie/atlas-1000/{cluster_slug}/">Indexul clusterului</a>{links}</div></section>'
        if "<section><h2>Întrebări frecvente</h2>" in text:
            text=text.replace("<section><h2>Întrebări frecvente</h2>",nav+"<section><h2>Întrebări frecvente</h2>",1)
        elif "<section><h2>Continuă documentarea</h2>" in text:
            text=text.replace("<section><h2>Continuă documentarea</h2>",nav+"<section><h2>Continuă documentarea</h2>",1)
        else:
            text=text.replace("</article>",nav+"</article>",1)
    path.write_text(text,encoding="utf-8")

def hub_page(cluster_slug, entries):
    name,desc=CLUSTERS[cluster_slug]
    url=f"{BASE}/academia-astrologie/atlas-1000/{cluster_slug}/"
    itemlist={"@context":"https://schema.org","@type":"CollectionPage","name":name,"description":desc,"url":url,
      "mainEntity":{"@type":"ItemList","numberOfItems":len(entries),"itemListElement":[
        {"@type":"ListItem","position":i+1,"name":t,"url":f"{BASE}{u}"} for i,(u,t) in enumerate(entries)]}}
    cards=''.join(f'<a class="kb-tile" href="{u}"><strong>{html.escape(t)}</strong><span>Ghid AstroVip · Atlas 1000</span></a>' for u,t in entries)
    return f"""<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(name)} | Atlas AstroVip 1000</title><meta name="description" content="{html.escape(desc)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<link rel="canonical" href="{url}"><link rel="stylesheet" href="/assets/knowledge-premium.css?v=20260918"><link rel="stylesheet" href="/assets/academy-neon.css?v=20260918-1">
<script type="application/ld+json">{json.dumps(itemlist,ensure_ascii=False)}</script></head><body>
<header class="kb-head"><div class="kb-wrap kb-nav"><a class="kb-brand" href="/">ASTROVIP</a><nav><a href="/academia-astrologie/">Academia</a><a href="/academia-astrologie/atlas-1000/">Atlas 1000</a><a href="/biblioteca-astrologie/">Bibliotecă</a></nav></div></header>
<main><section class="kb-hero"><div class="kb-wrap"><div class="kb-kicker">Atlas AstroVip 1000 · {len(entries)} pagini</div><h1>{html.escape(name)}</h1><p>{html.escape(desc)}</p></div></section>
<div class="kb-wrap"><section><div class="kb-grid">{cards}</div></section><section><h2>Înapoi la Atlas</h2><div class="kb-links"><a href="/academia-astrologie/atlas-1000/">Toate clusterele Atlas 1000</a><a href="/academia-astrologie/">Academia AstroVip</a></div></section></div></main>
<footer class="kb-foot"><div class="kb-wrap"><strong>AstroVip</strong> · Atlas 1000</div></footer></body></html>"""

all_entries={}
all_pages=[]
for cluster_slug in CLUSTERS:
    d=ROOT/"atlas"/cluster_slug
    files=sorted(d.glob("*/index.html")) if d.exists() else []
    entries=[]
    for p in files:
        txt=p.read_text(encoding="utf-8")
        t=get_title(txt,p)
        u="/"+str(p.parent.relative_to(ROOT)).replace("\\","/")+"/"
        entries.append((u,t))
    all_entries[cluster_slug]=entries
    all_pages.extend(files)
    if entries:
        out=ROOT/"academia-astrologie"/"atlas-1000"/cluster_slug/"index.html"
        out.parent.mkdir(parents=True,exist_ok=True)
        out.write_text(hub_page(cluster_slug,entries),encoding="utf-8")

for cluster_slug in CLUSTERS:
    d=ROOT/"atlas"/cluster_slug
    siblings=sorted(d.glob("*/index.html")) if d.exists() else []
    for p in siblings:
        ensure_old_page_optimization(p,cluster_slug,siblings)

assert len(all_pages)==1000, len(all_pages)

# Master hub: cluster-first architecture, lower crawl depth than a 1000-link page.
cluster_cards=[]
for slug,(name,desc) in CLUSTERS.items():
    n=len(all_entries.get(slug,[]))
    cluster_cards.append(f'<a class="kb-tile" href="/academia-astrologie/atlas-1000/{slug}/"><strong>{html.escape(name)}</strong><span>{n} pagini · {html.escape(desc)}</span></a>')
master_url=f"{BASE}/academia-astrologie/atlas-1000/"
master_schema={"@context":"https://schema.org","@type":"CollectionPage","name":"Atlas AstroVip 1000","url":master_url,
 "description":"1000 de ghiduri astrologice organizate în 11 clustere tematice pentru navigare, studiu și indexare eficientă.",
 "hasPart":[{"@type":"CollectionPage","name":name,"url":f"{BASE}/academia-astrologie/atlas-1000/{slug}/"} for slug,(name,_) in CLUSTERS.items()]}
master=f"""<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atlas AstroVip 1000 | 1000 ghiduri astrologice</title><meta name="description" content="Atlas AstroVip 1000: 1000 de ghiduri organizate în 11 clustere despre planete, case, aspecte, tranzite, Arce Solare, Revoluție Solară și sinastrie.">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="{master_url}">
<link rel="stylesheet" href="/assets/knowledge-premium.css?v=20260918"><link rel="stylesheet" href="/assets/academy-neon.css?v=20260918-1">
<script type="application/ld+json">{json.dumps(master_schema,ensure_ascii=False)}</script></head><body>
<header class="kb-head"><div class="kb-wrap kb-nav"><a class="kb-brand" href="/">ASTROVIP</a><nav><a href="/academia-astrologie/">Academia</a><a href="/biblioteca-astrologie/">Bibliotecă</a><a href="/toate-paginile/">Toate paginile</a></nav></div></header>
<main><section class="kb-hero"><div class="kb-wrap"><div class="kb-kicker">AstroVip · bibliotecă structurată</div><h1>Atlas AstroVip 1000</h1><p>1000 de pagini astrologice organizate în 11 clustere. Arhitectura pe hub-uri reduce adâncimea de navigare și conectează fiecare interpretare cu pagini apropiate tematic.</p></div></section>
<div class="kb-wrap"><section><h2>Explorează cele 11 clustere</h2><div class="kb-grid">{''.join(cluster_cards)}</div></section>
<section><h2>Principiul Atlasului</h2><p>Fiecare pagină are URL canonic, titlu și descriere proprii, legături către sursele tematice relevante, navigare spre pagini apropiate și includere în sitemap. Conținutul este organizat pentru utilizatori înainte de a fi organizat pentru motoare de căutare.</p></section></div></main>
<footer class="kb-foot"><div class="kb-wrap"><strong>AstroVip</strong> · Atlas 1000</div></footer></body></html>"""
mp=ROOT/"academia-astrologie"/"atlas-1000"/"index.html"
mp.parent.mkdir(parents=True,exist_ok=True)
mp.write_text(master,encoding="utf-8")

# Add prominent internal entries without touching homepage.
for rel,needle,block in [
 ("academia-astrologie/index.html","Atlas AstroVip 1000",'<section><h2>Atlas AstroVip 1000</h2><p>1000 de ghiduri organizate în 11 clustere tematice, cu navigare și interlinking îmbunătățite.</p><div class="kb-links"><a href="/academia-astrologie/atlas-1000/">Explorează Atlas AstroVip 1000 →</a></div></section>'),
 ("toate-paginile/index.html","Atlas AstroVip 1000",'<section><h2>Atlas AstroVip 1000</h2><div class="av-catalog-grid"><a class="av-catalog-card" href="/academia-astrologie/atlas-1000/"><h3>1000 de ghiduri astrologice</h3><p>11 clustere tematice cu planete, case, aspecte, timing și sinastrie.</p></a></div></section>')
]:
    p=ROOT/rel
    txt=p.read_text(encoding="utf-8")
    if needle not in txt:
        txt=txt.replace("</main>",block+"</main>")
        p.write_text(txt,encoding="utf-8")

# Sitemap: preserve existing URLs, add all 1000 Atlas pages + 12 new hub URLs.
sp=ROOT/"sitemap.xml"
s=sp.read_text(encoding="utf-8")
urls=[master_url]
urls += [f"{BASE}/academia-astrologie/atlas-1000/{slug}/" for slug in CLUSTERS]
urls += [f"{BASE}/"+str(p.parent.relative_to(ROOT)).replace("\\","/")+"/" for p in all_pages]
new=[]
for u in urls:
    if f"<loc>{u}</loc>" not in s:
        new.append(f"<url><loc>{u}</loc><lastmod>{DATE}</lastmod></url>")
if new:
    s=s.replace("</urlset>","\n".join(new)+"\n</urlset>")
    sp.write_text(s,encoding="utf-8")

print(f"Optimized {len(all_pages)} Atlas pages; generated {len(CLUSTERS)} cluster hubs + master hub.")
