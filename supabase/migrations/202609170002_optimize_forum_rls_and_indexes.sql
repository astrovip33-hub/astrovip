-- Applied to project hhzsecdtqacyroxiywpm on 2026-09-17.
-- Adds covering indexes and prevents per-row auth function re-evaluation in
-- the active forum RLS policies.

create index if not exists forum_topics_author_idx on public.forum_topics(author_id);
create index if not exists forum_replies_author_idx on public.forum_replies(author_id);
create index if not exists forum_notifications_actor_idx on public.forum_notifications(actor_id);
create index if not exists forum_notifications_topic_idx on public.forum_notifications(topic_id);
create index if not exists forum_notifications_reply_idx on public.forum_notifications(reply_id);

drop policy if exists profiles_insert_self on public.profiles;
drop policy if exists profiles_update_self on public.profiles;
drop policy if exists profiles_admin_update_any on public.profiles;
create policy profiles_insert_self on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy profiles_owner_or_admin_update on public.profiles for update to authenticated
  using ((select auth.uid()) = id or (select private.forum_is_admin((select auth.uid()))))
  with check ((select auth.uid()) = id or (select private.forum_is_admin((select auth.uid()))));

drop policy if exists forum_topics_public_read on public.forum_topics;
drop policy if exists forum_topics_member_insert on public.forum_topics;
drop policy if exists forum_topics_owner_update on public.forum_topics;
drop policy if exists forum_topics_owner_delete on public.forum_topics;
create policy forum_topics_public_read on public.forum_topics for select to anon, authenticated
  using (status = 'open' or author_id = (select auth.uid()) or (select private.forum_is_staff((select auth.uid()))));
create policy forum_topics_member_insert on public.forum_topics for insert to authenticated
  with check (author_id = (select auth.uid()));
create policy forum_topics_owner_update on public.forum_topics for update to authenticated
  using (author_id = (select auth.uid()) or (select private.forum_is_staff((select auth.uid()))))
  with check (author_id = (select auth.uid()) or (select private.forum_is_staff((select auth.uid()))));
create policy forum_topics_owner_delete on public.forum_topics for delete to authenticated
  using (author_id = (select auth.uid()) or (select private.forum_is_staff((select auth.uid()))));

drop policy if exists forum_replies_public_read on public.forum_replies;
drop policy if exists forum_replies_member_insert on public.forum_replies;
drop policy if exists forum_replies_owner_update on public.forum_replies;
drop policy if exists forum_replies_owner_delete on public.forum_replies;
create policy forum_replies_public_read on public.forum_replies for select to anon, authenticated
  using (is_hidden = false or author_id = (select auth.uid()) or (select private.forum_is_staff((select auth.uid()))));
create policy forum_replies_member_insert on public.forum_replies for insert to authenticated
  with check (author_id = (select auth.uid()));
create policy forum_replies_owner_update on public.forum_replies for update to authenticated
  using (author_id = (select auth.uid()) or (select private.forum_is_staff((select auth.uid()))))
  with check (author_id = (select auth.uid()) or (select private.forum_is_staff((select auth.uid()))));
create policy forum_replies_owner_delete on public.forum_replies for delete to authenticated
  using (author_id = (select auth.uid()) or (select private.forum_is_staff((select auth.uid()))));

drop policy if exists forum_reactions_member_insert on public.forum_reactions;
drop policy if exists forum_reactions_owner_delete on public.forum_reactions;
create policy forum_reactions_member_insert on public.forum_reactions for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy forum_reactions_owner_delete on public.forum_reactions for delete to authenticated
  using (user_id = (select auth.uid()) or (select private.forum_is_staff((select auth.uid()))));

drop policy if exists forum_notifications_self_read on public.forum_notifications;
drop policy if exists forum_notifications_self_update on public.forum_notifications;
drop policy if exists forum_notifications_self_delete on public.forum_notifications;
create policy forum_notifications_self_read on public.forum_notifications for select to authenticated
  using (user_id = (select auth.uid()));
create policy forum_notifications_self_update on public.forum_notifications for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy forum_notifications_self_delete on public.forum_notifications for delete to authenticated
  using (user_id = (select auth.uid()));

-- The optimized homepage no longer uses this public visitor-counter RPC.
revoke all on function public.register_site_visit() from public, anon, authenticated;
