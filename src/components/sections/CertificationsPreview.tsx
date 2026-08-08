"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCertifications } from "@/lib/data";
import type { Certification } from "@/lib/types";

const STATUS_ORDER: Record<string, number> = { earned: 0, "in-progress": 1, planned: 2 };

const STATE_META: Record<string, { icon: typeof CheckCircle2; label: string; cls: string }> = {
  earned: { icon: CheckCircle2, label: "Earned", cls: "text-success" },
  "in-progress": { icon: Clock, label: "In Progress", cls: "text-warning" },
  planned: { icon: Circle, label: "Planned", cls: "text-text-tertiary" },
};

export function CertificationsPreview() {
  const certs: Certification[] = getCertifications()
    .sort((a, b) => (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3));

  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="SEC.CERT"
            title="Credentials & Certifications"
            subtitle="Placeholder data — real certificates will be populated in a later chapter."
          />
        </AnimatedReveal>

        {certs.length === 0 ? (
          <p className="mt-8 text-text-secondary">No certifications yet — stay tuned.</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certs.map((cert, i) => {
              const stateMeta = STATE_META[cert.status] ?? STATE_META.planned;
              const Icon = stateMeta.icon;
              return (
                <AnimatedReveal key={cert.id}>
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
                      {cert.dateEarned && (
                        <span className="font-mono text-[11px] text-text-tertiary">
                          {cert.dateEarned}
                        </span>
                      )}
                    </div>
                  </div>
                </AnimatedReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
