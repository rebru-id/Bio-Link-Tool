// src/app/layout.tsx — Bio-link Root Layout
// ─────────────────────────────────────────────────────────────────────────────
// Diupdate:
// - Tambah Google Fonts via next/font (Cormorant Garamond, DM Sans, DM Mono)
//   agar konsisten dengan CSS variable --font-display, --font-sans, --font-mono
//   yang dipakai oleh globals.css dan semua komponen
// - Font variables diinject ke <html> agar CSS vars bisa diresolvasi
// - Tidak ada ThemeProvider — bio-link selalu dark (hardcoded di globals.css)
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

// ── Font Definitions ──────────────────────────────────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",   // sesuai var di globals.css
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",      // sesuai var di globals.css
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",      // sesuai var di globals.css
  display: "swap",
});

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Rebru — Turning Coffee Waste into Scalable Climate Impact",
  description:
    "Dari ampas kopi menjadi produk circular, dampak ESG terukur, dan sistem yang transparan. Bergabunglah bersama Rebru.",
};

// ── Layout ────────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
