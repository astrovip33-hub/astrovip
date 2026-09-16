-- AstroVip public visitor counter.
-- Stores only a one-way visitor fingerprint; no raw IP address or user agent is persisted.

create schema if not exists private;

create table if not exists private.site_visitors (
  visitor_hash text primary key check (char_length(visitor_hash) = 32),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  visit_count bigint not null default 1
);

alter table private.site_visitors enable row level security;

revoke all on schema private from public, anon, authenticated;
revoke all on table private.site_visitors from public, anon, authenticated;

create or replace function public.register_site_visit()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  request_headers jsonb := coalesce(
    nullif(current_setting('request.headers', true), ''),
    '{}'
  )::jsonb;
  visitor_ip text;
  visitor_agent text;
  visitor_key text;
  total_visitors bigint;
begin
  visitor_ip := trim(split_part(
    coalesce(
      request_headers ->> 'cf-connecting-ip',
      request_headers ->> 'x-forwarded-for',
      ''
    ),
    ',',
    1
  ));
  visitor_agent := coalesce(request_headers ->> 'user-agent', 'unknown');
  visitor_key := pg_catalog.md5(
    visitor_ip || '|' || visitor_agent || '|astrovip-counter-v1'
  );

  insert into private.site_visitors (visitor_hash)
  values (visitor_key)
  on conflict (visitor_hash) do update
    set last_seen_at = now(),
        visit_count = private.site_visitors.visit_count + 1;

  select count(*) into total_visitors
  from private.site_visitors;

  return total_visitors;
end;
$$;

revoke all on function public.register_site_visit() from public;
grant execute on function public.register_site_visit() to anon, authenticated, service_role;

notify pgrst, 'reload schema';
