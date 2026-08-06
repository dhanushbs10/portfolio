"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { cn } from "@/lib/utils";

// ── Particle canvas (GPU-cheap: ≤50 nodes, simple line threshold) ──
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Respect reduced motion: render once, no animation loop
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      drawStatic();
      return;
    }

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const COUNT = 45;
    const CONNECT_DIST = 140;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Seed particles
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
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // connections
      ctx.strokeStyle = "rgba(215, 228, 242, 0.07)";
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update positions
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }

      // Draw connections (cheap: early-out on distance check)
      ctx.strokeStyle = "rgba(215, 228, 242, 0.06)";
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = dx * dx + dy * dy; // squared distance avoids sqrt
          if (d < CONNECT_DIST * CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      ctx.fillStyle = "rgba(215, 228, 242, 0.3)";
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    }

    if (!mq.matches) animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
      style={{ opacity: 0.7 }}
    />
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const cueOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const contentY = useTransform(scrollY, [0, 300], [0, -60]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle background */}
      <ParticleCanvas />

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, transparent 0%, var(--surface-base) 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <AnimatedReveal>
          <div className="flex flex-col gap-6">
            {/* Name */}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-text-primary">
              Dhanush{" "}
              <span className="text-accent-interactive">Nagishetti</span>
            </h1>

            {/* Role */}
            <p className="mono-label text-accent-structure-light text-sm sm:text-base">
              Full-Stack Developer · Infrastructure Enthusiast
            </p>

            {/* Thesis */}
            <p className="max-w-xl mx-auto font-body text-lg sm:text-xl text-text-secondary leading-relaxed">
              Building systems that are reliable, observable, and a pleasure to
              operate — from cloud infrastructure to the browser.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <a
                href="/projects"
                className="bg-accent-interactive hover:bg-accent-interactive-hover text-surface-base rounded px-6 py-3 font-mono text-sm font-medium tracking-wide transition-colors"
              >
                View Projects
              </a>
              <a
                href="/about"
                className="border border-accent-structure text-accent-structure-light hover:bg-accent-structure hover:text-text-primary rounded px-6 py-3 font-mono text-sm tracking-wide transition-colors"
              >
                About Me
              </a>
            </div>
          </div>
        </AnimatedReveal>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-text-tertiary">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-text-tertiary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
