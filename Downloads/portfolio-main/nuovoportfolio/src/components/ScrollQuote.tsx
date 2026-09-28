import { Text } from "@chakra-ui/react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { rem } from "@/theme/rem";

const MotionSpan = motion.span;

const words = (text: string) => text.split(/\s+/).filter((word) => word.length > 0);

/** Each word brightens from 10% to full as the paragraph crosses the centre. */
export const ScrollQuote = ({ text }: { text: string }) => {
  const list = words(text);
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  return (
    <Text
      as="p"
      ref={ref}
      fontFamily="body"
      fontWeight="medium"
      textTransform="none"
      fontSize={`clamp(${rem(22)}, 2.2vw + 0.75rem, ${rem(48)})`}
      lineHeight="shorter"
      letterSpacing="-0.015em"
      textAlign="center"
      maxW={{ base: "100%", md: "90%", lg: "80%" }}
      mx="auto"
    >
      {list.map((word, i) => (
        <Word key={i} progress={scrollYProgress} index={i} total={list.length} word={word} />
      ))}
    </Text>
  );
};

type WordProps = { progress: MotionValue<number>; index: number; total: number; word: string };

const Word = ({ progress, index, total, word }: WordProps) => {
  const start = 0.8 * (total > 1 ? index / (total - 1) : 0);
  const end = Math.min(0.8 * (total > 1 ? (index + 1) / (total - 1) : 1) + 0.2, 1);
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  return <MotionSpan style={{ opacity }}>{word} </MotionSpan>;
};
