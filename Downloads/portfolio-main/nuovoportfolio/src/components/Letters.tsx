import { Box, BoxProps } from "@chakra-ui/react";

type LettersProps = {
  text: string;
  isInView: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  ease?: string;
  letterProps?: BoxProps;
};

/** Each character rises out of its own mask, one after the other. */
export const Letters = ({
  text,
  isInView,
  delay = 0,
  stagger = 0.03,
  duration = 0.7,
  ease = "cubic-bezier(0.16, 1, 0.3, 1)",
  letterProps,
}: LettersProps) => (
  <>
    {text.split("").map((char, i) => (
      <Box key={i} as="span" display="inline-block" overflow="hidden" verticalAlign="bottom" {...letterProps}>
        <Box
          as="span"
          display="inline-block"
          transform={`translateY(${isInView ? "0%" : "110%"})`}
          transition={`transform ${duration}s ${ease} ${delay + i * stagger}s`}
        >
          {char === " " ? " " : char}
        </Box>
      </Box>
    ))}
  </>
);

/** When the last letter of `Letters` starts moving. */
export const lettersDelay = (length: number, delay = 0, stagger = 0.03) => delay + length * stagger;
