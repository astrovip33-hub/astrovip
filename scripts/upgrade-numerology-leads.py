from pathlib import Path
from urllib.parse import quote_plus
import re
ROOT=Path(__file__).resolve().parents[1]
pages={
 'calculator-numerologie':('Calculator numerologie','rezultatele calculatorului tău'),
 'numerologia-numelui':('Numerologia numelui','numele tău complet și vibrația lui'),
 'numarul-destinului':('Numărul destinului','Numărul Destinului tău'),
 'numarul-expresiei':('Numărul expresiei','Numărul Expresiei tale'),
 'numarul-sufletului':('Numărul sufletului','Numărul Sufletului tău'),
 'matrice-numerologica':('Matricea numerologică','matricea numerologică din data ta de naștere'),
 'compatibilitate-numerologica':('Compatibilitate numerologică','compatibilitatea numerologică dintre două persoane'),
 'numere-maestru':('Numere maestru 11, 22 și 33','semnificația numerelor maestru din profilul tău'),
 'numerologia-casei':('Numerologia casei','vibrația numerologică a locuinței tale'),
}
css='<link rel="stylesheet" href="/assets/numerology-lead-cta-20261020.css?v=1">'
for slug,(topic,focus) in pages.items():
    p=ROOT/slug/'index.html'
    s=p.read_text(encoding='utf-8')
    # idempotent cleanup
    s=re.sub(r'<section class="av-num-lead".*?</section>','',s,flags=re.S)
    if css not in s:
        s=s.replace('</head>',css+'</head>',1)
    msg=quote_plus(f'Bună ziua! Doresc o interpretare numerologică AstroVip pentru {focus}. Vă rog să îmi spuneți ce date sunt necesare și ce variantă de analiză recomandați.')
    block=f'''<section class="av-num-lead" aria-label="Interpretare numerologică AstroVip"><span class="av-num-lead__kicker">INTERPRETARE PERSONALĂ · ASTROVIP</span><h2>Vrei interpretarea ta, nu doar calculul?</h2><p>Pentru <strong>{topic}</strong>, calculul este doar începutul. Corelăm rezultatul cu data nașterii, numele și ceilalți indicatori relevanți pentru un profil numerologic coerent.</p><div class="av-num-lead__actions"><a class="av-num-lead__primary" href="https://wa.me/40722128220?text={msg}">SOLICITĂ INTERPRETAREA →</a><a class="av-num-lead__secondary" href="/intrebare-gratuita/">PUNE 1 ÎNTREBARE GRATUITĂ</a></div><small class="av-num-lead__proof">Răspuns personal · metodă explicată · fără promisiuni absolute</small></section>'''
    if '</article>' in s:
        s=s.replace('</article>',block+'</article>',1)
    elif '</main>' in s:
        s=s.replace('</main>',block+'</main>',1)
    else:
        raise RuntimeError(f'No insertion point: {slug}')
    s=s.replace('"dateModified":"2026-10-04"','"dateModified":"2026-10-20"')
    p.write_text(s,encoding='utf-8')
    print('updated',slug)
sm=ROOT/'sitemap-core.xml'
x=sm.read_text(encoding='utf-8')
for slug in pages:
    x=re.sub(rf'(<loc>https://astrovip\.ro/{re.escape(slug)}/</loc><lastmod>)[^<]+(</lastmod>)',rf'\g<1>2026-10-20\2',x)
sm.write_text(x,encoding='utf-8')
print('sitemap updated',len(pages))
