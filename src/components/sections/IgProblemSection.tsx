// file: src/components/sections/IgProblemSection.tsx
"use client";
import { useInView } from "@/hooks/useInView";

const PROBLEMS = [
  {
    icon: "fa-trash-can",
    stat: "Jutaan ton",
    title: "Limbah Terbuang Setiap Hari",
    body: "Ampas kopi dari café, restoran, dan kantor hampir seluruhnya berakhir di tempat pembuangan tanpa jejak.",
    color: "#d4783a",
  },
  {
    icon: "fa-chart-line",
    stat: "0 data",
    title: "Tanpa Sistem Ukur Dampak",
    body: "Bisnis semakin dituntut mengadopsi praktik berkelanjutan, tapi tidak ada alat untuk mengukur dan membuktikan dampak nyata.",
    color: "var(--coffee-latte)",
  },
  {
    icon: "fa-link-slash",
    stat: "Gap besar",
    title: "Sustainability ≠ Traceability",
    body: "Klaim ramah lingkungan tidak cukup. Tanpa data yang bisa diverifikasi, kepercayaan tidak dapat dibangun.",
    color: "var(--forest-sage)",
  },
];

export default function IgProblemSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section
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
        {/* Label */}
        <p
          className={`inline-flex items-center gap-2.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase mb-5 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ color: "var(--text-muted)", transitionDelay: "80ms" }}
        >
          <span
            className="block w-6 h-px"
            style={{ background: "var(--text-muted)" }}
          />
          The Problem
        </p>

        <h2
          className={`font-display font-semibold leading-[1.1] mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            fontSize: "clamp(1.9rem, 6vw, 2.6rem)",
            color: "var(--text-primary)",
            transitionDelay: "160ms",
          }}
        >
          The Problem We Ignore{" "}
          <em className="italic" style={{ color: "var(--coffee-latte)" }}>
            Every Day
          </em>
        </h2>

        <div className="space-y-5">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className={`flex gap-5 transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
              style={{ transitionDelay: `${240 + i * 120}ms` }}
            >
              {/* Icon column */}
              <div className="flex-shrink-0 pt-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: `${p.color}15`,
                    border: `1px solid ${p.color}30`,
                  }}
                >
                  <i
                    className={`fas ${p.icon} text-sm`}
                    style={{ color: p.color }}
                  />
                </div>
              </div>

              {/* Text */}
              <div>
                <p
                  className="font-mono text-[0.6rem] tracking-[0.15em] uppercase mb-1"
                  style={{ color: p.color }}
                >
                  {p.stat}
                </p>
                <h3
                  className="font-display font-semibold text-[1.1rem] mb-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-[0.85rem] leading-[1.75]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing statement */}
        <div
          className={`mt-10 pt-8 border-t text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{
            borderColor: "var(--border-default)",
            transitionDelay: "600ms",
          }}
        >
          <p
            className="font-display text-[1.15rem] italic leading-[1.5]"
            style={{ color: "var(--text-secondary)" }}
          >
            "Sustainability exists.
            <br />
            <span style={{ color: "var(--coffee-latte)" }}>
              Traceability does not."
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
