import { createClient } from '@supabase/supabase-js';
import { V9 } from './config';

export const supabase = createClient(V9.supabaseUrl, V9.supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: { headers: { 'x-client-info': `astrovip-premium-v${V9.version}` } }
});

export type FeatureFlags = Record<string, boolean>;

export async function loadFeatureFlags(): Promise<FeatureFlags> {
  const { data, error } = await supabase
    .from('av_feature_flags')
    .select('key,enabled,rollout,rules')
    .eq('enabled', true);
  if (error || !data) return {};
  const bucket = stableBucket(getSessionId());
  return Object.fromEntries(data.map((row: any) => [row.key, Number(row.rollout ?? 100) > bucket]));
}

export function getSessionId(): string {
  const key = 'av_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function stableBucket(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0) % 100;
}

export async function track(eventName: string, properties: Record<string, unknown> = {}) {
  try {
    const { data: auth } = await supabase.auth.getSession();
    await supabase.from('av_events').insert({
      session_id: getSessionId(),
      user_id: auth.session?.user?.id ?? null,
      event_name: eventName.slice(0, 80),
      path: location.pathname,
      referrer: document.referrer || null,
      properties
    });
  } catch {
    // Analytics must never break the customer experience.
  }
}

async function knowledgeRpc(query: string, lang: string) {
  return supabase.rpc('av_search_content', {
    query_text: query,
    match_count: 6,
    lang_filter: lang.slice(0, 2)
  });
}

export async function searchKnowledge(query: string, lang = document.documentElement.lang || 'ro') {
  const primaryLang = lang.slice(0, 2).toLowerCase();
  const primary = await knowledgeRpc(query, primaryLang);
  if (!primary.error && Array.isArray(primary.data) && primary.data.length) return primary.data;
  if (primaryLang !== 'ro') {
    const fallback = await knowledgeRpc(query, 'ro');
    if (!fallback.error && Array.isArray(fallback.data)) return fallback.data;
  }
  if (primary.error) throw primary.error;
  return Array.isArray(primary.data) ? primary.data : [];
}

export async function sendMagicLink(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${location.origin}/client/` }
  });
}

export async function currentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function loadBirthProfiles() {
  const user = await currentUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('av_birth_profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function saveBirthProfile(payload: Record<string, unknown>) {
  const user = await currentUser();
  if (!user) throw new Error('authentication_required');
  const { data, error } = await supabase
    .from('av_birth_profiles')
    .insert({ ...payload, user_id: user.id })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function loadTakenBookingSlots(from?: string, days = 60) {
  const { data, error } = await supabase.rpc('av_taken_booking_slots', {
    p_from: from || null,
    p_days: Math.max(1, Math.min(days, 60))
  });
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function createBooking(payload: {
  bookingDate: string;
  bookingTime: string;
  name: string;
  phone: string;
  service: string;
  mode: string;
  note?: string;
}) {
  const { data, error } = await supabase.rpc('av_create_booking', {
    p_booking_date: payload.bookingDate,
    p_booking_time: payload.bookingTime,
    p_name: payload.name,
    p_phone: payload.phone,
    p_service: payload.service,
    p_mode: payload.mode,
    p_note: payload.note || null
  });
  if (error) throw error;
  return Array.isArray(data) ? data[0] : data;
}
