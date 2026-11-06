---
name: astrovip-content-audit
description: Audit published AstroVip pages for SEO/GEO quality, freshness, LLM readability, citation-readiness, factual clarity, internal linking and conversion readiness. Use after publication or when refreshing pages for Google and AI visibility.
metadata:
  source: https://github.com/arturseo-geo/claude-code-skills/tree/main/skills/content-audit
  adapted_for: AstroVip
---

# AstroVip Content Audit

Audit the rendered public page, not only repository source, and judge whether the content is easy for search engines, AI systems and users to understand, extract and trust.

## Full-page workflow

For the target URL check:

1. **Indexability and identity**
   - 2xx final URL;
   - canonical is correct;
   - no accidental `noindex`;
   - one clear primary H1;
   - page is represented correctly in the sitemap when it should be indexed.

2. **Search intent and topical clarity**
   - the primary query is answered explicitly;
   - title/H1/intro describe the same intent;
   - secondary sections support the main topic instead of drifting;
   - important concepts use concrete nouns rather than ambiguous pronouns.

3. **GEO / LLM readability**
   - each important H2 starts with a direct, self-contained answer or definition;
   - short passages can be understood without reading the entire page;
   - claims are attributed when they depend on external facts;
   - FAQs answer real user questions directly;
   - structured data reflects visible page content and does not invent facts.

4. **Freshness**
   - flag dates, statistics, rankings, legal claims, pricing or availability that may have gone stale;
   - verify time-sensitive statements before republishing;
   - do not update `dateModified` or sitemap `lastmod` unless the page was meaningfully changed.

5. **Internal linking**
   - include relevant contextual links to related AstroVip pages;
   - link toward commercially important pages where context is natural;
   - avoid links to redirects, 404s, noindexed or duplicate/canonicalized URLs;
   - use descriptive, varied anchor text.

6. **Conversion quality**
   - CTA matches the page's intent;
   - CTA destination is specific and functional;
   - do not overwhelm informational pages with repeated generic CTAs.

## Section quality gate

For every important H2/H3 section ask:

- Does the opening sentence directly state the section's answer/topic?
- Can the section stand alone when extracted by an AI system?
- Are pronouns and references unambiguous?
- Are factual claims supportable and current?
- Is the section distinct from neighboring sections, without duplication?
- Is there a useful internal link or next step where appropriate?

## AstroVip-specific factual guardrails

- Separate interpretive astrology/numerology content from externally verifiable factual claims.
- Do not fabricate scientific validation, institutional endorsements, client outcomes, reviews, credentials or rankings.
- Do not use structured data to assert reviews, ratings, services, prices or business facts that are not visible and accurate on the page.
- Keep brand/entity information consistent across pages and structured data.

## Output

Return:

- overall PASS / NEEDS WORK;
- critical blockers first;
- section-level findings;
- exact recommended edits;
- links/schema/indexability issues;
- freshness items requiring verification;
- re-check steps after changes go live.

## Guardrails

- Never clear server caches or run infrastructure commands merely to perform a content audit.
- Do not require WordPress-specific rules unless AstroVip actually uses WordPress.
- Do not mark content compliant if a critical indexability, schema or factual-consistency problem remains.
- Prefer evidence from the live rendered page and Search Console over assumptions.
