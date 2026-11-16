import type Lenis from "lenis";

/** Room left above an anchor marked to clear the header. */
const GAP = 16;

/**
 * How far down the header reaches over the anchor's column: the lowest of the
 * logo, links and buttons that overlap it horizontally. On a wide screen the
 * logo and links sit either side of a centred block and nothing overlaps (0);
 * on a phone or a narrow laptop they do.
 */
const headerOver = (block: HTMLElement) => {
  const box = block.getBoundingClientRect();
  let bottom = 0;
  document.querySelectorAll<HTMLElement>("header a, header button").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > box.left && r.left < box.right) bottom = Math.max(bottom, r.bottom);
  });
  return bottom;
};

/**
 * Scrolls to an in-page anchor. Most anchors stop at the very top. One marked
 * data-anchor="clear-header" stops as high as it can without the header
 * covering its first child (the block people are meant to see).
 */
export const scrollToAnchor = (target: HTMLElement, lenis?: Lenis) => {
  const block = (target.firstElementChild as HTMLElement | null) ?? target;
  const offset = target.dataset.anchor === "clear-header" ? -(headerOver(block) + GAP) : 0;
  if (lenis) lenis.scrollTo(target, { duration: 1.4, offset });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
};
