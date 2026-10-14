-- AstroVip Microsoft Clarity private snapshot store.
-- Applied to Supabase project Astrovip-Forum.
-- Intentionally deny-all for anon/authenticated; administrative ingestion/query only.

create table if not exists private.clarity_snapshots (
  id bigint generated always as identity primary key,
  captured_at timestamptz not null default now(),
  period_hours smallint not null default 24 check (period_hours in (24,48,72)),
  project_id text,
  sessions bigint not null default 0,
  bot_sessions bigint not null default 0,
  users bigint not null default 0,
  dead_clicks bigint not null default 0,
  rage_clicks bigint not null default 0,
  script_errors bigint not null default 0,
  metric_blocks integer not null default 0,
  raw_metrics jsonb not null default '[]'::jsonb,
  source text not null default 'microsoft_clarity_data_export_api'
);

alter table private.clarity_snapshots enable row level security;
revoke all on table private.clarity_snapshots from anon, authenticated;
revoke all on sequence private.clarity_snapshots_id_seq from anon, authenticated;

create index if not exists clarity_snapshots_captured_at_idx
  on private.clarity_snapshots (captured_at desc);

comment on table private.clarity_snapshots is
  'Private Microsoft Clarity aggregate snapshots for AstroVip analysis; no Clarity API token is stored here.';
