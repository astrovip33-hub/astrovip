---
name: playwright
description: Browser QA for AstroVip using Playwright CLI. Use for mobile/desktop visual verification, navigation, forms, screenshots, responsive regressions, menus, headers, footers, CTAs and post-deploy smoke tests.
metadata:
  source: https://github.com/openai/skills/tree/main/skills/.curated/playwright
  adapted_for: AstroVip
---

# AstroVip Playwright QA

Use a real browser to verify AstroVip behavior before and after UI or SEO-related releases. Prefer repeatable browser checks over assumptions from source code alone.

## Prerequisite

Check Node/npm first:

```bash
node --version
npm --version
npx --version
```

If Playwright CLI is not already available, use it through `npx` rather than adding a project dependency unless the repository intentionally standardizes on one.

## Core workflow

1. Open the target URL.
2. Capture a fresh DOM snapshot before interacting.
3. Test the requested flow using stable element references.
4. Re-snapshot after navigation, menu state changes, modal changes, or dynamic rendering.
5. Capture screenshots when visual verification matters.
6. Repeat the key flow on desktop and a representative mobile viewport.
7. Report concrete regressions with URL, viewport, action and observed result.

## AstroVip release smoke test

For changes touching public pages, verify at minimum:

- homepage loads without visible errors;
- header and mobile menu open/close correctly;
- plus/minus menu indicators retain intended states;
- CTA links resolve to the intended final URL;
- footer remains compact and readable;
- no stale/old content flashes on refresh;
- key pages render H1, body copy and internal links;
- forms or booking/contact flows still submit or reach their intended endpoint;
- mobile layout has no horizontal overflow or clipped controls.

## SEO-visible browser checks

When a change can affect discoverability, confirm in the rendered document:

- title and meta description are present;
- canonical points to the final HTTPS URL;
- robots directives are intentional;
- one primary H1 is visible;
- structured data remains present and parseable;
- important internal links are real `<a href>` links;
- content is visible without requiring a user interaction such as scroll/click to fetch the primary copy.

## Guardrails

- Snapshot before using element references; refresh references after meaningful DOM changes.
- Prefer explicit browser actions over arbitrary JavaScript evaluation.
- Do not submit destructive forms or alter production account settings unless the user explicitly asked for that action.
- A screenshot alone is not a functional test; verify the interaction as well.
- Do not declare a mobile fix complete until the changed area is checked on a mobile viewport.
- Keep QA artifacts out of production source directories.
