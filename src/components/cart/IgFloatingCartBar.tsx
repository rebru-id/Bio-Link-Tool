// src/components/cart/IgFloatingCartBar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Floating Pill Bar — khusus untuk biolink IG (/ig)
//
// Berbeda dari FloatingCartButton (website) yang berupa circle button,
// komponen ini adalah pill bar horizontal di bagian bawah layar —
// lebih informatif dan thumb-friendly untuk konteks mobile-first.
//
// Behavior:
//   - Tersembunyi saat cart kosong (translateY ke bawah + opacity 0)
//   - Slide-up saat item pertama ditambahkan
//   - Scale pulse + label "+N baru" saat item baru ditambahkan
//   - Klik tombol Checkout → buka CartDrawer
//   - Tidak terikat pathname — muncul di seluruh halaman /ig
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";

// ─────────────────────────────────────────────────────────────────────────────
// Helper — format currency IDR ringkas untuk pill bar
// Contoh: 135000 → "Rp 135.000"
// ─────────────────────────────────────────────────────────────────────────────

function formatRp(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// ─────────────────────────────────────────────────────────────────────────────
// IgFloatingCartBar
// ─────────────────────────────────────────────────────────────────────────────

export default function IgFloatingCartBar() {
  const { openCart, totalItems, grandTotal } = useCart();

  // ── Pulse state ──
  // Aktif saat item baru ditambahkan — scale + label "+N baru"
  const [isPulsing, setIsPulsing]   = useState(false);
  const [addedCount, setAddedCount] = useState(0);
  const prevTotalRef                = useRef(totalItems);
  const pulseTimerRef               = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labelTimerRef               = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const diff = totalItems - prevTotalRef.current;

    if (diff > 0) {
      // Bersihkan timer sebelumnya (rapid add)
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      if (labelTimerRef.current) clearTimeout(labelTimerRef.current);

      setAddedCount(diff);
      setIsPulsing(true);

      // Pulse selesai setelah 400ms
      pulseTimerRef.current = setTimeout(() => {
        setIsPulsing(false);
      }, 400);

      // Label "+N baru" kembali normal setelah 1500ms
      labelTimerRef.current = setTimeout(() => {
        setAddedCount(0);
      }, 1500);
    }

    prevTotalRef.current = totalItems;

    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
    };
  }, [totalItems]);

  const isVisible = totalItems > 0;

  return (
    <div
      aria-live="polite"
      aria-label={
        isVisible
          ? `Keranjang: ${totalItems} item, total ${formatRp(grandTotal)}`
          : undefined
      }
      style={{
        // ── Posisi ──
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: isVisible
          ? isPulsing
            ? "translateX(-50%) translateY(0) scale(1.03)"
            : "translateX(-50%) translateY(0) scale(1)"
          : "translateX(-50%) translateY(80px) scale(0.96)",
        zIndex: 50,

        // ── Ukuran ──
        width: "calc(100% - 32px)",
        maxWidth: "420px",

        // ── Visibilitas ──
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",

        // ── Transisi ──
        transition: isPulsing
          ? "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, box-shadow 0.2s ease"
          : "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, box-shadow 0.3s ease",

        // ── Visual ──
        background: "#140e07",
        border: isPulsing
          ? "1px solid rgba(196,149,106,0.6)"
          : "1px solid rgba(196,149,106,0.3)",
        borderRadius: "9999px",
        boxShadow: isPulsing
          ? "0 0 0 4px rgba(196,149,106,0.1), 0 8px 32px rgba(0,0,0,0.5)"
          : "0 8px 32px rgba(0,0,0,0.45)",
        padding: "10px 12px 10px 12px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {/* ── Kiri: icon + badge ── */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: isPulsing
              ? "rgba(196,149,106,0.22)"
              : "rgba(196,149,106,0.12)",
            border: "1px solid rgba(196,149,106,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s ease",
          }}
        >
          <i
            className="fas fa-shopping-basket"
            style={{ fontSize: "0.88rem", color: "var(--coffee-latte, #c4956a)" }}
          />
        </div>

        {/* Badge jumlah item */}
        <div
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            minWidth: 17,
            height: 17,
            borderRadius: "9999px",
            background: "var(--coffee-latte, #c4956a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            fontSize: "9px",
            fontWeight: 700,
            color: "#1a0f0a",
            fontFamily: "monospace",
            transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            transform: isPulsing ? "scale(1.2)" : "scale(1)",
          }}
        >
          {totalItems > 9 ? "9+" : totalItems}
        </div>
      </div>

      {/* ── Tengah: info item + harga ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Label — berubah saat ada item baru */}
        <p
          style={{
            fontSize: "10px",
            color: addedCount > 0
              ? "rgba(196,149,106,0.9)"
              : "rgba(196,149,106,0.6)",
            margin: 0,
            fontFamily: "monospace",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "color 0.2s ease",
            lineHeight: 1.2,
          }}
        >
          {addedCount > 0
            ? `${totalItems} item · +${addedCount} baru`
            : `${totalItems} item`}
        </p>

        {/* Total harga */}
        <p
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--coffee-latte, #c4956a)",
            margin: 0,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            lineHeight: 1.2,
            transition: "color 0.2s ease",
          }}
        >
          {formatRp(grandTotal)}
        </p>
      </div>

      {/* ── Kanan: tombol Checkout ── */}
      <button
        onClick={openCart}
        aria-label="Buka keranjang dan checkout"
        style={{
          background: "linear-gradient(135deg, #1a3a1b, #0d1f0e)",
          border: "1px solid rgba(74,124,78,0.4)",
          borderRadius: "9999px",
          padding: "9px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          cursor: "pointer",
          transition: "all 0.2s ease",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,124,78,0.7)";
          (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #1f4520, #112610)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,124,78,0.4)";
          (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #1a3a1b, #0d1f0e)";
        }}
        onTouchStart={(e) => {
          // Feedback haptic di mobile
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)";
        }}
        onTouchEnd={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        <i
          className="fab fa-whatsapp"
          style={{ fontSize: "0.85rem", color: "#7aab7e" }}
        />
        <span
          style={{
            fontSize: "11px",
            color: "#e8f5e9",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Checkout
        </span>
      </button>
    </div>
  );
}
