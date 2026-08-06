"use client";

import { AnimatedReveal } from "@/components/shared/AnimatedReveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Send, ExternalLink, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLink {
  href: string;
  label: string;
  icon: typeof ExternalLink;
}

const SOCIALS: SocialLink[] = [
  {
    href: "https://github.com/dhanushbs10",
    label: "GitHub",
    icon: ExternalLink,
  },
  {
    href: "https://www.linkedin.com/in/dhanush-b-s-4b454a368",
    label: "LinkedIn",
    icon: ExternalLink,
  },
  {
    href: "mailto:dhanushpoojari101@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

export function ContactSection() {
  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <SectionHeading
            eyebrow="11 — Contact"
            title="Get in Touch"
            subtitle="Have a project in mind, a question, or just want to say hi? Reach out."
          />
        </AnimatedReveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-10">
          <AnimatedReveal className="md:col-span-3">
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-mono text-xs tracking-wide text-text-secondary">Name</label>
                <input id="name" type="text" placeholder="Your name"
                  className={cn("w-full rounded bg-surface-raised border border-border-default px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-interactive focus:ring-1 focus:ring-accent-interactive/40 transition-colors")} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-mono text-xs tracking-wide text-text-secondary">Email</label>
                <input id="email" type="email" placeholder="you@example.com"
                  className={cn("w-full rounded bg-surface-raised border border-border-default px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-interactive focus:ring-1 focus:ring-accent-interactive/40 transition-colors")} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-mono text-xs tracking-wide text-text-secondary">Message</label>
                <textarea id="message" rows={5} placeholder="What's on your mind?"
                  className={cn("w-full rounded bg-surface-raised border border-border-default px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-interactive focus:ring-1 focus:ring-accent-interactive/40 transition-colors resize-none")} />
              </div>
              <button type="submit"
                className={cn("self-start inline-flex items-center gap-2 bg-accent-interactive hover:bg-accent-interactive-hover text-surface-base rounded px-6 py-3 font-mono text-sm font-medium tracking-wide transition-colors")}>
                <Send size={14} /> Send message
              </button>
            </form>
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
