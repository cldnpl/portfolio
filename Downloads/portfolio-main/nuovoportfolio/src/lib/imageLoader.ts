/**
 * next/image loader for the static export: picks the pre-built copy of an
 * image (scripts/prepare-images.py writes name-640/1200/1800.webp next to
 * every name.webp) that is at least as wide as the slot asks for.
 */
const WIDTHS = [640, 1200, 1800];
const HAS_VARIANTS = /^\/images\/(work\/.+|about\/.+|portrait|marble)\.webp$/;

export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (!HAS_VARIANTS.test(src)) return `${src}?w=${width}`;
  const w = WIDTHS.find((candidate) => candidate >= width);
  return w ? src.replace(/\.webp$/, `-${w}.webp`) : src;
}
