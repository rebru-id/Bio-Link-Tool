// src/types/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Barrel export — single entry point untuk semua tipe di folder ini.
//
// Kenapa file ini dibutuhkan:
//   CartContext.tsx mengimport dari "@/types" (bukan "@/types/cart").
//   Next.js + TypeScript meresolvasi "@/types" ke salah satu dari:
//     1. src/types.ts        → tidak ada
//     2. src/types/index.ts  → FILE INI ← yang dibutuhkan
//   Tanpa index.ts, build gagal dengan "Cannot find module '@/types'".
//
// Pattern ini disebut "barrel export" — standar di project TypeScript skala
// besar agar consumer tidak perlu tahu struktur internal folder types/.
//
// Cara menambah tipe baru:
//   1. Buat file baru di src/types/, misal: src/types/user.ts
//   2. Tambahkan satu baris di sini:
//      export type { User, UserRole } from "./user";
// ─────────────────────────────────────────────────────────────────────────────

// Cart system — CartItem dipakai oleh CartContext, CartDrawer, order service
export type { CartItem } from "./cart";

// Product system — UIProduct, variant, specs, impact untuk halaman produk
export type {
  UIProduct,
  ProductVariant,
  ProductSpecs,
  ProductImpact,
} from "./product";
