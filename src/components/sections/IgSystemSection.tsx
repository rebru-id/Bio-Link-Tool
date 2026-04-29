// file: src/components/sections/IgSystemSection.tsx
"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const FLOW_STEPS = [
  {
    step: "01",
    icon: "fa-mug-hot",
    label: "Cafés",
    desc: "Ampas kopi dikumpulkan dari jaringan café dan bisnis mitra di Makassar",
    color: "#b07d56",
  },
  {
    step: "02",
    icon: "fa-truck",
    label: "Collection",
    desc: "Penjemputan terjadwal atau drop-off ke fasilitas pemrosesan Rebru",
    color: "var(--coffee-latte)",
  },
  {
    step: "03",
    icon: "fa-industry",
    label: "Processing",
    desc: "Pirolisis termal, fermentasi organik, dan kompresi mengubah limbah jadi material baru",
    color: "#d4783a",
  },
  {
    step: "04",
    icon: "fa-box-open",
    label: "Products",
    desc: "9 produk circular: Biochar, Kompos, Briket, EcoGoods, hingga Raw Materials R&D",
    color: "var(--forest-sage)",
  },
  {
    step: "05",
    icon: "fa-chart-bar",
    label: "Impact Data",
    desc: "Setiap kilogram tercatat. Laporan dampak bulanan tersedia untuk setiap mitra.",
    color: "#7aab7e",
  },
];

export default function IgSystemSection() {
  const { ref, inView } = useInView(0.08);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section
      id="system"
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

      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(196,149,106,0.05) 0%, transparent 70%)",
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
          The System
        </p>

        <h2
          className={`font-display font-semibold leading-[1.1] mb-4 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            fontSize: "clamp(1.9rem, 6vw, 2.6rem)",
            color: "var(--text-primary)",
            transitionDelay: "160ms",
          }}
        >
          A Circular System,{" "}
          <em className="italic" style={{ color: "var(--coffee-latte)" }}>
            Built for Real Impact
          </em>
        </h2>

        <p
          className={`text-[0.88rem] leading-[1.8] mb-10 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
          style={{ color: "var(--text-secondary)", transitionDelay: "240ms" }}
        >
          Rebru transforms coffee waste into a structured circular system. Not
          just recycling — a system designed for scalability and accountability.
        </p>

        {/* Flow steps */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute left-5 top-5 bottom-5 w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--coffee-latte), var(--forest-sage))",
              opacity: 0.2,
            }}
          />

          <div className="space-y-2">
            {FLOW_STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(activeStep === i ? null : i)}
                className={`w-full flex gap-4 p-4 rounded-xl text-left transition-all duration-500 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                style={{
                  transitionDelay: `${300 + i * 100}ms`,
                  background:
                    activeStep === i ? `${step.color}10` : "transparent",
                  border: `1px solid ${activeStep === i ? `${step.color}30` : "transparent"}`,
                }}
              >
                {/* Circle icon */}
                <div className="flex-shrink-0 relative z-10">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background:
                        activeStep === i ? step.color : "var(--bg-elevated)",
                      border: `1px solid ${activeStep === i ? step.color : "var(--border-default)"}`,
                    }}
                  >
                    <i
                      className={`fas ${step.icon} text-sm`}
                      style={{
                        color:
                          activeStep === i ? "var(--coffee-dark)" : step.color,
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className="font-mono text-[0.58rem] tracking-[0.15em] uppercase"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {step.step}
                    </span>
                    <i
                      className={`fas fa-chevron-${activeStep === i ? "up" : "down"} text-[0.6rem] transition-all duration-300`}
                      style={{ color: "var(--text-muted)" }}
                    />
                  </div>
                  <p
                    className="font-display font-semibold text-[1rem]"
                    style={{
                      color:
                        activeStep === i ? step.color : "var(--text-primary)",
                    }}
                  >
                    {step.label}
                  </p>
                  {activeStep === i && (
                    <p
                      className="text-[0.82rem] leading-[1.7] mt-1.5"
                      style={{
                        color: "var(--text-secondary)",
                        animation: "fade-up 0.25s ease-out",
                      }}
                    >
                      {step.desc}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Facility highlight */}
        <div
          className={`mt-10 p-5 rounded-xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            transitionDelay: "800ms",
          }}
        >
          <p
            className="font-mono text-[0.6rem] tracking-[0.15em] uppercase mb-3"
            style={{ color: "var(--coffee-latte)" }}
          >
            Facility Zones
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Organic Processing",
                icon: "fa-seedling",
                color: "var(--forest-sage)",
              },
              { label: "Thermal (Biochar)", icon: "fa-fire", color: "#d4783a" },
              {
                label: "Product Dev",
                icon: "fa-flask",
                color: "var(--coffee-latte)",
              },
            ].map((zone, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                  style={{
                    background: `${zone.color}15`,
                    border: `1px solid ${zone.color}25`,
                  }}
                >
                  <i
                    className={`fas ${zone.icon} text-xs`}
                    style={{ color: zone.color }}
                  />
                </div>
                <p
                  className="font-mono text-[0.58rem] leading-[1.4]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {zone.label}
                </p>
              </div>
            ))}
          </div>
          <p
            className="text-[0.75rem] mt-4 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            This is where waste becomes possibility.
          </p>
        </div>
      </div>
    </section>
  );
}
