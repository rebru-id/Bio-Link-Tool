// src/components/sections/IgPartnershipSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// REWRITTEN — Partnership section untuk IG landing page
//
// Perubahan dari versi sebelumnya:
//   1. TIERS (lokal, tidak sinkron) → PACKAGES dari @/data/packages
//      Data paket kini identik dengan Rebru website
//
//   2. Form WhatsApp (tidak tercatat) → form lengkap via @/services/partnership
//      Data masuk ke Supabase table `partner_applications` yang sama
//      dengan Rebru website — admin dapat monitor semua submission
//
//   3. Field form diperluas agar kompatibel dengan schema Supabase:
//      name, organization, phone, email, jenis_usaha, volume_limbah,
//      city, alamat, type, message, source
//
// UX: mobile-first bottom sheet, 3 langkah, konsisten dengan
// gaya visual seluruh section IG landing page (max-w-[480px])
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useInView } from "@/hooks/useInView";
import { PACKAGES, type Package } from "@/data/packages";
import {
  insertPartnerApplication,
  type PartnerApplicationPayload,
} from "@/services/partnership";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const FLOW_STEPS = [
  { icon: "fa-file-pen",      label: "Apply",      color: "var(--coffee-latte)" },
  { icon: "fa-circle-check",  label: "Approval",   color: "var(--forest-sage)"  },
  { icon: "fa-truck",         label: "Collection", color: "#d4783a"              },
  { icon: "fa-arrows-rotate", label: "Processing", color: "var(--coffee-latte)" },
  { icon: "fa-chart-bar",     label: "Reporting",  color: "#7aab7e"              },
];

const JENIS_USAHA_OPTIONS = [
  "Cafe / Coffee Shop",
  "Restoran",
  "Hotel / Penginapan",
  "Catering",
  "Kantor / Perusahaan",
  "Lainnya",
];

const VOLUME_OPTIONS = [
  { label: "< 1 kg / hari",    value: "< 1 kg / hari"    },
  { label: "1 – 5 kg / hari",  value: "1 – 5 kg / hari"  },
  { label: "5 – 10 kg / hari", value: "5 – 10 kg / hari" },
  { label: "> 10 kg / hari",   value: "> 10 kg / hari"   },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+62|62|0)8[0-9]{8,11}$/;

// ─────────────────────────────────────────────────────────────────────────────
// Form state types
// ─────────────────────────────────────────────────────────────────────────────

type FormStep = 1 | 2 | 3;

interface FormData {
  type: "kontributor" | "dampak" | "strategis" | "";
  pic: string;
  organization: string;
  phone: string;
  email: string;
  jenisUsaha: string;
  volumeLimbah: string;
  city: string;
  alamat: string;
  message: string;
}

const EMPTY_FORM: FormData = {
  type: "",
  pic: "",
  organization: "",
  phone: "",
  email: "",
  jenisUsaha: "",
  volumeLimbah: "",
  city: "",
  alamat: "",
  message: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI atoms — konsisten dengan visual IG landing lainnya
// ─────────────────────────────────────────────────────────────────────────────

const sharedInputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-card)",
  border: "1px solid var(--border-default)",
  color: "var(--text-primary)",
  borderRadius: "12px",
  padding: "12px 14px",
  fontSize: "0.88rem",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s",
};

function FieldLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      style={{
        display: "block",
        fontFamily: "var(--font-mono)",
        fontSize: "0.58rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase" as const,
        color: "var(--text-muted)",
        marginBottom: "6px",
      }}
    >
      {children}
      {optional && (
        <span style={{ marginLeft: "6px", opacity: 0.5, fontSize: "0.52rem" }}>
          opsional
        </span>
      )}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.58rem",
        color: "#f87171",
        marginTop: "4px",
      }}
    >
      {msg}
    </p>
  );
}

function FocusInput({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...sharedInputStyle,
        borderColor: error
          ? "rgba(248,113,113,0.5)"
          : focused
            ? "var(--coffee-latte)"
            : "var(--border-default)",
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Pilih tier kemitraan
// ─────────────────────────────────────────────────────────────────────────────

function Step1TierSelect({
  selected,
  onSelect,
  onNext,
}: {
  selected: FormData["type"];
  onSelect: (id: FormData["type"]) => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="mb-5">
        <h3
          className="font-display font-semibold text-[1.4rem] mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Pilih Skema Kemitraan
        </h3>
        <p className="text-[0.8rem]" style={{ color: "var(--text-secondary)" }}>
          Pilih yang sesuai dengan kebutuhan operasional bisnismu.
        </p>
      </div>

      <div className="space-y-2.5 mb-5">
        {PACKAGES.map((pkg) => {
          const isSelected = selected === pkg.id;
          return (
            <button
              key={pkg.id}
              onClick={() => onSelect(pkg.id as FormData["type"])}
              className="w-full rounded-2xl p-4 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: isSelected ? pkg.accentBg : "var(--bg-card)",
                border: `1px solid ${isSelected ? pkg.accentBorder : "var(--border-default)"}`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  {/* Radio indicator */}
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 transition-all duration-200 flex items-center justify-center"
                    style={{
                      border: `1.5px solid ${isSelected ? pkg.accent : "var(--border-strong)"}`,
                      background: isSelected ? pkg.accent : "transparent",
                    }}
                  >
                    {isSelected && (
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--bg-primary)" }}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-sans font-medium text-[0.9rem] leading-tight"
                      style={{
                        color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {pkg.tier}
                    </p>
                    <p
                      className="font-mono text-[0.58rem] tracking-[0.06em] mt-0.5 truncate"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {pkg.tagline}
                    </p>
                  </div>
                </div>
                {/* Price badge */}
                <span
                  className="font-mono text-[0.62rem] tracking-[0.06em] px-2 py-1 rounded-pill flex-shrink-0"
                  style={{
                    background: isSelected ? `${pkg.accent}18` : "var(--bg-elevated)",
                    border: `1px solid ${isSelected ? `${pkg.accent}30` : "var(--border-default)"}`,
                    color: isSelected ? pkg.accent : "var(--text-muted)",
                  }}
                >
                  {pkg.badge}
                </span>
              </div>

              {/* Features preview — only when selected */}
              {isSelected && (
                <ul className="mt-3 space-y-1.5 pl-6">
                  {pkg.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[0.6rem] mt-0.5" style={{ color: pkg.accent }}>
                        ✓
                      </span>
                      <span
                        className="text-[0.75rem] leading-[1.5]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                  {pkg.features.length > 3 && (
                    <li
                      className="font-mono text-[0.58rem] pl-4"
                      style={{ color: "var(--text-muted)" }}
                    >
                      +{pkg.features.length - 3} benefit lainnya
                    </li>
                  )}
                </ul>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!selected}
        className="w-full py-3.5 rounded-pill font-medium text-[0.88rem] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: selected ? "var(--coffee-latte)" : "var(--bg-elevated)",
          color: selected ? "var(--coffee-dark)" : "var(--text-muted)",
        }}
      >
        Lanjutkan →
      </button>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Identitas & profil bisnis
// ─────────────────────────────────────────────────────────────────────────────

function Step2Identity({
  form,
  onChange,
  onNext,
  onBack,
}: {
  form: FormData;
  onChange: (key: keyof FormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.pic.trim()) e.pic = "Nama wajib diisi";
    if (!form.organization.trim()) e.organization = "Nama kafe/bisnis wajib diisi";
    if (!form.phone.trim()) e.phone = "Nomor WhatsApp wajib diisi";
    else if (!PHONE_RE.test(form.phone.replace(/[\s-]/g, "")))
      e.phone = "Format tidak valid (contoh: 08xx atau +628xx)";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!EMAIL_RE.test(form.email)) e.email = "Format email tidak valid";
    if (!form.jenisUsaha) e.jenisUsaha = "Jenis usaha wajib dipilih";
    if (!form.volumeLimbah) e.volumeLimbah = "Estimasi volume wajib dipilih";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <>
      <div className="mb-5">
        <h3
          className="font-display font-semibold text-[1.4rem] mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Identitas &amp; Profil Bisnis
        </h3>
        <p className="text-[0.8rem]" style={{ color: "var(--text-secondary)" }}>
          Data ini digunakan untuk proses verifikasi dan setup penjemputan.
        </p>
      </div>

      <div className="space-y-3">
        {/* PIC + Org */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Nama PIC *</FieldLabel>
            <FocusInput
              value={form.pic}
              onChange={(v) => onChange("pic", v)}
              placeholder="Nama kamu"
              error={errors.pic}
            />
            <FieldError msg={errors.pic} />
          </div>
          <div>
            <FieldLabel>Nama Kafe / Bisnis *</FieldLabel>
            <FocusInput
              value={form.organization}
              onChange={(v) => onChange("organization", v)}
              placeholder="Nama usaha"
              error={errors.organization}
            />
            <FieldError msg={errors.organization} />
          </div>
        </div>

        {/* Phone + Email */}
        <div>
          <FieldLabel>Nomor WhatsApp *</FieldLabel>
          <FocusInput
            value={form.phone}
            onChange={(v) => onChange("phone", v)}
            placeholder="+62 812 xxxx xxxx"
            type="tel"
            error={errors.phone}
          />
          <FieldError msg={errors.phone} />
        </div>
        <div>
          <FieldLabel>Email *</FieldLabel>
          <FocusInput
            value={form.email}
            onChange={(v) => onChange("email", v)}
            placeholder="nama@bisnis.com"
            type="email"
            error={errors.email}
          />
          <FieldError msg={errors.email} />
        </div>

        {/* Jenis usaha */}
        <div>
          <FieldLabel>Jenis Usaha *</FieldLabel>
          <select
            value={form.jenisUsaha}
            onChange={(e) => onChange("jenisUsaha", e.target.value)}
            style={{
              ...sharedInputStyle,
              appearance: "none",
              cursor: "pointer",
              borderColor: errors.jenisUsaha
                ? "rgba(248,113,113,0.5)"
                : "var(--border-default)",
            }}
          >
            <option value="" disabled style={{ background: "var(--bg-surface)" }}>
              Pilih jenis usaha...
            </option>
            {JENIS_USAHA_OPTIONS.map((opt) => (
              <option key={opt} value={opt} style={{ background: "var(--bg-surface)" }}>
                {opt}
              </option>
            ))}
          </select>
          <FieldError msg={errors.jenisUsaha} />
        </div>

        {/* Volume */}
        <div>
          <FieldLabel>Estimasi Volume Ampas / Hari *</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {VOLUME_OPTIONS.map((opt) => {
              const isSelected = form.volumeLimbah === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange("volumeLimbah", opt.value)}
                  className="py-2.5 px-3 rounded-xl text-left text-[0.78rem] transition-all duration-150"
                  style={{
                    background: isSelected
                      ? "rgba(196,149,106,0.1)"
                      : "var(--bg-card)",
                    border: `1px solid ${isSelected ? "rgba(196,149,106,0.3)" : "var(--border-default)"}`,
                    color: isSelected ? "var(--coffee-latte)" : "var(--text-secondary)",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <FieldError msg={errors.volumeLimbah} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-5">
        <button
          onClick={onBack}
          className="px-5 py-3.5 rounded-pill text-[0.82rem] transition-all duration-200"
          style={{
            background: "transparent",
            border: "1px solid var(--border-default)",
            color: "var(--text-muted)",
          }}
        >
          ← Kembali
        </button>
        <button
          onClick={() => { if (validate()) onNext(); }}
          className="flex-1 py-3.5 rounded-pill font-medium text-[0.88rem] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "var(--coffee-latte)", color: "var(--coffee-dark)" }}
        >
          Lanjutkan →
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Lokasi & konfirmasi
// ─────────────────────────────────────────────────────────────────────────────

function Step3Confirm({
  form,
  onChange,
  onSubmit,
  onBack,
  loading,
  submitError,
}: {
  form: FormData;
  onChange: (key: keyof FormData, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  submitError: string | null;
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const selectedPackage = PACKAGES.find((p) => p.id === form.type);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.city.trim()) e.city = "Kota wajib diisi";
    if (!form.alamat.trim()) e.alamat = "Alamat wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <>
      <div className="mb-5">
        <h3
          className="font-display font-semibold text-[1.4rem] mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Lokasi &amp; Konfirmasi
        </h3>
        <p className="text-[0.8rem]" style={{ color: "var(--text-secondary)" }}>
          Dibutuhkan untuk perencanaan jadwal penjemputan.
        </p>
      </div>

      {/* Summary pill */}
      {selectedPackage && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-4"
          style={{
            background: selectedPackage.accentBg,
            border: `1px solid ${selectedPackage.accentBorder}`,
          }}
        >
          <i
            className="fas fa-check-circle text-sm"
            style={{ color: selectedPackage.accent }}
          />
          <div>
            <p
              className="font-sans text-[0.82rem] font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {selectedPackage.tier}
            </p>
            <p
              className="font-mono text-[0.58rem] tracking-[0.06em]"
              style={{ color: "var(--text-muted)" }}
            >
              {form.pic} · {form.organization}
            </p>
          </div>
          <span
            className="font-mono text-[0.6rem] ml-auto px-2 py-0.5 rounded-pill"
            style={{
              background: `${selectedPackage.accent}18`,
              color: selectedPackage.accent,
            }}
          >
            {selectedPackage.badge}
          </span>
        </div>
      )}

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Kota *</FieldLabel>
            <FocusInput
              value={form.city}
              onChange={(v) => onChange("city", v)}
              placeholder="Makassar"
              error={errors.city}
            />
            <FieldError msg={errors.city} />
          </div>
          <div>
            <FieldLabel>Kecamatan</FieldLabel>
            <FocusInput
              value={form.alamat}
              onChange={(v) => onChange("alamat", v)}
              placeholder="Nama kecamatan"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Alamat Lengkap *</FieldLabel>
          <FocusInput
            value={form.alamat}
            onChange={(v) => onChange("alamat", v)}
            placeholder="Jl. Nama Jalan No. xx"
            error={errors.alamat}
          />
          <FieldError msg={errors.alamat} />
        </div>

        <div>
          <FieldLabel optional>Catatan tambahan</FieldLabel>
          <textarea
            value={form.message}
            onChange={(e) => onChange("message", e.target.value)}
            placeholder="Informasi lain yang ingin kamu sampaikan..."
            rows={3}
            style={{
              ...sharedInputStyle,
              resize: "none",
              lineHeight: "1.65",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--coffee-latte)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
          />
        </div>
      </div>

      {/* Submit error */}
      {submitError && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl mt-3"
          style={{
            background: "rgba(248,113,113,0.08)",
            border: "1px solid rgba(248,113,113,0.22)",
          }}
        >
          <i
            className="fas fa-exclamation-circle text-xs"
            style={{ color: "#f87171" }}
          />
          <p className="text-[0.8rem]" style={{ color: "#f87171" }}>
            {submitError}
          </p>
        </div>
      )}

      <div className="flex gap-2 mt-5">
        <button
          onClick={onBack}
          disabled={loading}
          className="px-5 py-3.5 rounded-pill text-[0.82rem] transition-all duration-200 disabled:opacity-40"
          style={{
            background: "transparent",
            border: "1px solid var(--border-default)",
            color: "var(--text-muted)",
          }}
        >
          ← Kembali
        </button>
        <button
          onClick={() => { if (validate()) onSubmit(); }}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-pill font-medium text-[0.88rem] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          style={{
            background: "linear-gradient(135deg, #2d5a2e, #1a3a1b)",
            border: "1px solid rgba(74,124,78,0.4)",
            color: "#f5efe6",
          }}
        >
          {loading ? (
            <>
              <i className="fas fa-circle-notch fa-spin text-sm" />
              Mengirim...
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane text-sm" />
              Kirim Pendaftaran
            </>
          )}
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Success state
// ─────────────────────────────────────────────────────────────────────────────

function SuccessState({
  form,
  onClose,
}: {
  form: FormData;
  onClose: () => void;
}) {
  const pkg = PACKAGES.find((p) => p.id === form.type);

  return (
    <div className="flex flex-col items-center text-center py-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          background: "rgba(45,90,46,0.15)",
          border: "1px solid rgba(122,171,126,0.3)",
        }}
      >
        <i className="fas fa-check text-2xl" style={{ color: "#7aab7e" }} />
      </div>

      <h3
        className="font-display font-semibold text-[1.5rem] mb-2"
        style={{ color: "var(--text-primary)" }}
      >
        Pendaftaran Diterima!
      </h3>

      <p className="text-[0.82rem] leading-[1.75] mb-4" style={{ color: "var(--text-secondary)" }}>
        Terima kasih,{" "}
        <strong style={{ color: "var(--text-primary)" }}>{form.pic}</strong>!
        Tim Rebru akan menghubungi kamu via WhatsApp dalam 1×24 jam kerja.
      </p>

      {pkg && (
        <div
          className="w-full rounded-xl px-4 py-3 mb-5"
          style={{
            background: pkg.accentBg,
            border: `1px solid ${pkg.accentBorder}`,
          }}
        >
          <p className="font-mono text-[0.6rem] tracking-[0.1em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
            Paket terdaftar
          </p>
          <p className="font-sans font-medium text-[0.88rem]" style={{ color: pkg.accent }}>
            {pkg.tier} — {pkg.badge}
          </p>
          <p className="font-mono text-[0.6rem] mt-0.5" style={{ color: "var(--text-muted)" }}>
            Status: Pending Review
          </p>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full py-3.5 rounded-pill text-[0.85rem] font-medium transition-all duration-200"
        style={{
          background: "var(--coffee-latte)",
          color: "var(--coffee-dark)",
        }}
      >
        Selesai
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bottom Sheet Form — mobile-first, 3 langkah
// ─────────────────────────────────────────────────────────────────────────────

function PartnershipBottomSheet({
  initialType,
  onClose,
}: {
  initialType?: FormData["type"];
  onClose: () => void;
}) {
  const [step, setStep] = useState<FormStep>(initialType ? 2 : 1);
  const [form, setForm] = useState<FormData>({
    ...EMPTY_FORM,
    type: initialType ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function setField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    setSubmitError(null);
    try {
      const payload: PartnerApplicationPayload = {
        name: form.pic,
        organization: form.organization,
        phone: form.phone,
        email: form.email,
        jenis_usaha: form.jenisUsaha,
        volume_limbah: form.volumeLimbah,
        city: form.city,
        kecamatan: "",          // IG form: simplified — kecamatan via alamat
        kelurahan: "",
        alamat: form.alamat,
        type: form.type as PartnerApplicationPayload["type"],
        message: form.message,
        status: "pending",
        source: "ig_landing",  // admin dapat filter submission asal IG
      };
      const { error } = await insertPartnerApplication(payload);
      if (error) throw error;
      setDone(true);
    } catch (err) {
      console.error("[IgPartnershipSection] submit error:", err);
      setSubmitError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const totalSteps = 3;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full rounded-t-3xl pb-safe"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderBottom: "none",
          animation: "fade-up 0.28s ease-out",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        {/* Handle */}
        <div className="sticky top-0 pt-4 pb-3 px-6 z-10" style={{ background: "var(--bg-elevated)" }}>
          <div
            className="w-10 h-1 rounded-full mx-auto mb-4"
            style={{ background: "var(--border-strong)" }}
          />

          {/* Progress bar */}
          {!done && (
            <div className="flex items-center gap-1.5 mb-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-400"
                  style={{
                    background: i < step ? "var(--coffee-latte)" : "var(--border-default)",
                  }}
                />
              ))}
            </div>
          )}
          {!done && (
            <p
              className="font-mono text-[0.55rem] tracking-[0.12em] uppercase text-right"
              style={{ color: "var(--text-muted)" }}
            >
              Langkah {step} dari {totalSteps}
            </p>
          )}
        </div>

        <div className="px-6 pb-8">
          {done ? (
            <SuccessState form={form} onClose={onClose} />
          ) : step === 1 ? (
            <Step1TierSelect
              selected={form.type}
              onSelect={(id) => setField("type", id)}
              onNext={() => setStep(2)}
            />
          ) : step === 2 ? (
            <Step2Identity
              form={form}
              onChange={setField}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          ) : (
            <Step3Confirm
              form={form}
              onChange={setField}
              onSubmit={handleSubmit}
              onBack={() => setStep(2)}
              loading={loading}
              submitError={submitError}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Section Export
// ─────────────────────────────────────────────────────────────────────────────

export default function IgPartnershipSection() {
  const { ref, inView } = useInView(0.08);
  const [showForm, setShowForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState<FormData["type"]>("");

  // Handle hash navigation from other sections (#partnership?tier=dampak)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tier = params.get("tier") as FormData["type"] | null;
    if (tier && ["kontributor", "dampak", "strategis"].includes(tier)) {
      setSelectedTier(tier);
    }
  }, []);

  function openForm(tierId?: FormData["type"]) {
    setSelectedTier(tierId ?? "");
    setShowForm(true);
  }

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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(196,149,106,0.04) 0%, transparent 70%)",
          }}
        />

        <div ref={ref} className="relative z-10 max-w-[480px] mx-auto">
          {/* Section label */}
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

          {/* Heading */}
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
            className={`text-[0.85rem] leading-[1.8] mb-8 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
            style={{ color: "var(--text-secondary)", transitionDelay: "240ms" }}
          >
            Rebru menyediakan solusi end-to-end — dari penjemputan hingga
            laporan dampak. Sistem kami menyesuaikan kebutuhan operasional
            bisnismu.
          </p>

          {/* Onboarding flow strip */}
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

          {/* Package cards — PACKAGES dari shared data, bukan TIERS lokal */}
          <div className="space-y-3">
            {PACKAGES.map((pkg, i) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-5 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  background: pkg.accentBg,
                  border: `${pkg.featured || pkg.premium ? "1.5px" : "1px"} solid ${pkg.accentBorder}`,
                  transitionDelay: `${380 + i * 130}ms`,
                }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    {(pkg.featured || pkg.premium) && (
                      <span
                        className="font-mono text-[0.55rem] tracking-[0.12em] uppercase px-2 py-0.5 rounded-pill inline-block mb-1.5"
                        style={{
                          background: `${pkg.accent}18`,
                          border: `1px solid ${pkg.accent}30`,
                          color: pkg.accent,
                        }}
                      >
                        {pkg.featured ? "✦ Most Popular" : "✦ Premium"}
                      </span>
                    )}
                    <h3
                      className="font-display font-semibold text-[1.15rem] leading-tight"
                      style={{ color: pkg.accent }}
                    >
                      {pkg.tier}
                    </h3>
                  </div>
                  <span
                    className="font-mono text-[0.62rem] tracking-[0.08em] px-2.5 py-1 rounded-pill flex-shrink-0 ml-2"
                    style={{
                      background: `${pkg.accent}18`,
                      border: `1px solid ${pkg.accent}28`,
                      color: pkg.accent,
                    }}
                  >
                    {pkg.badge}
                  </span>
                </div>

                <p
                  className="text-[0.8rem] leading-[1.65] mb-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {pkg.tagline}
                </p>

                {/* Features */}
                <ul className="space-y-1.5 mb-4">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span
                        className="text-[0.6rem] mt-0.5 flex-shrink-0"
                        style={{ color: pkg.accent }}
                      >
                        ✓
                      </span>
                      <span
                        className="text-[0.78rem] leading-[1.5]"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => openForm(pkg.id as FormData["type"])}
                  className="w-full py-3 rounded-pill font-sans font-medium text-[0.85rem] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={
                    pkg.featured
                      ? {
                          background: "var(--coffee-latte)",
                          color: "var(--coffee-dark)",
                        }
                      : {
                          background: "transparent",
                          border: `1px solid ${pkg.accentBorder}`,
                          color: pkg.accent,
                        }
                  }
                >
                  Daftar Sekarang
                </button>
              </div>
            ))}
          </div>

          {/* T&C note */}
          <p
            className={`text-center font-mono text-[0.58rem] tracking-[0.1em] uppercase mt-6 transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}
            style={{ color: "var(--text-muted)", transitionDelay: "780ms" }}
          >
            Minimum komitmen 3 bulan untuk Mitra Dampak &amp; Mitra Strategis
          </p>
        </div>
      </section>

      {/* Bottom sheet form */}
      {showForm && (
        <PartnershipBottomSheet
          initialType={selectedTier || undefined}
          onClose={() => { setShowForm(false); setSelectedTier(""); }}
        />
      )}
    </>
  );
}
