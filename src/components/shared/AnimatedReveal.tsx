"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { Variant } from "framer-motion";
import { easeEmphasized, durationNormal, durationSlow } from "@/lib/animations";

// Directional offsets
const offsets: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

// Child fade-up used inside stagger containers
const childVariants: Record<string, Variant> = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationNormal / 1000, ease: easeEmphasized },
  },
};

// Stagger container
const staggerContainer: Record<string, Variant> = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

interface AnimatedRevealProps {
  children: React.ReactNode;
  stagger?: boolean;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  once?: boolean;
  margin?: string;
}

/**
 * AnimatedReveal, consistent scroll-reveal wrapper used by every section.
 *
 * - Non-stagger: fades + slides children in together
 * - Stagger: each direct child fades up individually with stagger delay
 * - Respects prefers-reduced-motion (instant reveal, no transforms)
 */
export function AnimatedReveal({
  children,
  stagger = false,
  direction = "up",
  className = "",
  once = true,
  margin = "-80px 0px",
}: AnimatedRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: margin as any });
  const prefersReduced = useReducedMotion();

  const offset = offsets[direction];
  const baseTransition = {
    duration: prefersReduced ? 0 : durationSlow / 1000,
    ease: easeEmphasized,
  };

  if (!stagger) {
    const variants: Record<string, Variant> = {
      hidden: {
        opacity: prefersReduced ? 1 : 0,
        x: prefersReduced ? 0 : offset.x,
        y: prefersReduced ? 0 : offset.y,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: baseTransition,
      },
    };

    return (
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  // Stagger: container + each child animates individually
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={childVariants}>{child}</motion.div>
          ))
        : (
            <motion.div variants={childVariants}>{children}</motion.div>
          )}
    </motion.div>
  );
}
