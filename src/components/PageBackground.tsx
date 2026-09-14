'use client';

import { useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';

export default function PageBackground() {
  const glowRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let raf = 0;
    let prevY = 0;

    const update = () => {
      const y = scrollY.get();
      if (Math.abs(y - prevY) > 0.5) {
        // Scroll progress 0 to 1 over 3000px of scroll
        const progress = Math.min(y / 3000, 1);
        const centerY = 30 + progress * 25; // 30% → 55%
        el.style.background = `radial-gradient(ellipse 70% 60% at 50% ${centerY}%, rgba(6,182,212,0.06) 0%, transparent 70%)`;
        prevY = y;
      }
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [scrollY]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {/* Base: deep dark surface */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--surface-base)' }}
      />

      {/* Scroll-driven radial glow */}
      <div ref={glowRef} className="absolute inset-0" />

      {/* Static secondary glow, bottom right for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 80% 70%, rgba(6,182,212,0.03) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
