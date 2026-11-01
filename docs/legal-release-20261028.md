# AstroVip legal preview — 28 October 2026

This change is a reviewable preview. Do not merge to main or publish the conditions until the owner accepts the proposed commercial policy and the live prerequisites below are complete.

## Included

- Premium, printable Romanian terms at `/termeni-si-conditii/`, with operator identity, service boundaries, contract formation, pricing, cancellation, withdrawal, refunds, digital deliverables, privacy and complaints.
- Proposed flexible policy: no automatic cancellation/rescheduling/no-show penalty; no blanket forfeiture of amounts paid. The existing public FAQ already offers rescheduling subject to availability. The proposed policy must be approved as a commercial decision.
- Dedicated two-step withdrawal form at `/retragere-din-contract/`, plus an optional downloadable model and direct email/post alternatives.
- Public footer links, with server-rendered operator identification on public pages that contain a footer. Admin, widgets and preview routes are excluded. Existing privacy/cookie pages have static contextual links.
- Customer and operator receipt emails use separate recipients and identical plain-text declarations, a reference and server UTC timestamp. The page offers a downloadable receipt after the mail provider accepts both messages. This is not proof of final email delivery, a refund or acceptance of a legal claim.
- Preview hosts cannot send real mail. Without mail configuration or abuse protection the endpoint fails closed and offers direct contact. No database, personal-data record or email was created in production for this preview.

## Before publication

1. Approve the PFA details recovered from the supplied ONRC declaration and the proposed commercial policy. Verify that fiscal documents, payment processor and public identity match. Check current tax treatment and any professional disclosures against current operator records.
2. Configure an approved transactional mail provider. The implementation uses Resend's batch endpoint but no account has been provisioned and no paid service has been purchased. Set `LEGAL_RESEND_API_KEY` as a Worker secret and `LEGAL_WITHDRAWAL_FROM` to an address on a verified sending domain. Keep the destination operator mailbox `contact@astrovip.ro` operational. Review the processor agreement, locations, international-transfer safeguards and retention; add the exact verified details to the privacy policy before enabling this processor.
3. `wrangler.jsonc` declares `LEGAL_SUBMISSION_RATE_LIMITER` (5 attempts per 60 seconds, by source IP per Cloudflare location). Verify that namespace `2026102801` is unused in the account. This is approximate local abuse protection, not a strict global cap. Shared IPs may encounter the fallback; email/post remain available.
4. Test with operator-controlled inboxes: both messages arrive, full declaration/date/time are present, download works, failures do not claim success, and requests are reviewed without automatically cancelling or refunding the wrong contract. No external customer should receive a test message.
5. Align the actual Stripe/booking confirmation with the terms. Before a charge: display the total price and material service details; make the terms available; use express, separate consent for early performance and acknowledgement of withdrawal consequences. Do not infer consent from a payment, generic terms checkbox, privacy checkbox, cookies or a calendar slot. Send the terms/version and the required contract information on a durable medium. This change does not edit the external Stripe Payment Link or assert that existing confirmations already do this.
6. Preserve or replace the stylized SAL illustration with the official current ANPC pictogram and check its 250 × 50 px display requirement. This preview keeps the approved footer artwork, preserves the current SAL destination and adds text links; it does not certify the artwork as the official pictogram.

## Sources checked

- OUG 34/2014, consolidated with the 2026 amendment: https://legislatie.just.ro/Public/DetaliiDocument/158913 (especially articles 6, 8–16 and the model form; article 11¹ applies from 19 June 2026).
- Law 365/2002: https://legislatie.just.ro/Public/DetaliiDocument/37075.
- ANPC Order 270/2026 and current SAL information: https://anpc.ro/comunicat-sal/.
- EU ODR closure: https://consumer-redress.ec.europa.eu/site-relocation_en.
- Delivery API: https://resend.com/docs/api-reference/emails/send-batch-emails.
- Rate-limit binding: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/.

## Remaining work outside this legal preview

The stricter WCAG audit, recoverable infrastructure/data backups and vulnerability monitoring remain subsequent work. This change does not claim WCAG conformance, certify legal compliance or replace operator review of the contract and its real checkout process.
