// src/app/ig/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// PATCH: Import slugify dipindah dari "@/lib/products" ke "@/utils"
//
// Alasan:
//   Website's lib/products.ts mengimport slugify dari @/utils secara internal
//   dan TIDAK mengekspornya. Setelah sync, bio-link's products.ts menggunakan
//   versi Website — sehingga `import { slugify } from "@/lib/products"` broken.
//
//   Solusi: import langsung dari @/utils (sumber canonicalnya).
//   Output slugify identik — terkonfirmasi via unit test untuk semua 9 produk.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";

import IgHeroSection        from "@/components/sections/IgHeroSection";
import IgProblemSection     from "@/components/sections/IgProblemSection";
import IgSystemSection      from "@/components/sections/IgSystemSection";
import IgRoleGateSection    from "@/components/sections/IgRoleGateSection";
import IgProductsSection    from "@/components/sections/IgProductsSection";
import IgImpactSection      from "@/components/sections/IgImpactSection";
import IgPartnershipSection from "@/components/sections/IgPartnershipSection";
import IgCtaSection         from "@/components/sections/IgCtaSection";
import IgFooter             from "@/components/layout/IgFooter";
import SectionNavDots       from "@/components/ui/SectionNavDots";
import ScrollToTop          from "@/components/ui/ScrollToTop";

// ── PATCH: Pisahkan import — slugify sekarang dari @/utils ──────────────────
import { getAllProducts }   from "@/lib/products";
import { slugify }         from "@/utils";
// ── SEBELUMNYA (hapus baris ini jika masih ada): ────────────────────────────
// import { getAllProducts, slugify } from "@/lib/products";   ← JANGAN dipakai
// ────────────────────────────────────────────────────────────────────────────

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Rebru — Turning Coffee Waste into Scalable Climate Impact",
  description:
    "Dari ampas kopi menjadi produk circular, dampak ESG terukur, dan sistem yang transparan. Bergabunglah bersama Rebru.",
  openGraph: {
    title: "Rebru — Coffee Waste to Climate Impact",
    description: "From cafés to circular products to measurable ESG data.",
    url: "https://rebru.vercel.app/",
    siteName: "Rebru",
    locale: "id_ID",
    type: "website",
  },
};

// ── JSON-LD ───────────────────────────────────────────────────────────────────
function buildJsonLd() {
  const products  = getAllProducts();
  const baseUrl   = "https://rebru.vercel.app";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Rebru Products",
    description: "Circular economy products made from spent coffee grounds",
    url: `${baseUrl}/ig`,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        "@id": `${baseUrl}/products/${slugify(product.name)}`,
        name: product.name,
        description: product.tagline,
        url: `${baseUrl}/products/${slugify(product.name)}`,
        brand: { "@type": "Brand", name: "Rebru" },
        offers:
          product.variants.length > 0
            ? product.variants.map((v) => ({
                "@type": "Offer",
                name: v.label,
                price: v.price,
                priceCurrency: "IDR",
                availability: "https://schema.org/InStock",
              }))
            : {
                "@type": "Offer",
                availability: "https://schema.org/PreOrder",
                priceCurrency: "IDR",
              },
      },
    })),
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function IgLandingPage() {
  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      {/* Fixed UI */}
      <SectionNavDots />
      <ScrollToTop />

      {/* Page sections */}
      <main>
        <IgHeroSection />
        <IgProblemSection />
        <IgSystemSection />
        <IgRoleGateSection />
        <IgProductsSection />
        <IgImpactSection />
        <IgPartnershipSection />
        <IgCtaSection />
      </main>

      <IgFooter />
    </>
  );
}
