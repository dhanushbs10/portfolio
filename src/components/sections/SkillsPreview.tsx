"use client";

import { useState } from "react";
import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillCategory {
  name: string;
  items: string[];
}

const SKILLS: SkillCategory[] = [
  {
    name: "Programming",
    items: ["C", "Python", "JavaScript", "HTML", "CSS", "TypeScript (Learning)"],
  },
  {
    name: "Web Development",
    items: ["React", "Next.js", "Tailwind CSS", "Node.js", "Git", "GitHub"],
  },
  {
    name: "Cybersecurity",
    items: ["Linux", "Kali Linux", "Wireshark", "Nmap", "Burp Suite", "Metasploit (Learning)"],
  },
  {
    name: "Networking",
    items: ["TCP/IP", "DNS", "DHCP", "Routing", "Switching", "VLAN", "Cisco Packet Tracer"],
  },
];

export function SkillsPreview() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="section-container">
      <div className="mx-auto max-w-4xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="04 — Skills"
            title="Areas of Focus"
            subtitle="Static preview — full categorized system with proficiency levels coming in a later chapter."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKILLS.map((cat) => {
            const isOpen = open === cat.name;
            return (
              <AnimatedReveal key={cat.name}>
                <button
                  onClick={() => setOpen(isOpen ? null : cat.name)}
                  className="card p-5 flex flex-col gap-3 text-left w-full hover:border-accent-structure transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-semibold text-text-primary">
                      {cat.name}
                    </h3>
                    <ChevronRight
                      size={15}
                      className={cn(
                        "text-text-tertiary transition-transform duration-200",
                        isOpen && "rotate-90"
                      )}
                    />
                  </div>

                  <div
                    className={cn(
                      "flex flex-wrap gap-2 transition-all",
                      !isOpen && "line-clamp-2"
                    )}
                  >
                    {cat.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded bg-surface-overlay border border-border-subtle font-mono text-[11px] text-text-secondary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </button>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
