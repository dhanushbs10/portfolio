"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getSkillsByCategory } from "@/lib/data";

type CategoryId = "cybersecurity" | "networking";

const CATEGORY_ORDER: CategoryId[] = ["cybersecurity", "networking"];

const HEADING: Record<CategoryId, string> = {
  cybersecurity: "Cybersecurity",
  networking: "Networking",
};

export function SkillsPreview() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="Skills"
            title="Core Competencies"
            subtitle="Cybersecurity and networking fundamentals, the foundation of everything else."
          />
        </AnimatedReveal>

        <div className="mt-12 flex flex-col gap-10">
          {CATEGORY_ORDER.map((cat) => {
            const items = getSkillsByCategory(cat);
            if (items.length === 0) return null;

            const sorted = [...items].sort((a, b) => {
              const order = { proficient: 0, comfortable: 1, learning: 2 };
              return (order[a.proficiency] ?? 3) - (order[b.proficiency] ?? 3);
            });

            return (
              <AnimatedReveal key={cat}>
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-text-tertiary">
                    {HEADING[cat]}
                  </span>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    {sorted.map((s) => s.name).join("  ·  ")}
                  </p>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
