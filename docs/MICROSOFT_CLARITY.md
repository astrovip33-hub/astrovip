# Microsoft Clarity · AstroVip

## Architecture

- Public tracking uses the Clarity project ID only.
- The Clarity tag is loaded by `assets/consent-v2.js` only after the visitor grants Analytics consent.
- `CLARITY_API_TOKEN` never reaches the browser. It is read only by the Worker-side `clarity-api.js` bridge.
- AstroVip Operations Center loads `assets/clarity-command-center.js`, which adds a manual Clarity UX card.
- The card does not refresh automatically because the Microsoft Clarity Data Export API is rate-limited.

## Required Cloudflare Worker variables

Configure these in the AstroVip production Worker environment:

- `CLARITY_PROJECT_ID` — the Clarity project identifier from Settings / Overview.
- `CLARITY_API_TOKEN` — the Data Export API token generated in Clarity Settings / Data Export. Store this as a secret.

Do not commit the API token to GitHub or expose it in client-side JavaScript.

## Verification

1. With Analytics consent denied, confirm that no `clarity.ms/tag/...` script is loaded.
2. Grant Analytics consent and confirm that the Clarity tag loads and collection requests begin.
3. Open `/command-center/`, authenticate, and confirm the `MICROSOFT CLARITY · UX` card is present.
4. Click `Actualizează Clarity`; confirm the protected `/api/command/clarity` endpoint returns live data.
5. Use the Clarity dashboard for heatmaps and session recordings.

## API behavior

The bridge accepts:

- `days` / `numOfDays`: 1, 2, or 3.
- Up to three dimensions: `Browser`, `Device`, `Country/Region`, `OS`, `Source`, `Medium`, `Campaign`, `Channel`, `URL`.

The Operations Center intentionally uses a manual 24-hour refresh to preserve the daily API request quota.
