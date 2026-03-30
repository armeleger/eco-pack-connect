// lib/supabase.ts
// ============================================================
// Browser-side Supabase client.
// Safe to call in "use client" components.
// ============================================================
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Export a default supabase instance for convenience
export const supabase = createClient();