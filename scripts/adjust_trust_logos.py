from pathlib import Path
import re

path = Path('index.html')
text = path.read_text(encoding='utf-8')

replacement = '''    /* Repere de încredere: panouri mari, curate, ca în referință */
    .trust-refs{padding:26px 0 22px;border-top:1px solid rgba(56,245,138,.14);background:linear-gradient(180deg,rgba(8,10,18,.92),rgba(3,3,6,.98))}
    .trust-minibox{width:min(1180px,100%);max-width:none;margin:0 auto;padding:0;border:0;border-radius:0;background:transparent;box-shadow:none}
    .trust-icons-only{display:grid;grid-template-columns:1fr 1fr;align-items:stretch;gap:12px;width:100%}
    .trust-icon-only{display:flex;align-items:center;justify-content:center;width:100%;height:clamp(150px,18vw,250px);border:1px solid #e6e9ee;border-radius:10px;background:#fff;box-shadow:0 10px 26px rgba(0,0,0,.18);padding:20px 26px;text-decoration:none;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease}
    .trust-icon-only:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(0,0,0,.22)}
    .trust-icon-only img{width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;display:block}
    .trust-icon-only:first-child img{max-width:92%;max-height:92%}
    .trust-icon-only:last-child img{max-width:96%;max-height:82%}
    @media(max-width:700px){.trust-refs{padding:18px 0 16px}.trust-icons-only{gap:8px}.trust-icon-only{height:clamp(108px,25vw,160px);padding:12px 10px;border-radius:7px}.trust-icon-only:first-child img{max-width:96%;max-height:92%}.trust-icon-only:last-child img{max-width:98%;max-height:80%}}
    @media(max-width:420px){.trust-icons-only{gap:6px}.trust-icon-only{height:104px;padding:9px 8px}.trust-icon-only:last-child img{max-height:74%}}
'''

pattern = re.compile(
    r"    /\* Repere de încredere: iconițe în chenar \*/.*?@media\(max-width:560px\)\{\.trust-minibox\{max-width:330px;padding:12px 14px\}\.trust-icons-only\{gap:12px\}\.trust-icon-only\{width:118px;height:88px;padding:10px\}\}\n",
    re.S,
)
new, n = pattern.subn(replacement, text, count=1)
if n != 1:
    raise SystemExit(f'Expected one trust-logo CSS block, replaced {n}')
path.write_text(new, encoding='utf-8')

wf = Path('.github/workflows/style-trust-logos-once.yml')
if wf.exists():
    wf.unlink()

self_path = Path('scripts/adjust_trust_logos.py')
if self_path.exists():
    self_path.unlink()
