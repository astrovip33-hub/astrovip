# AstroVip — production source

Current production site: https://astrovip.ro/

- Hosting: Cloudflare Worker + static assets
- Source of truth: `main`
- Automatic production deploy: `.github/workflows/deploy-cloudflare-worker.yml`
- Canonical `www` redirect: Cloudflare Worker

Repository cleaned on 2026-09-21 to keep the current production site and remove obsolete previews, tests, one-off generators, temporary deployment helpers, binary assembly fragments, and superseded asset variants.
