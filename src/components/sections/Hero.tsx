"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Terminal } from "lucide-react";
import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
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

// ── Particle canvas ──────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) { drawStatic(); return; }

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const COUNT = 45;
    const CONNECT_SQ = 140 * 140;

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }

    function drawStatic() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(215, 228, 242, 0.25)";
      for (const p of particles) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill(); }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      }
      ctx.strokeStyle = "rgba(215, 228, 242, 0.06)"; ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          if (dx * dx + dy * dy < CONNECT_SQ) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(215, 228, 242, 0.3)";
      for (const p of particles) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2); ctx.fill(); }
      animId = requestAnimationFrame(animate);
    }

    if (!mq.matches) animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ opacity: 0.7 }} />;
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
      <ParticleCanvas />
      <div className="scanlines absolute inset-0 z-[5] pointer-events-none opacity-30" />

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
