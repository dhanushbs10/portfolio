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
              <div className="aspect-video md:aspect-auto md:min-h-[320px] bg-surface-overlay border-r border-border-subtle flex items-center justify-center">
                <div className="text-center p-8">
                  <p className="font-mono text-xs text-text-tertiary mb-2">[Server rack / lab photo]</p>
                  <p className="font-mono text-[10px] text-text-tertiary/60">
                    Intel i5-4670K · 12 GB RAM · Dual monitors
                  </p>
                </div>
              </div>

              <div className="p-8 md:p-10 flex flex-col gap-5">
                <SectionHeading
                  eyebrow="08 — Homelab"
                  title="The Lab Behind the Laptop"
                  subtitle="An always-running setup for cybersecurity practice, networking experiments, and hands-on infrastructure learning."
                />

                <p className="text-text-secondary leading-relaxed">
                  My homelab runs on an Intel Core i5-4670K with 12 GB RAM and dual monitors.
                  I use it for cybersecurity labs, networking practice, virtualization, OS testing,
                  and automation — everything needed to build real-world skills without depending on cloud environments.
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Proxmox", " Kali Linux", "Ubuntu", "Cisco Packet Tracer", "Wireshark", "Nmap"].map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-surface-overlay border border-border-subtle font-mono text-[11px] text-text-secondary">{t}</span>
                  ))}
                </div>

                <a
                  href="/homelab"
                  className="inline-flex items-center gap-2 font-mono text-sm text-accent-interactive hover:text-accent-interactive-hover transition-colors self-start mt-2"
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
