#!/usr/bin/env python3
from pathlib import Path
import html, json

ROOT=Path(__file__).resolve().parents[1]
BASE="https://astrovip.ro"
DATE="2026-09-18"
AUTHOR="Cătălin Smaranda"

PLANETS={
"soare":("Soarele","identitate, voință, vitalitate și direcție personală","afirmare și coerență"),
"luna":("Luna","nevoi emoționale, memorie, siguranță și reacții instinctive","adaptare și răspuns afectiv"),
"mercur":("Mercur","gândire, limbaj, învățare și schimb de informații","analiză și comunicare"),
"venus":("Venus","valori, atracție, relaționare, plăcere și gust","armonie și selectarea valorilor"),
"marte":("Marte","acțiune, inițiativă, dorință, competiție și limite","mobilizare și decizie"),
"jupiter":("Jupiter","expansiune, sens, educație, încredere și oportunitate","creștere și perspectivă"),
"saturn":("Saturn","structură, timp, limită, responsabilitate și maturizare","consolidare și disciplină"),
"uranus":("Uranus","schimbare, autonomie, inovație și ruperea tiparelor","reformulare și libertate"),
"neptun":("Neptun","imaginație, sensibilitate, idealizare și permeabilitate","inspirație și dizolvarea limitelor"),
"pluto":("Pluto","intensitate, transformare, control și regenerare","schimbare profundă și putere"),
}
SIGNS={
"berbec":("Berbec","Foc","cardinal","direct, rapid și inițiator","curaj, autonomie și începuturi"),
"taur":("Taur","Pământ","fix","constant, senzorial și pragmatic","resurse, stabilitate și valori"),
"gemeni":("Gemeni","Aer","mutabil","curios, flexibil și verbal","informație, mobilitate și varietate"),
"rac":("Rac","Apă","cardinal","receptiv, protector și memorativ","familie, apartenență și siguranță"),
"leu":("Leu","Foc","fix","expresiv, creator și orientat spre vizibilitate","creativitate, recunoaștere și asumare"),
"fecioara":("Fecioară","Pământ","mutabil","analitic, atent și selectiv","ordine, utilitate și rafinare"),
"balanta":("Balanță","Aer","cardinal","relațional, comparativ și diplomatic","parteneriat, echilibru și negociere"),
"scorpion":("Scorpion","Apă","fix","intens, strategic și orientat spre profunzime","transformare, intimitate și resurse comune"),
"sagetator":("Săgetător","Foc","mutabil","explorator, expansiv și orientat spre sens","educație, călătorie și perspectivă"),
"capricorn":("Capricorn","Pământ","cardinal","disciplinat, realist și orientat spre obiective","statut, structură și responsabilitate"),
"varsator":("Vărsător","Aer","fix","independent, conceptual și reformator","rețele, autonomie și idei"),
"pesti":("Pești","Apă","mutabil","empatic, imaginativ și fluid","sensibilitate, simbol și integrare"),
}
HOUSES={
1:("identitate, corp, inițiativă și felul în care persoana intră în experiență","expresia imediată și Ascendentul"),
2:("bani, resurse, valori și stabilitate materială","administrarea resurselor și sentimentul de valoare"),
3:("comunicare, învățare, vecinătate, frați și deplasări scurte","schimbul de informații și mediul apropiat"),
4:("familie, locuință, rădăcini și viață privată","baza emoțională și spațiul intim"),
5:("creativitate, romantism, copii, hobby-uri și risc","expresia personală și bucuria de a crea"),
6:("muncă zilnică, rutine, organizare și servicii","eficiența și funcționarea de zi cu zi"),
7:("parteneriate, contracte și relații unu-la-unu","cooperarea și oglindirea prin celălalt"),
8:("resurse comune, intimitate, crize și transformare","schimbul profund și administrarea a ceea ce este împărțit"),
9:("studii superioare, călătorii, credințe și perspectivă","extinderea cadrului mental și cultural"),
10:("carieră, statut, vocație și rol public","direcția vizibilă și responsabilitatea socială"),
11:("prieteni, grupuri, rețele și proiecte de viitor","apartenența socială și obiectivele colective"),
12:("retragere, procese interioare, finaluri și ceea ce operează în fundal","recuperarea, interiorizarea și închiderea ciclurilor"),
}
PLANET_BASE={
"soare":"/soarele-in-astrologie/","luna":"/luna-in-astrologie/","mercur":"/mercur-in-astrologie/",
"venus":"/venus-in-astrologie/","marte":"/marte-in-astrologie/","jupiter":"/jupiter-in-astrologie/",
"saturn":"/saturn-in-astrologie/","uranus":"/uranus-in-astrologie/","neptun":"/neptun-in-astrologie/",
"pluto":"/pluto-in-astrologie/"
}
ASPECTS={
"conjunctie":("conjuncție","fuziune directă și concentrare pe axă"),
"cuadratura":("cuadratură","fricțiune care cere ajustare între funcția planetei și direcția axei"),
"opozitie":("opoziție","polarizare care cere echilibru între două capete ale aceleiași axe"),
}
AXES={
"ascendent":("Ascendent","identitate, corp, prezență, inițiativă și modul de a intra în situații"),
"mc":("MC","carieră, statut, vocație, direcție publică și vizibilitate"),
}

def sec(h,paras):
    return "<section><h2>"+html.escape(h)+"</h2>"+"".join("<p>"+html.escape(p)+"</p>" for p in paras)+"</section>"

def render(slug,title,lead,sections,related,faq,cluster):
    url=f"{BASE}/{slug}/"
    schema=[
      {"@context":"https://schema.org","@type":"Article","headline":title,"description":lead,
       "mainEntityOfPage":url,"inLanguage":"ro-RO","datePublished":DATE,"dateModified":DATE,
       "author":{"@type":"Person","name":AUTHOR,"url":f"{BASE}/despre-astrovip/"},
       "publisher":{"@type":"Organization","name":"AstroVip","url":f"{BASE}/"}},
      {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
       {"@type":"ListItem","position":1,"name":"AstroVip","item":f"{BASE}/"},
       {"@type":"ListItem","position":2,"name":"Academia AstroVip","item":f"{BASE}/academia-astrologie/"},
       {"@type":"ListItem","position":3,"name":"Atlas AstroVip 1000","item":f"{BASE}/academia-astrologie/atlas-1000/"},
       {"@type":"ListItem","position":4,"name":cluster,"item":f"{BASE}/academia-astrologie/atlas-1000/{cluster}/"},
       {"@type":"ListItem","position":5,"name":title,"item":url}]}
    ]
    desc=lead[:158].rstrip(" ,.;")+"."
    rel="".join(f'<a href="{u}">{html.escape(t)}</a>' for u,t in related)
    faqh="".join(f"<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>" for q,a in faq)
    body="".join(sec(h,p) for h,p in sections)
    return f"""<!doctype html><html lang="ro"><head><meta charset="utf-8">
<link rel="stylesheet" href="/assets/consent-v2.css?v=2"><script defer src="/assets/consent-v2.js?v=2"></script>
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#071107">
<title>{html.escape(title)} | AstroVip</title><meta name="description" content="{html.escape(desc)}"><meta name="author" content="{AUTHOR}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="{url}">
<meta property="og:type" content="article"><meta property="og:locale" content="ro_RO"><meta property="og:site_name" content="AstroVip">
<meta property="og:title" content="{html.escape(title)} | AstroVip"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}/assets/1000043152.png"><meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="/assets/knowledge-premium.css?v=20260918"><link rel="stylesheet" href="/assets/academy-neon.css?v=20260918-1">
<script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script></head><body>
<header class="kb-head"><div class="kb-wrap kb-nav"><a class="kb-brand" href="/">ASTROVIP</a><nav><a href="/academia-astrologie/">Academia</a><a href="/academia-astrologie/atlas-1000/">Atlas 1000</a><a href="/biblioteca-astrologie/">Bibliotecă</a><a href="/astrologie-predictiva/">Timing</a></nav></div></header>
<main><section class="kb-hero"><div class="kb-wrap"><div class="kb-kicker">AstroVip · Atlas 1000</div><h1>{html.escape(title)}</h1><p>{html.escape(lead)}</p><div class="kb-actions"><a class="kb-btn" href="/#programari">Consultație premium</a><a class="kb-ghost" href="/academia-astrologie/atlas-1000/{cluster}/">Vezi clusterul</a></div></div></section>
<div class="kb-wrap kb-crumbs"><a href="/">AstroVip</a><span>›</span><a href="/academia-astrologie/">Academia</a><span>›</span><a href="/academia-astrologie/atlas-1000/">Atlas 1000</a><span>›</span>{html.escape(title)}</div>
<div class="kb-wrap kb-layout"><article class="kb-article">{body}
<section><h2>Întrebări frecvente</h2>{faqh}</section><section><h2>Documentare conexă</h2><div class="kb-links">{rel}</div></section>
<div class="kb-author"><strong>Autor: {AUTHOR} · AstroVip</strong><p>Material educativ și interpretativ. O configurație astrologică se citește în contextul întregii hărți, al orburilor, guvernatorilor și al tehnicilor de timing relevante.</p></div>
</article><aside class="kb-aside"><div class="kb-card"><div class="kb-label">Cluster tematic</div><p>{html.escape(cluster.replace("-"," ").title())}</p><a class="kb-btn" href="/academia-astrologie/atlas-1000/{cluster}/">Toate paginile clusterului</a></div></aside></div></main>
<footer class="kb-foot"><div class="kb-wrap"><strong>AstroVip</strong> · Astrologie & Numerologie Premium</div></footer></body></html>"""

pages=[]

# 1. 120 pagini: planeta ca guvernator al casei
cluster="guvernatori-case"
for pk,(pn,pfunc,pcore) in PLANETS.items():
  for h,(htheme,hcore) in HOUSES.items():
    slug=f"atlas/{cluster}/{pk}-guvernator-casa-{h}"
    title=f"{pn} guvernator al Casei {h}: cum se interpretează"
    lead=f"Când {pn} guvernează Casa {h}, temele de {htheme} sunt conduse prin funcția lui {pn.lower()}: {pfunc}. Poziția guvernatorului arată unde se descarcă concret subiectele casei."
    sections=[
      ("Principiul guvernatorului de casă",[f"Guvernatorul unei case este planeta care stăpânește semnul de pe cuspida acelei case. Dacă {pn} guvernează Casa {h}, funcția lui devine un canal principal pentru temele de {htheme}.",f"Interpretarea nu se oprește la cuspă. Casa în care se află {pn.lower()}, semnul său, demnitatea și aspectele arată cum este administrat domeniul Casei {h}."]),
      (f"Ce reprezintă Casa {h}",[f"Casa {h} concentrează teme de {htheme}. Nucleul său poate fi rezumat prin {hcore}.",f"Când evenimentele din acest domeniu devin importante, starea guvernatorului oferă informații despre resurse, blocaje și direcția de manifestare."]),
      (f"Rolul lui {pn}",[f"{pn} este asociat cu {pfunc}. Ca guvernator al Casei {h}, el leagă acest set de funcții de subiectele casei și poate conecta două domenii dacă este plasat într-o altă casă natală.",f"{pcore.capitalize()} devine astfel o cheie interpretativă pentru felul în care persoana gestionează temele Casei {h}."]),
      ("Casa în care se află guvernatorul",[f"Dacă {pn.lower()} se află într-o altă casă, temele Casei {h} tind să caute expresie prin acel al doilea domeniu. Această relație dintre «casa guvernată» și «casa ocupată» este una dintre cele mai utile reguli structurale.",f"De exemplu, un guvernator al unei case relaționale plasat într-o casă profesională poate conecta parteneriatele cu statutul sau cariera, fără a impune un singur rezultat."]),
      ("Aspecte și demnitate",[f"Aspectele către {pn.lower()} arată ce alte funcții planetare intră în dialog cu temele Casei {h}. Demnitatea esențială și accidentală poate descrie cât de direct sau complicat se exprimă planeta.",f"Un guvernator puternic nu garantează rezultate, iar unul tensionat nu anulează potențialul; descrie mai degrabă condițiile în care tema trebuie administrată."]),
      ("Activarea în timing",[f"Tranzitele, Arcele Solare și progresiile către {pn.lower()} pot reactiva temele Casei {h}, mai ales când planeta este un guvernator important al hărții.",f"Pentru cuspide și guvernatori este esențială o oră natală corectă, deoarece schimbarea Ascendentului poate modifica întregul sistem de stăpâniri."]),
    ]
    related=[("/guvernatori-dispozitori/","Guvernatori și dispozitori"),(f"/casa-{h}-astrologie/",f"Casa {h}"),(PLANET_BASE[pk],f"{pn} în astrologie"),("/rectificare-ora-nasterii/","Rectificarea orei")]
    faq=[(f"Ce înseamnă {pn} guvernator al Casei {h}?",f"Înseamnă că semnul aflat pe cuspida Casei {h} este guvernat de {pn}, iar planeta devine un indicator-cheie pentru {htheme}."),("Contează casa în care se află guvernatorul?","Da. Ea arată domeniul prin care tind să se manifeste temele casei guvernate."),("Ora nașterii contează?","Da, deoarece cuspidele și stăpânirile caselor depind direct de ora și locul nașterii.")]
    pages.append((slug,render(slug,title,lead,sections,related,faq,cluster),title,cluster))

# 2. 120 pagini: planete în casele Revoluției Solare
cluster="revolutie-solara-case"
for pk,(pn,pfunc,pcore) in PLANETS.items():
  for h,(htheme,hcore) in HOUSES.items():
    slug=f"atlas/{cluster}/{pk}-in-casa-{h}"
    title=f"{pn} în Casa {h} a Revoluției Solare"
    lead=f"În Revoluția Solară, {pn} în Casa {h} pune pe agenda anului relația dintre {pfunc} și domeniul de {htheme}. Relevanța crește când poziția repetă teme natale sau tranzite importante."
    sections=[
      ("Rolul planetei în anul solar",[f"{pn} aduce în harta anuală teme de {pfunc}. Casa în care cade arată unde această funcție tinde să fie mai activă de la o aniversare la următoarea.",f"Revoluția Solară nu se citește separat de natală: poziția anuală capătă sens prin suprapunerea peste casele și planetele natale."]),
      (f"Casa {h} în Revoluția Solară",[f"Casa {h} concentrează în anul respectiv subiecte de {htheme}. {hcore.capitalize()} poate deveni mai vizibil în decizii, contexte sau priorități.",f"Un sector accentuat poate descrie atât oportunități, cât și necesitatea de a investi mai multă atenție în acel domeniu."]),
      (f"Cum se exprimă {pn}",[f"Prin {pn.lower()}, tema anuală capătă tonalitatea de {pcore}. Dacă planeta este angulară sau puternic aspectată, accentul poate fi mai evident.",f"Semnul lui {pn.lower()} din Revoluția Solară descrie stilul, iar guvernatorul Casei {h} completează circuitul interpretativ."]),
      ("Legătura cu harta natală",[f"Dacă {pn.lower()} al Revoluției Solare atinge o planetă sau o axă natală, tema anuală poate deveni mai personală și mai ușor de corelat cu evenimente reale.",f"Suprapunerile RS–natală sunt utile mai ales când aceeași zonă este activată și de tranzite lente sau Arce Solare."]),
      ("Aspecte și axe",[f"Aspectele lui {pn.lower()} în harta anuală arată ce funcții cooperează sau intră în tensiune cu tema Casei {h}. Apropierea de ASC, MC, DSC sau IC poate crește vizibilitatea.",f"O configurație exactă are de regulă mai multă greutate decât o poziție izolată fără aspecte puternice."]),
      ("Cum se folosește în timing",[f"Revoluția Solară oferă cadrul pentru aproximativ un an, dar nu fixează singură data unui eveniment. Tranzitele, progresiile și Revoluțiile Lunare pot rafina ferestrele temporale.",f"Interpretarea devine mai robustă când mai multe tehnici repetă aceeași temă a Casei {h}."]),
    ]
    related=[("/revolutie-solara/","Revoluție Solară"),(f"/casa-{h}-astrologie/",f"Casa {h}"),(PLANET_BASE[pk],f"{pn} în astrologie"),("/tranzite-astrologice/","Tranzite")]
    faq=[(f"Ce indică {pn} în Casa {h} a Revoluției Solare?",f"Accentuează în anul solar legătura dintre {pfunc} și {htheme}."),("Poziția prezice singură un eveniment?","Nu. Trebuie comparată cu harta natală și confirmată prin alte tehnici."),("Contează dacă planeta este angulară?","Da. O planetă aproape de axe poate deveni mai vizibilă în dinamica anului.")]
    pages.append((slug,render(slug,title,lead,sections,related,faq,cluster),title,cluster))

# 3. 120 pagini: tranzite planetare prin semne
cluster="tranzite-in-semne"
for pk,(pn,pfunc,pcore) in PLANETS.items():
  for sk,(sn,elem,mod,style,theme) in SIGNS.items():
    slug=f"atlas/{cluster}/{pk}-in-{sk}"
    title=f"{pn} în tranzit prin {sn}: interpretare"
    lead=f"Tranzitul lui {pn} prin {sn} combină pentru o perioadă {pfunc} cu un registru {style}. Efectul personal depinde de casa natală traversată și de aspectele exacte cu harta."
    sections=[
      (f"Ce aduce tranzitul lui {pn}",[f"În tranzit, {pn.lower()} activează temporar teme de {pfunc}. Ritmul și durata sunt diferite pentru fiecare planetă, de aceea un tranzit al unei planete lente poate descrie un proces mult mai lung decât unul al unei planete rapide.",f"{pcore.capitalize()} este una dintre cheile de lectură, dar evenimentele concrete apar numai în relație cu harta natală."]),
      (f"Filtrul semnului {sn}",[f"{sn} este un semn de {elem.lower()}, cu modalitate {mod}, și lucrează într-un stil {style}. Temele sale includ {theme}.",f"Când {pn.lower()} traversează acest semn, funcția planetei este exprimată prin aceste priorități colective și simbolice."]),
      ("Unde se simte personal",[f"Pentru o persoană, casa natală în care se află {sn} arată domeniul de viață în care tranzitul poate deveni mai vizibil.",f"Dacă semnul este interceptat sau traversează două case, este necesară o lectură mai precisă a gradelor și cuspidei."]),
      ("Aspectele către harta natală",[f"Tranzitul devine mai personal când {pn.lower()} formează un aspect exact cu Soarele, Luna, Ascendentul, MC-ul sau alte planete natale importante.",f"Orbul, caracterul aplicant/separant și eventualele reveniri prin retrogradare ajută la delimitarea perioadei."]),
      ("Faza retrogradă",[f"Dacă {pn} retrogradează în {sn}, aceeași zonă zodiacală poate fi traversată de mai multe ori. Acest lucru poate crea o secvență de introducere, revizuire și consolidare.",f"Nu toate trecerile au aceeași intensitate; contactele exacte cu harta natală sunt criteriul principal."]),
      ("Integrarea cu alte tehnici",[f"Tranzitul prin {sn} capătă greutate când coincide cu Arce Solare, progresii sau o Revoluție Solară care accentuează aceeași temă.",f"AstroVip urmărește convergența indicatorilor pentru a evita predicțiile bazate pe un singur tranzit generic."]),
    ]
    related=[("/tranzite-astrologice/","Tranzite astrologice"),(PLANET_BASE[pk],f"{pn} în astrologie"),(f"/zodiac/{sk}/",f"Semnul {sn}"),("/astrologie-predictiva/","Astrologie predictivă")]
    faq=[(f"Ce înseamnă {pn} în tranzit prin {sn}?",f"Este perioada în care {pn} traversează zodiacal semnul {sn}, combinând {pfunc} cu temele de {theme}."),("Toată lumea trăiește tranzitul la fel?","Nu. Casa natală traversată și aspectele exacte fac diferența."),("Retrogradarea contează?","Da. Poate produce mai multe treceri peste aceleași grade și teme repetate.")]
    pages.append((slug,render(slug,title,lead,sections,related,faq,cluster),title,cluster))

# 4. 80 pagini: planeta unei persoane în casa partenerului
cluster="sinastrie-case"
syn_houses=[1,2,4,5,7,8,10,12]
for pk,(pn,pfunc,pcore) in PLANETS.items():
  for h in syn_houses:
    htheme,hcore=HOUSES[h]
    slug=f"atlas/{cluster}/{pk}-in-casa-{h}-a-partenerului"
    title=f"Sinastrie: {pn} în Casa {h} a partenerului"
    lead=f"În sinastrie, când {pn} al unei persoane cade în Casa {h} a celeilalte, {pfunc} activează domeniul de {htheme}. Suprapunerea de casă completează aspectele dintre cele două hărți."
    sections=[
      ("Ce înseamnă suprapunerea de casă",[f"Suprapunerea arată în ce sector al hărții partenerului se proiectează planeta celeilalte persoane. Aici, {pn} intră în Casa {h}, asociată cu {htheme}.",f"Persoana casei poate percepe mai direct funcția planetară în acel domeniu, iar persoana planetei poate simți că este invitată să exprime acolo {pfunc}."]),
      (f"Experiența persoanei {pn}",[f"Persoana planetei aduce în relație {pfunc}. În Casa {h} a partenerului, această funcție poate deveni un stimul pentru decizii, atracție, conversații sau procese legate de {htheme}.",f"Semnul și aspectele natale ale lui {pn.lower()} descriu stilul în care această energie este oferită."]),
      (f"Experiența persoanei Casei {h}",[f"Persoana casei poate simți că zona de {htheme} este activată de prezența celuilalt. Reacția nu este uniformă; depinde de planetele deja existente în Casa {h} și de guvernatorul ei.",f"{hcore.capitalize()} poate deveni un punct important în dinamica relației."]),
      ("Aspectele dintre planete",[f"O suprapunere de casă nu este suficientă pentru evaluarea relației. Aspectele dintre luminarii, Venus, Marte, Mercur și Saturn arată cum funcționează efectiv interacțiunea.",f"Dacă {pn.lower()} formează simultan aspecte exacte cu planete personale ale partenerului, tema Casei {h} poate deveni mai puternică."]),
      ("Atracție, continuitate și limite",[f"Unele suprapuneri produc atracție imediată, altele sentiment de responsabilitate, familiaritate sau presiune. Niciuna nu garantează durata relației.",f"Continuitatea este mai bine evaluată prin rețeaua de aspecte, Saturn, axele și guvernatorii relaționali."]),
      ("Cum se integrează cu harta compozită",[f"Harta compozită poate arăta dacă tema Casei {h} reapare în structura relației ca sistem. Repetarea aceleiași teme în sinastrie și compozit crește coerența interpretării.",f"AstroVip folosește convergența dintre tehnici, nu un singur indicator izolat."]),
    ]
    related=[("/sinastrie/","Sinastrie"),("/sinastrie-avansata/","Sinastrie avansată"),("/harta-compozita/","Harta compozită"),(PLANET_BASE[pk],f"{pn} în astrologie")]
    faq=[(f"Ce înseamnă {pn} în Casa {h} a partenerului?",f"Înseamnă că funcția lui {pn.lower()} activează pentru partener teme de {htheme}."),("Suprapunerea garantează compatibilitatea?","Nu. Aspectele dintre planete și restul sinastriei sunt esențiale."),("Cine simte mai puternic suprapunerea?","Ambele persoane o pot resimți diferit: una prin funcția planetei, cealaltă prin domeniul casei activate.")]
    pages.append((slug,render(slug,title,lead,sections,related,faq,cluster),title,cluster))

# 5. 60 pagini: planete în aspect cu ASC/MC
cluster="planete-axe"
for pk,(pn,pfunc,pcore) in PLANETS.items():
  for ax,(an,afunc) in AXES.items():
    for ak,(alabel,mechanism) in ASPECTS.items():
      slug=f"atlas/{cluster}/{pk}-{ak}-{ax}"
      title=f"{pn} {alabel} {an}: aspect natal"
      lead=f"{pn} în {alabel} cu {an} leagă {pfunc} de {afunc}. Fiind implicată o axă, precizia orei de naștere și orbul aspectului sunt esențiale."
      sections=[
        ("De ce axele au greutate mare",[f"Ascendentul și MC-ul sunt puncte dependente de ora și locul nașterii. Un aspect exact cu o planetă poate deveni foarte vizibil deoarece conectează funcția planetară cu identitatea sau direcția publică.",f"În acest caz, {an} reprezintă {afunc}."]),
        (f"Rolul lui {pn}",[f"{pn} descrie {pfunc}. În contact cu {an}, această funcție poate deveni o parte evidentă a modului în care persoana se prezintă, acționează sau este observată.",f"{pcore.capitalize()} oferă un fir central pentru integrarea aspectului."]),
        (f"Mecanismul de {alabel}",[f"O {alabel} indică {mechanism}. Sensul exact depinde de semnul planetei și de casele pe care le guvernează.",f"Aspectul nu se clasifică automat drept favorabil sau dificil; se urmărește modul în care cele două funcții sunt integrate."]),
        ("Orbul și rectificarea orei",[f"Pentru un aspect planetă–axă, un orb mic este deosebit de relevant. Dacă ora natală este aproximativă, poziția {an} poate fi suficient de deplasată încât aspectul să devină incert.",f"În studii de caz, rectificarea orei poate fi testată prin evenimente care activează repetat aceeași axă."]),
        ("Manifestare în evenimente",[f"Tranzitele și Arcele Solare care reactivează {pn.lower()} sau {an} pot coincide cu perioade în care tema aspectului devine mai vizibilă.",f"Pentru {an}, evenimentele se corelează frecvent cu domenii de {afunc}, dar natura concretă depinde de restul hărții."]),
        ("Integrare în harta natală",[f"Aspectul se citește împreună cu guvernatorul {an}, cu casele conduse de {pn.lower()} și cu planetele care aspectează aceeași axă.",f"Convergența acestor factori oferă o interpretare mai precisă decât o formulă izolată."]),
      ]
      related=[(PLANET_BASE[pk],f"{pn} în astrologie"),("/precizia-orei-de-nastere/","Precizia orei"),("/rectificare-ora-nasterii/","Rectificarea orei"),("/orburi-aspecte-aplicante-separante/","Orburi și aspecte")]
      faq=[(f"Ce indică {pn} {alabel} {an}?",f"Leagă {pfunc} de {afunc} printr-o dinamică de tip {alabel}."),("Ora de naștere contează?","Da, foarte mult. Ascendentul și MC-ul se deplasează rapid odată cu ora."),("Se poate activa predictiv?","Da. Tranzitele și Arcele Solare către planetă sau axă pot reactiva tema aspectului.")]
      pages.append((slug,render(slug,title,lead,sections,related,faq,cluster),title,cluster))

assert len(pages)==500, len(pages)
for slug,content,title,cluster in pages:
    p=ROOT/slug/"index.html"
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(content,encoding="utf-8")

print("Generated exactly 500 new AstroVip pages (round 2).")
