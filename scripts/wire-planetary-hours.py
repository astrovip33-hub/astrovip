from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
# Mobile homepage card after horoscope, before trust.
p=ROOT/'homepage-approved-layout.js'; s=p.read_text(encoding='utf-8')
if 'avm-planetary' not in s:
    needle='''      <div class=\\"avm-trust\\" aria-label=\\"Repere AstroVip\\">'''
    card='''      <section class=\\"avm-planetary\\" aria-label=\\"Ore planetare AstroVip\\">\\n        <span>☉ TIMING ASTROLOGIC</span>\\n        <div><h2>Orele planetare de azi</h2><p>Vezi planeta orei active acum și intervalele calculate după răsărit și apus.</p></div>\\n        <a href=\\"/ore-planetare/\\">VEZI ORA PLANETARĂ →</a>\\n      </section>\\n'''
    if needle not in s: raise SystemExit('mobile trust marker missing')
    s=s.replace(needle,card+needle,1)
    cssneedle='''        #av-mobile-approved-home .avm-trust{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%;background:linear-gradient(180deg,#090b09,#030403);border-top:1px solid rgba(231,198,106,.24);border-bottom:1px solid rgba(231,198,106,.18)}\\n'''
    css='''        #av-mobile-approved-home .avm-planetary{display:grid!important;grid-template-columns:1fr auto!important;gap:7px 12px!important;align-items:center!important;width:calc(100% - 24px)!important;margin:8px auto 14px!important;padding:13px 14px!important;box-sizing:border-box!important;border:1px solid rgba(103,238,156,.34)!important;border-radius:16px!important;background:linear-gradient(135deg,#071710,#09121d)!important;box-shadow:0 10px 24px rgba(0,0,0,.22)!important}.avm-planetary>span{grid-column:1/-1;color:#67ee9c;font:900 9px/1.1 Inter,system-ui,sans-serif;letter-spacing:.12em}.avm-planetary h2{margin:0 0 4px!important;color:#efd77f!important;font:800 20px/1.08 Georgia,serif!important;text-align:left!important}.avm-planetary p{margin:0!important;color:#dbe5e0!important;font:650 12px/1.4 Inter,system-ui,sans-serif!important}.avm-planetary a{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:40px!important;padding:9px 11px!important;border:1px solid rgba(231,200,103,.55)!important;border-radius:11px!important;background:#0a1812!important;color:#f1da83!important;text-decoration:none!important;font:900 10px/1.15 Inter,system-ui,sans-serif!important;text-align:center!important;white-space:nowrap!important}\\n'''
    if cssneedle not in s: raise SystemExit('mobile css marker missing')
    s=s.replace(cssneedle,css+cssneedle,1)
    p.write_text(s,encoding='utf-8')
    print('mobile homepage wired')
else: print('mobile homepage already wired')
# Desktop homepage teaser injected by Worker after horoscope teaser.
p=ROOT/'worker-home-ultra.js'; s=p.read_text(encoding='utf-8')
if 'PLANETARY_HOURS_TEASER' not in s:
    insert_after="const PAYMENT_CTA=`<section id=\"av-home-payment-cta\""
    pos=s.find(insert_after)
    if pos<0: raise SystemExit('worker payment marker missing')
    line_end=s.find('\n',pos)
    teaser="\nconst PLANETARY_HOURS_TEASER=`<section class=\"av-planetary-hours-home\" aria-label=\"Ore planetare AstroVip\"><style>.av-planetary-hours-home{padding:0 20px 18px;background:#06110d}.av-planetary-hours-home__in{max-width:1180px;margin:auto;padding:13px 18px;border:1px solid rgba(103,238,156,.30);border-radius:17px;background:linear-gradient(135deg,#071710,#09121d);display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center}.av-planetary-hours-home__icon{font-size:27px;color:#efd77f}.av-planetary-hours-home h2{margin:0 0 3px;color:#efd77f;font:800 21px/1.08 Georgia,serif}.av-planetary-hours-home p{margin:0;color:#d9e4df;font-size:13px;line-height:1.4}.av-planetary-hours-home a{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 14px;border:1px solid rgba(231,200,103,.55);border-radius:11px;background:#0a1812;color:#f1da83;text-decoration:none;font-weight:900;font-size:11px;white-space:nowrap}@media(max-width:820px){.av-planetary-hours-home{display:none!important}}</style><span class=\"av-planetary-hours-home__icon\">☉</span><div><h2>Orele planetare de azi</h2><p>Planeta orei active acum și cele 24 de intervale calculate după răsărit și apus.</p></div><a href=\"/ore-planetare/\">VEZI ORA PLANETARĂ →</a></section>`;\n"
    s=s[:line_end+1]+teaser+s[line_end+1:]
    transform="""        .on('section.av-horoscop-teaser',{element(el){el.after(PLANETARY_HOURS_TEASER,{html:true})}})\n"""
    marker="""        .on('#studii-de-caz-home',{element(el){\n"""
    if marker not in s: raise SystemExit('worker transform marker missing')
    s=s.replace(marker,transform+marker,1)
    p.write_text(s,encoding='utf-8')
    print('desktop homepage wired')
else: print('desktop homepage already wired')
# Add to Instrumente submenu.
p=ROOT/'assets'/'ux-refresh-20261008.js'; s=p.read_text(encoding='utf-8')
if "['Ore planetare', '/ore-planetare/']" not in s:
    old="""          ['Pozițiile planetelor live', '/pozitii-planete-live/'], ['Efemeride astrologice', '/efemeride-astrologice/'],\n          ['Harta mea', '/harta-mea/'], ['Calculator numerologie', '/calculator-numerologie/']"""
    new="""          ['Pozițiile planetelor live', '/pozitii-planete-live/'], ['Ore planetare', '/ore-planetare/'],\n          ['Efemeride astrologice', '/efemeride-astrologice/'], ['Harta mea', '/harta-mea/'],\n          ['Calculator numerologie', '/calculator-numerologie/']"""
    if old not in s: raise SystemExit('instrumente links marker missing')
    s=s.replace(old,new,1); p.write_text(s,encoding='utf-8'); print('menu wired')
# Horoscop generator points the planetary-hours CTA to the new calculator.
p=ROOT/'scripts'/'build-horoscop-azi.py'; s=p.read_text(encoding='utf-8')
s=s.replace('<a class=\\"btn alt\\" href=\\"/pozitii-planete-live/\\">VEZI CERUL ACUM</a><a class=\\"btn\\" href=\\"/intrebare-gratuita/\\">PUNE 1 &Icirc;NTREBARE GRATUIT&#258;</a>','<a class=\\"btn alt\\" href=\\"/ore-planetare/\\">CALCULEAZ&#258; ORELE PLANETARE</a><a class=\\"btn\\" href=\\"/pozitii-planete-live/\\">VEZI CERUL ACUM</a>')
s=s.replace('<div class=\\"cta\\"><a class=\\"btn alt\\" href=\\"/horoscop-azi/\\">TOATE ZODIILE</a><a class=\\"btn\\" href=\\"/intrebare-gratuita/\\">1 &Icirc;NTREBARE GRATUIT&#258;</a></div>','<div class=\\"cta\\"><a class=\\"btn alt\\" href=\\"/ore-planetare/\\">ORE PLANETARE AZI</a><a class=\\"btn\\" href=\\"/intrebare-gratuita/\\">1 &Icirc;NTREBARE GRATUIT&#258;</a></div>')
p.write_text(s,encoding='utf-8'); print('horoscope generator wired')
