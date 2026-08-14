"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import HeroBackground from "./HeroBackground";
import DecryptedName from "@/components/shared/DecryptedName";

export function Hero() {
  const { scrollY } = useScroll();
  const cueOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  const contentY = useTransform(scrollY, [0, 300], [0, -60]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background layer */}
      <HeroBackground />

      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(2,6,23,0.78) 0%, rgba(2,6,23,0.95) 100%)",
        }}
      />

      {/* Content, always visible, no boot animation */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto max-w-3xl px-6 text-center"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {/* <Terminal size={14} className="text-accent-interactive" /> */}
            {/* <span className="eyebrow">profile.dhanush, loaded</span> */}
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-text-primary">
            <DecryptedName text="Dhanush B S" />
          </h1>

          <div className="font-mono text-sm sm:text-base text-accent-structure-light">
            <span className="text-text-tertiary">$</span> whoami
            <br />
            <span className="text-text-secondary">
              Diploma in CSE · Cybersecurity &amp; Networking · Bengaluru, IN
            </span>
          </div>

          <p className="max-w-xl mx-auto font-body text-lg sm:text-xl text-text-primary leading-relaxed">
            Building reliable systems and securing networks, from bare-metal
            infrastructure to practical cybersecurity labs.
          </p>

          <div className="flex flex-wrap gap-6 justify-center pt-4">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 font-mono text-sm text-text-secondary hover:text-accent-interactive transition-colors duration-200"
            >
              ./view-projects
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                →
              </span>
            </Link>
            <Link
              href="/about"
              className="group inline-flex items-center gap-1.5 font-mono text-sm text-text-secondary hover:text-accent-interactive transition-colors duration-200"
            >
              cat about.md
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                →
              </span>
            </Link>
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
