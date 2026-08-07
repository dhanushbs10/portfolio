"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import FaultyTerminal from "@/components/FaultyTerminal";

export function Hero() {
  const { scrollY } = useScroll();
  const cueOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const contentY = useTransform(scrollY, [0, 300], [0, -60]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* FaultyTerminal background */}
      <div className="absolute inset-0 z-0">
        <FaultyTerminal
          scale={1.5}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.5}
          pause={false}
          scanlineIntensity={0.35}
          glitchAmount={1}
          flickerAmount={1}
          noiseAmp={1}
          chromaticAberration={0}
          dither={0}
          curvature={0.1}
          tint="#0891b2"
          mouseReact
          mouseStrength={0.5}
          pageLoadAnimation
          brightness={0.85}
        />
      </div>

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(2,6,23,0.78) 0%, rgba(2,6,23,0.95) 100%)",
        }}
      />

      {/* Content — always visible, no boot animation */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Terminal size={14} className="text-accent-interactive" />
            <span className="sys-label">profile.dhanush — loaded</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-text-primary">
            Dhanush{" "}
            <span className="text-accent-interactive">B S</span>
          </h1>

          <div className="font-mono text-sm sm:text-base text-accent-structure-light">
            <span className="text-text-tertiary">$</span> whoami
            <br />
            <span className="text-text-secondary">
              Diploma in CSE · Cybersecurity &amp; Networking · Bengaluru, IN
            </span>
          </div>

          <p className="max-w-xl mx-auto font-body text-lg sm:text-xl text-text-primary leading-relaxed">
            Building reliable systems and securing networks — from bare-metal
            infrastructure to practical cybersecurity labs.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <a
              href="/projects"
              className="group relative inline-flex items-center gap-2 bg-accent-interactive hover:bg-accent-interactive-hover text-surface-base rounded-md px-6 py-3 font-mono text-sm font-medium tracking-wide transition-all duration-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              ./view-projects
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
            <a
              href="/about"
              className="group inline-flex items-center gap-2 border border-accent-interactive/50 text-accent-interactive hover:bg-accent-interactive/10 hover:border-accent-interactive rounded-md px-6 py-3 font-mono text-sm tracking-wide transition-all duration-200"
            >
              cat about.md
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
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
    </section>
  );
}
