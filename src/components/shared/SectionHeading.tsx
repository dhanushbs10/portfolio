import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string | ReactNode;
  subtitle?: string;
  index?: string;
  align?: "left" | "center";
  className?: string;
  eyebrowClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  index,
  align = "left",
  className,
  eyebrowClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex items-start gap-5",
          align === "center" && "flex-col items-center gap-3"
        )}
      >
        {index && (
          <span
            className={cn(
              "font-mono text-sm font-medium tabular-nums leading-6 text-accent-interactive",
              align === "center" && "text-xs"
            )}
          >
            {index}
          </span>
        )}
        <p className={cn("eyebrow mb-3", eyebrowClassName)}>{eyebrow}</p>
      </div>
      <h2 className="font-display text-4xl font-semibold tracking-tight text-text-primary md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-text-secondary leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}