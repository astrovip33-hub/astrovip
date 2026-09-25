#!/usr/bin/env python3
from pathlib import Path
import json, re

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
        "image": image_url or FALLBACK_IMAGE,
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

files_scanned = 0
files_changed = 0
blocks_changed = 0
author_boxes_added = 0
invalid_blocks = 0

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

    # Visible E-E-A-T signal: add a consistent author box only to article pages
    # that use the editorial guide layout and do not already have one.
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
    f"blocks={blocks_changed}, author_boxes={author_boxes_added}, invalid_skipped={invalid_blocks}"
)
