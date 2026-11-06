---
name: cloudflare-deploy
description: Safe Cloudflare deployment workflow for AstroVip. Use for Workers/Pages deploys, cache and edge behavior, production publishing, deployment verification and rollback-oriented release checks.
metadata:
  source: https://github.com/openai/skills/tree/main/skills/.curated/cloudflare-deploy
  adapted_for: AstroVip
---

# AstroVip Cloudflare Deploy

Deploy AstroVip changes to Cloudflare with explicit preflight, verification and rollback discipline. This skill is for releases, not for ordinary content analysis.

## Preflight

Before any production deployment:

```bash
npx wrangler whoami
```

Then inspect the repository's existing Cloudflare configuration and package scripts. Reuse the current deployment path instead of inventing a second one.

Confirm:

- working tree/branch contains only intended changes;
- required build or validation commands pass;
- no secret values are committed;
- canonical host and redirect behavior are unchanged unless intentionally modified;
- sitemap and robots changes are deliberate;
- production credentials are read from environment/secrets, never hardcoded.

## Deployment workflow

1. Identify whether AstroVip is using Workers, Pages, or another existing Cloudflare path.
2. Run the repository's validation/build commands first.
3. Deploy with the existing project command or Wrangler configuration.
4. Record the resulting deployment/version identifier when available.
5. Run live smoke checks immediately after deployment.

## Live verification

Check representative URLs including homepage and changed pages:

- HTTPS returns the expected 2xx/3xx status;
- `http` and `www` variants redirect to the canonical host as intended;
- page title, H1 and canonical are correct;
- `robots.txt` and sitemap endpoints are reachable;
- structured data remains present;
- mobile/desktop critical UI still works;
- no stale release is being served from cache;
- assets return successfully and there are no obvious console/runtime failures.

For SEO releases, also confirm the changed URL appears in the appropriate sitemap and its `lastmod` is accurate when the sitemap uses `lastmod`.

## Cloudflare-specific checks

When relevant, inspect:

- Worker routes and custom domains;
- cache rules that could serve stale HTML;
- redirects/rewrite rules;
- bot/WAF rules that could block legitimate search crawlers;
- response headers and status codes;
- image optimization behavior for LCP assets.

## Guardrails

- Do not create a parallel Cloudflare project when an existing production project already serves AstroVip.
- Do not rotate/delete secrets as part of an unrelated deploy.
- Do not purge or alter broad cache/WAF rules without evidence that they are the cause.
- Production deploys must preserve the current canonical hostname unless the user explicitly requests a migration.
- If validation fails, diagnose the failure before deploying rather than bypassing the check.
- Prefer reversible, scoped changes over account-wide configuration changes.
