# Ascendent–Soare–Lună — seria editorială 01

13 pagini pregătite: 12 profiluri cu texte dedicate și o pagină de colecție. Publicarea primei serii a fost autorizată explicit în conversație. Cele 13 pagini sunt indexabile și incluse în sitemap-ascendent-soare-luna.xml, înregistrat în ambele indexuri sitemap. Nu se afirmă o revizuire de specialitate efectuată și nu se atribuie fictiv o semnătură personală.

## Regenerare

`python3 scripts/triplu-profil/build-serie.py --publish`

Datele editoriale sunt în `serie-01.json`. Generatorul păstrează un singur card în homepage și o singură legătură nouă în meniul existent. Imaginile WebP trebuie păstrate în `assets/triplu-profil/`; sunt comune seriei. `build.py` păstrează generatorul anterior al celor 1.728 de drafturi, cu ieșire explicită prin `--output`; acesta nu este executat în buildul site-ului.

## Verificat

Titluri, descrieri, un H1, canonical, breadcrumb, JSON-LD coerent, ID-uri unice și referințe locale. Navigarea la profil disponibil, mesaj pentru combinație în lucru și extinderea întrebărilor frecvente au fost testate în browser. Layout verificat în cadre de 360 și 390 px; cardul de homepage verificat și pe desktop. Imaginile au dimensiuni explicite și variante 480/960/1536 px; cardul folosește încărcare întârziată.

## Înainte de publicare

Revizuire de specialitate a textelor, apoi atribuirea reală a autorului/revizorului numai după confirmare. Nu există autor sau reviewer fictiv în schema paginilor. Sunt folosite WebPage și BreadcrumbList; întrebările sunt vizibile, fără promisiuni de rezultate FAQ în Google. Nu sunt inventate aspecte din semne.

Selectorul alege combinații cunoscute. Calculul din datele de naștere trimite la calculatorul existent `/harta-mea/`; nu este un nou calculator implementat aici și nu există încă transfer automat al rezultatului în selector.

Numai după autorizare: activați indexarea paginilor aprobate, integrați URL-urile în sitemapul live și verificați răspunsurile HTTP, canonicalele și performanța pe deploymentul real. Acest preview nu confirmă scoruri PageSpeed, poziții Google sau citare în sisteme AI.


## Seria 02 (3 noiembrie 2026)

Sunt 24 de interpretări indexabile, 12 în seria 01 și 12 în seria 02, plus un singur hub și un singur card de intrare în homepage. Datele editoriale noi se găsesc în `serie-02.json`; selectorul și sitemapul includ numai profilurile publicate. Pentru a evita regresiile, **nu rulați `build-serie.py --publish` fără adaptarea lui pentru ambele serii**: scriptul inițial generează numai seria 01 și poate rescrie hubul/selectorul/sitemapul. Textele sunt educaționale, nu confirmă aspecte exacte din simplul fapt că planetele/axele sunt în același semn. Imaginile WebP comune sunt refolosite pentru performanță. Nu se declară o revizuire de specialitate neconfirmată.


## Colecție completă 1728, publicare automată

Generatorul publish_all_1728.py păstrează cele 24 de profile editoriale, publică 1704 interpretări modulare noindex și 12 huburi indexabile de câte 144 variante. Selectorul funcționează pentru toate cele 1728 combinații. Sitemapul include 37 pagini indexabile din colecție. Nu rulați build-serie.py după publicarea completă fără actualizarea lui: poate suprascrie selectorul și sitemapul.
