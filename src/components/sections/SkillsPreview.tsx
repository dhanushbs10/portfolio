"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getSkillsByCategory } from "@/lib/data";

const CATEGORY_LABELS: Record<string, string> = {
  cybersecurity: "Cybersecurity",
  networking: "Networking",
  "operating-systems": "Operating Systems",
  programming: "Programming",
  "web-development": "Web Development",
  tools: "Tools",
  "version-control": "Version Control",
};

const CATEGORY_ORDER = [
  "cybersecurity",
  "networking",
  "operating-systems",
  "programming",
  "web-development",
  "tools",
  "version-control",
];

function tierClass(proficiency: string): string {
  if (proficiency === "proficient") {
    return "border-accent-interactive/50 text-accent-interactive bg-accent-interactive/10";
  }
  if (proficiency === "comfortable") {
    return "border-border-default text-text-secondary bg-surface-overlay";
  }
  return "border-border-subtle text-text-tertiary bg-surface-sunken";
}

function SkillChip({ name, proficiency }: { name: string; proficiency: string }) {
  return (
    <span
      className={[
        "px-2.5 py-1 rounded font-mono text-[11px] border",
        tierClass(proficiency),
      ].join(" ")}
    >
      {name}
    </span>
  );
}

export function SkillsPreview() {
  const categories = CATEGORY_ORDER;

  return (
    <section className="section-container">
      <div className="mx-auto max-w-4xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="Skills"
            title="Areas of Focus"
            subtitle="Core strengths highlighted — still growing across the rest."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catSkills = getSkillsByCategory(cat).sort((a, b) => {
              const order = { proficient: 0, comfortable: 1, learning: 2 };
              return (order[a.proficiency] ?? 3) - (order[b.proficiency] ?? 3);
            });

            if (catSkills.length === 0) return null;

            return (
              <AnimatedReveal key={cat}>
                <div className="card p-5 flex flex-col gap-3">
                  <h3 className="font-display text-sm font-semibold text-text-primary">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {catSkills.map((skill) => (
                      <SkillChip
                        key={skill.id}
                        name={skill.name}
                        proficiency={skill.proficiency}
                      />
                    ))}
                  </div>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
