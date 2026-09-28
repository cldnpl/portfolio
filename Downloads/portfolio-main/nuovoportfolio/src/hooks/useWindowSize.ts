import { useEffect, useRef, useState } from "react";

const read = () =>
  typeof window === "undefined"
    ? { width: Infinity, height: Infinity }
    : { width: window.innerWidth, height: window.innerHeight };

/** Window size, updated at most once per animation frame. */
export const useWindowSize = () => {
  const frame = useRef(0);
  const [size, setSize] = useState(read);

  useEffect(() => {
    const onResize = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => setSize(read()));
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
};
