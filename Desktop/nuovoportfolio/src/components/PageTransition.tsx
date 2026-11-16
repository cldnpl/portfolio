import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const ease = [0.215, 0.61, 0.355, 1];

const columnVariants = {
  initial: { top: 0 },
  enter: (i: number) => ({
    top: "100vh",
    transition: { duration: 0.4, delay: 0.05 * i, ease },
    transitionEnd: { height: "0", top: "0" },
  }),
  exit: (i: number) => ({
    height: "100vh",
    transition: { duration: 0.4, delay: 0.05 * i, ease },
  }),
};

/** Black columns that drop away on enter and fall back in on exit, staggered. */
export const PageTransition = ({ children }: { children: ReactNode }) => {
  const columns = useBreakpointValue({ base: 8, md: 12 }) ?? 12;
  return (
    <Box>
      <Flex height="100vh" width="100vw" position="fixed" top="0" left="0" pointerEvents="none" zIndex="loader">
        {Array.from({ length: columns }).map((_, i) => (
          <motion.div
            key={i}
            initial="initial"
            animate="enter"
            exit="exit"
            variants={columnVariants}
            custom={i}
            style={{ position: "relative", height: "100%", width: `${100 / columns}%`, background: "black" }}
          />
        ))}
      </Flex>
      {children}
    </Box>
  );
};
