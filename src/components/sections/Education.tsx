"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getEducation } from "@/lib/data";
import type { EducationEntry } from "@/lib/types";
import { useState, useEffect } from "react";

export function Education() {
  const entries: EducationEntry[] = getEducation();
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="EDU.LOG"
            title="Academic Background"
            subtitle="Formal education and structured learning that built my foundation."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {entries.map((entry: EducationEntry) => (
            <AnimatedReveal key={entry.id} className="h-full">
              <div className="card p-6 flex flex-col gap-4 h-full">
                <div>
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {entry.program}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {entry.institution}
                  </p>
                  <span className="font-mono text-xs text-accent-interactive mt-1 block">
                    {entry.startDate}
                    {entry.endDate ? `, ${entry.endDate}` : ", Present"}
                  </span>
                </div>

                {entry.highlights && entry.highlights.length > 0 && (
                  <div
                    className="relative overflow-hidden"
                    style={{
                      maskImage:
                        "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                    }}
                  >
                    <ul
                      className="flex gap-3"
                      style={{
                        animation: "marqueeScroll 30s linear infinite",
                        animationPlayState: paused ? "paused" : "running",
                        width: "max-content",
                      }}
                      onMouseEnter={() => setPaused(true)}
                      onMouseLeave={() => setPaused(false)}
                    >
                      {[...(entry.highlights || []), ...(entry.highlights || [])].map((h, i) => (
                        <li
                          key={i}
                          className="font-mono text-xs text-text-secondary whitespace-nowrap flex-shrink-0"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className="relative overflow-hidden"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                  }}
                >
                  <div
                    className="flex gap-2"
                    style={{
                      animation: "marqueeScroll 40s linear infinite",
                      animationPlayState: paused ? "paused" : "running",
                      width: "max-content",
                    }}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                  >
                    {[...(entry.coursework || []), ...(entry.coursework || [])].map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-surface-overlay border border-border-subtle font-mono text-[11px] text-text-secondary whitespace-nowrap flex-shrink-0"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedReveal>
          ))}
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
