"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type CertState = "earned" | "in-progress" | "planned";

interface Cert {
  name: string;
  issuer: string;
  state: CertState;
  date: string;
}

const CERT_STATES: Record<CertState, { icon: typeof CheckCircle2; label: string; cls: string }> = {
  earned: {
    icon: CheckCircle2,
    label: "Earned",
    cls: "text-success",
  },
  "in-progress": {
    icon: Clock,
    label: "In Progress",
    cls: "text-warning",
  },
  planned: {
    icon: Circle,
    label: "Planned",
    cls: "text-text-tertiary",
  },
};

const CERTIFICATIONS: Cert[] = [
  { name: "[Cert Name]", issuer: "[Issuer]", state: "earned", date: "Year" },
  { name: "[Cert Name]", issuer: "[Issuer]", state: "in-progress", date: "Expected Year" },
  { name: "[Cert Name]", issuer: "[Issuer]", state: "planned", date: "—" },
  { name: "[Cert Name]", issuer: "[Issuer]", state: "earned", date: "Year" },
];

export function CertificationsPreview() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="06 — Certifications"
            title="Credentials & Certifications"
            subtitle="Placeholder data — real certificates will be populated in a later chapter."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CERTIFICATIONS.map((cert) => {
            const stateMeta = CERT_STATES[cert.state];
            const Icon = stateMeta.icon;
            return (
              <AnimatedReveal key={cert.name}>
                <div className="card p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-base font-semibold text-text-primary">
                      {cert.name}
                    </h3>
                    <Icon size={18} className={cn("shrink-0 mt-0.5", stateMeta.cls)} />
                  </div>
                  <p className="text-sm text-text-secondary">{cert.issuer}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={cn("font-mono text-[11px] tracking-wide", stateMeta.cls)}>
                      {stateMeta.label}
                    </span>
                    <span className="font-mono text-[11px] text-text-tertiary">
                      {cert.date}
                    </span>
                  </div>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
