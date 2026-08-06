"use client";

import { useState } from "react";
import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillCategory {
  name: string;
  placeholder: boolean;
  items: string[];
}

const SKILLS: SkillCategory[] = [
  {
    name: "Languages",
    placeholder: true,
    items: ["TypeScript", "Go", "Python", "Rust (learning)", "[Language]"],
  },
  {
    name: "Frontend",
    placeholder: true,
    items: ["Next.js", "React", "Tailwind", "[Framework]"],
  },
  {
    name: "Infrastructure",
    placeholder: true,
    items: ["Docker", "Kubernetes", "Terraform", "[Tool]"],
  },
  {
    name: "Tools & Practices",
    placeholder: true,
    items: ["Git", "CI/CD", "Linux", "[Tool/Practice]"],
  },
];

export function SkillsPreview() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="section-container">
      <div className="mx-auto max-w-4xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="04 — Skills"
            title="Areas of Focus"
            subtitle="Static preview — full categorized system with proficiency levels coming in a later chapter."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKILLS.map((cat) => {
            const isOpen = open === cat.name;
            return (
              <AnimatedReveal key={cat.name}>
                <button
                  onClick={() => setOpen(isOpen ? null : cat.name)}
                  className="card p-5 flex flex-col gap-3 text-left w-full hover:border-accent-structure transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-semibold text-text-primary">
                      {cat.name}
                    </h3>
                    <ChevronRight
                      size={15}
                      className={cn(
                        "text-text-tertiary transition-transform duration-200",
                        isOpen && "rotate-90"
                      )}
                    />
                  </div>

                  {/* Always show a few tags; expand on click */}
                  <div
                    className={cn(
                      "flex flex-wrap gap-2 transition-all",
                      !isOpen && "line-clamp-2"
                    )}
                  >
                    {cat.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded bg-surface-overlay border border-border-subtle font-mono text-[11px] text-text-secondary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {cat.placeholder && (
                    <p className="font-mono text-[10px] text-text-tertiary mt-1">
                      Preview — hover/tap to expand
                    </p>
                  )}
                </button>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
