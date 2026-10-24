---
name: core-web-vitals
description: Diagnose and improve AstroVip Core Web Vitals and page experience: LCP, INP, CLS, mobile/desktop performance, hero loading, render-blocking resources, interaction latency, layout shifts and performance regressions after deploys.
---

# AstroVip Core Web Vitals

Use field data first when available. Lighthouse/PageSpeed lab results are debugging aids, not substitutes for real-user data.

## Targets

Use current Google thresholds as reference:
- LCP: good at <= 2.5s
- INP: good at <= 200ms
- CLS: good at <= 0.1

Evaluate mobile and desktop separately.

## Workflow

### 1. Identify the affected template
Group problems by page type: homepage, service, article/horoscope, calculator/tool, study/case-study or other shared template.

### 2. Find the actual element/cause
Do not stop at "LCP is slow" or "CLS is bad". Identify the responsible element or task.

For LCP inspect:
- TTFB
- when the LCP resource starts loading
- image dimensions/format/srcset
- lazy loading on above-the-fold imagery
- render-blocking CSS/JS
- client-only hero rendering

For INP inspect:
- long main-thread tasks
- menu/accordion/form handlers
- heavy third-party scripts
- large DOM work
- synchronous JavaScript during interactions

For CLS inspect:
- images/embeds without dimensions
- late font swaps
- injected banners or widgets
- dynamic content inserted above existing content

### 3. Fix template-level causes
Prefer one reusable fix that improves all affected AstroVip pages over one-off per-URL hacks.

Typical priorities:
- explicit image dimensions/aspect-ratio
- optimized AVIF/WebP where appropriate
- responsive images
- `fetchpriority="high"` / preload only for the true LCP asset when justified
- no lazy loading on the primary above-the-fold hero image
- defer/remove unnecessary JavaScript
- reduce layout-changing late injections
- reserve space for dynamic UI

### 4. Protect functionality
AstroVip has interactive mobile navigation and calculators. Do not defer or remove scripts in ways that break menus, forms, ephemeris calculations or conversion flows.

### 5. Validate after release
- lab-test key templates immediately
- compare mobile and desktop
- verify no visual regressions
- monitor field data over the rolling measurement window
- record regressions in CI/performance checks when possible

## Guardrails

- Do not chase a Lighthouse 100 score at the expense of UX or functionality.
- Do not claim a fixed ranking increase from speed changes.
- Avoid piling multiple optimization libraries/plugins on top of each other without profiling.
- Preserve the premium AstroVip visual design unless a visual change is explicitly approved.

## Output

For each finding provide:
`Template -> Metric -> Responsible element/task -> Evidence -> Fix -> Risk -> Validation`.

## Source attribution

Adapted for AstroVip from Afeez Adebayo's `core-web-vitals` Agent Skill (CC BY 4.0):
https://github.com/afeezadebayo/technical-seo-skills/tree/main/core-web-vitals
