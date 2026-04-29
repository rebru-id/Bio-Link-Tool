// file: src/components/sections/IgRoleGateSection.tsx
"use client";
import { useInView } from "@/hooks/useInView";

const ROLES = [
  {
    id: "business",
    emoji: "🤝",
    label: "For Business",
    badge: "B2B",
    badgeColor: "rgba(196,149,106,0.15)",
    badgeText: "var(--coffee-latte)",
    title: "Manage Your Waste. Measure Your Impact.",
    body: "Join a growing network of cafés transforming waste into measurable environmental impact.",
    cta: "Join as Partner",
    ctaColor: "var(--coffee-latte)",
    ctaBg: "rgba(196,149,106,0.12)",
    ctaBorder: "rgba(196,149,106,0.3)",
    href: "#partnership",
    accent: "var(--coffee-latte)",
    accentBg: "rgba(196,149,106,0.06)",
    accentBorder: "rgba(196,149,106,0.18)",
    features: [
      "Scheduled waste collection",
      "Impact reporting dashboard",
      "Brand visibility in Rebru ecosystem",
    ],
  },
  {
    id: "consumer",
    emoji: "🛍",
    label: "For Consumer",
    badge: "B2C",
    badgeColor: "rgba(122,171,126,0.15)",
    badgeText: "var(--forest-sage)",
    title: "Products with a Second Life",
    body: "Discover everyday products made from repurposed coffee waste. Each item is a circular system in motion.",
    cta: "Explore Products",
    ctaColor: "var(--forest-sage)",
    ctaBg: "rgba(122,171,126,0.1)",
    ctaBorder: "rgba(122,171,126,0.25)",
    href: "#products",
    accent: "var(--forest-sage)",
    accentBg: "rgba(122,171,126,0.06)",
    accentBorder: "rgba(122,171,126,0.15)",
    features: [
      "Biochar, Compost, Bio-briquettes",
      "EcoGoods: Candle, Soap, Coaster",
      "R&D: Diffuser, Car Fragrance",
    ],
  },
  {
    id: "investor",
    emoji: "📊",
    label: "For Investor",
    badge: "Impact",
    badgeColor: "rgba(200,168,75,0.15)",
    badgeText: "#c8a84b",
    title: "A Platform Built on Data and Impact",
    body: "Rebru integrates physical infrastructure with digital tracking systems to create measurable environmental value.",
    cta: "View Platform",
    ctaColor: "#c8a84b",
    ctaBg: "rgba(200,168,75,0.1)",
    ctaBorder: "rgba(200,168,75,0.25)",
    href: "#impact",
    accent: "#c8a84b",
    accentBg: "rgba(200,168,75,0.06)",
    accentBorder: "rgba(200,168,75,0.15)",
    features: [
      "CO₂ reduction tracking",
      "ESG reporting ready",
      "Scalable circular infrastructure",
    ],
  },
];

export default function IgRoleGateSection() {
  const { ref, inView } = useInView(0.08);

  return (
    <section
      id="roles"
      className="relative py-20 px-6 overflow-hidden"
      style={{ background: "var(--bg-surface)" }}
    >
      <div
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--border-default), transparent)",
        }}
      />

      <div ref={ref} className="max-w-[480px] mx-auto">
        <p
          className={`inline-flex items-center gap-2.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase mb-5 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ color: "var(--text-muted)", transitionDelay: "80ms" }}
        >
          <span
            className="block w-6 h-px"
            style={{ background: "var(--text-muted)" }}
          />
          Your Role
        </p>

        <h2
          className={`font-display font-semibold leading-[1.1] mb-3 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            fontSize: "clamp(1.9rem, 6vw, 2.6rem)",
            color: "var(--text-primary)",
            transitionDelay: "160ms",
          }}
        >
          Choose Your Role in the{" "}
          <em className="italic" style={{ color: "var(--coffee-latte)" }}>
            Circular System
          </em>
        </h2>

        <p
          className={`text-[0.85rem] leading-[1.8] mb-10 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
          style={{ color: "var(--text-secondary)", transitionDelay: "240ms" }}
        >
          Whether you run a business, support sustainable products, or build
          impact at scale — there's a place for you in Rebru.
        </p>

        <div className="space-y-4">
          {ROLES.map((role, i) => (
            <div
              key={role.id}
              className={`rounded-2xl p-5 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                background: role.accentBg,
                border: `1px solid ${role.accentBorder}`,
                transitionDelay: `${300 + i * 140}ms`,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span
                    className="font-mono text-[0.58rem] tracking-[0.14em] uppercase px-2.5 py-1 rounded-pill"
                    style={{
                      background: role.badgeColor,
                      color: role.badgeText,
                    }}
                  >
                    {role.badge}
                  </span>
                </div>
                <span className="text-xl">{role.emoji}</span>
              </div>

              <h3
                className="font-display font-semibold text-[1.15rem] leading-tight mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {role.title}
              </h3>

              <p
                className="text-[0.83rem] leading-[1.7] mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                {role.body}
              </p>

              {/* Features */}
              <ul className="space-y-1.5 mb-5">
                {role.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5">
                    <span
                      className="text-[0.6rem]"
                      style={{ color: role.accent }}
                    >
                      ●
                    </span>
                    <span
                      className="font-mono text-[0.7rem] tracking-[0.04em]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={role.href}
                className="flex items-center justify-between w-full px-5 py-3 rounded-pill font-sans font-medium text-[0.85rem] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: role.ctaBg,
                  border: `1px solid ${role.ctaBorder}`,
                  color: role.ctaColor,
                }}
              >
                <span>{role.cta}</span>
                <i className="fas fa-arrow-right text-xs" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
