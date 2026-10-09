from pathlib import Path

ROOT = Path('.')
SKIP_PARTS = {'node_modules', '.git', 'command-center'}
HEAD_BLOCK = '''\n<!-- ASTROVIP_PREMIUM_V9 -->\n<link rel="manifest" href="/manifest.webmanifest">\n<link rel="stylesheet" href="/assets/astrovip-design-system-v9.css">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'''
SCRIPT_BLOCK = '''\n<script type="module" src="/assets/premium-v9/main.js"></script>\n<!-- /ASTROVIP_PREMIUM_V9 -->\n'''

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

print(f'Premium V9 injector: scanned={scanned}, changed={changed}')
