#!/usr/bin/env python3
"""Generate and wire right-sized image variants used by AstroVip pages.

The source originals remain canonical. We only add smaller WebP/PNG candidates and
responsive hints so browsers do not download 720/960/1672 px images for small cards.
"""
from pathlib import Path
from PIL import Image
import re

ROOT = Path(__file__).resolve().parents[1]
HOME = ROOT / "index.html"
CASE_JS = ROOT / "assets" / "home-case-studies-premium-20261014.js"


def resize_webp(src: Path, dst: Path, width: int, quality: int = 82) -> None:
    if not src.is_file():
        return
    with Image.open(src) as im:
        im = im.convert("RGB")
        if im.width <= width:
            return
        height = round(im.height * width / im.width)
        im.resize((width, height), Image.Resampling.LANCZOS).save(
            dst, "WEBP", quality=quality, method=6
        )


def resize_png(src: Path, dst: Path, width: int) -> None:
    if not src.is_file():
        return
    with Image.open(src) as im:
        if im.width <= width:
            return
        height = round(im.height * width / im.width)
        im.resize((width, height), Image.Resampling.LANCZOS).save(
            dst, "PNG", optimize=True
        )


def image_width(path: Path) -> int | None:
    if not path.is_file():
        return None
    with Image.open(path) as im:
        return im.width


def patch_case_srcsets(text: str, stem: str, full_width: int | None, homepage: bool) -> tuple[str, int]:
    """Extend an existing 720/full srcset with 360/540 candidates."""
    base = f"/images/studii-de-caz/{stem}"
    pattern = re.compile(
        rf'srcset="[^"]*{re.escape(base)}-720\.webp\s+720w[^"]*"',
        flags=re.I,
    )
    candidates = [f"{base}-360.webp 360w", f"{base}-540.webp 540w", f"{base}-720.webp 720w"]
    if full_width:
        candidates.append(f"{base}.webp {full_width}w")
    replacement = 'srcset="' + ", ".join(candidates) + '"'
    text, count = pattern.subn(replacement, text)
    if homepage and count:
        # The desktop cards render at ~270 CSS px. The old 560px declaration
        # made Chromium choose unnecessarily large candidates.
        text = text.replace(
            'sizes="(max-width: 820px) 90vw, 560px"',
            'sizes="(max-width: 820px) 82vw, 270px"',
        )
    return text, count


created: list[str] = []
patched = 0

# About image: the JS already advertises a 480w candidate; ensure it physically exists.
about_src = ROOT / "assets" / "astrovip-despre-mine-20261020-960.webp"
for width in (480, 720):
    dst = about_src.with_name(f"astrovip-despre-mine-20261020-{width}.webp")
    resize_webp(about_src, dst, width, quality=82)
    if dst.is_file():
        created.append(dst.relative_to(ROOT).as_posix())

# Case-study cards: materialize 360/540 variants and wire them into every existing
# srcset that currently jumps from 720w to the full 1672w image.
case_dir = ROOT / "images" / "studii-de-caz"
case_stems: list[tuple[str, int | None]] = []
for src in sorted(case_dir.glob("*-720.webp")):
    stem = src.name[:-9]  # remove -720.webp
    for width in (360, 540):
        dst = src.with_name(f"{stem}-{width}.webp")
        resize_webp(src, dst, width, quality=80)
        if dst.is_file():
            created.append(dst.relative_to(ROOT).as_posix())
    case_stems.append((stem, image_width(src.with_name(f"{stem}.webp"))))

text_files = [CASE_JS]
text_files.extend(ROOT.glob("studii-de-caz/**/*.html"))
for path in text_files:
    if not path.is_file():
        continue
    text = path.read_text(encoding="utf-8")
    before = text
    for stem, full_width in case_stems:
        text, count = patch_case_srcsets(text, stem, full_width, path == CASE_JS)
        patched += count
    if text != before:
        path.write_text(text, encoding="utf-8")

# Keep small logo candidates available for any compact header/footer consumer.
logo_src = ROOT / "assets" / "astrovip-logo-144-v1.png"
for width in (48, 72):
    dst = logo_src.with_name(f"astrovip-logo-{width}-v1.png")
    resize_png(logo_src, dst, width)
    if dst.is_file():
        created.append(dst.relative_to(ROOT).as_posix())

print(f"Responsive image optimization: generated={len(created)} variants; patched_srcsets={patched}")
