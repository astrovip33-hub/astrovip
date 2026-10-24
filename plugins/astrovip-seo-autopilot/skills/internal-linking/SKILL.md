---
name: internal-linking
description: Audit and improve AstroVip internal linking, click depth, anchor text, hub-and-spoke clusters, orphan pages, navigation, breadcrumbs, related-content links and routing of link equity toward priority SEO and conversion pages.
---

# AstroVip Internal Linking

Use this skill when important AstroVip pages rank below target, new pages are discovered slowly, studies/articles are poorly connected, or the site needs a stronger topical architecture.

## Core principles

1. Priority pages should be reachable in a few clicks from strong site sections.
2. Contextual in-content links matter more than dumping keyword links into the footer.
3. Link directly to final, indexable URLs.
4. Anchor text should describe the destination naturally and vary by context.
5. Related pages should form clear topic clusters with a hub and relevant spokes.
6. Do not restructure URLs merely for neatness if current URLs are healthy.

## AstroVip priority model

Favor links toward pages with one or more of these signals:

- high impressions but position roughly 4-20
- low CTR with strong query relevance
- commercial/service intent
- recent strategic pages that need discovery
- cornerstone topics such as natal chart, daily horoscope, numerology, astrology services and relevant case studies

Use current GSC data when available. Do not invent rankings or traffic.

## Workflow

### 1. Build the link graph
For every crawlable URL collect, when possible:
- inbound internal links
- outbound internal links
- anchor text
- click depth
- HTTP status
- canonical/indexability
- sitemap membership

### 2. Find orphans and weak pages
Compare sitemap URLs against crawled URLs. Flag pages with no meaningful contextual inlinks or excessive depth.

### 3. Find wasted links
Flag links to:
- redirects
- 4xx/5xx URLs
- `noindex` pages
- canonicalized-away URLs
- parameter or duplicate URLs that should not receive equity

### 4. Find striking-distance opportunities
Use GSC pages/queries with strong impressions and average positions around 4-20. Prioritize contextual links from topically close, already-indexed pages.

### 5. Design clusters
For each major AstroVip theme, define:
- one hub page
- supporting pages
- links from spokes back to hub
- selective sibling links where genuinely relevant
- related study/case-study links where they strengthen expertise or conversion

### 6. Produce an exact link plan
For every proposed change specify:
- source URL
- target URL
- suggested anchor
- placement
- reason
- priority

### 7. Validate
After implementation, re-crawl and confirm:
- no priority orphan pages
- no internal links to redirects/broken URLs
- improved click depth
- target pages receive more relevant contextual inlinks

## Guardrails

- Avoid sitewide exact-match keyword stuffing.
- Do not add irrelevant links solely for SEO.
- Keep navigation compact and useful.
- Prefer body links, breadcrumbs and topic-based related modules over giant footer lists.
- Do not change healthy URLs without a migration plan.

## Output

Return a table or actionable patch plan with `Source -> Target -> Anchor -> Placement -> Why -> Priority` and highlight the 5 highest-impact changes first.

## Source attribution

Adapted for AstroVip from Afeez Adebayo's `internal-linking` Agent Skill (CC BY 4.0):
https://github.com/afeezadebayo/technical-seo-skills/tree/main/internal-linking
