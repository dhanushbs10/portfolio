"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import HeroBackground from "./HeroBackground";
import DecryptedName from "@/components/shared/DecryptedName";

const TICKER = [
  "CYBERSECURITY",
  "NETWORKING",
  "LINUX",
  "HOME LAB",
  "PXE BOOT",
  "WIRESHARK",
  "NMAP",
  "SHELL SCRIPTS",
  "BARE-METAL",
  "TRUST BOUNDARIES",
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const line = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  const { scrollY } = useScroll();
  const cueOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const contentOpacity = useTransform(scrollY, [0, 220], [1, 0]);
  const contentY = useTransform(scrollY, [0, 300], [0, -60]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <HeroBackground />

      {/* Warm CRT readability veil */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 82% 72% at 50% 45%, rgba(11,10,8,0.72) 0%, rgba(11,10,8,0.94) 100%)",
        }}
      />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6"
        >
          {/* Terminal whisper */}
          <motion.p
            variants={line}
            className="font-mono text-[11px] tracking-[0.28em] uppercase text-text-tertiary"
          >
            <span className="text-accent-interactive">$</span> whoami
            <span className="cursor-block--accent cursor-block" />
          </motion.p>

          {/* Massive display name */}
          <motion.h1
            variants={line}
            className="font-display font-semibold uppercase leading-[0.88] tracking-[-0.03em] text-text-primary"
          >
            <span className="block text-[clamp(4rem,15vw,11rem)]">
              <DecryptedName text="DHANUSH" className="inline-block" />
            </span>
            <span className="mt-1 block text-[clamp(2.6rem,9.5vw,7rem)] text-accent-interactive">
              B&nbsp;&nbsp;S<span className="cursor-block cursor-block--accent" />
            </span>
          </motion.h1>

          {/* Role line */}
          <motion.p
            variants={line}
            className="font-mono text-xs tracking-wider uppercase text-text-secondary sm:text-sm"
          >
            &gt; cybersecurity · networking · infrastructure
          </motion.p>

          {/* Intro */}
          <motion.p
            variants={line}
            className="mx-auto max-w-xl font-body text-lg leading-relaxed text-text-primary sm:text-xl"
          >
            Building reliable systems and securing networks, from bare-metal
            infrastructure to practical cybersecurity labs.
          </motion.p>

          {/* Commands */}
          <motion.div
            variants={line}
            className="flex flex-wrap items-center justify-center gap-6 pt-2"
          >
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
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        style={{ opacity: cueOpacity }}
        className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-text-tertiary uppercase">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={15} className="text-text-tertiary" />
        </motion.div>
      </motion.div>

      {/* Boot-log ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-border-subtle bg-surface-sunken/60 py-3"
      >
        <div className="marquee">
          <div className="marquee-track">
            {[0, 1].map((group) => (
              <div
                key={group}
                className="flex shrink-0 items-center gap-8 pr-8 font-mono text-xs tracking-[0.22em] text-text-tertiary"
                aria-hidden={group === 1}
              >
                {TICKER.map((item) => (
                  <span key={item} className="flex items-center gap-8">
                    {item}
                    <span className="text-accent-interactive/70">{"//"}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}