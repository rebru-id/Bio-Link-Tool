// src/services/partnership.ts
// ─────────────────────────────────────────────────────────────────────────────
// REBRU IG Landing — Partnership Service Layer (Sprint 4 — SUPABASE LIVE)
//
// Perubahan dari versi mock sebelumnya:
//   - Mapping field bio-link → kolom Supabase (resolusi konflik nama kolom)
//   - source_platform = 'ig_landing' otomatis
//   - Lokasi dikirim sebagai text (slug → label), bukan UUID FK
//
// Relasi ke website Rebru:
//   Rebru website  → src/lib/supabase-contact.ts → partner_applications
//   IG landing     → src/services/partnership.ts  → partner_applications (tabel SAMA)
//   Admin dashboard membaca semua submission, filter by source_platform
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── Supabase client — lazy singleton ─────────────────────────────────────────
// PENTING: createClient() TIDAK boleh dipanggil di module level.
// Di Next.js 14, env vars hanya terjamin terbaca saat runtime (dalam fungsi).
// Lazy singleton: client dibuat saat fungsi pertama dipanggil — env sudah tersedia.
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error(
      "[partnership.ts] ENV TIDAK TERBACA. Cek .env.local dan restart dev server.",
    );
    throw new Error("Supabase env vars not found");
  }
  _supabase = createClient(url, key);
  return _supabase;
}

// ── Types ────────────────────────────────────────────────────────────────────

// Payload seperti yang dikirim oleh IgPartnershipSection (FormData bio-link)
export interface PartnerApplicationPayload {
  // Nama field sesuai FormData di IgPartnershipSection.tsx
  name: string; // = pic_name di schema SQL
  organization: string;
  phone: string;
  email: string;
  jenis_usaha: string;
  volume_limbah: string;
  city: string; // = kota_nama di schema SQL (slug → label)
  kotaCustom?: string; // = kota_custom (jika city === 'lain')
  kecamatan: string; // = kecamatan_nama di schema SQL
  kelurahan: string; // = kelurahan_nama di schema SQL
  alamat: string; // = alamat_detail di schema SQL
  type: "kontributor" | "dampak" | "strategis"; // = package_type di schema SQL
  message?: string;
}

export interface ServiceResult {
  error: Error | null;
}

// ── Helper: slug → label untuk lokasi ────────────────────────────────────────
// location-data.ts menyimpan value sebagai slug (e.g. "makassar"),
// label sebagai nama tampil (e.g. "Makassar").
// Untuk simplisitas, kita kirim label ke DB agar admin bisa baca langsung.
// Jika slug dan label sama, langsung pakai city.

import {
  getKotaList,
  getKecamatanByKota,
  getKelurahanByKecamatan,
} from "@/lib/location-data";

function resolveKotaLabel(citySlug: string): string {
  if (citySlug === "lain") return "Lainnya";
  const kota = getKotaList().find((k) => k.value === citySlug);
  return kota?.label ?? citySlug;
}

function resolveKecamatanLabel(kecSlug: string, kotaSlug: string): string {
  const list = getKecamatanByKota(kotaSlug);
  const kec = list.find((k) => k.value === kecSlug);
  return kec?.label ?? kecSlug;
}

function resolveKelurahanLabel(kelSlug: string, kecSlug: string): string {
  const list = getKelurahanByKecamatan(kecSlug);
  const kel = list.find((k) => k.value === kelSlug);
  return kel?.label ?? kelSlug;
}

// ── insertPartnerApplication ─────────────────────────────────────────────────
// Mapping FormData bio-link → kolom partner_applications di Supabase

export async function insertPartnerApplication(
  data: PartnerApplicationPayload,
): Promise<ServiceResult> {
  try {
    // Resolve slug → human-readable label
    const kotaLabel = resolveKotaLabel(data.city);
    const kecamatanLabel =
      data.city !== "lain"
        ? resolveKecamatanLabel(data.kecamatan, data.city)
        : data.kecamatan; // manual input jika kota = "lain"
    const kelurahanLabel =
      data.city !== "lain"
        ? resolveKelurahanLabel(data.kelurahan, data.kecamatan)
        : data.kelurahan;

    // Build payload dengan nama kolom sesuai schema SQL (Sprint 4 patch)
    const payload = {
      pic_name: data.name.trim(),
      organization: data.organization.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      package_type: data.type, // 'type' → 'package_type'
      jenis_usaha: data.jenis_usaha,
      volume_limbah: data.volume_limbah,
      kota_nama:
        data.city === "lain" // slug → label
          ? (data.kotaCustom?.trim() ?? "Lainnya")
          : kotaLabel,
      kota_custom:
        data.city === "lain" ? (data.kotaCustom?.trim() ?? null) : null,
      kecamatan_nama: kecamatanLabel,
      kelurahan_nama: kelurahanLabel,
      alamat_detail: data.alamat.trim(), // 'alamat' → 'alamat_detail'
      message: data.message?.trim() || null,
      status: "pending" as const,
      source_platform: "ig_landing" as const, // pembeda dari website
    };

    const { error } = await getSupabase()
      .from("partner_applications")
      .insert(payload);

    if (error) throw new Error(error.message);
    return { error: null };
  } catch (err) {
    console.error("[partnership.ts] insert error:", err);
    return { error: err instanceof Error ? err : new Error("Unknown error") };
  }
}

// ── getPackages ──────────────────────────────────────────────────────────────
// Sprint 4: pengganti PACKAGES static dari packages.ts
// Konsumsi di IgPartnershipSection setelah Sprint 4:
//   const packages = await getPackages();

export async function getPackages() {
  const { data, error } = await getSupabase()
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("[partnership.ts] getPackages error:", error.message);
    return [];
  }
  return data;
}

// ── getProducts ──────────────────────────────────────────────────────────────
// Sprint 4: pengganti getAllProducts() dari products.ts
// Konsumsi di IgProductsSection setelah Sprint 4:
//   const products = await getProducts();

export async function getProducts() {
  const { data, error } = await getSupabase()
    .from("products")
    .select("*, product_variants(*)")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("[partnership.ts] getProducts error:", error.message);
    return [];
  }
  return data;
}

export async function getFeaturedProducts() {
  const { data, error } = await getSupabase()
    .from("products")
    .select("*, product_variants(*)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order");

  if (error) return [];
  return data;
}
