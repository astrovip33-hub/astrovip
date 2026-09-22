from pathlib import Path
import re

ROOT = Path(".")
CSS_HREF = "/assets/site-wide-optimization.css?v=20260922-1"
CSS_LINK = f'<link rel="stylesheet" href="{CSS_HREF}">'

stats = {
    "files": 0,
    "email": 0,
    "ticker": 0,
    "css": 0,
    "body": 0,
    "img_decode": 0,
    "iframe_lazy": 0,
}

def add_body_classes(html: str, classes):
    m = re.search(r"<body\b([^>]*)>", html, flags=re.I)
    if not m:
        return html, False
    attrs = m.group(1)
    cm = re.search(r'class=(["\'])(.*?)\1', attrs, flags=re.I | re.S)
    wanted = list(dict.fromkeys(classes))
    if cm:
        existing = cm.group(2).split()
        merged = existing + [c for c in wanted if c not in existing]
        new_attrs = attrs[:cm.start()] + f'class={cm.group(1)}{" ".join(merged)}{cm.group(1)}' + attrs[cm.end():]
    else:
        new_attrs = attrs + ' class="' + " ".join(wanted) + '"'
    return html[:m.start()] + "<body" + new_attrs + ">" + html[m.end():], True

def add_img_decoding(match):
    tag = match.group(0)
    if re.search(r"\bdecoding\s*=", tag, flags=re.I):
        return tag
    stats["img_decode"] += 1
    return tag[:-1] + ' decoding="async">'

def add_iframe_loading(match):
    tag = match.group(0)
    if re.search(r"\bloading\s*=", tag, flags=re.I):
        return tag
    stats["iframe_lazy"] += 1
    return tag[:-1] + ' loading="lazy">'

for path in ROOT.rglob("*.html"):
    if any(part.startswith(".") for part in path.parts):
        continue
    try:
        html = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue

    original = html
    rel = path.as_posix()

    n = html.count("astrovip33@gmail.com")
    if n:
        html = html.replace("astrovip33@gmail.com", "contact@astrovip.ro")
        stats["email"] += n

    n = html.count("/assets/planetary-ticker-v2.js")
    if n:
        html = html.replace("/assets/planetary-ticker-v2.js", "/assets/planetary-ticker.js?v=20260922-fix1")
        stats["ticker"] += n

    if CSS_HREF not in html and "</head>" in html.lower():
        html = re.sub(r"</head>", CSS_LINK + "</head>", html, count=1, flags=re.I)
        stats["css"] += 1

    classes = ["av-site-optimized"]
    low = html.lower()
    if 'class="guide-page' in low or "class='guide-page" in low:
        classes.append("av-route-guide")
    elif "class=\"kb-" in low or "class='kb-" in low or rel.startswith("academia-astrologie/") or rel.startswith("atlas/"):
        classes.append("av-route-kb")
    elif rel == "local-space/index.html":
        classes.append("av-route-local-space")
    elif rel.startswith("local-space/studii-de-caz/"):
        classes.append("av-route-local-case")
    elif rel.startswith("studii-de-caz/"):
        classes.append("av-route-case-study")
    else:
        classes.append("av-route-standard")

    html, changed_body = add_body_classes(html, classes)
    if changed_body:
        stats["body"] += 1

    html = re.sub(r"<img\b[^>]*>", add_img_decoding, html, flags=re.I)
    html = re.sub(r"<iframe\b[^>]*>", add_iframe_loading, html, flags=re.I)

    if html != original:
        path.write_text(html, encoding="utf-8")
    stats["files"] += 1

print("AstroVip site-wide optimization complete")
for key, value in stats.items():
    print(f"{key}: {value}")
