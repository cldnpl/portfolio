import { Box, BoxProps, Text } from "@chakra-ui/react";
import { useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { MotionBox } from "@/components/MotionBox";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export type PhotoData = { src: string; alt: string; ratio: string; caption: string };

type PhotoProps = BoxProps & { photo: PhotoData; sizes: string };

/**
 * A photo that wipes up into view (like the next-project cover), drifts a
 * little against the scroll, and carries a small caption.
 */
export const Photo = ({ photo, sizes, ...rest }: PhotoProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <Box as="figure" ref={ref} m={0} {...rest}>
      <Box
        position="relative"
        aspectRatio={photo.ratio}
        overflow="hidden"
        bg="blackAlpha.100"
        clipPath={isInView ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)"}
        style={{ transition: `clip-path 1.2s ${EASE} 0.1s` }}
      >
        <MotionBox position="absolute" top="-6%" left={0} right={0} height="112%" style={{ y }}>
          <Image src={photo.src} alt={photo.alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
        </MotionBox>
      </Box>
      <Text
        as="figcaption"
        variant="label"
        fontSize="xs"
        letterSpacing="0.2em"
        mt="space-12"
        opacity={isInView ? 1 : 0}
        transform={`translateY(${isInView ? 0 : 8}px)`}
        transition={`all 0.7s ${EASE} 0.4s`}
      >
        {photo.caption}
      </Text>
    </Box>
  );
};
