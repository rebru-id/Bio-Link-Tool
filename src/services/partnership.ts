// src/services/partnership.ts
// ─────────────────────────────────────────────────────────────────────────────
// REBRU IG Landing — Partnership Service Layer (Sprint 4 — CLEAN)
//
// ⚠️  PLATFORM-SPECIFIC — JANGAN MASUKKAN KE sync-shared.ps1
// File ini adalah service layer khusus bio-link (bio.rebru.id).
// source_platform = "ig_landing" (berbeda dengan website = "website")
//
// PERUBAHAN dari versi sebelumnya:
//   - Hapus import dari @/lib/location-data (dead import — tidak dipakai)
//   - Hapus resolveKotaLabel, resolveKecamatanLabel, resolveKelurahanLabel
//     (dead code — selalu return input karena slug/nama sudah sama sejak
//      fetchKotaList() diubah ke Supabase dengan value = nama langsung)
//   - insertPartnerApplication sekarang langsung pakai data.city / kecamatan
//     / kelurahan tanpa perlu resolve — nilai sudah berupa nama, bukan slug
//
// ARSITEKTUR:
//   - Lazy singleton pattern: createClient dipanggil saat runtime, bukan
//     module level — aman di Next.js + Vercel production
//   - Hardcode fallback: NEXT_PUBLIC_ anon key aman di-hardcode (bukan secret)
//     Keamanan dijaga RLS di Supabase. Ref: supabase.com/docs/guides/auth/rls
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// Supabase Client — Lazy Singleton
// ─────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL  = "https://mubzwqkhhhittibstugh.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Ynp3cWtoaGhpdHRpYnN0dWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMTA5NjYsImV4cCI6MjA5MDY4Njk2Nn0.C_YqDM0OFAVc9zww5afq9S0po2n7KzZGW9HhzNsMcrE";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? SUPABASE_ANON;
  _supabase = createClient(url, key);
  return _supabase;
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface PartnerApplicationPayload {
  name:         string;
  organization: string;
  phone:        string;
  email:        string;
  jenis_usaha:  string;
  volume_limbah: string;
  city:         string;   // nama kota langsung (bukan slug) — dari fetchKotaList()
  kotaCustom?:  string;
  kecamatan:    string;   // nama kecamatan langsung — dari fetchKecamatanByKota()
  kelurahan:    string;   // nama kelurahan langsung — dari fetchKelurahanByKecamatan()
  alamat:       string;
  type:         "kontributor" | "dampak" | "strategis";
  message?:     string;
}

export interface ServiceResult {
  error: Error | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// insertPartnerApplication
//
// data.city / kecamatan / kelurahan sudah berupa nama langsung (bukan slug)
// sejak dropdown dialihkan ke Supabase ref_ tables via fetchKotaList() dll.
// Tidak perlu resolve helper lagi.
// ─────────────────────────────────────────────────────────────────────────────

export async function insertPartnerApplication(
  data: PartnerApplicationPayload,
): Promise<ServiceResult> {
  try {
    const isCustomKota = data.city === "lain"
      || data.city === "Kota / Kab. Lain"
      || !data.city;

    const { error } = await getSupabase()
      .from("partner_applications")
      .insert({
        pic_name:       data.name.trim(),
        organization:   data.organization.trim(),
        phone:          data.phone.trim(),
        email:          data.email.trim().toLowerCase(),
        package_type:   data.type,
        jenis_usaha:    data.jenis_usaha,
        volume_limbah:  data.volume_limbah,
        // Nama kota: pakai kotaCustom jika "lainnya", langsung pakai data.city jika tidak
        kota_nama:      isCustomKota ? (data.kotaCustom?.trim() ?? "Lainnya") : data.city,
        kota_custom:    isCustomKota ? (data.kotaCustom?.trim() ?? null)      : null,
        kecamatan_nama: data.kecamatan.trim(),
        kelurahan_nama: data.kelurahan.trim() || null,
        alamat_detail:  data.alamat.trim(),
        message:        data.message?.trim() || null,
        status:         "pending"    as const,
        source_platform: "ig_landing" as const,
      });

    if (error) throw new Error(error.message);
    return { error: null };
  } catch (err) {
    console.error("[partnership.ts] insertPartnerApplication:", err);
    return { error: err instanceof Error ? err : new Error("Unknown error") };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getPackages
// ─────────────────────────────────────────────────────────────────────────────

export async function getPackages() {
  try {
    const { data, error } = await getSupabase()
      .from("packages")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      console.error("[partnership.ts] getPackages:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[partnership.ts] getPackages exception:", err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getProducts / getFeaturedProducts
// ─────────────────────────────────────────────────────────────────────────────

export async function getProducts() {
  try {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*, product_variants(*)")
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      console.error("[partnership.ts] getProducts:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[partnership.ts] getProducts exception:", err);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*, product_variants(*)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order");

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LOKASI DROPDOWN — fetch dari Supabase ref_ tables
// Dipakai oleh Step3Location di IgPartnershipSection
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchKotaList(): Promise<
  { value: string; label: string; aktif: boolean }[]
> {
  try {
    const { data, error } = await getSupabase()
      .from("ref_kota")
      .select("nama, aktif")
      .order("aktif", { ascending: false })
      .order("nama");

    if (error) {
      console.error("[partnership.ts] fetchKotaList:", error.message);
      return [];
    }
    return (data ?? []).map((r) => ({
      value: r.nama,
      label: r.nama,
      aktif: r.aktif,
    }));
  } catch (err) {
    console.error("[partnership.ts] fetchKotaList exception:", err);
    return [];
  }
}

export async function fetchKecamatanByKota(
  kotaNama: string,
): Promise<{ value: string; label: string }[]> {
  if (!kotaNama || kotaNama === "lain" || kotaNama === "Kota / Kab. Lain")
    return [];
  try {
    const { data, error } = await getSupabase()
      .from("ref_kecamatan")
      .select("nama, ref_kota!inner(nama)")
      .eq("ref_kota.nama", kotaNama)
      .order("nama");

    if (error) {
      console.error("[partnership.ts] fetchKecamatanByKota:", error.message);
      return [];
    }
    return (data ?? []).map((r) => ({ value: r.nama, label: r.nama }));
  } catch (err) {
    console.error("[partnership.ts] fetchKecamatanByKota exception:", err);
    return [];
  }
}

export async function fetchKelurahanByKecamatan(
  kecamatanNama: string,
  kotaNama: string,
): Promise<{ value: string; label: string }[]> {
  if (!kecamatanNama || !kotaNama) return [];
  try {
    const { data, error } = await getSupabase()
      .from("ref_kelurahan")
      .select("nama, ref_kecamatan!inner(nama, ref_kota!inner(nama))")
      .eq("ref_kecamatan.nama", kecamatanNama)
      .eq("ref_kecamatan.ref_kota.nama", kotaNama)
      .order("nama");

    if (error) {
      console.error("[partnership.ts] fetchKelurahanByKecamatan:", error.message);
      return [];
    }
    return (data ?? []).map((r) => ({ value: r.nama, label: r.nama }));
  } catch (err) {
    console.error("[partnership.ts] fetchKelurahanByKecamatan exception:", err);
    return [];
  }
}
