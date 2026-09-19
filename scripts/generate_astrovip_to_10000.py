#!/usr/bin/env python3
from pathlib import Path
import html, json, re, hashlib
ROOT=Path(__file__).resolve().parents[1]
BASE="https://astrovip.ro"; DATE="2026-09-19"; AUTHOR="Cătălin Smaranda"
PLANETS={
"soare":("Soarele","identitate, voință, vitalitate și direcție personală"),
"luna":("Luna","nevoi emoționale, memorie, siguranță și reacții instinctive"),
"mercur":("Mercur","gândire, limbaj, învățare și schimb de informații"),
"venus":("Venus","valori, atracție, relaționare, plăcere și negociere"),
"marte":("Marte","acțiune, inițiativă, dorință, competiție și limite"),
"jupiter":("Jupiter","expansiune, sens, educație, oportunitate și încredere"),
"saturn":("Saturn","structură, timp, responsabilitate, limită și maturizare"),
"uranus":("Uranus","schimbare, autonomie, inovație și ruperea tiparelor"),
"neptun":("Neptun","imaginație, sensibilitate, idealizare și permeabilitate"),
"pluto":("Pluto","transformare, intensitate, putere, control și regenerare")}
POINTS={
"ascendent":("Ascendentul","identitate vizibilă, corp, inițiativă și felul de a intra în experiență"),
"mc":("MC-ul","carieră, statut, vocație și direcție publică"),
"descendent":("Descendentul","parteneriate, oglindire, contracte și relații unu-la-unu"),
"ic":("IC-ul","rădăcini, familie, locuință și viață privată"),
"vertex":("Vertexul","întâlniri semnificative și contexte relaționale percepute ca decisive"),
"pars-fortunae":("Pars Fortunae","flux, resurse, eficiență și zone de funcționare naturală"),
"nodul-nord":("Nodul Nord","direcție de dezvoltare, învățare și experiențe de creștere"),
"nodul-sud":("Nodul Sud","tipare familiare, automatism și resurse deja exersate"),
"chiron":("Chiron","vulnerabilitate, integrare și procese de învățare prin sensibilitate"),
"lilith":("Lilith","autonomie, limite, zone de tensiune și material psihic greu de negociat")}
MIDPOINTS={
"soare-luna":("Soare/Lună","integrarea dintre voință și nevoi emoționale"),
"soare-venus":("Soare/Venus","identitate, valori, atracție și relaționare"),
"soare-marte":("Soare/Marte","voință, inițiativă și mobilizare"),
"luna-venus":("Lună/Venus","afectivitate, confort, atașament și valori"),
"luna-marte":("Lună/Marte","reacție emoțională, instinct și acțiune"),
"venus-marte":("Venus/Marte","atracție, dorință, negociere și dinamica relațională"),
"jupiter-saturn":("Jupiter/Saturn","expansiune, structură, oportunitate și limită"),
"uranus-neptun":("Uranus/Neptun","schimbare, ideal, sensibilitate colectivă și reformulare"),
"uranus-pluto":("Uranus/Pluto","ruptură de tipar, intensitate și transformare profundă"),
"asc-mc":("ASC/MC","identitate, direcție personală, statut și vizibilitate")}
MAJOR={
"conjunctie":("conjuncție","0°","fuziune și concentrare"),
"sextil":("sextil","60°","cooperare și oportunitate activabilă"),
"cuadratura":("cuadratură","90°","fricțiune, tensiune și ajustare"),
"trigon":("trigon","120°","curgere, compatibilitate și susținere"),
"opozitie":("opoziție","180°","polarizare, oglindire și echilibrare")}
MINOR={
"semisextil":("semisextil","30°","ajustare fină și contact discret"),
"semicuadratura":("semicuadratură","45°","presiune internă și iritare productivă"),
"quintil":("quintil","72°","organizare creativă și utilizare specializată"),
"sesquicuadratura":("sesquicuadratură","135°","tensiune repetitivă care cere recalibrare"),
"inconjunctie":("inconjuncție","150°","adaptare între funcții care nu se coordonează natural")}
TECHS={
"arce-solare":("Arce Solare","Arcul Solar deplasează simbolic punctele hărții cu aceeași distanță și este folosit pentru a urmări contacte exacte cu repere natale.","/arce-solare/"),
"progresii-secundare":("Progresii secundare","Progresiile secundare comprimă simbolic timpul și sunt folosite pentru a urmări dezvoltarea graduală a funcțiilor natale.","/progresii-secundare/"),
"revolutie-solara":("Revoluție Solară","Revoluția Solară descrie cadrul simbolic dintre două aniversări și se interpretează împreună cu harta natală.","/revolutie-solara/"),
"revolutie-lunara":("Revoluție Lunară","Revoluția Lunară descrie un cadru lunar simbolic și este utilă pentru rafinarea temelor active pe intervale mai scurte.","/revolutie-lunara/"),
"tranzite":("Tranzite","Tranzitele urmăresc poziția reală a planetelor pe cer în raport cu harta natală și sunt folosite pentru timing și activare.","/tranzite-astrologice/")}
def esc(x): return html.escape(str(x),quote=True)
def section(h,*paras):
    return "<section><h2>"+esc(h)+"</h2>"+"".join("<p>"+esc(p)+"</p>" for p in paras)+"</section>"
def cluster_specs():
    out=[]
    for tk,(label,principle,base) in TECHS.items():
        out.append((f"{tk}-puncte-natale",tk,"point",MAJOR,f"{label} către puncte natale"))
        out.append((f"{tk}-aspecte-minore-puncte",tk,"point",MINOR,f"{label}: aspecte minore către puncte natale"))
        out.append((f"{tk}-puncte-mijlocii",tk,"midpoint",MAJOR,f"{label} către puncte mijlocii"))
    return out
def target_dict(kind):
    return POINTS if kind=="point" else MIDPOINTS
def target_label(kind):
    return "punct natal" if kind=="point" else "punct mijlociu"
def page_title(tech_label,pn,al,tn):
    return f"{tech_label}: {pn} {al} {tn}"
def page_slug(cluster,pk,ak,target_key):
    return f"atlas/{cluster}/{pk}-{ak}-{target_key}"
def render_page(cluster,tech_key,kind,aspects,pk,pdata,target_key,tdata,ak,adata):
    tech_label,principle,tech_base=TECHS[tech_key]
    pn,pfunc=pdata; tn,tfunc=tdata; al,angle,mechanism=adata
    slug=page_slug(cluster,pk,ak,target_key); url=f"{BASE}/{slug}/"
    title=page_title(tech_label,pn,al,tn)
    lead=(f"{title}. Ghid AstroVip despre relația dintre {pfunc} și {tfunc}, "
          f"citită printr-un aspect de {angle} cu mecanism de {mechanism}.")
    desc=(f"{title}. Interpretare tehnică: funcții implicate, orb, timing, confirmări și limitele unei lecturi izolate.")[:158]
    ttype=target_label(kind)
    body=[]
    body.append(section(f"Principiul tehnicii: {tech_label}",
        principle,
        f"În această configurație, {pn} este factorul activ, iar {tn} este {ttype} receptor. Interpretarea corectă pornește de la funcțiile lor separate și abia apoi evaluează felul în care geometria aspectului le conectează."))
    body.append(section(f"Rolul lui {pn}",
        f"{pn} simbolizează {pfunc}. Într-o tehnică predictivă, planeta nu trebuie redusă la o listă fixă de evenimente; ea descrie tipul de funcție care intră în prim-plan și modul în care persoana poate procesa schimbarea.",
        f"Semnul, casa natală și casele guvernate de {pn.lower()} pot modifica substanțial expresia. O planetă care conduce Ascendentul, MC-ul sau un domeniu relevant pentru întrebarea analizată poate primi o greutate suplimentară."))
    body.append(section(f"Ce reprezintă {tn}",
        f"{tn} concentrează teme de {tfunc}. Când acest reper este activat, domeniul său simbolic poate deveni mai vizibil în alegeri, priorități, relații sau evenimente, fără ca aspectul singur să garanteze un rezultat concret.",
        f"Pentru un {ttype}, contextul natal rămâne esențial: semnul, casa, dispozitorul și aspectele natale arată cum este integrată tema de bază înainte de orice activare predictivă."))
    body.append(section(f"Mecanismul de {al}",
        f"{al.capitalize()} este un aspect de {angle}, asociat aici cu {mechanism}. Geometria descrie felul în care două funcții se coordonează, intră în tensiune sau cer o ajustare; nu clasifică automat perioada drept favorabilă ori dificilă.",
        f"Cu cât orbul este mai mic, cu atât argumentul tehnic este mai clar. Exactitatea devine deosebit de importantă pentru Ascendent, MC, Descendent, IC și alte puncte dependente de ora natală."))
    body.append(section("Orb, fază și precizia datelor",
        f"Orbul trebuie folosit consecvent în cadrul aceleiași tehnici. Pentru {pn} {al} {tn}, analiza urmărește distanța exactă, dacă aspectul este aplicant sau separant atunci când metoda permite această distincție și dacă aceeași zonă este atinsă repetat.",
        f"Atunci când {tn.lower()} depinde de ora nașterii sau de o construcție matematică sensibilă la timp, rectificarea poate deveni relevantă. O eroare de câteva minute poate modifica suficient o axă încât momentul exact al contactului să fie deplasat."))
    body.append(section("Timing și confirmări",
        f"{tech_label} oferă un strat de timing, dar o analiză robustă caută convergența. Contactul dintre {pn.lower()} și {tn.lower()} este mai convingător când aceeași temă reapare în tranzite, progresii, Arce Solare, Revoluția Solară sau alte tehnici adecvate.",
        f"Confirmarea nu înseamnă repetarea mecanică a aceleiași etichete. Se urmăresc aceleași domenii de viață, aceiași guvernatori, aceleași axe sau aceeași familie de simboluri, astfel încât mai mulți indicatori independenți să descrie un context coerent."))
    body.append(section("Integrarea cu casele și guvernatorii",
        f"Casa natală a lui {pn.lower()} și casele pe care le guvernează arată unde poate porni tema. Poziția și stăpânirile asociate cu {tn.lower()} arată unde poate fi recepționată sau manifestată. Legătura dintre aceste domenii este adesea mai informativă decât o interpretare generică a aspectului.",
        f"Dacă una dintre funcții este angulară, conjunctă cu o axă sau implicată într-o configurație natală importantă, contactul poate primi o vizibilitate mai mare. Totuși, prioritatea se acordă structurii complete a hărții, nu unei singure reguli."))
    body.append(section("Cum se evită interpretarea mecanică",
        f"Nu este corect să se afirme că {pn} {al} {tn} produce inevitabil un anumit eveniment. Astrologia predictivă este un cadru interpretativ, iar aceeași configurație poate coincide cu manifestări diferite în funcție de context, vârstă, decizii și restul hărții.",
        f"Într-un studiu de caz se notează data, orbul, tehnica, evenimentul observabil și indicatorii concomitenți. Această disciplină ajută la diferențierea dintre o corelație interpretativă documentată și o explicație construită retroactiv fără criterii."))
    body.append(section("Aplicare practică AstroVip",
        f"Pentru această combinație, ordinea de lucru recomandată este: identificarea funcției lui {pn.lower()}, definirea temei lui {tn.lower()}, evaluarea mecanismului de {al}, verificarea orburilor și apoi căutarea confirmărilor prin tehnici independente.",
        f"Rezultatul final trebuie formulat ca o fereastră de teme și posibilități, nu ca o certitudine rigidă. În consultanță, această structură permite legarea simbolurilor de întrebarea concretă a persoanei fără a pierde criteriile tehnice."))
    faq=[
      (f"Ce înseamnă {pn} {al} {tn} în {tech_label}?",f"Este un contact interpretativ care leagă {pfunc} de {tfunc} printr-un aspect de {angle}, asociat cu {mechanism}."),
      ("Contează orbul?","Da. Exactitatea contactului și precizia datelor natale sunt criterii tehnice importante, mai ales pentru axe și puncte sensibile."),
      ("Este suficient un singur aspect pentru predicție?","Nu. O interpretare mai robustă caută confirmări prin alte tehnici și prin structura întregii hărți.")
    ]
    faq_html="".join(f"<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>" for q,a in faq)
    schema=[
      {"@context":"https://schema.org","@type":"Article","headline":title,"description":desc,
       "mainEntityOfPage":url,"inLanguage":"ro-RO","datePublished":DATE,"dateModified":DATE,
       "author":{"@type":"Person","name":AUTHOR,"url":f"{BASE}/despre-astrovip/"},
       "publisher":{"@type":"Organization","name":"AstroVip","url":f"{BASE}/"}},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
       {"@type":"ListItem","position":1,"name":"AstroVip","item":f"{BASE}/"},
       {"@type":"ListItem","position":2,"name":"Academia AstroVip","item":f"{BASE}/academia-astrologie/"},
       {"@type":"ListItem","position":3,"name":"Atlas AstroVip 10000","item":f"{BASE}/academia-astrologie/atlas-10000/"},
       {"@type":"ListItem","position":4,"name":cluster.replace("-"," ").title(),"item":f"{BASE}/academia-astrologie/atlas-10000/{cluster}/"},
       {"@type":"ListItem","position":5,"name":title,"item":url}]},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
       {"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in faq]}
    ]
    related=(f'<a href="{tech_base}">{esc(tech_label)}</a>'
             f'<a href="/astrologie-predictiva/">Astrologie predictivă</a>'
             f'<a href="/orburi-aspecte-aplicante-separante/">Orburi și aspecte</a>'
             f'<a href="/rectificare-ora-nasterii/">Rectificarea orei</a>'
             f'<a href="/academia-astrologie/atlas-10000/{cluster}/">Indexul clusterului</a>')
    html_doc=f'''<!doctype html><html lang="ro"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#071107">
<title>{esc(title)} | AstroVip</title><meta name="description" content="{esc(desc)}"><meta name="author" content="{AUTHOR}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="{url}">
<meta property="og:type" content="article"><meta property="og:locale" content="ro_RO"><meta property="og:site_name" content="AstroVip">
<meta property="og:title" content="{esc(title)} | AstroVip"><meta property="og:description" content="{esc(desc)}"><meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/assets/1000043152.png"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/assets/knowledge-premium.css?v=20260918"><link rel="stylesheet" href="/assets/academy-neon.css?v=20260918-1">
<script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script></head><body>
<header class="kb-head"><div class="kb-wrap kb-nav"><a class="kb-brand" href="/">ASTROVIP</a><nav><a href="/academia-astrologie/">Academia</a><a href="/academia-astrologie/atlas-10000/">Atlas 10000</a><a href="/biblioteca-astrologie/">Bibliotecă</a><a href="/astrologie-predictiva/">Timing</a></nav></div></header>
<main><section class="kb-hero"><div class="kb-wrap"><div class="kb-kicker">AstroVip · Atlas 10000 · {esc(tech_label)}</div><h1>{esc(title)}</h1><p>{esc(lead)}</p></div></section>
<div class="kb-wrap kb-layout"><article class="kb-article">{''.join(body)}
<section><h2>Întrebări frecvente</h2>{faq_html}</section><section><h2>Documentare conexă</h2><div class="kb-links">{related}</div></section>
<div class="kb-author"><strong>Autor: {AUTHOR} · AstroVip</strong><p>Material educativ și interpretativ. Nicio configurație izolată nu descrie singură un eveniment sau întreaga hartă.</p></div></article></div></main>
<footer class="kb-foot"><div class="kb-wrap"><strong>AstroVip</strong> · Astrologie & Numerologie Premium</div></footer></body></html>'''
    return slug,title,desc,html_doc
def render_hub(cluster,tech_key,kind,aspects,hub_title,entries):
    tech_label,principle,_=TECHS[tech_key]
    url=f"{BASE}/academia-astrologie/atlas-10000/{cluster}/"
    desc=f"{len(entries)} ghiduri AstroVip: {hub_title.lower()}, cu interpretare tehnică, orb, timing și confirmări."
    itemlist={"@context":"https://schema.org","@type":"CollectionPage","name":hub_title,"description":desc,"url":url,
      "mainEntity":{"@type":"ItemList","numberOfItems":len(entries),"itemListElement":[
       {"@type":"ListItem","position":i+1,"name":t,"url":f"{BASE}{u}"} for i,(u,t) in enumerate(entries)]}}
    cards="".join(f'<a class="kb-tile" href="{u}"><strong>{esc(t)}</strong><span>Ghid AstroVip · Atlas 10000</span></a>' for u,t in entries)
    return f'''<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(hub_title)} | Atlas AstroVip 10000</title><meta name="description" content="{esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<link rel="canonical" href="{url}"><link rel="stylesheet" href="/assets/knowledge-premium.css?v=20260918"><link rel="stylesheet" href="/assets/academy-neon.css?v=20260918-1">
<script type="application/ld+json">{json.dumps(itemlist,ensure_ascii=False)}</script></head><body>
<header class="kb-head"><div class="kb-wrap kb-nav"><a class="kb-brand" href="/">ASTROVIP</a><nav><a href="/academia-astrologie/">Academia</a><a href="/academia-astrologie/atlas-10000/">Atlas 10000</a></nav></div></header>
<main><section class="kb-hero"><div class="kb-wrap"><div class="kb-kicker">Atlas AstroVip 10000 · {len(entries)} pagini</div><h1>{esc(hub_title)}</h1><p>{esc(desc)}</p></div></section>
<div class="kb-wrap"><section><div class="kb-grid">{cards}</div></section><section><h2>Principiul tehnic</h2><p>{esc(principle)}</p></section></div></main>
<footer class="kb-foot"><div class="kb-wrap"><strong>AstroVip</strong> · Atlas 10000</div></footer></body></html>'''
pages=[]; hubs={}; seen_slugs=set(); seen_titles=set(); seen_desc=set()
for cluster,tech_key,kind,aspects,hub_title in cluster_specs():
    entries=[]; targets=target_dict(kind)
    for pk,pdata in PLANETS.items():
        for target_key,tdata in targets.items():
            for ak,adata in aspects.items():
                slug,title,desc,doc=render_page(cluster,tech_key,kind,aspects,pk,pdata,target_key,tdata,ak,adata)
                assert slug not in seen_slugs, slug
                assert title not in seen_titles, title
                assert desc not in seen_desc, desc
                seen_slugs.add(slug); seen_titles.add(title); seen_desc.add(desc)
                pages.append((slug,title,desc,doc,cluster))
                entries.append(("/"+slug+"/",title))
    assert len(entries)==500,(cluster,len(entries))
    hubs[cluster]=(tech_key,kind,aspects,hub_title,entries)
assert len(pages)==7500,len(pages)
collisions=[slug for slug,_,_,_,_ in pages if (ROOT/slug/"index.html").exists()]
assert not collisions,f"Existing URL collision: {collisions[:10]}"
for slug,title,desc,doc,cluster in pages:
    p=ROOT/slug/"index.html"; p.parent.mkdir(parents=True,exist_ok=True); p.write_text(doc,encoding="utf-8")
for cluster,(tech_key,kind,aspects,hub_title,entries) in hubs.items():
    p=ROOT/"academia-astrologie"/"atlas-10000"/cluster/"index.html"
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(render_hub(cluster,tech_key,kind,aspects,hub_title,entries),encoding="utf-8")
master_url=f"{BASE}/academia-astrologie/atlas-10000/"
cluster_cards="".join(
 f'<a class="kb-tile" href="/academia-astrologie/atlas-10000/{c}/"><strong>{esc(v[3])}</strong><span>500 pagini · {esc(TECHS[v[0]][0])}</span></a>'
 for c,v in hubs.items())
master_schema={"@context":"https://schema.org","@type":"CollectionPage","name":"Atlas AstroVip 10000","url":master_url,
 "description":"10.000 de ghiduri astrologice organizate tematic, cu 7.500 de pagini noi despre timing, puncte natale, aspecte minore și puncte mijlocii.",
 "hasPart":[{"@type":"CollectionPage","name":v[3],"url":f"{BASE}/academia-astrologie/atlas-10000/{c}/"} for c,v in hubs.items()]}
master=f'''<!doctype html><html lang="ro"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Atlas AstroVip 10000 | 10.000 ghiduri astrologice</title><meta name="description" content="Atlas AstroVip 10000: 10.000 de ghiduri astrologice, organizate în clustere tematice pentru studiu, navigare și indexare.">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="{master_url}">
<link rel="stylesheet" href="/assets/knowledge-premium.css?v=20260918"><link rel="stylesheet" href="/assets/academy-neon.css?v=20260918-1">
<script type="application/ld+json">{json.dumps(master_schema,ensure_ascii=False)}</script></head><body>
<header class="kb-head"><div class="kb-wrap kb-nav"><a class="kb-brand" href="/">ASTROVIP</a><nav><a href="/academia-astrologie/">Academia</a><a href="/biblioteca-astrologie/">Bibliotecă</a><a href="/toate-paginile/">Toate paginile</a></nav></div></header>
<main><section class="kb-hero"><div class="kb-wrap"><div class="kb-kicker">AstroVip · bibliotecă extinsă</div><h1>Atlas AstroVip 10000</h1><p>10.000 de pagini astrologice. Extinderea adaugă 7.500 de ghiduri despre Arce Solare, progresii, Revoluție Solară, Revoluție Lunară, tranzite, puncte natale, aspecte minore și puncte mijlocii.</p></div></section>
<div class="kb-wrap"><section><h2>Primele 2.500 de ghiduri</h2><div class="kb-links"><a href="/academia-astrologie/atlas-2500/">Deschide Atlas AstroVip 2500 →</a></div></section>
<section><h2>Cele 15 clustere noi</h2><div class="kb-grid">{cluster_cards}</div></section>
<section><h2>Standard editorial</h2><p>Fiecare pagină are URL canonic, titlu și descriere individuale, date structurate Article, Breadcrumb și FAQ, plus legături interne către tehnica relevantă și hub-ul clusterului. Conținutul tratează astrologia ca metodă interpretativă și evită prezentarea unui singur aspect drept certitudine.</p></section></div></main>
<footer class="kb-foot"><div class="kb-wrap"><strong>AstroVip</strong> · Atlas 10000</div></footer></body></html>'''
mp=ROOT/"academia-astrologie"/"atlas-10000"/"index.html"; mp.parent.mkdir(parents=True,exist_ok=True); mp.write_text(master,encoding="utf-8")
for rel,marker,block in [
 ("academia-astrologie/index.html","/academia-astrologie/atlas-10000/",'<section><h2>Atlas AstroVip 10000</h2><p>10.000 de ghiduri astrologice organizate tematic, inclusiv 7.500 de pagini noi despre tehnici predictive.</p><div class="kb-links"><a href="/academia-astrologie/atlas-10000/">Explorează Atlas AstroVip 10000 →</a></div></section>'),
 ("toate-paginile/index.html","/academia-astrologie/atlas-10000/",'<section><h2>Atlas AstroVip 10000</h2><div class="av-catalog-grid"><a class="av-catalog-card" href="/academia-astrologie/atlas-10000/"><h3>10.000 de ghiduri astrologice</h3><p>15 clustere noi despre timing, puncte natale, aspecte minore și midpoints.</p></a></div></section>')
]:
    p=ROOT/rel; txt=p.read_text(encoding="utf-8")
    if marker not in txt:
        txt=txt.replace("</main>",block+"</main>",1); p.write_text(txt,encoding="utf-8")
sm=ROOT/"sitemap.xml"; xml=sm.read_text(encoding="utf-8")
locs=set(re.findall(r"<loc>([^<]+)</loc>",xml))
new_urls=[f"{BASE}/{slug}/" for slug,_,_,_,_ in pages]
new_urls += [master_url]+[f"{BASE}/academia-astrologie/atlas-10000/{c}/" for c in hubs]
dups=[u for u in new_urls if u in locs]; assert not dups,f"Sitemap collision: {dups[:5]}"
insert="".join(f"<url><loc>{u}</loc><lastmod>{DATE}</lastmod></url>
" for u in new_urls)
xml=xml.replace("</urlset>",insert+"</urlset>"); sm.write_text(xml,encoding="utf-8")
atlas_count=len(list((ROOT/"atlas").glob("*/*/index.html")))
sitemap_count=len(re.findall(r"<loc>",xml))
assert atlas_count==10000,atlas_count
assert sitemap_count>=10376,sitemap_count
sample_docs=[p[3] for p in pages[:20]]
word_counts=[len(re.sub(r"<[^>]+>"," ",doc).split()) for doc in sample_docs]
report={
 "existing_atlas_before":2500,
 "new_pages":len(pages),
 "new_hubs":len(hubs)+1,
 "atlas_total":atlas_count,
 "sitemap_urls":sitemap_count,
 "unique_slugs":len(seen_slugs),
 "unique_titles":len(seen_titles),
 "unique_descriptions":len(seen_desc),
 "clusters":{c:len(v[4]) for c,v in hubs.items()},
 "sample_min_words":min(word_counts),
 "sample_max_words":max(word_counts)
}
(ROOT/"atlas-10000-generation-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
