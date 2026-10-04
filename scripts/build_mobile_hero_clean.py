from pathlib import Path
from PIL import Image
import pillow_avif  # registers AVIF support in Pillow
import random

ROOT = Path(__file__).resolve().parents[1]
src = ROOT / "assets" / "astrovip-hero-signature-mobile-clean-20261001.webp"

# Original mobile Hero is 941×1220. The baked-in labels occupy the dark band
# between the two gold rules, roughly x=48..665 and y=282..321.
with Image.open(src) as im:
    im = im.convert("RGB")
    w, h = im.size
    sx = w / 941.0
    sy = h / 1220.0

    x0, x1 = int(44*sx), int(670*sx)
    y0, y1 = int(280*sy), int(321*sy)

    px = im.load()
    # Reconstruct the band by interpolating the surrounding background pixels
    # per column, then add tiny deterministic luminance variation so the fill
    # remains organic rather than looking like a flat rectangle.
    random.seed(1978)
    top_y = max(0, y0 - 3)
    bot_y = min(h - 1, y1 + 3)
    for x in range(x0, x1):
        top = px[x, top_y]
        bot = px[x, bot_y]
        span = max(1, y1 - y0)
        jitter = random.uniform(-1.8, 1.8)
        for y in range(y0, y1 + 1):
            t = (y - y0) / span
            rgb = []
            for a, b in zip(top, bot):
                v = a*(1-t) + b*t + jitter
                rgb.append(max(0, min(255, int(v))))
            px[x, y] = tuple(rgb)

    # Gentle horizontal blend at the left/right edges of the repaired area.
    blend = max(4, int(8*sx))
    for y in range(y0, y1 + 1):
        for i in range(blend):
            a = (i + 1) / (blend + 1)
            xl = x0 + i
            xr = x1 - i
            if xl < w:
                orig = im.getpixel((max(0, x0-blend+i), y))
                cur = im.getpixel((xl, y))
                im.putpixel((xl, y), tuple(int(orig[c]*(1-a)+cur[c]*a) for c in range(3)))
            if xr >= 0:
                orig = im.getpixel((min(w-1, x1+blend-i), y))
                cur = im.getpixel((xr, y))
                im.putpixel((xr, y), tuple(int(orig[c]*(1-a)+cur[c]*a) for c in range(3)))

    widths = [941, 736, 640, 480]
    for width in widths:
        if width == w:
            out = im
        else:
            height = round(h * width / w)
            out = im.resize((width, height), Image.Resampling.LANCZOS)

        # AVIF is the primary mobile LCP format. It cuts transfer size on
        # throttled mobile networks while preserving the portrait/text detail.
        out.save(
            ROOT / "assets" / f"astrovip-hero-mobile-no-banners-{width}.avif",
            "AVIF",
            quality=62,
            speed=6,
        )

        # WebP remains as a broad fallback for browsers without AVIF support.
        out.save(
            ROOT / "assets" / f"astrovip-hero-mobile-no-banners-{width}.webp",
            "WEBP",
            quality=82,
            method=6,
        )

print("Prepared no-banners mobile Hero AVIF + WebP variants.")
