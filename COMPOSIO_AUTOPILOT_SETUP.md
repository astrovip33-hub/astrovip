# AstroVip Composio Auto-Pilot — Phase 1

This integration is intentionally disabled until the Composio project API key and app connections are configured.

## Architecture

AstroVip Command Center -> Cloudflare Worker -> Composio -> GitHub / Cloudflare / Google Search Console / Google Sheets

## Phase 1 policy

- read-only first;
- no direct writes to `main`;
- no automatic production deployments;
- no DNS writes;
- no delete actions;
- every write/deploy/delete action must require explicit approval;
- secrets remain server-side only.

Policy file: `config/composio-autopilot.json`.

## Composio toolkits

Initial allowlist:

- `github`
- `cloudflare`
- `google_search_console`
- `googlesheets`

## Required secret

Create a Composio project and store its project API key only as the Cloudflare Worker secret:

```bash
npx wrangler secret put COMPOSIO_API_KEY --name astrovip
```

Do not commit the key to GitHub and do not place it in browser JavaScript, HTML, `wrangler.jsonc`, or a public environment variable.

## Connection order

1. GitHub — repository `astrovip33-hub/astrovip`.
2. Google Search Console — property `sc-domain:astrovip.ro`.
3. Google Sheets — KPI/report storage.
4. Cloudflare — begin with minimum read permissions; write permissions remain disabled during Phase 1.

## Activation sequence

1. Create the Composio project and obtain the project API key.
2. Save `COMPOSIO_API_KEY` as a Cloudflare Worker secret.
3. Connect the four accounts/toolkits in Composio.
4. Add the server-side Composio session/gateway to Command Center.
5. Test read-only status and discovery on the feature branch/preview.
6. Enable individually approved write actions.
7. Merge to `main` only after preview verification.

## Target workflows

- SEO opportunity: GSC -> analysis -> recommended page change.
- Safe code change: recommendation -> feature branch -> preview -> approval -> merge/deploy.
- Post-deploy verification: live URL -> GSC/sitemap checks -> KPI log.
- KPI log: ranking/click/impression results -> Google Sheets.

The Auto-Pilot must never bypass the existing AstroVip SEO quality gates or GitHub/Cloudflare deployment checks.
