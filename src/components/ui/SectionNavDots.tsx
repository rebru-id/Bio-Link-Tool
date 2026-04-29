// file: src/components/ui/SectionNavDots.tsx
"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "system", label: "System" },
  { id: "roles", label: "Roles" },
  { id: "products", label: "Products" },
  { id: "impact", label: "Impact" },
  { id: "partnership", label: "Partner" },
];

export default function SectionNavDots() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold: 0.4 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 hidden sm:flex">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          title={label}
          className="group relative flex items-center justify-end gap-2"
        >
          {/* Tooltip */}
          <span
            className="absolute right-5 font-mono text-[0.55rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            {label}
          </span>

          {/* Dot */}
          <div
            className="rounded-full transition-all duration-300"
            style={{
              width: active === id ? 8 : 5,
              height: active === id ? 8 : 5,
              background:
                active === id ? "var(--coffee-latte)" : "var(--border-strong)",
              boxShadow:
                active === id ? "0 0 8px rgba(196,149,106,0.5)" : "none",
            }}
          />
        </a>
      ))}
    </div>
  );
}
