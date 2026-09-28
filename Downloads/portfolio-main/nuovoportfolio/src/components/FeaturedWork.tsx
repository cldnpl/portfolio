import { Box, Flex, Heading, Text, useBreakpointValue } from "@chakra-ui/react";
import { useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { MotionBox } from "@/components/MotionBox";
import { ProjectItem } from "@/components/ProjectItem";
import { Section } from "@/components/Section";
import type { featuredData } from "@/data/site";
import { useScramble } from "@/hooks/useScramble";
import { legible } from "@/theme/legible";

/** How much of the heading is left once the phones scroll over it (phones only). */
const MOBILE_REST_OPACITY = 0.12;

export const FeaturedWork = ({ id, data }: { id: string; data: typeof featuredData }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const inView = useInView(headingRef, { once: false, margin: "0px 0px -40% 0px" });
  const { heading, subHeading, projects } = data;
  const title = useScramble(heading, inView);

  // On a phone there is no hover to clear the heading, and the projects scroll
  // straight over it: once it has appeared, it fades into the background as
  // the first project comes up, and stays there, faint. Desktop is unchanged.
  const isPhone = useBreakpointValue({ base: true, md: false }) ?? false;
  const { scrollYProgress } = useScroll({ target: projectsRef, offset: ["start 90%", "start 45%"] });
  const fade = useTransform(scrollYProgress, [0, 1], [1, MOBILE_REST_OPACITY]);

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
        <MotionBox
          display="flex"
          flexDir="column"
          alignItems="center"
          style={{ opacity: isPhone ? fade : 1 }}
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
        </MotionBox>
      </Flex>
      <Box ref={projectsRef} position="relative" zIndex="projectSection">
        {projects.map((project, i) => (
          <ProjectItem key={i} project={project} index={i} onHoverChange={setHovered} />
        ))}
      </Box>
    </Section>
  );
};
