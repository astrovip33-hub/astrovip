"""Read-only SEO checks plus a deterministic fallback build when the file is absent."""
import base64, json, re, hashlib
from pathlib import Path
from collections import defaultdict
from html.parser import HTMLParser
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET
from PIL import Image

ROOT = Path(".")
OUT = ROOT / "validation-output"
OUT.mkdir(exist_ok=True)
hero = ROOT / "assets/astrovip-hero-desktop-final-20261002.avif"
fallback = hero.with_suffix(".webp")
assert Image.open(hero).size == (1280, 720)
if not fallback.exists():
    Image.open(hero).save(fallback, "WEBP", quality=90, method=6)
    encoded = base64.b64encode(fallback.read_bytes()).decode()
    for i in range(0, len(encoded), 2000):
        print("HERO_BASE64:" + encoded[i:i+2000])
assert Image.open(fallback).size == (1280, 720)

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonical=[]; self.alternates={}; self.robots=""; self.description=""
        self.h1=0; self.title=""; self.in_title=False
    def handle_starttag(self, tag, pairs):
        a=dict(pairs)
        if tag=="link":
            if a.get("rel")=="canonical": self.canonical.append(a.get("href"))
            if a.get("hreflang"): self.alternates[a["hreflang"]]=a.get("href")
        if tag=="meta":
            if a.get("name")=="robots": self.robots=a.get("content","")
            if a.get("name")=="description": self.description=a.get("content","")
        if tag=="h1": self.h1+=1
        if tag=="title": self.in_title=True
    def handle_endtag(self, tag):
        if tag=="title": self.in_title=False
    def handle_data(self, data):
        if self.in_title: self.title+=data

locations=defaultdict(list)
for path in ROOT.glob("sitemap*.xml"):
    root=ET.parse(path).getroot()
    if root.tag.endswith("sitemapindex"): continue
    for item in root:
        loc=item.find("{*}loc")
        if loc is not None and loc.text: locations[loc.text.strip()].append(str(path))
assert not {u:p for u,p in locations.items() if len(p)>1}, "Duplicate sitemap page URLs"
errors=[]; pages={}; blocks=0; atlas_count=0
for path in ROOT.rglob("*.html"):
    if any(p in {".git","node_modules","validation-output"} for p in path.parts): continue
    html=path.read_text(encoding="utf-8")
    page=Page(); page.feed(html)
    rel=path.as_posix()
    url="https://astrovip.ro/"+re.sub(r"index\.html$","",rel)
    pages[url]=page
    if rel.startswith("atlas/"): atlas_count+=1
    if url in locations:
        if page.canonical != [url]: errors.append(f"Canonical: {rel}")
        if "noindex" in page.robots.lower(): errors.append(f"Noindex in sitemap: {rel}")
        if page.h1!=1: errors.append(f"H1 count: {rel}")
        if not page.title.strip() or not page.description: errors.append(f"Metadata: {rel}")
    for raw in re.findall(r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>([\s\S]*?)</script>',html,re.I):
        try: json.loads(raw); blocks+=1
        except Exception as exc: errors.append(f"JSON-LD {rel}: {exc}")
    if "astrovip33@gmail.com" in html: errors.append(f"Legacy public email: {rel}")
for url in locations:
    if url not in pages: errors.append(f"Missing sitemap file: {url}")
for url, page in pages.items():
    for lang, target in page.alternates.items():
        if target not in pages or pages[target].alternates != page.alternates:
            errors.append(f"Nonreciprocal hreflang: {url} -> {target}")
html=Path("index.html").read_text()
assert 'imagesrcset="/assets/astrovip-hero-lux-clean' not in html
assert 'href="/assets/astrovip-hero-desktop-final-20261002.avif?v=20261002-finalhero1"' in html
faq_section=re.search(r'<section id="intrebari-frecvente">([\s\S]*?)</section>',html)[1]
visible=re.findall(r"<h3>(.*?)</h3><p>(.*?)</p>",faq_section)
schemas=[json.loads(s) for s in re.findall(r'<script\b[^>]*type="application/ld\+json"[^>]*>([\s\S]*?)</script>',html)]
faq=next(s for s in schemas if s.get("@type")=="FAQPage")
assert [(q["name"],q["acceptedAnswer"]["text"]) for q in faq["mainEntity"]] == visible
assert "no-store, max-age=0" not in Path("_headers").read_text()
assert hashlib.sha256(hero.read_bytes()).digest()==hashlib.sha256((Path("../baseline")/hero).read_bytes()).digest()
# Detect truly unused legacy hero assets across all runtime source, including Atlas.
unused=[]
sources=[p for p in ROOT.rglob("*") if p.is_file() and p.suffix in {".html",".css",".js",".json",".jsonc"} and not any(x in {".git","node_modules","validation-output"} for x in p.parts)]
texts=[p.read_text(encoding="utf-8",errors="replace") for p in sources]
for asset in Path("assets").glob("*hero*"):
    if asset.suffix in {".webp",".png",".jpg",".mp4",".svg"} and not any(asset.name in t for t in texts):
        unused.append(str(asset))
report={"sitemap_urls":len(locations),"html_pages":len(pages),"atlas_pages":atlas_count,"json_ld_blocks":blocks,"errors":errors,"unused_hero_candidates":unused,"fallback_bytes":fallback.stat().st_size}
(OUT/"seo.json").write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False))
assert not errors, "\n".join(errors)
