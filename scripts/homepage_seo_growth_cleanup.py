#!/usr/bin/env python3
from pathlib import Path
import re

HOME = Path("index.html")
if not HOME.exists():
    raise SystemExit("index.html not found")

html = HOME.read_text(encoding="utf-8", errors="ignore")
original = html
changes = []

# 1) Promote the strongest proof asset in primary navigation.
old_nav = '<a href="/studii-de-caz/">Studii de caz</a>'
new_nav = '<a href="/studii-de-caz/">116 Studii de Caz</a>'
if old_nav in html:
    html = html.replace(old_nav, new_nav, 1)
    changes.append("primary-nav-research")

# 2) Keep one responsive horoscope entry instead of separate mobile + desktop copies.
mobile_horoscope = re.compile(
    r'<section\s+class=["\']av-horoscop-mobile-entry["\'][^>]*>[\s\S]*?</section>',
    re.I,
)
html, removed = mobile_horoscope.subn('', html, count=1)
if removed:
    changes.append("remove-mobile-horoscope-duplicate")

# The remaining teaser already contains mobile layout rules; make it visible on mobile.
mobile_hide = '.av-horoscop-teaser{display:none!important}'
mobile_show = '.av-horoscop-teaser{display:block!important}'
if mobile_hide in html:
    html = html.replace(mobile_hide, mobile_show, 1)
    changes.append("responsive-single-horoscope")

# 3) Add a restrained upsell from low/mid-ticket products to the 60-minute consultation.
UPSELL_STYLE = '''
<style id="av-growth-upsell-20261101">
.av-upsell-premium{display:block;margin:10px 0 0;padding:9px 11px;border-top:1px solid rgba(242,215,131,.20);color:#f2d783!important;font-size:12px;font-weight:850;line-height:1.4;text-decoration:none;text-align:center}
.av-upsell-premium:hover,.av-upsell-premium:focus-visible{color:#fff3bd!important;text-decoration:underline;text-underline-offset:3px}
.sv-card>.av-upsell-premium{margin:0 14px 14px;border:1px solid rgba(242,215,131,.24);border-radius:10px;background:rgba(242,215,131,.035)}
</style>
'''.strip()
if 'id="av-growth-upsell-20261101"' not in html:
    pos = html.lower().rfind('</head>')
    if pos >= 0:
        html = html[:pos] + '\n' + UPSELL_STYLE + '\n' + html[pos:]
        changes.append("upsell-style")

PRICE_RE = re.compile(r'(?:>\s*|\b)(149|199|249|299|333)\s*(?:<small>\s*)?lei\b', re.I)
UPSELL = '<a class="av-upsell-premium" data-av-upsell="premium-500" href="#programari">Vrei să aprofundăm analiza live 60 min? Consultație Premium — 500 lei →</a>'

def add_upsell(match):
    card = match.group(0)
    if 'data-av-upsell="premium-500"' in card or not PRICE_RE.search(card):
        return card
    return card[:-10] + UPSELL + '</article>'

for card_class in ('av-offer', 'sv-card'):
    pattern = re.compile(
        rf'<article\b[^>]*class="[^"]*\b{re.escape(card_class)}\b[^"]*"[^>]*>[\s\S]*?</article>',
        re.I,
    )
    html, count = pattern.subn(add_upsell, html)
    if count:
        changes.append(f"scan-{card_class}-{count}")

if html != original:
    HOME.write_text(html, encoding="utf-8")

print("Homepage SEO/growth cleanup:", ", ".join(changes) if changes else "no changes")

# Deployment assertions: fail closed rather than publish a partial hotfix.
final = HOME.read_text(encoding="utf-8", errors="ignore")
if '<a href="/studii-de-caz/">116 Studii de Caz</a>' not in final:
    raise SystemExit("Primary navigation label was not applied")
if 'class="av-horoscop-mobile-entry"' in final:
    raise SystemExit("Duplicate mobile horoscope block still present")
if '.av-horoscop-teaser{display:none!important}' in final:
    raise SystemExit("Remaining horoscope teaser is still hidden on mobile")
if 'data-av-upsell="premium-500"' not in final:
    raise SystemExit("Premium upsell was not added")
