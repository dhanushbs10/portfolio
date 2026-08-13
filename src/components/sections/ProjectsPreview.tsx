"use client";

import Link from "next/link";
import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

// Projects data is fetched server-side and passed as props
interface ProjectsPreviewProps {
  projects: Project[];
}

// Map legacy status values to display labels
const STATUS_LABEL: Record<string, string> = {
  "in-progress": "In Progress",
  completed: "Completed",
  archived: "Archived",
  Live: "Live",
  Planned: "Planned",
};

export function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="DEV.LOG"
            title="Selected Work"
            subtitle="A sample of projects I've built to learn and demonstrate practical skills."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <AnimatedReveal key={proj.slug}>
              <article className="card p-6 flex flex-col gap-4 h-full hover:border-accent-interactive transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    {proj.title}
                  </h3>
                  <span className={cn(
                    "shrink-0 font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded",
                    proj.status === "completed" ? "bg-success/10 text-success" : proj.status === "in-progress" ? "bg-warning/10 text-warning" : "bg-surface-overlay text-text-tertiary"
                  )}>
                    {STATUS_LABEL[proj.status] ?? proj.status}
                  </span>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {proj.summary}
                </p>

                <div className="flex flex-wrap gap-2">
                  {proj.techStack.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-surface-overlay border border-border-subtle font-mono text-[11px] text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                  {proj.techStack.length > 4 && (
                    <span className="px-2 py-0.5 font-mono text-[11px] text-text-tertiary">
                      +{proj.techStack.length - 4}
                    </span>
                  )}
                </div>

                <Link
                  href={`/projects/${proj.slug}`}
                  className="inline-flex items-center gap-2 font-mono text-xs text-accent-interactive hover:text-accent-interactive-hover transition-colors mt-1"
                >
                  Read more →
                </Link>
              </article>
            </AnimatedReveal>
          ))}
        </div>

        <AnimatedReveal>
          <div className="mt-10 text-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 font-mono text-sm text-accent-interactive hover:text-accent-interactive-hover transition-colors"
            >
              View all projects
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </Link>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
