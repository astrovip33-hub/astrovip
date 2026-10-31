from pathlib import Path

p = Path("index.html")
s = p.read_text(encoding="utf-8")

# Keep the browser assets fresh, but do not rely on the legacy footer runtime.
s = s.replace(
    "/assets/footer-orbit-20261026.js?v=20261026-vivid1",
    "/assets/footer-orbit-20261026.js?v=20261026-vivid2",
)

css = '<link id="av-cert-l7x-css" rel="stylesheet" href="/assets/certificare-card-20261026.css?v=20261026-worker1">'
if 'id="av-cert-l7x-css"' not in s:
    if "</head>" not in s:
        raise SystemExit("Missing </head> in index.html")
    s = s.replace("</head>", css + "\n</head>", 1)
else:
    import re
    s = re.sub(
        r'<link id="av-cert-l7x-css" rel="stylesheet" href="/assets/certificare-card-20261026\.css\?v=[^"]+">',
        css,
        s,
        count=1,
    )

# Fallback runtime only; the final production Worker owns the visible mount.
s = s.replace(
    '/assets/certificare-card-20261026.js?v=20261026-live3',
    '/assets/certificare-card-20261026.js?v=20261026-worker1',
).replace(
    '/assets/certificare-card-20261026.js?v=20261026-live4',
    '/assets/certificare-card-20261026.js?v=20261026-worker1',
)

card = '''
<section id="av-cert-l7x" class="av-cert-l7x" data-av-cert-source="worker-final-v1" aria-labelledby="av-cert-l7x-title" style="display:block!important;visibility:visible!important;opacity:1!important">
  <div class="avc-card">
    <div class="avc-orbits" aria-hidden="true"></div>
    <div class="avc-copy">
      <div class="avc-brand"><span class="avc-brand-star" aria-hidden="true">✦</span><span>ASTROVIP</span></div>
      <div class="avc-eyebrow">EXPERTIZĂ <span>•</span> CUNOAȘTERE <span>•</span> EVOLUȚIE</div>
      <h2 class="avc-heading" id="av-cert-l7x-title">CERTIFICAT <strong>DE ASTROLOG</strong></h2>
      <p class="avc-subtitle">Recunoaștere profesională</p>
      <div class="avc-rule" aria-hidden="true"></div>
      <div class="avc-facts">
        <div class="avc-fact"><span class="avc-icon" aria-hidden="true">✦</span><div><strong>Experiență 33+ ani</strong><small>Practica și încrederea a mii de oameni</small></div></div>
        <div class="avc-fact"><span class="avc-icon" aria-hidden="true">Ψ</span><div><strong>Licențiat în Psihologie</strong><small>Fundație științifică și abordare umană</small></div></div>
        <div class="avc-fact"><span class="avc-icon" aria-hidden="true">✺</span><div><strong>Astrologie &amp; Numerologie Premium</strong><small>Analize profunde pentru o viață în echilibru</small></div></div>
      </div>
      <a class="avc-cta" href="/studii-de-caz/diploma-astrologie-2014/" aria-label="Vezi certificarea de astrolog">VEZI CERTIFICAREA <span aria-hidden="true">→</span></a>
    </div>
    <div class="avc-visual" aria-hidden="true">
      <div class="avc-halo"></div><div class="avc-sphere"></div>
      <div class="avc-certificate"><div class="avc-paper"><div class="avc-cert-star">✦</div><small>ASTROVIP</small><b>CERTIFICAT<br>DE ASTROLOG</b><em>RECUNOAȘTERE PROFESIONALĂ</em><div class="avc-moons">☾ ◐ ● ◑ ☽</div><div class="avc-sun"></div></div></div>
    </div>
  </div>
</section>
'''

pfa_card = '''
<section id="av-pfa-footer-card" class="av-pfa-footer-card" aria-label="Date furnizor AstroVip" style="display:block!important;visibility:visible!important;opacity:1!important">
  <style>
    #av-pfa-footer-card{box-sizing:border-box!important;width:min(94%,860px)!important;margin:28px auto 18px!important;padding:1px!important;border-radius:22px!important;background:linear-gradient(135deg,#071a36 0%,#123f77 38%,#d7b85a 64%,#071a36 100%)!important;box-shadow:0 18px 48px rgba(0,0,0,.38),0 0 28px rgba(22,77,139,.24)!important;clear:both!important}
    #av-pfa-footer-card *{box-sizing:border-box!important}
    #av-pfa-footer-card .avpfa-in{display:grid!important;gap:12px!important;padding:22px 24px!important;border-radius:21px!important;background:linear-gradient(145deg,rgba(3,9,18,.98),rgba(5,18,35,.98) 62%,rgba(4,10,20,.99))!important;text-align:center!important}
    #av-pfa-footer-card .avpfa-kicker{color:#77b7ff!important;font:800 10px/1.2 Inter,system-ui,sans-serif!important;letter-spacing:.18em!important;text-transform:uppercase!important}
    #av-pfa-footer-card .avpfa-name{margin:0!important;color:#fff4cf!important;font:800 clamp(18px,2.6vw,28px)/1.18 Georgia,serif!important;letter-spacing:.02em!important}
    #av-pfa-footer-card .avpfa-role{color:#d9eaff!important;font:700 13px/1.35 Inter,system-ui,sans-serif!important}
    #av-pfa-footer-card .avpfa-rule{width:86px!important;height:1px!important;margin:1px auto 3px!important;background:linear-gradient(90deg,transparent,#d8b85d,transparent)!important}
    #av-pfa-footer-card .avpfa-bank{display:grid!important;gap:5px!important;padding:14px 16px!important;border:1px solid rgba(82,152,230,.42)!important;border-radius:14px!important;background:rgba(7,29,56,.56)!important}
    #av-pfa-footer-card .avpfa-label{color:#9fc9ff!important;font:800 10px/1.25 Inter,system-ui,sans-serif!important;letter-spacing:.10em!important;text-transform:uppercase!important}
    #av-pfa-footer-card .avpfa-holder{color:#eef6ff!important;font:700 12px/1.35 Inter,system-ui,sans-serif!important}
    #av-pfa-footer-card .avpfa-iban{overflow-wrap:anywhere!important;color:#f6d979!important;font:900 clamp(14px,2.1vw,18px)/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;letter-spacing:.035em!important}
    @media(max-width:640px){#av-pfa-footer-card{width:calc(100% - 24px)!important;margin:20px 12px 14px!important;border-radius:18px!important}#av-pfa-footer-card .avpfa-in{padding:18px 14px!important;border-radius:17px!important;gap:10px!important}#av-pfa-footer-card .avpfa-name{font-size:20px!important}#av-pfa-footer-card .avpfa-iban{font-size:13px!important;letter-spacing:.015em!important}}
  </style>
  <div class="avpfa-in">
    <div class="avpfa-kicker">DATE FURNIZOR · ASTROVIP</div>
    <h2 class="avpfa-name">Smaranda Cristian Catalin PFA</h2>
    <div class="avpfa-role">Astrolog Autorizat</div>
    <div class="avpfa-rule" aria-hidden="true"></div>
    <div class="avpfa-bank">
      <span class="avpfa-label">Cont bancar</span>
      <span class="avpfa-holder">Smaranda Cristian Catalin</span>
      <strong class="avpfa-iban">RO08BTRLRONCRT0CS6331801</strong>
    </div>
  </div>
</section>
'''

# Keep static fallbacks in the deployed asset for non-ultra render paths.
if 'id="av-cert-l7x"' not in s:
    anchor_id = 'id="cine-analizeaza-harta"'
    pos = s.find(anchor_id)
    if pos < 0:
        raise SystemExit("Missing #cine-analizeaza-harta anchor in index.html")
    section_end = s.find("</section>", pos)
    if section_end < 0:
        raise SystemExit("Could not resolve expert section boundary")
    insert_at = section_end + len("</section>")
    s = s[:insert_at] + "\n" + card + s[insert_at:]

if 'id="av-pfa-footer-card"' not in s:
    footer_end = s.rfind("</footer>")
    if footer_end >= 0:
        s = s[:footer_end] + "\n" + pfa_card + "\n" + s[footer_end:]
    else:
        body_end = s.rfind("</body>")
        if body_end < 0:
            raise SystemExit("Missing </footer> and </body> anchors in index.html")
        s = s[:body_end] + "\n" + pfa_card + "\n" + s[body_end:]

p.write_text(s, encoding="utf-8")

# Production homepage is transformed by worker-home-ultra.js after index.html is read.
# Mount the approved certification card and the PFA card in the FINAL render path.
w = Path("worker-home-ultra.js")
ws = w.read_text(encoding="utf-8")
worker_card = '<link rel="stylesheet" href="/assets/certificare-card-20261026.css?v=20261026-worker1"><style>#av-cert-l7x{display:block!important;visibility:visible!important;opacity:1!important}</style>' + card.strip()
worker_card_js = worker_card.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
pfa_worker_card = pfa_card.strip()
pfa_worker_card_js = pfa_worker_card.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

anchor = 'const HOMEPAGE_CRITICAL='
if anchor not in ws:
    raise SystemExit("Missing HOMEPAGE_CRITICAL anchor in worker-home-ultra.js")

if 'const CERTIFICATION_CARD_L7X=' not in ws:
    ws = ws.replace(anchor, f'const CERTIFICATION_CARD_L7X=`{worker_card_js}`;\n\n{anchor}', 1)

if 'const PFA_FOOTER_CARD=' not in ws:
    ws = ws.replace(anchor, f'const PFA_FOOTER_CARD=`{pfa_worker_card_js}`;\n\n{anchor}', 1)

old = '''        .on('#studii-de-caz-home',{element(el){
          el.setAttribute('data-av-slider-shell','v8');
          el.append(CASE_NAV_V8,{html:true});
        }})'''
new = '''        .on('#av-cert-l7x',{element(el){el.remove()}})
        .on('#studii-de-caz-home',{element(el){
          el.setAttribute('data-av-slider-shell','v8');
          el.append(CASE_NAV_V8,{html:true});
          el.after(CERTIFICATION_CARD_L7X,{html:true});
        }})'''
if 'el.after(CERTIFICATION_CARD_L7X' not in ws:
    if old not in ws:
        raise SystemExit("Missing case-study mount block in worker-home-ultra.js")
    ws = ws.replace(old, new, 1)

pfa_mount = '''        .on('#av-pfa-footer-card',{element(el){el.remove()}})
        .on('footer',{element(el){el.append(PFA_FOOTER_CARD,{html:true});}})'''
if 'el.append(PFA_FOOTER_CARD' not in ws:
    if new not in ws:
        raise SystemExit("Missing certification mount block for PFA footer injection")
    ws = ws.replace(new, new + "\n" + pfa_mount, 1)

w.write_text(ws, encoding="utf-8")
print("Certification card + PFA footer card mounted in FINAL production Worker.")
