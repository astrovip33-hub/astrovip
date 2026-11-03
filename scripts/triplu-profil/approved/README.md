# AstroVip — editorial approvals for daily indexing

Only profiles with **individually approved** records in this directory can enter the daily queue. Generated draft pages do not count as reviewed. The scheduled GitHub workflow releases **up to 20** approved profiles per calendar day in Europe/Bucharest. A zero-page day is expected if there are no valid approvals.

Each approval is a JSON document named after the profile slug with:

- slug (full ascendent-...-soare-...-luna-... identifier), status "approved", reviewed_at (ISO timestamp), reviewed_by (real reviewer or explicitly disclosed automated QA), review_notes (documented reasoning)
- title (25–70 chars), description (100–180 chars)
- sections object with exactly these seven keys: portret, ascendent_soare, soare_luna, ascendent_luna, relatii, munca, exercitiu. Each section needs at least 62 original words; total at least 480 words.

The automated quality gate rejects missing fields, placeholders, unsupported promises, identical sections, overly similar reviews and malformed metadata. Do **not** label a machine evaluation as a human or astrolog's personal review. Even an approved and published page may not be indexed by Google.

The source of truth for releases is ../indexed-state.json. Never edit it by hand to skip a review or to exceed the daily cap. Main deployments revalidate the recorded content hash, and unapproved pages remain noindex.

GSC indexing status must come from real Search Console URL Inspection; successful publication and sitemap submission cannot be called Google indexing.
