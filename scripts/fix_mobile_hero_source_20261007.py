from pathlib import Path

p = Path('worker.js')
s = p.read_text(encoding='utf-8')
marker = "astrovip-mobile-hero-source-fix-20261007"
if marker in s:
    print('mobile Hero source fix already present')
    raise SystemExit(0)

anchor = "          .on('#v63-desktop-prod-css',{element(el){el.remove()}})\n"
inject = """          .on('#v63-desktop-prod-css',{element(el){el.remove()}})\n          // astrovip-mobile-hero-source-fix-20261007: the old clean-cards AVIF/WebP files are not deployed.\n          .on('section.hero.hero-split.av-hero-v2.av-hero-mobile-restore .av-hero-v2-visual picture source',{element(el){const media=el.getAttribute('media')||'';if(media.includes('max-width')){el.setAttribute('srcset','/assets/astrovip-hero-premium-mobile-20261001.webp?v=20261007-mobilefix1');el.setAttribute('type','image/webp')}}})\n          .on('section.hero.hero-split.av-hero-v2.av-hero-mobile-restore .av-hero-v2-visual picture img',{element(el){el.setAttribute('src','/assets/astrovip-hero-premium-mobile-20261001.webp?v=20261007-mobilefix1')}})\n"""
if anchor not in s:
    raise SystemExit('expected rewriter anchor not found')
s = s.replace(anchor, inject, 1)
p.write_text(s, encoding='utf-8')
print('mobile Hero now uses deployed premium WebP source')
