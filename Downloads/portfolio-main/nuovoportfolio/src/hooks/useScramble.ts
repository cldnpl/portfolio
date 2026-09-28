import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

type Options = { speed?: number; tick?: number; delay?: number };

/**
 * Decodes `text` left to right while `active`: every `speed` ms the revealed
 * prefix grows by `tick` characters and the rest is random glyphs. Stopping
 * midway leaves the text where it was, exactly like the reference.
 */
export const useScramble = (text: string, active: boolean, options: Options = {}) => {
  const { speed = 30, tick = 0.6, delay = 0 } = options;
  const [output, setOutput] = useState(text);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (!active) return;
    let progress = 0;
    const run = () => {
      interval = setInterval(() => {
        const revealed = Math.floor((progress += tick));
        if (revealed >= text.length) {
          setOutput(text);
          clearInterval(interval);
          return;
        }
        setOutput(
          text
            .split("")
            .map((char, i) =>
              char === " " ? " " : i < revealed ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(""),
        );
      }, speed);
    };
    if (delay > 0) {
      const timeout = setTimeout(run, delay);
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
    run();
    return () => clearInterval(interval);
  }, [text, active, speed, tick, delay]);

  return output;
};
