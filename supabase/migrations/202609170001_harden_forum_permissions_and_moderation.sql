-- Applied to project hhzsecdtqacyroxiywpm on 2026-09-17.
-- RLS remains enabled; this migration supplies the SQL privileges required by
-- PostgREST and moves privileged forum actions behind checked RPC functions.

revoke all privileges on table
  public.profiles, public.forum_categories, public.forum_topics,
  public.forum_replies, public.forum_reactions, public.forum_notifications
from anon, authenticated;

grant select on table
  public.profiles, public.forum_categories, public.forum_topics,
  public.forum_replies, public.forum_reactions
to anon, authenticated;
grant select on table public.forum_notifications to authenticated;

grant insert (id, username, display_name, avatar_url, bio, website)
  on public.profiles to authenticated;
grant update (username, display_name, avatar_url, bio, website)
  on public.profiles to authenticated;

grant insert (category_id, author_id, author_name, title, body)
  on public.forum_topics to authenticated;
grant update (title, body) on public.forum_topics to authenticated;
grant delete on table public.forum_topics to authenticated;

grant insert (topic_id, author_id, author_name, body)
  on public.forum_replies to authenticated;
grant update (body) on public.forum_replies to authenticated;
grant delete on table public.forum_replies to authenticated;

grant insert (user_id, topic_id, reply_id, reaction_type)
  on public.forum_reactions to authenticated;
grant delete on table public.forum_reactions to authenticated;
grant update (read_at) on public.forum_notifications to authenticated;
grant delete on table public.forum_notifications to authenticated;

grant usage on schema private to anon, authenticated;
revoke all on function private.forum_is_staff(uuid) from public, anon, authenticated;
revoke all on function private.forum_is_admin(uuid) from public, anon, authenticated;
grant execute on function private.forum_is_staff(uuid) to anon, authenticated;
grant execute on function private.forum_is_admin(uuid) to authenticated;

create or replace function public.astrovip_forum_bump_topic()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.forum_topics
     set updated_at = now()
   where id = coalesce(new.topic_id, old.topic_id);
  return coalesce(new, old);
end;
$$;

create or replace function public.forum_moderate_topic(target_topic uuid, target_action text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare changed integer;
begin
  if auth.uid() is null or not private.forum_is_staff(auth.uid()) then
    raise exception 'Moderator privileges required' using errcode = '42501';
  end if;
  if target_action = 'pin' then
    update public.forum_topics set is_pinned = true where id = target_topic;
  elsif target_action = 'unpin' then
    update public.forum_topics set is_pinned = false where id = target_topic;
  elsif target_action = 'lock' then
    update public.forum_topics set is_locked = true where id = target_topic;
  elsif target_action = 'unlock' then
    update public.forum_topics set is_locked = false where id = target_topic;
  elsif target_action = 'hide' then
    update public.forum_topics set status = 'hidden' where id = target_topic;
  elsif target_action = 'publish' then
    update public.forum_topics set status = 'open' where id = target_topic;
  else
    raise exception 'Unsupported moderation action' using errcode = '22023';
  end if;
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

create or replace function public.forum_moderate_reply(target_reply uuid, hide_reply boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare changed integer;
begin
  if auth.uid() is null or not private.forum_is_staff(auth.uid()) then
    raise exception 'Moderator privileges required' using errcode = '42501';
  end if;
  update public.forum_replies set is_hidden = hide_reply where id = target_reply;
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

create or replace function public.forum_set_role(target_username text, new_role text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare changed integer;
begin
  if auth.uid() is null or not private.forum_is_admin(auth.uid()) then
    raise exception 'Administrator privileges required' using errcode = '42501';
  end if;
  if new_role not in ('member', 'moderator', 'admin') then
    raise exception 'Invalid forum role' using errcode = '22023';
  end if;
  update public.profiles set role = new_role
   where username = lower(trim(target_username));
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;

revoke all on function public.forum_moderate_topic(uuid, text) from public, anon;
revoke all on function public.forum_moderate_reply(uuid, boolean) from public, anon;
revoke all on function public.forum_set_role(text, text) from public, anon;
grant execute on function public.forum_moderate_topic(uuid, text) to authenticated;
grant execute on function public.forum_moderate_reply(uuid, boolean) to authenticated;
grant execute on function public.forum_set_role(text, text) to authenticated;

revoke all on function public.notify_forum_reply() from public, anon, authenticated;
revoke all on function public.notify_forum_reaction() from public, anon, authenticated;
revoke all on function public.protect_forum_topic_moderation_fields() from public, anon, authenticated;
revoke all on function public.protect_profile_role() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.astrovip_forum_bump_topic() from public, anon, authenticated;
