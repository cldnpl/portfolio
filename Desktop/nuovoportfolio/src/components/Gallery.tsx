import { Box, Flex } from "@chakra-ui/react";
import { useMotionTemplate, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { MotionBox } from "@/components/MotionBox";
import { Section } from "@/components/Section";
import type { GalleryItem, GalleryRow } from "@/data/projects";

const ParallaxImage = ({ item, sizes }: { item: GalleryItem; sizes: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const shift = useTransform(scrollYProgress, [0, 1], [-7, 7]);
  const transform = useMotionTemplate`translate3d(0, ${shift}%, 0)`;

  return (
    <Box ref={ref} position="relative" flex="1" aspectRatio={item.ratio} width="100%" overflow="hidden">
      <MotionBox
        position="absolute"
        top="-10%"
        left={0}
        right={0}
        height="120%"
        style={{ transform, willChange: "transform" }}
      >
        <Image src={item.src} alt={item.alt ?? ""} fill sizes={sizes} style={{ objectFit: "cover" }} />
      </MotionBox>
    </Box>
  );
};

export const Gallery = ({ rows }: { rows: GalleryRow[] }) => {
  if (!rows?.length) return null;
  return (
    <Section spacingTop="large" spacingBottom="extraLarge">
      <Flex flexDir="column" gap={{ base: "space-24", md: "space-48" }}>
        {rows.map((row, i) => {
          const sizes = row.items.length > 1 ? "(max-width: 768px) 100vw, 50vw" : "100vw";
          return (
            <Flex key={i} flexDir={{ base: "column", md: "row" }} gap={{ base: "space-24", md: "space-48" }}>
              {row.items.map((item, j) => (
                <ParallaxImage key={j} item={item} sizes={sizes} />
              ))}
            </Flex>
          );
        })}
      </Flex>
    </Section>
  );
};
