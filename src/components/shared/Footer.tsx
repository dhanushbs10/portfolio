import { Globe, Contact } from "lucide-react";
import { cn } from "@/lib/utils";

const SOCIALS = [
  {
    href: "https://github.com/dhanush-nagishetti",
    label: "GitHub",
    icon: Globe,
  },
  {
    href: "https://linkedin.com/in/dhanush-nagishetti",
    label: "LinkedIn",
    icon: Contact,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Copyright */}
        <p className="font-mono text-xs text-text-tertiary">
          &copy; {new Date().getFullYear()} Dhanush Nagishetti.{" "}
          <span className="text-text-secondary">
            Built with Next.js + Tailwind + shadcn/ui.
          </span>
        </p>

        {/* Social links */}
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
        </div>
      </div>
    </footer>
  );
}
