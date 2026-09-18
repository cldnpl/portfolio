import { useEffect, useState } from "react";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Counts a numeric string up to its final value once `active` flips true.
 * Non-numeric parts ("110/110", "1×") are preserved: only the digits move.
 */
export function useCountUp(value: string, active: boolean, duration = 1600) {
  const [display, setDisplay] = useState(() => value.replace(/\d/g, "0"));
  /** True once the number has landed — the cue for anything that follows it. */
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (prefersReduced()) {
      setDisplay(value);
      setSettled(true);
      return;
    }

    const numbers = value.match(/\d+/g);
    if (!numbers) {
      setDisplay(value);
      setSettled(true);
      return;
    }

    const targets = numbers.map(Number);
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutExpo — fast, then a long settle. Reads as precision, not as a slot machine.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

      let i = 0;
      setDisplay(value.replace(/\d+/g, () => String(Math.round(targets[i++] * eased))));

      if (t < 1) frame = requestAnimationFrame(tick);
      else setSettled(true);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value, duration]);

  return { display, settled };
}
