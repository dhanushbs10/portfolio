"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Terminal } from "lucide-react";
import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import FaultyTerminal from "@/components/shared/FaultyTerminal";
import { cn } from "@/lib/utils";

// ── Boot sequence lines ──────────────────────────────────────
const BOOT_LINES = [
  "[BOOT] Initializing kernel...",
  "[BOOT] Loading modules: networking, security, infra...",
  "[SYS] Memory check: 12 GB DDR3 — OK",
  "[NET] Interface eth0: connected",
  "[NET] Interface wlan0: standby",
  "[SEC] Firewall rules loaded: 42 active",
  "[OK] System ready.",
  "",
];

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= BOOT_LINES.length) {
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleLines((l) => l + 1), 220);
    return () => clearTimeout(t);
  }, [visibleLines, onComplete]);

  return (
    <div className="font-mono text-xs sm:text-sm space-y-0.5 text-left max-w-lg mx-auto">
      {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
        const isLast = i === visibleLines - 1;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
            className={cn(
              line.startsWith("[OK]") && "text-success",
              line.startsWith("[ERR]") && "text-error",
              line.startsWith("[NET]") && "text-accent-interactive",
              line.startsWith("[SEC]") && "text-warning",
              line.startsWith("[SYS]") && "text-accent-structure-light"
            )}
          >
            {line}
            {isLast && <span className="cursor-blink ml-0.5" />}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main Hero ────────────────────────────────────────────────
type Phase = "booting" | "loaded";

export function Hero() {
  const [phase, setPhase] = useState<Phase>("booting");
  const { scrollY } = useScroll();
  const cueOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const contentY = useTransform(scrollY, [0, 300], [0, -60]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FaultyTerminal
        scale={1.5}
        gridMul={[2, 1]}
        digitSize={1.2}
        scanlineIntensity={0.5}
        glitchAmount={1}
        flickerAmount={1}
        noiseAmp={1}
        curvature={0.1}
        tint="#22d3ee"
        mouseReact
        mouseStrength={0.5}
        pageLoadAnimation
        brightness={0.9}
        className="absolute inset-0 z-[1]"
      />
      <div className="scanlines absolute inset-0 z-[5] pointer-events-none opacity-20" />

      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, transparent 0%, var(--surface-base) 100%)",
        }}
      />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        {phase === "booting" ? (
          <BootSequence onComplete={() => setPhase("loaded")} />
        ) : (
          <AnimatedReveal>
            <div className="flex flex-col gap-6">
              {/* Terminal-style label */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Terminal size={14} className="text-accent-interactive" />
                <span className="sys-label">profile.dhanush — loaded</span>
              </div>

              {/* Name */}
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-text-primary">
                Dhanush{" "}
                <span className="text-accent-interactive">B S</span>
              </h1>

              {/* Role / tagline */}
              <div className="font-mono text-sm sm:text-base text-accent-structure-light">
                <span className="text-text-tertiary">$</span> whoami
                <br />
                <span className="text-text-secondary">
                  Diploma in CSE · Cybersecurity &amp; Networking · Bengaluru, IN
                </span>
              </div>

              {/* One-line thesis */}
              <p className="max-w-xl mx-auto font-body text-lg sm:text-xl text-text-secondary leading-relaxed">
                Building reliable systems and securing networks — from bare-metal
                infrastructure to practical cybersecurity labs.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <a
                  href="/projects"
                  className="bg-accent-interactive hover:bg-accent-interactive-hover text-surface-base rounded px-6 py-3 font-mono text-sm font-medium tracking-wide transition-colors"
                >
                  ./view-projects
                </a>
                <a
                  href="/about"
                  className="border border-accent-structure text-accent-structure-light hover:bg-accent-structure hover:text-text-primary rounded px-6 py-3 font-mono text-sm tracking-wide transition-colors"
                >
                  cat about.md
                </a>
              </div>
            </div>
          </AnimatedReveal>
        )}
      </motion.div>

      {/* Scroll cue */}
      {phase === "loaded" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ opacity: cueOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase text-text-tertiary">
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown size={16} className="text-text-tertiary" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
