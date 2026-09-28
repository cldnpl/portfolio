import { Box, Flex, Text } from "@chakra-ui/react";
import { useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

export type Platform = { name: string; logo: string; width: number; height: number };

// butter.video's strip: ~146 CSS px/s at 1710px wide.
const SPEED = 146;

type PlatformStripProps = { caption: string; platforms: Platform[] };

/**
 * A caption and a row of platform logos gliding left forever, as under
 * butter.video's hero. The set is repeated until it overflows the screen,
 * and the track wraps by exactly one set width so the loop has no seam.
 */
export const PlatformStrip = ({ caption, platforms }: PlatformStripProps) => {
  const setRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const setWidth = useRef(0);
  const [copies, setCopies] = useState(4);
  const { width } = useWindowSize();

  useEffect(() => {
    const measure = () => {
      const w = setRef.current?.getBoundingClientRect().width ?? 0;
      if (!w) return;
      setWidth.current = w;
      setCopies(Math.max(2, Math.ceil(width / w) + 1));
    };
    measure();
    const images = Array.from(setRef.current?.querySelectorAll("img") ?? []);
    images.forEach((img) => img.addEventListener("load", measure));
    return () => images.forEach((img) => img.removeEventListener("load", measure));
  }, [width]);

  useAnimationFrame((_, delta) => {
    const w = setWidth.current;
    if (!w || !trackRef.current) return;
    offset.current -= SPEED * (Math.min(delta, 64) / 1000);
    if (offset.current <= -w) offset.current += w;
    trackRef.current.style.transform = `translate3d(${offset.current}px, 0, 0)`;
  });

  const set = (key: number, ref?: React.Ref<HTMLDivElement>) => (
    <Flex key={key} ref={ref} flexShrink={0} alignItems="center" aria-hidden={key > 0 || undefined}>
      {platforms.map((p) => (
        <Box key={p.name} flexShrink={0} px={{ base: "space-24", md: "space-40" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.logo}
            alt={key === 0 ? p.name : ""}
            width={p.width}
            height={p.height}
            style={{ height: "var(--logo-h)", width: "auto", display: "block" }}
          />
        </Box>
      ))}
    </Flex>
  );

  return (
    <Box
      as="section"
      aria-label={caption}
      mb={{ base: "space-120", md: "space-188" }}
      sx={{ "--logo-h": { base: "22px", md: "30px" } }}
    >
      <Text
        textAlign="center"
        fontSize={{ base: "xs", md: "sm" }}
        color="blackAlpha.600"
        mb={{ base: "space-20", md: "space-32" }}
        px="space-16"
      >
        {caption}
      </Text>
      <Box overflow="hidden">
        <Flex ref={trackRef} width="max-content" style={{ willChange: "transform" }}>
          {Array.from({ length: copies }, (_, i) => set(i, i === 0 ? setRef : undefined))}
        </Flex>
      </Box>
    </Box>
  );
};
