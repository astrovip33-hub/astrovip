from pathlib import Path

index = Path('index.html')
text = index.read_text(encoding='utf-8')
marker = 'trust-logo-fill-v3'
css = '''<style id="trust-logo-fill-v3">
@media(max-width:820px){
  body:not(.guide-page) .trust-icons-only{
    grid-template-columns:repeat(3,minmax(0,1fr))!important;
    align-items:stretch!important;
    gap:6px!important;
  }
  body:not(.guide-page) .trust-icon-only,
  body:not(.guide-page) .trust-commerce-card{
    height:84px!important;
    min-height:84px!important;
    border-radius:8px!important;
    align-self:stretch!important;
  }
  body:not(.guide-page) .trust-icon-only{
    padding:1px!important;
    overflow:hidden!important;
  }
  body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"] img{
    width:100%!important;
    height:68px!important;
    max-width:none!important;
    max-height:none!important;
    object-fit:fill!important;
    object-position:center!important;
    margin:auto!important;
    transform:none!important;
  }
  body:not(.guide-page) .trust-icon-only[aria-label^="Codul Etic"] img{
    width:100%!important;
    height:58px!important;
    max-width:none!important;
    max-height:none!important;
    object-fit:fill!important;
    object-position:center!important;
    margin:auto!important;
    transform:none!important;
  }
  body:not(.guide-page) .trust-commerce-card{
    padding:5px 3px 4px!important;
  }
  body:not(.guide-page) .trust-commerce-card::before{inset:3px!important}
  body:not(.guide-page) .trust-commerce-card::after{top:4px!important;right:6px!important;font-size:8px!important}
  body:not(.guide-page) .trust-commerce-kicker{
    margin-bottom:1px!important;
    font-size:6.2px!important;
    line-height:1!important;
    letter-spacing:.45px!important;
  }
  body:not(.guide-page) .trust-commerce-card strong{
    font-size:13px!important;
    line-height:.96!important;
  }
  body:not(.guide-page) .trust-commerce-points{
    display:grid!important;
    grid-template-columns:1fr!important;
    width:100%!important;
    gap:2px!important;
    margin-top:4px!important;
  }
  body:not(.guide-page) .trust-commerce-points span{
    min-height:15px!important;
    padding:1px 2px!important;
    font-size:8px!important;
    line-height:1!important;
  }
}
</style>'''

if marker not in text:
    if '</head>' not in text:
        raise SystemExit('Missing </head> in index.html')
    text = text.replace('</head>', css + '\n</head>', 1)
    index.write_text(text, encoding='utf-8')

for p in [Path('.github/workflows/fill-trust-logos-once.yml'), Path('scripts/fill_trust_logos.py')]:
    if p.exists():
        p.unlink()
