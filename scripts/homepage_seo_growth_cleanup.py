#!/usr/bin/env python3
from pathlib import Path
import json
import re

HOME = Path("index.html")
if not HOME.exists():
    raise SystemExit("index.html not found")

html = HOME.read_text(encoding="utf-8", errors="ignore")
original = html
changes = []

# 0) Consolidate the homepage entity schema into one canonical @graph.
# Keep FAQ/Service schema separate; only the duplicated core entity nodes are merged here.
CANONICAL_ID = "astrovip-entity-inline"
ORG_ID = "https://astrovip.ro/#organization"
PERSON_ID = "https://astrovip.ro/despre-astrovip/#catalin-smaranda"
WEBSITE_ID = "https://astrovip.ro/#website"
WEBPAGE_ID = "https://astrovip.ro/#webpage"

canonical_re = re.compile(
    rf'<script\b(?=[^>]*\bid=["\']{re.escape(CANONICAL_ID)}["\'])[^>]*>(?P<body>[\s\S]*?)</script>',
    re.I,
)
match = canonical_re.search(html)
if not match:
    raise SystemExit("Canonical AstroVip entity graph not found")

try:
    entity_doc = json.loads(match.group("body"))
except json.JSONDecodeError as exc:
    raise SystemExit(f"Canonical AstroVip entity graph is invalid JSON: {exc}")

graph = entity_doc.get("@graph")
if not isinstance(graph, list):
    raise SystemExit("Canonical AstroVip entity graph has no @graph array")

organization = next((node for node in graph if isinstance(node, dict) and node.get("@id") == ORG_ID), None)
if organization is None:
    raise SystemExit("Canonical AstroVip organization node not found")

# Ground truth on the site / Google Business Profile: 5.0 from 32 reviews.
organization["aggregateRating"] = {
    "@type": "AggregateRating",
    "ratingValue": 5.0,
    "reviewCount": 32,
    "bestRating": 5,
    "worstRating": 1,
}

website = next((node for node in graph if isinstance(node, dict) and node.get("@id") == WEBSITE_ID), None)
if website is None:
    website = {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        "name": "AstroVip",
        "alternateName": ["AstroVip România", "AstroVip.ro"],
        "url": "https://astrovip.ro/",
        "publisher": {"@id": ORG_ID},
        "about": {"@id": ORG_ID},
        "inLanguage": ["ro-RO", "en", "es", "it", "zh-Hans", "ar", "ru"],
    }
    graph.append(website)
website.setdefault(
    "description",
    "Astrologie și numerologie premium: consultații, studii de caz, instrumente și ghiduri AstroVip.",
)

webpage = next((node for node in graph if isinstance(node, dict) and node.get("@id") == WEBPAGE_ID), None)
if webpage is None:
    graph.append({
        "@type": "WebPage",
        "@id": WEBPAGE_ID,
        "url": "https://astrovip.ro/",
        "name": "AstroVip | Astrolog București & Consultații Astrologice Online",
        "description": "AstroVip, site-ul oficial al astrologului Cătălin Smaranda. Consultații de astrologie și numerologie în București și online: hartă natală, relații, carieră, relocare.",
        "isPartOf": {"@id": WEBSITE_ID},
        "about": {"@id": ORG_ID},
        "publisher": {"@id": ORG_ID},
        "inLanguage": "ro-RO",
    })

entity_doc["@context"] = "https://schema.org"
canonical_json = json.dumps(entity_doc, ensure_ascii=False, separators=(",", ":"))
canonical_script = f'<script id="{CANONICAL_ID}" type="application/ld+json">{canonical_json}</script>'
html = html[:match.start()] + canonical_script + html[match.end():]
changes.append("canonical-entity-rating-32")

# Remove the second copy of Person/LocalBusiness/Organization.
duplicate_graph_re = re.compile(
    r'<script\b(?=[^>]*\bid=["\']astrovip-entity-graph["\'])[^>]*>[\s\S]*?</script>\s*',
    re.I,
)
html, removed_graphs = duplicate_graph_re.subn("", html)
if removed_graphs:
    changes.append(f"remove-duplicate-entity-graph-{removed_graphs}")

# Remove standalone WebSite/homepage WebPage blocks now represented in the canonical @graph.
ld_json_re = re.compile(
    r'<script\b(?=[^>]*\btype=["\']application/ld\+json["\'])[^>]*>(?P<body>[\s\S]*?)</script>\s*',
    re.I,
)

def remove_merged_core_nodes(match):
    full = match.group(0)
    if f'id="{CANONICAL_ID}"' in full or f"id='{CANONICAL_ID}'" in full:
        return full
    try:
        doc = json.loads(match.group("body"))
    except json.JSONDecodeError:
        return full
    if not isinstance(doc, dict):
        return full
    node_id = doc.get("@id")
    node_type = doc.get("@type")
    if node_id == WEBSITE_ID and node_type == "WebSite":
        changes.append("merge-standalone-website")
        return ""
    if node_id == WEBPAGE_ID and node_type == "WebPage":
        changes.append("merge-standalone-homepage")
        return ""
    return full

html = ld_json_re.sub(remove_merged_core_nodes, html)

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

# Entity schema assertions.
if final.count(f'id="{CANONICAL_ID}"') != 1:
    raise SystemExit("Canonical AstroVip entity graph count is not exactly one")
if 'astrovip-entity-graph' in final:
    raise SystemExit("Duplicate AstroVip entity graph still present")

final_match = canonical_re.search(final)
if not final_match:
    raise SystemExit("Canonical AstroVip entity graph missing after cleanup")
try:
    final_doc = json.loads(final_match.group("body"))
except json.JSONDecodeError as exc:
    raise SystemExit(f"Final AstroVip entity graph is invalid JSON: {exc}")
final_graph = final_doc.get("@graph", [])

def nodes_with_id(node_id):
    return [node for node in final_graph if isinstance(node, dict) and node.get("@id") == node_id]

for node_id in (ORG_ID, PERSON_ID, WEBSITE_ID, WEBPAGE_ID):
    if len(nodes_with_id(node_id)) != 1:
        raise SystemExit(f"Expected exactly one canonical node for {node_id}")

final_org = nodes_with_id(ORG_ID)[0]
rating = final_org.get("aggregateRating", {})
if rating.get("ratingValue") != 5.0 or rating.get("reviewCount") != 32:
    raise SystemExit("AstroVip aggregateRating is not 5.0 / 32 reviews")
if '"reviewCount":33' in final or '"reviewCount":"33"' in final:
    raise SystemExit("Stale reviewCount=33 remains in homepage schema")
