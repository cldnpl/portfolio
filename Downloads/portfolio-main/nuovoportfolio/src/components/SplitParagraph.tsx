import { Text, TextProps } from "@chakra-ui/react";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/** Paragraph whose lines rise out of a mask the first time it scrolls in. */
export const SplitParagraph = ({ text, ...rest }: TextProps & { text: string }) => {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 100,
            duration: 0.5,
            ease: "power1.inOut",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          }),
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Text ref={ref} variant="paragraph" {...rest}>
      {text}
    </Text>
  );
};
