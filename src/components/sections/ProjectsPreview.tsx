"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Project {
  title: string;
  category: string;
  status: "Live" | "Planned";
  desc: string;
  tags: string[];
  repo: string;
}

const PROJECTS: Project[] = [
  {
    title: "PXE Network Boot Lab",
    category: "Networking / Linux / Infrastructure",
    status: "Live",
    desc: "Building a PXE network boot server that boots a legacy computer over the network using DHCP and TFTP — no local OS required.",
    tags: ["Linux", "PXE Boot", "DHCP", "TFTP", "Networking"],
    repo: "https://github.com/dhanushbs10",
  },
  {
    title: "ESP Wake-on-LAN Trigger",
    category: "IoT / Networking / Embedded Systems",
    status: "Live",
    desc: "Microcontroller-based project to remotely power on a computer after power failures using ESP32 and Wake-on-LAN packets.",
    tags: ["ESP32", "Wake-on-LAN", "Embedded Systems", "Networking"],
    repo: "https://github.com/dhanushbs10",
  },
  {
    title: "Cross-Subnet Sharing Fix",
    category: "Networking / Troubleshooting",
    status: "Live",
    desc: "Troubleshooting SMB file-sharing failures caused by a Wi-Fi range extender creating multiple subnets — root cause analysis and fix.",
    tags: ["SMB", "TCP/IP", "Subnetting", "Windows", "Networking"],
    repo: "https://github.com/dhanushbs10",
  },
  {
    title: "Packet Tracer Enterprise Topology",
    category: "Cisco Networking",
    status: "Planned",
    desc: "Enterprise networking simulation in Cisco Packet Tracer covering VLANs, inter-VLAN routing, switching, routing protocols, and troubleshooting.",
    tags: ["Cisco Packet Tracer", "VLAN", "Routing", "Switching"],
    repo: "https://github.com/dhanushbs10",
  },
];

export function ProjectsPreview() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-5xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="07 — Projects"
            title="Selected Work"
            subtitle="A sample of projects I've built to learn and demonstrate practical skills."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PROJECTS.map((proj) => (
            <AnimatedReveal key={proj.title}>
              <article className="card p-6 flex flex-col gap-4 h-full hover:border-accent-structure transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-lg font-semibold text-text-primary">
                      {proj.title}
                    </h3>
                    <span className="font-mono text-[11px] text-text-tertiary">{proj.category}</span>
                  </div>
                  <span className={cn(
                    "shrink-0 font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded",
                    proj.status === "Live" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    {proj.status}
                  </span>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {proj.desc}
                </p>

                <div className="flex flex-wrap gap-2">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-surface-overlay border border-border-subtle font-mono text-[11px] text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={proj.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs text-accent-interactive hover:text-accent-interactive-hover transition-colors mt-1"
                >
                  <span className="inline-flex items-center" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-3.99-1.425-.135-.345-.72-1.425-1.23-1.71-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg></span>
                  View Repository
                </a>
              </article>
            </AnimatedReveal>
          ))}
        </div>

        <AnimatedReveal>
          <div className="mt-10 text-center">
            <a
              href="https://github.com/dhanushbs10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-sm text-accent-interactive hover:text-accent-interactive-hover transition-colors"
            >
              View all projects on GitHub
              <ExternalLink size={14} />
            </a>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
