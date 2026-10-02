# AstroVip optimization — validation branch
Base: 0287137484087bb27062a4c1624023da58b3306b

Production is unchanged. This branch is excluded from the automatic preview deployment.

## Changes
- Desktop preload matches the approved 23,922-byte AVIF. Mobile sources and preload unchanged. Desktop WebP fallback is derived from the approved AVIF at 1280×720.
- Head CSS is collected in original cascade order into two dated assets, retaining the shared header stylesheet between them. No selector specificity or breakpoint is intentionally changed. Eleven exact duplicate top-level CSS blocks removed. Original shared stylesheets remain for other pages.
- Homepage HTML reduced from 237311 to 73164 characters. Critical consent and base layout remain inline; body styles remain at their original positions.
- Homepage caches with revalidation instead of no-store. Unversioned assets revalidate after one hour; explicitly immutable assets keep long caching. Visual editor configuration stays no-store.
- Removed duplicate /research/ and /research/metodologie/ entries from the case-study sitemap, retaining both in the core sitemap.
- Classified all 135 non-Atlas indexable omissions in the companion JSON. No bulk inclusion: 26 Atlas hubs, 94 short pages, 12 repeated compatibility pages and 3 directory/template review cases.
- Replaced 10 public Gmail occurrences across five pages with contact@astrovip.ro.
- Booking has one JavaScript-enabled entry CTA. Direct Stripe remains available inside noscript. The booking script and WhatsApp links are unchanged.
- FAQ schema now matches all six visible questions and answers. Service references the canonical organization and existing #programari booking section.

## Validation
The PR workflow compares baseline and candidate Hero pixels and computed layout at 10 viewport widths (360–1920), audits sitemap/canonical/hreflang/JSON-LD, checks approved image bytes, and exercises booking with mocked API calls and intercepted Stripe navigation.
No real bookings, payments, or deployment are performed.
Validation results are recorded in GitHub Actions artifacts. Do not merge until these checks pass and the screenshots have been reviewed.

## Remaining limits
- Duplicate CSS blocks removed are provably identical; overrides across different selectors are deliberately preserved. Further dead-selector pruning requires route and interactive-state coverage.
- HTML metadata checks are not Google Rich Results eligibility certification.
- Cache configuration requires live response-header verification after an approved deployment; browser/CDN caches already populated with older immutable URLs cannot be retroactively cleared by this commit.
- Excluded short/template pages need editorial work, not automatic sitemap inclusion.
- Legacy Hero asset deletion is gated by a repository-wide reference scan, including 10,000 legacy Atlas files.
