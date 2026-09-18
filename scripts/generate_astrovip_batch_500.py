#!/usr/bin/env python3
from pathlib import Path
from itertools import combinations
import html, json, re, unicodedata

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://astrovip.ro"
DATE = "2026-09-18"
AUTHOR = "Cătălin Smaranda"

PLANETS = {
    "soare": ("Soarele", "identitate, voință, direcție personală și afirmare", "centrul de coerență al hărții"),
    "luna": ("Luna", "nevoi emoționale, memorie, siguranță și reacții instinctive", "ritmul interior și răspunsul afectiv"),
    "mercur": ("Mercur", "gândire, limbaj, învățare, schimb și procesarea informației", "modul de analiză și comunicare"),
    "venus": ("Venus", "valori, atracție, plăcere, relaționare și gust estetic", "felul în care persoana caută armonie și apropiere"),
    "marte": ("Marte", "acțiune, inițiativă, competiție, dorință și afirmarea limitelor", "motorul deciziei și al mobilizării"),
    "jupiter": ("Jupiter", "expansiune, sens, încredere, educație și oportunitate", "modul de a crește și de a lărgi perspectiva"),
    "saturn": ("Saturn", "structură, timp, limită, responsabilitate și maturizare", "capacitatea de a construi și consolida"),
    "uranus": ("Uranus", "schimbare, autonomie, ruptură de tipar și inovație", "nevoia de libertate și reformulare"),
    "neptun": ("Neptun", "imaginație, sensibilitate, dizolvarea limitelor și idealizare", "zona în care granițele devin mai permeabile"),
    "pluto": ("Pluto", "intensitate, transformare, control, regenerare și procese profunde", "dinamica schimbărilor ireversibile"),
}

PLANET_BASE = {
    "soare": "/soarele-in-astrologie/",
    "luna": "/luna-in-astrologie/",
    "mercur": "/mercur-in-astrologie/",
    "venus": "/venus-in-astrologie/",
    "marte": "/marte-in-astrologie/",
    "jupiter": "/jupiter-in-astrologie/",
    "saturn": "/saturn-in-astrologie/",
    "uranus": "/uranus-in-astrologie/",
    "neptun": "/neptun-in-astrologie/",
    "pluto": "/pluto-in-astrologie/",
}

SIGNS = {
    "berbec": ("Berbec", "Foc", "cardinală", "direct, rapid, inițiator și orientat spre acțiune", "curaj, autonomie și pornirea unui ciclu"),
    "taur": ("Taur", "Pământ", "fixă", "constant, senzorial, pragmatic și orientat spre stabilitate", "resurse, continuitate și valori concrete"),
    "gemeni": ("Gemeni", "Aer", "mutabilă", "curios, flexibil, verbal și orientat spre conexiuni", "informație, varietate și schimb"),
    "rac": ("Rac", "Apă", "cardinală", "receptiv, protector, memorativ și orientat spre apartenență", "familie, siguranță și rădăcini"),
    "leu": ("Leu", "Foc", "fixă", "expresiv, creator, loial și orientat spre vizibilitate", "creativitate, recunoaștere și asumarea centrului"),
    "fecioara": ("Fecioară", "Pământ", "mutabilă", "analitic, atent, selectiv și orientat spre eficiență", "ordine, utilitate și rafinare"),
    "balanta": ("Balanță", "Aer", "cardinală", "relațional, comparativ, diplomatic și orientat spre echilibru", "parteneriat, negociere și armonizare"),
    "scorpion": ("Scorpion", "Apă", "fixă", "intens, concentrat, strategic și orientat spre profunzime", "transformare, intimitate și resurse comune"),
    "sagetator": ("Săgetător", "Foc", "mutabilă", "explorator, expansiv, franc și orientat spre sens", "educație, călătorie și perspectivă"),
    "capricorn": ("Capricorn", "Pământ", "cardinală", "disciplinat, realist, ambițios și orientat spre structură", "statut, obiective și responsabilitate"),
    "varsator": ("Vărsător", "Aer", "fixă", "independent, conceptual, reformator și orientat spre sisteme", "rețele, idei și autonomie"),
    "pesti": ("Pești", "Apă", "mutabilă", "empatic, imaginativ, fluid și orientat spre integrare", "sensibilitate, simbol și permeabilitate"),
}

HOUSES = {
    1: ("identitate, corp, inițiativă și modul de a intra în experiență", "Ascendentul și expresia imediată"),
    2: ("resurse, bani, valori personale și stabilitate", "ce este păstrat, cultivat și evaluat"),
    3: ("comunicare, învățare, frați, vecinătate și deplasări scurte", "schimbul de informații și mediul apropiat"),
    4: ("familie, locuință, rădăcini și viață privată", "baza emoțională și spațiul intim"),
    5: ("creativitate, romantism, copii, expresie și risc", "bucuria de a crea și de a te exprima"),
    6: ("muncă zilnică, rutine, servicii și organizare", "funcționarea concretă de zi cu zi"),
    7: ("parteneriate, contracte și relații unu-la-unu", "oglindirea prin celălalt și negocierea"),
    8: ("resurse comune, intimitate, crize și transformare", "ce este împărțit, pierdut, regenerat sau negociat în profunzime"),
    9: ("studii superioare, călătorii, credințe și perspectivă", "extinderea cadrului mental și cultural"),
    10: ("carieră, statut, vocație și rol public", "direcția vizibilă și responsabilitatea socială"),
    11: ("prieteni, grupuri, rețele și proiecte de viitor", "obiectivele colective și apartenența socială"),
    12: ("retragere, procese interioare, finaluri și ceea ce operează în fundal", "zona nevăzută, recuperarea și închiderea ciclurilor"),
}

ASPECTS = {
    "conjunctie": ("conjuncție", "fuziune și concentrare", "cele două funcții se manifestă în același punct și tind să se combine"),
    "opozitie": ("opoziție", "polarizare și negocierea extremelor", "cele două funcții se privesc din capete opuse și cer echilibru"),
    "cuadratura": ("cuadratură", "tensiune productivă și fricțiune", "cele două funcții solicită ajustare, efort și dezvoltarea unei strategii"),
    "trigon": ("trigon", "fluiditate și cooperare naturală", "cele două funcții se susțin cu mai puțină fricțiune"),
    "sextil": ("sextil", "oportunitate și cooperare disponibilă", "cele două funcții pot lucra împreună când sunt activate conștient"),
}

ANGLE_TARGETS = {
    "ascendent": ("Ascendent", "identitate, corp, inițiativă și începuturi"),
    "mc": ("MC", "carieră, statut, direcție publică și vizibilitate"),
}

def slugify(text):
    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    text = text.lower().replace("ș","s").replace("ț","t")
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text

def head(title, desc, url, schema):
    return f"""<!doctype html><html lang="ro"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/consent-v2.css?v=2"><script defer src="/assets/consent-v2.js?v=2"></script>
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#071107">
<title>{html.escape(title)}</title><meta name="description" content="{html.escape(desc)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="{url}">
<meta property="og:type" content="article"><meta property="og:locale" content="ro_RO"><meta property="og:site_name" content="AstroVip">
<meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/assets/1000043152.png"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/assets/knowledge-premium.css?v=20260918"><link rel="stylesheet" href="/assets/academy-neon.css?v=20260918-1">
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script></head><body>"""

def shell(title, lead, body, url, crumbs, related, faq):
    schema = {
        "@context":"https://schema.org","@type":"Article","headline":title,
        "description":lead,"mainEntityOfPage":url,"inLanguage":"ro-RO",
        "author":{"@type":"Person","name":AUTHOR,"url":f"{BASE}/despre-astrovip/"},
        "publisher":{"@type":"Organization","name":"AstroVip","url":f"{BASE}/"},
        "dateModified":DATE
    }
    desc = lead[:155].rstrip(" ,.;") + "."
    rel = "".join(f'<a href="{u}">{html.escape(t)}</a>' for u,t in related)
    faq_html = "".join(f"<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>" for q,a in faq)
    crumb_html = '<span>›</span>'.join(crumbs)
    return head(title+" | AstroVip", desc, url, schema) + f"""
<header class="kb-head"><div class="kb-wrap kb-nav"><a class="kb-brand" href="/">ASTROVIP</a><nav><a href="/academia-astrologie/">Academia</a><a href="/biblioteca-astrologie/">Bibliotecă</a><a href="/astrologie-predictiva/">Timing</a><a href="/despre-astrovip/">Autor</a></nav></div></header>
<main><section class="kb-hero"><div class="kb-wrap"><div class="kb-kicker">AstroVip · Atlas 500</div><h1>{html.escape(title)}</h1><p>{html.escape(lead)}</p><div class="kb-actions"><a class="kb-btn" href="/#programari">Consultație premium</a><a class="kb-ghost" href="/academia-astrologie/atlas-500/">Atlas 500</a></div></div></section>
<div class="kb-wrap kb-crumbs">{crumb_html}</div><div class="kb-wrap kb-layout"><article class="kb-article">{body}
<section><h2>Întrebări frecvente</h2>{faq_html}</section>
<section><h2>Continuă documentarea</h2><div class="kb-links">{rel}</div></section>
<div class="kb-author"><strong>Autor: {AUTHOR} · AstroVip</strong><p>Interpretarea este contextuală. O poziție sau un aspect nu se citește izolat, ci împreună cu guvernatorii, casele, axele și restul hărții.</p></div>
</article><aside class="kb-aside"><div class="kb-card"><div class="kb-label">Atlas AstroVip 500</div><p>Bibliotecă de interpretări combinatorii pentru studiu și documentare.</p><a class="kb-btn" href="/academia-astrologie/atlas-500/">Deschide indexul</a></div></aside></div></main>
<footer class="kb-foot"><div class="kb-wrap"><strong>AstroVip</strong> · Astrologie & Numerologie Premium</div></footer></body></html>"""

def sec(h, paras):
    return "<section><h2>"+html.escape(h)+"</h2>"+"".join("<p>"+html.escape(p)+"</p>" for p in paras)+"</section>"

pages = []

# 1) 120 planete in semne
for pk,(pn,pfunc,pcore) in PLANETS.items():
    for sk,(sn,elem,mod,style,theme) in SIGNS.items():
        slug=f"atlas/planete-in-semne/{pk}-in-{sk}"
        title=f"{pn} în {sn}: interpretare natală"
        lead=f"{pn} în {sn} combină {pfunc} cu un stil {style}. Interpretarea se rafinează prin casă, aspecte, guvernator și contextul întregii hărți."
        body="".join([
            sec(f"{pn} și funcția sa de bază",[f"Într-o hartă natală, {pn.lower()} descrie {pfunc}. În {sn}, această funcție este filtrată printr-un registru {style}.",f"Punctul de pornire rămâne {pcore}; semnul arată cum este exprimată funcția, nu dacă ea este «bună» sau «rea»."]),
            sec(f"Ce aduce semnul {sn}",[f"{sn} este un semn de {elem.lower()} cu modalitate {mod}. Temele sale centrale includ {theme}.",f"Prin această combinație, {pn.lower()} tinde să lucreze cu ritmul specific semnului: {style}."]),
            sec("Resurse și potențial",[f"O expresie constructivă poate apărea când {pfunc} găsește o formă coerentă pentru {theme}.",f"Guvernatorul lui {sn} și aspectele către {pn.lower()} arată cât de ușor poate fi accesată această resursă."]),
            sec("Tensiuni posibile",[f"Dezechilibrul poate apărea atunci când funcția lui {pn.lower()} este împinsă prea mult în direcția stilului {style}, fără compensarea oferită de restul hărții.",f"Aspectele tensionate pot arăta unde este necesară mai multă flexibilitate, disciplină sau integrare."]),
            sec("În relații și decizii",[f"În relații, {pn.lower()} în {sn} colorează felul în care persoana exprimă o parte din {pfunc}.",f"Pentru decizii concrete se verifică și casa, guvernatorii, Ascendentul, MC-ul și tehnicile de timing relevante."]),
        ])
        related=[(PLANET_BASE[pk],f"{pn} în astrologie"),(f"/zodiac/{sk}/",f"Semnul {sn}"),("/harta-natala/","Harta natală"),("/academia-astrologie/atlas-500/","Atlas 500")]
        faq=[(f"Ce înseamnă {pn} în {sn}?",f"Înseamnă că funcția asociată cu {pfunc} se exprimă prin stilul și temele semnului {sn}."),("Este suficient semnul pentru interpretare?","Nu. Casa, aspectele, guvernatorul semnului și restul hărții pot schimba substanțial expresia."),("Poziția se schimbă în timp?","Poziția natală rămâne aceeași; tranzitele și progresiile activează periodic această configurație.")]
        pages.append((slug,shell(title,lead,body,f"{BASE}/{slug}/",[f'<a href="/">AstroVip</a>',f'<a href="/academia-astrologie/atlas-500/">Atlas 500</a>',html.escape(title)],related,faq),title))

# 2) 120 planete in case
for pk,(pn,pfunc,pcore) in PLANETS.items():
    for h,(htheme,hcore) in HOUSES.items():
        slug=f"atlas/planete-in-case/{pk}-in-casa-{h}"
        title=f"{pn} în Casa {h}: interpretare natală"
        lead=f"{pn} în Casa {h} mută accentul funcției sale — {pfunc} — spre domeniul asociat cu {htheme}. Semnul și aspectele arată stilul și condițiile concrete."
        body="".join([
            sec(f"Casa {h}: domeniul de viață",[f"Casa {h} este asociată cu {htheme}. În această zonă, {hcore} devine un reper important pentru interpretare.",f"Prezența lui {pn.lower()} face ca funcția sa să fie mai vizibilă în acest domeniu."]),
            sec(f"Cum lucrează {pn} aici",[f"{pn} descrie {pfunc}. În Casa {h}, persoana tinde să întâlnească mai des această temă prin situații legate de {htheme}.",f"Semnul lui {pn.lower()} arată stilul, iar guvernatorul Casei {h} conectează tema cu o altă zonă a hărții."]),
            sec("Resurse",[f"O expresie coerentă poate transforma {pcore} într-un avantaj aplicat direct în domeniul Casei {h}.",f"Aspectele fluide sau o condiție natală stabilă pot ajuta la folosirea conștientă a acestei funcții."]),
            sec("Provocări",[f"Dacă {pn.lower()} primește aspecte tensionate, domeniul {htheme} poate deveni locul în care apare mai multă presiune, învățare sau nevoie de ajustare.",f"Nu se interpretează automat ca problemă; intensitatea depinde de întreaga structură natală."]),
            sec("Timing",[f"Tranzitele sau Arcele Solare care activează {pn.lower()} pot readuce temporar în prim-plan temele Casei {h}.",f"Pentru axe și cuspide este importantă o oră de naștere cât mai precisă."]),
        ])
        related=[(PLANET_BASE[pk],f"{pn} în astrologie"),(f"/casa-{h}-astrologie/",f"Casa {h}"),("/tranzite-astrologice/","Tranzite"),("/academia-astrologie/atlas-500/","Atlas 500")]
        faq=[(f"Ce accentuează {pn} în Casa {h}?",f"Accentuează temele asociate cu {htheme} prin funcția simbolică a lui {pn.lower()}."),("Contează semnul planetei?","Da. Casa arată unde, iar semnul arată cum se exprimă planeta."),("Ora nașterii contează?","Da. Casele și cuspidele depind direct de ora și locul nașterii.")]
        pages.append((slug,shell(title,lead,body,f"{BASE}/{slug}/",[f'<a href="/">AstroVip</a>',f'<a href="/academia-astrologie/atlas-500/">Atlas 500</a>',html.escape(title)],related,faq),title))

# 3) 90 aspecte natale: 18 perechi x 5 aspecte
pairs=list(combinations(list(PLANETS.keys()),2))[:18]
for a,b in pairs:
    an,afunc,_=PLANETS[a]; bn,bfunc,_=PLANETS[b]
    for ak,(alabel,akey,amech) in ASPECTS.items():
        slug=f"atlas/aspecte-natale/{a}-{ak}-{b}"
        title=f"{an} {alabel} {bn}: aspect natal"
        lead=f"{an} în {alabel} cu {bn} pune în relație {afunc} cu {bfunc}. Aspectul descrie {akey}, iar semnele, casele și orbul decid forma concretă."
        body="".join([
            sec("Mecanismul aspectului",[f"Într-o {alabel}, {amech}. Din acest motiv, relația dintre {an.lower()} și {bn.lower()} este mai importantă decât interpretarea separată a celor două planete.",f"{an} aduce tema de {afunc}, iar {bn} aduce tema de {bfunc}."]),
            sec(f"Rolul lui {an}",[f"{an} arată {afunc}. În acest aspect, funcția sa trebuie citită în dialog cu {bn.lower()}, nu ca factor independent.",f"Casa și semnul lui {an.lower()} arată unde și în ce stil pornește o parte importantă a dinamicii."]),
            sec(f"Rolul lui {bn}",[f"{bn} descrie {bfunc}. Poziția sa în casă și semn arată domeniul care răspunde sau completează dinamica aspectului.",f"Guvernatorii caselor implicate pot lega aspectul de teme suplimentare."]),
            sec("Orb și intensitate",[f"Cu cât orbul este mai mic, cu atât relația tehnică dintre cele două planete este mai exactă. Pentru o interpretare serioasă, exactitatea se notează explicit.",f"Caracterul aplicant sau separant poate adăuga o nuanță suplimentară, mai ales în tehnicile care țin cont de mișcarea planetară."]),
            sec("Integrare practică",[f"Un aspect de tip {alabel} nu este un verdict. El descrie un mod repetitiv în care cele două funcții caută cooperare, echilibru sau descărcare.",f"Contextul real și restul hărții decid dacă dinamica devine resursă, tensiune sau ambele."]),
        ])
        related=[(PLANET_BASE[a],f"{an} în astrologie"),(PLANET_BASE[b],f"{bn} în astrologie"),("/orburi-aspecte-aplicante-separante/","Orburi și aspecte"),("/academia-astrologie/atlas-500/","Atlas 500")]
        faq=[(f"Ce înseamnă {an} {alabel} {bn}?",f"Este o relație angulară care combină {afunc} cu {bfunc} într-o dinamică de {akey}."),("Contează orbul?","Da. Un aspect mai exact are de regulă o greutate tehnică mai mare."),("Aspectul este bun sau rău?","Nu în mod absolut. El poate funcționa constructiv sau dificil în funcție de restul hărții și de context.")]
        pages.append((slug,shell(title,lead,body,f"{BASE}/{slug}/",[f'<a href="/">AstroVip</a>',f'<a href="/academia-astrologie/atlas-500/">Atlas 500</a>',html.escape(title)],related,faq),title))

# 4) 60 tranzite lente prin case
for pk in ["jupiter","saturn","uranus","neptun","pluto"]:
    pn,pfunc,pcore=PLANETS[pk]
    for h,(htheme,hcore) in HOUSES.items():
        slug=f"atlas/tranzite/{pk}-in-tranzit-prin-casa-{h}"
        title=f"{pn} în tranzit prin Casa {h}"
        lead=f"Tranzitul lui {pn} prin Casa {h} aduce pentru o perioadă tema de {pfunc} în zona asociată cu {htheme}. Durata și intensitatea depind de planetă și de contactele cu harta natală."
        body="".join([
            sec("Tema generală",[f"În tranzit, {pn.lower()} mută temporar accentul către domeniul Casei {h}: {htheme}.",f"Fiind un proces în timp, interpretarea urmărește intrarea în casă, aspectele formate pe parcurs și ieșirea din acest sector."]),
            sec(f"Ce activează {pn}",[f"{pn} este asociat cu {pfunc}. În Casa {h}, această funcție se manifestă prin evenimente, decizii sau procese legate de {htheme}.",f"{pcore.capitalize()} poate deveni o temă mai vizibilă pe durata tranzitului."]),
            sec("Aspectele din tranzit",[f"Pe măsură ce traversează casa, {pn.lower()} poate forma aspecte cu planete natale. Contactele exacte sunt mai importante decât simpla prezență în casă.",f"Retrogradarea poate face ca aceeași planetă natală să fie activată de mai multe ori."]),
            sec("Cum se rafinează timing-ul",[f"Arcele Solare, progresiile și Revoluția Solară pot confirma dacă tranzitul prin Casa {h} coincide cu o perioadă majoră.",f"Un tranzit lent este mai convingător când aceeași temă apare simultan prin mai multe tehnici."]),
            sec("Interpretare responsabilă",[f"Tranzitul nu garantează un eveniment anume. El descrie un cadru temporal în care temele Casei {h} și funcția lui {pn.lower()} devin mai active.",f"Deciziile și circumstanțele reale rămân esențiale."]),
        ])
        related=[(PLANET_BASE[pk],f"{pn} în astrologie"),(f"/casa-{h}-astrologie/",f"Casa {h}"),("/tranzite-astrologice/","Tranzite astrologice"),("/academia-astrologie/atlas-500/","Atlas 500")]
        faq=[(f"Cât durează {pn} prin Casa {h}?","Durata depinde de viteza planetei, mărimea casei și eventualele retrogradări."),("Este suficientă casa pentru predicție?","Nu. Aspectele exacte și confirmările din alte tehnici sunt esențiale."),("Retrogradarea contează?","Da. Poate produce reveniri peste aceleași grade și activări repetate.")]
        pages.append((slug,shell(title,lead,body,f"{BASE}/{slug}/",[f'<a href="/">AstroVip</a>',f'<a href="/academia-astrologie/atlas-500/">Atlas 500</a>',html.escape(title)],related,faq),title))

# 5) 60 Arce Solare: 5 surse x 12 tinte
targets=[
    ("ascendent","Ascendent","identitate, corp, inițiativă și începuturi"),
    ("mc","MC","carieră, statut și direcție publică"),
    ("soare","Soare",PLANETS["soare"][1]),("luna","Lună",PLANETS["luna"][1]),
    ("mercur","Mercur",PLANETS["mercur"][1]),("venus","Venus",PLANETS["venus"][1]),
    ("marte","Marte",PLANETS["marte"][1]),("jupiter","Jupiter",PLANETS["jupiter"][1]),
    ("saturn","Saturn",PLANETS["saturn"][1]),("uranus","Uranus",PLANETS["uranus"][1]),
    ("neptun","Neptun",PLANETS["neptun"][1]),("pluto","Pluto",PLANETS["pluto"][1]),
]
for src in ["soare","luna","mercur","venus","marte"]:
    sn,sfunc,score=PLANETS[src]
    for tk,tn,tfunc in targets:
        slug=f"atlas/arce-solare/{src}-arc-solar-la-{tk}"
        title=f"Arc Solar {sn} = {tn}: interpretare"
        lead=f"Arc Solar {sn} = {tn} corelează {sfunc} cu {tfunc}. În timing, exactitatea, axele și confirmarea prin tranzite sunt decisive."
        body="".join([
            sec("Semnificația direcției",[f"În Arcele Solare, toate punctele sunt deplasate cu același arc, derivat din progresia Soarelui. Când {sn} direcționat ajunge la {tn}, cele două teme intră într-o perioadă de activare.",f"{sn} aduce {sfunc}; {tn} reprezintă {tfunc}."]),
            sec("Ce poate deveni vizibil",[f"Perioada poate concentra decizii sau evenimente care leagă {sfunc} de {tfunc}. Forma concretă depinde de case, guvernatori și context.",f"Un contact pe o axă precum Ascendentul sau MC-ul este deosebit de sensibil la ora natală."]),
            sec("Orb și exactitate",[f"Arcele Solare sunt de regulă analizate cu orburi restrânse. Apropierea de exactitate ajută la delimitarea perioadei.",f"Data nu trebuie izolată de ritmul real al vieții și de celelalte tehnici predictive."]),
            sec("Confirmarea prin tranzite",[f"Un tranzit lent sau un trigger rapid asupra unuia dintre cele două puncte poate întări activarea. Convergența este mai relevantă decât un singur indicator.",f"Retrogradările pot crea ferestre repetate de confirmare."]),
            sec("Cum se documentează",[f"Într-un studiu de caz se notează data evenimentului, orbul arcului și tranzitele concomitente.",f"Această metodă permite comparații între evenimente diferite și reduce interpretarea retrospectivă arbitrară."]),
        ])
        related=[("/arce-solare/","Arce Solare"),(PLANET_BASE[src],f"{sn} în astrologie"),("/tranzite-astrologice/","Tranzite"),("/academia-astrologie/atlas-500/","Atlas 500")]
        faq=[(f"Ce înseamnă Arc Solar {sn} = {tn}?",f"Este momentul în care {sn} direcționat ajunge la poziția natală a lui {tn}, punând în relație {sfunc} cu {tfunc}."),("Ce orb se folosește?","În practica predictivă sunt preferate orburi restrânse, stabilite consecvent în metodologie."),("Se confirmă prin tranzite?","Da. Confirmarea prin tranzite sau alte tehnici poate crește relevanța perioadei.")]
        pages.append((slug,shell(title,lead,body,f"{BASE}/{slug}/",[f'<a href="/">AstroVip</a>',f'<a href="/academia-astrologie/atlas-500/">Atlas 500</a>',html.escape(title)],related,faq),title))

# 6) 50 sinastrii: 10 perechi x 5 aspecte
syn_pairs=[
    ("soare","luna"),("soare","venus"),("soare","marte"),("luna","venus"),("luna","marte"),
    ("mercur","mercur"),("mercur","venus"),("venus","marte"),("venus","saturn"),("marte","saturn")
]
for a,b in syn_pairs:
    an,afunc,_=PLANETS[a]; bn,bfunc,_=PLANETS[b]
    for ak,(alabel,akey,amech) in ASPECTS.items():
        slug=f"atlas/sinastrie/{a}-{ak}-{b}"
        title=f"Sinastrie: {an} {alabel} {bn}"
        lead=f"În sinastrie, {an} în {alabel} cu {bn} conectează {afunc} ale unei persoane cu {bfunc} ale celeilalte. Aspectul descrie {akey}, dar nu definește singur relația."
        body="".join([
            sec("Ce compară aspectul",[f"Sinastria suprapune două hărți natale. Aici, {an} al unei persoane intră în {alabel} cu {bn} al celeilalte.",f"Din punct de vedere simbolic, {amech}."]),
            sec(f"Persoana {an}",[f"Persoana al cărei {an.lower()} este implicat aduce în relație tema de {afunc}.",f"Casa în care cade planeta în harta partenerului arată domeniul în care această funcție este resimțită mai direct."]),
            sec(f"Persoana {bn}",[f"Persoana al cărei {bn.lower()} este implicat aduce tema de {bfunc}.",f"Felul în care răspunde depinde de condiția natală a planetei și de alte contacte sinastrice."]),
            sec("Ce susține sau tensionează relația",[f"Aspectul de tip {alabel} creează o dinamică de {akey}. Aceasta poate deveni resursă sau provocare în funcție de maturitatea celor implicați și de restul sinastriei.",f"Saturn, luminariile, Ascendentul, Descendentul și guvernatorii caselor relaționale trebuie evaluați separat."]),
            sec("De ce nu este suficient un singur aspect",[f"O relație nu poate fi evaluată pe baza unei singure combinații. Mai multe contacte coerente pot confirma atracția, compatibilitatea, tensiunea sau continuitatea.",f"Harta compozită poate fi folosită ca metodă complementară, nu ca înlocuitor pentru sinastrie."]),
        ])
        related=[("/sinastrie/","Sinastrie"),("/sinastrie-avansata/","Sinastrie avansată"),("/harta-compozita/","Harta compozită"),("/academia-astrologie/atlas-500/","Atlas 500")]
        faq=[(f"Ce indică {an} {alabel} {bn} în sinastrie?",f"Descrie felul în care {afunc} ale unei persoane interacționează cu {bfunc} ale celeilalte într-o dinamică de {akey}."),("Aspectul garantează compatibilitatea?","Nu. Este un singur factor dintr-o rețea mult mai mare de contacte."),("Contează orbul?","Da. Aspectele foarte exacte sunt de regulă mai vizibile în relație.")]
        pages.append((slug,shell(title,lead,body,f"{BASE}/{slug}/",[f'<a href="/">AstroVip</a>',f'<a href="/academia-astrologie/atlas-500/">Atlas 500</a>',html.escape(title)],related,faq),title))

assert len(pages) == 500, len(pages)

# write content pages
for slug, content, title in pages:
    path=ROOT/slug/"index.html"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")

# hub with all 500 links
groups = [
    ("Planete în semne","atlas/planete-in-semne/"),
    ("Planete în case","atlas/planete-in-case/"),
    ("Aspecte natale","atlas/aspecte-natale/"),
    ("Tranzite prin case","atlas/tranzite/"),
    ("Arce Solare","atlas/arce-solare/"),
    ("Sinastrie","atlas/sinastrie/"),
]
cards=[]
for label,prefix in groups:
    subset=[(slug,title) for slug,_,title in pages if slug.startswith(prefix)]
    links="".join(f'<a class="kb-tile" href="/{slug}/"><strong>{html.escape(title)}</strong><span>Ghid AstroVip · Atlas 500</span></a>' for slug,title in subset)
    cards.append(f'<section><h2>{html.escape(label)} · {len(subset)} pagini</h2><div class="kb-grid">{links}</div></section>')
hub_url=f"{BASE}/academia-astrologie/atlas-500/"
hub_schema={"@context":"https://schema.org","@type":"CollectionPage","name":"Atlas AstroVip 500","url":hub_url,"inLanguage":"ro-RO","description":"500 de ghiduri AstroVip despre planete în semne și case, aspecte natale, tranzite, Arce Solare și sinastrie."}
hub=head("Atlas AstroVip 500 | 500 ghiduri astrologice","500 de ghiduri AstroVip despre planete în semne și case, aspecte natale, tranzite, Arce Solare și sinastrie.",hub_url,hub_schema)+f"""
<header class="kb-head"><div class="kb-wrap kb-nav"><a class="kb-brand" href="/">ASTROVIP</a><nav><a href="/academia-astrologie/">Academia</a><a href="/biblioteca-astrologie/">Bibliotecă</a><a href="/toate-paginile/">Toate paginile</a></nav></div></header>
<main><section class="kb-hero"><div class="kb-wrap"><div class="kb-kicker">AstroVip · colecție extinsă</div><h1>Atlas AstroVip 500</h1><p>500 de pagini tematice originale, organizate în șase clustere: planete în semne, planete în case, aspecte natale, tranzite lente, Arce Solare și sinastrie.</p></div></section>
<div class="kb-wrap kb-layout"><article class="kb-article">{''.join(cards)}</article><aside class="kb-aside"><div class="kb-card"><h3>Structură SEO</h3><p>500 URL-uri individuale · interlinking · canonical · schema Article · sitemap.</p><a class="kb-btn" href="/academia-astrologie/">Academia AstroVip</a></div></aside></div></main>
<footer class="kb-foot"><div class="kb-wrap"><strong>AstroVip</strong> · Atlas 500</div></footer></body></html>"""
hub_path=ROOT/"academia-astrologie"/"atlas-500"/"index.html"
hub_path.parent.mkdir(parents=True,exist_ok=True)
hub_path.write_text(hub,encoding="utf-8")

# link hub from Academia and directory
for relpath, marker, block in [
    ("academia-astrologie/index.html","Atlas AstroVip 500",'<section><h2>Atlas AstroVip 500</h2><p>500 de ghiduri combinatorii pentru studiu aprofundat: planete în semne și case, aspecte natale, tranzite, Arce Solare și sinastrie.</p><div class="kb-links"><a href="/academia-astrologie/atlas-500/">Deschide Atlas AstroVip 500 →</a></div></section>'),
    ("toate-paginile/index.html","Atlas AstroVip 500",'<section><h2>Atlas AstroVip 500</h2><div class="av-catalog-grid"><a class="av-catalog-card" href="/academia-astrologie/atlas-500/"><h3>500 ghiduri astrologice</h3><p>Planete în semne și case, aspecte, tranzite, Arce Solare și sinastrie.</p></a></div></section>')
]:
    p=ROOT/relpath
    if p.exists():
        txt=p.read_text(encoding="utf-8")
        if marker not in txt:
            txt=txt.replace("</main>",block+"</main>")
            p.write_text(txt,encoding="utf-8")

# sitemap
sitemap=ROOT/"sitemap.xml"
txt=sitemap.read_text(encoding="utf-8")
urls=[hub_url]+[f"{BASE}/{slug}/" for slug,_,_ in pages]
new_lines=[]
for u in urls:
    if f"<loc>{u}</loc>" not in txt:
        new_lines.append(f"<url><loc>{u}</loc><lastmod>{DATE}</lastmod></url>")
if new_lines:
    txt=txt.replace("</urlset>","\n".join(new_lines)+"\n</urlset>")
    sitemap.write_text(txt,encoding="utf-8")

print(f"Generated {len(pages)} content pages + Atlas hub.")
