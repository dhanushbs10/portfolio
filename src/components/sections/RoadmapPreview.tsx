"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

type Col = "done" | "doing" | "next";

interface RoadmapItem {
  col: Col;
  text: string;
}

const ROADMAP: RoadmapItem[] = [
  { col: "done", text: "[Something already shipped or achieved]" },
  { col: "done", text: "[Another completed milestone]" },
  { col: "doing", text: "[Currently in progress — a project or learning goal]" },
  { col: "doing", text: "[Second thing actively being worked on]" },
  { col: "next", text: "[Upcoming goal — what's on the horizon]" },
  { col: "next", text: "[Ideas / backlog item]" },
];

const COL_META: Record<Col, { label: string; cls: string }> = {
  done: { label: "Done", cls: "text-success" },
  doing: { label: "Doing", cls: "text-warning" },
  next: { label: "Next", cls: "text-accent-interactive" },
};

export function RoadmapPreview() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-4xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="09 — Roadmap"
            title="Where Things Are Headed"
            subtitle="A snapshot of what's shipped, what's in motion, and what's next."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.keys(COL_META) as Col[]).map((col) => {
            const meta = COL_META[col];
            const items = ROADMAP.filter((r) => r.col === col);
            return (
              <AnimatedReveal key={col}>
                <div className="flex flex-col gap-4">
                  <h3 className={cn("font-mono text-xs tracking-widest uppercase", meta.cls)}>
                    {meta.label}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <div
                        key={item.text}
                        className="card p-4 text-sm text-text-secondary leading-relaxed"
                      >
                        {item.text}
                      </div>
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
