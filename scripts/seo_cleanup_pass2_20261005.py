#!/usr/bin/env python3
"""Second validation/cleanup pass for the 2026-10-05 SE Ranking remediation.

Important: Atlas families are explicitly excluded and remain unchanged.
"""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TITLE_LIMIT = 62
DESC_LIMIT = 155
REPORT = ROOT / "SEO_REMEDIATION_PASS2_2026-10-05.txt"


def excluded(path: Path) -> bool:
    rel = path.resolve().relative_to(ROOT.resolve())
    for part in rel.parts:
        p = part.lower()
        if p == "atlas" or p.startswith("atlas-"):
            return True
    return any(p.lower() in {".git", "node_modules", ".wrangler"} for p in rel.parts)


def attr(tag: str, name: str) -> str | None:
    m = re.search(rf"\b{re.escape(name)}\s*=\s*([\"'])(.*?)\1", tag, re.I | re.S)
    return html.unescape(m.group(2)) if m else None


def set_attr(tag: str, name: str, value: str) -> str:
    escaped = html.escape(value, quote=True)
    pat = re.compile(rf"(\b{re.escape(name)}\s*=\s*)([\"'])(.*?)\2", re.I | re.S)
    if pat.search(tag):
        return pat.sub(lambda m: f'{m.group(1)}"{escaped}"', tag, count=1)
    i = tag.rfind("/>")
    if i < 0:
        i = tag.rfind(">")
    return tag[:i] + f' {name}="{escaped}"' + tag[i:] if i >= 0 else tag


def strip_tags(value: str) -> str:
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", value)).split())


def get_title(text: str) -> str:
    m = re.search(r"<title\b[^>]*>(.*?)</title\s*>", text, re.I | re.S)
    return strip_tags(m.group(1)) if m else ""


def get_meta(text: str, name: str) -> str:
    for m in re.finditer(r"<meta\b[^>]*>", text, re.I | re.S):
        tag = m.group(0)
        if (attr(tag, "name") or "").lower() == name.lower():
            return attr(tag, "content") or ""
    return ""


def clip_words(value: str, limit: int, period: bool = False) -> str:
    value = " ".join(html.unescape(value).split())
    if len(value) <= limit:
        return value
    reserve = 1 if period else 0
    max_body = limit - reserve
    clipped = value[:max_body + 1]
    cut = clipped.rfind(" ")
    if cut >= max(45, max_body - 28):
        clipped = clipped[:cut]
    else:
        clipped = clipped[:max_body]
    clipped = clipped.rstrip(" ,;:|–—-.")
    if period and clipped:
        clipped += "."
    return clipped[:limit]


DANGLING = {
    "și", "si", "and", "or", "sau", "de", "din", "în", "in", "la", "cu", "pe",
    "pentru", "despre", "prin", "sau", "of", "for", "with", "to", "the", "a", "an",
    "et", "e", "y", "con", "para", "di", "del", "della", "и", "в", "на",
}


def clean_title(raw: str) -> str:
    raw = " ".join(html.unescape(raw).split())
    raw = re.sub(r"\s*\|\s*\|\s*", " | ", raw)
    raw = re.sub(r"\s*[|–—-]\s*AstroVip\s*$", " | AstroVip", raw, flags=re.I)
    has_brand = bool(re.search(r"\|\s*AstroVip$", raw, re.I))
    base = re.sub(r"\s*\|\s*AstroVip$", "", raw, flags=re.I).strip() if has_brand else raw
    base = re.sub(r"[|–—,:;\-]+\s*$", "", base).strip()
    words = base.split()
    while words and words[-1].lower().strip(".,;:!?()[]{}") in DANGLING:
        words.pop()
    base = " ".join(words).rstrip(" |–—,:;-")
    brand = " | AstroVip" if has_brand else ""
    if len(base + brand) > TITLE_LIMIT:
        base = clip_words(base, TITLE_LIMIT - len(brand), period=False)
        words = base.split()
        while words and words[-1].lower().strip(".,;:!?()[]{}") in DANGLING:
            words.pop()
        base = " ".join(words).rstrip(" |–—,:;-")
    return (base + brand)[:TITLE_LIMIT].strip()


def replace_title(text: str, value: str) -> str:
    return re.sub(
        r"(<title\b[^>]*>)(.*?)(</title\s*>)",
        lambda m: m.group(1) + html.escape(value) + m.group(3),
        text,
        count=1,
        flags=re.I | re.S,
    )


def replace_meta(text: str, name: str, value: str) -> str:
    pat = re.compile(r"<meta\b[^>]*>", re.I | re.S)
    for m in list(pat.finditer(text)):
        tag = m.group(0)
        if (attr(tag, "name") or "").lower() == name.lower():
            new = set_attr(tag, "content", value)
            return text[:m.start()] + new + text[m.end():]
    return text


def sync_twitter(text: str, title: str, desc: str) -> str:
    if not re.search(r"<meta\b[^>]*\bname\s*=\s*[\"']twitter:card[\"']", text, re.I):
        return text
    text = replace_meta(text, "twitter:title", title)
    if desc and get_meta(text, "twitter:description"):
        text = replace_meta(text, "twitter:description", desc)
    return text


def main() -> int:
    changed = 0
    title_fixed = 0
    desc_fixed = 0
    twitter_synced = 0
    remaining: list[str] = []

    pages = sorted(p for p in ROOT.rglob("*.html") if not excluded(p))
    for path in pages:
        text = path.read_text(encoding="utf-8", errors="replace")
        original = text

        title = get_title(text)
        if title:
            cleaned = clean_title(title)
            if cleaned != title:
                text = replace_title(text, cleaned)
                title_fixed += 1
                title = cleaned

        desc = get_meta(text, "description")
        if desc and len(desc) > DESC_LIMIT:
            desc = clip_words(desc, DESC_LIMIT, period=True)
            text = replace_meta(text, "description", desc)
            desc_fixed += 1

        before_twitter = text
        text = sync_twitter(text, title, desc)
        if text != before_twitter:
            twitter_synced += 1

        if text != original:
            path.write_text(text, encoding="utf-8")
            changed += 1

        final_title = get_title(text)
        final_desc = get_meta(text, "description")
        if final_title and len(final_title) > TITLE_LIMIT:
            remaining.append(f"title>{TITLE_LIMIT}: {path.relative_to(ROOT)} ({len(final_title)})")
        if final_desc and len(final_desc) > DESC_LIMIT:
            remaining.append(f"description>{DESC_LIMIT}: {path.relative_to(ROOT)} ({len(final_desc)})")
        if "| | AstroVip" in final_title:
            remaining.append(f"double separator: {path.relative_to(ROOT)}")

    lines = [
        "AstroVip SEO cleanup pass 2 — 2026-10-05",
        "Atlas families excluded and untouched.",
        f"HTML files changed: {changed}",
        f"Titles cleaned: {title_fixed}",
        f"Descriptions reduced: {desc_fixed}",
        f"Twitter metadata synchronized: {twitter_synced}",
        "",
        "VALIDATION",
    ]
    lines += [f"- {x}" for x in remaining] if remaining else ["- PASS: no title/description length or double-separator issues outside Atlas."]
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("\n".join(lines))
    return 1 if remaining else 0


if __name__ == "__main__":
    raise SystemExit(main())
