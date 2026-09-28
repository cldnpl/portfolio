import { Text, TextProps } from "@chakra-ui/react";
import { Fragment, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// The pastel the words pass through before settling on their ink:
// azure → lilac → pink, drifting along the sentence (as on butter.video).
const PASTELS = ["#7cc4f2", "#c3a3f2", "#f29bd0"];
const WORDS_PER_HUE = 6;

const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(", ")})`;
};

const pastelFor = (index: number) => {
  const pos = (index / WORDS_PER_HUE) % PASTELS.length;
  const from = Math.floor(pos);
  return mix(PASTELS[from], PASTELS[(from + 1) % PASTELS.length], pos - from);
};

type HoloTextProps = TextProps & {
  text: string;
  /** "scrub": the reveal follows the scroll. "play": it runs once, when the text comes into view. */
  mode?: "scrub" | "play";
};

/**
 * Words start faint, blurred and tinted, then come into focus one after the
 * other and settle on the text colour. The font and colour are the ones of
 * the Text it renders; only the way it appears changes.
 */
export const HoloText = ({ text, mode = "scrub", ...rest }: HoloTextProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-holo-word]"));
      const ink = getComputedStyle(el).color;
      const mm = gsap.matchMedia();

      // Phones get a lighter blur: it is repainted on every scroll frame.
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", touch: "(hover: none), (max-width: 831px)" },
        (context) => {
          if (!context.conditions?.motion) return;
          const blur = context.conditions.touch ? 5 : 12;
          gsap.set(spans, { opacity: 0.12, filter: `blur(${blur}px)`, color: (i: number) => pastelFor(i) });
          const step = mode === "scrub" ? 0.12 : 0.035;
          const tl = gsap.timeline(
            mode === "scrub"
              ? { scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 55%", scrub: 0.8 } }
              : { scrollTrigger: { trigger: el, start: "top 85%", once: true } },
          );
          spans.forEach((span, i) => {
            const at = i * step;
            tl.to(
              span,
              {
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.6,
                ease: "power2.out",
                // a settled word drops its filter entirely, so it paints like plain text
                onComplete: () => gsap.set(span, { filter: "none" }),
              },
              at,
            );
            tl.to(span, { color: ink, duration: 0.6, ease: "power1.inOut" }, at + 0.45);
          });
          return () => gsap.set(spans, { clearProps: "opacity,filter,color" });
        },
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [text, mode] },
  );

  return (
    <Text ref={ref} {...rest}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {/* no will-change: one GPU layer per word is what made phones stutter */}
          <span data-holo-word="" style={{ display: "inline-block" }}>
            {word}
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Text>
  );
};
