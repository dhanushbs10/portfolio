"use client";

import { useState } from "react";
import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSkills, getSkillsByCategory } from "@/lib/data";
import type { Skill } from "@/lib/types";

const VISIBLE_CHIPS = 4;

function SkillCategoryCard({ name, skills }: { name: string; skills: Skill[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? skills : skills.slice(0, VISIBLE_CHIPS);
  const hidden = skills.length - VISIBLE_CHIPS;

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-text-primary">
          {name}
        </h3>
        {hidden > 0 && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="font-mono text-[11px] text-accent-interactive hover:text-accent-interactive-hover transition-colors"
          >
            +{hidden} more
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {visible.map((skill) => (
          <span
            key={skill.id}
            title={skill.note}
            className={cn(
              "px-2 py-0.5 rounded font-mono text-[11px] border",
              skill.proficiency === "learning"
                ? "border-warning/40 text-warning bg-warning/5"
                : "border-border-subtle text-text-secondary bg-surface-overlay"
            )}
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsPreview() {
  const skills = getSkills();
  const categories = [
    ...new Map(skills.map((s) => [s.category, s.category])).values(),
  ];

  return (
    <section className="section-container">
      <div className="mx-auto max-w-4xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="[SYS.SKILLS]"
            title="Areas of Focus"
            subtitle="Static preview — full categorized system with proficiency levels coming in a later chapter."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const catSkills = getSkillsByCategory(cat);
            if (catSkills.length === 0) return null;
            return (
              <AnimatedReveal key={cat}>
                <SkillCategoryCard name={cat} skills={catSkills} />
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
