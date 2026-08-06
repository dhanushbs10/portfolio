"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ── Surface swatches ───────────────────────────────────────
const surfaces = [
  { label: "base", value: "bg-surface-base border border-border-default" },
  { label: "raised", value: "bg-surface-raised border border-border-subtle" },
  { label: "overlay", value: "bg-surface-overlay border border-border-subtle" },
  { label: "sunken", value: "bg-surface-sunken border border-border-subtle" },
];

// ── Accent swatches ────────────────────────────────────────
const accents = [
  { label: "structure", cls: "bg-accent-structure" },
  { label: "structure-light", cls: "bg-accent-structure-light" },
  { label: "structure-muted", cls: "bg-accent-structure-muted" },
  { label: "interactive", cls: "bg-accent-interactive" },
  { label: "interactive-hover", cls: "bg-accent-interactive-hover" },
];

// ── Text colors ────────────────────────────────────────────
const texts = [
  { label: "primary", cls: "text-text-primary" },
  { label: "secondary", cls: "text-text-secondary" },
  { label: "tertiary", cls: "text-text-tertiary" },
  { label: "inverse", cls: "text-text-inverse" },
];

// ── Status colors ──────────────────────────────────────────
const statuses = [
  { label: "success", cls: "bg-success" },
  { label: "warning", cls: "bg-warning" },
  { label: "error", cls: "bg-error" },
];

// ── Type scale ─────────────────────────────────────────────
const typeScale = [
  { label: "5xl", cls: "text-5xl font-display font-semibold" },
  { label: "4xl", cls: "text-4xl font-display font-semibold" },
  { label: "3xl", cls: "text-3xl font-display font-semibold" },
  { label: "2xl", cls: "text-2xl font-display" },
  { label: "xl", cls: "text-xl font-display" },
  { label: "base", cls: "text-base font-body" },
  { label: "sm", cls: "text-sm font-body" },
  { label: "xs", cls: "text-xs font-mono" },
];

// ── Spacing tokens ─────────────────────────────────────────
const spacingTokens = [
  "var(--section-padding)",
  "var(--section-padding-sm)",
  "var(--section-padding-lg)",
  "var(--component-padding)",
];

// ── Motion tokens ──────────────────────────────────────────
const motionTokens = [
  { label: "Standard ease", value: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { label: "Emphasized ease", value: "cubic-bezier(0.16, 1, 0.3, 1)" },
  { label: "durationFast", value: "150ms" },
  { label: "durationNormal", value: "250ms" },
  { label: "durationSlow", value: "400ms" },
  { label: "durationSlower", value: "600ms" },
];

// ── Button variants ────────────────────────────────────────
const buttonVariants = [
  {
    label: "primary",
    cls:
      "bg-accent-structure hover:bg-accent-structure-light text-text-primary rounded px-5 py-2.5 font-mono text-sm tracking-wide transition-colors",
  },
  {
    label: "interactive",
    cls:
      "bg-accent-interactive hover:bg-accent-interactive-hover text-surface-base rounded px-5 py-2.5 font-mono text-sm font-medium tracking-wide transition-colors",
  },
  {
    label: "outline",
    cls:
      "border border-accent-interactive text-accent-interactive hover:bg-accent-interactive hover:text-surface-base rounded px-5 py-2.5 font-mono text-sm tracking-wide transition-colors",
  },
  {
    label: "ghost",
    cls:
      "text-text-secondary hover:text-text-primary hover:bg-surface-raised rounded px-5 py-2.5 font-mono text-sm tracking-wide transition-colors",
  },
];

// ── Grid pattern demo ──────────────────────────────────────
const gridPatterns = [
  { label: "grid", cls: "bg-grid" },
  { label: "dots", cls: "bg-dots" },
];

export default function KitchenSinkPage() {
  return (
    <div className="section-container">
      <div className="mx-auto max-w-5xl flex flex-col gap-16">
        <SectionHeading
          eyebrow="Dev"
          title="Kitchen Sink"
          subtitle="Visual confirmation of every design token."
          align="center"
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-16"
        >
          {/* ── SURFACES ─────────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">Surfaces</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {surfaces.map((s) => (
                <motion.div key={s.label} variants={fadeUp} className="flex flex-col gap-2">
                  <div className={cn("h-24 rounded-md", s.value)} />
                  <span className="font-mono text-xs text-text-tertiary">
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── ACCENTS ──────────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">Accents</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {accents.map((a) => (
                <motion.div
                  key={a.label}
                  variants={fadeUp}
                  className="flex flex-col gap-2"
                >
                  <div className={cn("h-20 rounded-md", a.cls)} />
                  <span className="font-mono text-xs text-text-tertiary">
                    --{a.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── TEXT COLORS ───────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">Text Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {texts.map((t) => (
                <motion.div
                  key={t.label}
                  variants={fadeUp}
                  className={cn(
                    "card px-5 py-4 flex flex-col gap-1",
                    t.cls
                  )}
                >
                  <span className="font-body text-lg">The quick brown fox</span>
                  <span className="font-mono text-xs opacity-60">
                    --text-{t.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── STATUS COLORS ─────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">Status</h3>
            <div className="grid grid-cols-3 gap-4">
              {statuses.map((s) => (
                <motion.div
                  key={s.label}
                  variants={fadeUp}
                  className="flex flex-col gap-2"
                >
                  <div className={cn("h-12 rounded-md", s.cls)} />
                  <span className="font-mono text-xs text-text-tertiary">
                    --{s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── TYPE SCALE ────────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">Type Scale</h3>
            <div className="card p-8 flex flex-col gap-3">
              {typeScale.map((t) => (
                <div
                  key={t.label}
                  className={cn("leading-tight text-text-primary", t.cls)}
                >
                  <span className="font-mono text-xs text-text-tertiary mr-4">
                    {t.label}
                  </span>
                  Structured Signal
                </div>
              ))}
              <p className="body-base text-text-secondary mt-2">
                Body text — Inter, 16px, leading-relaxed. The default reading
                size for paragraphs, descriptions, and long-form content.
              </p>
              <p className="font-mono text-xs text-text-tertiary mt-2">
                Mono reserved for: code, labels, specs, stats.
              </p>
            </div>
          </section>

          {/* ── BUTTON VARIANTS ───────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">Button Variants</h3>
            <div className="flex flex-wrap gap-4">
              {buttonVariants.map((btn) => (
                <button key={btn.label} className={btn.cls}>
                  {btn.label}
                </button>
              ))}
            </div>
          </section>

          {/* ── SECTION HEADING COMP ──────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">
              SectionHeading Component
            </h3>
            <div className="card p-8">
              <SectionHeading
                eyebrow="Example Section"
                title="This is what every section heading looks like"
                subtitle="Subtitle text sits below the title in text-secondary, providing context without hierarchy competition."
              />
            </div>
          </section>

          {/* ── SPACING TOKENS ────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">Spacing / Rhythm</h3>
            <div className="card p-6 flex flex-col gap-3">
              {spacingTokens.map((token) => (
                <div key={token} className="flex items-center gap-4">
                  <div
                    className="h-4 bg-accent-interactive/60 rounded-sm"
                    style={{ width: token }}
                  />
                  <code className="font-mono text-xs text-text-tertiary">
                    {token}
                  </code>
                </div>
              ))}
            </div>
          </section>

          {/* ── MOTION TOKENS ─────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">Motion Tokens</h3>
            <div className="card p-6 flex flex-col gap-2">
              {motionTokens.map((m) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between font-mono text-sm"
                >
                  <span className="text-text-secondary">{m.label}</span>
                  <code className="text-text-tertiary text-xs">{m.value}</code>
                </div>
              ))}
            </div>
          </section>

          {/* ── GRID PATTERNS ─────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">Background Patterns</h3>
            <div className="grid grid-cols-2 gap-4">
              {gridPatterns.map((p) => (
                <div
                  key={p.label}
                  className={cn(
                    "rounded-md border border-border-subtle h-32",
                    p.cls
                  )}
                />
              ))}
            </div>
          </section>

          {/* ── ANIMATION DEMO ────────────────────────────── */}
          <section className="flex flex-col gap-4">
            <h3 className="mono-label text-text-secondary">
              Animation Preview
            </h3>
            <div className="card p-8 flex flex-wrap gap-6 items-center">
              {[
                { label: "fadeUp", x: 0, y: 20, o: 0 },
                { label: "fadeIn", x: -10, y: 0, o: 0 },
                { label: "slideRight", x: -20, y: 0, o: 0.5 },
              ].map((demo) => (
                <motion.div
                  key={demo.label}
                  initial={{ opacity: demo.o, x: demo.x, y: demo.y }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="px-4 py-2 bg-surface-overlay rounded-md font-mono text-xs text-accent-interactive"
                >
                  {demo.label}
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
