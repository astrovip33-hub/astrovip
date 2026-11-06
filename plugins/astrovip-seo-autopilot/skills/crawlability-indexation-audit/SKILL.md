---
name: crawlability-indexation-audit
description: Diagnose why AstroVip pages are not discovered, crawled, rendered or indexed by Google/Bing. Use for GSC indexing statuses, sitemap/indexation gaps, robots/noindex/canonical issues, slow discovery, URL Inspection, Bing/IndexNow, bot blocking, or any page that is not appearing in search.
---

# AstroVip Crawlability & Indexation Audit

Use this workflow when an AstroVip URL or template is missing from Google/Bing or indexing is delayed.

## Evidence order

1. Live HTTP response and headers.
2. Raw HTML: title, canonical, robots, H1, primary content, internal links, JSON-LD.
3. XML sitemap membership and accurate `lastmod`.
4. Google Search Console Page Indexing / URL Inspection when available.
5. Bing Webmaster Tools / IndexNow status when relevant.
6. CDN/WAF/bot-access evidence if crawling appears blocked.

Label findings as **Observed**, **Confirmed**, or **Inferred**. Do not present an inference as a confirmed cause.

## Five gates

Diagnose the earliest failing gate first:

1. **Discovery** — URL linked internally and/or present in sitemap.
2. **Crawl** — 2xx response, robots permits crawling, host is healthy.
3. **Render** — important content and links are visible without fragile client-only behavior.
4. **Index** — no `noindex`, canonical signals agree, page has unique useful content.
5. **Serve** — page can compete for the query after indexing.

## AstroVip checks

- Canonical must resolve to the intended `https://astrovip.ro/...` URL.
- Internal links should point directly to final 200 URLs, not redirects.
- Sitemap URLs must be indexable and use current, truthful `lastmod` values.
- New priority pages should receive contextual links from already-crawled AstroVip pages.
- Do not use robots.txt to deindex a page; use a crawlable `noindex`, 404/410, or consolidation when appropriate.
- Google Indexing API is not a general-purpose indexing shortcut; use URL Inspection for a small number of important URLs after a real change.
- Use IndexNow only for engines that support it; do not claim it submits URLs to Google.

## Status playbook

### Discovered, currently not indexed
Check internal-link depth, sitemap freshness, URL bloat, server response time, and whether the page has enough crawl demand.

### Crawled, currently not indexed
Compare the page with indexed siblings for uniqueness, usefulness, duplication, canonical consistency, content depth, and internal-link strength.

### Duplicate / Google chose different canonical
Compare declared canonical, internal links, sitemap entries, redirects, and near-duplicate content. Align all signals on one preferred URL.

### Blocked by robots / noindex / 5xx / soft 404
Fix the earliest technical blocker first and verify the live response before requesting reindexation.

## Priority workflow for AstroVip

1. Group problems by template or page family.
2. Inspect 3-5 representative URLs per group.
3. Fix template-level causes before one-off URL fixes.
4. Re-test live responses and rendered content.
5. Request indexing only for high-priority URLs after fixes are live.
6. Track indexed status, impressions and crawl recency after the change.

## Output

Return:

- affected URL/template
- failing gate
- evidence
- root cause
- exact fix
- owner/location in code if known
- validation test
- re-check metric

For AstroVip priority pages, explicitly call out whether the problem is **technical indexability**, **discovery/internal linking**, or **quality/competition**.

## Source attribution

Adapted for AstroVip from Afeez Adebayo's `crawlability-indexation-audit` Agent Skill (CC BY 4.0):
https://github.com/afeezadebayo/technical-seo-skills/tree/main/crawlability-indexation-audit
