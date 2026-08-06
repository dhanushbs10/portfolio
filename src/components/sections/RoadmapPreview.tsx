"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { getRoadmap } from "@/lib/data";
import type { RoadmapItem } from "@/lib/types";

const COL_STATUSES: Array<RoadmapItem["status"]> = ["done", "in-progress", "planned"];
const COL_META: Record<string, { label: string; cls: string }> = {
  done: { label: "Done", cls: "text-success" },
  "in-progress": { label: "Doing", cls: "text-warning" },
  planned: { label: "Next", cls: "text-accent-interactive" },
};

export function RoadmapPreview() {
  const items: RoadmapItem[] = getRoadmap();

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

        {items.length === 0 ? (
          <p className="mt-8 text-text-secondary">Roadmap coming soon.</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {COL_STATUSES.map((col) => {
              const meta = COL_META[col];
              return (
                <AnimatedReveal key={col}>
                  <div className="flex flex-col gap-4">
                    <h3 className={cn("font-mono text-xs tracking-widest uppercase", meta.cls)}>
                      {meta.label}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {items
                        .filter((r) => r.status === col)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="card p-4 text-sm text-text-secondary leading-relaxed"
                          >
                            {item.title}
                            {item.targetQuarter && (
                              <span className="block font-mono text-[10px] text-text-tertiary mt-1">
                                {item.targetQuarter}
                              </span>
                            )}
                          </div>
                        ))}
                      {items.filter((r) => r.status === col).length === 0 && (
                        <p className="text-xs text-text-tertiary">No items yet.</p>
                      )}
                    </div>
                  </div>
                </AnimatedReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
