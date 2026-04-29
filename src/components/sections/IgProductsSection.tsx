// file: src/components/sections/IgProductsSection.tsx
"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import {
  getAllProducts,
  getFeaturedProducts,
  getCatalogByCategory,
  formatCurrency,
} from "@/lib/products";
import type { UIProduct } from "@/types/product";

// ─── Sprint 4: ganti dengan async fetch dari Supabase ─────────────────────
const ALL = getAllProducts();
const FEATURED = getFeaturedProducts();

const TABS = [
  { key: "all", label: "All" },
  { key: "soil-amendment", label: "Soil" },
  { key: "energy", label: "Energy" },
  { key: "ecogoods", label: "EcoGoods" },
  { key: "raw-materials", label: "R&D" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ── Product detail drawer ──────────────────────────────────────────────────
function ProductDrawer({
  product,
  onClose,
}: {
  product: UIProduct;
  onClose: () => void;
}) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0] ?? null,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full rounded-t-3xl p-6 max-h-[82vh] overflow-y-auto"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderBottom: "none",
          animation: "fade-up 0.28s ease-out",
        }}
      >
        {/* Drag handle */}
        <div
          className="w-10 h-1 rounded-full mx-auto mb-6"
          style={{ background: "var(--border-strong)" }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            {product.badge && (
              <span
                className="font-mono text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 rounded-pill mb-2 inline-block"
                style={{
                  background:
                    product.badge === "Best Seller"
                      ? "rgba(196,149,106,0.18)"
                      : "rgba(200,168,75,0.15)",
                  color:
                    product.badge === "Best Seller"
                      ? "var(--coffee-latte)"
                      : "#c8a84b",
                }}
              >
                {product.badge}
              </span>
            )}
            <h3
              className="font-display font-semibold text-[1.6rem]"
              style={{ color: "var(--text-primary)" }}
            >
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              color: "var(--text-muted)",
            }}
          >
            <i className="fas fa-times text-xs" />
          </button>
        </div>

        {/* Tagline */}
        <p
          className="text-[0.85rem] leading-[1.75] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          {product.tagline}
        </p>

        {/* Variant selector */}
        {product.variants.length > 0 && (
          <div className="mb-5">
            <p
              className="font-mono text-[0.6rem] tracking-[0.15em] uppercase mb-2.5"
              style={{ color: "var(--text-muted)" }}
            >
              Pilih Varian
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setSelectedVariant(v)}
                  className="px-3.5 py-2 rounded-pill font-mono text-[0.72rem] tracking-[0.06em] transition-all duration-200"
                  style={{
                    border:
                      selectedVariant?.label === v.label
                        ? `1.5px solid ${product.accent}`
                        : "1px solid var(--border-default)",
                    background:
                      selectedVariant?.label === v.label
                        ? `${product.accentBg}`
                        : "transparent",
                    color:
                      selectedVariant?.label === v.label
                        ? product.accent
                        : "var(--text-muted)",
                  }}
                >
                  {v.label}
                  <span className="ml-2 opacity-60">
                    {formatCurrency(v.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        {selectedVariant ? (
          <div className="flex items-baseline gap-2 mb-5">
            <span
              className="font-display font-semibold text-[1.8rem]"
              style={{ color: product.accent }}
            >
              {formatCurrency(selectedVariant.price)}
            </span>
            <span
              className="font-mono text-[0.62rem] tracking-[0.1em] uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              / {product.unit}
            </span>
          </div>
        ) : (
          <p
            className="font-mono text-[0.7rem] tracking-[0.12em] uppercase mb-5"
            style={{ color: product.accent }}
          >
            Harga menyusul · R&D Phase
          </p>
        )}

        {/* Features */}
        {product.specs?.fitur && (
          <div className="mb-5">
            <p
              className="font-mono text-[0.6rem] tracking-[0.15em] uppercase mb-2.5"
              style={{ color: "var(--text-muted)" }}
            >
              Fitur
            </p>
            <ul className="space-y-1.5">
              {product.specs.fitur.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span style={{ color: product.accent }}>✓</span>
                  <span
                    className="text-[0.83rem]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Impact */}
        {product.impact && (
          <div
            className="rounded-xl p-4 mb-5"
            style={{
              background: product.accentBg,
              border: `1px solid ${product.accentBorder}`,
            }}
          >
            <p
              className="font-mono text-[0.58rem] tracking-[0.15em] uppercase mb-1.5"
              style={{ color: product.accent }}
            >
              Environmental Impact
            </p>
            <p
              className="text-[0.83rem]"
              style={{ color: "var(--text-secondary)" }}
            >
              <span
                className="font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {product.impact.stat}
              </span>{" "}
              {product.impact.value}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-3">
          {selectedVariant ? (
            <a
              href="https://wa.me/6285237390994?text=Hi%20Rebru%2C%20saya%20ingin%20memesan%20" /* ganti nomor WA */
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 rounded-pill font-sans font-medium text-[0.88rem] text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: product.accent,
                color: "var(--coffee-dark)",
              }}
            >
              Order via WhatsApp
            </a>
          ) : (
            <button
              disabled
              className="flex-1 py-3.5 rounded-pill font-sans font-medium text-[0.85rem] text-center opacity-40 cursor-not-allowed"
              style={{
                background: "var(--border-default)",
                color: "var(--text-muted)",
              }}
            >
              Coming Soon
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-3.5 rounded-pill transition-all duration-200"
            style={{
              border: "1px solid var(--border-default)",
              color: "var(--text-muted)",
            }}
          >
            <i className="fas fa-times text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Featured card ──────────────────────────────────────────────────────────
function FeaturedCard({
  product,
  inView,
  index,
  onOpen,
}: {
  product: UIProduct;
  inView: boolean;
  index: number;
  onOpen: (p: UIProduct) => void;
}) {
  return (
    <button
      onClick={() => onOpen(product)}
      className={`w-full text-left rounded-2xl overflow-hidden transition-all duration-700 hover:scale-[1.01] active:scale-[0.99] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{
        background: product.accentBg,
        border: `1px solid ${product.accentBorder}`,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {/* Icon area */}
      <div
        className="w-full h-28 flex items-center justify-center relative"
        style={{ borderBottom: `1px solid ${product.accentBorder}` }}
      >
        <i
          className={`fas ${product.icon} text-[2.8rem] opacity-20`}
          style={{ color: product.accent }}
        />
        {product.badge && (
          <span
            className="absolute top-3 right-3 font-mono text-[0.55rem] tracking-[0.12em] uppercase px-2.5 py-1 rounded-pill"
            style={{
              background:
                product.badge === "Best Seller"
                  ? "rgba(196,149,106,0.2)"
                  : "rgba(200,168,75,0.15)",
              color:
                product.badge === "Best Seller"
                  ? "var(--coffee-latte)"
                  : "#c8a84b",
              border: `1px solid ${product.badge === "Best Seller" ? "rgba(196,149,106,0.3)" : "rgba(200,168,75,0.25)"}`,
            }}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-display font-semibold text-[1.1rem] mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {product.name}
        </h3>
        <p
          className="text-[0.78rem] leading-[1.65] mb-3 line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {product.tagline}
        </p>

        {product.variants.length > 0 ? (
          <p
            className="font-mono text-[0.7rem]"
            style={{ color: product.accent }}
          >
            {formatCurrency(product.variants[0].price)}
            <span className="text-[0.6rem] ml-1 opacity-60">
              / {product.unit}
            </span>
          </p>
        ) : (
          <span
            className="font-mono text-[0.58rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-pill"
            style={{ background: "rgba(200,168,75,0.12)", color: "#c8a84b" }}
          >
            In R&D
          </span>
        )}
      </div>
    </button>
  );
}

// ── Catalog card ───────────────────────────────────────────────────────────
function CatalogCard({
  product,
  inView,
  index,
  onOpen,
}: {
  product: UIProduct;
  inView: boolean;
  index: number;
  onOpen: (p: UIProduct) => void;
}) {
  return (
    <button
      onClick={() => onOpen(product)}
      className={`w-full text-left rounded-xl p-4 transition-all duration-600 hover:scale-[1.02] active:scale-[0.98] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        background: product.accentBg,
        border: `1px solid ${product.accentBorder}`,
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{
            background: `${product.accent}18`,
            border: `1px solid ${product.accent}25`,
          }}
        >
          <i
            className={`fas ${product.icon} text-sm`}
            style={{ color: product.accent }}
          />
        </div>
        {product.badge === "In R&D" && (
          <span
            className="font-mono text-[0.52rem] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-sm"
            style={{ background: "rgba(200,168,75,0.12)", color: "#c8a84b" }}
          >
            R&D
          </span>
        )}
        {product.badge === "Best Seller" && (
          <span
            className="font-mono text-[0.52rem] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-sm"
            style={{
              background: "rgba(196,149,106,0.18)",
              color: "var(--coffee-latte)",
            }}
          >
            ★ Top
          </span>
        )}
      </div>

      <p
        className="font-display font-semibold text-[0.95rem] mb-1 leading-tight"
        style={{ color: "var(--text-primary)" }}
      >
        {product.name}
      </p>

      {product.variants.length > 0 ? (
        <p
          className="font-mono text-[0.68rem]"
          style={{ color: product.accent }}
        >
          {formatCurrency(product.variants[0].price)}
          <span className="opacity-50 text-[0.6rem]"> /{product.unit}</span>
        </p>
      ) : (
        <p
          className="font-mono text-[0.62rem]"
          style={{ color: "var(--text-muted)" }}
        >
          Coming soon
        </p>
      )}
    </button>
  );
}

// ── Main Section ───────────────────────────────────────────────────────────
export default function IgProductsSection() {
  const { ref, inView } = useInView(0.05);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [openProduct, setOpenProduct] = useState<UIProduct | null>(null);

  const catalogProducts =
    activeTab === "all"
      ? ALL.filter((p) => !p.isFeatured)
      : ALL.filter((p) => !p.isFeatured && p.category === activeTab);

  return (
    <>
      <section
        id="products"
        className="relative py-20 px-6 overflow-hidden"
        style={{ background: "var(--bg-primary)" }}
      >
        <div
          className="absolute top-0 left-6 right-6 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--border-default), transparent)",
          }}
        />

        {/* Ambient glow */}
        <div
          className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(122,171,126,0.05) 0%, transparent 70%)",
          }}
        />

        <div ref={ref} className="relative z-10 max-w-[480px] mx-auto">
          <p
            className={`inline-flex items-center gap-2.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase mb-5 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ color: "var(--forest-sage)", transitionDelay: "80ms" }}
          >
            <span
              className="block w-6 h-px"
              style={{ background: "var(--forest-sage)" }}
            />
            Products
          </p>

          <h2
            className={`font-display font-semibold leading-[1.1] mb-3 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{
              fontSize: "clamp(1.9rem, 6vw, 2.6rem)",
              color: "var(--text-primary)",
              transitionDelay: "160ms",
            }}
          >
            What Waste{" "}
            <em className="italic" style={{ color: "var(--coffee-latte)" }}>
              Becomes
            </em>
          </h2>

          <p
            className={`text-[0.85rem] leading-[1.8] mb-10 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
            style={{ color: "var(--text-secondary)", transitionDelay: "240ms" }}
          >
            Through our circular process, coffee waste becomes functional,
            everyday products — from soil amendments to personal care.
          </p>

          {/* ── Featured 3 ── */}
          <p
            className="font-mono text-[0.6rem] tracking-[0.16em] uppercase mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Featured Products
          </p>
          <div className="grid grid-cols-3 gap-3 mb-10">
            {FEATURED.map((p, i) => (
              <FeaturedCard
                key={p.id}
                product={p}
                inView={inView}
                index={i}
                onOpen={setOpenProduct}
              />
            ))}
          </div>

          {/* ── Catalog tabs + grid ── */}
          <p
            className="font-mono text-[0.6rem] tracking-[0.16em] uppercase mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Full Catalog
          </p>

          {/* Tabs */}
          <div
            className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-pill font-mono text-[0.62rem] tracking-[0.1em] uppercase transition-all duration-200"
                style={{
                  background:
                    activeTab === tab.key
                      ? "rgba(196,149,106,0.14)"
                      : "transparent",
                  border: `1px solid ${activeTab === tab.key ? "rgba(196,149,106,0.3)" : "var(--border-default)"}`,
                  color:
                    activeTab === tab.key
                      ? "var(--coffee-latte)"
                      : "var(--text-muted)",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Catalog grid */}
          <div className="grid grid-cols-2 gap-3">
            {catalogProducts.map((p, i) => (
              <CatalogCard
                key={p.id}
                product={p}
                inView={inView}
                index={i}
                onOpen={setOpenProduct}
              />
            ))}
            {catalogProducts.length === 0 && (
              <div className="col-span-2 text-center py-8">
                <p
                  className="font-mono text-[0.7rem] tracking-[0.12em] uppercase"
                  style={{ color: "var(--text-muted)" }}
                >
                  No products in this category
                </p>
              </div>
            )}
          </div>

          {/* Shop CTA */}
          <a
            href="https://rebru.vercel.app/products"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-3 w-full mt-8 py-3.5 rounded-pill font-sans font-medium text-[0.88rem] transition-all duration-700 hover:scale-[1.02] active:scale-[0.98] ${inView ? "opacity-100" : "opacity-0"}`}
            style={{
              background: "rgba(122,171,126,0.1)",
              border: "1px solid rgba(122,171,126,0.22)",
              color: "var(--forest-sage)",
              transitionDelay: "600ms",
            }}
          >
            <span>Lihat semua di rebru.id</span>
            <i className="fas fa-arrow-up-right-from-square text-xs" />
          </a>
        </div>
      </section>

      {/* Drawer */}
      {openProduct && (
        <ProductDrawer
          product={openProduct}
          onClose={() => setOpenProduct(null)}
        />
      )}
    </>
  );
}
