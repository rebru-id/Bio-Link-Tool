// file: src/components/sections/IgCtaSection.tsx
"use client";
import { useInView } from "@/hooks/useInView";

const ACTIONS = [
  {
    icon: "fa-handshake",
    label: "Become a Partner",
    desc: "Kelola limbah, ukur dampak.",
    href: "#partnership",
    color: "var(--coffee-latte)",
    bg: "rgba(196,149,106,0.1)",
    border: "rgba(196,149,106,0.25)",
  },
  {
    icon: "fa-rotate",
    label: "Collaborate With Us",
    desc: "R&D, investor, media.",
    href: "https://wa.me/6285237390994",
    color: "var(--forest-sage)",
    bg: "rgba(122,171,126,0.09)",
    border: "rgba(122,171,126,0.22)",
  },
  {
    icon: "fa-arrow-up-right-from-square",
    label: "Explore the Platform",
    desc: "Lihat website lengkap.",
    href: "https://rebru.vercel.app/",
    color: "#c8a84b",
    bg: "rgba(200,168,75,0.08)",
    border: "rgba(200,168,75,0.2)",
  },
];

export default function IgCtaSection() {
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(196,149,106,0.07) 0%, transparent 70%)",
        }}
      />

      <div
        ref={ref}
        className="relative z-10 max-w-[480px] mx-auto text-center"
      >
        <p
          className={`inline-flex items-center gap-2.5 font-mono text-[0.65rem] tracking-[0.2em] uppercase mb-5 justify-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ color: "var(--text-muted)", transitionDelay: "80ms" }}
        >
          <span
            className="block w-5 h-px"
            style={{ background: "var(--text-muted)" }}
          />
          Join the Movement
          <span
            className="block w-5 h-px"
            style={{ background: "var(--text-muted)" }}
          />
        </p>

        <h2
          className={`font-display font-semibold leading-[1.08] mb-4 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            fontSize: "clamp(2rem, 7vw, 3rem)",
            color: "var(--text-primary)",
            transitionDelay: "160ms",
          }}
        >
          Be Part of the{" "}
          <em className="italic" style={{ color: "var(--coffee-latte)" }}>
            Circular
          </em>{" "}
          <span style={{ color: "var(--forest-sage)" }}>Movement</span>
        </h2>

        <p
          className={`text-[0.88rem] leading-[1.85] mb-10 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
          style={{ color: "var(--text-secondary)", transitionDelay: "260ms" }}
        >
          Whether you're reducing waste, building a responsible brand, or
          supporting sustainable innovation — Rebru connects you to a system
          that works.
        </p>

        <div className="space-y-3 mb-10">
          {ACTIONS.map((a, i) => (
            <a
              key={i}
              href={a.href}
              target={a.href.startsWith("http") ? "_blank" : undefined}
              rel={
                a.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-left transition-all duration-700 hover:scale-[1.02] active:scale-[0.98] ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{
                background: a.bg,
                border: `1px solid ${a.border}`,
                transitionDelay: `${340 + i * 110}ms`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${a.color}15`,
                  border: `1px solid ${a.color}25`,
                }}
              >
                <i
                  className={`fas ${a.icon} text-sm`}
                  style={{ color: a.color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-sans font-medium text-[0.9rem]"
                  style={{ color: "var(--text-primary)" }}
                >
                  {a.label}
                </p>
                <p
                  className="font-mono text-[0.62rem] tracking-[0.06em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  {a.desc}
                </p>
              </div>
              <i
                className="fas fa-arrow-right text-xs flex-shrink-0"
                style={{ color: a.color }}
              />
            </a>
          ))}
        </div>

        {/* Decorative divider */}
        <div
          className={`flex items-center gap-4 mb-8 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "680ms" }}
        >
          <div
            className="flex-1 h-px"
            style={{ background: "var(--border-subtle)" }}
          />
          <i
            className="fas fa-seedling text-xs"
            style={{ color: "var(--text-muted)" }}
          />
          <div
            className="flex-1 h-px"
            style={{ background: "var(--border-subtle)" }}
          />
        </div>

        {/* Social links */}
        <div
          className={`flex justify-center gap-3 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "750ms" }}
        >
          {[
            {
              icon: "fab fa-instagram",
              label: "@rebru.id",
              href: "https://instagram.com/rebru.id",
              color: "#b07d56",
            },
            {
              icon: "fab fa-whatsapp",
              label: "WhatsApp",
              href: "https://wa.me/6285237390994",
              color: "var(--forest-sage)",
            },
            {
              icon: "fas fa-globe",
              label: "rebru.id",
              href: "https://rebru.vercel.app/",
              color: "var(--coffee-latte)",
            },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-pill transition-all duration-200 hover:scale-[1.04]"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
              }}
            >
              <i className={`${s.icon} text-sm`} style={{ color: s.color }} />
              <span className="font-mono text-[0.62rem] tracking-[0.06em]">
                {s.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
