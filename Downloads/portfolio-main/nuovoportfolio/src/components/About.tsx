import { Container, Flex, Heading, Text } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { Ref, useRef } from "react";
import { Section } from "@/components/Section";
import { SplitParagraph } from "@/components/SplitParagraph";
import type { aboutData } from "@/data/site";
import { useScramble } from "@/hooks/useScramble";

type AboutProps = { id: string; data: typeof aboutData; sectionRef?: Ref<HTMLDivElement> };

export const About = ({ id, data, sectionRef }: AboutProps) => {
  const { heading, content } = data;
  const ref = useRef<HTMLHeadingElement>(null);
  const title = useScramble(heading, useInView(ref, { once: false, margin: "0px 0px -40% 0px" }));

  return (
    <Section ref={sectionRef} id={id} isFullScreen>
      <Container>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb={{ base: "space-40", md: "space-64" }}
          borderBottom="1px solid"
          borderColor="blackAlpha.200"
          pb="space-16"
        >
          <Text variant="label" letterSpacing="0.2em">
            (01)
          </Text>
        </Flex>
      </Container>
      <Container mb={{ base: "space-40", md: "space-64" }}>
        <Heading ref={ref} fontFamily="body" fontSize="clamp(2rem, 6vw + 1rem, 6rem)">
          {title}
        </Heading>
      </Container>
      <Container display="flex" flexDir="column" gap={{ base: "space-40", md: "space-64" }} position="relative">
        {content.map((paragraph, i) => (
          <SplitParagraph key={i} text={paragraph} alignSelf={i % 2 === 1 ? { md: "flex-end" } : undefined} />
        ))}
      </Container>
    </Section>
  );
};
