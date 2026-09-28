import { Box, Circle, Text } from "@chakra-ui/react";
import { useUi } from "@/data/ui";
import { useScramble } from "@/hooks/useScramble";
import { useIntroStore } from "@/store/intro";

export const Availability = ({ status }: { status: boolean }) => {
  const rgb = status ? "34, 197, 94" : "249, 115, 22";
  const ui = useUi();
  const label = useScramble(status ? ui.openToWork : ui.unavailable, useIntroStore((s) => s.revealMeta));

  return (
    <Box data-intro="meta-item" display="flex" alignItems="center">
      <Circle
        size="8px"
        bg={status ? "green.500" : "orange.500"}
        marginRight="2"
        sx={{
          animation: status ? "pulse 2s infinite ease-out" : "none",
          "@keyframes pulse": {
            "0%": { boxShadow: `0 0 0 0 rgba(${rgb}, 0.7)` },
            "100%": { boxShadow: `0 0 0 10px rgba(${rgb}, 0)` },
          },
        }}
      />
      <Text as="span" variant="label">
        {label}
      </Text>
    </Box>
  );
};
