import { Box } from "@chakra-ui/react";
import { MotionValue, useScroll, useTransform } from "framer-motion";
import { RefObject } from "react";
import { MotionBox } from "@/components/MotionBox";
import { MARBLE_OPACITY } from "@/data/site";

const Slab = ({ opacity, id }: { opacity?: MotionValue<number> | number; id?: string }) => (
  <MotionBox id={id} aria-hidden position="fixed" inset={0} zIndex={-1} pointerEvents="none" style={{ opacity }}>
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100lvh"
      bgImage={{ base: "url(/images/marble-1200.webp)", md: "url(/images/marble.webp)" }}
      bgSize="cover"
      bgPosition="center"
    />
  </MotionBox>
);

export const MARBLE_ID = "site-marble";

/** Whole site: fixed behind every page, faint; the footer fades it out (by id). */
export const MarbleBackground = () => <Slab id={MARBLE_ID} opacity={MARBLE_OPACITY} />;

/**
 * Hero only: fades to the white page as `fadeOn` (the About section) comes in,
 * gone by the time its top reaches the middle of the screen.
 */
export const HeroMarble = ({ fadeOn }: { fadeOn: RefObject<HTMLElement> }) => {
  const { scrollYProgress } = useScroll({ target: fadeOn, offset: ["start end", "start center"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [MARBLE_OPACITY, 0]);
  return <Slab opacity={opacity} />;
};
