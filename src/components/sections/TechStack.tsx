"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { useState, useEffect } from "react";
import { IconImage } from "@/components/IconImage";
import { TECH_STACK_TOOLS } from "@/lib/techIcons";

const TOOLS = TECH_STACK_TOOLS;

export function TechStack() {
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) {
    return (
      <section className="section-container !bg-transparent">
        <div className="mx-auto max-w-4xl !bg-transparent">
          <AnimatedReveal>
            <SectionHeading
              eyebrow="Tools"
              title="Tech Stack"
              subtitle="The tools I reach for, hover any icon to see its name."
            />
          </AnimatedReveal>
          <div className="mt-10 flex flex-wrap gap-5 justify-center">
            {TOOLS.map((t) => (
              <a
                key={t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-10 h-10 shrink-0 overflow-visible"
                aria-label={t.name}
              >
                <IconImage name={t.name} width={22} height={22} />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] leading-snug px-2 py-0.5 rounded bg-surface-overlay/90 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  {t.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-container overflow-hidden !bg-transparent">
      <div className="mx-auto max-w-4xl !bg-transparent">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="Tools"
            title="Tech Stack"
            subtitle="The tools I reach for - hover any icon to see its name."
          />
        </AnimatedReveal>

        <div
          className="mt-10 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          <div
            className="flex gap-6 py-2"
            style={{
              animation: "marqueeScroll 50s linear infinite",
              animationPlayState: paused ? "paused" : "running",
              width: "max-content",
  minWidth: "none",
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {[...TOOLS, ...TOOLS].map((t, i) => (
              <a
                key={`${t.name}-${i}`}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-10 h-10 shrink-0 overflow-visible"
                aria-label={t.name}
              >
                <IconImage name={t.name} width={22} height={22} />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] leading-snug px-2 py-0.5 rounded bg-surface-overlay/90 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  {t.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
