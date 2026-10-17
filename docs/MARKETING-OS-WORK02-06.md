# AstroVip Marketing OS V10 — WORK 02–06

This change extends `/command-center/v10/` on a separate branch. Production
publication is not part of this change; the final Cloudflare preview and its
exact commit must be reviewed together.

## WORK 02 — Intelligence

`scripts/import_marketing_exports.py` reads the original UTF-8 SE Ranking
archive without modifying it or making provider calls. CSV records are parsed;
PDF and XLSX are inventoried without interpreting their content. A bounded JSON
file contains selected keywords, SERP exports, competitor research estimates,
referring-domain gap rows and a SHA-256 manifest. Duplicate keyword volumes
are not added. Competitor brand searches and the retired dating/matrimonial
service are excluded from targets. History charts are not parsed as tracking
results. CSV ranks support both observed headers (`№` and `Top`).

Private export data is **not committed** to the repository or served by a
public static asset. The authenticated intelligence endpoint returns an empty
import state. The administrator imports the prepared JSON using a file picker;
its shape and size are validated and it stays in browser memory only. It is
never uploaded to an API, persisted by the application, or retained after logout.
Refresh preserves an imported snapshot for the current session. A private
review artifact can carry the user's actual data separately from the code PR.
Research currency is not assumed for files without a currency field.

AI/GEO preserves the 17 October baseline (Visibility 44.0%, used as source
40.3%) documented in PR #386, with its source and historical label. No fresh
Peec collection, model-by-model trend or composite dominance score is claimed.

Local reads only the configured Google Business location and verifies the
AstroVip website plus Unirii 33 in București before displaying a profile.
Review summaries require a full `accounts/<id>/locations/<id>` identifier in
`GOOGLE_BUSINESS_LOCATION_ID`; a bare ID does not cause account discovery.
No reviewer names or comments are returned. Maps rank remains unmeasured.

## WORK 03 — Operations

The existing authenticated overview, Site Health, Auto-Pilot, recovery-points
and Connections APIs are reused. Git commits are labelled recovery points,
not completed backups. Deploy, Drive backup and restoration use the existing
V9 controls; this change does not duplicate or automatically run them. Alerts
are visible incident signals from the existing monitor. No new notification
recipient or scheduling cadence is introduced.

## WORK 04 — Money

Authenticated `GET /api/command/money` uses the configured `GA4_PROPERTY_ID`
and existing Google OAuth, service account or Composio read authorization.
It does not choose another Analytics property. Three independent reports
cover the last 28 days through yesterday in the property's timezone:

- Event name → event count for the explicitly mapped contact/conversion events.
- Session source/medium + event name → event count and total revenue.
- Item name → items purchased and item revenue.

Partial report failure preserves successful sections. Row truncation,
thresholding, sampling, `(other)` grouping and report currency are surfaced.
These are event counts, not unique people or a joined funnel. A WhatsApp click
does not confirm a conversation; a phone click does not confirm an answered
call. The existing homepage `generate_lead` prepares a WhatsApp message and
therefore remains an intent signal. Saved free-question and booking events
need their actual instrumentation to be present in GA4. GA4 revenue and items
are not a cash ledger; reconciliation with bookings, collected payments,
refunds and exact sold services is still needed for confirmed business ROI.

Google API contracts used:
https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema
https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list

## WORK 05 — AI Operator

`workflows.js` combines observed operations, GSC search demand, dated keyword
and authority gaps, Local coverage and Money attribution signals. Its ordinal
score is `100 × severity × confidence / (5 × effort)`; the editorial weights
are visible. Every action has a source, context and qualitative impact.
There is no statistical probability or financial uplift prediction. The
operator opens a known module; it does not run deploys, outreach or payments.
It is a deterministic decision engine; the UI does not claim an LLM was called.

## WORK 06 — QA

`marketing-os-qa.yml` runs the API/data/security regression suite and actual
Chromium UI checks across 320, 390, 768, 1024 and 1440px. Tests cover every
module, page overflow, encoding, research filters, SERP selection, API failure,
logout and a 100KB uncompressed static asset budget. Browser tests use isolated
fixtures; they do not access live personal data or mutate production. The
exact-commit report and six screenshots are uploaded as a GitHub artifact.

The QA page distinguishes observed HTTP/Auto-Pilot signals from checks that
need the commit's QA report. It does not label unmeasured security controls or
Core Web Vitals as passed. Static bytes are a delivery budget, not an LCP or
INP measurement. The shared visual preview never loads administrative data.

Live authenticated GA4/GBP behavior must be verified with the production
configuration after approval and publication. Preview success alone is not
evidence that provider credentials, event instrumentation or revenue
reconciliation have been completed.
