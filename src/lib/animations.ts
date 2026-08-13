/**
 * Motion tokens, standard easing curves + durations.
 * Every Framer Motion / GSAP call should reference these constants
 * instead of inventing new values per component.
 */

// ── Easing curves ──────────────────────────────────────────
export const easeStandard = [0.4, 0, 0.2, 1] as const; // Material "standard"
export const easeEmphasized = [0.16, 1, 0.3, 1] as const; // Decelerate, spring-like
export const easeDecelerate = [0, 0, 0.2, 1] as const;
export const easeAccelerate = [0.4, 0, 1, 1] as const;

// ── Durations (ms) ─────────────────────────────────────────
export const durationFast = 150;
export const durationNormal = 250;
export const durationSlow = 400;
export const durationSlower = 600;

// ── Re-export as Pre-composed transition objects ───────────
export const transitions = {
  fast: { duration: durationFast / 1000, ease: easeStandard },
  normal: { duration: durationNormal / 1000, ease: easeStandard },
  slow: { duration: durationSlow / 1000, ease: easeEmphasized },
  slower: { duration: durationSlower / 1000, ease: easeEmphasized },
} as const;

// ── Spring presets (for Framer Motion) ─────────────────────
export const springs = {
  gentle: { type: "spring", stiffness: 120, damping: 14, mass: 0.9 },
  default: { type: "spring", stiffness: 200, damping: 25, mass: 1 },
  snappy: { type: "spring", stiffness: 300, damping: 20, mass: 0.8 },
} as const;

// ── Stagger helpers ────────────────────────────────────────
export const staggerFast = 0.05;
export const staggerNormal = 0.1;
export const staggerSlow = 0.16;
