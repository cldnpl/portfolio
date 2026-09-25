import { useEffect, useState } from "react";

/** True once the page has scrolled past `offset` pixels. */
export function useScrollFlag(offset = 24) {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    // The answer is compared here, not handed to React to compare.
    // `setPassed(window.scrollY > offset)` on every scroll event asks React to
    // re-render the header a hundred times a second to arrive at the value it
    // already holds — it bails out before the children, but the component
    // itself runs, and it runs on the same thread as the scroll.
    let current = window.scrollY > offset;
    setPassed(current);

    const onScroll = () => {
      const next = window.scrollY > offset;
      if (next === current) return;
      current = next;
      setPassed(next);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return passed;
}
