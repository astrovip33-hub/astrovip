from pathlib import Path
import re

html = Path('index.html')
s = html.read_text(encoding='utf-8')
replacement = '''<section id="studiu-de-caz-loto-2020" aria-labelledby="studiu-loto-titlu" class="av-lotto-compact">
<div class="wrap">
<article class="av-lotto-compact-card">
<div class="av-lotto-compact-grid">
<figure class="av-lotto-compact-visual"><a href="/studii-de-caz/castig-loto-roma-2020/" aria-label="Deschide studiul de caz complet despre câștigul la Loto"><img src="/assets/studiu-caz-castig-loto-roma-2020.svg" width="1200" height="675" loading="lazy" decoding="async" alt="Ilustrație premium AstroVip pentru studiul de caz Câștig la Loto, Roma 2020, cu bile aurii de loterie și cerc astrologic."/></a></figure>
<div class="av-lotto-compact-copy"><p class="av-lotto-compact-eyebrow">Studiu de caz 02</p><h2 id="studiu-loto-titlu">Câștig la Loto — Roma 2020</h2><p class="av-lotto-compact-meta"><time datetime="2020-02-14T08:00">14 februarie 2020</time> · Roma, Italia</p><p class="av-lotto-compact-lead">Un eveniment real analizat retrospectiv prin timing-ul astrologic AstroVip.</p><a class="cta" href="/studii-de-caz/castig-loto-roma-2020/">VEZI STUDIUL COMPLET →</a></div>
</div>
</article>
</div>
</section>'''
pattern = r'<section id="studiu-de-caz-loto-2020"[\s\S]*?</section>\s*(?=<section id="relocare">)'
s2, n = re.subn(pattern, replacement + '\n', s, count=1)
if n != 1:
    raise SystemExit(f'Expected one lottery section, replaced {n}')
s2 = s2.replace('/assets/studiu-caz-scoala.css?v=20260917-nb1', '/assets/studiu-caz-scoala.css?v=20260918-loto-compact-1')
s2 = s2.replace('20260918-loto-home-1', '20260918-loto-compact-1')
html.write_text(s2, encoding='utf-8')

css = Path('assets/studiu-caz-scoala.css')
c = css.read_text(encoding='utf-8')
marker = '/* AstroVip compact lottery teaser */'
block = '''/* AstroVip compact lottery teaser */
#studiu-de-caz-loto-2020.av-lotto-compact{
  --lotto-gold:#edc67e;
  padding:28px 0;
  background:radial-gradient(ellipse at 82% 18%,rgba(180,122,40,.10),transparent 52%),#070808;
  scroll-margin-top:96px;
}
#studiu-de-caz-loto-2020 .av-lotto-compact-card{
  max-width:1040px;
  margin:0 auto;
  overflow:hidden;
  border:1px solid rgba(237,198,126,.30);
  border-radius:20px;
  background:linear-gradient(135deg,#17140f,#0b0d0e 68%);
  box-shadow:0 16px 44px rgba(0,0,0,.22);
}
#studiu-de-caz-loto-2020 .av-lotto-compact-grid{
  display:grid;
  grid-template-columns:minmax(0,1.9fr) minmax(250px,.8fr);
  gap:22px;
  align-items:center;
  padding:16px;
}
#studiu-de-caz-loto-2020 .av-lotto-compact-visual{margin:0;min-width:0}
#studiu-de-caz-loto-2020 .av-lotto-compact-visual img{
  display:block;
  width:100%;
  height:auto;
  aspect-ratio:16/9;
  object-fit:cover;
  border-radius:14px;
  border:1px solid rgba(237,198,126,.22);
  background:#090806;
}
#studiu-de-caz-loto-2020 .av-lotto-compact-copy{min-width:0;padding:4px 8px 4px 0}
#studiu-de-caz-loto-2020 .av-lotto-compact-eyebrow{
  margin:0 0 8px;
  color:var(--lotto-gold);
  font-size:.76rem;
  font-weight:850;
  letter-spacing:.11em;
  text-transform:uppercase;
}
#studiu-de-caz-loto-2020 h2{
  margin:0 0 9px;
  color:#fff3d8;
  font-size:clamp(1.45rem,2.2vw,2rem);
  line-height:1.08;
  letter-spacing:-.02em;
}
#studiu-de-caz-loto-2020 .av-lotto-compact-meta{
  margin:0 0 10px;
  color:var(--lotto-gold);
  font-size:.86rem;
  font-weight:700;
  line-height:1.45;
}
#studiu-de-caz-loto-2020 .av-lotto-compact-lead{
  margin:0 0 16px;
  color:#e8e1d6;
  font-size:.96rem;
  line-height:1.55;
}
#studiu-de-caz-loto-2020 .cta{font-size:.83rem;padding:11px 15px}
@media(max-width:820px){
  #studiu-de-caz-loto-2020.av-lotto-compact{padding:22px 0}
  #studiu-de-caz-loto-2020 .av-lotto-compact-card{border-radius:16px}
  #studiu-de-caz-loto-2020 .av-lotto-compact-grid{grid-template-columns:1fr;gap:15px;padding:13px}
  #studiu-de-caz-loto-2020 .av-lotto-compact-copy{padding:0 3px 4px}
  #studiu-de-caz-loto-2020 h2{font-size:1.55rem}
}
'''
if marker in c:
    c = re.sub(r'/\* AstroVip compact lottery teaser \*/[\s\S]*\Z', block, c)
else:
    c = c.rstrip() + '\n\n' + block
css.write_text(c, encoding='utf-8')
