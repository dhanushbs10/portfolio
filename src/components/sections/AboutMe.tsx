"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getAbout, getInterests } from "@/lib/data";
import type { InterestCategory } from "@/lib/types";

export function AboutMe() {
  const { bio } = getAbout();
  const allInterests = getInterests();

  const technical = allInterests.filter(
    (i: { category: string }) => i.category === "technical"
  );
  const general = allInterests.filter(
    (i: { category: string }) => i.category === "general"
  );

  const technicalLabels = technical.map((i: { label: string }) => i.label);
  const technicalSentence =
    technicalLabels.length > 0
      ? `Outside of coursework, I build small ${technicalLabels.join(" and ")} for fun — they're a natural extension of the home lab work.`
      : null;

  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="About"
            title="Dhanush B S"
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
                {technicalSentence && ` ${technicalSentence}`}
              </p>
            </div>
          </AnimatedReveal>

          {/* Right col — static info + quiet hobbies footer */}
          <AnimatedReveal direction="left">
            <div className="flex flex-col gap-6">
              <div className="border-panel p-5 flex flex-col gap-4">
                <h3 className="font-display text-sm font-semibold text-text-primary">
                  Host Configuration
                </h3>
                <div className="flex flex-col gap-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Focus</span>
                    <span className="text-text-primary">Cybersecurity</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Controls</span>
                    <span className="text-text-primary">
                      {" "}networking, auditing
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Based in</span>
                    <span className="text-text-primary">Bengaluru, India</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-tertiary">Since</span>
                    <span className="text-text-primary">2021</span>
                  </div>
                </div>
                <div className="mt-2 pt-3 border-t border-border-subtle">
                  <p className="font-mono text-xs text-text-secondary mt-1">
                    Always learning, always building.
                  </p>
                </div>
              </div>

              {/* General hobbies — quiet footer */}
              {general.length > 0 && (
                <div className="mt-2">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-text-tertiary">
                    Also into:
                  </span>
                  <p className="mt-1.5 font-body text-sm text-text-tertiary leading-relaxed">
                    {general.map((g: { label: string }) => g.label).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
