"use client";

import { useScroll, useTransform, motion } from "framer-motion";

/**
 * ScrollBackground, a fixed-position gradient/canvas that shifts
 * color intensity as the user scrolls. All sections share this one
 * background layer so the page feels continuous rather than
 * "stack of isolated cards."
 */
export function ScrollBackground() {
  const { scrollY } = useScroll();

  const gradientA = useTransform(scrollY, [0, 1200], [
    "hsl(220 15% 5%)",
    "hsl(220 15% 8%)",
  ]);

  const gradientB = useTransform(scrollY, [0, 800, 1600], [
    "hsl(220 35% 13%)",
    "hsl(220 12% 6%)",
    "hsl(220 12% 6%)",
  ]);

  return (
    <motion.div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${gradientB}, transparent),
                     radial-gradient(ellipse 120% 100% at 50% -10%, ${gradientA}, transparent)`,
      }}
    />
  );
}
