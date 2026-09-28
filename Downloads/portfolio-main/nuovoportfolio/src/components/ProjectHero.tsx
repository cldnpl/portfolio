import { Box, Container, Flex, Grid, Heading, Link, Text } from "@chakra-ui/react";
import { useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { HoloText } from "@/components/HoloText";
import { Letters, lettersDelay } from "@/components/Letters";
import type { Project } from "@/data/projects";
import { rem } from "@/theme/rem";
import { legible } from "@/theme/legible";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const Detail = ({ label, value, isInView, delay }: { label: string; value: string; isInView: boolean; delay: number }) => (
  <Box
    opacity={isInView ? 1 : 0}
    transform={`translateY(${isInView ? 0 : 16}px)`}
    transition={`all 0.7s ${EASE} ${delay}s`}
  >
    <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.2em" mb="space-8" sx={legible}>
      {label}
    </Text>
    <Text fontSize="sm" fontWeight="medium" letterSpacing="0.04em" sx={legible}>
      {value}
    </Text>
  </Box>
);

export const ProjectHero = ({ project }: { project: Project }) => {
  const { title, year, platforms, roles, status, additionalDescription, url, appStore } = project;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const lettersDone = lettersDelay(title.length, 0.5, 0.03);
  const base = useMemo(() => lettersDone + 0.15, [lettersDone]);

  return (
    <Box ref={ref} minH="100vh" display="flex" flexDir="column" justifyContent="flex-end" overflow="hidden">
      <Container>
        <Heading
          as="h1"
          fontFamily="heading"
          fontWeight="bold"
          textTransform="uppercase"
          fontSize={`clamp(${rem(64)}, 14vw, ${rem(220)})`}
          lineHeight="compact"
          letterSpacing="-0.02em"
          mb={{ base: "space-32", md: "space-48" }}
          aria-label={title}
        >
          <Letters text={title} isInView={isInView} delay={0.5} stagger={0.03} />
        </Heading>
        <Box
          h="1px"
          bg="blackAlpha.200"
          mb={{ base: "space-24", md: "space-40" }}
          transform={`scaleX(${isInView ? 1 : 0})`}
          transformOrigin="left"
          transition={`transform 1s ${EASE} ${base}s`}
        />
        <Flex
          flexDir={{ base: "column", md: "row" }}
          justifyContent="space-between"
          gap={{ base: "space-32", md: "space-48" }}
          alignItems={{ md: "flex-start" }}
        >
          {/* four columns on desktop; two by two on a phone, where four do not fit */}
          <Grid
            templateColumns={{ base: "repeat(2, minmax(0, 1fr))", md: "repeat(4, auto)" }}
            columnGap={{ base: "space-24", md: "space-64" }}
            rowGap="space-24"
            flexShrink={0}
          >
            {year && <Detail label="Year" value={year} isInView={isInView} delay={base + 0.15} />}
            {platforms && (
              <Detail label="Platform" value={platforms.join(" & ")} isInView={isInView} delay={base + 0.2} />
            )}
            {roles && <Detail label="Role" value={roles.join(" & ")} isInView={isInView} delay={base + 0.25} />}
            {status && <Detail label="Status" value={status} isInView={isInView} delay={base + 0.3} />}
          </Grid>
          {additionalDescription && (
            <Box
              maxW={{ base: "100%", md: "45%" }}
              opacity={isInView ? 1 : 0}
              transform={`translateY(${isInView ? 0 : 16}px)`}
              transition={`all 0.7s ${EASE} ${base + 0.35}s`}
            >
              <HoloText
                mode="play"
                text={additionalDescription}
                fontSize={`clamp(${rem(14)}, 1.2vw, ${rem(17)})`}
                lineHeight="tall"
                fontWeight="normal"
                sx={legible}
              />
              {appStore && (
                <Link
                  href={appStore}
                  isExternal
                  display="inline-block"
                  mt="space-24"
                  _after={{ display: "none" }}
                  _hover={{ opacity: 0.8 }}
                  transition="opacity 0.2s ease"
                  aria-label={`Download ${title} on the App Store`}
                >
                  {/* Apple's official badge, black, from its marketing tools */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/badges/app-store.svg" alt="Download on the App Store" width={150} height={50} style={{ height: 50, width: "auto" }} />
                </Link>
              )}
              {!appStore && url && (
                <Link
                  href={url}
                  isExternal
                  display="inline-block"
                  mt="space-24"
                  fontSize="xs"
                  fontWeight="medium"
                  textTransform="uppercase"
                  letterSpacing="0.15em"
                  color="black"
                  textDecoration="underline"
                  _hover={{ opacity: 0.6 }}
                  transition="opacity 0.2s ease"
                >
                  See Project
                </Link>
              )}
            </Box>
          )}
        </Flex>
      </Container>
    </Box>
  );
};
