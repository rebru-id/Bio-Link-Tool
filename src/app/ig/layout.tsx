// src/app/ig/layout.tsx  [rebru.vercel.app/ig — Biolink IG]
// ─────────────────────────────────────────────────────────────────────────────
// Layout untuk seluruh halaman /ig
//
// CartProvider + ToastProvider disediakan di sini agar semua komponen
// di bawahnya (IgProductsSection, dll) bisa menggunakan useCart() dan useToast()
//
// IgFloatingCartBar — pill bar khusus mobile, berbeda dari FloatingCartButton
// website yang berupa circle button. Muncul di seluruh halaman /ig saat
// ada item di cart, tidak terikat ke section tertentu.
// ─────────────────────────────────────────────────────────────────────────────

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import CartDrawer from "@/components/cart/CartDrawer";
import IgFloatingCartBar from "@/components/cart/IgFloatingCartBar";

export default function IgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <CartProvider>
        {children}

        {/* Floating pill bar — muncul di seluruh /ig saat ada item di cart */}
        <IgFloatingCartBar />

        {/* CartDrawer — terbuka saat user tap tombol Checkout di pill bar */}
        <CartDrawer />
      </CartProvider>
    </ToastProvider>
  );
}
