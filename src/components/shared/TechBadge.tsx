"use client";

import { cn } from "@/lib/utils";
import { IconImage } from "@/components/IconImage";

export function TechBadge({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded",
        "bg-surface-overlay border border-border-subtle",
        "font-mono text-[11px] text-text-secondary",
        className
      )}
    >
      <IconImage name={name} width={14} height={14} />
      {name}
    </span>
  );
}
