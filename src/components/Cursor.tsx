"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function Cursor() {
  const [hovering, setHovering] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 220, damping: 22, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 220, damping: 22, mass: 0.5 });

  useEffect(() => {
    const move = (event: PointerEvent) => {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as Element | null;
      setHovering(
        Boolean(
          target?.closest(
            'a, button, [role="button"], select, summary, [data-cursor]'
          )
        )
      );
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [dotX, dotY]);

  return (
    <>
      {/* Center dot */}
      <motion.div
        aria-hidden="true"
        className="cursor-fine-only pointer-events-none fixed left-0 top-0 z-[400] mix-blend-difference"
        style={{ x: dotX, y: dotY }}
      >
        <div className="-ml-[2px] -mt-[2px] h-1 w-1 rounded-full bg-white" />
      </motion.div>

      {/* Lerping crosshair ring */}
      <motion.div
        aria-hidden="true"
        className="cursor-fine-only pointer-events-none fixed left-0 top-0 z-[400] mix-blend-difference"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          animate={{
            scale: hovering ? 1.6 : 1,
            opacity: hovering ? 1 : 0.5,
          }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="-ml-[13px] -mt-[13px] h-[26px] w-[26px]"
        >
          <i className="absolute left-1/2 top-0 h-[9px] w-px -translate-x-1/2 bg-white" />
          <i className="absolute bottom-0 left-1/2 h-[9px] w-px -translate-x-1/2 bg-white" />
          <i className="absolute left-0 top-1/2 h-px w-[9px] -translate-y-1/2 bg-white" />
          <i className="absolute right-0 top-1/2 h-px w-[9px] -translate-y-1/2 bg-white" />
        </motion.div>
      </motion.div>
    </>
  );
}