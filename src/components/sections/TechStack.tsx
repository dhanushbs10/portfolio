"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

interface ToolGroup {
  label: string;
  tools: string[];
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    label: "Languages",
    tools: ["TypeScript", "Go", "Python", "Rust (learning)", "SQL"],
  },
  {
    label: "Frontend",
    tools: ["Next.js", "React", "Tailwind", "tRPC"],
  },
  {
    label: "Infrastructure",
    tools: ["Docker", "Kubernetes", "Terraform", "Ansible", "Nix"],
  },
  {
    label: "Databases",
    tools: ["PostgreSQL", "Redis", "SQLite", "ClickHouse"],
  },
  {
    label: "Observability",
    tools: ["Grafana", "Prometheus", "Loki", "OpenTelemetry"],
  },
];

function ToolMarqueeRow({ tools }: { tools: string[] }) {
  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-base to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface-base to-transparent z-10 pointer-events-none" />

      <div className="flex gap-4 animate-marquee">
        {[...tools, ...tools].map((tool, i) => (
          <span
            key={`${tool}-${i}`}
            className={cn(
              "shrink-0 px-4 py-2 rounded-full",
              "bg-surface-raised border border-border-subtle",
              "font-mono text-sm text-text-secondary whitespace-nowrap"
            )}
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  return (
    <section className="section-container overflow-hidden">
      <div className="mx-auto max-w-4xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="05 — Stack"
            title="Tools I Reach For"
            subtitle="A slow marquee of the things I use regularly — not exhaustive, just representative."
          />
        </AnimatedReveal>

        <div className="mt-12 flex flex-col gap-8">
          {TOOL_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              <span className="font-mono text-[11px] tracking-widest uppercase text-text-tertiary pl-1">
                {group.label}
              </span>
              <ToolMarqueeRow tools={group.tools} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
