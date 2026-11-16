import { HoloText } from "@/components/HoloText";
import { rem } from "@/theme/rem";

/** The manifesto: its words come into focus one by one as it scrolls through. */
export const ScrollQuote = ({ text }: { text: string }) => (
  <HoloText
    as="p"
    text={text}
    fontFamily="body"
    fontWeight="medium"
    textTransform="none"
    fontSize={`clamp(${rem(22)}, 2.2vw + 0.75rem, ${rem(48)})`}
    lineHeight="shorter"
    letterSpacing="-0.015em"
    textAlign="center"
    maxW={{ base: "100%", md: "90%", lg: "80%" }}
    mx="auto"
  />
);
