# AstroVip SEO audit — 28 September 2026

## Scope and source

The attached `seo-internal-graph-20260928.csv.gz` (compressed CSV) lists every internal HTML anchor from a non-Atlas `index.html` source to one of the 378 curated URLs in the five submitted sitemaps. Each row is an edge; `target_inbound_sources` counts distinct source pages, not repeated links. The legacy Atlas remains outside this editorial crawl scope by policy. This is a source-code graph, not a fresh Ahrefs crawl or a Google index coverage report.

## Internal links

| Measure | Before | This branch |
| --- | ---: | ---: |
| Curated sitemap URLs | 378 | 378 |
| URLs with no incoming HTML link | 0 | 0 |
| URLs with exactly one incoming source | 95 | 0 |
| Pages selected for an additional contextual incoming link | — | 108 |

The 108 selected targets comprise all 95 pages with one incoming source and 13 pages with two, ordered by the source graph. Links point to existing pages within nearby numerology series, case-study themes, astrology topics, or related editorial hubs. The figure 108 is a **local source-code selection**, not an assertion that its URL list matches the 108 pages in the older Ahrefs report. Ahrefs' Site Audit API returned `Insufficient plan`; therefore its three alleged orphans could not be identified from that crawl. The current curated source graph contains zero orphans. Compare the latest Ahrefs crawl after deployment before closing those three historical findings.

## Titles and descriptions

Selected overly broad titles were shortened while keeping the page subject and AstroVip brand; short descriptions of numerology guides were expanded to describe the guide context. Existing GSC title experiments (`casa-8-astrologie`, `tranzite-astrologice` and other logged pages) were left alone. Title length is an editorial check, not a guaranteed search result pixel width or ranking factor. The new audit script verifies the presence of title, description, self-canonical, and no `noindex` for all curated sitemap targets.

## Canonical, sitemap, robots and indexability

The homepage uses `<link href="https://astrovip.ro/" rel="canonical">` (attribute order is valid). All 378 sitemap targets have a matching self-canonical and no `noindex` in their source HTML. `robots.txt` allows crawling and references `https://astrovip.ro/sitemap-index.xml`; that index names five XML sitemaps. Live responses before this branch: `http://astrovip.ro/`, `http://www.astrovip.ro/` and `https://www.astrovip.ro/` each returned a 301 redirect to `https://astrovip.ro/`; robots and the index sitemap returned HTTP 200. The deployment check should repeat those requests on the released version.

## Release checks

Run `python3 scripts/audit_seo_graph.py` and `python3 scripts/quality_gate_new_pages.py`, then inspect the Cloudflare preview on a narrow phone and desktop viewport. No new pages, Hero assets, layout styles or templates are part of this batch. Merge only after preview and checks pass; confirm the production Cloudflare workflow and spot-check redirects and page metadata.
