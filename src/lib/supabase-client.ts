// src/lib/supabase/client.ts
// ─────────────────────────────────────────────────────────────────────────────
// Supabase browser client untuk bio-link
//
// Menggunakan @supabase/ssr yang sama dengan Website agar Session handling
// konsisten. Kedua project connect ke Supabase instance yang sama.
//
// Sprint 4: gunakan client ini untuk fetch produk dan submit order.
// ─────────────────────────────────────────────────────────────────────────────

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
