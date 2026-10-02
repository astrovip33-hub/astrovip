# AstroVip Command Center V3 — setup securizat

## Ce funcționează imediat

- panoul `/command-center/`
- login cu token ținut doar în `sessionStorage`
- status GitHub / ultimul deploy
- backup ZIP al branch-ului `main`
- linkuri directe spre Preview, Cloudflare, GitHub, Search Console, GA4, Ads, Metricool, Figma și Canva

## Secrete Cloudflare Worker

Setează secretele prin Cloudflare Dashboard sau `wrangler secret put`.

### Obligatoriu

- `COMMAND_CENTER_TOKEN` — parolă lungă și unică pentru panou.

### Pentru butonul PUBLICĂ

- `GITHUB_ADMIN_TOKEN` — fine-grained GitHub token limitat la repository-ul `astrovip33-hub/astrovip`, cu permisiune **Actions: Read and write** și **Contents: Read**.

### Pentru GSC + GA4

- `GOOGLE_SERVICE_ACCOUNT_JSON` — JSON complet al unui Google Cloud service account.
- `GA4_PROPERTY_ID` — ID-ul numeric al proprietății GA4, nu Measurement ID-ul `G-...`.
- opțional `GSC_SITE_URL`; implicit este `sc-domain:astrovip.ro`.

Service account-ul trebuie adăugat cu acces:

- în Google Search Console la proprietatea `sc-domain:astrovip.ro`;
- în GA4 Property Access Management, cel puțin Viewer.

## Ce NU este conectat încă

- Google Ads API
- Metricool API
- upload automat al backup-ului în Google Drive

Acestea sunt afișate explicit ca `De conectat`; panoul nu inventează date.

## Securitate

- tokenurile GitHub și Google există doar ca secrete server-side în Cloudflare Worker;
- browserul primește doar rezultatele API;
- endpoint-urile `/api/command/*` cer `Authorization: Bearer <COMMAND_CENTER_TOKEN>`;
- răspunsurile API au `Cache-Control: no-store`;
- pagina are `noindex,nofollow,noarchive`.
