from pathlib import Path

ROOT = Path('.')
SKIP_PARTS = {'node_modules', '.git', 'command-center'}
HEAD_BLOCK = '''\n<!-- ASTROVIP_PREMIUM_V9 -->\n<link rel="manifest" href="/manifest.webmanifest">\n<link rel="stylesheet" href="/assets/astrovip-design-system-v9.css">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'''
SCRIPT_BLOCK = '''\n<script type="module" src="/assets/premium-v9/main.js"></script>\n<!-- /ASTROVIP_PREMIUM_V9 -->\n'''
COMMAND_BLOCK = '''\n<!-- ASTROVIP_COMMAND_V9 -->\n<script src="/command-center/v9-extension.js" defer></script>\n<!-- /ASTROVIP_COMMAND_V9 -->\n'''
HOMEPAGE_TOOLS = '''\n<!-- ASTROVIP_PREMIUM_TOOLS_V9 -->\n<section class="av-v9-tools" aria-labelledby="av-v9-tools-title" style="width:min(1180px,92%);margin:18px auto 34px;padding:18px;border:1px solid rgba(216,245,0,.28);border-radius:18px;background:linear-gradient(135deg,rgba(8,32,70,.80),rgba(4,17,38,.92));box-shadow:0 18px 50px rgba(0,0,0,.22)">\n  <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap">\n    <div style="min-width:min(100%,520px);flex:1">\n      <div style="font-size:11px;font-weight:900;letter-spacing:1.25px;color:#d8f500">ASTROVIP INTERACTIVE ENGINE</div>\n      <h2 id="av-v9-tools-title" style="margin:5px 0 6px;color:#fff;font-size:clamp(21px,3vw,31px)">Calculează harta natală cu Swiss Ephemeris</h2>\n      <p style="margin:0;color:#c9d8ef;line-height:1.6">Poziții planetare tropicale, case Koch, roată interactivă și raport pregătit pentru PDF, direct în noua platformă AstroVip.</p>\n    </div>\n    <div style="display:flex;gap:9px;flex-wrap:wrap">\n      <a href="/calculator/" style="display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:11px 18px;border-radius:999px;background:#d8f500;color:#081000;font-weight:950;text-decoration:none">Deschide calculatorul</a>\n      <a href="/booking/" style="display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:11px 18px;border:1px solid rgba(216,245,0,.55);border-radius:999px;color:#efff72;font-weight:900;text-decoration:none">Programare premium</a>\n    </div>\n  </div>\n</section>\n<!-- /ASTROVIP_PREMIUM_TOOLS_V9 -->\n'''

changed = 0
scanned = 0
for path in ROOT.rglob('*.html'):
    if any(part in SKIP_PARTS for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8', errors='ignore')
    scanned += 1
    if 'ASTROVIP_PREMIUM_V9' in text or '/assets/premium-v9/main.js' in text:
        continue
    lower = text.lower()
    if '</head>' not in lower or '</body>' not in lower:
        continue
    head_pos = lower.rfind('</head>')
    text = text[:head_pos] + HEAD_BLOCK + text[head_pos:]
    lower = text.lower()
    body_pos = lower.rfind('</body>')
    text = text[:body_pos] + SCRIPT_BLOCK + text[body_pos:]
    path.write_text(text, encoding='utf-8')
    changed += 1

homepage = ROOT / 'index.html'
homepage_changed = False
if homepage.exists():
    text = homepage.read_text(encoding='utf-8', errors='ignore')
    if 'ASTROVIP_PREMIUM_TOOLS_V9' not in text and 'href="/calculator/"' not in text:
        lower = text.lower()
        main_pos = lower.rfind('</main>')
        insert_pos = main_pos if main_pos >= 0 else lower.rfind('</body>')
        if insert_pos >= 0:
            text = text[:insert_pos] + HOMEPAGE_TOOLS + text[insert_pos:]
            homepage.write_text(text, encoding='utf-8')
            homepage_changed = True

command_center = ROOT / 'command-center' / 'index.html'
command_changed = False
if command_center.exists():
    text = command_center.read_text(encoding='utf-8', errors='ignore')
    if 'ASTROVIP_COMMAND_V9' not in text and '/command-center/v9-extension.js' not in text:
        lower = text.lower()
        body_pos = lower.rfind('</body>')
        if body_pos >= 0:
            text = text[:body_pos] + COMMAND_BLOCK + text[body_pos:]
            command_center.write_text(text, encoding='utf-8')
            command_changed = True

print(f'Premium V9 injector: scanned={scanned}, changed={changed}, homepage={"updated" if homepage_changed else "unchanged"}, command_center={"updated" if command_changed else "unchanged"}')
