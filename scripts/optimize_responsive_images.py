#!/usr/bin/env python3
"""Generate right-sized homepage image variants and inject responsive srcsets.

This runs during preview/production builds. Generated assets stay build artifacts; the
source originals remain canonical and the visual design is unchanged.
"""
from pathlib import Path
from PIL import Image
import re

ROOT = Path(__file__).resolve().parents[1]
HOME = ROOT / "index.html"


def resize_webp(src: Path, dst: Path, width: int, quality: int = 82) -> None:
    if not src.is_file():
        return
    with Image.open(src) as im:
        im = im.convert("RGB")
        if im.width <= width:
            return
        height = round(im.height * width / im.width)
        out = im.resize((width, height), Image.Resampling.LANCZOS)
        out.save(dst, "WEBP", quality=quality, method=6)


def resize_png(src: Path, dst: Path, width: int) -> None:
    if not src.is_file():
        return
    with Image.open(src) as im:
        if im.width <= width:
            return
        height = round(im.height * width / im.width)
        out = im.resize((width, height), Image.Resampling.LANCZOS)
        out.save(dst, "PNG", optimize=True)


def add_srcset(html: str, src: str, candidates: list[tuple[str, int]], sizes: str) -> tuple[str, int]:
    # Match only the exact src in img tags, preserving all existing attributes.
    src_re = re.escape(src.lstrip("/"))
    pattern = re.compile(
        rf'<img\b(?=[^>]*\bsrc=["\']/?{src_re}["\'])[^>]*>',
        flags=re.I,
    )
    count = 0

    def repl(match: re.Match) -> str:
        nonlocal count
        tag = match.group(0)
        if re.search(r'\bsrcset\s*=', tag, re.I):
            return tag
        srcset = ", ".join(f"/{path.lstrip('/')} {width}w" for path, width in candidates)
        attrs = f' srcset="{srcset}" sizes="{sizes}"'
        count += 1
        return tag[:-1] + attrs + ">"

    return pattern.sub(repl, html), count


html = HOME.read_text(encoding="utf-8")
created = []
injected = 0

# About image: ~336 CSS px on mobile, so 480w avoids shipping the 960w source.
about_src = ROOT / "assets" / "astrovip-despre-mine-20261020-960.webp"
about_variants = []
for width in (480, 720):
    dst = about_src.with_name(f"astrovip-despre-mine-20261020-{width}.webp")
    resize_webp(about_src, dst, width, quality=82)
    if dst.is_file():
        created.append(dst.relative_to(ROOT).as_posix())
        about_variants.append((dst.relative_to(ROOT).as_posix(), width))
if about_src.is_file():
    about_variants.append((about_src.relative_to(ROOT).as_posix(), 960))
if about_variants:
    html, n = add_srcset(
        html,
        about_src.relative_to(ROOT).as_posix(),
        about_variants,
        "(max-width: 820px) calc(100vw - 28px), 480px",
    )
    injected += n

# Case-study cards: 720w is excessive for the rendered cards on desktop/mobile.
case_dir = ROOT / "images" / "studii-de-caz"
for src in sorted(case_dir.glob("*-720.webp")):
    stem = src.name[:-9]  # remove -720.webp
    variants = []
    for width in (360, 540):
        dst = src.with_name(f"{stem}-{width}.webp")
        resize_webp(src, dst, width, quality=80)
        if dst.is_file():
            created.append(dst.relative_to(ROOT).as_posix())
            variants.append((dst.relative_to(ROOT).as_posix(), width))
    variants.append((src.relative_to(ROOT).as_posix(), 720))
    html, n = add_srcset(
        html,
        src.relative_to(ROOT).as_posix(),
        variants,
        "(max-width: 820px) 82vw, 270px",
    )
    injected += n

# Footer/header logo: right-size the 144px bitmap while keeping 2x density available.
logo_src = ROOT / "assets" / "astrovip-logo-144-v1.png"
logo_variants = []
for width in (48, 72):
    dst = logo_src.with_name(f"astrovip-logo-{width}-v1.png")
    resize_png(logo_src, dst, width)
    if dst.is_file():
        created.append(dst.relative_to(ROOT).as_posix())
        logo_variants.append((dst.relative_to(ROOT).as_posix(), width))
if logo_src.is_file():
    logo_variants.append((logo_src.relative_to(ROOT).as_posix(), 144))
if logo_variants:
    html, n = add_srcset(
        html,
        logo_src.relative_to(ROOT).as_posix(),
        logo_variants,
        "(max-width: 820px) 46px, 72px",
    )
    injected += n

HOME.write_text(html, encoding="utf-8")
print(f"Responsive image optimization: generated={len(created)} variants; injected_srcsets={injected}")
