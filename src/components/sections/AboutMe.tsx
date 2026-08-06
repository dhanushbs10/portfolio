"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

const INTERESTS = [
  "Cybersecurity",
  "Network Security",
  "Ethical Hacking",
  "Linux Administration",
  "Windows Administration",
  "Networking",
  "Home Lab Development",
  "Hardware",
  "Web Development",
  "Open Source",
  "Automation",
  "Virtualization",
  "System Architecture",
];

const SKILL_TAGS = [
  "C", "Python", "JavaScript", "HTML", "CSS", "TypeScript (Learning)",
  "React", "Next.js", "Tailwind CSS", "Node.js", "Git", "GitHub",
  "Linux", "Kali Linux", "Wireshark", "Nmap", "Burp Suite",
  "TCP/IP", "DNS", "DHCP", "Routing", "Switching", "VLAN",
  "Cisco Packet Tracer",
];

export function AboutMe() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="01 — About"
            title="Dhanush B S"
            subtitle="Diploma student in Computer Science Engineering from Bengaluru, Karnataka — aiming to become a Network Security Engineer."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <AnimatedReveal direction="left">
            <div className="aspect-square max-w-sm mx-auto w-full card flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-surface-overlay flex items-center justify-center mb-4">
                  <span className="font-display text-2xl text-accent-interactive">DBS</span>
                </div>
                <p className="mono-label text-text-tertiary">[Photo placeholder]</p>
              </div>
            </div>
          </AnimatedReveal>

          <AnimatedReveal direction="right">
            <div className="flex flex-col gap-5">
              <p className="text-lg text-text-secondary leading-relaxed">
                I&apos;m a final-year Diploma student specializing in{" "}
                <span className="text-text-primary font-medium">Cybersecurity and Networking</span>.
                Technology has always been something I explore beyond academics —
                I spend my free time experimenting with operating systems, networking,
                virtualization, hardware, and cybersecurity tools.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                I believe practical experience is the fastest way to learn, which is
                why I constantly build projects, troubleshoot systems, and create my
                own learning environment.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {INTERESTS.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded bg-surface-overlay border border-border-subtle font-mono text-xs text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <p className="mono-label text-accent-interactive mb-3">Skills &amp; Tools</p>
                <div className="flex flex-wrap gap-2">
                  {SKILL_TAGS.map((tag) => (
                    <span
                      key={tag}
                      className={cn("px-2.5 py-1 rounded font-mono text-[11px] border",
                        tag.includes("(Learning)")
                          ? "border-warning/40 text-warning bg-warning/5"
                          : "border-border-subtle text-text-secondary bg-surface-overlay"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
