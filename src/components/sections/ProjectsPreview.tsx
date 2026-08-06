"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ExternalLink } from "lucide-react";

interface Project {
  title: string;
  desc: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    title: "[Project One]",
    desc: "[A brief description of what this project does and the problem it solves.]",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    title: "[Project Two]",
    desc: "[Another brief description — focus on the outcome or the user problem.]",
    tags: ["Go", "Docker", "Grafana"],
  },
  {
    title: "[Project Three]",
    desc: "[Third project — what tech you chose and why it matters.]",
    tags: ["React", "tRPC", "Prisma"],
  },
  {
    title: "[Project Four]",
    desc: "[A side project or experiment that shows a different facet of your work.]",
    tags: ["Rust", "WASM", "Nix"],
  },
];

export function ProjectsPreview() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="07 — Projects"
            title="Selected Work"
            subtitle="A small sample of projects I've shipped recently. Full catalog on the Projects page."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PROJECTS.map((proj) => (
            <AnimatedReveal key={proj.title}>
              <article className="card p-6 flex flex-col gap-4 h-fullgroup hover:border-accent-structure transition-colors">
                {/* Placeholder thumbnail */}
                <div className="aspect-video rounded bg-surface-overlay border border-border-subtle flex items-center justify-center">
                  <span className="font-mono text-[11px] text-text-tertiary">
                    [thumbnail]
                  </span>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {proj.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-surface-overlay border border-border-subtle font-mono text-[11px] text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </AnimatedReveal>
          ))}
        </div>

        <AnimatedReveal>
          <div className="mt-10 text-center">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-sm text-accent-interactive hover:text-accent-interactive-hover transition-colors"
            >
              View all projects
              <ExternalLink size={14} />
            </a>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
