"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ArrowRight } from "lucide-react";

export function HomeLabTeaser() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <div className="card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image placeholder — the real homelab photo goes here in Chapter 5 */}
              <div className="aspect-video md:aspect-auto md:min-h-[320px] bg-surface-overlay border-r border-border-subtle flex items-center justify-center">
                <span className="font-mono text-xs text-text-tertiary">
                  [Server rack / lab photo placeholder]
                </span>
              </div>

              {/* Copy */}
              <div className="p-8 md:p-10 flex flex-col gap-5">
                <SectionHeading
                  eyebrow="08 — Homelab"
                  title="The Lab Behind the Laptop"
                  subtitle="An always-running setup for self-hosted services, infrastructure experiments, and learning at scale."
                />

                <p className="text-text-secondary leading-relaxed">
                  [Brief description of your homelab philosophy — what you host, why you
                  self-host, what you're learning from it.] Placeholder only — real
                  content and a full breakdown come in the Homelab chapter.
                </p>

                <a
                  href="/homelab"
                  className="inline-flex items-center gap-2 font-mono text-sm text-accent-interactive hover:text-accent-interactive-hover transition-colors self-start"
                >
                  Explore my setup
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
