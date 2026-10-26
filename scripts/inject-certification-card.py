from pathlib import Path

p = Path("index.html")
s = p.read_text(encoding="utf-8")

# Refresh the footer runtime reference, but do not depend on it for this card.
s = s.replace(
    "/assets/footer-orbit-20261026.js?v=20261026-vivid1",
    "/assets/footer-orbit-20261026.js?v=20261026-vivid2",
)

css = '<link id="av-cert-l7x-css" rel="stylesheet" href="/assets/certificare-card-20261026.css?v=20261026-live4">'
if 'id="av-cert-l7x-css"' not in s:
    if "</head>" not in s:
        raise SystemExit("Missing </head> in index.html")
    s = s.replace("</head>", css + "\n</head>", 1)
else:
    s = s.replace(
        '/assets/certificare-card-20261026.css?v=20261026-live3',
        '/assets/certificare-card-20261026.css?v=20261026-live4',
    )

# Keep the runtime loader versioned as a fallback only. The card itself is static HTML.
s = s.replace(
    '/assets/certificare-card-20261026.js?v=20261026-live3',
    '/assets/certificare-card-20261026.js?v=20261026-live4',
)

card = '''
<section id="av-cert-l7x" class="av-cert-l7x" aria-labelledby="av-cert-l7x-title" style="display:block!important;visibility:visible!important;opacity:1!important">
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

if 'id="av-cert-l7x"' not in s:
    anchor_id = 'id="cine-analizeaza-harta"'
    pos = s.find(anchor_id)
    if pos < 0:
        raise SystemExit("Missing #cine-analizeaza-harta anchor in index.html")
    section_start = s.rfind("<section", 0, pos)
    section_end = s.find("</section>", pos)
    if section_start < 0 or section_end < 0:
        raise SystemExit("Could not resolve expert section boundaries")
    insert_at = section_end + len("</section>")
    s = s[:insert_at] + "\n" + card + s[insert_at:]

p.write_text(s, encoding="utf-8")
print("Certification card static HTML injected after #cine-analizeaza-harta.")
