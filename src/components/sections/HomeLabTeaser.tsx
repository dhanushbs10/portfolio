"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ExternalLink } from "lucide-react";

export function HomeLabTeaser() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl text-center">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="Homelab"
            title="The Home Lab"
            subtitle="Where theory meets bare metal."
          />
        </AnimatedReveal>

        <AnimatedReveal>
          <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
            A hands-on environment for networking experiments, security
            tooling, and infrastructure practice — running on real hardware
            you can touch.
          </p>
        </AnimatedReveal>

        <AnimatedReveal>
          <a
            href="/homelab"
            className="inline-flex items-center gap-2 font-mono text-sm text-accent-interactive hover:text-accent-interactive-hover transition-colors mt-8"
          >
            Explore my setup
            <ExternalLink size={14} />
          </a>
        </AnimatedReveal>
      </div>
    </section>
  );
}
