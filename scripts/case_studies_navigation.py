#!/usr/bin/env python3
from pathlib import Path

HOME = Path("index.html")
HUB = Path("studii-de-caz/index.html")

CASE_MENU = """<details class="av-menu-more av-case-menu">
<summary>Studii de caz</summary>
<div class="av-menu-more-links">
<a href="/studii-de-caz/">Toate studiile (116)</a>
<a href="/arce-solare/">Arce Solare</a>
<a href="/tranzite-astrologice/">Tranzite astrologice</a>
<a href="/puncte-mijlocii/">Puncte mijlocii</a>
<a href="/studii-de-caz/#evenimente-biografice">Evenimente biografice</a>
<a href="/local-space/studii-de-caz/">Local Space</a>
<a href="/studii-de-caz/castig-loto-roma-2020/">Loterie &amp; timing</a>
<a href="/studii-de-caz/persoane-publice/">Persoane publice</a>
</div>
</details>"""

HUB_NAV = """<nav id="av-case-hub-nav" class="av-case-hub-nav" aria-label="Explorează studiile de caz">
<a href="/arce-solare/">Arce Solare</a>
<a href="/tranzite-astrologice/">Tranzite astrologice</a>
<a href="/puncte-mijlocii/">Puncte mijlocii</a>
<a href="#evenimente-biografice">Evenimente biografice</a>
<a href="/local-space/studii-de-caz/">Local Space</a>
<a href="/studii-de-caz/castig-loto-roma-2020/">Loterie &amp; timing</a>
<a href="/studii-de-caz/persoane-publice/">Persoane publice</a>
<a href="/studii-de-caz/cutremure/">Cutremure</a>
<a href="/studii-de-caz/presedinti/">Președinți</a>
</nav>"""

HUB_STYLE = """<style id="av-case-hub-nav-style">
.av-case-hub-nav{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 10px;padding:14px;border:1px solid rgba(216,245,0,.28);border-radius:18px;background:rgba(6,30,10,.62)}
.av-case-hub-nav a{display:inline-flex;align-items:center;min-height:40px;padding:8px 12px;border:1px solid rgba(216,245,0,.32);border-radius:999px;color:#f4ffd7;text-decoration:none;font-weight:850}
.av-case-hub-nav a:hover,.av-case-hub-nav a:focus-visible{background:#d8f500;color:#102000;outline:none}
@media(max-width:680px){.av-case-hub-nav{gap:6px;padding:10px}.av-case-hub-nav a{flex:1 1 calc(50% - 6px);justify-content:center;text-align:center;font-size:12px;line-height:1.2}}
</style>"""


def patch_home():
    if not HOME.exists():
        raise SystemExit("index.html not found")

    html = HOME.read_text(encoding="utf-8", errors="ignore")
    if 'class="av-menu-more av-case-menu"' not in html:
        candidates = (
            '<a href="/studii-de-caz/">116 Studii de Caz</a>',
            '<a href="/studii-de-caz/">Studii de caz</a>',
        )
        for old in candidates:
            if old in html:
                html = html.replace(old, CASE_MENU, 1)
                break
        else:
            raise SystemExit("Primary Studii de caz navigation item not found")
        HOME.write_text(html, encoding="utf-8")

    final = HOME.read_text(encoding="utf-8", errors="ignore")
    required = (
        'class="av-menu-more av-case-menu"',
        'href="/studii-de-caz/"',
        'href="/arce-solare/"',
        'href="/tranzite-astrologice/"',
        'href="/puncte-mijlocii/"',
        'href="/local-space/studii-de-caz/"',
    )
    missing = [item for item in required if item not in final]
    if missing:
        raise SystemExit("Case-study primary navigation incomplete: " + ", ".join(missing))


def patch_hub():
    if not HUB.exists():
        raise SystemExit("studii-de-caz/index.html not found")

    html = HUB.read_text(encoding="utf-8", errors="ignore")

    if 'id="evenimente-biografice"' not in html:
        marker = '<div class="bar">'
        if marker not in html:
            raise SystemExit("Case-study filter bar not found")
        html = html.replace(marker, '<div id="evenimente-biografice" class="bar">', 1)

    if 'id="av-case-hub-nav"' not in html:
        marker = '<div id="evenimente-biografice" class="bar">'
        if marker not in html:
            raise SystemExit("Case-study biographical anchor not found")
        html = html.replace(marker, HUB_NAV + marker, 1)

    if 'id="av-case-hub-nav-style"' not in html:
        pos = html.lower().rfind("</head>")
        if pos < 0:
            raise SystemExit("Case-study hub </head> not found")
        html = html[:pos] + HUB_STYLE + html[pos:]

    HUB.write_text(html, encoding="utf-8")

    final = HUB.read_text(encoding="utf-8", errors="ignore")
    required = (
        'id="av-case-hub-nav"',
        'id="evenimente-biografice"',
        'href="/arce-solare/"',
        'href="/tranzite-astrologice/"',
        'href="/puncte-mijlocii/"',
        'href="/local-space/studii-de-caz/"',
        'href="/studii-de-caz/persoane-publice/"',
        'href="/studii-de-caz/cutremure/"',
        'href="/studii-de-caz/presedinti/"',
    )
    missing = [item for item in required if item not in final]
    if missing:
        raise SystemExit("Case-study hub navigation incomplete: " + ", ".join(missing))


patch_home()
patch_hub()
print("Case-study navigation: primary submenu + crawlable hub links applied")
