import { Box, Grid, Text } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { HoloText } from "@/components/HoloText";
import { Section } from "@/components/Section";
import type { OverviewItem } from "@/data/projects";
import { rem } from "@/theme/rem";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const Row = ({ item, index }: { item: OverviewItem; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <Grid
      ref={ref}
      templateColumns={{ base: "1fr", md: "minmax(0, 1fr) minmax(0, 2fr)" }}
      columnGap="space-48"
      rowGap="space-16"
      py={{ base: "space-32", md: "space-48" }}
      borderTop="1px solid"
      borderColor="blackAlpha.200"
    >
      <Text
        variant="label"
        fontSize="xs"
        letterSpacing="0.2em"
        opacity={isInView ? 1 : 0}
        transform={`translateY(${isInView ? 0 : 12}px)`}
        transition={`all 0.7s ${EASE} ${index * 0.05}s`}
      >
        ({item.label})
      </Text>
      <HoloText
        mode="play"
        text={item.text}
        fontSize={`clamp(${rem(18)}, 1.7vw, ${rem(28)})`}
        lineHeight="short"
        fontWeight="normal"
      />
    </Grid>
  );
};

/** What the app is for, the problem it solves, what it does, and my part in it. */
export const ProjectOverview = ({ items }: { items?: OverviewItem[] }) => {
  if (!items?.length) return null;
  return (
    <Section spacingTop="large">
      <Box borderBottom="1px solid" borderColor="blackAlpha.200">
        {items.map((item, i) => (
          <Row key={item.label} item={item} index={i} />
        ))}
      </Box>
    </Section>
  );
};
