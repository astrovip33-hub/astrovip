from pathlib import Path
import re

ROOT = Path('.')
SKIP_PARTS = {'node_modules', '.git', 'command-center'}
HEAD_BLOCK = '''\n<!-- ASTROVIP_PREMIUM_V9 -->\n<link rel="manifest" href="/manifest.webmanifest">\n<link rel="stylesheet" href="/assets/astrovip-design-system-v9.css">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'''
SCRIPT_BLOCK = '''\n<script type="module" src="/assets/premium-v9/main.js"></script>\n<!-- /ASTROVIP_PREMIUM_V9 -->\n'''
COMMAND_BLOCK = '''\n<!-- ASTROVIP_COMMAND_V9 -->\n<script src="/command-center/v9-extension.js" defer></script>\n<!-- /ASTROVIP_COMMAND_V9 -->\n'''
HOMEPAGE_PRELOADS = '''\n<!-- ASTROVIP_HERO_PRELOAD -->\n<link rel="preload" as="image" href="/assets/astrovip-hero-premium-mobile-20261001.webp?v=20261008-ux1" type="image/webp" media="(max-width:820px)" fetchpriority="high">\n<link rel="preload" as="image" href="/assets/astrovip-hero-desktop-final-20261002.avif?v=20261008-ux1" type="image/avif" media="(min-width:821px)" fetchpriority="high">\n<!-- /ASTROVIP_HERO_PRELOAD -->\n'''
HOMEPAGE_MOBILE_CRITICAL = r'''\n<!-- ASTROVIP_STATIC_MOBILE_CRITICAL -->\n<style id="astrovip-static-mobile-critical">\n#av-mobile-static-home{display:none}\n@media(max-width:820px){\nhtml,body{max-width:100%;overflow-x:hidden}\nbody:not(.guide-page){background:#020302!important}\nbody:not(.guide-page) section.av-pro-hero,body:not(.guide-page) #servicii.av-pro-interests,body:not(.guide-page) #av-ultra-home{display:none!important}\n#av-mobile-static-home{display:block!important;width:100%;max-width:100%;margin:0;padding:0;background:#020302;border:0;overflow:hidden}\n#av-mobile-static-home .avm-hero-copy{width:100%;padding:24px 18px 18px;box-sizing:border-box;text-align:left;background:radial-gradient(circle at 10% 30%,rgba(36,239,118,.05),transparent 25%),#020302}\n#av-mobile-static-home .avm-kicker{display:inline-flex;align-items:center;margin:0 0 12px;padding:6px 10px;border:1px solid rgba(231,198,106,.42);border-radius:999px;color:#f9e6a3;font-size:10px;font-weight:900;letter-spacing:.09em}\n#av-mobile-static-home h1{width:100%;margin:0!important;padding:0!important;font-family:Georgia,'Times New Roman',serif!important;font-size:clamp(34px,9.6vw,43px)!important;line-height:.99!important;letter-spacing:-.035em!important;font-weight:900!important;color:#fff!important;text-shadow:none!important;text-align:left!important}\n#av-mobile-static-home h1 span{background:linear-gradient(180deg,#fff6ca,#edce72 42%,#b5862c 100%);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent}\n#av-mobile-static-home .avm-hero-copy>p{max-width:100%;margin:16px 0 0;color:#ddd8cc;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.53}\n#av-mobile-static-home .avm-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;margin-top:18px}\n#av-mobile-static-home .avm-actions a{display:flex;align-items:center;justify-content:center;min-width:0;min-height:50px;padding:0 9px;border-radius:14px;text-align:center;text-decoration:none;font-size:10.5px;line-height:1.15;font-weight:950;letter-spacing:.01em;box-sizing:border-box}\n#av-mobile-static-home .avm-primary{color:#181108;background:linear-gradient(180deg,#fff0a8 0,#e6c15d 52%,#b8862d 100%);border:1px solid #fff1ae;box-shadow:0 10px 28px rgba(216,174,72,.16)}\n#av-mobile-static-home .avm-secondary{color:#f8e5a3;background:#07100b;border:1px solid rgba(231,198,106,.58)}\n#av-mobile-static-home .avm-photo{position:relative;width:100%;height:auto;margin:0;padding:0;background:#000;line-height:0;overflow:hidden}\n#av-mobile-static-home .avm-photo:before{content:'';position:absolute;z-index:2;inset:0 0 auto;height:55px;background:linear-gradient(#020302,transparent);pointer-events:none}\n#av-mobile-static-home .avm-photo img{display:block;width:100%;height:auto;min-height:0;max-width:none;object-fit:cover;object-position:center center;margin:0;padding:0;border:0;border-radius:0;transform:none}\n#av-mobile-static-home .avm-trust{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));width:100%;background:linear-gradient(180deg,#090b09,#030403);border-top:1px solid rgba(231,198,106,.24);border-bottom:1px solid rgba(231,198,106,.18)}\n#av-mobile-static-home .avm-trust div{padding:12px 4px;text-align:center;border-right:1px solid rgba(255,255,255,.06)}\n#av-mobile-static-home .avm-trust div:last-child{border-right:0}\n#av-mobile-static-home .avm-trust strong{display:block;color:#f0d276;font-size:11px;line-height:1.1}\n#av-mobile-static-home .avm-trust span{display:block;margin-top:3px;color:#b8b8b1;font-size:9px;line-height:1.2}\n#av-mobile-static-home .avm-interests{display:block!important;width:100%;margin:0!important;padding:24px 14px 30px!important;box-sizing:border-box;background:#030403!important;border:0!important}\n#av-mobile-static-home .avm-interests h2{width:100%;margin:0 0 15px!important;padding:0!important;text-align:center!important;font-family:Georgia,'Times New Roman',serif!important;font-size:27px!important;line-height:1.08!important;font-weight:800!important;color:#eee6d5!important;text-shadow:none!important}\n#av-mobile-static-home .avm-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}\n#av-mobile-static-home .avm-card{display:block;min-width:0;min-height:112px;padding:13px;border:1px solid rgba(231,198,106,.40);border-radius:14px;background:linear-gradient(145deg,#0d120e,#050706);box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 12px 28px rgba(0,0,0,.25);text-decoration:none;box-sizing:border-box}\n#av-mobile-static-home .avm-card b{display:block;margin-bottom:7px;color:#f3d77e;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.1}\n#av-mobile-static-home .avm-card p{margin:0;color:#c6c8c3;font-size:11px;line-height:1.4}\nhtml.av-mobile-approved body:not(.guide-page) header.top{height:62px!important;min-height:62px!important;padding:0!important;margin:0!important;background:#050505!important;border-top:1px solid rgba(235,235,235,.82)!important;border-bottom:1px solid rgba(232,199,107,.30)!important;overflow:visible!important}\nhtml.av-mobile-approved body:not(.guide-page) header.top>.nav{position:relative!important;width:100%!important;max-width:100%!important;height:62px!important;min-height:62px!important;margin:0!important;padding:0!important;background:#050505!important;overflow:visible!important}\nhtml.av-mobile-approved body:not(.guide-page) header.top>.nav>.brand,html.av-mobile-approved body:not(.guide-page) header.top>.nav>.av-header-language,html.av-mobile-approved body:not(.guide-page) header.top>.nav>.nav-actions{display:none!important}\nhtml.av-mobile-approved body:not(.guide-page) header.top>.nav>.menu{top:62px!important;left:8px!important;right:8px!important;width:auto!important;max-width:none!important;z-index:120!important}\n#av-mobile-approved-header{position:absolute;z-index:110;inset:0;display:grid;grid-template-columns:108px minmax(0,1fr) 62px 32px;align-items:center;gap:5px;width:100%;height:62px;padding:5px 8px;background:#050505;box-sizing:border-box}\n#av-mobile-approved-header .avm-logo{display:flex;align-items:center;width:108px;height:48px;overflow:visible}\n#av-mobile-approved-header .avm-logo svg{display:block!important;width:108px!important;max-width:108px!important;height:auto!important;max-height:48px!important;overflow:visible!important}\n#av-mobile-approved-header .avm-logo .av-brand-tagline{display:block!important}\n#av-mobile-approved-header .avm-flags{display:flex;align-items:center;justify-content:center;gap:3px;min-width:0;overflow:visible}\n#av-mobile-approved-header .avm-flags a{display:block;flex:0 0 17px;width:17px;height:13px;padding:0!important;margin:0!important;border:1px solid rgba(255,255,255,.17);border-radius:2px;overflow:hidden;background:none!important;box-shadow:none!important}\n#av-mobile-approved-header .avm-flags img{display:block!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;margin:0!important;padding:0!important;border:0!important}\n#av-mobile-approved-header .avm-flags span{display:none!important}\n#av-mobile-approved-header .avm-chat{display:flex;align-items:center;justify-content:center;gap:5px;width:62px;height:36px;padding:0;border:1px solid rgba(37,239,118,.78);border-radius:999px;background:linear-gradient(180deg,#092313,#031009);color:#fff;box-shadow:0 0 12px rgba(37,239,118,.16);font:900 10px/1 Inter,system-ui,sans-serif}\n#av-mobile-approved-header .avm-chat span{width:6px;height:6px;border-radius:50%;background:#38ff8d;box-shadow:0 0 8px #38ff8d}\n#av-mobile-approved-header .avm-chat b{font:inherit;color:#fff}\n#av-mobile-approved-header .avm-hamb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:32px;height:36px;margin:0;padding:0;border:0;background:transparent}\n#av-mobile-approved-header .avm-hamb i{display:block;width:25px;height:3px;border-radius:99px;background:linear-gradient(90deg,#16e875,#d8f500);box-shadow:0 0 7px rgba(37,239,118,.28)}\n}\n@media(max-width:370px){#av-mobile-approved-header{grid-template-columns:96px minmax(0,1fr) 55px 29px;gap:3px;padding-left:6px;padding-right:6px}#av-mobile-approved-header .avm-logo,#av-mobile-approved-header .avm-logo svg{width:96px!important;max-width:96px!important}#av-mobile-approved-header .avm-flags{gap:2px}#av-mobile-approved-header .avm-flags a{flex-basis:15px;width:15px;height:12px}#av-mobile-approved-header .avm-chat{width:55px}}\n</style>\n<!-- /ASTROVIP_STATIC_MOBILE_CRITICAL -->\n'''
HOMEPAGE_STATIC_MOBILE_HERO = r'''\n<!-- ASTROVIP_STATIC_MOBILE_HERO -->\n<section id="av-mobile-static-home" aria-label="AstroVip astrologie premium">\n  <div class="avm-hero-copy">\n    <div class="avm-kicker">ASTROLOGIE PREMIUM · ASTROVIP</div>\n    <h1>CÂND CUNOȘTI <span>MOMENTUL,</span><br>TRĂIEȘTI VIITORUL.</h1>\n    <p>Claritate pentru dragoste, carieră, afaceri și destin — într-o experiență astrologică premium 1:1, construită în jurul momentului potrivit.</p>\n    <div class="avm-actions">\n      <a class="avm-primary" href="#programari">PROGRAMEAZĂ CONSULTAȚIA →</a>\n      <a class="avm-secondary" href="/despre-astrovip/">DESCOPERĂ ASTROVIP</a>\n    </div>\n  </div>\n  <figure class="avm-photo">\n    <img src="/assets/astrovip-hero-premium-mobile-20261001.webp?v=20261008-ux1" width="600" height="496" fetchpriority="high" loading="eager" decoding="async" alt="Cătălin Smaranda — AstroVip, astrologie premium">\n  </figure>\n  <div class="avm-trust" aria-label="Repere AstroVip">\n    <div><strong>33+ ANI</strong><span>experiență</span></div>\n    <div><strong>PREMIUM 1:1</strong><span>analiză personală</span></div>\n    <div><strong>BUCUREȘTI</strong><span>și online</span></div>\n  </div>\n  <section class="avm-interests" aria-labelledby="avm-interests-title">\n    <h2 id="avm-interests-title">CE TE INTERESEAZĂ?</h2>\n    <div class="avm-grid">\n      <a class="avm-card" href="/sinastrie/"><b>Dragoste</b><p>Compatibilitate, relații și momente importante.</p></a>\n      <a class="avm-card" href="/astrologie-cariera-vocatie/"><b>Carieră</b><p>Vocație, direcție profesională și timing.</p></a>\n      <a class="avm-card" href="/astrologie-afaceri/"><b>Afaceri &amp; Bani</b><p>Priorități, decizii și perioade importante.</p></a>\n      <a class="avm-card" href="/harta-natala/"><b>Destin</b><p>Hartă natală, repere și direcții personale.</p></a>\n    </div>\n  </section>\n</section>\n<!-- /ASTROVIP_STATIC_MOBILE_HERO -->\n'''
HOMEPAGE_TOOLS = '''\n<!-- ASTROVIP_PREMIUM_TOOLS_V9 -->\n<section class="av-v9-tools" aria-labelledby="av-v9-tools-title" style="width:min(1180px,92%);margin:18px auto 34px;padding:18px;border:1px solid rgba(216,245,0,.28);border-radius:18px;background:linear-gradient(135deg,rgba(8,32,70,.80),rgba(4,17,38,.92));box-shadow:0 18px 50px rgba(0,0,0,.22)">\n  <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap">\n    <div style="min-width:min(100%,520px);flex:1">\n      <div style="font-size:11px;font-weight:900;letter-spacing:1.25px;color:#d8f500">ASTROVIP INTERACTIVE ENGINE</div>\n      <h2 id="av-v9-tools-title" style="margin:5px 0 6px;color:#fff;font-size:clamp(21px,3vw,31px)">Calculează harta natală cu Swiss Ephemeris</h2>\n      <p style="margin:0;color:#c9d8ef;line-height:1.6">Poziții planetare tropicale, case Koch, roată interactivă și raport pregătit pentru PDF, direct în noua platformă AstroVip.</p>\n    </div>\n    <div style="display:flex;gap:9px;flex-wrap:wrap">\n      <a href="/calculator/" style="display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:11px 18px;border-radius:999px;background:#d8f500;color:#081000;font-weight:950;text-decoration:none">Deschide calculatorul</a>\n      <a href="/booking/" style="display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:11px 18px;border:1px solid rgba(216,245,0,.55);border-radius:999px;color:#efff72;font-weight:900;text-decoration:none">Programare premium</a>\n    </div>\n  </div>\n</section>\n<!-- /ASTROVIP_PREMIUM_TOOLS_V9 -->\n'''

changed = 0
scanned = 0
for path in ROOT.rglob('*.html'):
    if any(part in SKIP_PARTS for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8', errors='ignore')
    scanned += 1
    if 'ASTROVIP_PREMIUM_V9' in text or '/assets/premium-v9/main.js' in text:
        continue
    lower = text.lower()
    if '</head>' not in lower or '</body>' not in lower:
        continue
    head_pos = lower.rfind('</head>')
    text = text[:head_pos] + HEAD_BLOCK + text[head_pos:]
    lower = text.lower()
    body_pos = lower.rfind('</body>')
    text = text[:body_pos] + SCRIPT_BLOCK + text[body_pos:]
    path.write_text(text, encoding='utf-8')
    changed += 1

homepage = ROOT / 'index.html'
homepage_changed = False
if homepage.exists():
    text = homepage.read_text(encoding='utf-8', errors='ignore')

    legacy_preload_patterns = (
        r'<link rel="preload" as="image" imagesrcset="/assets/astrovip-hero-mobile-clean-cards-[^>]+>',
        r'<link rel="preload" as="image" imagesrcset="/assets/astrovip-hero-lux-clean-[^>]+>',
    )
    for pattern in legacy_preload_patterns:
        cleaned = re.sub(pattern, '', text)
        if cleaned != text:
            text = cleaned
            homepage_changed = True

    if 'ASTROVIP_HERO_PRELOAD' not in text:
        lower = text.lower()
        head_pos = lower.rfind('</head>')
        if head_pos >= 0:
            text = text[:head_pos] + HOMEPAGE_PRELOADS + text[head_pos:]
            homepage_changed = True

    if 'ASTROVIP_STATIC_MOBILE_CRITICAL' not in text:
        lower = text.lower()
        head_pos = lower.rfind('</head>')
        if head_pos >= 0:
            text = text[:head_pos] + HOMEPAGE_MOBILE_CRITICAL + text[head_pos:]
            homepage_changed = True

    if 'ASTROVIP_STATIC_MOBILE_HERO' not in text:
        hero_pos = text.find('<section class="av-pro-hero"')
        if hero_pos >= 0:
            text = text[:hero_pos] + HOMEPAGE_STATIC_MOBILE_HERO + text[hero_pos:]
            homepage_changed = True

    if 'ASTROVIP_PREMIUM_TOOLS_V9' not in text and 'href="/calculator/"' not in text:
        lower = text.lower()
        main_pos = lower.rfind('</main>')
        insert_pos = main_pos if main_pos >= 0 else lower.rfind('</body>')
        if insert_pos >= 0:
            text = text[:insert_pos] + HOMEPAGE_TOOLS + text[insert_pos:]
            homepage_changed = True

    if homepage_changed:
        homepage.write_text(text, encoding='utf-8')

runtime_path = ROOT / 'assets' / 'home-ultra-production-20261010-v4.js'
runtime_changed = False
if runtime_path.exists():
    runtime = runtime_path.read_text(encoding='utf-8', errors='ignore')
    needle = "    const oldHero=document.querySelector('section.av-pro-hero');\n    if(!oldHero)return;\n\n    const section=document.createElement('section');"
    replacement = "    const oldHero=document.querySelector('section.av-pro-hero');\n    if(!oldHero)return;\n    if(document.getElementById('av-mobile-static-home'))return;\n\n    const section=document.createElement('section');"
    if needle in runtime and "document.getElementById('av-mobile-static-home')" not in runtime:
        runtime_path.write_text(runtime.replace(needle, replacement, 1), encoding='utf-8')
        runtime_changed = True

command_center = ROOT / 'command-center' / 'index.html'
command_changed = False
if command_center.exists():
    text = command_center.read_text(encoding='utf-8', errors='ignore')
    if 'ASTROVIP_COMMAND_V9' not in text and '/command-center/v9-extension.js' not in text:
        lower = text.lower()
        body_pos = lower.rfind('</body>')
        if body_pos >= 0:
            text = text[:body_pos] + COMMAND_BLOCK + text[body_pos:]
            command_center.write_text(text, encoding='utf-8')
            command_changed = True

print(f'Premium V9 injector: scanned={scanned}, changed={changed}, homepage={"updated" if homepage_changed else "unchanged"}, runtime={"updated" if runtime_changed else "unchanged"}, command_center={"updated" if command_changed else "unchanged"}')