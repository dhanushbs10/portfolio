"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Briefcase } from "lucide-react";

interface TimelineEntry {
  year: string;
  role: string;
  org: string;
  detail: string;
}

const TIMELINE: TimelineEntry[] = [
  { year: "2024", role: "[Role]", org: "[Company]", detail: "[Brief description of what you did and what you shipped.]" },
  { year: "2023", role: "[Role]", org: "[Company]", detail: "[Key contribution or project.]" },
  { year: "2022", role: "[Role]", org: "[Company / Freelance]", detail: "[Responsibility or area of growth.]" },
];

export function Journey() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="02 — Experience"
            title="Professional Journey"
            subtitle="A timeline of roles that shaped how I think about building software."
          />
        </AnimatedReveal>

        <div className="relative mt-14 flex flex-col gap-0">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border-subtle" />

          {TIMELINE.map((entry, idx) => (
            <AnimatedReveal key={entry.year} stagger>
              <div className="relative pl-10 pb-12 last:pb-0">
                {/* Dot */}
                <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-accent-interactive/80 border-2 border-surface-base" />

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs text-accent-interactive tracking-wider">
                    {entry.year}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Briefcase size={15} className="text-accent-structure-light" />
                    {entry.role} — {entry.org}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {entry.detail}
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
