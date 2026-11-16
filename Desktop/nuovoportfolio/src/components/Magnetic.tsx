import { motion, useMotionValue, useSpring } from "framer-motion";
import { MouseEvent, ReactNode, useCallback, useRef } from "react";

const spring = { stiffness: 150, damping: 15, mass: 0.1 };

/** Pulls its child toward the pointer while hovered, springs back on leave. */
export const Magnetic = ({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  const onEnter = useCallback(() => {
    if (ref.current) rect.current = ref.current.getBoundingClientRect();
  }, []);

  const onMove = useCallback(
    (event: MouseEvent) => {
      const box = rect.current;
      if (!box) return;
      x.set((event.clientX - (box.left + box.width / 2)) * strength);
      y.set((event.clientY - (box.top + box.height / 2)) * strength);
    },
    [x, y, strength],
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    rect.current = null;
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: springX, y: springY, display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
};
