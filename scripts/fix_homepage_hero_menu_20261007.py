from pathlib import Path

p = Path('worker.js')
s = p.read_text(encoding='utf-8')

runtime_old = '''      const runtime=heroPreloads+homepageRibbonCleanup+`<script src="/assets/booking-bridge-20261007.js" defer></script><script src="/assets/page-editor-runtime.js?v=20261006-premium-wow3" defer></script>`;'''
runtime_new = '''      const homepageUiRepair=isHomepage?`<style id="astrovip-homepage-ui-repair-20261007">@media(max-width:980px){html body:not(.guide-page) #hamb .hamb-lines{position:relative!important;display:block!important;width:30px!important;height:19px!important}html body:not(.guide-page) #hamb .hamb-line{position:absolute!important;left:0!important;width:30px!important;height:3px!important;border-radius:3px!important;background:currentColor!important;transition:transform .18s ease,opacity .14s ease,top .18s ease!important;transform-origin:center!important}html body:not(.guide-page) #hamb .hamb-line:nth-child(1){top:0!important}html body:not(.guide-page) #hamb .hamb-line:nth-child(2){top:8px!important}html body:not(.guide-page) #hamb .hamb-line:nth-child(3){top:16px!important}html body:not(.guide-page) #hamb[aria-expanded="true"]{color:#ff241f!important}html body:not(.guide-page) #hamb[aria-expanded="true"] .hamb-line:nth-child(1){top:8px!important;transform:rotate(45deg)!important}html body:not(.guide-page) #hamb[aria-expanded="true"] .hamb-line:nth-child(2){opacity:0!important;transform:scaleX(.25)!important}html body:not(.guide-page) #hamb[aria-expanded="true"] .hamb-line:nth-child(3){top:8px!important;transform:rotate(-45deg)!important}}</style>`:'';
      const runtime=heroPreloads+homepageRibbonCleanup+homepageUiRepair+`<script src="/assets/booking-bridge-20261007.js" defer></script><script src="/assets/page-editor-runtime.js?v=20261006-premium-wow3" defer></script>`;'''
if runtime_old not in s:
    raise SystemExit('runtime anchor not found')
s = s.replace(runtime_old, runtime_new, 1)

chain_old = '''        rewriter=rewriter
          .on('link[rel="preload"][as="image"]',{element(el){const srcset=el.getAttribute('imagesrcset')||'';const href=el.getAttribute('href')||'';if(srcset.includes('astrovip-hero-mobile-clean-cards-')||srcset.includes('astrovip-hero-lux-clean-20260922')||href.includes('astrovip-hero-mobile-clean-cards-')||href.includes('astrovip-hero-lux-clean-20260922'))el.remove();}})'''
chain_new = '''        rewriter=rewriter
          .on('#v63-mobile-prod-css',{element(el){el.remove()}})
          .on('#v63-desktop-prod-css',{element(el){el.remove()}})
          .on('link[rel="preload"][as="image"]',{element(el){const srcset=el.getAttribute('imagesrcset')||'';const href=el.getAttribute('href')||'';if(srcset.includes('astrovip-hero-mobile-clean-cards-')||srcset.includes('astrovip-hero-lux-clean-20260922')||href.includes('astrovip-hero-mobile-clean-cards-')||href.includes('astrovip-hero-lux-clean-20260922'))el.remove();}})'''
if chain_old not in s:
    raise SystemExit('rewriter chain anchor not found')
s = s.replace(chain_old, chain_new, 1)

destructive = '''          .on('section.hero.hero-split.av-hero-v2.av-hero-mobile-restore .av-hero-v2-visual picture',{element(el){el.remove()}})\n'''
if destructive not in s:
    raise SystemExit('Hero picture remover not found')
s = s.replace(destructive, '', 1)

p.write_text(s, encoding='utf-8')
print('worker.js repaired: stale V63 CSS suppressed, normal Hero preserved, hamburger X CSS injected')
