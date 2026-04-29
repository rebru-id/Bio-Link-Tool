// file: src/components/sections/IgImpactSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "@/hooks/useInView";

// ── Animated counter ───────────────────────────────────────────────────────
function AnimatedNumber({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [current, setCurrent] = useState(0);
  const { ref, inView } = useInView(0.3);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 1600;
    const steps = 60;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCurrent(Math.min(Math.round(increment * step), target));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {current.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

const METRICS = [
  {
    icon: "fa-weight-scale",
    value: 12540,
    suffix: "",
    unit: "kg",
    label: "Waste Processed",
    color: "var(--coffee-latte)",
    bg: "rgba(196,149,106,0.08)",
    border: "rgba(196,149,106,0.2)",
  },
  {
    icon: "fa-leaf",
    value: 82,
    suffix: "",
    unit: "ton",
    label: "CO₂e Reduced",
    color: "var(--forest-sage)",
    bg: "rgba(122,171,126,0.08)",
    border: "rgba(122,171,126,0.2)",
  },
  {
    icon: "fa-handshake",
    value: 45,
    suffix: "",
    unit: "mitra",
    label: "Active Partners",
    color: "#c8a84b",
    bg: "rgba(200,168,75,0.08)",
    border: "rgba(200,168,75,0.2)",
  },
];

// ── Impact Calculator ──────────────────────────────────────────────────────
function ImpactCalculator({ inView }: { inView: boolean }) {
  const [kg, setKg] = useState(5);

  // Estimasi berdasarkan data produk:
  // 1 Kg biochar → menyimpan 1.03 Kg CO₂e, menggunakan 0.8 Kg ampas
  const co2 = (kg * 1.03).toFixed(2);
  const biocharEquiv = (kg * 0.8).toFixed(1);
  const compostEquiv = (kg * 0.6).toFixed(1);

  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-default)",
        transitionDelay: "480ms",
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "rgba(196,149,106,0.12)",
            border: "1px solid rgba(196,149,106,0.2)",
          }}
        >
          <i
            className="fas fa-calculator text-xs"
            style={{ color: "var(--coffee-latte)" }}
          />
        </div>
        <div>
          <p
            className="font-mono text-[0.6rem] tracking-[0.15em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Impact Calculator
          </p>
          <p
            className="font-sans text-[0.72rem]"
            style={{ color: "var(--text-secondary)" }}
          >
            Estimasi dampak limbah harianmu
          </p>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-5">
        <div className="flex justify-between items-baseline mb-2">
          <p
            className="font-mono text-[0.62rem] tracking-[0.12em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Limbah kopi harian
          </p>
          <p
            className="font-display font-semibold text-[1.4rem]"
            style={{ color: "var(--coffee-latte)" }}
          >
            {kg}{" "}
            <span
              className="text-[0.8rem] font-sans font-normal"
              style={{ color: "var(--text-muted)" }}
            >
              kg
            </span>
          </p>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={kg}
          onChange={(e) => setKg(Number(e.target.value))}
          className="w-full h-1.5 rounded-pill appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--coffee-latte) 0%, var(--coffee-latte) ${kg}%, var(--bg-card) ${kg}%, var(--bg-card) 100%)`,
            accentColor: "var(--coffee-latte)",
          }}
        />
        <div className="flex justify-between mt-1">
          <span
            className="font-mono text-[0.55rem]"
            style={{ color: "var(--text-muted)" }}
          >
            1 kg
          </span>
          <span
            className="font-mono text-[0.55rem]"
            style={{ color: "var(--text-muted)" }}
          >
            100 kg
          </span>
        </div>
      </div>

      {/* Output */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          {
            label: "CO₂ disimpan",
            value: `${co2} kg`,
            icon: "fa-cloud",
            color: "var(--forest-sage)",
            bg: "rgba(122,171,126,0.08)",
            border: "rgba(122,171,126,0.18)",
          },
          {
            label: "Biochar equiv.",
            value: `${biocharEquiv} kg`,
            icon: "fa-seedling",
            color: "var(--coffee-latte)",
            bg: "rgba(196,149,106,0.08)",
            border: "rgba(196,149,106,0.2)",
          },
          {
            label: "Compost equiv.",
            value: `${compostEquiv} kg`,
            icon: "fa-leaf",
            color: "#7aab7e",
            bg: "rgba(122,171,126,0.07)",
            border: "rgba(122,171,126,0.15)",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-xl p-3 text-center"
            style={{ background: item.bg, border: `1px solid ${item.border}` }}
          >
            <i
              className={`fas ${item.icon} text-xs mb-2 block`}
              style={{ color: item.color }}
            />
            <p
              className="font-display font-semibold text-[1rem] leading-none mb-1"
              style={{ color: item.color }}
            >
              {item.value}
            </p>
            <p
              className="font-mono text-[0.55rem] leading-[1.3]"
              style={{ color: "var(--text-muted)" }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <p
        className="text-[0.72rem] mt-3 text-center"
        style={{ color: "var(--text-muted)" }}
      >
        * Estimasi berdasarkan rasio konversi produk Rebru
      </p>
    </div>
  );
}

// ── Live feed items ────────────────────────────────────────────────────────
const FEED_ITEMS = [
  {
    icon: "fa-weight-scale",
    text: "+12 kg ampas diproses hari ini",
    time: "2j lalu",
    color: "var(--coffee-latte)",
  },
  {
    icon: "fa-handshake",
    text: "Café Baru bergabung sebagai mitra",
    time: "5j lalu",
    color: "var(--forest-sage)",
  },
  {
    icon: "fa-seedling",
    text: "32 kg Biochar siap kirim",
    time: "1hr lalu",
    color: "#7aab7e",
  },
  {
    icon: "fa-fire",
    text: "15 kg Bio-briquettes diproduksi",
    time: "kemarin",
    color: "#d4783a",
  },
];

export default function IgImpactSection() {
  const { ref, inView } = useInView(0.08);

  return (
    <section
      id="impact"
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

      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(122,171,126,0.05) 0%, transparent 65%)",
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
          Impact
        </p>

        <h2
          className={`font-display font-semibold leading-[1.1] mb-3 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            fontSize: "clamp(1.9rem, 6vw, 2.6rem)",
            color: "var(--text-primary)",
            transitionDelay: "160ms",
          }}
        >
          Measurable Impact,{" "}
          <em className="italic" style={{ color: "var(--forest-sage)" }}>
            Not Assumptions
          </em>
        </h2>

        <p
          className={`text-[0.85rem] leading-[1.8] mb-8 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
          style={{ color: "var(--text-secondary)", transitionDelay: "240ms" }}
        >
          Sustainability without data is just a claim. Rebru tracks every stage
          from waste collection to environmental impact.
        </p>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {METRICS.map((m, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                background: m.bg,
                border: `1px solid ${m.border}`,
                transitionDelay: `${300 + i * 120}ms`,
              }}
            >
              <i
                className={`fas ${m.icon} text-base mb-3 block`}
                style={{ color: m.color }}
              />
              <p
                className="font-display font-semibold text-[1.5rem] leading-none mb-0.5"
                style={{ color: m.color }}
              >
                <AnimatedNumber target={m.value} />
              </p>
              <p
                className="font-mono text-[0.55rem] tracking-[0.08em] uppercase mb-1"
                style={{ color: m.color }}
              >
                {m.unit}
              </p>
              <p
                className="font-mono text-[0.58rem] leading-[1.3]"
                style={{ color: "var(--text-muted)" }}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Impact Calculator */}
        <ImpactCalculator inView={inView} />

        {/* Live feed */}
        <div
          className={`mt-6 rounded-2xl overflow-hidden transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            transitionDelay: "600ms",
          }}
        >
          <div
            className="flex items-center gap-2.5 px-4 py-3"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse-glow"
              style={{ background: "var(--forest-sage)" }}
            />
            <p
              className="font-mono text-[0.6rem] tracking-[0.15em] uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Live Activity Feed
            </p>
          </div>
          {FEED_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom:
                  i < FEED_ITEMS.length - 1
                    ? "1px solid var(--border-subtle)"
                    : "none",
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${item.color}12`,
                  border: `1px solid ${item.color}20`,
                }}
              >
                <i
                  className={`fas ${item.icon} text-[0.6rem]`}
                  style={{ color: item.color }}
                />
              </div>
              <p
                className="flex-1 text-[0.78rem]"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.text}
              </p>
              <span
                className="font-mono text-[0.58rem] flex-shrink-0"
                style={{ color: "var(--text-muted)" }}
              >
                {item.time}
              </span>
            </div>
          ))}
        </div>

        {/* Closing */}
        <p
          className={`text-center text-[0.8rem] mt-6 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
          style={{
            color: "var(--text-muted)",
            transitionDelay: "700ms",
            fontStyle: "italic",
          }}
        >
          Built for a future where impact is not only created —{" "}
          <span style={{ color: "var(--forest-sage)" }}>but proven.</span>
        </p>
      </div>
    </section>
  );
}
