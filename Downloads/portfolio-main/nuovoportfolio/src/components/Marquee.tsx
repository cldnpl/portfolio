import { Flex, Heading } from "@chakra-ui/react";
import { useAnimationFrame, useScroll, useSpring, useVelocity } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

const CONFIG = {
  SPEED_ON_HOVER: 0.2,
  FONT_SIZE_MULTIPLIER: 1.2,
  VIEWPORT_OFFSET: 300,
  MOBILE_BREAKPOINT: 768,
  MOBILE_SPEED_FACTOR: 0.45,
};

type MarqueeProps = { text: string; baseVelocity?: number; totalMarquees?: number };

/**
 * One endless line of the hero. Speed eases toward `baseVelocity` (px/s),
 * drops to a crawl under the pointer, and the direction follows the last
 * scroll direction.
 */
export const Marquee = ({ text, baseVelocity = 50, totalMarquees = 1 }: MarqueeProps) => {
  const [copies, setCopies] = useState(1);
  const measure = useRef<HTMLHeadingElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const itemWidth = useRef(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const speed = useSpring(baseVelocity, { damping: 40, stiffness: 90 });
  const { width } = useWindowSize();

  const velocity = baseVelocity * (width < CONFIG.MOBILE_BREAKPOINT ? CONFIG.MOBILE_SPEED_FACTOR : 1);
  const fontSize = `calc((100vh - ${CONFIG.VIEWPORT_OFFSET}px) / ${totalMarquees} * ${CONFIG.FONT_SIZE_MULTIPLIER})`;

  useEffect(() => {
    speed.set(velocity);
  }, [velocity, speed]);

  useEffect(() => {
    const update = () => {
      if (!measure.current) return;
      const w = measure.current.getBoundingClientRect().width;
      itemWidth.current = w;
      setCopies(Math.ceil(width / w) + 2);
      offset.current = 0;
    };
    update();
    // Measured before Humane arrived, the line would be too short to loop.
    let cancelled = false;
    document.fonts?.ready.then(() => !cancelled && update());
    return () => {
      cancelled = true;
    };
  }, [width]);

  useAnimationFrame((_, delta) => {
    const v = scrollVelocity.get();
    if (v < 0) direction.current = -1;
    else if (v > 0) direction.current = 1;

    offset.current -= speed.get() * (delta / 1000) * direction.current;
    const w = itemWidth.current;
    if (w > 0) {
      while (offset.current < -w) offset.current += w;
      while (offset.current > 0) offset.current -= w;
    }
    if (track.current) track.current.style.transform = `translate3d(${offset.current}px, 0, 0)`;
  });

  return (
    <Flex
      position="relative"
      overflow="hidden"
      onMouseOver={() => speed.set(CONFIG.SPEED_ON_HOVER)}
      onMouseLeave={() => speed.set(velocity)}
    >
      <Heading size="h1" fontSize={fontSize} ref={measure} visibility="hidden" position="absolute">
        {text}
      </Heading>
      <Flex ref={track} style={{ willChange: "transform" }}>
        {Array.from({ length: copies }).map((_, i) => (
          <Heading key={i} size="h1" fontSize={fontSize} flexShrink={0}>
            {text}
          </Heading>
        ))}
      </Flex>
    </Flex>
  );
};
