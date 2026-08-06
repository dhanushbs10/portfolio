import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string | ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  eyebrowClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  eyebrowClassName,
}: SectionHeadingProps) {
  const isSysLabel = eyebrow?.startsWith("[") && eyebrow?.endsWith("]");
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        isSysLabel ? (
          <p className={cn("sys-label mb-3", eyebrowClassName)}>{eyebrow}</p>
        ) : (
          <p className="mono-label text-accent-interactive mb-3">{eyebrow}</p>
        )
      )}
      <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
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
