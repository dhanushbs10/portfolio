import { SectionHeading } from "@/components/shared/SectionHeading";
import { getContactInfo } from "@/lib/data";
import { Mail, Phone, MapPin } from "lucide-react";
import type { ComponentType } from "react";

type IconProps = { size?: number; className?: string };

function GithubIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    </svg>
  );
}

function LinkedinIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const ICONS: Record<string, ComponentType<IconProps>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
  phone: Phone,
};

export default function ContactPage() {
  const { email, phone, location, socials } = getContactInfo();

  return (
    <section className="section-container">
      <div className="mx-auto max-w-3xl space-y-12">
        <SectionHeading
          eyebrow="Contact"
          title={
            <span className="text-text-primary">
              Say <span className="text-accent-interactive">Hello</span>
            </span>
          }
          subtitle="Open to conversations about networking, security, infrastructure, and building things."
        />

        <div className="space-y-4">
          {[
            { label: "Email", value: email, href: `mailto:${email}` },
            { label: "Phone", value: phone ?? "", href: `tel:${(phone ?? "").replace(/\D/g, "")}` },
          ].map(
            ({ label, value, href }) =>
              value && (
                <a
                  key={label}
                  href={href}
                  className="card p-5 flex items-center gap-4 hover:border-accent-interactive transition-colors"
                >
                  <Mail size={18} className="text-accent-interactive shrink-0" />
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] tracking-wide text-text-tertiary uppercase">
                      {label}
                    </p>
                    <p className="text-text-primary truncate">{value}</p>
                  </div>
                </a>
              )
          )}

          <div className="card p-5 flex items-center gap-4">
            <MapPin size={18} className="text-accent-interactive shrink-0" />
            <div>
              <p className="font-mono text-[11px] tracking-wide text-text-tertiary uppercase">
                Location
              </p>
              <p className="text-text-primary">{location}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-mono text-[11px] tracking-wide text-text-tertiary uppercase">
            Elsewhere
          </p>
          <div className="flex flex-wrap gap-4">
            {socials.map(({ id, label, href, icon }) => {
              const Icon = ICONS[icon] ?? Mail;
              return (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-3 hover:border-accent-interactive transition-colors"
                >
                  <Icon size={18} className="text-accent-interactive shrink-0" />
                  <span className="font-mono text-xs text-text-secondary">{label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}