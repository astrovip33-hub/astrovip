#!/usr/bin/env python3
from pathlib import Path
import json, re

ROOT = Path(".")
FALLBACK_IMAGE = "https://astrovip.ro/assets/1000043152.png"
ARTICLE_TYPES = {"Article","BlogPosting","NewsArticle"}

SCRIPT_RE = re.compile(
    r'(<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>)([\s\S]*?)(</script>)',
    re.I,
)
OG_RE = re.compile(
    r'<meta\b[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']+)["\'][^>]*>|'
    r'<meta\b[^>]*content=["\']([^"\']+)["\'][^>]*property=["\']og:image["\'][^>]*>',
    re.I,
)

def page_image(html: str) -> str:
    m = OG_RE.search(html)
    if not m:
        return FALLBACK_IMAGE
    return (m.group(1) or m.group(2) or FALLBACK_IMAGE).strip()

def ensure_logo(org: dict) -> bool:
    if org.get("@type") != "Organization":
        return False
    changed = False
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

        # Conservative fallback: only infer publication date from an existing
        # editorial modification date; never invent a new date.
        if not node.get("datePublished") and node.get("dateModified"):
            node["datePublished"] = node["dateModified"]
            changed = True

        publisher = node.get("publisher")
        if isinstance(publisher, dict):
            changed = ensure_logo(publisher) or changed

    if node_type == "Organization":
        changed = ensure_logo(node) or changed

    # Recurse so @graph and nested publishers/organizations are covered.
    for value in list(node.values()):
        if isinstance(value, (dict, list)):
            changed = enrich(value, image_url) or changed
    return changed

files_scanned = 0
files_changed = 0
blocks_changed = 0
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

    def repl(match):
        global blocks_changed, invalid_blocks
        raw = match.group(2).strip()
        try:
            data = json.loads(raw)
        except Exception:
            invalid_blocks += 1
            return match.group(0)
        if enrich(data, img):
            blocks_changed += 1
            return match.group(1) + json.dumps(data, ensure_ascii=False, separators=(",",":")) + match.group(3)
        return match.group(0)

    updated = SCRIPT_RE.sub(repl, html)
    if updated != html:
        path.write_text(updated, encoding="utf-8")
        files_changed += 1

print(f"Structured-data enrichment: scanned={files_scanned} files, changed={files_changed}, blocks={blocks_changed}, invalid_skipped={invalid_blocks}")
