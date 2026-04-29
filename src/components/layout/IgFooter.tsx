// file: src/components/layout/IgFooter.tsx
export default function IgFooter() {
  return (
    <footer
      className="px-6 py-8"
      style={{
        background: "var(--bg-primary)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <div className="max-w-[480px] mx-auto">
        {/* Brand */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p
              className="font-display font-semibold text-[1.15rem]"
              style={{ color: "var(--text-primary)" }}
            >
              Rebru
            </p>
            <p
              className="font-mono text-[0.6rem] tracking-[0.12em] mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              Brewing Scalable Impact from Coffee Waste
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(196,149,106,0.1)",
              border: "1px solid rgba(196,149,106,0.2)",
            }}
          >
            <i
              className="fas fa-seedling text-sm"
              style={{ color: "var(--coffee-latte)" }}
            />
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 mb-6">
          {[
            { label: "Products", href: "#products" },
            { label: "Partnership", href: "#partnership" },
            { label: "Impact", href: "#impact" },
            { label: "System", href: "#system" },
            { label: "rebru.id", href: "https://rebru.vercel.app/" },
            { label: "Instagram", href: "https://instagram.com/rebru.id" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
              className="font-mono text-[0.65rem] tracking-[0.08em] transition-colors duration-200 hover:opacity-100"
              style={{ color: "var(--text-muted)", opacity: 0.7 }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-5 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <p
            className="font-mono text-[0.58rem] tracking-[0.08em]"
            style={{ color: "var(--text-muted)" }}
          >
            © 2025 Rebru · Makassar, Indonesia
          </p>
          <p
            className="font-mono text-[0.58rem] tracking-[0.08em]"
            style={{ color: "var(--text-muted)" }}
          >
            Circular Economy Platform
          </p>
        </div>
      </div>
    </footer>
  );
}
