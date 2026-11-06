---
name: javascript-seo
description: Audit AstroVip JavaScript rendering for Google/Bing and AI crawlers. Use when content, links, metadata, schema, navigation or status codes may depend on client-side JavaScript, or when pages are crawled but not indexed after frontend changes.
---

# AstroVip JavaScript SEO

Public search-facing AstroVip pages should expose their essential SEO signals in the initial server/static HTML whenever practical.

## Raw HTML contract

For every public template, verify the initial response contains:
- title
- meta description
- canonical
- meta robots
- H1 and primary body content
- important internal `<a href>` links
- relevant JSON-LD
- meaningful image alt text where appropriate

Do not rely on a browser-only mutation to repair missing or contradictory SEO signals.

## Workflow

### 1. Compare raw and rendered output
For representative URLs, compare:
- `curl` / view-source HTML
- rendered DOM in a real browser
- Google URL Inspection rendered view when available

Record differences for title, canonical, robots, H1/content, links and structured data.

### 2. Verify routing and HTTP behavior
- valid public pages should return the correct 2xx response
- moved URLs should use server/edge redirects
- missing URLs should return a real 404/410 where appropriate
- avoid a visual "not found" screen served with HTTP 200

### 3. Verify crawlable links
Important navigation and internal discovery paths should be real anchors with resolvable `href` values. Do not make essential discovery depend only on `onclick`, hover, scroll or a client-side button.

### 4. Check lazy/user-triggered content
Content behind an accordion is acceptable if it already exists in the HTML. Critical content fetched only after click/scroll is higher risk for crawlers and should not carry the page's only substantive answer.

### 5. Check blocked resources and edge rules
Confirm robots/CDN/WAF rules do not block resources required to render public pages. If bot access is suspected, validate with logs or official crawler verification methods rather than trusting only a user-agent string.

### 6. Choose rendering strategy by template
Prefer static/server/edge-rendered HTML for public SEO pages. Client-side rendering is better reserved for logged-in or non-search-critical UI.

For AstroVip, calculators and dynamic widgets may hydrate on the client, but their landing-page title, explanatory copy, canonical, navigation and structured data should remain crawlable without depending on that hydration.

## AI crawler rule

Treat raw HTML as the safest common denominator for broad AI crawler visibility. Do not assert that every AI crawler behaves identically; test specific crawlers when their behavior materially matters.

## Regression checks before deploy

For each changed public template:
1. fetch raw HTML
2. confirm canonical/title/robots/H1
3. count/inspect key internal links
4. parse JSON-LD
5. verify a non-existent sibling route returns the correct status
6. render in a browser and compare

## Guardrails

- Do not replace functioning AstroVip interactions merely for theoretical SEO purity.
- Do not introduce dynamic rendering solely to show different content to bots.
- Preserve one consistent page meaning for users and crawlers.
- Do not claim client-rendered content is invisible to Google categorically; report evidence for the specific page.

## Output

Return:
`Template/URL -> Raw HTML result -> Rendered result -> Search risk -> Exact fix -> Acceptance test`.

## Source attribution

Adapted for AstroVip from Afeez Adebayo's `javascript-seo` Agent Skill (CC BY 4.0):
https://github.com/afeezadebayo/technical-seo-skills/tree/main/javascript-seo
