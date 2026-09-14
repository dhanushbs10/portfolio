"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Mail, ExternalLink, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { contactInfo } from "@/data/contact";

interface SocialLink {
  href: string;
  label: string;
  icon: typeof ExternalLink;
}

const SOCIALS: SocialLink[] = contactInfo.socials.map((s) => ({ href: s.href, label: s.label, icon: s.icon === "github" ? ExternalLink : s.icon === "mail" ? Mail : s.icon === "phone" ? Phone : ExternalLink, }));

export function ContactSection() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="Contact"
            title="Get in Touch"
            subtitle="Have a project in mind, a question, or just want to say hi? Reach out."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-10">
          <AnimatedReveal className="md:col-span-3">
            <div className="flex flex-col gap-5">
              <p className="text-text-secondary leading-relaxed">
                I am always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out through any of the channels below.
              </p>
              <a
                href={`mailto:${contactInfo.email}`}
                className={cn("self-start inline-flex items-center gap-2 bg-accent-interactive hover:bg-accent-interactive-hover text-surface-base rounded px-6 py-3 font-mono text-sm font-medium tracking-wide transition-colors")}
              >
                <Mail size={14} /> Send an email
              </a>
            </div>
          </AnimatedReveal>

          <AnimatedReveal direction="left">
            <div className="flex flex-col gap-6">
              <h3 className="font-display text-base font-semibold text-text-primary">Or find me here</h3>
              <div className="flex flex-col gap-4">
                {SOCIALS.map(({ href, label, icon: Icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-text-secondary hover:text-accent-interactive transition-colors group">
                    <Icon size={16} className="text-text-tertiary group-hover:text-accent-interactive" />
                    <span className="font-mono text-sm">{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
