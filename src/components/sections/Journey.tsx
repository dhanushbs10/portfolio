"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Briefcase } from "lucide-react";
import { getJourney } from "@/lib/data";
import type { JourneyMilestone } from "@/lib/types";

export function Journey() {
  const milestones: JourneyMilestone[] = getJourney();

  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="02 — Experience"
            title="Professional Journey"
            subtitle="My path from curiosity to focused specialization in cybersecurity and networking."
          />
        </AnimatedReveal>

        <div className="relative mt-14 flex flex-col gap-0">
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border-subtle" />

          {milestones.map((entry: JourneyMilestone) => (
            <AnimatedReveal key={entry.id}>
              <div className="relative pl-10 pb-12 last:pb-0">
                <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-accent-interactive/80 border-2 border-surface-base" />

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs text-accent-interactive tracking-wider">
                    {entry.date}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Briefcase size={15} className="text-accent-structure-light" />
                    {entry.title}
                  </h3>
                  <p className="text-sm text-accent-structure-light">
                    {entry.role} · {entry.org}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
