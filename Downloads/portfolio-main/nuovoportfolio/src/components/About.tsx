import { Box, Container, Flex, Heading } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { Fragment, Ref, useRef } from "react";
import { Section } from "@/components/Section";
import { HoloText } from "@/components/HoloText";
import { Photo } from "@/components/Photo";
import type { aboutData } from "@/data/site";
import { useScramble } from "@/hooks/useScramble";

type AboutProps = { id: string; data: typeof aboutData; sectionRef?: Ref<HTMLDivElement> };

export const About = ({ id, data, sectionRef }: AboutProps) => {
  const { heading, content, photo } = data;
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
        </Flex>
      </Container>
      <Container mb={{ base: "space-40", md: "space-64" }}>
        <Heading ref={ref} fontFamily="body" fontSize="clamp(2rem, 6vw + 1rem, 6rem)">
          {title}
        </Heading>
      </Container>
      {/* Paragraphs on the left, the Academy photo on the right, staying in view
          beside them. On a phone the photo sits under the Academy paragraph. */}
      <Container
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "minmax(0, 1.65fr) minmax(0, 1fr)" }}
        columnGap={{ md: "space-64" }}
        rowGap={{ base: "space-40", md: "space-48" }}
        alignItems="start"
        position="relative"
      >
        {content.map((paragraph, i) => (
          <Fragment key={i}>
            <HoloText
              variant="paragraph"
              text={paragraph}
              gridColumn={{ md: "1" }}
              fontSize={{ md: "clamp(1.5rem, 2.4vw, 2.5rem)" }}
            />
            {i === 1 && (
              <Box
                gridColumn={{ md: "2" }}
                gridRow={{ md: `1 / span ${content.length}` }}
                position={{ md: "sticky" }}
                top={{ md: "18vh" }}
              >
                <Photo photo={photo} sizes="(max-width: 832px) 100vw, 36vw" />
              </Box>
            )}
          </Fragment>
        ))}
      </Container>
    </Section>
  );
};
