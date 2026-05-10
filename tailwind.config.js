/** @type {import('tailwindcss').Config} */
// tailwind.config.js — Bio-link (bio.rebru.id)
// ─────────────────────────────────────────────────────────────────────────────
// Diupdate untuk sinkron dengan Website (rebru.id):
// - Font family aliases (display, mono, sans) — sama persis
// - rounded-pill — sama persis
// - Animasi dari globals.css bio-link tetap berfungsi
// - Warna sistem via CSS variables — tidak perlu hardcode di sini
//
// Note: Bio-link TIDAK memerlukan:
//   - darkMode toggle (selalu dark, hardcoded)
//   - CVA safelist (tidak pakai CVA)
//   - Cormorant/DM Sans/Space Mono via next/font (pakai CSS var dari globals)
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        mono:    ["var(--font-mono)", "monospace"],
        sans:    ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
      },
      transitionDuration: {
        "400": "400ms",
      },
      // Warna dikonsumsi dari CSS variables di globals.css
      // Didefinisikan di sini agar bisa dipakai sebagai Tailwind class
      // bila diperlukan, misal: text-coffee-latte, bg-forest-sage
      colors: {
        "coffee-latte":  "var(--coffee-latte)",
        "forest-sage":   "var(--forest-sage)",
        "text-primary":  "var(--text-primary)",
        "text-secondary":"var(--text-secondary)",
        "text-muted":    "var(--text-muted)",
        "bg-primary":    "var(--bg-primary)",
        "bg-surface":    "var(--bg-surface)",
        "bg-card":       "var(--bg-card)",
        "bg-elevated":   "var(--bg-elevated)",
      },
    },
  },
  plugins: [],
};
