// src/services/partnership.ts
// ─────────────────────────────────────────────────────────────────────────────
// REBRU IG Landing — Partnership Service Layer
//
// FILE INI IDENTIK dengan src/services/partnership.ts di Rebru website.
// Tujuan: kedua platform menulis ke Supabase table yang SAMA.
//
//   Rebru website  → insertPartnerApplication() → partner_applications ←
//   IG landing     → insertPartnerApplication() → partner_applications ←
//                                                         ↓
//                                              Admin Dashboard (Rebru website)
//                                              membaca SEMUA submission
//
// ─────────────────────────────────────────────────────────────────────────────
// MIGRASI KE SUPABASE (Sprint 4):
//
//   1. Buat src/lib/supabase.ts:
//      import { createClient } from "@supabase/supabase-js";
//      export const supabase = createClient(
//        process.env.NEXT_PUBLIC_SUPABASE_URL!,
//        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,  // ← key yang SAMA
//      );                                              //   dengan Rebru website
//
//      Penting: gunakan ANON KEY yang sama → akses ke table yang sama.
//
//   2. Di setiap fungsi: uncomment blok Supabase, hapus blok mock.
//
// Schema Supabase (identik dengan Rebru website):
//
//   TABLE: partner_applications
//     id             uuid     PK  default gen_random_uuid()
//     name           text     NOT NULL   ← PIC
//     organization   text     NOT NULL
//     phone          text     NOT NULL
//     email          text     NOT NULL
//     jenis_usaha    text
//     volume_limbah  text
//     city           text
//     kecamatan      text
//     kelurahan      text
//     alamat         text
//     type           text     NOT NULL   ← kontributor | dampak | strategis
//     message        text
//     status         text     DEFAULT 'pending'
//     source         text     DEFAULT 'website'  ← BARU: 'ig_landing' untuk
//     created_at     timestamptz DEFAULT now()      membedakan asal submission
//
//   Tambahkan kolom `source` ke table agar admin dapat filter
//   submission dari IG landing vs website Rebru.
// ─────────────────────────────────────────────────────────────────────────────

export interface PartnerApplicationPayload {
  name: string;
  organization: string;
  phone: string;
  email: string;
  jenis_usaha: string;
  volume_limbah: string;
  city: string;
  kecamatan: string;
  kelurahan: string;
  alamat: string;
  type: "kontributor" | "dampak" | "strategis";
  message?: string;
  status: "pending";
  source: "ig_landing"; // membedakan asal submission di admin dashboard
}

export interface ServiceResult {
  error: Error | null;
}

export async function insertPartnerApplication(
  data: PartnerApplicationPayload,
): Promise<ServiceResult> {
  // ── SPRINT 4: Supabase ────────────────────────────────────────────────────
  // import { supabase } from "@/lib/supabase";
  // const { error } = await supabase.from("partner_applications").insert(data);
  // return { error };
  // ── END SPRINT 4 ──────────────────────────────────────────────────────────

  // ── MOCK (hapus setelah Sprint 4) ─────────────────────────────────────────
  console.log("[ig/partnership.ts] partner_applications.insert →", data);
  await new Promise((r) => setTimeout(r, 1000));
  return { error: null };
  // ── END MOCK ──────────────────────────────────────────────────────────────
}
