from pathlib import Path

ROOT = Path('.')
SKIP_PARTS = {'node_modules', '.git', 'command-center'}
HEAD_BLOCK = '''\n<!-- ASTROVIP_PREMIUM_V9 -->\n<link rel="manifest" href="/manifest.webmanifest">\n<link rel="stylesheet" href="/assets/astrovip-design-system-v9.css">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'''
SCRIPT_BLOCK = '''\n<script type="module" src="/assets/premium-v9/main.js"></script>\n<!-- /ASTROVIP_PREMIUM_V9 -->\n'''
COMMAND_BLOCK = '''\n<!-- ASTROVIP_COMMAND_V9 -->\n<script src="/command-center/v9-extension.js" defer></script>\n<!-- /ASTROVIP_COMMAND_V9 -->\n'''

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

print(f'Premium V9 injector: scanned={scanned}, changed={changed}, command_center={"updated" if command_changed else "unchanged"}')
