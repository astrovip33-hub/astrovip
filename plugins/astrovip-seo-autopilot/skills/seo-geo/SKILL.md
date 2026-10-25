---
name: seo-geo
description: Run AstroVip SEO and GEO workflows covering keyword opportunities, SERP analysis, technical SEO, on-page optimization, schema, AI visibility, content gaps, backlinks, GSC evidence and monitoring. Use whenever the goal is to grow organic traffic or visibility in AI answer engines.
---

# AstroVip SEO + GEO

This is the orchestration skill for AstroVip organic growth. Prefer evidence from live search, Google Search Console, Bing Webmaster Tools, the repository, analytics and supported SEO tools over assumptions.

## Goals

- improve rankings for commercially relevant astrology queries
- increase CTR on pages already receiving impressions
- make priority pages easier to discover and index
- strengthen topical authority through content and internal links
- improve extractability/citation-readiness for AI answer engines
- preserve technical quality during every deploy

## Workflow

### 1. Choose the opportunity
Use the strongest available evidence:
- GSC queries/pages with impressions and positions roughly 3-20
- low CTR for high-relevance queries
- competitor/topic gaps from current SERP research
- new strategic pages that need discovery

Classify intent: informational, commercial, transactional, navigational or local.

### 2. Inspect the SERP
For each target query, identify:
- dominant search intent
- result types and SERP features
- recurring subtopics/entities
- how the leading pages structure titles, headings, FAQs and evidence
- gaps AstroVip can answer better or more directly

Do not scrape Google directly when a supported search/SEO data source is available. Respect provider limits and terms.

### 3. Audit the target page
Check:
- unique title and meta description
- one clear H1
- keyword/topic alignment without stuffing
- canonical and robots directives
- crawlable internal links
- valid JSON-LD appropriate to actual content
- useful opening answer and scannable sections
- images/alt text where relevant
- page freshness and truthful dates

### 4. GEO / AI-readability layer
Make important sections easy for answer engines to extract:
- direct declarative opening sentences
- clear entity names instead of ambiguous pronouns
- one main topic per section
- concise definitions and comparisons
- verifiable facts with trustworthy sources when factual claims require them
- structured FAQs only when visible page content genuinely contains those Q&As
- comprehensive Organization/Person/Article/Breadcrumb schema only where accurate

Do not add fake reviews, invented credentials, fabricated statistics or schema that is not represented on the page.

### 5. Internal authority
Invoke or follow the `internal-linking` workflow for striking-distance pages. Route relevant contextual links from strong AstroVip pages, studies and hubs toward target pages.

### 6. Technical/indexation gate
Invoke or follow `crawlability-indexation-audit` whenever a target page is missing from Google/Bing or Search Console shows an exclusion.

### 7. Performance/rendering gate
Use `core-web-vitals` for UX/performance issues and `javascript-seo` when important content or metadata may depend on client-side rendering.

### 8. Ship safely
Before publishing:
- validate canonical, title, H1, robots and schema
- validate sitemap membership when appropriate
- run existing AstroVip SEO/GEO quality gates
- avoid changing unrelated design/components
- verify mobile and desktop for user-visible changes

### 9. Measure
Track the smallest set of metrics tied to the objective:
- impressions
- clicks
- CTR
- average position
- indexation status
- conversions/leads if available
- AI citation/visibility evidence when measurable

## AstroVip prioritization rule

When several opportunities exist, prefer this order:
1. already ranking and close to top 3
2. high-impression / low-CTR pages
3. commercial/local-intent pages
4. newly created strategic pages needing indexation
5. net-new informational content

## Output

Return an action plan with:
- target query/page
- evidence
- exact change
- expected mechanism (CTR, relevance, crawlability, authority, performance or AI extractability)
- risk
- validation test
- metric to watch

Never promise a specific ranking or indexing date.

## Source attribution

Adapted for AstroVip from the open Agent Skill `seo-geo` by arturseo-geo:
https://github.com/arturseo-geo/claude-code-skills/tree/main/skills/seo-geo
