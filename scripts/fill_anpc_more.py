from pathlib import Path

index = Path('index.html')
text = index.read_text(encoding='utf-8')
marker = 'trust-logo-fill-v4'
css = '''<style id="trust-logo-fill-v4">
body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"]{
  padding:2px!important;
  overflow:hidden!important;
}
body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"] img{
  width:98%!important;
  height:82%!important;
  max-width:none!important;
  max-height:none!important;
  object-fit:fill!important;
  object-position:center!important;
  margin:auto!important;
  transform:none!important;
}
@media(max-width:820px){
  body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"]{padding:1px!important}
  body:not(.guide-page) .trust-icon-only[aria-label^="ANPC"] img{
    width:100%!important;
    height:72px!important;
  }
}
</style>'''
if marker not in text:
    if '</head>' not in text:
        raise SystemExit('Missing </head> in index.html')
    text = text.replace('</head>', css + '\n</head>', 1)
    index.write_text(text, encoding='utf-8')

for p in [Path('.github/workflows/fill-anpc-more-once.yml'), Path('scripts/fill_anpc_more.py')]:
    if p.exists():
        p.unlink()
