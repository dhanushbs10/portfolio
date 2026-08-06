"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Trophy } from "lucide-react";
import { getAchievements } from "@/lib/data";
import type { Achievement } from "@/lib/types";

export function Achievements() {
  const items: Achievement[] = getAchievements();

  if (items.length === 0) {
    return (
      <section className="section-container">
        <div className="mx-auto max-w-4xl">
          <AnimatedReveal>
            <SectionHeading
              eyebrow="10 — Achievements"
              title="By the Numbers"
              subtitle="Building toward my first competition entries and milestones."
            />
          </AnimatedReveal>
          <p className="mt-8 text-text-secondary">
            No achievements yet — filling these in as I earn them. Coming soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-container">
      <div className="mx-auto max-w-4xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="[SYS.ACHIEV]"
            title="By the Numbers"
            subtitle="A few stats and highlights worth calling out."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item: Achievement) => (
            <AnimatedReveal key={item.id}>
              <div className="card p-6 flex flex-col items-center text-center gap-3">
                <Trophy size={22} className="text-accent-interactive" />
                <span className="font-display text-3xl font-semibold text-text-primary leading-none">
                  {item.title}
                </span>
                <span className="font-mono text-[11px] tracking-wide text-text-tertiary uppercase">
                  {item.description}
                </span>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
