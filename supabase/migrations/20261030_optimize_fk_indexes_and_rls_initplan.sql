-- Audit closeout 2026-10-30
-- Add covering indexes for foreign keys reported by the Supabase performance advisor.
CREATE INDEX IF NOT EXISTS av_astrology_results_birth_profile_idx ON public.av_astrology_results (birth_profile_id);
CREATE INDEX IF NOT EXISTS av_events_user_idx ON public.av_events (user_id);
CREATE INDEX IF NOT EXISTS av_experiment_events_user_idx ON public.av_experiment_events (user_id);
CREATE INDEX IF NOT EXISTS av_reports_user_idx ON public.av_reports (user_id);

-- Evaluate auth.uid() once per statement instead of once per row.
-- Permission semantics remain unchanged.
ALTER POLICY av_birth_profiles_owner_all ON public.av_birth_profiles
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER POLICY av_astrology_results_owner_all ON public.av_astrology_results
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER POLICY av_reports_owner_select ON public.av_reports
  USING ((SELECT auth.uid()) = user_id);

ALTER POLICY av_reports_owner_insert ON public.av_reports
  WITH CHECK ((SELECT auth.uid()) = user_id);
