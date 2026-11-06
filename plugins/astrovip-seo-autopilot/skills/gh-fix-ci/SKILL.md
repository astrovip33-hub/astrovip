---
name: gh-fix-ci
description: Diagnose and repair failing GitHub Actions checks for AstroVip pull requests. Use when a PR check is red, queued too long, or a workflow fails after a code/content/SEO change.
metadata:
  source: https://github.com/openai/skills/tree/main/skills/.curated/gh-fix-ci
  adapted_for: AstroVip
---

# AstroVip GitHub CI Repair

Use GitHub Actions evidence to isolate the failing check, identify the first actionable error, apply the smallest relevant fix and re-run validation.

## Workflow

1. Resolve the target PR and current head SHA.
2. List all checks and distinguish:
   - GitHub Actions failures;
   - checks still queued/in progress;
   - external-provider checks.
3. For each failing GitHub Actions run, inspect the run metadata and failing job logs.
4. Extract the earliest root-cause error rather than treating downstream failures as separate bugs.
5. Classify the failure:
   - code/build;
   - SEO/GEO validation;
   - structured data/canonical/sitemap;
   - tests;
   - deployment/config;
   - transient infrastructure/network.
6. Make the smallest scoped change that addresses the root cause.
7. Re-run or let the PR trigger the relevant workflow again.
8. Verify all required checks are green before merge.

## AstroVip priorities

For SEO/GEO pipeline failures, inspect first:

- canonical mismatches;
- invalid or duplicate JSON-LD;
- sitemap URLs/lastmod issues;
- orphan/broken internal links;
- inaccessible URLs or unexpected redirects;
- robots/noindex regressions;
- changed files outside the user's requested scope.

For UI changes, keep CI repair separate from design changes: do not opportunistically modify header/footer/menu behavior while fixing an unrelated workflow.

## Guardrails

- Do not disable, delete or weaken a failing quality gate merely to get a green build.
- Do not force-push or rewrite shared history unless explicitly requested and necessary.
- Do not treat an in-progress run as failed.
- If the failure belongs to an external provider and logs are unavailable, report the provider/check URL and avoid guessing.
- Keep fixes scoped to the failure; unrelated cleanup belongs in a separate PR.
- After a fix, confirm the new workflow run corresponds to the latest head SHA.
