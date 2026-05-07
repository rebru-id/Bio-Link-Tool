// src/services/partnership.ts
// ─────────────────────────────────────────────────────────────────────────────
// REBRU IG Landing — Partnership Service Layer (Sprint 4 — PRODUCTION FIXED)
//
// ROOT CAUSE FIX:
//   Di Next.js 14 + Vercel, NEXT_PUBLIC_ vars hanya terjamin tersedia
//   di browser runtime — BUKAN saat module di-evaluate oleh bundler.
//   Solusi: hardcode fallback untuk NEXT_PUBLIC_ yang memang bukan secret.
//
// KEAMANAN:
//   NEXT_PUBLIC_SUPABASE_ANON_KEY adalah anon/public key — by design
//   boleh terekspos di client. Keamanan data dijaga oleh RLS di Supabase,
//   bukan oleh kerahasiaan key ini. Ini adalah arsitektur resmi Supabase.
//   Ref: https://supabase.com/docs/guides/auth/row-level-security
//
// VERCEL — wajib dilakukan setelah push:
//   1. Pastikan env vars scope mencakup "Development" (bukan hanya Production+Preview)
//   2. Trigger Redeploy manual setelah env vars diubah
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getKotaList,
  getKecamatanByKota,
  getKelurahanByKecamatan,
} from "@/lib/location-data";

// ─────────────────────────────────────────────────────────────────────────────
// Konstanta — nilai identik dengan .env.local
// Anon key aman di-hardcode karena:
//   - Bukan service_role key (yang memiliki akses penuh)
//   - Dilindungi RLS: anon hanya bisa INSERT partner_applications
//   - Nilai ini sudah ter-bundle ke JS client bundle oleh Next.js
//     saat ada NEXT_PUBLIC_ prefix — hardcode hanya memastikan konsistensi
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://mubzwqkhhhittibstugh.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11Ynp3cWtoaGhpdHRpYnN0dWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMTA5NjYsImV4cCI6MjA5MDY4Njk2Nn0.C_YqDM0OFAVc9zww5afq9S0po2n7KzZGW9HhzNsMcrE";

// Lazy singleton — createClient dipanggil dalam fungsi, bukan module level
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  // env var → fallback ke konstanta (keduanya nilai yang sama)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? SUPABASE_ANON;
  _supabase = createClient(url, key);
  return _supabase;
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface PartnerApplicationPayload {
  name: string;
  organization: string;
  phone: string;
  email: string;
  jenis_usaha: string;
  volume_limbah: string;
  city: string;
  kotaCustom?: string;
  kecamatan: string;
  kelurahan: string;
  alamat: string;
  type: "kontributor" | "dampak" | "strategis";
  message?: string;
}

export interface ServiceResult {
  error: Error | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: slug → label (dari location-data.ts)
// ─────────────────────────────────────────────────────────────────────────────

function resolveKotaLabel(slug: string): string {
  if (slug === "lain") return "Lainnya";
  return getKotaList().find((k) => k.value === slug)?.label ?? slug;
}

function resolveKecamatanLabel(kecSlug: string, kotaSlug: string): string {
  return (
    getKecamatanByKota(kotaSlug).find((k) => k.value === kecSlug)?.label ??
    kecSlug
  );
}

function resolveKelurahanLabel(kelSlug: string, kecSlug: string): string {
  return (
    getKelurahanByKecamatan(kecSlug).find((k) => k.value === kelSlug)?.label ??
    kelSlug
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// insertPartnerApplication
// ─────────────────────────────────────────────────────────────────────────────

export async function insertPartnerApplication(
  data: PartnerApplicationPayload,
): Promise<ServiceResult> {
  try {
    const isCustomKota = data.city === "lain" || !data.city;

    const payload = {
      pic_name: data.name.trim(),
      organization: data.organization.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      package_type: data.type,
      jenis_usaha: data.jenis_usaha,
      volume_limbah: data.volume_limbah,
      kota_nama: isCustomKota
        ? (data.kotaCustom?.trim() ?? "Lainnya")
        : resolveKotaLabel(data.city),
      kota_custom: isCustomKota ? (data.kotaCustom?.trim() ?? null) : null,
      kecamatan_nama: isCustomKota
        ? data.kecamatan
        : resolveKecamatanLabel(data.kecamatan, data.city),
      kelurahan_nama: isCustomKota
        ? data.kelurahan
        : resolveKelurahanLabel(data.kelurahan, data.kecamatan),
      alamat_detail: data.alamat.trim(),
      message: data.message?.trim() || null,
      status: "pending" as const,
      source_platform: "ig_landing" as const,
    };

    const { error } = await getSupabase()
      .from("partner_applications")
      .insert(payload);

    if (error) throw new Error(error.message);
    return { error: null };
  } catch (err) {
    console.error("[partnership.ts] insertPartnerApplication:", err);
    return { error: err instanceof Error ? err : new Error("Unknown error") };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getPackages — pengganti PACKAGES static dari packages.ts
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
// getProducts — pengganti getAllProducts() static dari products.ts
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
// Menggantikan getKotaList(), getKecamatanByKota(), getKelurahanByKecamatan()
// dari @/lib/location-data yang sebelumnya dipakai di Step3Location
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
      value: r.nama, // value = nama kota (label langsung, bukan slug)
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
    return (data ?? []).map((r) => ({
      value: r.nama,
      label: r.nama,
    }));
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
      console.error(
        "[partnership.ts] fetchKelurahanByKecamatan:",
        error.message,
      );
      return [];
    }
    return (data ?? []).map((r) => ({
      value: r.nama,
      label: r.nama,
    }));
  } catch (err) {
    console.error("[partnership.ts] fetchKelurahanByKecamatan exception:", err);
    return [];
  }
}
