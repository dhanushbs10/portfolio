"use client";

import { useEffect, useState } from "react";
import { TOOL_ICONS } from "@/lib/techIcons";

interface IconImageProps {
  name: string;
  width?: number;
  height?: number;
  className?: string;
}

export function IconImage({ name, width = 22, height = 22, className }: IconImageProps) {
  const meta = TOOL_ICONS[name];
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!meta) return;
    const slug = meta.slug;
    fetch(`/icons/${slug}.svg`)
      .then((r) => {
        if (!r.ok) throw new Error(`Icon not found: /icons/${slug}.svg (${r.status})`);
        return r.text();
      })
      .then((text) => {
        // Wrap path elements so they inherit color via CSS
        const colored = text.replace(/<path /g, '<path fill="currentColor" ');
        setSvg(colored);
      })
      .catch((err) => {
        console.warn(err.message ?? err);
        setSvg(null);
      });
  }, [meta]);

  if (!meta || !svg) return null;

  return (
    <span
      className={`inline-flex items-center justify-center ${className ?? ""}`}
      style={{ color: meta.color, width, height }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
