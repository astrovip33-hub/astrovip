#!/usr/bin/env python3
"""One-time remediation for the SE Ranking audit dated 2026-10-05.

Scope: all public AstroVip HTML outside Atlas families. Atlas pages/content and their
indexing directives are deliberately untouched.
"""

from __future__ import annotations

import concurrent.futures
import html
import os
import re
import shutil
import subprocess
import sys
from collections import defaultdict
from pathlib import Path
from urllib.parse import urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://astrovip.ro/"
REPORT = ROOT / "SEO_REMEDIATION_2026-10-05.txt"
TITLE_LIMIT = 62
DESC_LIMIT = 155
IMAGE_LIMIT = 950_000

PROTECTED_EXTERNAL_HOSTS = {
    "wa.me", "www.wa.me", "api.whatsapp.com", "whatsapp.com", "www.whatsapp.com",
    "facebook.com", "www.facebook.com", "instagram.com", "www.instagram.com",
    "tiktok.com", "www.tiktok.com", "x.com", "www.x.com", "twitter.com", "www.twitter.com",
    "youtube.com", "www.youtube.com", "youtu.be", "google.com", "www.google.com",
    "maps.google.com", "goo.gl", "g.page",
}

GENERATED_JS = {
    "/assets/vendor/astrovip-swiss-koch.js",
}

LANG_ALT = {
    "ro": "AstroVip – astrologie premium",
    "en": "AstroVip – premium astrology",
    "es": "AstroVip – astrología premium",
    "it": "AstroVip – astrologia premium",
    "zh": "AstroVip – 高端占星服务",
    "ar": "AstroVip – علم التنجيم المتميز",
    "ru": "AstroVip – премиальная астрология",
}

LANG_LINK_LABELS = {
    "/": "Română", "/en/": "English", "/es/": "Español", "/it/": "Italiano",
    "/zh/": "中文", "/ar/": "العربية", "/ru/": "Русский",
}

counts = defaultdict(int)
notes: list[str] = []


def is_atlas_path(path: Path) -> bool:
    rel = path.resolve().relative_to(ROOT.resolve())
    for part in rel.parts:
        p = part.lower()
        if p == "atlas" or p.startswith("atlas-"):
            return True
    return False


def is_ignored(path: Path) -> bool:
    parts = {p.lower() for p in path.parts}
    return bool(parts & {".git", "node_modules", ".wrangler"})


def html_paths() -> list[Path]:
    return sorted(
        p for p in ROOT.rglob("*.html")
        if not is_ignored(p) and not is_atlas_path(p)
    )


def strip_tags(value: str) -> str:
    value = re.sub(r"<script\b.*?</script\s*>", " ", value, flags=re.I | re.S)
    value = re.sub(r"<style\b.*?</style\s*>", " ", value, flags=re.I | re.S)
    value = re.sub(r"<[^>]+>", " ", value)
    return " ".join(html.unescape(value).split())


def get_attr(tag: str, name: str) -> str | None:
    m = re.search(rf"\b{re.escape(name)}\s*=\s*([\"'])(.*?)\1", tag, flags=re.I | re.S)
    return html.unescape(m.group(2)) if m else None


def set_attr(tag: str, name: str, value: str) -> str:
    escaped = html.escape(value, quote=True)
    pat = re.compile(rf"(\b{re.escape(name)}\s*=\s*)([\"'])(.*?)\2", flags=re.I | re.S)
    if pat.search(tag):
        return pat.sub(lambda m: f'{m.group(1)}"{escaped}"', tag, count=1)
    pos = tag.rfind("/>")
    if pos >= 0:
        return tag[:pos] + f' {name}="{escaped}"' + tag[pos:]
    pos = tag.rfind(">")
    if pos >= 0:
        return tag[:pos] + f' {name}="{escaped}"' + tag[pos:]
    return tag


def shorten_text(value: str, limit: int, sentence: bool = False) -> str:
    text = " ".join(html.unescape(value).split())
    if len(text) <= limit:
        return text
    if sentence:
        candidates = [m.end() for m in re.finditer(r"[.!?](?:\s|$)", text[: limit + 1])]
        if candidates:
            cut = candidates[-1]
            if cut >= 90:
                return text[:cut].strip()
    clipped = text[: limit + 1]
    cut = clipped.rfind(" ")
    if cut >= max(35, limit - 28):
        clipped = clipped[:cut]
    clipped = clipped.rstrip(" ,;:–—-.")
    return clipped + ("." if sentence else "")


def lang_of(text: str) -> str:
    m = re.search(r"<html\b[^>]*\blang\s*=\s*[\"']([^\"']+)", text, flags=re.I)
    return (m.group(1).lower().split("-")[0] if m else "ro")


def page_title(text: str) -> str:
    m = re.search(r"<title\b[^>]*>(.*?)</title\s*>", text, flags=re.I | re.S)
    return strip_tags(m.group(1)) if m else "AstroVip"


def meta_content(text: str, key: str, attr: str = "name") -> str:
    for m in re.finditer(r"<meta\b[^>]*>", text, flags=re.I | re.S):
        tag = m.group(0)
        if (get_attr(tag, attr) or "").lower() == key.lower():
            return get_attr(tag, "content") or ""
    return ""


def normalize_title(text: str, path: Path) -> str:
    pat = re.compile(r"(<title\b[^>]*>)(.*?)(</title\s*>)", flags=re.I | re.S)
    m = pat.search(text)
    if not m:
        return text
    raw = strip_tags(m.group(2))
    if len(raw) <= TITLE_LIMIT:
        return text
    brand = " | AstroVip" if "AstroVip" in raw else ""
    base = re.sub(r"\s*[|–—-]\s*AstroVip\s*$", "", raw, flags=re.I).strip()
    limit = TITLE_LIMIT - len(brand)
    new = shorten_text(base, limit, sentence=False) + brand
    text = text[:m.start()] + m.group(1) + html.escape(new) + m.group(3) + text[m.end():]
    counts["titles_shortened"] += 1
    notes.append(f"TITLE {path.relative_to(ROOT)} :: {raw} -> {new}")
    return text


def normalize_description(text: str, path: Path) -> str:
    tags = list(re.finditer(r"<meta\b[^>]*>", text, flags=re.I | re.S))
    for m in tags:
        tag = m.group(0)
        if (get_attr(tag, "name") or "").lower() != "description":
            continue
        raw = get_attr(tag, "content") or ""
        if len(html.unescape(raw)) <= DESC_LIMIT:
            return text
        new = shorten_text(raw, DESC_LIMIT, sentence=True)
        new_tag = set_attr(tag, "content", new)
        text = text[:m.start()] + new_tag + text[m.end():]
        counts["descriptions_shortened"] += 1
        notes.append(f"DESCRIPTION {path.relative_to(ROOT)} :: {len(raw)} -> {len(new)} chars")
        return text
    return text


def fix_h1(text: str, path: Path) -> str:
    rel = path.relative_to(ROOT).as_posix()
    if rel != "consultatie-astrologica/index.html":
        return text
    pat = re.compile(r"(<h1\b[^>]*>)(.*?)(</h1\s*>)", flags=re.I | re.S)
    m = pat.search(text)
    if not m:
        return text
    old = strip_tags(m.group(2))
    new = "Consultație astrologică personalizată"
    if old == new:
        return text
    text = text[:m.start()] + m.group(1) + new + m.group(3) + text[m.end():]
    counts["h1_shortened"] += 1
    notes.append(f"H1 {rel} :: {old} -> {new}")
    return text


def add_twitter_card(text: str, path: Path) -> str:
    if re.search(r"<meta\b[^>]*\bname\s*=\s*[\"']twitter:card[\"']", text, flags=re.I):
        return text
    title = page_title(text)
    desc = meta_content(text, "description")
    og_img = meta_content(text, "og:image", attr="property")
    tags = [
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{html.escape(title, quote=True)}">',
    ]
    if desc:
        tags.append(f'<meta name="twitter:description" content="{html.escape(desc, quote=True)}">')
    if og_img:
        tags.append(f'<meta name="twitter:image" content="{html.escape(og_img, quote=True)}">')
    block = "\n" + "\n".join(tags) + "\n"
    pos = text.lower().find("</head>")
    if pos >= 0:
        text = text[:pos] + block + text[pos:]
        counts["twitter_cards_added"] += 1
    return text


def add_missing_alt(text: str, path: Path) -> str:
    lang = lang_of(text)
    default_alt = LANG_ALT.get(lang, LANG_ALT["ro"])
    title = re.sub(r"\s*[|–—-]\s*AstroVip\s*$", "", page_title(text), flags=re.I).strip()

    def repl(m: re.Match[str]) -> str:
        tag = m.group(0)
        if re.search(r"\balt\s*=", tag, flags=re.I):
            return tag
        src = (get_attr(tag, "src") or "").lower()
        if "logo" in src:
            alt = "AstroVip"
        elif any(x in src for x in ("flag", "steag", "language")):
            alt = "Language"
        else:
            alt = default_alt if not title or title.lower() == "astrovip" else f"AstroVip – {title}"
            alt = shorten_text(alt, 110)
        counts["alt_added"] += 1
        notes.append(f"ALT {path.relative_to(ROOT)} :: {src or '(inline image)'}")
        return set_attr(tag, "alt", alt)

    return re.sub(r"<img\b[^>]*>", repl, text, flags=re.I | re.S)


def anchor_label(href: str, lang: str) -> str:
    if href in LANG_LINK_LABELS:
        return LANG_LINK_LABELS[href]
    low = href.lower()
    if low.startswith("mailto:"):
        return "Email"
    if low.startswith("tel:"):
        return "Telefon"
    if "wa.me" in low or "whatsapp" in low:
        return "WhatsApp"
    path = urlsplit(href).path.strip("/")
    if path:
        label = path.split("/")[-1].replace("-", " ").replace("_", " ")
        return " ".join(word.capitalize() for word in label.split())[:80]
    return "Deschide pagina" if lang == "ro" else "Open page"


def fix_empty_anchors(text: str, path: Path) -> str:
    lang = lang_of(text)
    changed = False

    def repl(m: re.Match[str]) -> str:
        nonlocal changed
        open_tag, inner, close_tag = m.group(1), m.group(2), m.group(3)
        href = get_attr(open_tag, "href") or ""
        visible = strip_tags(inner)
        if visible or not href or href.startswith("#"):
            return m.group(0)
        label = anchor_label(href, lang)
        changed = True
        counts["empty_anchor_fixed"] += 1
        new_open = set_attr(set_attr(open_tag, "aria-label", label), "title", label)
        return new_open + inner + f'<span class="seo-sr-only">{html.escape(label)}</span>' + close_tag

    out = re.sub(r"(<a\b[^>]*>)(.*?)(</a\s*>)", repl, text, flags=re.I | re.S)
    if changed and "seo-sr-only" in out and ".seo-sr-only" not in out:
        css = '<style>.seo-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}</style>\n'
        pos = out.lower().find("</head>")
        if pos >= 0:
            out = out[:pos] + css + out[pos:]
    return out


def local_target(page: Path, url: str) -> Path | None:
    split = urlsplit(url)
    if split.scheme or split.netloc:
        if split.netloc.lower() not in {"astrovip.ro", "www.astrovip.ro"}:
            return None
        raw = split.path
        target = ROOT / raw.lstrip("/")
    else:
        raw = split.path
        if not raw or raw.startswith("data:") or raw.startswith("javascript:"):
            return None
        target = ROOT / raw.lstrip("/") if raw.startswith("/") else page.parent / raw
    try:
        return target.resolve()
    except OSError:
        return None


def build_basename_index() -> dict[str, list[Path]]:
    idx: dict[str, list[Path]] = defaultdict(list)
    for p in ROOT.rglob("*"):
        if p.is_file() and not is_ignored(p):
            idx[p.name.lower()].append(p)
    return idx


def fix_missing_local_scripts(text: str, path: Path, basename_index: dict[str, list[Path]]) -> str:
    pat = re.compile(r"<script\b[^>]*\bsrc\s*=\s*([\"'])(.*?)\1[^>]*>\s*</script\s*>", flags=re.I | re.S)

    def repl(m: re.Match[str]) -> str:
        tag = m.group(0)
        src = html.unescape(m.group(2))
        split = urlsplit(src)
        if split.scheme and split.netloc.lower() not in {"astrovip.ro", "www.astrovip.ro"}:
            return tag
        if split.path in GENERATED_JS:
            return tag
        target = local_target(path, src)
        if target is None or target.exists():
            return tag
        if not split.path.lower().endswith((".js", ".mjs")):
            return tag
        candidates = [p for p in basename_index.get(Path(split.path).name.lower(), []) if p.suffix.lower() in {".js", ".mjs"}]
        if len(candidates) == 1:
            replacement = "/" + candidates[0].relative_to(ROOT).as_posix()
            quote = "&quot;" if False else replacement
            new_tag = set_attr(tag, "src", replacement + (("?" + split.query) if split.query else ""))
            counts["missing_js_relinked"] += 1
            notes.append(f"JS RELINK {path.relative_to(ROOT)} :: {src} -> {replacement}")
            return new_tag
        counts["missing_js_removed"] += 1
        notes.append(f"JS REMOVE {path.relative_to(ROOT)} :: {src}")
        return ""

    return pat.sub(repl, text)


def external_urls(texts: dict[Path, str]) -> set[str]:
    urls: set[str] = set()
    for text in texts.values():
        for m in re.finditer(r"<a\b[^>]*\bhref\s*=\s*([\"'])(.*?)\1", text, flags=re.I | re.S):
            href = html.unescape(m.group(2)).strip()
            s = urlsplit(href)
            if s.scheme in {"http", "https"} and s.netloc.lower() not in {"astrovip.ro", "www.astrovip.ro"}:
                urls.add(href)
    return urls


def check_external(url: str) -> tuple[str, int, str]:
    host = urlsplit(url).netloc.lower()
    if host in PROTECTED_EXTERNAL_HOSTS:
        return url, -1, url
    cmd = [
        "curl", "-L", "-sS", "-o", "/dev/null", "--connect-timeout", "5", "--max-time", "12",
        "--retry", "1", "--retry-delay", "1", "-A", "Mozilla/5.0 AstroVipSEO/1.0",
        "-w", "%{http_code}\t%{url_effective}", url,
    ]
    try:
        cp = subprocess.run(cmd, text=True, capture_output=True, timeout=28)
        out = (cp.stdout or "").strip()
        if not out:
            return url, 0, url
        code_s, _, effective = out.partition("\t")
        code = int(code_s) if code_s.isdigit() else 0
        return url, code, effective or url
    except Exception:
        return url, 0, url


def apply_external_fixes(text: str, path: Path, status: dict[str, tuple[int, str]]) -> str:
    pat = re.compile(r"(<a\b[^>]*>)(.*?)(</a\s*>)", flags=re.I | re.S)

    def repl(m: re.Match[str]) -> str:
        open_tag, inner, close_tag = m.group(1), m.group(2), m.group(3)
        href = get_attr(open_tag, "href") or ""
        if href not in status:
            return m.group(0)
        code, effective = status[href]
        if code == -1:
            return m.group(0)
        if 200 <= code < 300:
            if effective != href and len(effective) <= 320 and urlsplit(effective).scheme in {"http", "https"}:
                new_open = set_attr(open_tag, "href", effective)
                counts["external_redirects_updated"] += 1
                notes.append(f"EXT REDIRECT {path.relative_to(ROOT)} :: {href} -> {effective}")
                return new_open + inner + close_tag
            return m.group(0)
        if 400 <= code < 500 and code != 429:
            counts["external_4xx_unwrapped"] += 1
            notes.append(f"EXT {code} UNWRAP {path.relative_to(ROOT)} :: {href}")
            return inner
        if code == 0:
            counts["external_timeouts_skipped"] += 1
        return m.group(0)

    return pat.sub(repl, text)


def ensure_inbound_links(texts: dict[Path, str]) -> None:
    home = ROOT / "index.html"
    if home in texts:
        text = texts[home]
        if 'href="/intrebare-gratuita/?' in text and 'href="/intrebare-gratuita/"' not in text:
            text = re.sub(r'href="/intrebare-gratuita/\?[^\"]*"', 'href="/intrebare-gratuita/"', text, count=1)
            texts[home] = text
            counts["inbound_links_added"] += 1
            notes.append("INTERNAL canonicalized homepage link -> /intrebare-gratuita/")

    hub = ROOT / "horoscop-chinezesc" / "index.html"
    if hub in texts:
        text = texts[hub]
        targets = [
            ("/horoscop-chinezesc/toate-paginile/", "Toate paginile horoscopului chinezesc"),
            ("/horoscop-chinezesc/metoda-theodora-lau/", "Metoda Theodora Lau"),
        ]
        missing = [(u, label) for u, label in targets if f'href="{u}"' not in text and f"href='{u}'" not in text]
        if missing:
            links = " · ".join(f'<a href="{u}">{html.escape(label)}</a>' for u, label in missing)
            nav = f'\n<nav class="seo-context-links" aria-label="Resurse horoscop chinezesc" style="text-align:center;margin:18px auto;padding:10px 16px;font-size:14px">{links}</nav>\n'
            pos = text.lower().rfind("</main>")
            if pos < 0:
                pos = text.lower().rfind("</body>")
            if pos >= 0:
                text = text[:pos] + nav + text[pos:]
                texts[hub] = text
                counts["inbound_links_added"] += len(missing)
                for u, _ in missing:
                    notes.append(f"INTERNAL added hub link -> {u}")


def collect_local_assets(texts: dict[Path, str]) -> tuple[set[Path], set[Path], set[Path]]:
    js: set[Path] = set()
    css: set[Path] = set()
    images: set[Path] = set()
    for page, text in texts.items():
        for tag in re.findall(r"<script\b[^>]*\bsrc\s*=\s*[\"'][^\"']+[\"'][^>]*>", text, flags=re.I | re.S):
            src = get_attr(tag, "src") or ""
            target = local_target(page, src)
            if target and target.exists() and target.is_file() and target.suffix.lower() in {".js", ".mjs"}:
                js.add(target)
        for tag in re.findall(r"<link\b[^>]*>", text, flags=re.I | re.S):
            rel = (get_attr(tag, "rel") or "").lower()
            href = get_attr(tag, "href") or ""
            target = local_target(page, href)
            if "stylesheet" in rel and target and target.exists() and target.is_file() and target.suffix.lower() == ".css":
                css.add(target)
        for tag in re.findall(r"<img\b[^>]*>", text, flags=re.I | re.S):
            src = get_attr(tag, "src") or ""
            target = local_target(page, src)
            if target and target.exists() and target.is_file() and target.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}:
                images.add(target)
    return js, css, images


def minify_assets(js: set[Path], css: set[Path]) -> None:
    for p in sorted(js):
        if is_atlas_path(p) or ".min." in p.name.lower() or p.name == "site-editor-runtime.js":
            continue
        before = p.stat().st_size
        tmp = p.with_name(p.name + ".seo-tmp")
        cp = subprocess.run(["terser", str(p), "-c", "passes=2", "-o", str(tmp)], text=True, capture_output=True)
        if cp.returncode == 0 and tmp.exists() and 0 < tmp.stat().st_size < before:
            os.replace(tmp, p)
            counts["js_minified"] += 1
            notes.append(f"JS MINIFY {p.relative_to(ROOT)} :: {before} -> {p.stat().st_size}")
        else:
            tmp.unlink(missing_ok=True)
            if cp.returncode != 0:
                notes.append(f"JS MINIFY SKIP {p.relative_to(ROOT)} :: {cp.stderr.strip()[:180]}")

    for p in sorted(css):
        if is_atlas_path(p) or ".min." in p.name.lower():
            continue
        before = p.stat().st_size
        tmp = p.with_name(p.name + ".seo-tmp")
        cp = subprocess.run(["cleancss", "-o", str(tmp), str(p)], text=True, capture_output=True)
        if cp.returncode == 0 and tmp.exists() and 0 < tmp.stat().st_size < before:
            os.replace(tmp, p)
            counts["css_minified"] += 1
            notes.append(f"CSS MINIFY {p.relative_to(ROOT)} :: {before} -> {p.stat().st_size}")
        else:
            tmp.unlink(missing_ok=True)
            if cp.returncode != 0:
                notes.append(f"CSS MINIFY SKIP {p.relative_to(ROOT)} :: {cp.stderr.strip()[:180]}")


def optimize_images(images: set[Path], texts: dict[Path, str]) -> None:
    try:
        from PIL import Image
    except Exception as exc:
        notes.append(f"IMAGE optimization unavailable: {exc}")
        return

    replacements: dict[str, str] = {}
    for p in sorted(images):
        if is_atlas_path(p) or p.stat().st_size <= 1_000_000:
            continue
        try:
            with Image.open(p) as im:
                im.load()
                if max(im.size) > 2400:
                    im.thumbnail((2400, 2400), Image.Resampling.LANCZOS)
                if im.mode not in ("RGB", "RGBA"):
                    im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
                target = p.with_name(p.stem + ".optimized.webp")
                q = 84
                while True:
                    im.save(target, "WEBP", quality=q, method=6)
                    if target.stat().st_size <= IMAGE_LIMIT or q <= 60:
                        break
                    q -= 6
                if target.stat().st_size >= p.stat().st_size:
                    target.unlink(missing_ok=True)
                    continue
                src_url = "/" + p.relative_to(ROOT).as_posix()
                dst_url = "/" + target.relative_to(ROOT).as_posix()
                replacements[src_url] = dst_url
                counts["images_optimized"] += 1
                notes.append(f"IMAGE {p.relative_to(ROOT)} -> {target.relative_to(ROOT)} :: {p.stat().st_size} -> {target.stat().st_size}")
        except Exception as exc:
            notes.append(f"IMAGE SKIP {p.relative_to(ROOT)} :: {exc}")

    if not replacements:
        return
    for page, text in list(texts.items()):
        new = text
        for src, dst in replacements.items():
            new = new.replace(f'src="{src}"', f'src="{dst}"').replace(f"src='{src}'", f"src='{dst}'")
            new = new.replace(f'src="https://astrovip.ro{src}"', f'src="https://astrovip.ro{dst}"')
            new = new.replace(f"src='https://astrovip.ro{src}'", f"src='https://astrovip.ro{dst}'")
        texts[page] = new


def validate(texts: dict[Path, str]) -> list[str]:
    issues: list[str] = []
    for path, text in texts.items():
        title = page_title(text)
        desc = meta_content(text, "description")
        if title and len(title) > TITLE_LIMIT:
            issues.append(f"title>{TITLE_LIMIT}: {path.relative_to(ROOT)} ({len(title)})")
        if desc and len(html.unescape(desc)) > DESC_LIMIT:
            issues.append(f"description>{DESC_LIMIT}: {path.relative_to(ROOT)} ({len(desc)})")
        if not re.search(r"<meta\b[^>]*\bname\s*=\s*[\"']twitter:card[\"']", text, flags=re.I):
            issues.append(f"twitter:card missing: {path.relative_to(ROOT)}")
        for m in re.finditer(r"<script\b[^>]*\bsrc\s*=\s*([\"'])(.*?)\1[^>]*>", text, flags=re.I | re.S):
            src = html.unescape(m.group(2))
            s = urlsplit(src)
            if s.path in GENERATED_JS:
                continue
            target = local_target(path, src)
            if target is not None and (not s.scheme or s.netloc.lower() in {"astrovip.ro", "www.astrovip.ro"}) and s.path.lower().endswith((".js", ".mjs")) and not target.exists():
                issues.append(f"missing local JS: {path.relative_to(ROOT)} -> {src}")
    return issues


def main() -> int:
    pages = html_paths()
    basename_index = build_basename_index()
    texts: dict[Path, str] = {}

    for path in pages:
        text = path.read_text(encoding="utf-8", errors="replace")
        text = normalize_title(text, path)
        text = normalize_description(text, path)
        text = fix_h1(text, path)
        text = add_twitter_card(text, path)
        text = add_missing_alt(text, path)
        text = fix_empty_anchors(text, path)
        text = fix_missing_local_scripts(text, path, basename_index)
        texts[path] = text

    ensure_inbound_links(texts)

    urls = sorted(external_urls(texts))
    external_status: dict[str, tuple[int, str]] = {}
    if urls:
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as pool:
            for url, code, effective in pool.map(check_external, urls):
                external_status[url] = (code, effective)
        counts["external_urls_checked"] = len(urls)
        for path, text in list(texts.items()):
            texts[path] = apply_external_fixes(text, path, external_status)

    js, css, images = collect_local_assets(texts)
    minify_assets(js, css)
    optimize_images(images, texts)

    for path, text in texts.items():
        old = path.read_text(encoding="utf-8", errors="replace")
        if text != old:
            path.write_text(text, encoding="utf-8")
            counts["html_files_changed"] += 1

    issues = validate(texts)
    lines = [
        "AstroVip — SE Ranking remediation 2026-10-05",
        "Scope: all public HTML except Atlas families (atlas/, atlas-*, academia-astrologie/atlas-*).",
        "Atlas indexing/content intentionally unchanged.",
        "",
        "COUNTS",
    ]
    for key in sorted(counts):
        lines.append(f"- {key}: {counts[key]}")
    lines += ["", "VALIDATION"]
    if issues:
        lines.extend(f"- {x}" for x in issues)
    else:
        lines.append("- PASS: metadata limits, X Card presence and local JS references validated outside Atlas.")
    lines += ["", "DETAILS"] + [f"- {x}" for x in notes]
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print("\n".join(lines[:80]))
    if issues:
        print(f"Validation issues remaining: {len(issues)}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
