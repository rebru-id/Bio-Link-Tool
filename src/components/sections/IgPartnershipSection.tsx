// file: src/components/sections/IgPartnershipSection.tsx
"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const TIERS = [
  {
    tier: "01",
    name: "Contributor",
    tagline: "Mulai perjalananmu bersama Rebru",
    color: "var(--text-secondary)",
    accent: "rgba(255,255,255,0.08)",
    accentBorder: "rgba(255,255,255,0.1)",
    benefits: [
      "Drop-off ampas kopi di fasilitas Rebru",
      "Sertifikat kontribusi digital",
      "Update dampak bulanan via email",
    ],
    cta: "Start Contributing",
    ctaStyle: "outline",
    badge: null,
  },
  {
    tier: "02",
    name: "Impact Partner",
    tagline: "Untuk café & bisnis yang ingin lebih dari sekadar berkontribusi",
    color: "var(--coffee-latte)",
    accent: "rgba(196,149,106,0.1)",
    accentBorder: "rgba(196,149,106,0.25)",
    benefits: [
      "Penjemputan terjadwal dari lokasi bisnis",
      "Dashboard laporan dampak (waste & CO₂)",
      "Brand visibility di platform Rebru",
      "Sertifikasi dampak terverifikasi",
    ],
    cta: "Join as Partner",
    ctaStyle: "filled",
    badge: "Most Popular",
  },
  {
    tier: "03",
    name: "Strategic Partner",
    tagline: "Kolaborasi skala penuh untuk bisnis dengan volume tinggi",
    color: "#c8a84b",
    accent: "rgba(200,168,75,0.08)",
    accentBorder: "rgba(200,168,75,0.2)",
    benefits: [
      "Semua benefit Impact Partner",
      "Dedicated account manager",
      "Co-branding & storytelling campaign",
      "Integrasi data ESG langsung",
      "Priority processing & reporting",
    ],
    cta: "Contact Us",
    ctaStyle: "outline",
    badge: "Enterprise",
  },
];

const FLOW_STEPS = [
  {
    icon: "fa-file-pen",
    label: "Apply",
    desc: "Isi form pendaftaran online",
    color: "var(--coffee-latte)",
  },
  {
    icon: "fa-circle-check",
    label: "Approval",
    desc: "Review dalam 1–2 hari kerja",
    color: "var(--forest-sage)",
  },
  {
    icon: "fa-truck",
    label: "Collection",
    desc: "Setup jadwal pengambilan",
    color: "#d4783a",
  },
  {
    icon: "fa-arrows-rotate",
    label: "Processing",
    desc: "Ampas diolah di fasilitas kami",
    color: "var(--coffee-latte)",
  },
  {
    icon: "fa-chart-bar",
    label: "Reporting",
    desc: "Laporan dampak bulanan",
    color: "#7aab7e",
  },
];

// ── Partnership form state ────────────────────────────────────────────────
function PartnershipForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    cafe: "",
    city: "",
    volume: "1-5",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        className="relative w-full rounded-t-3xl p-6"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderBottom: "none",
          animation: "fade-up 0.28s ease-out",
        }}
      >
        <div
          className="w-10 h-1 rounded-full mx-auto mb-5"
          style={{ background: "var(--border-strong)" }}
        />

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                background:
                  step >= s ? "var(--coffee-latte)" : "var(--border-default)",
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <>
            <h3
              className="font-display font-semibold text-[1.4rem] mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Daftarkan Bisnismu
            </h3>
            <p
              className="text-[0.82rem] mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              Langkah pertama menuju circular impact.
            </p>

            <div className="space-y-3">
              {[
                {
                  key: "name",
                  label: "Nama lengkap",
                  placeholder: "Ahmad Fauzi",
                },
                {
                  key: "cafe",
                  label: "Nama café / bisnis",
                  placeholder: "Kopi Nusantara",
                },
                { key: "city", label: "Kota", placeholder: "Makassar" },
              ].map((field) => (
                <div key={field.key}>
                  <label
                    className="font-mono text-[0.58rem] tracking-[0.14em] uppercase block mb-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) =>
                      setForm({ ...form, [field.key]: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl text-[0.88rem] outline-none transition-all duration-200"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-default)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--coffee-latte)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border-default)")
                    }
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-5 py-3.5 rounded-pill font-medium text-[0.88rem] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "var(--coffee-latte)",
                color: "var(--coffee-dark)",
              }}
            >
              Lanjutkan →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3
              className="font-display font-semibold text-[1.4rem] mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Volume & Tier
            </h3>
            <p
              className="text-[0.82rem] mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              Estimasi volume ampas kopi harianmu.
            </p>

            <div className="space-y-2 mb-5">
              {[
                { val: "1-5", label: "1–5 kg / hari", tier: "Contributor" },
                {
                  val: "5-20",
                  label: "5–20 kg / hari",
                  tier: "Impact Partner",
                },
                {
                  val: "20+",
                  label: "20+ kg / hari",
                  tier: "Strategic Partner",
                },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setForm({ ...form, volume: opt.val })}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200"
                  style={{
                    background:
                      form.volume === opt.val
                        ? "rgba(196,149,106,0.1)"
                        : "var(--bg-card)",
                    border: `1px solid ${form.volume === opt.val ? "rgba(196,149,106,0.3)" : "var(--border-default)"}`,
                  }}
                >
                  <span
                    className="text-[0.85rem]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {opt.label}
                  </span>
                  <span
                    className="font-mono text-[0.6rem] tracking-[0.1em]"
                    style={{
                      color:
                        form.volume === opt.val
                          ? "var(--coffee-latte)"
                          : "var(--text-muted)",
                    }}
                  >
                    → {opt.tier}
                  </span>
                </button>
              ))}
            </div>

            <a
              href={`https://wa.me/6285237390994?text=Hi%20Rebru!%20Saya%20${encodeURIComponent(form.cafe || form.name)}%20dari%20${encodeURIComponent(form.city)}%20ingin%20mendaftar%20sebagai%20partner.%20Volume%20ampas:%20${form.volume}kg/hari`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-pill font-medium text-[0.88rem] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "var(--coffee-latte)",
                color: "var(--coffee-dark)",
              }}
            >
              <i className="fab fa-whatsapp text-base" />
              <span>Kirim via WhatsApp</span>
            </a>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-2 py-2.5 text-[0.82rem] text-center"
              style={{ color: "var(--text-muted)" }}
            >
              ← Kembali
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Section ───────────────────────────────────────────────────────────
export default function IgPartnershipSection() {
  const { ref, inView } = useInView(0.08);
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <section
        id="partnership"
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
              "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(196,149,106,0.04) 0%, transparent 70%)",
          }}
        />

        <div ref={ref} className="relative z-10 max-w-[480px] mx-auto">
          <p
            className={`inline-flex items-center gap-2.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase mb-5 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ color: "var(--coffee-latte)", transitionDelay: "80ms" }}
          >
            <span
              className="block w-6 h-px"
              style={{ background: "var(--coffee-latte)" }}
            />
            Partnership
          </p>

          <h2
            className={`font-display font-semibold leading-[1.1] mb-3 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{
              fontSize: "clamp(1.9rem, 6vw, 2.6rem)",
              color: "var(--text-primary)",
              transitionDelay: "160ms",
            }}
          >
            Turn Your Waste into{" "}
            <em className="italic" style={{ color: "var(--coffee-latte)" }}>
              Measurable Impact
            </em>
          </h2>

          <p
            className={`text-[0.85rem] leading-[1.8] mb-10 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
            style={{ color: "var(--text-secondary)", transitionDelay: "240ms" }}
          >
            Rebru provides an end-to-end solution — from collection to
            processing to impact reporting. Our system adapts to your
            operational needs.
          </p>

          {/* Onboarding flow */}
          <div
            className={`mb-8 p-4 rounded-2xl transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              transitionDelay: "300ms",
            }}
          >
            <p
              className="font-mono text-[0.6rem] tracking-[0.15em] uppercase mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              Partnership Flow
            </p>
            <div
              className="flex items-center gap-1 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {FLOW_STEPS.map((step, i) => (
                <div key={i} className="flex items-center gap-1 flex-shrink-0">
                  <div className="flex flex-col items-center text-center w-14">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center mb-1.5"
                      style={{
                        background: `${step.color}12`,
                        border: `1px solid ${step.color}25`,
                      }}
                    >
                      <i
                        className={`fas ${step.icon} text-[0.65rem]`}
                        style={{ color: step.color }}
                      />
                    </div>
                    <p
                      className="font-mono text-[0.56rem] font-medium leading-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {step.label}
                    </p>
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div
                      className="w-4 h-px flex-shrink-0"
                      style={{ background: "var(--border-default)" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tier cards */}
          <div className="space-y-4">
            {TIERS.map((tier, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  background: tier.accent,
                  border: `1px solid ${tier.accentBorder}`,
                  transitionDelay: `${380 + i * 130}ms`,
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p
                      className="font-mono text-[0.55rem] tracking-[0.15em] uppercase mb-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Tier {tier.tier}
                    </p>
                    <h3
                      className="font-display font-semibold text-[1.2rem]"
                      style={{ color: tier.color }}
                    >
                      {tier.name}
                    </h3>
                  </div>
                  {tier.badge && (
                    <span
                      className="font-mono text-[0.55rem] tracking-[0.12em] uppercase px-2 py-1 rounded-pill"
                      style={{
                        background: `${tier.color}18`,
                        border: `1px solid ${tier.color}30`,
                        color: tier.color,
                      }}
                    >
                      {tier.badge}
                    </span>
                  )}
                </div>

                <p
                  className="text-[0.8rem] leading-[1.65] mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {tier.tagline}
                </p>

                <ul className="space-y-2 mb-5">
                  {tier.benefits.map((b, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span
                        className="text-[0.65rem] mt-0.5 flex-shrink-0"
                        style={{ color: tier.color }}
                      >
                        ✓
                      </span>
                      <span
                        className="text-[0.8rem] leading-[1.5]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowForm(true)}
                  className="w-full py-3 rounded-pill font-sans font-medium text-[0.85rem] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={
                    tier.ctaStyle === "filled"
                      ? {
                          background: "var(--coffee-latte)",
                          color: "var(--coffee-dark)",
                        }
                      : {
                          background: "transparent",
                          border: `1px solid ${tier.accentBorder}`,
                          color: tier.color,
                        }
                  }
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showForm && <PartnershipForm onClose={() => setShowForm(false)} />}
    </>
  );
}
