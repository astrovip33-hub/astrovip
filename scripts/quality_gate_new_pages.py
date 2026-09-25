#!/usr/bin/env python3
from pathlib import Path
import html
import re
import subprocess
import sys

MAX_NEW_INDEXABLE_PAGES = 25
MIN_VISIBLE_WORDS = 250
BASE_URL = "https://astrovip.ro/"

def git_added_index_pages():
    try:
        out = subprocess.check_output(
            ["git", "diff", "--name-status", "HEAD^", "HEAD"],
            text=True,
            stderr=subprocess.DEVNULL,
        )
    except Exception:
        print("Quality gate: parent commit unavailable; no changed-page gate applied.")
        return []

    paths = []
    for line in out.splitlines():
        parts = line.split("\t")
        if len(parts) >= 2 and parts[0] == "A" and parts[1].endswith("index.html"):
            paths.append(Path(parts[1]))
    return paths

def extract(pattern, text, flags=re.I | re.S):
    m = re.search(pattern, text, flags)
    return html.unescape(m.group(1).strip()) if m else ""

def visible_word_count(source):
    cleaned = re.sub(r"<script\b[^>]*>[\s\S]*?</script>", " ", source, flags=re.I)
    cleaned = re.sub(r"<style\b[^>]*>[\s\S]*?</style>", " ", cleaned, flags=re.I)
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)
    cleaned = html.unescape(cleaned)
    words = re.findall(r"[A-Za-zĂÂÎȘȚăâîșț0-9][A-Za-zĂÂÎȘȚăâîșț0-9'’-]*", cleaned)
    return len(words)

def expected_url(path):
    rel = path.as_posix()
    if rel == "index.html":
        return BASE_URL
    return BASE_URL + rel[:-10]

new_pages = git_added_index_pages()
indexable = []
errors = []

# Internal link graph. A new indexable page must be linked from at least one
# other HTML page in the same repository/release, not only from a sitemap.
inbound = {}
for source_path in Path(".").rglob("index.html"):
    if any(part in {".git","node_modules"} for part in source_path.parts):
        continue
    try:
        source_html = source_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        continue
    source_url = expected_url(source_path)
    for href in re.findall(r'href=["\']([^"\']+)["\']', source_html, flags=re.I):
        href = html.unescape(href.strip())
        if not href or href.startswith(("#","mailto:","tel:","javascript:")):
            continue
        if href.startswith("https://astrovip.ro/"):
            target = href.split("#",1)[0].split("?",1)[0]
        elif href.startswith("/"):
            target = BASE_URL.rstrip("/") + href.split("#",1)[0].split("?",1)[0]
        else:
            continue
        if target != BASE_URL and not target.endswith("/"):
            continue
        if target != source_url:
            inbound.setdefault(target, set()).add(source_url)

for path in new_pages:
    rel = path.as_posix()
    if rel.startswith("atlas/"):
        # Legacy Atlas remains accessible but excluded from mass indexing.
        continue
    if not path.exists():
        continue

    source = path.read_text(encoding="utf-8", errors="ignore")
    robots = extract(r'<meta\b[^>]*name=["\']robots["\'][^>]*content=["\']([^"\']*)["\']', source)
    if "noindex" in robots.lower():
        continue

    indexable.append(path)

    words = visible_word_count(source)
    if words < MIN_VISIBLE_WORDS:
        errors.append(f"{rel}: only {words} visible words; minimum for a new indexable page is {MIN_VISIBLE_WORDS}")

    title = extract(r"<title[^>]*>(.*?)</title>", source)
    if not title or not (25 <= len(title) <= 70):
        errors.append(f"{rel}: title length must be 25-70 chars (found {len(title) if title else 0})")

    desc = extract(r'<meta\b[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\']', source)
    if not desc or not (100 <= len(desc) <= 180):
        errors.append(f"{rel}: meta description length must be 100-180 chars (found {len(desc) if desc else 0})")

    canonical = extract(r'<link\b[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', source)
    if not canonical:
        canonical = extract(r'<link\b[^>]*href=["\']([^"\']+)["\'][^>]*rel=["\']canonical["\']', source)
    expected = expected_url(path)
    if canonical != expected:
        errors.append(f"{rel}: canonical must be self-referencing ({expected}), found {canonical or 'missing'}")

    h1_count = len(re.findall(r"<h1\b", source, flags=re.I))
    if h1_count != 1:
        errors.append(f"{rel}: expected exactly one H1, found {h1_count}")

    incoming = inbound.get(expected, set())
    if not incoming:
        errors.append(
            f"{rel}: orphan page — no internal HTML link points to {expected}. "
            "Add at least one contextual or navigation link in the same release."
        )

    low = source.lower()
    placeholders = ("lorem ipsum", "post 1 headline", "post-1-headline", "example headline")
    if any(token in low for token in placeholders):
        errors.append(f"{rel}: placeholder/test content detected")

if len(indexable) > MAX_NEW_INDEXABLE_PAGES:
    errors.append(
        f"Mass-publishing blocked: {len(indexable)} new indexable pages in one commit; "
        f"limit is {MAX_NEW_INDEXABLE_PAGES}. Publish smaller, reviewed batches."
    )

print(
    f"Quality gate: added_html={len(new_pages)}, "
    f"new_indexable={len(indexable)}, max_batch={MAX_NEW_INDEXABLE_PAGES}"
)

if errors:
    print("\nSEO QUALITY GATE FAILED:")
    for err in errors:
        print(f" - {err}")
    sys.exit(42)

print("SEO quality gate OK: no low-value mass publication detected.")
