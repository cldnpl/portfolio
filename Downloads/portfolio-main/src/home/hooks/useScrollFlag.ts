import { useEffect, useState } from "react";

/** True once the page has scrolled past `offset` pixels. */
export function useScrollFlag(offset = 24) {
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const onScroll = () => setPassed(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return passed;
}
