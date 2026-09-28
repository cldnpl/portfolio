import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

/** Slides its content up out of a mask when revealed (desktop only). */
export const RevealLine = ({
  children,
  isRevealed,
  delay = 0,
}: {
  children: ReactNode;
  isRevealed: boolean;
  delay?: number;
}) => (
  <Box overflow="hidden">
    <Box
      transform={{ base: "translateY(0%)", md: isRevealed ? "translateY(0%)" : "translateY(100%)" }}
      style={{ transition: `transform 1.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s` }}
    >
      {children}
    </Box>
  </Box>
);
