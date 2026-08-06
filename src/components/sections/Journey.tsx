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
  {
    year: "2024 — Present",
    role: "Diploma Final Year",
    org: "Computer Science Engineering",
    detail: "Specializing in Cybersecurity and Networking. Focused on practical, hands-on learning through projects, home labs, and real-world problem solving.",
  },
  {
    year: "2023",
    role: "Self-Study: Networking & Linux",
    org: "Personal Learning",
    detail: "Built foundational skills in TCP/IP, DNS, DHCP, routing, switching, and Linux system administration through home lab experimentation.",
  },
  {
    year: "2022",
    role: "Cybersecurity Exploration",
    org: "Personal Learning",
    detail: "Started exploring ethical hacking, Kali Linux, Wireshark, Nmap, and vulnerability assessment. Built first cybersecurity-focused projects.",
  },
  {
    year: "2021",
    role: "Web Development",
    org: "Personal Projects",
    detail: "Learned HTML, CSS, JavaScript, and started building web applications. Discovered passion for combining security with development.",
  },
];

export function Journey() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="02 — Experience"
            title="Professional Journey"
            subtitle="My path from curiosity to focused specialization in cybersecurity and networking."
          />
        </AnimatedReveal>

        <div className="relative mt-14 flex flex-col gap-0">
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border-subtle" />

          {TIMELINE.map((entry, idx) => (
            <AnimatedReveal key={entry.year} stagger>
              <div className="relative pl-10 pb-12 last:pb-0">
                <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-accent-interactive/80 border-2 border-surface-base" />

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs text-accent-interactive tracking-wider">
                    {entry.year}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-text-primary flex items-center gap-2">
                    <Briefcase size={15} className="text-accent-structure-light" />
                    {entry.role}
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
