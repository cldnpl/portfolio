import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ProjectItem } from "@/components/ProjectItem";
import { Section } from "@/components/Section";
import type { featuredData } from "@/data/site";
import { useScramble } from "@/hooks/useScramble";
import { legible } from "@/theme/legible";

export const FeaturedWork = ({ id, data }: { id: string; data: typeof featuredData }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [hovered, setHovered] = useState(false);
  const inView = useInView(headingRef, { once: false, margin: "0px 0px -40% 0px" });
  const { heading, subHeading, projects } = data;
  const title = useScramble(heading, inView);

  return (
    <Section ref={sectionRef} id={id} position="relative" spacingBottom="extraLarge" isFullScreen>
      <Flex
        position="sticky"
        top="0"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
      >
        <Heading
          ref={headingRef}
          fontFamily="body"
          fontSize="clamp(2rem, 6vw + 1rem, 6rem)"
          overflow="hidden"
          opacity={hovered ? 0 : 1}
          transition="opacity 0.4s ease"
        >
          {title}
        </Heading>
        <Text
          fontSize="xs"
          fontWeight="normal"
          letterSpacing="wider"
          textTransform="uppercase"
          mt="space-16"
          opacity={hovered ? 0 : 0.75}
          transition="opacity 0.4s ease"
          sx={legible}
        >
          {subHeading}
        </Text>
      </Flex>
      <Box position="relative" zIndex="projectSection">
        {projects.map((project, i) => (
          <ProjectItem key={i} project={project} index={i} onHoverChange={setHovered} />
        ))}
      </Box>
    </Section>
  );
};
