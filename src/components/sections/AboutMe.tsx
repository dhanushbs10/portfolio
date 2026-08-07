"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { getAbout, getSkills, getOsEnvironment } from "@/lib/data";

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

function SkillChip({ skill }: { skill: { name: string; proficiency: string } }) {
  const tier =
    skill.proficiency === "proficient"
      ? "strong"
      : skill.proficiency === "comfortable"
        ? "mid"
        : "learning";

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded font-mono text-[11px] border",
        tier === "strong"
          ? "border-accent-interactive/50 text-accent-interactive bg-accent-interactive/10"
          : tier === "mid"
            ? "border-border-default text-text-secondary bg-surface-overlay"
            : "border-border-subtle text-text-tertiary bg-surface-sunken"
      )}
    >
      {skill.name}
    </span>
  );
}

export function AboutMe() {
  const { bio, interests } = getAbout();
  const skills = getSkills();
  const env = getOsEnvironment();
  const categories = [
    ...new Map(skills.map((s) => [s.category, s.category])).values(),
  ] as string[];
  const orderedCategories = CATEGORY_ORDER.filter((c) =>
    categories.includes(c)
  );

  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="About"
            title="Dhanush B S"
            subtitle="Diploma student in CSE · Cybersecurity & Networking · Bengaluru, IN"
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left col — bio + interests */}
          <AnimatedReveal className="lg:col-span-2">
            <div className="flex flex-col gap-5">
              <p className="text-lg text-text-secondary leading-relaxed">
                {bio.intro}
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                {bio.detail}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {interests.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded bg-surface-overlay border border-border-subtle font-mono text-xs text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedReveal>

          {/* Right col — system info */}
          <AnimatedReveal direction="left">
            <div className="border-panel p-5 flex flex-col gap-4">
              <h3 className="font-display text-sm font-semibold text-text-primary">
                Host Configuration
              </h3>
              <div className="flex flex-col gap-3 font-mono text-xs">
                <SysRow label="OS" value={`${env.os} (Rolling)`} />
                <SysRow label="Desktop" value={env.desktop} />
                <SysRow label="Display" value={env.displayServer} />
                <SysRow label="Shell" value={env.shell} />
              </div>
              <div className="mt-2 pt-3 border-t border-border-subtle">
                <p className="font-mono text-xs text-text-secondary mt-1">
                  Learning since 2021 — always online
                </p>
              </div>
            </div>
          </AnimatedReveal>
        </div>

        {/* Skills grouped by category, tiered by proficiency */}
        <AnimatedReveal>
          <div className="mt-12">
            <h3 className="font-display text-sm font-semibold text-text-primary mb-6">
              Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orderedCategories.map((cat) => {
                const catSkills = skills
                  .filter((s) => s.category === cat)
                  .sort((a, b) => {
                    const order = { proficient: 0, comfortable: 1, learning: 2 };
                    return (order[a.proficiency] ?? 3) - (order[b.proficiency] ?? 3);
                  });

                if (catSkills.length === 0) return null;

                return (
                  <div key={cat} className="flex flex-col gap-2">
                    <h4 className="font-mono text-[11px] tracking-widest uppercase text-text-tertiary">
                      {CATEGORY_LABELS[cat] ?? cat}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {catSkills.map((skill) => (
                        <SkillChip key={skill.id} skill={skill} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}

function SysRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-tertiary">{label}</span>
      <span className="text-text-primary">{value}</span>
    </div>
  );
}
