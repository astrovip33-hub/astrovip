from pathlib import Path
from PIL import Image
import pillow_avif  # registers AVIF support in Pillow
import random
import re

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
            ROOT / "assets" / f"astrovip-hero-mobile-clean-cards-{width}.avif",
            "AVIF",
            quality=62,
            speed=6,
        )

        # WebP remains as a broad fallback for browsers without AVIF support.
        out.save(
            ROOT / "assets" / f"astrovip-hero-mobile-clean-cards-{width}.webp",
            "WEBP",
            quality=82,
            method=6,
        )

V6_STYLE = r'''<style id="astrovip-mobile-v6-20261006">
@media(max-width:820px){
html body:not(.guide-page){background:#020303!important}
html body:not(.guide-page) .top{background:linear-gradient(180deg,rgba(5,7,7,.985),rgba(1,3,3,.97))!important;border-bottom:1px solid rgba(214,176,73,.30)!important;box-shadow:0 10px 28px rgba(0,0,0,.42)!important;backdrop-filter:blur(18px)!important}
html body:not(.guide-page) .nav{min-height:68px!important}
html body:not(.guide-page) .top .brand,html body:not(.guide-page) .top .brand.av-brand-premium{filter:saturate(.84) brightness(1.03)!important;text-shadow:0 0 18px rgba(214,176,73,.14)!important}
html body:not(.guide-page) .hamb{border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;color:#e5c467!important}
html body:not(.guide-page) section.hero.hero-split.av-hero-v2{position:relative!important;display:flex!important;flex-direction:column!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:0 0 22px!important;overflow:hidden!important;background:radial-gradient(circle at 50% 13%,rgba(22,77,59,.16),transparent 34%),radial-gradient(circle at 84% 34%,rgba(194,150,53,.08),transparent 25%),linear-gradient(180deg,#010303 0,#030706 58%,#020303 100%)!important;border:0!important;box-shadow:none!important;isolation:isolate!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-visual{position:relative!important;display:block!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;background:#010303!important;border-bottom:1px solid rgba(214,176,73,.24)!important;box-shadow:0 20px 48px rgba(0,0,0,.48)!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-visual picture{position:relative!important;display:block!important;width:100%!important;height:auto!important;margin:0!important;padding:0!important;inset:auto!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-visual img{display:block!important;width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:auto!important;object-fit:cover!important;object-position:center center!important;filter:saturate(.76) contrast(1.08) brightness(.82) sepia(.05)!important;transform:none!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-visual::before{content:""!important;display:block!important;position:absolute!important;inset:0!important;z-index:4!important;pointer-events:none!important;background:radial-gradient(circle at 50% 34%,transparent 0 24%,rgba(4,13,11,.10) 52%,rgba(0,0,0,.38) 100%),linear-gradient(180deg,rgba(0,0,0,.05) 0,transparent 46%,rgba(0,0,0,.28) 66%,rgba(1,3,3,.90) 100%)!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-visual::after{content:""!important;display:block!important;position:absolute!important;z-index:5!important;inset:0!important;pointer-events:none!important;border-bottom:1px solid rgba(243,211,118,.44)!important;box-shadow:inset 0 -36px 70px rgba(0,0,0,.26),inset 0 0 42px rgba(31,111,83,.05)!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-image-service-cards,
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-lux-labels,
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-cards,
html body:not(.guide-page) .hero.av-hero-v2 .av-premium-trust-ribbon,
html body:not(.guide-page) .hero.av-hero-v2 #av-hero-planets,
html body:not(.guide-page) .hero.av-hero-v2 .av-lower-planets,
html body:not(.guide-page) .hero.av-hero-v2 .av-ticker-card--axes,
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-bottom{display:none!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-sidecopy{display:block!important;position:absolute!important;z-index:8!important;left:7%!important;right:7%!important;bottom:7.2%!important;width:auto!important;margin:0!important;color:#f5e9c8!important;font-family:Georgia,"Times New Roman",serif!important;font-size:clamp(27px,7.9vw,48px)!important;line-height:.95!important;font-weight:700!important;letter-spacing:-.02em!important;text-align:center!important;text-transform:uppercase!important;text-shadow:0 3px 18px rgba(0,0,0,.92),0 0 12px rgba(214,176,73,.12)!important;white-space:normal!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-sidecopy::first-line{color:#dfba58!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-sidecopy.right{display:none!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-copy{position:relative!important;z-index:9!important;display:block!important;width:calc(100% - 28px)!important;max-width:620px!important;margin:-1px auto 0!important;padding:22px 18px 18px!important;text-align:center!important;border:1px solid rgba(214,176,73,.34)!important;border-top:0!important;border-radius:0 0 24px 24px!important;background:radial-gradient(circle at 50% 0,rgba(21,77,58,.12),transparent 46%),linear-gradient(180deg,rgba(5,8,7,.99),rgba(2,4,4,.995))!important;box-shadow:inset 0 1px 0 rgba(255,246,209,.055),0 20px 48px rgba(0,0,0,.38),0 0 24px rgba(29,109,79,.045)!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-title{display:block!important;margin:0!important;padding:0!important;color:#d7b356!important;background:none!important;-webkit-text-fill-color:initial!important;font-family:Inter,system-ui,sans-serif!important;font-size:11px!important;line-height:1.1!important;font-weight:900!important;letter-spacing:.27em!important;text-transform:uppercase!important;text-shadow:none!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-title span{display:inline!important;width:auto!important;margin:0!important;padding:0!important;font-size:inherit!important;line-height:inherit!important;letter-spacing:inherit!important;color:inherit!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-title .av-hero-v2-line-main::after{content:" "!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-subtitle{display:block!important;margin:11px 0 0!important;color:transparent!important;font-size:0!important;line-height:1!important;letter-spacing:0!important;text-shadow:none!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-subtitle::before{content:"Arta de a citi momentul."!important;display:block!important;color:#ead183!important;font-family:Georgia,"Times New Roman",serif!important;font-size:clamp(24px,6.2vw,34px)!important;line-height:1.04!important;font-style:italic!important;font-weight:500!important;letter-spacing:-.015em!important;text-shadow:0 2px 12px rgba(0,0,0,.7)!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v6-lead{display:block!important;max-width:540px!important;margin:11px auto 0!important;color:#d8d5cb!important;font-size:clamp(13px,3.45vw,16px)!important;line-height:1.5!important;font-weight:560!important;letter-spacing:.005em!important;text-wrap:balance!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-actions{display:grid!important;grid-template-columns:1fr!important;gap:10px!important;width:100%!important;max-width:440px!important;margin:18px auto 0!important;padding:0!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-actions>a{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-height:52px!important;margin:0!important;padding:12px 18px!important;border-radius:14px!important;font-size:12.5px!important;line-height:1!important;font-weight:950!important;letter-spacing:.085em!important;text-decoration:none!important;text-transform:uppercase!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-actions .av-hero-v2-secondary{color:#171106!important;border:1px solid rgba(255,231,151,.92)!important;background:linear-gradient(180deg,#f9e6ab 0,#e4bd62 45%,#ba8428 100%)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.82),inset 0 -1px 0 rgba(81,51,6,.28),0 9px 28px rgba(185,132,38,.24)!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-actions .av-hero-v6-discover{color:#f4e9c9!important;border:1px solid rgba(45,156,115,.72)!important;background:linear-gradient(180deg,rgba(7,28,22,.98),rgba(2,12,9,.99))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.055),0 0 0 1px rgba(214,176,73,.08),0 10px 28px rgba(0,0,0,.28),0 0 17px rgba(30,129,92,.10)!important}
html body:not(.guide-page) .av-hero-freeq-separator{display:block!important;width:100%!important;height:22px!important;min-height:22px!important;margin:0!important;border:0!important;background:linear-gradient(90deg,transparent,rgba(214,176,73,.35) 22%,rgba(239,213,132,.72) 50%,rgba(214,176,73,.35) 78%,transparent) top/100% 1px no-repeat,linear-gradient(180deg,#020303,#050706)!important}
html body:not(.guide-page) .av-hero-freeq-separator+section.freeq-home.av-freeq-after-hero{position:relative!important;margin:0!important;padding:20px 14px 34px!important;background:radial-gradient(circle at 50% 0,rgba(25,91,68,.08),transparent 34%),linear-gradient(180deg,#050706,#070807)!important;border:0!important}
html body:not(.guide-page) .av-hero-freeq-separator+section.freeq-home.av-freeq-after-hero .freeq-home-card{border:1px solid rgba(214,176,73,.34)!important;border-radius:22px!important;background:linear-gradient(145deg,rgba(10,15,13,.98),rgba(3,6,5,.995))!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.045),0 18px 42px rgba(0,0,0,.34)!important}
html body:not(.guide-page) .av-hero-freeq-separator+section.freeq-home.av-freeq-after-hero .kicker{color:#cfae59!important}
}
@media(max-width:430px){
html body:not(.guide-page) section.hero.hero-split.av-hero-v2{padding-bottom:18px!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-visual img{min-height:0!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-sidecopy{left:6%!important;right:6%!important;bottom:6.4%!important;font-size:clamp(27px,8vw,35px)!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-copy{width:calc(100% - 18px)!important;padding:19px 14px 16px!important;border-radius:0 0 20px 20px!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-subtitle::before{font-size:clamp(23px,6.6vw,29px)!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v6-lead{font-size:13px!important;line-height:1.46!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-actions>a{min-height:50px!important;font-size:11.8px!important}
}
@media(max-width:360px){
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-sidecopy{font-size:26px!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v2-copy{width:calc(100% - 14px)!important;padding-left:11px!important;padding-right:11px!important}
html body:not(.guide-page) .hero.av-hero-v2 .av-hero-v6-lead{font-size:12.4px!important}
}
</style>'''

home = ROOT / "index.html"
html = home.read_text(encoding="utf-8", errors="ignore")

# Keep the V6 build idempotent across deploys.
html = re.sub(
    r'\s*<style\s+id=["\']astrovip-mobile-v6-20261006["\'][\s\S]*?</style>\s*',
    "\n",
    html,
    flags=re.I,
)

# Add one concise mobile lead and one real secondary CTA. Existing desktop markup
# and destinations stay untouched; presentation is scoped entirely by mobile CSS.
if 'class="av-hero-v6-lead"' not in html:
    html = re.sub(
        r'(<p class="av-hero-v2-subtitle">[\s\S]*?</p>)',
        r'\1\n    <p class="av-hero-v6-lead">Hărți, timing și interpretări pentru decizii importante — cu claritate, profunzime și rafinament.</p>',
        html,
        count=1,
        flags=re.I,
    )

if 'class="av-hero-v6-discover"' not in html:
    html = re.sub(
        r'(<div class="av-hero-v2-actions">[\s\S]*?</a>)(\s*</div>)',
        r'\1\n      <a class="av-hero-v6-discover" href="#servicii">DESCOPERĂ ASTROVIP</a>\2',
        html,
        count=1,
        flags=re.I,
    )

head_close = html.lower().rfind("</head>")
if head_close < 0:
    raise SystemExit("Cannot inject mobile V6: missing </head> in index.html")
html = html[:head_close] + V6_STYLE + "\n" + html[head_close:]
home.write_text(html, encoding="utf-8")

print("Prepared clean mobile Hero AVIF + WebP variants and injected AstroVip mobile V6 styling.")
