import { Globe, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const SOCIALS = [
  {
    href: "https://github.com/dhanushbs10",
    label: "GitHub",
    icon: Globe,
  },
  {
    href: "https://www.linkedin.com/in/dhanush-b-s-4b454a368",
    label: "LinkedIn",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-text-tertiary">
          Dhanush B S, Bengaluru, Karnataka, India
        </p>

        <div className="flex items-center gap-6">
          {SOCIALS.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-text-tertiary hover:text-accent-interactive transition-colors"
            >
              <Icon size={18} />
            </a>
          ))}
          <a
            href="mailto:dhanushpoojari101@gmail.com"
            className="text-text-tertiary hover:text-accent-interactive transition-colors"
            aria-label="Email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
