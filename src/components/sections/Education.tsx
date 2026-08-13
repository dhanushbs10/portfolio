"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getEducation } from "@/lib/data";
import type { EducationEntry } from "@/lib/types";

export function Education() {
  const entries: EducationEntry[] = getEducation();

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

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {entries.map((entry: EducationEntry) => (
            <AnimatedReveal key={entry.id}>
              <div className="card p-6 flex flex-col gap-4">
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
                <div className="flex flex-wrap gap-2">
                  {entry.coursework.map((c, i) => (
                    <span
                      key={`${entry.id}-coursework-${i}`}
                      className="px-2.5 py-1 rounded bg-surface-overlay border border-border-subtle font-mono text-[11px] text-text-secondary"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
