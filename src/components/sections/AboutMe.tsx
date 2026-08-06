"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { bio, interests } from "@/data/about";
import { skills } from "@/data/skills";
import { getOsEnvironment } from "@/lib/data";

export function AboutMe() {
  const env = getOsEnvironment();
  const categories = [
    ...new Map(skills.map((s) => [s.category, s.category])).values(),
  ] as string[];

  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="[SYS.ABOUT]"
            title={<>Dhanush <span className="text-accent-interactive">B S</span></>}
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
                  <span key={tag} className="px-3 py-1 rounded bg-surface-overlay border border-border-subtle font-mono text-xs text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedReveal>

          {/* Right col — sys-info panel */}
          <AnimatedReveal direction="left">
            <div className="border-panel p-5 flex flex-col gap-4">
              <p className="sys-label">Host Configuration</p>
              <div className="flex flex-col gap-3 font-mono text-xs">
                <SysRow label="OS" value={`${env.os} (Rolling)`} />
                <SysRow label="Desktop" value={env.desktop} />
                <SysRow label="Display" value={env.displayServer} />
                <SysRow label="Shell" value={env.shell} />
                <SysRow label="Terminal" value={env.terminal} />
                <SysRow label="Editor" value={env.editor} />
              </div>
              <div className="mt-2 pt-3 border-t border-border-subtle">
                <p className="sys-label">Uptime</p>
                <p className="font-mono text-xs text-text-secondary mt-1">Learning since 2021 — always online</p>
              </div>
            </div>
          </AnimatedReveal>
        </div>

        {/* Skills full list — below the two-col block */}
        <AnimatedReveal>
          <div className="mt-12">
            <p className="sys-label mb-4">Loaded Skills</p>
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
