// src/app/ig/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Sprint 4A: Page menjadi async server component
//
// PERUBAHAN dari versi sebelumnya (ig-page-patched.tsx):
//   - export default async function (sebelumnya: sync)
//   - buildJsonLd() sekarang async + await getAllProducts()
//   - Fetch featured + catalog di sini, pass ke IgProductsSection sebagai props
//   - JSON-LD pakai product.slug langsung (bukan slugify)
//   - IgProductsSection menerima featuredProducts + catalogProducts props
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

import { getAllProducts, getFeaturedProducts, getCatalogProducts } from "@/lib/products";

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Rebru — Turning Coffee Waste into Scalable Climate Impact",
  description:
    "Dari ampas kopi menjadi produk circular, dampak ESG terukur, dan sistem yang transparan. Bergabunglah bersama Rebru.",
  openGraph: {
    title: "Rebru — Coffee Waste to Climate Impact",
    description: "From cafés to circular products to measurable ESG data.",
    url: "https://bio.rebru.id/",
    siteName: "Rebru",
    locale: "id_ID",
    type: "website",
  },
};

// ── JSON-LD — async, pakai product.slug langsung ──────────────────────────────
async function buildJsonLd() {
  const products = await getAllProducts();
  const baseUrl  = "https://rebru.id";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Rebru Products",
    description: "Circular economy products made from spent coffee grounds",
    url: "https://bio.rebru.id",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        "@id": `${baseUrl}/products/${product.slug}`,
        name: product.name,
        description: product.tagline,
        url: `${baseUrl}/products/${product.slug}`,
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

// ── Page — async server component ─────────────────────────────────────────────
export default async function IgLandingPage() {
  // Fetch paralel — semua data sekaligus, tidak tunggu bergantian
  const [featured, catalog, jsonLd] = await Promise.all([
    getFeaturedProducts(),
    getCatalogProducts(),
    buildJsonLd(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SectionNavDots />
      <ScrollToTop />

      <main>
        <IgHeroSection />
        <IgProblemSection />
        <IgSystemSection />
        <IgRoleGateSection />

        {/* Sprint 4A: data di-pass sebagai props dari page (server) */}
        <IgProductsSection
          featuredProducts={featured}
          catalogProducts={catalog}
        />

        <IgImpactSection />
        <IgPartnershipSection />
        <IgCtaSection />
      </main>

      <IgFooter />
    </>
  );
}
