// file: src/components/sections/IgHeroSection.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

// ── Floating particle ──────────────────────────────────────────────────────
function Particle({
  x,
  y,
  size,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `rgba(196,149,106,${0.15 + Math.random() * 0.25})`,
        animation: `particle-drift ${4 + Math.random() * 4}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: 5 + ((i * 37) % 90),
  y: 10 + ((i * 53) % 80),
  size: 2 + (i % 4),
  delay: (i * 0.4) % 4,
}));

export default function IgHeroSection() {
  const { ref, inView } = useInView(0.05);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 pb-12 overflow-hidden"
      style={{ background: "var(--hero-gradient)" }}
    >
      {/* Particles */}
      {mounted && PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* Decorative ring */}
      <div
        className="absolute top-[10%] right-[-5%] w-[300px] h-[300px] rounded-full animate-ring-float pointer-events-none hidden sm:block"
        style={{
          border: "1px solid var(--ring-border)",
          boxShadow: "var(--ring-shadow)",
        }}
      >
        <div
          className="absolute inset-5 rounded-full"
          style={{ border: "1px solid var(--ring-inner-1)" }}
        />
        <div
          className="absolute inset-[40px] rounded-full"
          style={{ border: "1px solid var(--ring-inner-2)" }}
        />
      </div>

      {/* Second ring bottom-left */}
      <div
        className="absolute bottom-[8%] left-[-8%] w-[220px] h-[220px] rounded-full pointer-events-none hidden sm:block"
        style={{
          border: "1px solid rgba(122,171,126,0.1)",
          animation: "ring-float 11s ease-in-out 2s infinite",
        }}
      >
        <div
          className="absolute inset-4 rounded-full"
          style={{ border: "1px solid rgba(122,171,126,0.06)" }}
        />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,var(--coffee-latte) 0px,transparent 1px,transparent 80px),repeating-linear-gradient(90deg,var(--coffee-latte) 0px,transparent 1px,transparent 80px)",
        }}
      />

      {/* Content */}
      <div
        ref={ref}
        className="relative z-10 w-full max-w-[480px] mx-auto text-center"
      >
        {/* Eyebrow */}
        <p
          className={`inline-flex items-center gap-2.5 font-mono text-[0.65rem] tracking-[0.22em] uppercase mb-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ color: "var(--forest-sage)", transitionDelay: "100ms" }}
        >
          <span
            className="block w-6 h-px"
            style={{ background: "var(--forest-sage)" }}
          />
          Circular Innovations · Makassar
          <span
            className="block w-6 h-px"
            style={{ background: "var(--forest-sage)" }}
          />
        </p>

        {/* Headline */}
        <h1
          className={`font-display font-semibold leading-[1.06] mb-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{
            fontSize: "clamp(2.4rem, 8vw, 3.8rem)",
            color: "var(--text-primary)",
            transitionDelay: "200ms",
          }}
        >
          Turning Coffee Waste into{" "}
          <em className="italic" style={{ color: "var(--coffee-latte)" }}>
            Scalable
          </em>{" "}
          <span style={{ color: "var(--forest-sage)" }}>Climate Impact</span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-[0.95rem] leading-[1.85] mb-3 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ color: "var(--text-secondary)", transitionDelay: "300ms" }}
        >
          From cafés to circular products to measurable ESG data — Rebru builds
          a system where waste becomes value.
        </p>

        <p
          className={`font-mono text-[0.65rem] tracking-[0.12em] uppercase mb-10 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
          style={{ color: "var(--text-muted)", transitionDelay: "380ms" }}
        >
          Track every kilogram · Measure every impact
        </p>

        {/* CTA trio */}
        <div
          className={`flex flex-col gap-3 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "460ms" }}
        >
          <a
            href="#partnership"
            className="w-full py-3.5 px-6 rounded-pill font-sans font-medium text-[0.88rem] tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
            style={{
              background: "var(--coffee-latte)",
              color: "var(--coffee-dark)",
            }}
          >
            🤝 Become a Partner
          </a>
          <a
            href="#products"
            className="w-full py-3.5 px-6 rounded-pill font-sans font-medium text-[0.88rem] tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
            style={{
              background: "rgba(122,171,126,0.12)",
              border: "1px solid rgba(122,171,126,0.28)",
              color: "var(--forest-sage)",
            }}
          >
            🛍 Explore Products
          </a>
          <a
            href="#impact"
            className="w-full py-3.5 px-6 rounded-pill font-sans font-medium text-[0.88rem] tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            📊 View Impact
          </a>
        </div>

        {/* Scroll hint */}
        <div
          className={`mt-12 flex flex-col items-center gap-2 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "600ms" }}
        >
          <span
            className="font-mono text-[0.58rem] tracking-[0.2em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            scroll to explore
          </span>
          <div
            className="w-px h-10 animate-pulse-glow"
            style={{
              background:
                "linear-gradient(to bottom, var(--coffee-latte), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
