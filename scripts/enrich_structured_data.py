#!/usr/bin/env python3
from pathlib import Path
import json, re, os

ROOT = Path(".")
FALLBACK_IMAGE = "https://astrovip.ro/assets/1000043152.png"
ARTICLE_TYPES = {"Article","BlogPosting","NewsArticle"}

AUTHOR_ID = "https://astrovip.ro/despre-astrovip/#catalin-smaranda"
AUTHOR_URL = "https://astrovip.ro/despre-astrovip/"
ORG_ID = "https://astrovip.ro/#organization"
ORG_URL = "https://astrovip.ro/"

SCRIPT_RE = re.compile(
    r'(<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>)([\s\S]*?)(</script>)',
    re.I,
)
OG_RE = re.compile(
    r'<meta\b[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']+)["\'][^>]*>|'
    r'<meta\b[^>]*content=["\']([^"\']+)["\'][^>]*property=["\']og:image["\'][^>]*>',
    re.I,
)

AUTHOR_BOX = """
<div class="guide-author av-author-trust">
  <strong>Autor: Cătălin Smaranda · AstroVip</strong>
  <p>Astrolog cu peste 33 de ani de experiență declarată în astrologie și numerologie și licențiat în Psihologie. Materialele AstroVip folosesc o metodologie explicită și, unde este relevant, studii de caz și surse verificabile.</p>
  <a href="/despre-astrovip/">Despre autor și metodologie →</a> · <a href="/presa/">Profil pentru presă →</a>
</div>
""".strip()

DESKTOP_TRUST_RIBBON_STYLE = """
<style id="astrovip-desktop-hide-hero-trust-ribbon-20261006">
@media (min-width:821px){
  html body:not(.guide-page) main#top .hero.av-hero-v2 .av-premium-trust-ribbon{
    display:none!important;
    visibility:hidden!important;
    height:0!important;
    min-height:0!important;
    margin:0!important;
    padding:0!important;
    border:0!important;
    overflow:hidden!important;
  }
}
</style>
""".strip()

BORDERLESS_MOBILE_PREVIEW_STYLE = """
<style id="astrovip-borderless-mobile-preview-20261010">
@media (max-width:820px){
  html body:not(.guide-page) header,
  html body:not(.guide-page) nav,
  html body:not(.guide-page) section,
  html body:not(.guide-page) article,
  html body:not(.guide-page) aside,
  html body:not(.guide-page) footer,
  html body:not(.guide-page) div[class*="card"],
  html body:not(.guide-page) div[class*="Card"],
  html body:not(.guide-page) a[class*="case"],
  html body:not(.guide-page) a[class*="Case"],
  html body:not(.guide-page) [class*="panel"],
  html body:not(.guide-page) [class*="Panel"],
  html body:not(.guide-page) [class*="frame"],
  html body:not(.guide-page) [class*="Frame"],
  html body:not(.guide-page) [class*="ribbon"],
  html body:not(.guide-page) [class*="Ribbon"]{
    border-color:transparent!important;
    border-top-color:transparent!important;
    border-right-color:transparent!important;
    border-bottom-color:transparent!important;
    border-left-color:transparent!important;
    outline:none!important;
  }
  html body:not(.guide-page) .v63-case,
  html body:not(.guide-page) .v63-interest,
  html body:not(.guide-page) .v63-card,
  html body:not(.guide-page) .freeq-home-card,
  html body:not(.guide-page) .av-premium-trust-ribbon,
  html body:not(.guide-page) .av-hero-image-service-cards,
  html body:not(.guide-page) .interest-card,
  html body:not(.guide-page) .case-card,
  html body:not(.guide-page) .service-card,
  html body:not(.guide-page) .trust-card{
    border:none!important;
    outline:none!important;
    box-shadow:0 12px 30px rgba(0,0,0,.14)!important;
  }
  html body:not(.guide-page) .top,
  html body:not(.guide-page) .planet-strip,
  html body:not(.guide-page) .av-langbar,
  html body:not(.guide-page) section.hero.av-hero-v2 + section.freeq-home{
    border-top:none!important;
    border-bottom:none!important;
  }
  html body:not(.guide-page) .av-lang-switch,
  html body:not(.guide-page) .av-lang-switch>a,
  html body:not(.guide-page) .language-switcher,
  html body:not(.guide-page) .language-picker,
  html body:not(.guide-page) [class*="chat"]{
    outline:none!important;
  }
  html body:not(.guide-page) .language-switcher,
  html body:not(.guide-page) .language-picker,
  html body:not(.guide-page) [class*="language"][role="button"],
  html body:not(.guide-page) [class*="chat"][role="button"]{
    border:none!important;
    box-shadow:none!important;
  }
}
</style>
""".strip()

def page_image(html: str) -> str:
    m = OG_RE.search(html)
    if not m:
        return FALLBACK_IMAGE
    return (m.group(1) or m.group(2) or FALLBACK_IMAGE).strip()

def ensure_logo(org: dict) -> bool:
    if org.get("@type") != "Organization":
        return False
    changed = False
    if not org.get("@id"):
        org["@id"] = ORG_ID
        changed = True
    if not org.get("url"):
        org["url"] = ORG_URL
        changed = True
    logo = org.get("logo")
    if not logo:
        org["logo"] = {"@type":"ImageObject","url":FALLBACK_IMAGE}
        changed = True
    elif isinstance(logo, str):
        org["logo"] = {"@type":"ImageObject","url":logo}
        changed = True
    elif isinstance(logo, dict) and not logo.get("url"):
        logo["url"] = FALLBACK_IMAGE
        logo.setdefault("@type","ImageObject")
        changed = True
    return changed

def ensure_author(person: dict, image_url: str) -> bool:
    if person.get("@type") != "Person" or person.get("name") != "Cătălin Smaranda":
        return False
    changed = False
    defaults = {
        "@id": AUTHOR_ID,
        "url": AUTHOR_URL,
        "jobTitle": "Astrolog",
    }
    for key, value in defaults.items():
        if not person.get(key):
            person[key] = value
            changed = True
    if not person.get("worksFor"):
        person["worksFor"] = {"@type":"Organization","@id":ORG_ID,"name":"AstroVip","url":ORG_URL}
        changed = True
    return changed

def contains_article(node) -> bool:
    if isinstance(node, list):
        return any(contains_article(x) for x in node)
    if not isinstance(node, dict):
        return False
    node_type = node.get("@type")
    types = set(node_type) if isinstance(node_type, list) else {node_type}
    if types & ARTICLE_TYPES:
        return True
    return any(contains_article(v) for v in node.values() if isinstance(v, (dict, list)))

def enrich(node, image_url: str) -> bool:
    changed = False
    if isinstance(node, list):
        for item in node:
            changed = enrich(item, image_url) or changed
        return changed
    if not isinstance(node, dict):
        return False

    node_type = node.get("@type")
    types = set(node_type) if isinstance(node_type, list) else {node_type}

    if types & ARTICLE_TYPES:
        if not node.get("image"):
            node["image"] = image_url
            changed = True

        if not node.get("datePublished") and node.get("dateModified"):
            node["datePublished"] = node["dateModified"]
            changed = True

        author = node.get("author")
        if not author:
            node["author"] = {
                "@type":"Person",
                "@id":AUTHOR_ID,
                "name":"Cătălin Smaranda",
                "url":AUTHOR_URL,
                "jobTitle":"Astrolog"
            }
            changed = True
        elif isinstance(author, dict):
            changed = ensure_author(author, image_url) or changed

        publisher = node.get("publisher")
        if not publisher:
            node["publisher"] = {
                "@type":"Organization",
                "@id":ORG_ID,
                "name":"AstroVip",
                "url":ORG_URL,
                "logo":{"@type":"ImageObject","url":FALLBACK_IMAGE}
            }
            changed = True
        elif isinstance(publisher, dict):
            changed = ensure_logo(publisher) or changed

    if node_type == "Organization":
        changed = ensure_logo(node) or changed

    if node_type == "Person":
        changed = ensure_author(node, image_url) or changed

    for value in list(node.values()):
        if isinstance(value, (dict, list)):
            changed = enrich(value, image_url) or changed
    return changed

def normalize_home_reviews(html: str) -> str:
    replacements = (
        ("25+ RECENZII", "33+ RECENZII"),
        ("CELE 25 DE RECENZII", "CELE 33 DE RECENZII"),
        ("25 DE RECENZII", "33 DE RECENZII"),
        ("25 de recenzii", "33 de recenzii"),
        ('<div class="av-gr-count"><b>25</b><span>recenzii Google</span></div>', '<div class="av-gr-count"><b>33</b><span>recenzii Google</span></div>'),
    )
    for old, new in replacements:
        html = html.replace(old, new)
    return html

def inject_before_head_close(html: str, block: str) -> str:
    marker = "</head>"
    low = html.lower()
    if marker in low:
        pos = low.rfind(marker)
        return html[:pos] + block + "\n" + html[pos:]
    return block + "\n" + html

def force_desktop_hide_trust_ribbon(html: str) -> str:
    html = re.sub(
        r'\s*<style\s+id=["\']astrovip-desktop-hide-hero-trust-ribbon-20261006["\'][\s\S]*?</style>\s*',
        "\n",
        html,
        flags=re.I,
    )
    return inject_before_head_close(html, DESKTOP_TRUST_RIBBON_STYLE)

def inject_borderless_mobile_preview(html: str) -> str:
    html = re.sub(
        r'\s*<style\s+id=["\']astrovip-borderless-mobile-preview-20261010["\'][\s\S]*?</style>\s*',
        "\n",
        html,
        flags=re.I,
    )
    return inject_before_head_close(html, BORDERLESS_MOBILE_PREVIEW_STYLE)

files_scanned = 0
files_changed = 0
blocks_changed = 0
author_boxes_added = 0
invalid_blocks = 0
borderless_preview = os.environ.get("GITHUB_REF_NAME") == "preview/borderless-mobile-20261010-v2"

for path in ROOT.rglob("index.html"):
    if any(part in {".git","node_modules"} for part in path.parts):
        continue
    try:
        html = path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        continue

    files_scanned += 1
    img = page_image(html)
    page_flags = {"article": False}

    def repl(match):
        global blocks_changed, invalid_blocks
        raw = match.group(2).strip()
        try:
            data = json.loads(raw)
        except Exception:
            invalid_blocks += 1
            return match.group(0)

        if contains_article(data):
            page_flags["article"] = True

        if enrich(data, img):
            blocks_changed += 1
            return match.group(1) + json.dumps(data, ensure_ascii=False, separators=(",",":")) + match.group(3)
        return match.group(0)

    updated = SCRIPT_RE.sub(repl, html)

    if path == ROOT / "index.html":
        updated = normalize_home_reviews(updated)
        updated = force_desktop_hide_trust_ribbon(updated)
        if borderless_preview:
            updated = inject_borderless_mobile_preview(updated)

    if (
        page_flags["article"]
        and "guide-content" in updated
        and "guide-author" not in updated
        and "</article>" in updated.lower()
    ):
        pos = updated.lower().find("</article>")
        updated = updated[:pos] + "\n\n" + AUTHOR_BOX + "\n\n" + updated[pos:]
        author_boxes_added += 1

    if updated != html:
        path.write_text(updated, encoding="utf-8")
        files_changed += 1

print(
    f"Structured-data enrichment: scanned={files_scanned} files, changed={files_changed}, "
    f"blocks={blocks_changed}, author_boxes={author_boxes_added}, invalid_skipped={invalid_blocks}, "
    f"borderless_preview={borderless_preview}"
)
