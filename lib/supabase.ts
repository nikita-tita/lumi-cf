/**
 * Supabase clients — BFF side only.
 *
 * `getSupabaseAdmin()` returns a service-role client that bypasses Row
 * Level Security. It MUST never leak to the mobile bundle / front-end
 * code — only used inside `landing/app/api/**` route handlers.
 *
 * When Supabase env vars are missing the helper returns `null`, which
 * lets each route return a 503 so mobile can fall back to the legacy
 * body-RAG flow (or the in-memory mock) cleanly.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    cached = null;
    return null;
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-client-info": "lumi-bff/1" } },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export const STORAGE_BUCKET = "client-docs";
