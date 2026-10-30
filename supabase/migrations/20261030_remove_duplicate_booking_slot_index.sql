-- Audit closeout 2026-10-30
-- Keep the canonical partial unique index booking_requests_active_slot_uidx.
-- Remove the duplicate index that enforced the exact same predicate/key.
DROP INDEX IF EXISTS public.booking_requests_one_active_slot_idx;
