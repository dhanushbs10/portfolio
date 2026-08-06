"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Trophy } from "lucide-react";

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "[#]", label: "CTF placement or ranking" },
  { value: "[#]", label: "Open source contributions" },
  { value: "[#]", label: "Years of experience" },
  { value: "[#]", label: "Projects shipped" },
];

export function Achievements() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-4xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="10 — Achievements"
            title="By the Numbers"
            subtitle="A few stats and highlights worth calling out."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <AnimatedReveal key={stat.label}>
              <div className="card p-6 flex flex-col items-center text-center gap-3">
                <Trophy size={22} className="text-accent-interactive" />
                <span className="font-display text-3xl font-semibold text-text-primary">
                  {stat.value}
                </span>
                <span className="font-mono text-[11px] tracking-wide text-text-tertiary uppercase">
                  {stat.label}
                </span>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
