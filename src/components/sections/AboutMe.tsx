"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { bio, interests } from "@/data/about";
import { skills } from "@/data/skills";

export function AboutMe() {
  // Unique categories from real data
  const categories = [
    ...new Map(skills.map((s) => [s.category, s.category])).values(),
  ] as string[];

  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="01 — About"
            title="Dhanush B S"
            subtitle="Diploma student in Computer Science Engineering from Bengaluru, Karnataka — aiming to become a Network Security Engineer."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <AnimatedReveal direction="left">
            <div className="aspect-square max-w-sm mx-auto w-full card flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-surface-overlay flex items-center justify-center mb-4">
                  <span className="font-display text-2xl text-accent-interactive">DBS</span>
                </div>
                <p className="mono-label text-text-tertiary">[Photo placeholder]</p>
              </div>
            </div>
          </AnimatedReveal>

          <AnimatedReveal direction="right">
            <div className="flex flex-col gap-5">
              <p className="text-lg text-text-secondary leading-relaxed">{bio.intro}</p>
              <p className="text-lg text-text-secondary leading-relaxed">{bio.detail}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                {interests.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded bg-surface-overlay border border-border-subtle font-mono text-xs text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <p className="mono-label text-accent-interactive mb-3">Skills &amp; Tools</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className={cn(
                        "px-2.5 py-1 rounded font-mono text-[11px] border",
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
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
