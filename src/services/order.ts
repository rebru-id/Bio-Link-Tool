// src/services/order.ts  [rebru.vercel.app/ig — Biolink IG]
// ─────────────────────────────────────────────────────────────────────────────
// Order service — identik dengan website Rebru kecuali sumber whatsappNumber
//
// Perbedaan dari website:
//   Website  → import { CONFIG } from "@/constants/config"
//   Biolink  → nomor WA langsung di sini (config.ts belum ada di project ini)
//
// Pendekatan ini sama dengan partnership.ts di biolink yang sudah pakai
// pattern env var + hardcoded fallback untuk konsistensi.
//
// Sprint 4: kalau config.ts dibuat di biolink, ganti WHATSAPP_NUMBER dengan:
//   import { CONFIG } from "@/constants/config"
//   const phone = CONFIG.whatsappNumber
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/products";

// ─────────────────────────────────────────────────────────────────────────────
// Konstanta — nomor WA admin Rebru
// Format: country code + nomor tanpa leading 0
// Sama dengan yang dipakai di IgCtaSection.tsx
// ─────────────────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6285237390994";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface CartItem {
  name: string;
  variant?: string;
  price: number;
  qty: number;
  subtotal: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// buildCartMessage
// Membangun pesan WhatsApp dari isi cart
// Identik dengan website — single source of truth untuk format pesan
// ─────────────────────────────────────────────────────────────────────────────

export function buildCartMessage(items: CartItem[], total: number): string {
  let msg = `Halo Rebru! Saya ingin memesan:\n\n`;

  items.forEach((item, i) => {
    msg += `${i + 1}. *${item.name}*`;

    if (item.variant) {
      msg += ` (${item.variant})`;
    }

    msg += `\n   ${item.qty} × ${formatCurrency(item.price)}`;
    msg += ` = ${formatCurrency(item.subtotal)}\n\n`;
  });

  msg += `💰 *TOTAL: ${formatCurrency(total)}*\n\n`;
  msg += `Mohon konfirmasi ketersediaan & ongkir. Terima kasih 🌱`;

  return msg;
}

// ─────────────────────────────────────────────────────────────────────────────
// buildWhatsAppOrderURL
// Membangun URL wa.me dengan pesan yang sudah di-encode
// encodeURIComponent memastikan karakter khusus aman di URL
// ─────────────────────────────────────────────────────────────────────────────

export function buildWhatsAppOrderURL(message: string): string {
  if (!WHATSAPP_NUMBER) {
    throw new Error(
      "WhatsApp number tidak tersedia. " +
      "Set NEXT_PUBLIC_WHATSAPP_NUMBER di .env.local"
    );
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
