"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function AboutMe() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="01 — About"
            title="Who I Am"
            subtitle="Developer, tinkerer, and lifelong learner focused on infrastructure, systems, and building things that last."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Placeholder portrait / illustration */}
          <AnimatedReveal direction="left">
            <div className="aspect-square max-w-sm mx-auto w-full card flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-surface-overlay flex items-center justify-center mb-4">
                  <span className="font-display text-2xl text-accent-interactive">
                    DN
                  </span>
                </div>
                <p className="mono-label text-text-tertiary">
                  [Portrait placeholder]
                </p>
              </div>
            </div>
          </AnimatedReveal>

          {/* Copy */}
          <AnimatedReveal direction="right">
            <div className="flex flex-col gap-5">
              <p className="text-lg text-text-secondary leading-relaxed">
                I&apos;m a developer who cares about the full stack — from bare metal to
                the pixels on screen. My work spans infrastructure automation,
                full-stack web development, and tools that bring both together.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                Currently focused on [current focus — placeholder]. When I&apos;m not
                at a keyboard, I&apos;m usually [hobby — placeholder].
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {["TypeScript", "Next.js", "Go", "Docker", "Kubernetes"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded bg-surface-overlay border border-border-subtle font-mono text-xs text-text-secondary"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
