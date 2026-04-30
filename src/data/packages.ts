// src/data/packages.ts
// ─────────────────────────────────────────────────────────────────────────────
// REBRU — Paket Kemitraan (Single Source of Truth)
//
// FILE INI IDENTIK dengan src/data/packages.ts di Rebru website.
// Tujuan: kedua platform (IG landing + website) menggunakan definisi paket
// yang sama sehingga perubahan harga / fitur cukup dilakukan di satu tempat.
//
// Dikonsumsi oleh:
//   - src/components/sections/IgPartnershipSection.tsx  (tier display + form)
//
// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE-READY (Sprint 4 — saat DB live):
//
// Ganti export PACKAGES dengan fungsi async:
//   export async function getPackages(): Promise<Package[]> {
//     const { data } = await supabase
//       .from("packages")
//       .select("*")
//       .eq("is_active", true)
//       .order("sort_order");
//     return data ?? [];
//   }
//
// Setelah itu, kedua platform (IG + website) otomatis sinkron karena
// fetch dari database yang sama — tidak perlu update file ini lagi.
// ─────────────────────────────────────────────────────────────────────────────

export interface Package {
  id: string;
  tier: string;
  badge: string;
  badgeColor: string;
  tagline: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  featured: boolean;
  premium: boolean;
  features: string[];
}

// Identik 100% dengan Rebru website — jangan ubah tanpa sinkronisasi
export const PACKAGES: Package[] = [
  {
    id: "kontributor",
    tier: "Mitra Kontributor",
    badge: "FREE",
    badgeColor: "var(--gold, #c8a84b)",
    tagline: "Kontribusi lingkungan yang mudah dan tanpa biaya",
    accent: "#c8a84b",
    accentBg: "rgba(200,168,75,0.08)",
    accentBorder: "rgba(200,168,75,0.22)",
    featured: false,
    premium: false,
    features: [
      "Pengantaran ampas kopi mandiri ke titik drop-off Rebru",
      "Pengelolaan dan pemanfaatan ampas kopi oleh Rebru",
      "Terdaftar sebagai Mitra Kontributor Rebru",
      "Pencatatan partisipasi dan ringkasan dampak berkala",
    ],
  },
  {
    id: "dampak",
    tier: "Mitra Dampak",
    badge: "IDR 250K / bulan",
    badgeColor: "var(--forest-sage, #7aab7e)",
    tagline: "Kemudahan operasional + bukti dampak + eksposur brand",
    accent: "#7aab7e",
    accentBg: "rgba(122,171,126,0.08)",
    accentBorder: "rgba(122,171,126,0.25)",
    featured: true,
    premium: false,
    features: [
      "Penjemputan ampas kopi terjadwal oleh tim Rebru",
      "Pengelolaan ampas kopi end-to-end oleh Rebru",
      "Ringkasan dampak bulanan (volume + estimasi lingkungan)",
      "Visibilitas brand dalam ekosistem Rebru",
      "Identitas digital sebagai Mitra Dampak Rebru",
    ],
  },
  {
    id: "strategis",
    tier: "Mitra Strategis",
    badge: "IDR 500K / bulan",
    badgeColor: "var(--coffee-latte, #c4956a)",
    tagline: "Kemitraan strategis, data dampak, dan aktivasi brand berkelanjutan",
    accent: "#c4956a",
    accentBg: "rgba(196,149,106,0.08)",
    accentBorder: "rgba(196,149,106,0.25)",
    featured: false,
    premium: true,
    features: [
      "Penjemputan dengan frekuensi lebih tinggi",
      "Pengelolaan operasional prioritas",
      "Ringkasan dampak teragregasi dan mendalam",
      "Visibilitas brand premium dalam ekosistem Rebru",
      "Kolaborasi strategis (upcycling campaign, community activation, co-creating program)",
      "Akses login ke Dashboard Rebru untuk monitoring dampak",
    ],
  },
];

export function getPackageById(id: string): Package | undefined {
  return PACKAGES.find((p) => p.id === id);
}
